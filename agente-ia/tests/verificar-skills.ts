/**
 * Skills do usuário: slug, endereço do GitHub, download e a mensagem que sai
 * para o modelo quando o usuário chama `/slug`.
 */

import { baixarColecao, baixarSkill, comSkills, descricaoDoTexto, mesclarColecao, partesDoGitHub, sincronizarSkills, skillsCitadas, slugificar, slugLivre, tituloDoMarkdown, urlCrua, type ColecaoSkills, type SkillUsuario } from "../src/painel/skills";
import { promptSistema } from "../src/motor/prompt";
import { toolsMotor } from "../src/tools/motor";
import { checar, secao } from "./util";

const skill = (slug: string, nome = slug): SkillUsuario => ({ id: slug, slug, nome, descricao: `quando ${nome}`, texto: `Regras de ${nome}.` });

export async function verificarSkills(): Promise<void> {
  secao("skills: nome e atalho");
  checar("acento e espaco viram slug", slugificar("Despacho de Encaminhamento") === "despacho-de-encaminhamento");
  checar("slug repetido ganha numero", slugLivre("Despacho", [skill("despacho")]) === "despacho-2");
  checar("editar a propria skill mantem o slug", slugLivre("Despacho", [skill("despacho")], "despacho") === "despacho");
  checar("nome sem letras nao vira slug vazio", slugLivre("###", []) === "skill");

  secao("skills: endereco do GitHub");
  checar(
    "link da pagina vira link do arquivo",
    urlCrua("https://github.com/orgao/repo/blob/main/pasta/despacho.md") === "https://raw.githubusercontent.com/orgao/repo/main/pasta/despacho.md",
  );
  checar("link raw nao e mexido", urlCrua("https://raw.githubusercontent.com/o/r/main/a.md") === "https://raw.githubusercontent.com/o/r/main/a.md");
  checar("gist ganha /raw", urlCrua("https://gist.github.com/alguem/abc123") === "https://gist.github.com/alguem/abc123/raw");

  secao("skills: download");
  const resposta = (corpo: string, status = 200) =>
    (async () => ({ ok: status < 400, status, text: async () => corpo }) as unknown as Response) as unknown as typeof fetch;
  checar("texto do arquivo chega", (await baixarSkill("https://raw.githubusercontent.com/o/r/main/a.md", resposta("# Titulo\nRegra."))) === "# Titulo\nRegra.");
  let erro = "";
  await baixarSkill("https://github.com/o/r/blob/main/a.md", resposta("<!DOCTYPE html><html>...", 200)).catch((e) => (erro = (e as Error).message));
  checar("pagina HTML do GitHub e recusada", /página, não o arquivo/.test(erro), erro);
  erro = "";
  await baixarSkill("https://raw.githubusercontent.com/o/r/main/x.md", resposta("Not Found", 404)).catch((e) => (erro = (e as Error).message));
  checar("404 explica o que conferir", /não encontrado/i.test(erro), erro);

  secao("skills: sincronizacao com o GitHub");
  const respostaSync = (corpo: string, status = 200, etag?: string) => {
    const chamadas: Array<Record<string, string>> = [];
    const f = (async (_u: string, init: RequestInit) => {
      chamadas.push((init.headers ?? {}) as Record<string, string>);
      return {
        ok: status < 400,
        status,
        text: async () => corpo,
        headers: { get: (n: string) => (n.toLowerCase() === "etag" ? (etag ?? null) : null) },
      } as unknown as Response;
    }) as unknown as typeof fetch;
    return { f, chamadas };
  };
  const hospedada = (extra: Partial<SkillUsuario> = {}): SkillUsuario => ({
    ...skill("despacho", "Despacho"),
    texto: "versao antiga",
    url: "https://github.com/o/r/blob/main/d.md",
    sincronizar: true,
    ...extra,
  });

  const desligada = await sincronizarSkills([hospedada({ sincronizar: false })], { buscar: respostaSync("versao nova").f });
  checar("desligada nao busca nada", desligada.lista[0].texto === "versao antiga" && !desligada.lista[0].verificadaEm);

  const nova = await sincronizarSkills([hospedada()], { buscar: respostaSync("versao nova", 200, 'W/"abc"').f });
  checar("ligada traz o texto novo", nova.lista[0].texto === "versao nova" && nova.mudaram.includes("Despacho"));
  checar("guarda o etag para a proxima pergunta", nova.lista[0].etag === 'W/"abc"');
  checar("marca quando conferiu", typeof nova.lista[0].verificadaEm === "number");

  const comEtag = respostaSync("", 304);
  const igual = await sincronizarSkills([hospedada({ etag: 'W/"abc"' })], { buscar: comEtag.f });
  checar("304 mantem o texto e nao avisa mudanca", igual.lista[0].texto === "versao antiga" && !igual.mudaram.length);
  checar("pergunta com If-None-Match", comEtag.chamadas[0]?.["If-None-Match"] === 'W/"abc"', comEtag.chamadas[0]);

  const cedo = await sincronizarSkills([hospedada({ verificadaEm: Date.now() - 60_000 })], { buscar: respostaSync("versao nova").f });
  checar("dentro do intervalo nao consulta de novo", cedo.lista[0].texto === "versao antiga");
  const forcado = await sincronizarSkills([hospedada({ verificadaEm: Date.now() - 60_000 })], { forcar: true, buscar: respostaSync("versao nova").f });
  checar("Sincronizar agora ignora o intervalo", forcado.lista[0].texto === "versao nova");

  const caiu = await sincronizarSkills([hospedada()], { buscar: respostaSync("erro", 500).f });
  checar("falha de rede NAO apaga o texto", caiu.lista[0].texto === "versao antiga");
  checar("e registra o motivo", Boolean(caiu.lista[0].erroSync), caiu.lista[0].erroSync);

  const semPermissao = await sincronizarSkills([hospedada()], { buscar: respostaSync("versao nova").f, autorizado: async () => false });
  checar("sem permissao de host nao busca", semPermissao.lista[0].texto === "versao antiga" && !semPermissao.lista[0].verificadaEm);

  secao("skills da equipe: pasta do GitHub");
  checar("le dono, repo, branch e pasta", JSON.stringify(partesDoGitHub("https://github.com/orgao/skills/tree/main/unidade")) === JSON.stringify({ dono: "orgao", repo: "skills", ref: "main", pasta: "unidade" }));
  checar("repositorio sem pasta tambem vale", partesDoGitHub("https://github.com/orgao/skills")?.pasta === "");
  checar("endereco que nao e do GitHub e recusado", partesDoGitHub("https://exemplo.gov.br/skills") === null);
  checar("titulo vem do frontmatter", tituloDoMarkdown("---\nname: Despacho de encaminhamento\n---\n\n# Outro") === "Despacho de encaminhamento");
  checar("sem frontmatter, vem do titulo", tituloDoMarkdown("# Nota tecnica\n\ntexto") === "Nota tecnica");

  const pasta = (arquivos: Array<{ name: string; conteudo: string }>) =>
    (async (url: string) => {
      const u = String(url);
      if (u.startsWith("https://api.github.com/")) {
        return {
          ok: true,
          status: 200,
          json: async () => arquivos.map((a) => ({ name: a.name, type: "file", download_url: `https://raw/${a.name}` })),
        } as unknown as Response;
      }
      const achado = arquivos.find((a) => u.endsWith(a.name));
      return { ok: true, status: 200, text: async () => achado?.conteudo ?? "" } as unknown as Response;
    }) as unknown as typeof fetch;

  const baixadas = await baixarColecao("https://github.com/o/r/tree/main/skills", pasta([
    { name: "README.md", conteudo: "# Leia-me" },
    { name: "despacho.md", conteudo: "---\nname: Despacho\n---\n\nRegras do despacho." },
    { name: "nota.md", conteudo: "# Nota tecnica\n\nRegras da nota." },
    { name: "imagem.png", conteudo: "" },
  ]));
  checar("traz so os .md, sem o README", baixadas.map((b) => b.arquivo).join(",") === "despacho.md,nota.md", baixadas);
  checar("nome sai do arquivo", baixadas[0].nome === "Despacho" && baixadas[1].nome === "Nota tecnica");

  const colecao: ColecaoSkills = { id: "col1", nome: "Equipe", url: "https://github.com/o/r/tree/main/skills" };
  const propria = skill("minha", "Minha skill");
  const m1 = mesclarColecao([propria], colecao, baixadas);
  checar("skills da equipe entram marcadas", m1.lista.filter((s) => s.colecao === "col1").length === 2 && m1.novas === 2);
  checar("skill propria nao e tocada", m1.lista.some((s) => s.id === propria.id && !s.colecao));
  const m2 = mesclarColecao(m1.lista, colecao, [baixadas[0]]);
  checar("skill que saiu da pasta sai daqui", m2.lista.filter((s) => s.colecao === "col1").length === 1 && m2.removidas === 1);
  const m3 = mesclarColecao(m1.lista, colecao, [{ ...baixadas[0], texto: "Regras novas." }, baixadas[1]]);
  checar("texto mudado conta como atualizacao", m3.atualizadas === 1 && m3.novas === 0);
  checar("o atalho da skill da equipe nao muda entre sincronizacoes", m3.lista.find((s) => s.id === "col1:despacho.md")?.slug === m1.lista.find((s) => s.id === "col1:despacho.md")?.slug);

  secao("skills: uso na conversa");
  const lista = [skill("despacho-encaminhamento", "Despacho de encaminhamento"), skill("nota-tecnica", "Nota tecnica")];
  checar("acha o slug citado", skillsCitadas("faca um /despacho-encaminhamento para a GAB", lista).length === 1);
  checar("nao confunde com barra de data", skillsCitadas("processo de 12/03/2026", lista).length === 0);
  checar("nao repete a mesma skill", skillsCitadas("/nota-tecnica e de novo /nota-tecnica", lista).length === 1);
  const msg = comSkills("faca o despacho", [lista[0]]);
  checar("conteudo vai delimitado e antes do pedido", msg.startsWith('<skill nome="despacho-encaminhamento"') && msg.endsWith("faca o despacho"));
  checar("com o lembrete de que nao dispensa aprovacao", /não dispensam aprovação/.test(msg));
  checar("sem skill, a mensagem e a mesma", comSkills("oi", []) === "oi");
  checar("descricao sai da primeira linha util", descricaoDoTexto("---\ntitulo: x\n---\n\n# Despacho\n\nTexto.") === "titulo: x");

  secao("skills: o modelo sabe que existem");
  const prompt = promptSistema(null, new Date(), "", lista);
  checar("prompt lista slug e nome", prompt.includes('"despacho-encaminhamento"') && prompt.includes("Nota tecnica"));
  checar("sem skills, o prompt nao muda", !promptSistema(null).includes("disponíveis em skill_ler"));
  const ler = toolsMotor(lista).find((t) => t.nome === "skill_ler");
  const enumSkills = ((ler?.parametros as { properties?: { nome?: { enum?: string[] } } }).properties?.nome?.enum ?? []) as string[];
  checar("skill_ler aceita as do usuario", enumSkills.includes("despacho-encaminhamento") && enumSkills.includes("redacao-oficial"), enumSkills);
  const lido = await ler?.executar?.({ nome: "nota-tecnica" }, {} as never);
  checar("skill_ler devolve o texto do usuario", String(lido).includes("Regras de Nota tecnica"), lido);
}
