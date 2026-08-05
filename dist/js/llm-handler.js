(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/core/llm/sse.js
  function parseSseBlock(block) {
    if (typeof block !== "string") return null;
    const event = {};
    const data = [];
    block.split(/\r\n|\r|\n/).forEach(function(line) {
      if (!line || line.startsWith(":")) return;
      const separator = line.indexOf(":");
      const field = separator === -1 ? line : line.slice(0, separator);
      let value = separator === -1 ? "" : line.slice(separator + 1);
      if (value.startsWith(" ")) value = value.slice(1);
      if (field === "data") data.push(value);
      else if (field === "event") event.event = value;
      else if (field === "id") event.id = value;
      else if (field === "retry" && /^\d+$/.test(value)) event.retry = Number(value);
    });
    if (!data.length && !Object.keys(event).length) return null;
    event.data = data.join("\n");
    if (event.data === "[DONE]") event.done = true;
    return event;
  }
  function createSseParser() {
    let buffer = "";
    function drain(complete) {
      const events = [];
      let match;
      while (match = /(?:\r\n|\r|\n){2}/.exec(buffer)) {
        const block = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        const event = parseSseBlock(block);
        if (event) events.push(event);
      }
      if (complete && buffer.trim()) {
        const event = parseSseBlock(buffer);
        if (event) events.push(event);
        buffer = "";
      }
      return events;
    }
    return {
      push(chunk) {
        if (chunk == null || chunk === "") return [];
        buffer += String(chunk);
        return drain(false);
      },
      flush() {
        return drain(true);
      }
    };
  }

  // src/core/llm/client.js
  function createLlmClient({ transport, getProvider: getProvider2 } = {}) {
    if (!transport || typeof transport.post !== "function" || typeof transport.postStream !== "function") {
      throw new TypeError("A transport with post and postStream is required");
    }
    if (typeof getProvider2 !== "function") throw new TypeError("getProvider must be a function");
    const controllers = /* @__PURE__ */ new Map();
    let sequence = 0;
    function startRequest(request) {
      const requestId = request.requestId || `llm-${Date.now()}-${++sequence}`;
      const controller = new AbortController();
      controllers.set(requestId, controller);
      return { requestId, controller };
    }
    return {
      async complete(request) {
        const provider = getProvider2(request.providerId);
        const pending = startRequest(request);
        try {
          const outgoing = provider.buildRequest({ ...request, stream: false });
          const response = await transport.post({
            ...outgoing,
            signal: pending.controller.signal
          });
          assertSuccessful(response);
          const json = await readJson(response);
          return provider.parseComplete(json);
        } finally {
          controllers.delete(pending.requestId);
        }
      },
      async *stream(request) {
        const provider = getProvider2(request.providerId);
        const pending = startRequest(request);
        const parser = createSseParser();
        const providerState = typeof provider.createStreamState === "function" ? provider.createStreamState() : {};
        try {
          const outgoing = provider.buildRequest({ ...request, stream: true });
          const chunks = await transport.postStream({
            ...outgoing,
            signal: pending.controller.signal
          });
          for await (const chunk of chunks) {
            const events = parser.push(chunk);
            for (const event of events) {
              const delta = provider.parseChunk(event, providerState);
              if (delta) yield delta;
            }
          }
          for (const event of parser.flush()) {
            const delta = provider.parseChunk(event, providerState);
            if (delta) yield delta;
          }
        } finally {
          controllers.delete(pending.requestId);
        }
      },
      cancel(requestId) {
        const controller = controllers.get(requestId);
        if (!controller) return false;
        controller.abort();
        controllers.delete(requestId);
        return true;
      }
    };
  }
  function assertSuccessful(response) {
    if (!response) throw new Error("LLM provider returned no response");
    if (response.ok === false || response.status != null && response.status >= 400) {
      throw new Error(`LLM provider request failed with status ${response.status || "unknown"}`);
    }
  }
  async function readJson(response) {
    if (typeof response.json === "function") return response.json();
    if (typeof response.body === "string") return JSON.parse(response.body);
    if (response.body && typeof response.body === "object") return response.body;
    if (typeof response.text === "function") return JSON.parse(await response.text());
    return response;
  }

  // src/core/llm/providers/openai.js
  var openai_exports = {};
  __export(openai_exports, {
    buildRequest: () => buildRequest,
    parseChunk: () => parseChunk,
    parseComplete: () => parseComplete
  });
  var DEFAULT_BASE_URL = "https://api.openai.com";
  function buildRequest({
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    model,
    messages = [],
    system,
    tools = [],
    temperature,
    maxTokens,
    stream = false,
    reasoning_effort,
    reasoningEffort
  } = {}) {
    const normalizedMessages = [];
    if (system) normalizedMessages.push({ role: "system", content: system });
    normalizedMessages.push(...messages);
    const body = {
      model,
      messages: normalizedMessages,
      stream: Boolean(stream)
    };
    if (tools.length) {
      body.tools = tools.map(function(tool) {
        return {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description || "",
            parameters: tool.parameters
          }
        };
      });
    }
    if (temperature != null) body.temperature = temperature;
    if (maxTokens != null) body.max_tokens = maxTokens;
    const requestedReasoningEffort = reasoning_effort ?? reasoningEffort;
    if (requestedReasoningEffort != null) body.reasoning_effort = requestedReasoningEffort;
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    return {
      url: chatCompletionsUrl(baseUrl),
      headers,
      body
    };
  }
  function parseChunk(event) {
    if (!event || event.done || event.data === "[DONE]") return null;
    const json = readEventData(event);
    if (!json) return null;
    const choice = json.choices && json.choices[0];
    const delta = choice && choice.delta ? choice.delta : {};
    const result = {};
    if (delta.content != null) result.delta = delta.content;
    if (delta.reasoning_content != null) result.reasoningContent = delta.reasoning_content;
    if (delta.tool_calls) result.toolCalls = normalizeToolCalls(delta.tool_calls);
    if (choice && choice.finish_reason != null) result.finishReason = choice.finish_reason;
    if (json.usage) result.usage = normalizeUsage(json.usage);
    return Object.keys(result).length ? result : null;
  }
  function parseComplete(json) {
    if (!json || typeof json !== "object") return {};
    const choice = json.choices && json.choices[0];
    const message = choice && choice.message ? choice.message : {};
    const result = {};
    if (message.content != null) result.content = message.content;
    if (message.reasoning_content != null) result.reasoningContent = message.reasoning_content;
    if (message.tool_calls) result.toolCalls = normalizeToolCalls(message.tool_calls);
    if (choice && choice.finish_reason != null) result.finishReason = choice.finish_reason;
    if (json.usage) result.usage = normalizeUsage(json.usage);
    return result;
  }
  function normalizeToolCalls(calls) {
    return calls.map(function(call) {
      const fn = call.function || {};
      const normalized = { arguments: parseArguments(fn.arguments) };
      if (call.id != null) normalized.id = call.id;
      if (call.index != null) normalized.index = call.index;
      if (fn.name != null) normalized.name = fn.name;
      return normalized;
    });
  }
  function parseArguments(value) {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (_) {
      return value;
    }
  }
  function normalizeUsage(usage) {
    return {
      inputTokens: usage.prompt_tokens,
      outputTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens
    };
  }
  function readEventData(event) {
    if (typeof event === "string") {
      try {
        return JSON.parse(event);
      } catch (_) {
        return null;
      }
    }
    if (typeof event.data === "object") return event.data;
    try {
      return JSON.parse(event.data);
    } catch (_) {
      return null;
    }
  }
  function chatCompletionsUrl(baseUrl) {
    const base = String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
    return base.endsWith("/v1") ? `${base}/chat/completions` : `${base}/v1/chat/completions`;
  }

  // src/core/llm/providers/anthropic.js
  var anthropic_exports = {};
  __export(anthropic_exports, {
    buildRequest: () => buildRequest2,
    createStreamState: () => createStreamState,
    parseChunk: () => parseChunk2,
    parseComplete: () => parseComplete2
  });
  var DEFAULT_BASE_URL2 = "https://api.anthropic.com";
  var defaultStreamState = createStreamState();
  function buildRequest2({
    apiKey,
    baseUrl = DEFAULT_BASE_URL2,
    model,
    messages = [],
    system,
    tools = [],
    temperature,
    maxTokens,
    stream = false
  } = {}) {
    const body = {
      model,
      messages: messages.filter(function(message) {
        return message.role !== "system";
      }),
      max_tokens: maxTokens == null ? 4096 : maxTokens,
      stream: Boolean(stream)
    };
    const messageSystem = messages.filter(function(message) {
      return message.role === "system";
    }).map(function(message) {
      return message.content;
    }).join("\n\n");
    if (system || messageSystem) body.system = [system, messageSystem].filter(Boolean).join("\n\n");
    if (tools.length) {
      body.tools = tools.map(function(tool) {
        return {
          name: tool.name,
          description: tool.description || "",
          input_schema: tool.parameters
        };
      });
    }
    if (temperature != null) body.temperature = temperature;
    return {
      url: `${String(baseUrl).replace(/\/+$/, "")}/v1/messages`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body
    };
  }
  function parseChunk2(event, state = defaultStreamState) {
    if (!event || event.done || event.data === "[DONE]") return null;
    const json = readEventData2(event);
    if (!json) return null;
    if (json.type === "message_start") {
      state.tools.clear();
      const usage = json.message && json.message.usage;
      return usage ? { usage: normalizeUsage2(usage) } : null;
    }
    if (json.type === "content_block_start") {
      const block = json.content_block || {};
      if (block.type === "text" && block.text) return { delta: block.text };
      if (block.type === "tool_use") {
        state.tools.set(json.index, {
          id: block.id,
          name: block.name,
          json: block.input && Object.keys(block.input).length ? JSON.stringify(block.input) : ""
        });
        return {
          toolCalls: [{
            id: block.id,
            index: json.index,
            name: block.name,
            arguments: block.input || {}
          }]
        };
      }
    }
    if (json.type === "content_block_delta") {
      const delta = json.delta || {};
      if (delta.type === "text_delta") return { delta: delta.text || "" };
      if (delta.type === "input_json_delta") {
        const tool = state.tools.get(json.index) || { id: void 0, name: void 0, json: "" };
        tool.json += delta.partial_json || "";
        state.tools.set(json.index, tool);
        return {
          toolCalls: [{
            id: tool.id,
            index: json.index,
            name: tool.name,
            arguments: parseArguments2(tool.json)
          }]
        };
      }
    }
    if (json.type === "content_block_stop" && state.tools.has(json.index)) {
      const tool = state.tools.get(json.index);
      state.tools.delete(json.index);
      return {
        toolCalls: [{
          id: tool.id,
          index: json.index,
          name: tool.name,
          arguments: parseArguments2(tool.json)
        }]
      };
    }
    if (json.type === "message_delta") {
      const result = {};
      if (json.delta && json.delta.stop_reason != null) result.finishReason = json.delta.stop_reason;
      if (json.usage) result.usage = normalizeUsage2(json.usage);
      return Object.keys(result).length ? result : null;
    }
    if (json.type === "message_stop") state.tools.clear();
    return null;
  }
  function parseComplete2(json) {
    if (!json || typeof json !== "object") return {};
    const result = {};
    const blocks = Array.isArray(json.content) ? json.content : [];
    const text = blocks.filter(function(block) {
      return block.type === "text";
    }).map(function(block) {
      return block.text || "";
    }).join("");
    const tools = blocks.filter(function(block) {
      return block.type === "tool_use";
    }).map(function(block, index) {
      return { id: block.id, index, name: block.name, arguments: block.input || {} };
    });
    if (text) result.content = text;
    if (tools.length) result.toolCalls = tools;
    if (json.stop_reason != null) result.finishReason = json.stop_reason;
    if (json.usage) result.usage = normalizeUsage2(json.usage);
    return result;
  }
  function createStreamState() {
    return { tools: /* @__PURE__ */ new Map() };
  }
  function normalizeUsage2(usage) {
    const inputTokens = usage.input_tokens;
    const outputTokens = usage.output_tokens;
    return {
      inputTokens,
      outputTokens,
      totalTokens: (inputTokens || 0) + (outputTokens || 0)
    };
  }
  function parseArguments2(value) {
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch (_) {
      return value;
    }
  }
  function readEventData2(event) {
    if (typeof event === "string") {
      try {
        return JSON.parse(event);
      } catch (_) {
        return null;
      }
    }
    if (typeof event.data === "object") return event.data;
    try {
      return JSON.parse(event.data);
    } catch (_) {
      return null;
    }
  }

  // src/core/llm/providers/gemini.js
  var gemini_exports = {};
  __export(gemini_exports, {
    buildRequest: () => buildRequest3,
    parseChunk: () => parseChunk3,
    parseComplete: () => parseComplete3
  });
  var DEFAULT_BASE_URL3 = "https://generativelanguage.googleapis.com";
  function buildRequest3({
    apiKey,
    baseUrl = DEFAULT_BASE_URL3,
    model,
    messages = [],
    system,
    tools = [],
    temperature,
    maxTokens,
    stream = false
  } = {}) {
    const method = stream ? "streamGenerateContent" : "generateContent";
    const query = new URLSearchParams();
    query.set("key", apiKey || "");
    if (stream) query.set("alt", "sse");
    const body = {
      contents: messages.filter(function(message) {
        return message.role !== "system";
      }).map(mapMessage)
    };
    const messageSystem = messages.filter(function(message) {
      return message.role === "system";
    }).map(function(message) {
      return message.content;
    }).join("\n\n");
    if (system || messageSystem) {
      body.systemInstruction = {
        parts: [{ text: [system, messageSystem].filter(Boolean).join("\n\n") }]
      };
    }
    if (tools.length) {
      body.tools = [{
        functionDeclarations: tools.map(function(tool) {
          return {
            name: tool.name,
            description: tool.description || "",
            parameters: tool.parameters
          };
        })
      }];
    }
    if (temperature != null || maxTokens != null) {
      body.generationConfig = {};
      if (temperature != null) body.generationConfig.temperature = temperature;
      if (maxTokens != null) body.generationConfig.maxOutputTokens = maxTokens;
    }
    return {
      url: `${String(baseUrl).replace(/\/+$/, "")}/v1beta/models/${encodeURIComponent(model)}:${method}?${query}`,
      headers: { "Content-Type": "application/json" },
      body
    };
  }
  function parseChunk3(event) {
    if (!event || event.done || event.data === "[DONE]") return null;
    const json = readEventData3(event);
    return json ? parseResponse(json, true) : null;
  }
  function parseComplete3(json) {
    return parseResponse(json, false) || {};
  }
  function parseResponse(json, streaming) {
    if (!json || typeof json !== "object") return null;
    const candidate = json.candidates && json.candidates[0];
    const parts = candidate && candidate.content && Array.isArray(candidate.content.parts) ? candidate.content.parts : [];
    const text = parts.filter(function(part) {
      return typeof part.text === "string";
    }).map(function(part) {
      return part.text;
    }).join("");
    const toolCalls = parts.filter(function(part) {
      return part.functionCall;
    }).map(function(part, index) {
      return {
        index,
        name: part.functionCall.name,
        arguments: part.functionCall.args || {}
      };
    });
    const result = {};
    if (text) result[streaming ? "delta" : "content"] = text;
    if (toolCalls.length) result.toolCalls = toolCalls;
    if (candidate && candidate.finishReason != null) result.finishReason = candidate.finishReason;
    if (json.usageMetadata) {
      result.usage = {
        inputTokens: json.usageMetadata.promptTokenCount,
        outputTokens: json.usageMetadata.candidatesTokenCount,
        totalTokens: json.usageMetadata.totalTokenCount
      };
    }
    return Object.keys(result).length ? result : null;
  }
  function mapMessage(message) {
    const role = message.role === "assistant" ? "model" : "user";
    if (Array.isArray(message.content)) return { role, parts: message.content };
    return { role, parts: [{ text: String(message.content) }] };
  }
  function readEventData3(event) {
    if (typeof event === "string") {
      try {
        return JSON.parse(event);
      } catch (_) {
        return null;
      }
    }
    if (typeof event.data === "object") return event.data;
    try {
      return JSON.parse(event.data);
    } catch (_) {
      return null;
    }
  }

  // src/core/llm/providers/moonshot.js
  var moonshot_exports = {};
  __export(moonshot_exports, {
    buildRequest: () => buildRequest4,
    parseChunk: () => parseChunk,
    parseComplete: () => parseComplete
  });
  var DEFAULT_BASE_URL4 = "https://api.moonshot.ai";
  function buildRequest4(options = {}) {
    const messages = (options.messages || []).map(function(message) {
      if (message.role !== "assistant" || message.reasoningContent == null) return message;
      const { reasoningContent, ...normalized } = message;
      return { ...normalized, reasoning_content: reasoningContent };
    });
    return buildRequest({
      ...options,
      messages,
      baseUrl: options.baseUrl || DEFAULT_BASE_URL4,
      reasoning_effort: options.reasoning_effort ?? options.reasoningEffort
    });
  }

  // src/core/llm/providers/ollama.js
  var ollama_exports = {};
  __export(ollama_exports, {
    buildRequest: () => buildRequest5,
    parseChunk: () => parseChunk,
    parseComplete: () => parseComplete
  });
  var DEFAULT_BASE_URL5 = "http://localhost:11434";
  function buildRequest5(options = {}) {
    return buildRequest({
      ...options,
      baseUrl: options.baseUrl || DEFAULT_BASE_URL5
    });
  }

  // src/core/llm/providers/index.js
  var providers = {
    openai: openai_exports,
    anthropic: anthropic_exports,
    gemini: gemini_exports,
    moonshot: moonshot_exports,
    ollama: ollama_exports,
    openai_compatible: openai_exports
  };
  function getProvider(id) {
    const provider = providers[id];
    if (!provider) throw new Error(`Unsupported provider: ${id}`);
    return provider;
  }

  // src/background/llm-handler.js
  var LLM_PORT_NAME = "seipro-llm";
  var BUILT_IN_HOSTS = [
    "api.openai.com",
    "api.anthropic.com",
    "generativelanguage.googleapis.com",
    "api.moonshot.ai",
    "localhost",
    "127.0.0.1"
  ];
  function errorMessage(error) {
    return error && error.message ? error.message : String(error);
  }
  function isAllowedSender(sender, browserApi) {
    return Boolean(
      sender && browserApi && browserApi.runtime && sender.id === browserApi.runtime.id && sender.url
    );
  }
  function parseProfileUrl(value) {
    if (!value) return null;
    try {
      const parsed = new URL(value);
      const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
      if (parsed.protocol !== "https:" && !(isLocal && parsed.protocol === "http:")) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }
  function buildAllowedHosts(profile = {}) {
    const hosts = new Set(BUILT_IN_HOSTS);
    const configuredUrl = parseProfileUrl(profile.baseUrl);
    if (configuredUrl) hosts.add(configuredUrl.hostname);
    return hosts;
  }
  function isAllowedLlmUrl(url, profile = {}) {
    try {
      const parsed = new URL(url);
      const profileUrl = parseProfileUrl(profile.baseUrl);
      const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
      if (parsed.protocol !== "https:" && !(isLocal && parsed.protocol === "http:")) return false;
      if (!buildAllowedHosts(profile).has(parsed.hostname)) return false;
      if (profileUrl && parsed.hostname === profileUrl.hostname) {
        return parsed.origin === profileUrl.origin;
      }
      return true;
    } catch (_) {
      return false;
    }
  }
  function readProfiles(browserApi) {
    return new Promise(function(resolve, reject) {
      const storage = browserApi && browserApi.storage && browserApi.storage.local;
      if (!storage || typeof storage.get !== "function") {
        reject(new Error("Local LLM profile storage is unavailable"));
        return;
      }
      let settled = false;
      function finish(items) {
        if (settled) return;
        settled = true;
        const profiles = items && Array.isArray(items.llmProfiles) ? items.llmProfiles : [];
        resolve(profiles);
      }
      function fail(error) {
        if (settled) return;
        settled = true;
        reject(error);
      }
      try {
        const result = storage.get("llmProfiles", finish);
        if (result && typeof result.then === "function") result.then(finish, fail);
      } catch (error) {
        fail(error);
      }
    });
  }
  function sameConfiguredEndpoint(requestedBaseUrl, storedBaseUrl) {
    if (!requestedBaseUrl || !storedBaseUrl) return true;
    const requested = parseProfileUrl(requestedBaseUrl);
    const stored = parseProfileUrl(storedBaseUrl);
    return Boolean(requested && stored && requested.origin === stored.origin);
  }
  async function resolveLlmRequest(request, browserApi) {
    if (!request || typeof request !== "object") throw new TypeError("LLM request is required");
    const requestProfile = request.profile && typeof request.profile === "object" ? request.profile : {};
    const profileId = request.profileId || requestProfile.id;
    if (!profileId) throw new Error("LLM profile id is required");
    const profiles = await readProfiles(browserApi);
    const storedProfile = profiles.find(function(profile) {
      return profile && profile.id === profileId;
    });
    if (!storedProfile) throw new Error("LLM profile was not found");
    if (!sameConfiguredEndpoint(requestProfile.baseUrl, storedProfile.baseUrl)) {
      throw new Error("LLM profile base URL does not match stored configuration");
    }
    const baseUrl = requestProfile.baseUrl || storedProfile.baseUrl;
    const parsedBaseUrl = parseProfileUrl(baseUrl);
    if (baseUrl && !parsedBaseUrl) throw new Error("LLM profile base URL is invalid");
    if (parsedBaseUrl && BUILT_IN_HOSTS.indexOf(parsedBaseUrl.hostname) === -1 && storedProfile.trusted !== true) {
      throw new Error("Custom LLM profile host is not trusted");
    }
    const {
      profile: _profile,
      profileId: _profileId,
      apiKey: _apiKey,
      key: _key,
      providerId: _providerId,
      baseUrl: _baseUrl,
      ...safeRequest
    } = request;
    return {
      ...safeRequest,
      requestId: request.requestId,
      providerId: storedProfile.providerId,
      baseUrl,
      model: request.model || storedProfile.model,
      apiKey: storedProfile.key || "",
      profile: {
        id: storedProfile.id,
        baseUrl,
        trusted: storedProfile.trusted === true
      }
    };
  }
  function assertFetchResponse(response) {
    if (!response) throw new Error("LLM provider returned no response");
    if (response.ok === false || response.status != null && response.status >= 400) {
      throw new Error(`LLM provider request failed with status ${response.status || "unknown"}`);
    }
  }
  function createFetchTransport(profile) {
    function requestOptions(outgoing) {
      if (!isAllowedLlmUrl(outgoing.url, profile)) {
        throw new Error("LLM provider URL is not allowed");
      }
      return {
        method: "POST",
        headers: outgoing.headers || {},
        body: JSON.stringify(outgoing.body || {}),
        signal: outgoing.signal
      };
    }
    return {
      async post(outgoing) {
        const response = await fetch(outgoing.url, requestOptions(outgoing));
        assertFetchResponse(response);
        return response;
      },
      async postStream(outgoing) {
        const response = await fetch(outgoing.url, requestOptions(outgoing));
        assertFetchResponse(response);
        if (!response.body || typeof response.body.getReader !== "function") {
          throw new Error("LLM provider returned no readable stream");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        return {
          async *[Symbol.asyncIterator]() {
            try {
              while (true) {
                const chunk = await reader.read();
                if (chunk.done) break;
                const text = decoder.decode(chunk.value, { stream: true });
                if (text) yield text;
              }
              const trailing = decoder.decode();
              if (trailing) yield trailing;
            } finally {
              if (typeof reader.releaseLock === "function") reader.releaseLock();
            }
          }
        };
      }
    };
  }
  function createClient(profile) {
    return createLlmClient({
      transport: createFetchTransport(profile),
      getProvider
    });
  }
  function safePost(port, payload) {
    try {
      port.postMessage(payload);
      return true;
    } catch (_) {
      return false;
    }
  }
  function forwardChunk(port, requestId, chunk, metadata, startedTools) {
    if (!chunk) return;
    if (chunk.delta != null || chunk.reasoningContent != null) {
      safePost(port, {
        type: "delta",
        requestId,
        delta: chunk.delta || "",
        reasoningContent: chunk.reasoningContent
      });
    }
    (chunk.toolCalls || []).forEach(function(tool) {
      const toolKey = tool.index == null ? tool.id || tool.name : String(tool.index);
      const previous = metadata.toolCalls.get(toolKey) || {};
      metadata.toolCalls.set(toolKey, mergeToolCall(previous, tool));
      if (!startedTools.has(toolKey)) {
        startedTools.add(toolKey);
        safePost(port, { type: "tool_start", requestId, tool });
      }
    });
    (chunk.toolResults || []).forEach(function(result) {
      safePost(port, { type: "tool_result", requestId, result });
    });
    if (chunk.finishReason != null) metadata.finishReason = chunk.finishReason;
    if (chunk.usage != null) metadata.usage = chunk.usage;
  }
  function mergeToolCall(previous, next) {
    const merged = { ...previous, ...next };
    const oldArgs = previous.arguments;
    const newArgs = next.arguments;
    if (typeof newArgs === "string") {
      if (typeof oldArgs === "string") {
        merged.arguments = newArgs.startsWith(oldArgs) ? newArgs : oldArgs + newArgs;
      } else {
        merged.arguments = newArgs;
      }
    } else if (newArgs === void 0 && oldArgs !== void 0) {
      merged.arguments = oldArgs;
    }
    return merged;
  }
  function handleLlmConnect(port, browserApi) {
    if (!port || port.name !== LLM_PORT_NAME) return false;
    if (!isAllowedSender(port.sender, browserApi)) {
      safePost(port, { type: "error", error: "Unauthorized LLM stream sender" });
      if (typeof port.disconnect === "function") port.disconnect();
      return false;
    }
    const active = /* @__PURE__ */ new Map();
    const cancelled = /* @__PURE__ */ new Set();
    async function start(message) {
      const requestId = message.requestId || message.request && message.request.requestId;
      if (!requestId) {
        safePost(port, { type: "error", error: "LLM request id is required" });
        return;
      }
      if (active.has(requestId)) {
        safePost(port, { type: "error", requestId, error: "LLM request is already active" });
        return;
      }
      try {
        const resolved = await resolveLlmRequest({
          ...message.request || {},
          requestId
        }, browserApi);
        const client = createClient(resolved.profile);
        const metadata = { toolCalls: /* @__PURE__ */ new Map() };
        const startedTools = /* @__PURE__ */ new Set();
        active.set(requestId, client);
        for await (const chunk of client.stream(resolved)) {
          forwardChunk(port, requestId, chunk, metadata, startedTools);
        }
        safePost(port, {
          type: "done",
          requestId,
          finishReason: metadata.finishReason,
          usage: metadata.usage,
          toolCalls: [...metadata.toolCalls.values()]
        });
      } catch (error) {
        if (cancelled.has(requestId) || error && error.name === "AbortError") {
          safePost(port, { type: "done", requestId, cancelled: true });
        } else {
          safePost(port, { type: "error", requestId, error: errorMessage(error) });
        }
      } finally {
        active.delete(requestId);
        cancelled.delete(requestId);
      }
    }
    function cancel(requestId) {
      const client = active.get(requestId);
      if (!client) return false;
      cancelled.add(requestId);
      return client.cancel(requestId);
    }
    port.onMessage.addListener(function(message) {
      if (!message) return;
      if (message.type === "start") start(message);
      if (message.type === "cancel") cancel(message.requestId);
    });
    port.onDisconnect.addListener(function() {
      active.forEach(function(client, requestId) {
        cancelled.add(requestId);
        client.cancel(requestId);
      });
      active.clear();
    });
    return true;
  }
  function handleLlmCompleteMessage(message, sender, sendResponse, browserApi) {
    if (!isAllowedSender(sender, browserApi)) {
      sendResponse({ ok: false, error: "Unauthorized LLM completion sender" });
      return false;
    }
    resolveLlmRequest(message && message.request, browserApi).then(async function(resolved) {
      const client = createClient(resolved.profile);
      const result = await client.complete(resolved);
      sendResponse({ ok: true, result });
    }).catch(function(error) {
      sendResponse({ ok: false, error: errorMessage(error) });
    });
    return true;
  }
  globalThis.SeiProBackgroundLlm = {
    handleLlmCompleteMessage,
    handleLlmConnect,
    isAllowedLlmUrl
  };
})();
