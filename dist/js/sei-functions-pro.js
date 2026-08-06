(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/dom/index.js
  function ready(fn) {
    if (typeof document === "undefined") {
      fn();
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      setTimeout(fn, 0);
    }
  }

  // src/features/sei-functions/state.js
  function installSeiFunctionsState() {
    const g = globalThis;
    if (g.__SEI_PRO_FUNCTIONS_STATE_INSTALLED__) return g;
    g.loadFunctionsPro = true;
    if (!g.SeiProReady) {
      g.SeiProReady = new Promise(function(resolve) {
        g.__seiProReadyResolve = resolve;
      });
    }
    g.dadosProcessoPro = {};
    g.dadosProjetosObj = [];
    g.dadosEtapasObj = [];
    g.dadosProjetosUniq = [];
    g.feriadosNacionaisProArray = [];
    g.configGeralObj = [];
    g.ganttProject = [];
    g.ganttHistory = [];
    g.ganttProjectSelect = [];
    g.url_host = window.location.href.split("?")[0];
    g.statusPesquisaDadosProcedimentos = true;
    g.dialogBoxPro = false;
    g.configBoxPro = false;
    g.alertBoxPro = false;
    g.iframeBoxPro = false;
    g.editorBoxPro = false;
    g.interessadosSendPro = false;
    g.iHistory = 0;
    g.iHistoryCurrent = 0;
    g.iHistoryArray = [];
    g.linksArvore = [];
    g.configClassicEditor = [];
    g.arrayListTypesSEI = {};
    g.andamentoPaginacaoTemp = [];
    g.dataDocs = [];
    g.filesystem = null;
    g.FileError = null;
    g.fileSystemPro = false;
    g.fileSystemContentPro = false;
    g.delayCrash = false;
    g.isProcUrgente = false;
    g.dialogIsDraggable = false;
    g.tableHomeTimeout = 3e3;
    g.iconsFlashMenu = [
      { name: "Copiar n\xFAmero do processo", icon: "fas fa-copyright", alt: "" },
      { name: "Copiar somente o n\xFAmero", icon: "fab fa-cuttlefish", alt: "" },
      { name: "Copiar link do processo", icon: "fas fa-link", alt: "" },
      { name: "Enviar Documento Externo", icon: "fa-upload", alt: "" },
      { name: "A\xE7\xF5es em lote", icon: "fa-cogs", alt: "" },
      { name: "Adicionar ou Remover Urg\xEAncia", icon: "fa-exclamation-circle", alt: "Add/Remover Urg\xEAncia" },
      { name: "Incluir Documento", icon: "fas fa-file-alt", alt: "Incluir Novo Documento" },
      { name: "Consultar/Alterar Processo", icon: "fa-file-signature", alt: "" },
      { name: "Iniciar Processo Relacionado", icon: "fa-sync-alt", alt: "Iniciar Proc. Relacionado" },
      { name: "Acompanhamento Especial", icon: "fas fa-eye", alt: "" },
      { name: "Enviar Processo", icon: "fas fa-share-square", alt: "" },
      { name: "Atualizar Andamento", icon: "fas fa-globe-americas", alt: "" },
      { name: "Atribuir Processo", icon: "fa-user-friends", alt: "" },
      { name: "Duplicar Processo", icon: "fa-copy", alt: "" },
      { name: "Relacionamentos do Processo", icon: "fa-retweet", alt: "" },
      { name: "Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo", icon: "fa-users-cog", alt: "Gerenciar Acesso Externo" },
      { name: "Anota\xE7\xF5es", icon: "fas fa-sticky-note", alt: "" },
      { name: "Sobrestar Processo", icon: "fa-pause-circle", alt: "" },
      { name: "Anexar Processo", icon: "fa-paperclip", alt: "" },
      { name: "Gerar Arquivo PDF do Processo", icon: "fa-file-pdf", alt: "Gerar Arquivo PDF" },
      { name: "Gerar Arquivo ZIP do Processo", icon: "fa-file-archive", alt: "Gerar Arquivo ZIP" },
      { name: "Gerenciar Ponto de Controle", icon: "fa-flag", alt: "Gerenciar Ponto de Controle" },
      { name: "Gerenciar Marcador", icon: "fa-tags", alt: "" },
      { name: "Concluir Processo", icon: "fa-folder-open", alt: "Concluir/Reabrir Processo" },
      { name: "Ci\xEAncia", icon: "fa-thumbs-up", alt: "" },
      { name: "Enviar Correspond\xEAncia Eletr\xF4nica", icon: "fa-envelope-open-text", alt: "Enviar Correspond\xEAncia" },
      { name: "Incluir em Bloco", icon: "fa-layer-group", alt: "" },
      { name: "Reabrir Processo", icon: "fa-folder-open", alt: "Concluir/Reabrir Processo" },
      { name: "Ordenar \xC1rvore do Processo", icon: "fa-sort-amount-down-alt", alt: "Ordenar \xC1rvore" }
    ];
    g.iconsFlashDocMenu = [
      { name: "Copiar n\xFAmero SEI", icon: "fas fa-copyright", alt: "", show: true },
      { name: "Copiar nome do documento", icon: "fas fa-file-alt", alt: "", show: true },
      { name: "Copiar link do documento", icon: "fas fa-link", alt: "", show: true },
      { name: "Duplicar documento", icon: "fa-copy", alt: "", show: true },
      { name: "Copiar para...", icon: "fa-share", alt: "", show: true },
      { name: "Imprimir Web", icon: "fa-print", alt: "", show: false },
      { name: "Visualizar em nova aba", icon: "fa-window-restore", alt: "", show: false },
      { name: "Baixar documento", icon: "fa-download", alt: "", show: false },
      { name: "Consultar documento", icon: "fa-users", alt: "", show: false },
      { name: "Incluir em bloco", icon: "fa-book", alt: "", show: false },
      { name: "Cancelar documento", icon: "fa-ban", alt: "", show: false },
      { name: "Vers\xF5es do documento", icon: "fa-code-branch", alt: "", show: false },
      { name: "Gerar circular", icon: "fa-circle-notch", alt: "", show: false },
      { name: "Assinatura externa", icon: "fa-file-signature", alt: "", show: false },
      { name: "Excluir documento", icon: "fa-trash-alt", alt: "", show: false },
      { name: "Editar documento", icon: "fa-edit", alt: "", show: false },
      { name: "Assinar documento", icon: "fa-pen-alt", alt: "", show: false },
      { name: "Adicionar aos monitorados", icon: "fa-star", alt: "", show: false },
      { name: "Ci\xEAncia", icon: "fa-thumbs-up", alt: "", show: false },
      { name: "Enviar por e-mail", icon: "fa-at", alt: "", show: false },
      { name: "Mover p/ outro processo", icon: "fa-people-carry", alt: "", show: false },
      { name: "Intima\xE7\xE3o eletr\xF4nica", icon: "fa-bullhorn", alt: "", show: false },
      { name: "Copiar n\xFAmero com link", icon: "fab fa-creative-commons-sa", alt: "", show: true },
      { name: "Copiar nome com link", icon: "fa-external-link-alt", alt: "", show: true }
    ];
    g.iconsFlashDocArvore = [
      { name: "Copiar n\xFAmero SEI", icon: "far fa-copyright", alt: "", mode: "copy" },
      { name: "Copiar nome do documento", icon: "far fa-file-alt", alt: "", mode: "name" },
      { name: "Copiar link do documento", icon: "fas fa-link", alt: "", mode: "link" },
      { name: "Duplicar documento", icon: "far fa-copy", alt: "", mode: "clone" },
      { name: "Copiar para...", icon: "fas fa-share", alt: "Copiar documento para outro processo", mode: "copyto" },
      { name: "Copiar n\xFAmero com link", icon: "fab fa-creative-commons-sa", alt: "", mode: "numberlink" },
      { name: "Copiar nome com link", icon: "fas fa-external-link-alt", alt: "", mode: "namelink" },
      { name: "Visualizar em nova aba", icon: "fas fa-window-restore", alt: "", mode: "view" }
    ];
    g.iconsFlashPanelArvore = [
      { name: "Anota\xE7\xF5es", icon: "fas fa-sticky-note", alt: "Anota\xE7\xF5es" },
      { name: "Atribui\xE7\xE3o", icon: "fas fa-user-tie", alt: "Atribui\xE7\xE3o" },
      { name: "Tipo de Procedimento", icon: "fas fa-inbox", alt: "Tipo de Procedimento" },
      { name: "Marcador", icon: "fas fa-tags", alt: "Marcador" },
      { name: "N\xEDvel de Acesso", icon: "fas fa-lock", alt: "N\xEDvel de Acesso" },
      { name: "Interessados", icon: "fas fa-users", alt: "Interessados" },
      { name: "Assuntos", icon: "fas fa-bookmark", alt: "Assuntos" },
      { name: "Observa\xE7\xF5es", icon: "fas fa-comment-alt", alt: "Observa\xE7\xF5es" },
      { name: "Bloco Interno", icon: "fas fa-book", alt: "Bloco Interno" },
      { name: "Acompanhamento Especial", icon: "fas fa-eye", alt: "Acompanhamento Especial" }
    ];
    g.rangeFeriadosNacionaisPro = "FeriadosNacionais";
    g.rangeConfigGeral = "ConfigGeral";
    g.CLIENT_ID_PRO = false;
    g.API_KEY_PRO = false;
    g.listIconsFontAwesome = ["ad", "address-book", "address-card", "adjust", "air-freshener", "align-center", "align-justify", "align-left", "align-right", "allergies", "ambulance", "american-sign-language-interpreting", "anchor", "angle-double-down", "angle-double-left", "angle-double-right", "angle-double-up", "angle-down", "angle-left", "angle-right", "angle-up", "angry", "ankh", "apple-alt", "archive", "archway", "arrow-alt-circle-down", "arrow-alt-circle-left", "arrow-alt-circle-right", "arrow-alt-circle-up", "arrow-circle-down", "arrow-circle-left", "arrow-circle-right", "arrow-circle-up", "arrow-down", "arrow-left", "arrow-right", "arrow-up", "arrows-alt", "arrows-alt-h", "arrows-alt-v", "assistive-listening-systems", "asterisk", "at", "atlas", "atom", "audio-description", "award", "baby", "baby-carriage", "backspace", "backward", "bacon", "bacteria", "bacterium", "bahai", "balance-scale", "balance-scale-left", "balance-scale-right", "ban", "band-aid", "barcode", "bars", "baseball-ball", "basketball-ball", "bath", "battery-empty", "battery-full", "battery-half", "battery-quarter", "battery-three-quarters", "bed", "beer", "bell", "bell-slash", "bezier-curve", "bible", "bicycle", "biking", "binoculars", "biohazard", "birthday-cake", "blender", "blender-phone", "blind", "blog", "bold", "bolt", "bomb", "bone", "bong", "book", "book-dead", "book-medical", "book-open", "book-reader", "bookmark", "border-all", "border-none", "border-style", "bowling-ball", "box", "box-open", "box-tissue", "boxes", "braille", "brain", "bread-slice", "briefcase", "briefcase-medical", "broadcast-tower", "broom", "brush", "bug", "building", "bullhorn", "bullseye", "burn", "bus", "bus-alt", "business-time", "calculator", "calendar", "calendar-alt", "calendar-check", "calendar-day", "calendar-minus", "calendar-plus", "calendar-times", "calendar-week", "camera", "camera-retro", "campground", "candy-cane", "cannabis", "capsules", "car", "car-alt", "car-battery", "car-crash", "car-side", "caravan", "caret-down", "caret-left", "caret-right", "caret-square-down", "caret-square-left", "caret-square-right", "caret-square-up", "caret-up", "carrot", "cart-arrow-down", "cart-plus", "cash-register", "cat", "certificate", "chair", "chalkboard", "chalkboard-teacher", "charging-station", "chart-area", "chart-bar", "chart-line", "chart-pie", "check", "check-circle", "check-double", "check-square", "cheese", "chess", "chess-bishop", "chess-board", "chess-king", "chess-knight", "chess-pawn", "chess-queen", "chess-rook", "chevron-circle-down", "chevron-circle-left", "chevron-circle-right", "chevron-circle-up", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "child", "church", "circle", "circle-notch", "city", "clinic-medical", "clipboard", "clipboard-check", "clipboard-list", "clock", "clone", "closed-captioning", "cloud", "cloud-download-alt", "cloud-meatball", "cloud-moon", "cloud-moon-rain", "cloud-rain", "cloud-showers-heavy", "cloud-sun", "cloud-sun-rain", "cloud-upload-alt", "cocktail", "code", "code-branch", "coffee", "cog", "cogs", "coins", "columns", "comment", "comment-alt", "comment-dollar", "comment-dots", "comment-medical", "comment-slash", "comments", "comments-dollar", "compact-disc", "compass", "compress", "compress-alt", "compress-arrows-alt", "concierge-bell", "cookie", "cookie-bite", "copy", "copyright", "couch", "credit-card", "crop", "crop-alt", "cross", "crosshairs", "crow", "crown", "crutch", "cube", "cubes", "cut", "database", "deaf", "democrat", "desktop", "dharmachakra", "diagnoses", "dice", "dice-d20", "dice-d6", "dice-five", "dice-four", "dice-one", "dice-six", "dice-three", "dice-two", "digital-tachograph", "directions", "disease", "divide", "dizzy", "dna", "dog", "dollar-sign", "dolly", "dolly-flatbed", "donate", "door-closed", "door-open", "dot-circle", "dove", "download", "drafting-compass", "dragon", "draw-polygon", "drum", "drum-steelpan", "drumstick-bite", "dumbbell", "dumpster", "dumpster-fire", "dungeon", "edit", "egg", "eject", "ellipsis-h", "ellipsis-v", "envelope", "envelope-open", "envelope-open-text", "envelope-square", "equals", "eraser", "ethernet", "euro-sign", "exchange-alt", "exclamation", "exclamation-circle", "exclamation-triangle", "expand", "expand-alt", "expand-arrows-alt", "external-link-alt", "external-link-square-alt", "eye", "eye-dropper", "eye-slash", "fan", "fast-backward", "fast-forward", "faucet", "fax", "feather", "feather-alt", "female", "fighter-jet", "file", "file-alt", "file-archive", "file-audio", "file-code", "file-contract", "file-csv", "file-download", "file-excel", "file-export", "file-image", "file-import", "file-invoice", "file-invoice-dollar", "file-medical", "file-medical-alt", "file-pdf", "file-powerpoint", "file-prescription", "file-signature", "file-upload", "file-video", "file-word", "fill", "fill-drip", "film", "filter", "fingerprint", "fire", "fire-alt", "fire-extinguisher", "first-aid", "fish", "fist-raised", "flag", "flag-checkered", "flag-usa", "flask", "flushed", "folder", "folder-minus", "folder-open", "folder-plus", "font", "football-ball", "forward", "frog", "frown", "frown-open", "funnel-dollar", "futbol", "gamepad", "gas-pump", "gavel", "gem", "genderless", "ghost", "gift", "gifts", "glass-cheers", "glass-martini", "glass-martini-alt", "glass-whiskey", "glasses", "globe", "globe-africa", "globe-americas", "globe-asia", "globe-europe", "golf-ball", "gopuram", "graduation-cap", "greater-than", "greater-than-equal", "grimace", "grin", "grin-alt", "grin-beam", "grin-beam-sweat", "grin-hearts", "grin-squint", "grin-squint-tears", "grin-stars", "grin-tears", "grin-tongue", "grin-tongue-squint", "grin-tongue-wink", "grin-wink", "grip-horizontal", "grip-lines", "grip-lines-vertical", "grip-vertical", "guitar", "h-square", "hamburger", "hammer", "hamsa", "hand-holding", "hand-holding-heart", "hand-holding-medical", "hand-holding-usd", "hand-holding-water", "hand-lizard", "hand-middle-finger", "hand-paper", "hand-peace", "hand-point-down", "hand-point-left", "hand-point-right", "hand-point-up", "hand-pointer", "hand-rock", "hand-scissors", "hand-sparkles", "hand-spock", "hands", "hands-helping", "hands-wash", "handshake", "handshake-alt-slash", "handshake-slash", "hanukiah", "hard-hat", "hashtag", "hat-cowboy", "hat-cowboy-side", "hat-wizard", "hdd", "head-side-cough", "head-side-cough-slash", "head-side-mask", "head-side-virus", "heading", "headphones", "headphones-alt", "headset", "heart", "heart-broken", "heartbeat", "helicopter", "highlighter", "hiking", "hippo", "history", "hockey-puck", "holly-berry", "home", "horse", "horse-head", "hospital", "hospital-alt", "hospital-symbol", "hospital-user", "hot-tub", "hotdog", "hotel", "hourglass", "hourglass-end", "hourglass-half", "hourglass-start", "house-damage", "house-user", "hryvnia", "i-cursor", "ice-cream", "icicles", "icons", "id-badge", "id-card", "id-card-alt", "igloo", "image", "images", "inbox", "indent", "industry", "infinity", "info", "info-circle", "italic", "jedi", "joint", "journal-whills", "kaaba", "key", "keyboard", "khanda", "kiss", "kiss-beam", "kiss-wink-heart", "kiwi-bird", "landmark", "language", "laptop", "laptop-code", "laptop-house", "laptop-medical", "laugh", "laugh-beam", "laugh-squint", "laugh-wink", "layer-group", "leaf", "lemon", "less-than", "less-than-equal", "level-down-alt", "level-up-alt", "life-ring", "lightbulb", "link", "lira-sign", "list", "list-alt", "list-ol", "list-ul", "location-arrow", "lock", "lock-open", "long-arrow-alt-down", "long-arrow-alt-left", "long-arrow-alt-right", "long-arrow-alt-up", "low-vision", "luggage-cart", "lungs", "lungs-virus", "magic", "magnet", "mail-bulk", "male", "map", "map-marked", "map-marked-alt", "map-marker", "map-marker-alt", "map-pin", "map-signs", "marker", "mars", "mars-double", "mars-stroke", "mars-stroke-h", "mars-stroke-v", "mask", "medal", "medkit", "meh", "meh-blank", "meh-rolling-eyes", "memory", "menorah", "mercury", "meteor", "microchip", "microphone", "microphone-alt", "microphone-alt-slash", "microphone-slash", "microscope", "minus", "minus-circle", "minus-square", "mitten", "mobile", "mobile-alt", "money-bill", "money-bill-alt", "money-bill-wave", "money-bill-wave-alt", "money-check", "money-check-alt", "monument", "moon", "mortar-pestle", "mosque", "motorcycle", "mountain", "mouse", "mouse-pointer", "mug-hot", "music", "network-wired", "neuter", "newspaper", "not-equal", "notes-medical", "object-group", "object-ungroup", "oil-can", "om", "otter", "outdent", "pager", "paint-brush", "paint-roller", "palette", "pallet", "paper-plane", "paperclip", "parachute-box", "paragraph", "parking", "passport", "pastafarianism", "paste", "pause", "pause-circle", "paw", "peace", "pen", "pen-alt", "pen-fancy", "pen-nib", "pen-square", "pencil-alt", "pencil-ruler", "people-arrows", "people-carry", "pepper-hot", "percent", "percentage", "person-booth", "phone", "phone-alt", "phone-slash", "phone-square", "phone-square-alt", "phone-volume", "photo-video", "piggy-bank", "pills", "pizza-slice", "place-of-worship", "plane", "plane-arrival", "plane-departure", "plane-slash", "play", "play-circle", "plug", "plus", "plus-circle", "plus-square", "podcast", "poll", "poll-h", "poo", "poo-storm", "poop", "portrait", "pound-sign", "power-off", "pray", "praying-hands", "prescription", "prescription-bottle", "prescription-bottle-alt", "print", "procedures", "project-diagram", "pump-medical", "pump-soap", "puzzle-piece", "qrcode", "question", "question-circle", "quidditch", "quote-left", "quote-right", "quran", "radiation", "radiation-alt", "rainbow", "random", "receipt", "record-vinyl", "recycle", "redo", "redo-alt", "registered", "remove-format", "reply", "reply-all", "republican", "restroom", "retweet", "ribbon", "ring", "road", "robot", "rocket", "route", "rss", "rss-square", "ruble-sign", "ruler", "ruler-combined", "ruler-horizontal", "ruler-vertical", "running", "rupee-sign", "sad-cry", "sad-tear", "satellite", "satellite-dish", "save", "school", "screwdriver", "scroll", "sd-card", "search", "search-dollar", "search-location", "search-minus", "search-plus", "seedling", "server", "shapes", "share", "share-alt", "share-alt-square", "share-square", "shekel-sign", "shield-alt", "shield-virus", "ship", "shipping-fast", "shoe-prints", "shopping-bag", "shopping-basket", "shopping-cart", "shower", "shuttle-van", "sign", "sign-in-alt", "sign-language", "sign-out-alt", "signal", "signature", "sim-card", "sink", "sitemap", "skating", "skiing", "skiing-nordic", "skull", "skull-crossbones", "slash", "sleigh", "sliders-h", "smile", "smile-beam", "smile-wink", "smog", "smoking", "smoking-ban", "sms", "snowboarding", "snowflake", "snowman", "snowplow", "soap", "socks", "solar-panel", "sort", "sort-alpha-down", "sort-alpha-down-alt", "sort-alpha-up", "sort-alpha-up-alt", "sort-amount-down", "sort-amount-down-alt", "sort-amount-up", "sort-amount-up-alt", "sort-down", "sort-numeric-down", "sort-numeric-down-alt", "sort-numeric-up", "sort-numeric-up-alt", "sort-up", "spa", "space-shuttle", "spell-check", "spider", "spinner", "splotch", "spray-can", "square", "square-full", "square-root-alt", "stamp", "star", "star-and-crescent", "star-half", "star-half-alt", "star-of-david", "star-of-life", "step-backward", "step-forward", "stethoscope", "sticky-note", "stop", "stop-circle", "stopwatch", "stopwatch-20", "store", "store-alt", "store-alt-slash", "store-slash", "stream", "street-view", "strikethrough", "stroopwafel", "subscript", "subway", "suitcase", "suitcase-rolling", "sun", "superscript", "surprise", "swatchbook", "swimmer", "swimming-pool", "synagogue", "sync", "sync-alt", "syringe", "table", "table-tennis", "tablet", "tablet-alt", "tablets", "tachometer-alt", "tag", "tags", "tape", "tasks", "taxi", "teeth", "teeth-open", "temperature-high", "temperature-low", "tenge", "terminal", "text-height", "text-width", "th", "th-large", "th-list", "theater-masks", "thermometer", "thermometer-empty", "thermometer-full", "thermometer-half", "thermometer-quarter", "thermometer-three-quarters", "thumbs-down", "thumbs-up", "thumbtack", "ticket-alt", "times", "times-circle", "tint", "tint-slash", "tired", "toggle-off", "toggle-on", "toilet", "toilet-paper", "toilet-paper-slash", "toolbox", "tools", "tooth", "torah", "torii-gate", "tractor", "trademark", "traffic-light", "trailer", "train", "tram", "transgender", "transgender-alt", "trash", "trash-alt", "trash-restore", "trash-restore-alt", "tree", "trophy", "truck", "truck-loading", "truck-monster", "truck-moving", "truck-pickup", "tshirt", "tty", "tv", "umbrella", "umbrella-beach", "underline", "undo", "undo-alt", "universal-access", "university", "unlink", "unlock", "unlock-alt", "upload", "user", "user-alt", "user-alt-slash", "user-astronaut", "user-check", "user-circle", "user-clock", "user-cog", "user-edit", "user-friends", "user-graduate", "user-injured", "user-lock", "user-md", "user-minus", "user-ninja", "user-nurse", "user-plus", "user-secret", "user-shield", "user-slash", "user-tag", "user-tie", "user-times", "users", "users-cog", "users-slash", "utensil-spoon", "utensils", "vector-square", "venus", "venus-double", "venus-mars", "vial", "vials", "video", "video-slash", "vihara", "virus", "virus-slash", "viruses", "voicemail", "volleyball-ball", "volume-down", "volume-mute", "volume-off", "volume-up", "vote-yea", "vr-cardboard", "walking", "wallet", "warehouse", "water", "wave-square", "weight", "weight-hanging", "wheelchair", "wifi", "wind", "window-close", "window-maximize", "window-minimize", "window-restore", "wine-bottle", "wine-glass", "wine-glass-alt", "won-sign", "wrench", "x-ray", "yen-sign", "yin-yang"];
    g.invisibleCharacters = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
    g.html_initContentPro = '<div class="sheetsUpdate seiProForm" id="sheetsCompleteEtapaForm" style="display:none"></div>';
    try {
      refreshSeiPageSelectors(g);
    } catch (e) {
    }
    g.__SEI_PRO_FUNCTIONS_STATE_INSTALLED__ = true;
    return g;
  }
  function refreshSeiPageSelectors(g = globalThis) {
    const $2 = g.$ || g.jQuery;
    const adapter = g.SeiPro && g.SeiPro.sei && g.SeiPro.sei.adapter;
    if (typeof $2 !== "function" || !adapter) return g;
    const getIsNewSEI = typeof g.getIsNewSEI === "function" ? g.getIsNewSEI : () => adapter.isNewSEI();
    const getSeiVersionPro2 = g.getSeiVersionPro;
    const compareVersionNumbers2 = g.compareVersionNumbers;
    const getParamsUrlPro2 = g.getParamsUrlPro;
    const localStorageRestorePro2 = g.localStorageRestorePro;
    const isNew = !!getIsNewSEI();
    const version = typeof getSeiVersionPro2 === "function" ? getSeiVersionPro2() : null;
    const gte410 = version && typeof compareVersionNumbers2 === "function" ? compareVersionNumbers2(version, "4.1.0") >= 0 : false;
    const gte5 = version && typeof compareVersionNumbers2 === "function" ? compareVersionNumbers2(version, "5") >= 0 : false;
    g.isNewSEI = isNew;
    g.isSEI_5 = isNew && gte5;
    const lnkInfraUnidade = $2("#lnkInfraUnidade").attr("onclick");
    g.lnkInfraUnidade = lnkInfraUnidade;
    g.infra_unidade_atual = lnkInfraUnidade && typeof getParamsUrlPro2 === "function" ? getParamsUrlPro2(lnkInfraUnidade.split("'")[1]).infra_unidade_atual : null;
    g.siglaUnidadeAtual = adapter.isNewSEI() ? $2("#lnkInfraUnidade").text().trim() : $2("#selInfraUnidades").find("option:selected").text().trim();
    g.frmEditor = adapter.isSEI5() ? $2(".infra-editor__editor-completo") : $2("#frmEditor");
    g.idUnidade = adapter.isNewSEI() ? g.infra_unidade_atual : $2("#selInfraUnidades").val();
    g.divInformacao = adapter.isNewSEI() ? "#divArvoreInformacao" : "#divInformacao";
    g.mainMenu = adapter.isNewSEI() ? "#infraMenu" : "#main-menu";
    g.ancoraArvoreDownload = adapter.isNewSEI() ? "a.ancoraVisualizacaoArvore" : "a.ancoraArvoreDownload";
    g.infraBarraComandos = adapter.isNewSEI() ? ".barraBotoesSEI" : ".infraBarraComandos";
    g.idMenu = adapter.isNewSEI() ? "#divInfraSidebarMenu " + g.mainMenu : "#divInfraAreaTelaE " + g.mainMenu;
    g.infraBarraS = adapter.isNewSEI() ? "#divInfraBarraSistemaPadraoE" : "#divInfraBarraSistemaE";
    g.nameDocInterno = adapter.isNewSEI() ? "documento_interno.svg" : "sei_documento_interno.gif";
    g.nomeInstituicao = adapter.isNewSEI() ? $2("#divInfraBarraSistema h6.infraCorBarraSuperior").eq(0).text().trim() : $2("#divInfraBarraSuperior label").text().trim();
    g.divComandos = adapter.isNewSEI() && gte410 ? "#divBotoesControleProcessos" : "#divComandos";
    g.ifrVisualizacao_ = adapter.isNewSEI() && gte410 ? "ifrConteudoVisualizacao" : "ifrVisualizacao";
    g["$ifrVisualizacao"] = "#" + g.ifrVisualizacao_;
    g.ifrArvoreHtml_ = adapter.isNewSEI() && gte410 ? "ifrVisualizacao" : "ifrArvoreHtml";
    g["$ifrArvoreHtml"] = "#" + g.ifrArvoreHtml_;
    const docTarget = g.ifrVisualizacao_;
    g.seiProArvore = (function() {
      const PROCESS_TARGET = "ifrVisualizacao";
      const DOC_TARGET = docTarget;
      function asEl(x2) {
        if (!x2) return null;
        if (x2.jquery) return x2.get(0) || null;
        if (x2.nodeType === 1) return x2;
        return null;
      }
      function anchorOf(x2) {
        const el = asEl(x2);
        if (!el) return null;
        if (el.matches && el.matches("a.infraArvoreNo")) return el;
        if (el.closest) {
          const w = el.closest("div.infraArvore");
          if (w) return w.querySelector("a.infraArvoreNo");
        }
        if (el.id && /^anchorImg(\d+)$/.test(el.id)) {
          const sib = el.parentNode && el.parentNode.querySelector("#anchor" + RegExp.$1);
          if (sib) return sib;
        }
        return null;
      }
      return {
        SEL_PROCESS: 'a.infraArvoreNo[target="' + PROCESS_TARGET + '"]',
        SEL_DOCUMENT: 'a.infraArvoreNo[target="' + DOC_TARGET + '"]',
        SEL_FOLDER_IMG: 'a[id^="anchorImgPASTA"]',
        isProcessNode(x2) {
          const a = anchorOf(x2);
          return !!(a && a.getAttribute("target") === PROCESS_TARGET);
        },
        isDocumentNode(x2) {
          const a = anchorOf(x2);
          return !!(a && a.getAttribute("target") === DOC_TARGET);
        },
        getNodeIdProc(x2) {
          const a = anchorOf(x2);
          if (!a) return null;
          const m = /^anchor(\d+)$/.exec(a.id || "");
          return m ? m[1] : null;
        },
        getNodeWrapper(x2) {
          const el = asEl(x2);
          return el && el.closest ? el.closest("div.infraArvore") : null;
        }
      };
    })();
    try {
      g._parentSPRO = typeof parent !== "undefined" && typeof parent._P === "function" ? parent._P() : null;
    } catch (e) {
      g._parentSPRO = null;
    }
    const parentSpro = g._parentSPRO;
    g.URL_SPRO = parentSpro && parentSpro.URL_SPRO != null ? parentSpro.URL_SPRO : void 0;
    g.NAMESPACE_SPRO = parentSpro ? parentSpro.NAMESPACE_SPRO : void 0;
    g.URLPAGES_SPRO = parentSpro ? parentSpro.URLPAGES_SPRO : void 0;
    g.VERSION_SPRO = parentSpro ? parentSpro.VERSION_SPRO : void 0;
    g.ICON_SPRO = parentSpro ? parentSpro.ICON_SPRO : void 0;
    if (g.URL_SPRO) g.iconSeiPro = g.URL_SPRO + "icons/menu/seipro.png";
    try {
      g.urlTxtPadrao = $2(g.mainMenu + ' a[href*="acao=texto_padrao_interno_listar"]').attr("href");
    } catch (e) {
    }
    try {
      let userSEI = $2("#hdnInfraPrefixoCookie").val();
      userSEI = typeof userSEI !== "undefined" && userSEI != "" && userSEI.indexOf("_") !== -1 ? userSEI.split("_") : false;
      userSEI = userSEI ? userSEI[userSEI.length - 1] : false;
      g.userSEI = userSEI ? userSEI.toLowerCase() : false;
    } catch (e) {
      g.userSEI = false;
    }
    try {
      g.sortListSaved = typeof localStorageRestorePro2 === "function" && localStorageRestorePro2("tablesorter-savesort") != null ? localStorageRestorePro2("tablesorter-savesort")[window.location.pathname] : false;
    } catch (e) {
      g.sortListSaved = false;
    }
    try {
      if ($2("#sheetsCompleteEtapaForm").length == 0) {
        const host = adapter.isNewSEI() ? "#divInfraBarraSistemaPadrao" : "#divInfraBarraSistema";
        $2(host).append(g.html_initContentPro);
      }
    } catch (e) {
    }
    return g;
  }

  // src/features/sei-functions/domain.js
  var domain_exports = {};
  __export(domain_exports, {
    format2DecimalDomain: () => format2DecimalDomain
  });
  function format2DecimalDomain(v) {
    return Number.isNaN(v = +v) ? "0.00" : v.toFixed(2);
  }

  // src/features/sei-functions/io.js
  var io_exports = {};
  __export(io_exports, {
    getSeiFunctionsNet: () => getSeiFunctionsNet
  });
  function getSeiFunctionsNet(globalRef2 = globalThis) {
    return globalRef2.SeiPro && globalRef2.SeiPro.core && globalRef2.SeiPro.core.net;
  }

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/features/sei-functions/body.js
  var body_exports = {};
  __export(body_exports, {
    CSSJSON: () => CSSJSON,
    DocsToSEI: () => DocsToSEI,
    DragEvent: () => DragEvent,
    ImgToBase64: () => ImgToBase64,
    Resizer: () => Resizer,
    _changeUnidadeSEI: () => _changeUnidadeSEI,
    _infraTooltipMostrar: () => _infraTooltipMostrar,
    _setColorSlimPro: () => _setColorSlimPro,
    addNewItemSelect: () => addNewItemSelect,
    addOptionsEtiqueta: () => addOptionsEtiqueta,
    addTextToTextarea: () => addTextToTextarea,
    addUrgentPro: () => addUrgentPro,
    addUrgenteProcessoPro: () => addUrgenteProcessoPro,
    ajaxDadosDocumentosPro: () => ajaxDadosDocumentosPro,
    ajaxDadosProcessoPro: () => ajaxDadosProcessoPro,
    alertaBoxPro: () => alertaBoxPro,
    appendAutocompleteProc: () => appendAutocompleteProc,
    appendDebugReport: () => appendDebugReport,
    appendIconAIActions: () => appendIconAIActions,
    appendIconBatchActions: () => appendIconBatchActions,
    appendIconBatchDocs: () => appendIconBatchDocs,
    appendIconCompareDocs: () => appendIconCompareDocs,
    appendIconCtrPrescricao: () => appendIconCtrPrescricao,
    appendIconDocCertidao: () => appendIconDocCertidao,
    appendIconDynamicField: () => appendIconDynamicField,
    appendIconFormSheet: () => appendIconFormSheet,
    appendIconIntegrity: () => appendIconIntegrity,
    appendIconNewDoc: () => appendIconNewDoc,
    appendIconPublicacaoEletronica: () => appendIconPublicacaoEletronica,
    appendNewIcons: () => appendNewIcons,
    appendSearchProtocoloSEI: () => appendSearchProtocoloSEI,
    appendStyleNewIcons: () => appendStyleNewIcons,
    appendTooltipOnButtons: () => appendTooltipOnButtons,
    applySignatureBlockSelectionPro: () => applySignatureBlockSelectionPro,
    arrayDadosIframeDocumentosPro: () => arrayDadosIframeDocumentosPro,
    arrayIDProcedimentos: () => arrayIDProcedimentos,
    arrayProtocoloSEI: () => arrayProtocoloSEI,
    arraySheetToJSON: () => arraySheetToJSON,
    arraySheetToJSON_WithRow: () => arraySheetToJSON_WithRow,
    automaticActions: () => automaticActions,
    batchActionsPro: () => batchActionsPro,
    batchActionsSinglePro: () => batchActionsSinglePro,
    bind: () => bind,
    boxCheckNaoAssinados: () => boxCheckNaoAssinados,
    breakDadosProcedimentosControlar: () => breakDadosProcedimentosControlar,
    buildTreeModel: () => buildTreeModel,
    calcFilterResume: () => calcFilterResume,
    calculateHashPro: () => calculateHashPro,
    callInitCheckDadosProcedimentosFrame: () => callInitCheckDadosProcedimentosFrame,
    camposDinamicosProcesso: () => camposDinamicosProcesso,
    cancelDadosProcedimentosControlar: () => cancelDadosProcedimentosControlar,
    cancelTablePaginacao: () => cancelTablePaginacao,
    centralizeDialogBox: () => centralizeDialogBox,
    centralizeDialogBoxEditor: () => centralizeDialogBoxEditor,
    changeColorEtiqueta: () => changeColorEtiqueta,
    changeFlashMenuGeneralPro: () => changeFlashMenuGeneralPro,
    changeFlashMenuPro: () => changeFlashMenuPro,
    changeInputDateTime: () => changeInputDateTime,
    changeInputProtocoloSEI: () => changeInputProtocoloSEI,
    changePanelLabPro: () => changePanelLabPro,
    changePanelLocalStorePro: () => changePanelLocalStorePro,
    changePanelSortColumnsPro: () => changePanelSortColumnsPro,
    changePanelSortPro: () => changePanelSortPro,
    changeSelectHipoteseLegal: () => changeSelectHipoteseLegal,
    changeSlimPro: () => changeSlimPro,
    changeUnidadeSEI: () => changeUnidadeSEI,
    checkDadosIframeDocumentosPro: () => checkDadosIframeDocumentosPro,
    checkDadosIframeProcessoPro: () => checkDadosIframeProcessoPro,
    checkDocAssinatura: () => checkDocAssinatura,
    checkDocImagemPro: () => checkDocImagemPro,
    checkDocVideoPro: () => checkDocVideoPro,
    checkDocZipPro: () => checkDocZipPro,
    checkEtiquetaPriority: () => checkEtiquetaPriority,
    checkFormRequiredPro: () => checkFormRequiredPro,
    checkHostLimit: () => checkHostLimit,
    checkInternalWidthDialogBox: () => checkInternalWidthDialogBox,
    checkLimitText: () => checkLimitText,
    checkLoadJqueryUI: () => checkLoadJqueryUI,
    checkLoadingButtonConfirm: () => checkLoadingButtonConfirm,
    checkMenuSEIPro: () => checkMenuSEIPro,
    checkMenuSistemaView: () => checkMenuSistemaView,
    checkMenuVisible: () => checkMenuVisible,
    checkPageVisualizacao: () => checkPageVisualizacao,
    checkProcessoSigiloso: () => checkProcessoSigiloso,
    checkTipoPrescricaoProcesso: () => checkTipoPrescricaoProcesso,
    checkValue: () => checkValue,
    checkboxRangerSelectShift: () => checkboxRangerSelectShift,
    chosenReparePosition: () => chosenReparePosition,
    cleanHistoryPro: () => cleanHistoryPro,
    cleanPageProgress: () => cleanPageProgress,
    cleanSearchProtocoloSEI: () => cleanSearchProtocoloSEI,
    cleanTimeTest: () => cleanTimeTest,
    closeAllPopups: () => closeAllPopups,
    closeEditorViewBeforeSign: () => closeEditorViewBeforeSign,
    compareChecksumPro: () => compareChecksumPro,
    configFlashMenuPro: () => configFlashMenuPro,
    configFlashMenuTrPro: () => configFlashMenuTrPro,
    confirmaBoxPro: () => confirmaBoxPro,
    confirmaDadosUrgencia: () => confirmaDadosUrgencia,
    confirmaFraseBoxPro: () => confirmaFraseBoxPro,
    controleSortDivPanel: () => controleSortDivPanel,
    convertCSSToStyle: () => convertCSSToStyle,
    copyLinkProcesso: () => copyLinkProcesso,
    copyTablePro: () => copyTablePro,
    copyTextThis: () => copyTextThis,
    copyTextWithBR: () => copyTextWithBR,
    copyToClipboard: () => copyToClipboard,
    copyToClipboardHTML: () => copyToClipboardHTML,
    copyToClipboardWithBR: () => copyToClipboardWithBR,
    corrigeTableSEI: () => corrigeTableSEI,
    decodeHtml: () => decodeHtml,
    dialogCopyNewDoc: () => dialogCopyNewDoc,
    downloadDocumentVisualizacao: () => downloadDocumentVisualizacao,
    downloadLocalFilePro: () => downloadLocalFilePro,
    downloadTableCSV: () => downloadTableCSV,
    downloadTablePro: () => downloadTablePro,
    dragColumnTable: () => dragColumnTable,
    dropzoneCancelInfo: () => dropzoneCancelInfo,
    dynamicColors: () => dynamicColors,
    editFieldProc: () => editFieldProc,
    editFollowDesc: () => editFollowDesc,
    enableButtonSavePro: () => enableButtonSavePro,
    enableConsultasExtras: () => enableConsultasExtras,
    encodeUrlUploadArvore: () => encodeUrlUploadArvore,
    endProcessGroupTable: () => endProcessGroupTable,
    ensureNativeEditorWindowNavigates: () => ensureNativeEditorWindowNavigates,
    errorHandler: () => errorHandler,
    errorHandlerFileSystemOptional: () => errorHandlerFileSystemOptional,
    execArvorePro: () => execArvorePro,
    execConcluirReabrirProcessoPro: () => execConcluirReabrirProcessoPro,
    execIncluirEmBlocoPro: () => execIncluirEmBlocoPro,
    extractDataFormulario: () => extractDataFormulario,
    fileSystemDeleteFile: () => fileSystemDeleteFile,
    fileSystemListFiles: () => fileSystemListFiles,
    fileSystemLoadFile: () => fileSystemLoadFile,
    fileSystemSaveFile: () => fileSystemSaveFile,
    fileSystemUpdateFile: () => fileSystemUpdateFile,
    filterIconsFA: () => filterIconsFA,
    filterTablePro: () => filterTablePro,
    filterTagKanban: () => filterTagKanban,
    filterTagTable: () => filterTagTable,
    filterTagView: () => filterTagView,
    filterTextExtractDate: () => filterTextExtractDate,
    fnJqueryPro: () => fnJqueryPro,
    followSelecionarItens: () => followSelecionarItens,
    forceOnLoadBodyPage: () => forceOnLoadBodyPage,
    forcePlaceHoldChosen: () => forcePlaceHoldChosen,
    formControlerAlterarDocumento: () => formControlerAlterarDocumento,
    formControlerAlterarProcesso: () => formControlerAlterarProcesso,
    format2Decimal: () => format2Decimal,
    fullnameAtribuicao: () => fullnameAtribuicao,
    ganttAutoProgressPercent: () => ganttAutoProgressPercent,
    generateGreetings: () => generateGreetings,
    getAcompanhamentoEspecialAjax: () => getAcompanhamentoEspecialAjax,
    getActionsOnSendProcess: () => getActionsOnSendProcess,
    getAjaxListaAtribuicao: () => getAjaxListaAtribuicao,
    getAjaxListaMarcador: () => getAjaxListaMarcador,
    getAllLinksFolder: () => getAllLinksFolder,
    getArrayDadosHistorico: () => getArrayDadosHistorico,
    getArrayHistorico: () => getArrayHistorico,
    getArvoreInitSignature: () => getArvoreInitSignature,
    getAtribuicaoDisplayLabel: () => getAtribuicaoDisplayLabel,
    getAutomaticActions: () => getAutomaticActions,
    getBase64Image: () => getBase64Image,
    getBatchActionsPro: () => getBatchActionsPro,
    getBlocoProcessoHistorico: () => getBlocoProcessoHistorico,
    getBoundingBox: () => getBoundingBox,
    getChartLabelItemStore: () => getChartLabelItemStore,
    getCheckDadosProcesso: () => getCheckDadosProcesso,
    getCheckerProcessoPro: () => getCheckerProcessoPro,
    getChecksumPro: () => getChecksumPro,
    getCitacaoDoc: () => getCitacaoDoc,
    getColorID: () => getColorID,
    getColorTags: () => getColorTags,
    getColumnsSortable: () => getColumnsSortable,
    getCompareDocs: () => getCompareDocs,
    getConfigHost: () => getConfigHost,
    getContentDocSEI: () => getContentDocSEI,
    getCurrentUserNamePro: () => getCurrentUserNamePro,
    getDadosAjaxMonitoradoPro: () => getDadosAjaxMonitoradoPro,
    getDadosAndamentoPro: () => getDadosAndamentoPro,
    getDadosHistoricoPaginacao: () => getDadosHistoricoPaginacao,
    getDadosHistoricoPro: () => getDadosHistoricoPro,
    getDadosHistoricoUrlPro: () => getDadosHistoricoUrlPro,
    getDadosIframeProcessoPro: () => getDadosIframeProcessoPro,
    getDadosPesquisaPro: () => getDadosPesquisaPro,
    getDadosProcedimentosControlar: () => getDadosProcedimentosControlar,
    getDadosProcessoPro: () => getDadosProcessoPro,
    getDadosProcessoSession: () => getDadosProcessoSession,
    getDataBodyResolveCaptcha: () => getDataBodyResolveCaptcha,
    getDocCertidao: () => getDocCertidao,
    getDocOnArvore: () => getDocOnArvore,
    getDocsArvore: () => getDocsArvore,
    getDocsArvore_fillSelect: () => getDocsArvore_fillSelect,
    getDocumentosActions: () => getDocumentosActions,
    getEditorConfigOptions: () => getEditorConfigOptions,
    getFaviconNrProcesso: () => getFaviconNrProcesso,
    getGanttHistoryProc: () => getGanttHistoryProc,
    getHipoteseLegal: () => getHipoteseLegal,
    getHistoricoProcessoUrlAjax: () => getHistoricoProcessoUrlAjax,
    getHistoryProcessosPro: () => getHistoryProcessosPro,
    getHtmlEtiqueta: () => getHtmlEtiqueta,
    getHtmlListDocumentos: () => getHtmlListDocumentos,
    getHtmlMarcador: () => getHtmlMarcador,
    getIDProtocoloSEI: () => getIDProtocoloSEI,
    getIdProcedimento: () => getIdProcedimento,
    getIfrArvoreDadosProcesso: () => getIfrArvoreDadosProcesso,
    getIframeArvoreElement: () => getIframeArvoreElement,
    getIframeArvoreWindow: () => getIframeArvoreWindow,
    getImageBase64FromImgElement: () => getImageBase64FromImgElement,
    getInteressadosProcesso: () => getInteressadosProcesso,
    getInteressadosProcessoAjax: () => getInteressadosProcessoAjax,
    getIsProcUrgente: () => getIsProcUrgente,
    getLinhaNumerada: () => getLinhaNumerada,
    getLinksAcompanhamento: () => getLinksAcompanhamento,
    getLinksArvoreAjax: () => getLinksArvoreAjax,
    getLinksArvorePro: () => getLinksArvorePro,
    getLinksInText: () => getLinksInText,
    getLinksProcessoAjax: () => getLinksProcessoAjax,
    getLinksProcessoPro: () => getLinksProcessoPro,
    getLisDocsProcessoPro: () => getLisDocsProcessoPro,
    getListDocumentosArvore: () => getListDocumentosArvore,
    getListTypesSEI: () => getListTypesSEI,
    getListaAtribuicaoProcesso: () => getListaAtribuicaoProcesso,
    getListaGruposAcompEsp: () => getListaGruposAcompEsp,
    getLocalFilePro: () => getLocalFilePro,
    getNewDocCompareDocs: () => getNewDocCompareDocs,
    getNomeSei: () => getNomeSei,
    getNumProcesso: () => getNumProcesso,
    getProcessNotificationCountPro: () => getProcessNotificationCountPro,
    getProcessoUnidadePro: () => getProcessoUnidadePro,
    getQRProcesso: () => getQRProcesso,
    getRemoverMarcador: () => getRemoverMarcador,
    getScriptIframe: () => getScriptIframe,
    getSelectAtribuicaoProcesso: () => getSelectAtribuicaoProcesso,
    getSelectHipoteseLegal: () => getSelectHipoteseLegal,
    getSignatureBlockRowsPro: () => getSignatureBlockRowsPro,
    getSignatureBlockTablePro: () => getSignatureBlockTablePro,
    getSignatureColumnIndexPro: () => getSignatureColumnIndexPro,
    getStyleTable: () => getStyleTable,
    getStylesOnEditor: () => getStylesOnEditor,
    getTablePaginacao: () => getTablePaginacao,
    getTiposDocumentosAjax: () => getTiposDocumentosAjax,
    getTreeDocumentIndexById: () => getTreeDocumentIndexById,
    getTreeDocumentsSession: () => getTreeDocumentsSession,
    getTreeIconsViewSession: () => getTreeIconsViewSession,
    getTreeLinkByName: () => getTreeLinkByName,
    getTreeLinkUrlByName: () => getTreeLinkUrlByName,
    getTreeLinksAllSession: () => getTreeLinksAllSession,
    getTreeLinksSession: () => getTreeLinksSession,
    getTreeModelSession: () => getTreeModelSession,
    getTreePageLinksSession: () => getTreePageLinksSession,
    getTreeSignedDocumentsSession: () => getTreeSignedDocumentsSession,
    getTypeSEI: () => getTypeSEI,
    getUnidadesPermissaoSEI: () => getUnidadesPermissaoSEI,
    getUrlNewDocArvore: () => getUrlNewDocArvore,
    goToTextInDoc: () => goToTextInDoc,
    hashCompareDocToggle: () => hashCompareDocToggle,
    hideMenuSEIPro: () => hideMenuSEIPro,
    hideMenuSistemaView: () => hideMenuSistemaView,
    infraMenuSistemaEsquema: () => infraMenuSistemaEsquema,
    infraMenuSistemaEsquemaPro: () => infraMenuSistemaEsquemaPro,
    initAppendIconsDocumentosActions: () => initAppendIconsDocumentosActions,
    initBlocoProcessoHistorico: () => initBlocoProcessoHistorico,
    initBoxAIActions: () => initBoxAIActions,
    initBoxSearchProtocoloSEI: () => initBoxSearchProtocoloSEI,
    initCheckDadosProcedimentos: () => initCheckDadosProcedimentos,
    initCheckDadosProcesso: () => initCheckDadosProcesso,
    initCheckNaoAssinados: () => initCheckNaoAssinados,
    initChosenReplace: () => initChosenReplace,
    initClassicEditor: () => initClassicEditor,
    initDialogCompareDocs: () => initDialogCompareDocs,
    initDocImagemPro: () => initDocImagemPro,
    initDocLoteModalSelecaoDoc: () => initDocLoteModalSelecaoDoc,
    initDocVideoPro: () => initDocVideoPro,
    initDocZipPro: () => initDocZipPro,
    initDownloadLocalFilePro: () => initDownloadLocalFilePro,
    initFileSystem: () => initFileSystem,
    initGanttHistoryProc: () => initGanttHistoryProc,
    initListTypesSEI: () => initListTypesSEI,
    initLoadLocalFilePro: () => initLoadLocalFilePro,
    initLoadSeiProArvore: () => initLoadSeiProArvore,
    initMenuSEISortable: () => initMenuSEISortable,
    initMergeAllAndamentosProcesso: () => initMergeAllAndamentosProcesso,
    initModalNewSEISigiloso: () => initModalNewSEISigiloso,
    initMoveIconDeleteToEnd: () => initMoveIconDeleteToEnd,
    initNameConst: () => initNameConst,
    initPanelResize: () => initPanelResize,
    initResizeImg: () => initResizeImg,
    initSearchProtocoloSEI: () => initSearchProtocoloSEI,
    initTablePaginacaoHistorico: () => initTablePaginacaoHistorico,
    initToolbarOnTop: () => initToolbarOnTop,
    initUrlExtension: () => initUrlExtension,
    initWithRetry: () => initWithRetry,
    insertActionHipoteseLegal: () => insertActionHipoteseLegal,
    insertActionInteressadosSend: () => insertActionInteressadosSend,
    insertIconAIActions: () => insertIconAIActions,
    insertIconBatchActions: () => insertIconBatchActions,
    insertIconBatchDocs: () => insertIconBatchDocs,
    insertIconCompareDocs: () => insertIconCompareDocs,
    insertIconDocCertidao: () => insertIconDocCertidao,
    insertIconDynamicField: () => insertIconDynamicField,
    insertIconFormSheet: () => insertIconFormSheet,
    insertIconIntegrity: () => insertIconIntegrity,
    insertIconNewDoc: () => insertIconNewDoc,
    insertIconNewTab: () => insertIconNewTab,
    insertIconPublicacaoEletronica: () => insertIconPublicacaoEletronica,
    insertNewIcons: () => insertNewIcons,
    insertTooltipOnButtons: () => insertTooltipOnButtons,
    invertCompareDoc: () => invertCompareDoc,
    isDialogDraggable: () => isDialogDraggable,
    keyFollowDesc: () => keyFollowDesc,
    limitConfigValue: () => limitConfigValue,
    loadCSSResize: () => loadCSSResize,
    loadDBClickResizeIframeArvore: () => loadDBClickResizeIframeArvore,
    loadDocVideoPro: () => loadDocVideoPro,
    loadDocZipPro: () => loadDocZipPro,
    loadFunctionEditorView: () => loadFunctionEditorView,
    loadGoogleDocs: () => loadGoogleDocs,
    loadLocalFilePro: () => loadLocalFilePro,
    loadResizeIframeArvoreNewSEI: () => loadResizeIframeArvoreNewSEI,
    loadScriptArvorePro: () => loadScriptArvorePro,
    loadScriptPro: () => loadScriptPro,
    loadScriptVisualizacaoPro: () => loadScriptVisualizacaoPro,
    loadingButtonConfirm: () => loadingButtonConfirm,
    loopIDProcedimentos: () => loopIDProcedimentos,
    loopIDProtocoloSEI: () => loopIDProtocoloSEI,
    markdownToHTML: () => markdownToHTML,
    menuSEISortable: () => menuSEISortable,
    mergeAllAndamentosProcesso: () => mergeAllAndamentosProcesso,
    moveIconDeleteToEnd: () => moveIconDeleteToEnd,
    newTabDadosProcedimentosControlar: () => newTabDadosProcedimentosControlar,
    noNotifyPro: () => noNotifyPro,
    normalizeAreaTela: () => normalizeAreaTela,
    normalizeTreeDocuments: () => normalizeTreeDocuments,
    observeNewTabDados: () => observeNewTabDados,
    openBoxIconsFA: () => openBoxIconsFA,
    openCamposDinamicosForm: () => openCamposDinamicosForm,
    openCheckNaoAssinados: () => openCheckNaoAssinados,
    openChecksumPro: () => openChecksumPro,
    openColorEtiqueta: () => openColorEtiqueta,
    openConfigBoxPro: () => openConfigBoxPro,
    openDialogAnexo: () => openDialogAnexo,
    openDialogCompareDocs: () => openDialogCompareDocs,
    openDialogDoc: () => openDialogDoc,
    openDocZipPro: () => openDocZipPro,
    openEditorDoc: () => openEditorDoc,
    openEditorViewDoc: () => openEditorViewDoc,
    openFileZip: () => openFileZip,
    openLinkNewTab: () => openLinkNewTab,
    openLinkSEIPro: () => openLinkSEIPro,
    openSEINrPro: () => openSEINrPro,
    openStyleBoxSlimPro: () => openStyleBoxSlimPro,
    openStyleBoxSlimPro_: () => openStyleBoxSlimPro_,
    openWindowEditor: () => openWindowEditor,
    patchNativeEditorOpen: () => patchNativeEditorOpen,
    positionElement: () => positionElement,
    printDocumento: () => printDocumento,
    pullDadosProcessoSession: () => pullDadosProcessoSession,
    refreshDocViewArvorePro: () => refreshDocViewArvorePro,
    reloadModalLink: () => reloadModalLink,
    rememberScroll: () => rememberScroll,
    removeTreeDocumentById: () => removeTreeDocumentById,
    renderSignatureBlockSelectionPro: () => renderSignatureBlockSelectionPro,
    repareStickColumnsSortable: () => repareStickColumnsSortable,
    replaceColorsIcons: () => replaceColorsIcons,
    replaceNewIcons: () => replaceNewIcons,
    replaceSelectAllVisualizacao: () => replaceSelectAllVisualizacao,
    replaceTextToProcessoSEI: () => replaceTextToProcessoSEI,
    resetDialogBoxPro: () => resetDialogBoxPro,
    resizeArvoreMaxWidth: () => resizeArvoreMaxWidth,
    resizeElement: () => resizeElement,
    resizeHeigthDialogBox: () => resizeHeigthDialogBox,
    resizeWinArvore: () => resizeWinArvore,
    resolveCaptchaAI: () => resolveCaptchaAI,
    resolveProcessoSessionId: () => resolveProcessoSessionId,
    restrictConfigValue: () => restrictConfigValue,
    romanToInt: () => romanToInt,
    sanitizeHTML: () => sanitizeHTML,
    saveConfigEtiqueta: () => saveConfigEtiqueta,
    saveFollowDesc: () => saveFollowDesc,
    saveFollowEtiqueta: () => saveFollowEtiqueta,
    saveNewItemSelect: () => saveNewItemSelect,
    saveOrderMenuSEISortable: () => saveOrderMenuSEISortable,
    scriptVisualizacaoPro: () => scriptVisualizacaoPro,
    scrollToElement: () => scrollToElement,
    scrollToElementArvore: () => scrollToElementArvore,
    selectIconEtiqueta: () => selectIconEtiqueta,
    selectTextPro: () => selectTextPro,
    sendChecksumPro: () => sendChecksumPro,
    setAppendIconsDocumentosActions: () => setAppendIconsDocumentosActions,
    setArrayIDProcedimentos: () => setArrayIDProcedimentos,
    setBtnRight: () => setBtnRight,
    setCapaProcesso: () => setCapaProcesso,
    setCaretPosition: () => setCaretPosition,
    setChartLabelItemStore: () => setChartLabelItemStore,
    setClickUrlAmigavel: () => setClickUrlAmigavel,
    setColorSlimPro: () => setColorSlimPro,
    setConfigHost: () => setConfigHost,
    setDarkModePro: () => setDarkModePro,
    setDataDocs: () => setDataDocs,
    setFileSystem: () => setFileSystem,
    setHistoryProcessosPro: () => setHistoryProcessosPro,
    setHtmlProtocoloAlterar: () => setHtmlProtocoloAlterar,
    setIconLabel: () => setIconLabel,
    setIconLoadinBtnSEI: () => setIconLoadinBtnSEI,
    setInfraImg: () => setInfraImg,
    setInteressadosSend: () => setInteressadosSend,
    setLocalFilePro: () => setLocalFilePro,
    setMenuSistemaView: () => setMenuSistemaView,
    setMomentPtBr: () => setMomentPtBr,
    setNameConst: () => setNameConst,
    setNewDoc: () => setNewDoc,
    setNewDocDefault: () => setNewDocDefault,
    setNewDocSigilo: () => setNewDocSigilo,
    setNewProc: () => setNewProc,
    setNewProcDefault: () => setNewProcDefault,
    setOrderMenuSEISortable: () => setOrderMenuSEISortable,
    setPanelResize: () => setPanelResize,
    setPlaceHoldChosen: () => setPlaceHoldChosen,
    setProcessGroupTable: () => setProcessGroupTable,
    setProgressBarOnProcesso: () => setProgressBarOnProcesso,
    setReplaceSelectAllVisualizacao: () => setReplaceSelectAllVisualizacao,
    setResizeAreaTelaD: () => setResizeAreaTelaD,
    setResizeArvoreMaxWidth: () => setResizeArvoreMaxWidth,
    setResizeIfrArvore: () => setResizeIfrArvore,
    setSelectUnidadePro: () => setSelectUnidadePro,
    setSessionProcessosPro: () => setSessionProcessosPro,
    setSizeIframePro: () => setSizeIframePro,
    setSortDivPanel: () => setSortDivPanel,
    setSortLocaleCompare: () => setSortLocaleCompare,
    setTabelaPanelScrollHeight: () => setTabelaPanelScrollHeight,
    showFollowEtiqueta: () => showFollowEtiqueta,
    showMenuSEIPro: () => showMenuSEIPro,
    sugestEtiquetaPro: () => sugestEtiquetaPro,
    sumTagValue: () => sumTagValue,
    syncProcessNotificationsPro: () => syncProcessNotificationsPro,
    syncTreeModelSession: () => syncTreeModelSession,
    targetIfrVisualizacaoPro: () => targetIfrVisualizacaoPro,
    togglePainelPro: () => togglePainelPro,
    toggleSignatureCheckboxPro: () => toggleSignatureCheckboxPro,
    toggleTablePro: () => toggleTablePro,
    toogleByID: () => toogleByID,
    updateButtonConfirm: () => updateButtonConfirm,
    updateChecksumPro: () => updateChecksumPro,
    updateCountnewFiltro: () => updateCountnewFiltro,
    updateDadosArvore: () => updateDadosArvore,
    updateDadosArvoreIframe: () => updateDadosArvoreIframe,
    updateDadosArvoreMult: () => updateDadosArvoreMult,
    updateDadosArvoreMultIframe: () => updateDadosArvoreMultIframe,
    updateDadosProcesso: () => updateDadosProcesso,
    updateDatesRange: () => updateDatesRange,
    updateDialogDefinitionPro: () => updateDialogDefinitionPro,
    updateInputDateTime: () => updateInputDateTime,
    updateProcessGroupTable: () => updateProcessGroupTable,
    updateTitlePage: () => updateTitlePage,
    updateTreeDocumentById: () => updateTreeDocumentById,
    updateUrlPage: () => updateUrlPage,
    userTyped: () => userTyped,
    validarTagsPro: () => validarTagsPro,
    viewEspecifacaoProcesso: () => viewEspecifacaoProcesso,
    waitLoadPro: () => waitLoadPro,
    waitLoadProSimple: () => waitLoadProSimple,
    zoomImagemPro: () => zoomImagemPro
  });

  // src/shared/sei-editor-url.js
  var EDITOR_URL_RE = /controlador\.php\?acao=editor_montar[^'"\s<>]*/gi;
  function getUrlDocumentoId(url) {
    const m = String(url || "").match(/[?&]id_documento=([^&]*)/i);
    if (!m) return "";
    return String(m[1] || "").trim();
  }
  function isValidEditorMontarUrl(url) {
    const s = String(url || "");
    if (s.indexOf("acao=editor_montar") === -1) return false;
    return /^\d+$/.test(getUrlDocumentoId(s));
  }
  function editorWindowNeedsNavigate(href) {
    const s = String(href || "");
    if (!s || s === "about:blank") return true;
    if (s.indexOf("acao=editor_montar") === -1) return true;
    return !isValidEditorMontarUrl(s);
  }
  function repairEditorMontarUrl(url, documentId, baseUrl = "") {
    const id = String(documentId || "").trim();
    if (!/^\d+$/.test(id)) return null;
    const raw = String(url || "").trim();
    if (!raw) return null;
    try {
      const parsed = new URL(raw, baseUrl || "https://sei.invalid/");
      parsed.searchParams.set("acao", "editor_montar");
      parsed.searchParams.set("id_documento", id);
      const absolute = /^[a-z][a-z\d+.-]*:/i.test(raw);
      return absolute ? parsed.href : `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (error) {
      return null;
    }
  }
  function resolveJsNumericVar(src, varName) {
    if (!varName) return "";
    const re = new RegExp(
      "(?:(?:var|let|const)\\s+)?" + varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + `\\s*=\\s*['"]?(\\d+)['"]?`,
      "i"
    );
    const m = String(src || "").match(re);
    return m ? m[1] : "";
  }
  function extractEditorMontarUrl(text) {
    const src = String(text || "");
    let best = null;
    const re = new RegExp(EDITOR_URL_RE.source, "gi");
    let m;
    while ((m = re.exec(src)) !== null) {
      const cand = m[0].replace(/\\+$/g, "");
      if (isValidEditorMontarUrl(cand)) best = cand;
    }
    if (best) return best;
    const concat = src.match(
      /'(controlador\.php\?acao=editor_montar[^']*id_documento=)'\s*\+\s*([A-Za-z_$][\w$]*)\s*\+\s*'([^']*)'/i
    );
    if (concat) {
      const id = resolveJsNumericVar(src, concat[2]);
      if (id) {
        const stitched = concat[1] + id + concat[3];
        if (isValidEditorMontarUrl(stitched)) return stitched;
      }
    }
    return null;
  }

  // src/shared/table-styles.js
  function getColorID() {
    var colorID = {
      color1: {
        light: "#dddddd",
        dark: "#646464"
      },
      color2: {
        light: "#e2daf1",
        dark: "#7b54c0"
      },
      color3: {
        light: "#eed7e9",
        dark: "#b1489c"
      },
      color4: {
        light: "#f2d7dc",
        dark: "#c2495e"
      },
      color5: {
        light: "#ecdacf",
        dark: "#a85723"
      },
      color6: {
        light: "#dfdfc8",
        dark: "#6e6b06"
      },
      color7: {
        light: "#d1e2cc",
        dark: "#2f7c16"
      },
      color8: {
        light: "#c9e4d7",
        dark: "#0a824a"
      },
      color9: {
        light: "#cae2e6",
        dark: "#0e7a8b"
      },
      color10: {
        light: "#d4def0",
        dark: "#3b68b9"
      }
    };
    return colorID;
  }
  function getStyleTable(color, width = 80) {
    var styleTable = {
      tableStyle1: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "",
        tr: "",
        td_head: "background-color: " + color.light + ";",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle2: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "background-color: " + color.light + ";",
        tr: ["", "background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle3: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%; border-left: none;border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + "; border-right: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle4: {
        table: "border-collapse:collapse; margin-left:auto;margin-right:auto;width:" + width + "%;border: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "border-left: none; border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle5: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%;border: none;",
        tr_head: "border: none;",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle6: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%; border: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "background-color: " + color.light + ";",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "background-color: " + color.light + "; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle7: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "border-bottom: 3px solid " + color.dark + ";",
        tr: "",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle8: {
        table: "border-collapse:collapse; border-bottom: 1px solid " + color.dark + "; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:" + width + "%;",
        tr_head: "border-bottom: 3px solid " + color.dark + ";",
        tr: "",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "border-left: 1px solid " + color.dark + ";",
        td_first: "border-right: none;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle9: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto;width:" + width + "%; border: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "border: 1px solid " + color.dark + ";",
        td_first: "border-left: none;border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle10: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "color: #fff;",
        tr: "",
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle11: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%; border: none;",
        tr_head: "color: #fff; border: 1px solid " + color.dark + "; border-bottom: 1px solid #fff !important",
        tr: "border: none;",
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "background-color: " + color.light + "; border-bottom: 1px solid #fff; border-right: 1px solid #fff",
        td_first: "color: #fff;background-color: " + color.dark + "; border: 1px solid " + color.dark + "; border-bottom: 1px solid #fff !important;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle12: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "background-color: " + color.light + "; border-bottom: 3px solid " + color.dark + ";",
        tr: "",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle13: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto ;width:" + width + "%; border: none;",
        tr_head: "background-color: " + color.light + "; border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border: none;",
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "border: 1px solid " + color.dark + ";",
        td_first: "border-left: none;border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle14: {
        table: "border-collapse:collapse;margin-left:auto;margin-right:auto;width:" + width + "%;border: none;",
        tr_head: "background-color: " + color.light + "; border-bottom: 1px solid " + color.dark + ";",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle15: {
        table: "border-collapse:collapse;margin-left:auto;margin-right:auto;width:" + width + "%;border-left: none; border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + "; border-right: none;",
        tr_head: "border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: "border-bottom: 1px solid " + color.dark + ";",
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle16: {
        table: "border-collapse:collapse; border-color:" + color.dark + "; margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "color: #fff;",
        tr: "",
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "border: none;",
        td_first: "border: none;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle17: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto;width:" + width + "%;",
        tr_head: "color: #fff;",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "border: none;",
        td_first: "border: none;",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle18: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto; width:" + width + "%;border: none;",
        tr_head: "color: #fff; border: 1px solid " + color.dark + "; border-bottom: 3px solid #fff !important",
        tr: ["border: none; background-color: " + color.light + ";", "color: #fff; border: none; background-color: " + color.dark + ";"],
        td_head: "background-color: " + color.dark + ";",
        td_head_p: "Texto_Centralizado",
        td: "border:none;",
        td_first: "border: none; border-right: 3px solid #fff",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle19: {
        table: "border-collapse:collapse; margin-left:auto; margin-right:auto;width:" + width + "%; border-left: none;border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + "; border-right: none;",
        tr_head: "background-color: " + color.light + "; border-bottom: 1px solid " + color.dark + ";",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle20: {
        table: "border-collapse:collapse; margin-left:auto;margin-right:auto;width:" + width + "%;border: none;",
        tr_head: "background-color: " + color.light + "; border-top: 1px solid " + color.dark + "; border-bottom: 1px solid " + color.dark + ";",
        tr: ["border: none;", "border: none; background-color: " + color.light + ";"],
        td_head: "",
        td_head_p: "Texto_Centralizado",
        td: "",
        td_first: "border-left: none; border-top: none;border-bottom: none;border-right: 1px solid " + color.dark + ";",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      },
      tableStyle21: {
        table: "border-collapse:collapse; border-color:" + color.dark + ";margin-left:auto; margin-right:auto; width:" + width + "%;",
        tr_head: "",
        tr: "",
        td_head: "",
        td_head_p: "Tabela_Texto_Alinhado_Esquerda",
        td: "",
        td_first: "",
        td_p: "Tabela_Texto_Alinhado_Esquerda"
      }
    };
    return styleTable;
  }

  // src/features/sei-functions/body.js
  installSeiFunctionsState();
  var sanitizeHTML = (html) => DOMPurify.sanitize(html, {
    ADD_ATTR: ["target"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|chrome-extension|moz-extension):|[^a-z]|[a-z+\-.]+(?:[^a-z+\-.:]|$))/i
  });
  var format2Decimal = (v) => isNaN(v = +v) ? "0.00" : v.toFixed(2);
  function getIframeArvoreElement() {
    var ifrArvore = $("#ifrArvore");
    return ifrArvore.length > 0 && typeof ifrArvore[0] !== "undefined" && ifrArvore[0] ? ifrArvore[0] : null;
  }
  function getIframeArvoreWindow() {
    var ifrArvore = getIframeArvoreElement();
    return ifrArvore && ifrArvore.contentWindow ? ifrArvore.contentWindow : null;
  }
  var initWithRetry = ({
    timeout = 9e3,
    interval = 500,
    debugLabel = "",
    condition = () => true,
    fnName = "",
    param = null
  }) => {
    if (timeout <= 0) return;
    if (typeof condition === "function" && condition()) {
      try {
        if (typeof param === "function") {
          param();
        } else if (fnName && typeof window[fnName] === "function") {
          window[fnName](param);
        }
      } catch (error) {
        console.error(`Erro ao executar ${debugLabel || fnName}:`, error);
      }
    } else {
      setTimeout(() => {
        initWithRetry({
          timeout: timeout - 100,
          interval,
          debugLabel,
          condition,
          fnName,
          param
        });
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) {
          console.log(`Reload ${debugLabel || fnName} => ${timeout}`);
        }
      }, interval);
    }
  };
  var getNumProcesso = () => {
    const num_processo = $("#ifrArvore").length ? $("#ifrArvore").contents().find(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim() : dadosProcessoPro.propProcesso.hdnProtocoloFormatado;
    return num_processo;
  };
  var getIdProcedimento = () => {
    let id_procedimento = $("#ifrArvore").length ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : getParamsUrlPro(window.location.href).id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
    return id_procedimento ?? false;
  };
  function setCaretPosition(elem, caretPos) {
    if (elem != null) {
      if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.move("character", caretPos);
        range.select();
      } else {
        if (elem.selectionStart) {
          elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
        } else {
          elem.focus();
        }
      }
    }
  }
  function getIsProcUrgente() {
    isProcUrgente = typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.propProcesso !== "undefined" && typeof dadosProcessoPro.propProcesso.txtDescricao !== "undefined" ? dadosProcessoPro.propProcesso.txtDescricao : false;
    isProcUrgente = typeof isProcUrgente !== "undefined" && isProcUrgente && isProcUrgente.toLowerCase().indexOf("(urgente)") !== -1 ? true : false;
    return isProcUrgente;
  }
  function dropzoneCancelInfo(e) {
    if (typeof e !== "undefined") {
      e.stopImmediatePropagation();
    }
    $(containerUpload).removeClass("dz-drag-hover");
    return false;
  }
  function encodeUrlUploadArvore(response, params) {
    var id = response[0];
    var nome = response[1];
    var dthora = response[4];
    var tamanho = response[3];
    var tamanho_formatado = infraFormatarTamanhoBytes(parseInt(tamanho));
    var plus = "\xB1";
    var hdnAnexos = id + plus + nome + plus + dthora + plus + tamanho + plus + tamanho_formatado + plus + params.userUnidade.user + plus + params.userUnidade.unidade;
    hdnAnexos = hdnAnexos.indexOf(" ") !== -1 ? hdnAnexos.replace(/ /g, "+") : hdnAnexos;
    hdnAnexos = encodeURIComponent(hdnAnexos);
    hdnAnexos = hdnAnexos.indexOf("%C2") !== -1 ? hdnAnexos.replace(/%C2/g, "") : hdnAnexos;
    hdnAnexos = hdnAnexos.indexOf("%2B") !== -1 ? hdnAnexos.replace(/%2B/g, "+") : hdnAnexos;
    return hdnAnexos;
  }
  function getConfigHost(callback = false, callback_else = false) {
    var hosts = URL_SPRO + "config_hosts.json";
    fetch(hosts).then((response) => response.json()).then((json) => setConfigHost(json, callback, callback_else));
  }
  function setConfigHost(host, callback, callback_else, save = true) {
    var set_host = false;
    if (typeof host !== "undefined" && host !== null && typeof host.matches !== "undefined" && host.matches !== null && host.matches.length > 0) {
      for (i = 0; i < host.matches.length; i++) {
        if (window.location.host.indexOf(host.matches[i]) !== -1) set_host = true;
      }
    }
    if (set_host && typeof callback === "function") {
      callback();
    } else if (!set_host && typeof callback_else === "function") {
      callback_else();
    }
    if (save) sessionStorage.setItem("configHost_Pro", JSON.stringify(host));
  }
  function initUrlExtension(url) {
    if (typeof getUrlExtension === "function") {
      return getUrlExtension(url);
    } else if (typeof URL_SPRO !== "undefined") {
      return URL_SPRO + url;
    }
  }
  function calcFilterResume(table) {
    table.find(".filterResume").each(function() {
      var data = $(this).data();
      var total = $(".filterResume_" + data.resumetype + ":visible").map(function(v) {
        if ($(this).text() != "") return parseFloat($(this).text());
      }).get();
      var count = $(".filterResume_" + data.resumetype + ":visible").map(function(v) {
        if ($(this).text() != "") return $(this).text().trim();
      }).get();
      var dist = count.length > 0 ? uniqPro(count).length : 0;
      var sum = total.reduce(function(a, b) {
        return a + b;
      }, 0);
      var avg = sum / total.length || 0;
      var result = data.resumemod == "avg" ? avg.toFixed(2) + " <sup>[MED]</sup>" : sum.toFixed(2) + " <sup>[TOTAL]</sup>";
      result = data.resumemod == "dist" ? dist + " <sup>[DIST]</sup>" : result;
      $(this).html(result);
    });
  }
  function checkProcessoSigiloso(content = $("html")) {
    var id_protocolo = getParamsUrlPro(window.location.href).id_procedimento;
    var check = content.find("script").map(function(v) {
      if (typeof $(this).attr("src") == "undefined" && $(this).html().indexOf("usuario_validar_acesso") !== -1) {
        return true;
      }
    }).get();
    check = check.length ? check[0] : false;
    var checkSession = typeof id_protocolo !== "undefined" && sessionStorageRestorePro("processo_sigiloso_" + id_protocolo) !== null ? true : false;
    var _return = checkSession || check ? true : false;
    return _return;
  }
  function getStylesOnEditor() {
    var styles = false;
    $("script").each(function() {
      if (typeof $(this).attr("src") == "undefined" && $(this).html().indexOf("stylesheetParser_validSelectors") !== -1) {
        var text = $(this).html();
        styles = text.indexOf("/") === -1 ? false : $.map(text.split("/"), function(v) {
          return v.indexOf("(") !== -1 ? v.replace("(p)", "").match(/\(([^)]+)\)/) : null;
        });
        styles = styles ? styles.map(function(v) {
          return v.replace("(", "").replace(")", "");
        }) : false;
        styles = styles ? styles.join("|").replace(":before", "").replace("||", "|").replace(/\\r\\n/g, "") : false;
        styles = styles && styles.indexOf("|") !== -1 ? uniqPro(styles.split("|")) : false;
        styles = styles ? styles.filter(function(v) {
          return v.indexOf("before") === -1;
        }) : false;
      }
    });
    if (styles) {
      setOptionsPro("stylesEditor", styles);
    } else {
      removeOptionsPro("stylesEditor");
    }
  }
  function filterTextExtractDate(elem, table, cellIndex) {
    var text = $(elem).text();
    if ($(table).find('tr.tablesorter-headerRow th.tablesorter-header[data-column="' + cellIndex + '"]').text().toLowerCase().indexOf("data") !== -1) {
      text = text.indexOf(":") !== -1 ? moment(text, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : moment(text, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
    return text;
  }
  var romanToInt = function(s) {
    const mapRoman = /* @__PURE__ */ new Map();
    mapRoman.set("I", 1);
    mapRoman.set("V", 5);
    mapRoman.set("X", 10);
    mapRoman.set("L", 50);
    mapRoman.set("C", 100);
    mapRoman.set("D", 500);
    mapRoman.set("M", 1e3);
    var result = 0;
    if (s) {
      var s1 = s.split("");
      s1.forEach(function(e, i2) {
        result += mapRoman.get(e) < mapRoman.get(s1[i2 + 1]) ? -mapRoman.get(e) : mapRoman.get(e);
      });
    }
    return result;
  };
  function reloadModalLink() {
    if (typeof $.modalLink !== "undefined") return;
    var urlModalink = $("head").find('script[src*="modalLink"]');
    urlModalink = typeof urlModalink !== "undefined" ? urlModalink.attr("src") : false;
    if (urlModalink) {
      $.getScript(urlModalink);
    }
  }
  function checkLoadJqueryUI(callback = false) {
    if (typeof jQuery.ui === "undefined") {
      $.getScript(URL_SPRO + "js/lib/jquery-ui.min.js", function() {
        if (typeof callback === "function") callback();
      });
      loadStylePro(URL_SPRO + "css/jquery-ui.css");
    } else if (typeof callback === "function") {
      callback();
    }
  }
  function checkValue(elem) {
    var len = typeof elem.val() !== "undefined" && elem.val() !== null ? elem.val().trim().length : 0;
    return len > 0 ? true : false;
  }
  function goToTextInDoc(pesquisaTexto) {
    var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml);
    var urlDoc = ifrArvoreHtml.attr("src");
    urlDoc = urlDoc.indexOf("#") !== -1 ? urlDoc.split("#")[0] : urlDoc;
    ifrArvoreHtml.attr("src", urlDoc + "#:~:text=" + encodeURIComponent(pesquisaTexto));
  }
  String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
  };
  function getChartLabelItemStore(idElem, chartObj) {
    if (getOptionsPro(idElem + "_canvas")) {
      var arrayLabels = getOptionsPro(idElem + "_canvas");
      arrayLabels.forEach(function(value, i2) {
        if (typeof chartObj.getDatasetMeta(0) === "object") {
          var _meta = chartObj.config.type == "pie" || chartObj.config.type == "doughnut" || chartObj.config.type == "line" ? typeof chartObj.getDatasetMeta(0).data[value.index] !== "undefined" ? chartObj.getDatasetMeta(0).data[value.index] : false : typeof chartObj.getDatasetMeta(value.index) !== "undefined" ? chartObj.getDatasetMeta(value.index) : false;
          if (_meta && typeof _meta === "object" && typeof _meta.hidden !== "undefined" && (value.hidden || value.hidden === null)) {
            _meta.hidden = value && value.hasOwnProperty("hidden") ? value.hidden : null;
          }
        }
      });
      chartObj.update();
    }
  }
  function replaceTextToProcessoSEI(text) {
    var Rexp = /(\d{5}\.?\d{6}\/?\d{4}\-?\d{2})/igm;
    var urlSEI = url_host.replace("controlador.php", "");
    return text.replace(Rexp, "<a href='" + urlSEI + "#$1' target='_blank'>$1</a>");
  }
  function setChartLabelItemStore(e, legendItem) {
    var ci = this.chart;
    var is_line = typeof legendItem.datasetIndex !== "undefined" ? true : false;
    var index = is_line ? legendItem.datasetIndex : legendItem.index;
    var _meta = is_line ? ci.getDatasetMeta(index) : ci.getDatasetMeta(0).data[index];
    var _metas = is_line ? ci.data.datasets : ci.data.datasets[0].data;
    var alreadyHidden = _meta.hidden === null ? false : _meta.hidden;
    if (alreadyHidden) {
      _meta.hidden = null;
    } else {
      _meta.hidden = true;
    }
    var arrayMetaChart = [];
    _metas.forEach(function(e2, i2) {
      var meta = is_line ? ci.getDatasetMeta(i2) : ci.getDatasetMeta(0).data[i2];
      arrayMetaChart.push({ index: i2, hidden: meta.hidden });
    });
    ci.update();
    setOptionsPro($(this.chart.canvas).attr("id"), arrayMetaChart);
  }
  function appendDebugReport(comAnimacao = false) {
    if (!isSEIProPRFHost()) {
      $(".iconDebugScreen").remove();
      return;
    }
    var animacao = comAnimacao ? "animation: 2s ease 0s infinite normal none running whitepulser;" : "";
    var tooltip = comAnimacao ? "Erro detectado - clique para notificar" : "Reportar problema ou sugest\xE3o";
    var htmlIconDebug = `<i onclick="dialogDebugScreen()" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('` + tooltip + `')" class="fas fa-bug brancoColor iconDebugScreen" style="float:none;font-size:14pt;margin-left:0;cursor:pointer;opacity:1;border-radius:50%;line-height:1;transition:color .15s ease,opacity .15s ease;` + animacao + '"></i>';
    $(".iconDebugScreen").remove();
    $('div[data-ref="infraAcaoBarraSistema"]').append(htmlIconDebug);
  }
  function userTyped(this_) {
    $(this_).data("user-typed", $(this_).val().trim() == "" ? false : true);
  }
  function dragColumnTable(elemTable) {
    var local = {};
    local.containment = "parent";
    local.revert = true;
    elemTable.find("thead th").not(".sorter-false").draggable(local);
    elemTable.find("thead th").not(".sorter-false").droppable({
      drop: dropZone
    });
    function dropZone(myEvent, myUI) {
      var head = {};
      head.dragIndex = myUI.draggable.index();
      head.dropIndex = $(this).index();
      head.rows = $(this).closest("thead").find("tr");
      head.cellIndex = head.rows.find("th").length - 1;
      head.rows.each(processTableHeaderRows);
      function processTableHeaderRows(index, element) {
        var row = {};
        row.tr = $(element);
        row.drag = row.tr.find("th:eq(" + head.dragIndex + ")");
        row.drop = row.tr.find("th:eq(" + head.dropIndex + ")");
        if (head.dropIndex === head.cellIndex) {
          row.drag.detach().insertAfter(row.drop);
        } else {
          row.drag.detach().insertBefore(row.drop);
        }
      }
      $(this).closest("table").find("tbody > tr").each(processRows);
      function processRows(index, element) {
        var row = {};
        row.tr = $(element);
        row.drag = row.tr.find("td:eq(" + head.dragIndex + ")");
        row.drop = row.tr.find("td:eq(" + head.dropIndex + ")");
        if (head.dropIndex === head.cellIndex) {
          row.drag.detach().insertAfter(row.drop);
        } else {
          row.drag.detach().insertBefore(row.drop);
        }
      }
      setOptionsPro("panelAtividadesViewTableSort", getColumnsSortable(elemTable));
      setTimeout(function() {
        repareStickColumnsSortable(elemTable, true);
      }, 500);
    }
    repareStickColumnsSortable(elemTable);
    setTimeout(function() {
      if (elemTable.find("thead tr").is(":hidden")) {
        repareStickColumnsSortable(elemTable, true);
      }
    }, 500);
  }
  function repareStickColumnsSortable(elemTable, refresh = false) {
    elemTable.find("thead tr.headerStick").remove();
    var headerStick = elemTable.find("thead tr.tableHeader").clone(true, true).addClass("headerStick").hide();
    elemTable.find("thead").prepend(headerStick);
    elemTable.find("thead tr.headerStick th").not(".sorter-false").removeAttr("style").removeClass("ui-draggable-dragging").find(".fa-arrows-alt-h").remove();
    var tableHeader = elemTable.find("thead tr.tableHeader").not(".headerStick");
    tableHeader.show().find(".fa-arrows-alt-h").remove();
    tableHeader.find("th.tablesorter-header").not(".sorter-false").find(".tablesorter-header-inner").append('<i class="fas fa-arrows-alt-h" style="float: right;right: 20px;position: absolute;"></i>');
    var headerStick = elemTable.find("thead tr.headerStick");
    $("#tabelaAtivPanel").unbind("scroll").scroll(function() {
      if (typeof $(this).offset() !== "undefined" && $(this).offset() !== null && typeof headerStick.offset() !== "undefined" && headerStick.offset() !== null) {
        var wrapperTop = $(this).offset().top - 25;
        var headerTop = headerStick.offset().top;
        setTimeout(function() {
          if (headerTop < wrapperTop || headerTop == 0) {
            tableHeader.hide();
            headerStick.show();
          } else {
            headerStick.hide();
            tableHeader.show();
          }
        }, 100);
      }
    });
    if (refresh) {
      setTimeout(function() {
      }, 100);
    }
  }
  function getColumnsSortable(elemTable) {
    var arrayColumns = elemTable.find("thead tr.tableHeader").not(".headerStick").find("th.tituloControle").not(".sorter-false").map(function(v) {
      return $(this).data("filter-type");
    }).get();
    return arrayColumns;
  }
  function initFileSystem() {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    if (window.requestFileSystem) {
      setFileSystem();
    } else {
      console.log("Desculpe! Seu navegador n\xE3o possui suporte ao sistema de arquivos local (FileSystem API)");
    }
  }
  function errorHandler(error) {
    console.log(error);
  }
  function errorHandlerFileSystemOptional(error) {
    if (!error || error.name === "NotFoundError" || error.code === 8) return;
    console.log(error);
  }
  function setFileSystem() {
    var quota = 1024 * 1024 * 5;
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function() {
        window.requestFileSystem(window.PERSISTENT, quota, function(fs) {
          filesystem = fs;
          fileSystemListFiles();
        }, errorHandler);
      });
    } else {
      window.requestFileSystem(window.PERSISTENT, quota, function(fs) {
        filesystem = fs;
        fileSystemListFiles();
      }, errorHandler);
    }
  }
  function fileSystemLoadFile(filename) {
    filesystem.root.getFile(filename, {}, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var return_this = typeof this.result !== "undefined" ? this.result : false;
          return_this = return_this && isJson(JSON.parse(this.result)) ? JSON.parse(this.result) : [];
          fileSystemContentPro = return_this;
        };
        reader.readAsText(file);
      }, errorHandler);
    }, errorHandlerFileSystemOptional);
  }
  function fileSystemListFiles() {
    var dirReader = filesystem.root.createReader();
    var entries = [];
    var fetchEntries = function() {
      dirReader.readEntries(function(results) {
        if (!results.length) {
          fileSystemPro = entries.sort().reverse();
        } else {
          entries = entries.concat(results);
          fetchEntries();
        }
      }, errorHandler);
    };
    fetchEntries();
  }
  function fileSystemSaveFile(filename, content) {
    filesystem.root.getFile(filename, { create: true }, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          fileSystemListFiles();
        };
        fileWriter.onerror = function(e) {
          console.log("Write error: " + e.toString());
          console.log("Ocorreu um erro e n\xE3o foi poss\xEDvel salvar seu arquivo");
        };
        var contentBlob = new Blob([content], { type: "text/plain" });
        fileWriter.write(contentBlob);
      }, errorHandler);
    }, errorHandler);
  }
  function fileSystemDeleteFile(filename) {
    filesystem.root.getFile(filename, { create: false }, function(fileEntry) {
      fileEntry.remove(function(e) {
        fileSystemListFiles();
      }, errorHandlerFileSystemOptional);
    }, errorHandlerFileSystemOptional);
  }
  function fileSystemUpdateFile(filename, content) {
    initFileSystem();
    setTimeout(function() {
      if (fileSystemPro) {
        filesystem.root.getFile(filename, { create: true }, function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            var contentBlob = new Blob([content], { type: "text/plain" });
            fileWriter.onerror = function(e) {
              console.log("Write error: " + e.toString());
              console.log("Ocorreu um erro e n\xE3o foi poss\xEDvel salvar seu arquivo");
            };
            fileWriter.onwriteend = function() {
              if (!fileWriter._truncated) {
                fileWriter._truncated = true;
                fileWriter.seek(0);
                fileWriter.write(contentBlob);
                return;
              }
              fileSystemListFiles();
              fileSystemLoadFile(filename);
            };
            fileWriter.truncate(0);
          }, errorHandlerFileSystemOptional);
        }, errorHandlerFileSystemOptional);
      }
    }, 100);
  }
  function getLocalFilePro() {
    initFileSystem();
    setTimeout(function() {
      if (fileSystemPro) {
        fileSystemLoadFile("configPro.json");
        setTimeout(function() {
        }, 100);
      }
    }, 10);
  }
  function setLocalFilePro(content) {
    initFileSystem();
    setTimeout(function() {
      if (fileSystemPro) {
        fileSystemUpdateFile("configPro.json", JSON.stringify(content));
      }
    }, 10);
    setTimeout(function() {
      getLocalFilePro();
    }, 500);
  }
  function initDownloadLocalFilePro(this_, TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof fileSystemContentPro !== "undefined" && fileSystemContentPro || typeof localStorageRestorePro("configDataMonitoradosPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configDataMonitoradosPro"))) {
      downloadLocalFilePro(this_);
    } else {
      $(this_).find("i").attr("class", "fas fa-spinner fa-spin cinzaColor");
      if (TimeOut == 9e3) fileSystemLoadFile("configPro.json");
      setTimeout(function() {
        initDownloadLocalFilePro(this_, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initDownloadLocalFilePro");
      }, 500);
    }
  }
  function downloadLocalFilePro(this_) {
    var _this = $(this_);
    var configPro = JSON.stringify(localStorageRestorePro("configDataMonitoradosPro"));
    var nameFile = "configPro";
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\uFEFF", configPro]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile + "_" + moment().format("YYYYMMDD_HH:mm:ss") + ".json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    _this.find("i").attr("class", "fas fa-thumbs-up azulColor");
    setTimeout(function() {
      _this.find("i").attr("class", "fas fa-download azulColor");
    }, 1e3);
  }
  function initLoadLocalFilePro() {
    $("#selectLocalFilesPro[type=file]").trigger("click");
  }
  function loadLocalFilePro() {
    confirmaFraseBoxPro(
      "Esta a\xE7\xE3o ir\xE1 substituir todos os dados de processos monitorados. Tem certeza que deseja prosseguir?",
      "SIM",
      function() {
        var files = document.getElementById("selectLocalFilesPro").files;
        if (files.length <= 0) {
          return false;
        }
        var fr = new FileReader();
        fr.onload = function(e) {
          var result = JSON.parse(e.target.result);
          result.datetime = moment().format("YYYY-MM-DD HH:mm:ss");
          setLocalFilePro(result);
          localStorageStorePro("configDataMonitoradosPro", result);
          setPanelMonitorados("refresh");
          resetDialogBoxPro("dialogBoxPro");
          setTimeout(function() {
            alertaBoxPro("Sucess", "check-circle", "Configura\xE7\xF5es carregadas com sucesso!");
            console.log("loadLocalFilePro", result.datetime, result, getStoreMonitoradoPro());
          }, 500);
        };
        fr.readAsText(files.item(0));
      }
    );
  }
  function resizeWinArvore(widthArvore) {
    var indent = 10;
    var widthConteudo = $("#divConteudo").width();
    var widthVisualizacao = widthConteudo - widthArvore - indent;
  }
  function resizeArvoreMaxWidth(force = false) {
    if ($("#ifrArvore").length > 0 && (force || verifyConfigValue("resizearvore"))) {
      var indent = 60;
      waitLoadPro($("#ifrArvore").contents(), "form", "#divArvore", function() {
        setResizeArvoreMaxWidth(indent);
      });
    }
  }
  function setResizeArvoreMaxWidth(indent, saveSize = false) {
    var widthArvore = $("#ifrArvore").contents().find("#divArvore")[0].scrollWidth;
    widthArvore = typeof widthArvore !== "undefined" ? widthArvore : false;
    if (widthArvore > $("#ifrArvore").width()) {
      if (!saveSize) removeOptionsPro("iframeSizeSlimPro");
      setSizeIframePro(widthArvore + indent, saveSize);
    } else if (widthArvore) {
      setSizeIframePro(200, saveSize);
    }
    console.log("setResizeArvoreMaxWidth");
  }
  function addTextToTextarea(source, target, text) {
    target.insertAtCaret(text);
    source.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  }
  function forceOnLoadBodyPage() {
    var onloadAttr = $("body").attr("onload");
    if (!onloadAttr || typeof $().resizable === "undefined" || $(".sparkling-modal-frame").length) return;
    if (window.__seiProForceOnLoadBodyPageLock) return;
    window.__seiProForceOnLoadBodyPageLock = true;
    setTimeout(function() {
      window.__seiProForceOnLoadBodyPageLock = false;
    }, 1e3);
  }
  function downloadTableCSV(element, nameFile) {
    var titles = [];
    var data = [];
    element.find("th").each(function() {
      titles.push($(this).text().trim());
    });
    element.find("td").each(function() {
      if (!$(this).closest("tr").hasClass("notCopy")) {
        data.push($(this).text().trim());
      }
    });
    var CSVString = prepCSVRow(titles, titles.length, "");
    CSVString = prepCSVRow(data, titles.length, CSVString);
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\uFEFF", CSVString]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile + "_" + moment().format("YYYYMMDD_HH:mm:ss") + ".csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  function setIconLoadinBtnSEI(elem, display = true) {
    if (display) {
      elem.find("img").css("opacity", "0").end().append('<span class="botaoSEI_iconBox botaoSEI_loading infraCorBarraSistema" style="' + (SeiPro.sei.adapter.isNewSEI() ? "margin: 0;border: 0;width: 100%;height: 46px;background: #fff !important;" : "margin: 0px 0 0 5px; border: 0.1em solid white;") + '"><i class="fas fa-spin fa-spinner" style="font-size: 17pt; color: #fff;"></i></span>');
    } else {
      elem.find("img").css("opacity", "1").end().find(".botaoSEI_loading").remove();
    }
  }
  function changeInputProtocoloSEI(this_, callback = false, callback_error = false) {
    var _this = $(this_);
    var protocoloSEI = _this.val();
    getIDProtocoloSEI(
      protocoloSEI,
      function(html) {
        if (callback) callback(html);
        _this.removeClass("requiredNull");
      },
      function() {
        if (callback_error) callback_error();
        alertaBoxPro("Error", "exclamation-triangle", "Protocolo n\xE3o encontrado!");
        _this.addClass("requiredNull");
      }
    );
  }
  function ganttAutoProgressPercent(dtStar, dtEnd) {
    var dtNow = moment();
    var progressDat = dtEnd.diff(dtStar, "days");
    var progressDatNow = dtNow.diff(dtStar, "days");
    var percentProgress = Math.round(progressDatNow / progressDat * 100);
    percentProgress = percentProgress < 0 ? 0 : percentProgress;
    return percentProgress;
  }
  function changePanelSortPro(this_) {
    var _this = $(this_);
    if (_this.is(":checked")) {
      setOptionsPro("panelSortPro", true);
      if ($("#panelHomePro").hasClass("ui-sortable")) {
        $("#panelHomePro").sortable("enable");
      } else {
        setSortDivPanel();
      }
    } else {
      removeOptionsPro("panelSortPro");
      $("#panelHomePro").sortable("disable");
      $("#panelHomePro .titlePanelHome").unbind();
    }
  }
  function changePanelSortColumnsPro(this_) {
    var _this = $(this_);
    if (_this.is(":checked")) {
      setOptionsPro("panelSortColumnsPro", true);
    } else {
      removeOptionsPro("panelSortColumnsPro");
    }
  }
  function changePanelLocalStorePro(this_) {
    var _this = $(this_);
    if (_this.is(":checked")) {
      setOptionsPro("panelLocalStorePro", true);
    } else {
      removeOptionsPro("panelLocalStorePro");
    }
  }
  function changePanelLabPro(this_) {
    var _this = $(this_);
    if (_this.is(":checked")) {
      setOptionsPro("panelLabPro", true);
    } else {
      removeOptionsPro("panelLabPro");
    }
  }
  function setSortDivPanel() {
    if (getOptionsPro("panelSortPro")) {
      if ($("#panelHomePro").hasClass("ui-sortable")) {
        setTimeout(function() {
          $("#panelHomePro").sortable().sortable("refresh");
          controleSortDivPanel();
        }, 1e3);
      } else {
        $("#panelHomePro").sortable({
          items: ".panelHomePro",
          cursor: "grabbing",
          handle: ".titlePanelHome",
          forceHelperSize: true,
          opacity: 0.5,
          update: function(event2, ui) {
            var orderPanelHome = [];
            $(".panelHomePro").each(function(index) {
              orderPanelHome.push({ name: $(this).attr("id"), index });
              $(this).data("order", index).attr("data-order", index);
            });
            console.log(orderPanelHome);
            setOptionsPro("orderPanelHome", orderPanelHome);
          }
        });
        controleSortDivPanel();
      }
    }
  }
  function controleSortDivPanel() {
    $("#panelHomePro .titlePanelHome").unbind().mouseenter(function() {
      $("#panelHomePro").sortable("enable");
    }).mouseleave(function() {
      $("#panelHomePro").sortable("disable");
    });
  }
  function forcePlaceHoldChosen() {
    $("select").each(function() {
      var _this = $(this);
      var placeholder = _this.data("placeholder");
      placeholder = typeof placeholder !== "undefined" ? placeholder : false;
      if (placeholder) {
        setPlaceHoldChosen(this);
        _this.unbind().on("change", function() {
          setPlaceHoldChosen(this);
        });
      }
    });
  }
  function setPlaceHoldChosen(this_) {
    var emptyvalue = $(this_).val() !== null ? $(this_).val().trim() : "";
    emptyvalue = emptyvalue == "0" || emptyvalue == "" ? true : false;
    var placeholder = $(this_).data("placeholder");
    placeholder = typeof placeholder !== "undefined" ? placeholder : false;
    var chosenMin = $(this_).hasClass("chosen-min");
    var id = $(this_).attr("id");
    id = typeof id !== "undefined" ? id + "_chosen" : false;
    if (id && $("#" + id).length > 0 && emptyvalue && placeholder) {
      $("#" + id).find(".chosen-single span").text(placeholder);
      if (chosenMin) $("#" + id).addClass("chosen-min");
    }
  }
  function initChosenReplace(mode, this_ = false, force = false, TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof $().chosen !== "undefined") {
      var _this = $(this_);
      var _parent = _this.closest(".popup-wrapper").length > 0 ? _this.closest(".popup-wrapper") : _this.closest(".ui-dialog");
      _parent = typeof _parent !== "undefined" && _parent.length ? _parent : _this.closest(".cke_dialog");
      if (mode == "panel") {
        $(".panelHome select").not("[multiple]").filter(function() {
          return !($(this).css("visibility") == "hidden" || $(this).css("display") == "none") || force;
        }).chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
      } else if (mode == "box_init") {
        _parent.find("select").not("[multiple]").filter(function() {
          return !($(this).css("visibility") == "hidden" || $(this).css("display") == "none") || force;
        }).chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
      } else if (mode == "box_multiple") {
        _parent.find("select").filter(function() {
          return !($(this).css("visibility") == "hidden" || $(this).css("display") == "none") || force;
        }).chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
      } else if (mode == "box_refresh") {
        _parent.find("select").not("[multiple]").filter(function() {
          return !($(this).css("visibility") == "hidden" || $(this).css("display") == "none") || force;
        }).trigger("chosen:updated");
      } else if (mode == "box_reload") {
        _parent.find("select").not("[multiple]").filter(function() {
          return !($(this).css("visibility") == "hidden" || $(this).css("display") == "none") || force;
        }).chosen("destroy").chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
      }
      chosenReparePosition();
    } else {
      if (typeof $().chosen === "undefined" && typeof URL_SPRO !== "undefined") {
        $.getScript(URL_SPRO + "js/lib/chosen.jquery.min.js");
      }
      setTimeout(function() {
        initChosenReplace(mode, this_, force, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initChosenReplace");
      }, 500);
    }
  }
  function chosenReparePosition(target = $("body")) {
    target.find(".chosen-container").each(function() {
      var id = $(this).attr("id");
      id = typeof id !== "undefined" ? id.replace("_chosen", "") : false;
      if (id && target.find("#" + id).css("position") == "absolute") {
        var cssElem = {
          "position": "absolute",
          "left": target.find("#" + id).css("left"),
          "top": target.find("#" + id).css("top")
        };
        $(this).css(cssElem);
      }
    });
  }
  function setMenuSistemaView(force = false) {
  }
  function hideMenuSistemaView() {
  }
  function checkMenuSistemaView() {
    if ($("#divInfraAreaTelaE").is(":visible")) {
      $("body").removeClass("seiSlim_hidemenu");
    } else {
      $("body").addClass("seiSlim_hidemenu");
    }
  }
  function checkboxRangerSelectShift(elemSelect = false) {
    var elem = elemSelect ? $(elemSelect) : $("body");
    var $chkboxes = $('input[type="checkbox"]');
    var lastChecked = null;
    $chkboxes.unbind().on("click", function(e) {
      if (!lastChecked) {
        lastChecked = this;
        return;
      }
      if (e.shiftKey) {
        var start = $chkboxes.index(this);
        var end = $chkboxes.index(lastChecked);
        $chkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).trigger("click");
        this.click();
        $chkboxes.eq(end).trigger("click");
      }
      lastChecked = this;
    });
  }
  function corrigeTableSEI(elementSelect) {
    $(elementSelect).each(function() {
      var thead = $(this).find("thead");
      if (thead.length == 0) {
        if (typeof $(this).attr("id") === "undefined") {
          $(this).attr("id", "infraTable_" + randomString(4));
        }
        $("<thead></thead>").insertBefore($(this).find("tbody")).append($(this).find("tbody>tr:first-child"));
      } else if (thead.find("tr").length == 0) {
        thead.append($(this).find("tbody>tr:first-child"));
      }
    });
  }
  function rememberScroll(elementScroll, nameScroll, animated = true) {
    var scrollPos = getOptionsPro("rememberScroll_" + nameScroll);
    if (getOptionsPro("rememberScroll_" + nameScroll)) {
      if (animated) {
        $(elementScroll).animate({
          scrollTop: scrollPos
        }, 500);
      } else {
        $(elementScroll).scrollTop(scrollPos);
      }
    }
  }
  function scrollToElement(container, scrollToElem, stick = 0) {
    if (typeof scrollToElem.offset() !== "undefined") {
      container.animate({
        scrollTop: scrollToElem.offset().top - container.offset().top + container.scrollTop() - stick
      });
    }
  }
  function scrollToElementArvore(id_documento) {
    var ifrArvore = $("#ifrArvore").contents();
    if (ifrArvore.length && ifrArvore.find("#anchor" + id_documento).length) {
      ifrArvore.find("html").animate({
        scrollTop: ifrArvore.find("#anchor" + id_documento).offset().top
      });
    }
  }
  function resetDialogBoxPro(elementBox) {
    if (elementBox == "alertBoxPro" && alertBoxPro) {
      alertBoxPro.dialog("destroy");
      alertBoxPro = false;
      $(".alertaBoxDiv").remove();
    } else if (elementBox == "dialogBoxPro" && dialogBoxPro) {
      dialogBoxPro.dialog("destroy");
      dialogBoxPro = false;
      $(".dialogBoxDiv").remove();
    } else if (elementBox == "configBoxPro" && configBoxPro) {
      configBoxPro.dialog("destroy");
      configBoxPro = false;
      $(".configBoxProDiv").remove();
    } else if (elementBox == "iframeBoxPro" && iframeBoxPro) {
      iframeBoxPro.dialog("destroy");
      iframeBoxPro = false;
      $(".iframeBoxDiv").remove();
    } else if (elementBox == "editorBoxPro" && editorBoxPro) {
      editorBoxPro.dialog("destroy");
      editorBoxPro = false;
      $(".editorBoxProDiv").remove();
    }
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    dialogIsDraggable = false;
  }
  function isDialogDraggable() {
    $(".ui-dialog:visible").draggable({
      stop: function() {
        dialogIsDraggable = true;
      }
    });
  }
  function updateDadosProcesso(idElement, value, callback = false) {
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    var url = dadosProcessoPro.propProcesso.action;
    if (typeof url !== "undefined" && url != "") {
      $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
        var iframe = $(this).contents();
        iframe.find("#" + idElement).val(value);
        $(this).unbind();
        iframe.find("#btnSalvar, #sbmSalvar").trigger("click");
        if (typeof callback === "function") callback();
      });
    } else {
      return false;
    }
  }
  function getLinksProcessoAjax(id_procedimento, callback) {
    var href = url_host.replace("controlador.php", "") + "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + String(id_procedimento);
    if (href !== null) {
      $.ajax({ url: href }).done(function(html) {
        var $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr("src");
        $.ajax({ url: urlArvore }).done(function(htmlArvore) {
          if (typeof callback === "function") callback(getLinksArvoreAjax(htmlArvore));
        });
      });
    }
  }
  function getHistoricoProcessoUrlAjax(htmlArvore) {
    var $htmlArvore = $(htmlArvore);
    if (SeiPro.sei.adapter.isNewSEI() && getSeiVersionPro() && compareVersionNumbers(getSeiVersionPro(), "4.1.0") >= 0) {
      var onclick = $htmlArvore.find("#divConsultarAndamento a").attr("onclick");
      if (typeof onclick !== "undefined" && onclick !== "") {
        return onclick.split("'")[1];
      }
    }
    var urlHistorico = false;
    $htmlArvore.filter("script").add($htmlArvore.find("script")).each(function() {
      if (urlHistorico || typeof $(this).attr("src") !== "undefined" || $(this).html().indexOf("consultarAndamento") === -1) return;
      var links = $.map($(this).html().split("'"), function(substr, i2) {
        return i2 % 2 && substr.indexOf("controlador.php?acao=") !== -1 ? substr : null;
      });
      $.each(links, function(index, value) {
        if (value.indexOf("?acao=procedimento_consultar_historico") !== -1) {
          urlHistorico = value;
          return false;
        }
      });
    });
    return urlHistorico;
  }
  function getAcompanhamentoEspecialAjax(htmlArvore) {
    var $htmlArvore = $(htmlArvore);
    var acompEsp = $htmlArvore.find('a[href*="controlador.php?acao=acompanhamento_cadastrar"]').eq(0);
    if (!acompEsp.length) return "";
    var title = "";
    var imgTitle = acompEsp.find("img").attr("title");
    if (typeof imgTitle !== "undefined" && imgTitle !== "") {
      title = imgTitle.split(/\r?\n|\r|\n/g)[1] || imgTitle;
    }
    return { url: acompEsp.attr("href"), title };
  }
  function getTiposDocumentosAjax(hrefPesquisa, callback = false) {
    if (typeof hrefPesquisa === "undefined" || hrefPesquisa === null || hrefPesquisa === "") {
      if (typeof callback === "function") callback([]);
      return;
    }
    $.ajax({ url: hrefPesquisa }).done(function(html) {
      var tiposDocumentos = [];
      $(html).find("#selSeriePesquisa option").each(function() {
        var id = $(this).attr("value");
        var name = $(this).text().trim();
        if (name !== "") {
          tiposDocumentos.push({ id, name });
        }
      });
      dadosProcessoPro.tiposDocumentos = tiposDocumentos;
      setSessionProcessosPro(dadosProcessoPro);
      if (typeof callback === "function") callback(tiposDocumentos);
    });
  }
  function getDadosAjaxMonitoradoPro(idProcedimento) {
    if (typeof idProcedimento === "undefined" || idProcedimento === null || idProcedimento === "") return;
    var href = url_host.replace("controlador.php", "") + "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + String(idProcedimento);
    dadosProcessoPro.listAndamento = {
      historico_completo: false,
      processo: "",
      id_procedimento: String(idProcedimento),
      andamento: []
    };
    dadosProcessoPro.tiposDocumentos = [];
    dadosProcessoPro.listDocumentosAssinados = [];
    setSessionProcessosPro(dadosProcessoPro);
    $.ajax({ url: href }).done(function(html) {
      var $html = $(html);
      var urlArvore = $html.find("#ifrArvore").attr("src");
      var hrefPesquisa = $html.find('a[href*="acao=protocolo_pesquisar"], a[href*="acao=protocolo_pesquisa"]').eq(0).attr("href");
      if (typeof hrefPesquisa !== "undefined" && hrefPesquisa !== "") {
        getTiposDocumentosAjax(hrefPesquisa);
      }
      if (typeof urlArvore === "undefined" || urlArvore === "") {
        setSessionProcessosPro(dadosProcessoPro);
        return;
      }
      $.ajax({ url: urlArvore }).done(function(htmlArvore) {
        var arrayLinksArvore2 = getLinksArvoreAjax(htmlArvore);
        var hrefProcesso = null;
        var hrefDocumentos = null;
        $.each(arrayLinksArvore2, function(index, value) {
          if (hrefProcesso === null && value.url && (value.url.indexOf("acao=procedimento_alterar") !== -1 || value.url.indexOf("acao=procedimento_consultar") !== -1)) {
            hrefProcesso = value.url;
          }
          if (hrefDocumentos === null && value.url && value.url.indexOf("acao=procedimento_gerar_pdf") !== -1) {
            hrefDocumentos = value.url;
          }
        });
        var arrayAcompEsp = getAcompanhamentoEspecialAjax(htmlArvore);
        var hrefHistorico = getHistoricoProcessoUrlAjax(htmlArvore);
        dadosProcessoPro.listLinks = arrayLinksArvore2;
        setSessionProcessosPro(dadosProcessoPro);
        if (hrefProcesso) {
          ajaxDadosProcessoPro(hrefProcesso, "monitorados", arrayAcompEsp, function(processo) {
            if (typeof dadosProcessoPro.listAndamento === "undefined") {
              dadosProcessoPro.listAndamento = {
                historico_completo: false,
                processo: typeof processo.txtProtocoloExibir !== "undefined" && processo.txtProtocoloExibir !== "" ? processo.txtProtocoloExibir : processo.hdnProtocoloFormatado,
                id_procedimento: typeof processo.hdnIdProcedimento !== "undefined" && processo.hdnIdProcedimento !== "" ? processo.hdnIdProcedimento : String(idProcedimento),
                andamento: []
              };
            }
            setSessionProcessosPro(dadosProcessoPro);
          });
        }
        if (hrefDocumentos) {
          ajaxDadosDocumentosPro(hrefDocumentos, "monitorados");
        } else {
          dadosProcessoPro.listDocumentosAssinados = [];
          setSessionProcessosPro(dadosProcessoPro);
        }
        if (hrefHistorico) {
          getDadosAndamentoPro(hrefHistorico);
        }
      });
    });
  }
  function getInteressadosProcesso(txtInteressado, callback) {
    if (typeof window.linkPesquisaInteressado !== "undefined") {
      getInteressadosProcessoAjax(window.linkPesquisaInteressado, txtInteressado, callback);
    } else {
      var id_procedimento = getParamsUrlPro($("#frmCheckerProcessoPro").attr("src"));
      id_procedimento = typeof id_procedimento !== "undefined" && id_procedimento !== null && id_procedimento && typeof id_procedimento.id_procedimento !== "undefined" ? id_procedimento.id_procedimento : false;
      if (id_procedimento) {
        getLinksProcessoAjax(id_procedimento, function(arrayLinksArvore2) {
          var urlAlterarProc = getTreeLinkUrlByName("Enviar Processo", { treeModel: { links: arrayLinksArvore2 } });
          if (urlAlterarProc !== null) {
            $.ajax({ url: urlAlterarProc }).done(function(htmlDoc) {
              var link = $.map(htmlDoc.split("\n"), function(v) {
                if (v.indexOf("controlador_ajax.php?acao_ajax=unidade_auto_completar_envio_processo") !== -1) {
                  return $.map(v.split("'"), function(substr, i2) {
                    return i2 % 2 && substr.indexOf("controlador_ajax.php?acao_ajax=unidade_auto_completar_envio_processo") !== -1 ? substr : null;
                  });
                }
              });
              if (link.length) {
                window.linkPesquisaInteressado = link[0];
                getInteressadosProcessoAjax(linkPesquisaInteressado, txtInteressado, callback);
              }
            });
          }
        });
      }
    }
  }
  function getInteressadosProcessoAjax(link, txtInteressado, callback) {
    $.ajax({
      type: "POST",
      url: link,
      dataType: "text",
      data: {
        palavras_pesquisa: txtInteressado
      },
      success: function(result) {
        var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>', "")).html();
        var id_result = $(html_result).map(function() {
          return { id: $(this).attr("id"), descricao: $(this).attr("descricao") };
        }).get();
        if (typeof callback === "function") callback(id_result);
      }
    });
  }
  function setInteressadosSend() {
    var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml);
    if (ifrArvoreHtml.length) {
      var interessados = ifrArvoreHtml.contents().find(".interessadoSeiPro").map(function() {
        return { id: $(this).data("id"), descricao: $(this).text() };
      }).get();
      if (interessados.length) {
        var arrayInter = [];
        interessados.filter(function(item) {
          var i2 = arrayInter.findIndex((x2) => x2.id == item.id && x2.descricao == item.descricao);
          if (i2 <= -1) {
            arrayInter.push(item);
          }
          return null;
        });
        interessadosSendPro = arrayInter;
        return arrayInter;
      }
    }
    return false;
  }
  function extractDataFormulario(output = "obj", allFields = false) {
    var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml).contents();
    var arrayData = ifrArvoreHtml.find("#conteudo").html().split("\n");
    var nr_sei = ifrArvoreHtml.find("#titulo label").text();
    nr_sei = typeof nr_sei !== "undefined" && nr_sei != "" && nr_sei.indexOf("-") !== -1 ? nr_sei.split("-")[nr_sei.split("-").length - 1].trim() : false;
    var data_assinatura = ifrArvoreHtml.find("#assinaturas").text();
    data_assinatura = typeof data_assinatura !== "undefined" && data_assinatura != "" ? data_assinatura.split("\n").map(function(txt) {
      var reg = new RegExp("documento assinado eletronicamente", "i");
      var p = false;
      if (reg.test(txt)) {
        var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
        var time = txt.match(/(\d{1,2}:\d{2})/img);
        return date !== null && time !== null ? date[0] + " " + time[0] : false;
      }
    }).join("") : false;
    var processo = $("#ifrArvore").contents().find(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim();
    var objOut = {};
    var arrayOut = [];
    var fieldsOut = [];
    var stringOut = "";
    var dataForm = arrayData.map(function(v, i2) {
      if (v.indexOf(":") !== -1 && v.indexOf("<b>") !== -1) {
        var name = removeAcentos($("<div>" + v + "</div>").text().trim()).toLowerCase();
        name = name.indexOf(" (") !== -1 ? name.split("(")[0].trim() : name;
        name = extractOnlyAlphaNum(name).replace(/ /g, "_");
        var value = typeof arrayData[i2 + 1] !== "undefined" ? $("<div>" + arrayData[i2 + 1] + "</div>").text().trim() : null;
        objOut[name] = value;
        arrayOut.push({ name, value });
        fieldsOut.push(name);
        stringOut += "#" + name + ": " + value + "\n";
      }
    });
    if (allFields) {
      arrayOut.push({ name: "data_assinatura", value: data_assinatura });
      arrayOut.push({ name: "nr_sei", value: nr_sei });
      arrayOut.push({ name: "processo", value: processo });
      objOut[data_assinatura] = data_assinatura;
      objOut[nr_sei] = nr_sei;
      objOut[processo] = processo;
      stringOut += "#data_assinatura: " + data_assinatura + "\n";
      stringOut += "#nr_sei: " + nr_sei + "\n";
      stringOut += "#processo: " + processo + "\n";
    }
    return output == "obj" ? objOut : output == "array" ? arrayOut : output == "fields" ? fieldsOut : stringOut;
  }
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  function initDialogCompareDocs(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof $().chosen !== "undefined") {
      parent.openDialogCompareDocs();
    } else {
      if (TimeOut == 9e3 && typeof $().chosen === "undefined" && typeof URL_SPRO !== "undefined") $.getScript(URL_SPRO + "js/lib/chosen.jquery.min.js");
      setTimeout(function() {
        parent.initDialogCompareDocs(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initDialogCompareDocs => " + TimeOut);
      }, 500);
    }
  }
  function invertCompareDoc(this_) {
    $(this_).toggleClass("newLink_confirm");
    $("#docLoteSelect").trigger("change");
  }
  function openDialogCompareDocs() {
    var elemRef1 = $("#ifrArvore").contents().find("#content .infraArvoreNoSelecionado");
    var docRef1 = elemRef1.text().trim();
    docRef1 = docRef1 == "" ? '<span style="color:#FF0000;"><i class="fas fa-exclamation-triangle vermelhoColor" style="margin-right: 5px;"></i> Nenhum documento selecionado na \xE1rvore do processo</span>' : docRef1;
    var idRef = elemRef1.length ? parseInt(elemRef1.attr("id").replace("span", "")) : false;
    const urlNewDoc = getUrlNewDocArvore();
    if (!urlNewDoc) {
      flagError = true;
      alertaBoxPro("Error", "exclamation-triangle", "Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!");
    } else {
      var htmlBox = '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">      <tr>          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">               <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> <strong>A</strong>: ' + docRef1 + '</label>           </td>      </tr>      <tr>          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">               <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> <strong>B</strong>: Selecione abaixo o documento para compara\xE7\xE3o:</label>               <a class="newLink newLink_active invertCompareDoc" onclick="invertCompareDoc(this)" style="float: right;font-size: 10pt;"><i class="fas fa-exchange-alt"></i>Inverter (A/B \u2192 B/A)</a>           </td>      </tr>      <tr>           <td class="required">               <select id="docLoteSelect" onchange="getCompareDocs(this)"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>           </td>      </tr>  </table>';
      resetDialogBoxPro("dialogBoxPro");
      dialogBoxPro = $("#dialogBoxPro").html('<div id="dialogBoxDocLote" class="dialogBoxDiv">' + htmlBox + '<div class="iframeBoxDiv" style="display:none;width: 100%; height: calc(100vh - 320px); margin: 0;"><iframe src="about:blank" frameborder="0" height="100%" width="100%"></iframe></div></div>').dialog({
        title: "Comparar Documentos",
        width: 950,
        // height: $(window).height()-80,
        open: function() {
          $("#btnSelecaoDoc").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
          $("#docLoteSelect").chosen({
            placeholder_text_single: " ",
            no_results_text: "Nenhum resultado encontrado",
            normalize_search_text: function(text) {
              return removeAcentos(text.toLowerCase());
            }
          });
          $("#docLoteSelect_chosen").addClass("chosenLoading");
          docsLote_getDocsArvore(true, idRef);
          $(":button:not(.ui-dialog-titlebar-close)").prop("disabled", true).addClass("ui-state-disabled");
        },
        buttons: [{
          text: "Baixar",
          icon: "ui-icon-disk",
          click: function(event2) {
            var docRef2 = $("#docLoteSelect option:selected").text();
            var nameFile = "Comparativo " + docRef1 + " - " + docRef2 + " (" + NAMESPACE_SPRO + ")";
            var iframeBoxDiv = $(".iframeBoxDiv iframe").contents();
            var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
            contentDocument += iframeBoxDiv.find("html")[0].outerHTML;
            var downloadLink = document.createElement("a");
            var blob = new Blob(["\uFEFF", contentDocument]);
            var url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = nameFile + ".html";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        }, {
          text: "Criar Novo Documento",
          icon: "ui-icon-extlink",
          click: function(event2) {
            var iframeBoxDiv = $(".iframeBoxDiv iframe").contents();
            var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
            contentDocument += iframeBoxDiv.find("html")[0].outerHTML;
            getNewDocCompareDocs(contentDocument);
          }
        }]
      });
    }
  }
  function getNewDocCompareDocs(contentDocument) {
    var tiposDocumentos = typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.tiposDocumentos !== "undefined" && dadosProcessoPro.tiposDocumentos.length ? $.map(dadosProcessoPro.tiposDocumentos, function(v) {
      return '<option value="' + v.id + '">' + v.name + "</option>";
    }).join("") : false;
    var htmlBox = '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">      <tr>          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">               <label for="docTipoSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> Selecione o tipo de documento que deseja criar:</label>           </td>      </tr>      <tr>           <td class="required">               <select id="docTipoSelect"><option value="">&nbsp;</option>' + tiposDocumentos + "</select>           </td>      </tr>  </table>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv"> ' + htmlBox + "</span>").dialog({
      width: 450,
      title: "Criar novo documento comparado",
      open: function() {
        updateButtonConfirm(this, true);
        initChosenReplace("box_init", this, true);
      },
      buttons: [{
        text: "Criar Novo Documento",
        icon: "ui-icon-extlink",
        click: function(event2) {
          var id_tipo_documento = $("#docTipoSelect").val();
          var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
          id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
          sessionStorageStorePro("dadosDocAutomatico", contentDocument);
          sessionStorageStorePro("nomeDocAutomatico", $("#docTipoSelect option:selected").text());
          setNewDoc(id_procedimento, id_tipo_documento, true);
          resetDialogBoxPro("dialogBoxPro");
          alertaBoxPro("Sucess", "sync fa-spin", "Aguarde... Gerando documento comparado");
        }
      }]
    });
  }
  function getCompareDocs(this_) {
    var _this = $(this_);
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
    var id_documento = _this.find("option:selected").data("id_documento");
    var param = {
      id_documento,
      id_procedimento
    };
    if (!!id_procedimento && !!id_documento) {
      dialogBoxPro.dialog("option", "height", $(window).height() - 80);
      var htmlLoad = '<html><head><link rel="stylesheet" type="text/css" datastyle="seipro-fonticon" href="' + URL_SPRO + 'css/fontawesome.pro.min.css"></head><div style="text-align: center;font-size: 5em;padding-top: calc(50% - 2em);color: #ccc;"><i class="fas fa-sync fa-spin" style=""></i></div></html>';
      $(".iframeBoxDiv").show().find("iframe").contents().find("html").html(htmlLoad);
      $(":button:not(.ui-dialog-titlebar-close)").prop("disabled", true).addClass("ui-state-disabled");
      getContentDocSEI(param, function(compareHTML) {
        var ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml).contents();
        var originalHTML = ifrArvoreHtml.find("html").html();
        originalHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' + decodeHtml(originalHTML);
        compareHTML = decodeHtml(compareHTML);
        var output = $(".invertCompareDoc").hasClass("newLink_confirm") ? htmldiff(compareHTML, originalHTML) : htmldiff(originalHTML, compareHTML);
        output = output.replace(/<del>/g, '<del style="background-color: #FFF0F5;color: #FF0000;">');
        output = output.replace(/<ins>/g, '<ins style="background-color: #F0F8FF;color: #0000FF;">');
        setTimeout(() => {
          var srcs = [], temp;
          $(".iframeBoxDiv iframe").contents().find("img").filter(function() {
            temp = $(this).attr("src");
            if ($.inArray(temp, srcs) < 0) {
              srcs.push(temp);
              return false;
            }
            return true;
          }).remove();
          $(".iframeBoxDiv iframe").contents().find("[onclick]").each(function() {
            $(this).removeAttr("onclick");
          });
        }, 200);
        $(".iframeBoxDiv iframe").contents().find("html").html(output);
        $(":button:not(.ui-dialog-titlebar-close)").prop("disabled", false).removeClass("ui-state-disabled");
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log({ originalHTML, compareHTML });
      });
    }
  }
  function openCamposDinamicosForm() {
    var arrayNewDynamicField = extractDataFormulario("array");
    var htmlBox = '<table class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">   <thead>        <tr>            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\xE2mico</th>            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>        </tr>   </thead>   <tbody>';
    arrayNewDynamicField.map(function(v, i2) {
      htmlBox += '       <tr>          <td><span style="font-weight: bold;background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">#' + v.name + '</span></td>          <td><span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">' + v.value + "</span></td>       </tr>";
      "   </tbody>";
    });
    htmlBox += "</table>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv"> ' + htmlBox + "</div>").dialog({
      title: "Adicionar campos din\xE2micos",
      width: 600,
      buttons: [{
        text: "Adicionar",
        click: function() {
          var stringNewDynamicField = extractDataFormulario("string");
          var txaObservacoes = typeof dadosProcessoPro.propProcesso.txaObservacoes !== "undefined" ? jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='" + siglaUnidadeAtual + "'].observacao | [0]") : null;
          var txtObsDynamicField = txaObservacoes !== null ? stringNewDynamicField + txaObservacoes : txtObsDynamicField;
          console.log(txtObsDynamicField);
          if (txtObsDynamicField && txtObsDynamicField != "") {
            updateDadosProcesso("txaObservacoes", txtObsDynamicField, function() {
              alertaBoxPro("Sucess", "check-circle", "Campos din\xE2micos adicionados com sucesso!");
            });
          }
          resetDialogBoxPro("dialogBoxPro");
        }
      }]
    });
  }
  function getRemoverMarcador(alert2 = true) {
    loadingButtonConfirm(true);
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
    var valuesIframe = [
      { element: "txaTexto", value: "" },
      { element: "hdnIdMarcador", value: "" }
    ];
    updateDadosArvoreMult("Gerenciar Marcador", valuesIframe, id_procedimento, function() {
      var listMarcadores = sessionStorageRestorePro("dadosMarcadoresProcessoPro");
      var objIndexDoc = !listMarcadores ? -1 : listMarcadores.findIndex(((obj) => obj.id_procedimento == String(id_procedimento)));
      if (objIndexDoc !== -1) {
        listMarcadores.splice(objIndexDoc, 1);
        sessionStorageStorePro("dadosMarcadoresProcessoPro", listMarcadores);
        resetDialogBoxPro("dialogBoxPro");
        if (alert2) alertaBoxPro("Sucess", "check-circle", "Marcador removido com sucesso!");
      }
    });
  }
  function getAjaxListaAtribuicao() {
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    var url = $('a.processoVisualizado[href*="acao=procedimento_trabalhar"]').eq(0).attr("href");
    if (!!url) {
      $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
        var ifrArvore = $("#frmCheckerProcessoPro").contents().find("#ifrArvore");
        getSelectAtribuicaoProcesso(false, ifrArvore);
      });
    }
  }
  function getAjaxListaMarcador() {
    var href = SeiPro.sei.adapter.isNewSEI() ? $(divComandos + ' a[onclick*="andamento_marcador_cadastrar"]').attr("onclick") : $(divComandos + ' a[onclick*="andamento_marcador_gerenciar"]').attr("onclick");
    href = typeof href !== "undefined" ? href.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g")) : false;
    href = href && href !== null && href.length > 0 && href[0] != "" ? href[0] : false;
    if (href) {
      var param = {};
      $("#frmProcedimentoControlar").find("input[type=hidden]").map(function() {
        if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
          param[$(this).attr("name")] = $(this).val();
        }
      });
      param.hdnRecebidosItensSelecionados = $('input[name*="chkRecebidosItem"]').eq(0).val();
      param[$('input[name*="chkRecebidosItem"]').eq(0).attr("name")] = $('input[name*="chkRecebidosItem"]').eq(0).val();
      $.ajax({
        method: "POST",
        data: param,
        url: href
      }).done(function(html) {
        getListaMarcadores($(html));
      });
    }
  }
  function editFieldProc(this_) {
    var _this = $(this_);
    var _content_desc = _this.closest(".tagintable");
    var _info = _content_desc.find("span.info");
    var data = _content_desc.data();
    var value = _info.text();
    if (_info.is("[contentEditable='true']")) {
      _content_desc.removeClass("info_noclick");
      _content_desc.find(".content_btnsave").toggleClass("newLink_active newLink_confirm").find("i").toggleClass("fa-thumbs-up fa-edit");
      _info.prop("contenteditable", false).unbind();
      if (data.old != value) {
        var id_protocolo = _this.closest("tr").attr("id");
        id_protocolo = typeof id_protocolo !== "undefined" ? parseInt(id_protocolo.replace("P", "")) : false;
        if (id_protocolo) {
          _info.after('<i class="fas fa-check azulColor sucessEdit" style="margin-left:10px;"></i>');
          updateDadosArvore("Consultar/Alterar Processo", "txtDescricao", value, id_protocolo, function() {
            _content_desc.find(".sucessEdit").remove();
            _info.after('<i class="fas fa-check-double azulColor sucessEdit" style="margin-left:10px;"></i>');
            setTimeout(function() {
              _content_desc.find(".sucessEdit").remove();
            }, 2e3);
          });
        }
      }
    } else {
      _content_desc.addClass("info_noclick").data("old", value);
      _info.prop("contenteditable", true).focus().on("keypress", function(e) {
        if (e.which == 13) {
          _content_desc.find(".content_btnsave").trigger("click");
          _info.text(_info.text());
        }
      });
      _content_desc.find(".content_btnsave").toggleClass("newLink_active newLink_confirm").find("i").toggleClass("fa-thumbs-up fa-edit");
    }
  }
  function getSelectAtribuicaoProcesso(callback = false, iframe = false) {
    var href = getTreeLinkUrlByName("Atribuir Processo");
    if (href !== null) {
      $.ajax({ url: href }).done(function(html) {
        var $html = $(html);
        var selectAtribuicao = $html.find("#selAtribuicao option").map(function() {
          if ($(this).text().trim() != "") {
            return { name: $(this).text().trim(), value: $(this).val() };
          }
        }).get();
        setOptionsPro("arrayListUsersSEI", selectAtribuicao);
        if (selectAtribuicao.length && typeof callback === "function") {
          callback(selectAtribuicao);
        }
      });
    }
  }
  function getListaAtribuicaoProcesso(iframe, mode) {
    if (mode == "processo" || mode == "editor") {
      getSelectAtribuicaoProcesso(function(html_result) {
        var select_result = $.map(html_result, function(v, i2) {
          var username = v.name.indexOf("-") !== -1 ? v.name.split("-")[0].trim() : false;
          var name = v.name.indexOf("-") !== -1 ? v.name.split("-")[1].trim() : false;
          return { value: v.name, username, name };
        });
        var dadosProcessoPro2 = pullDadosProcessoSession();
        dadosProcessoPro2.listAtribuicaoProcesso = select_result;
        setSessionProcessosPro(dadosProcessoPro2);
      }, iframe);
    }
  }
  function getLinhaNumerada() {
    var _ifrArvoreHtml = $($ifrVisualizacao).contents().find($ifrArvoreHtml);
    if (_ifrArvoreHtml.length && verifyConfigValue("linhanumerada")) {
      var ifrArvoreHtml = _ifrArvoreHtml.contents();
      ifrArvoreHtml.find("p").filter(function() {
        return $(this).text().trim() != "";
      }).addClass("linhaNumerada");
    }
  }
  function getLinksInText(text) {
    var array = [];
    text.split("'").filter(function(el) {
      return el.indexOf("controlador.php") !== -1;
    }).map(function(v) {
      if (v.indexOf('"') !== -1) {
        v.split('"').filter(function(i2) {
          return i2.indexOf("controlador.php") !== -1;
        }).map(function(j) {
          var link2 = j.replace(/[\\"]/g, "");
          array.push(link2);
        });
        return false;
      } else {
        var link = v.replace(/[\\"]/g, "");
        array.push(link);
        return false;
      }
    });
    array = array.length > 0 ? array.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
    }) : [];
    return array;
  }
  function changeSelectHipoteseLegal(this_) {
    if ($(this_).val() == "1" || $(this_).val() == "2") {
      getSelectHipoteseLegal($(".select_hipoteses"), $(this_).val());
    } else {
      $(".select_hipoteses").html("").chosen("destroy").hide();
    }
  }
  function getSelectHipoteseLegal(elementHipotese = $("#dialogBoxProcesso_hipoteses"), nivelAcesso = 1) {
    getHipoteseLegal(dadosProcessoPro.propProcesso.urlHipoteseLegal, nivelAcesso, function(html_result) {
      elementHipotese.show().html(html_result);
      if (dadosProcessoPro.propProcesso.selHipoteseLegal) {
        elementHipotese.val(dadosProcessoPro.propProcesso.selHipoteseLegal);
      }
      elementHipotese.chosen("destroy").chosen({
        placeholder_text_single: " ",
        no_results_text: "Nenhum resultado encontrado",
        normalize_search_text: function(text) {
          return removeAcentos(text.toLowerCase());
        }
      }).trigger("chosen:updated");
    });
  }
  function updateDadosArvore(nameLink, idElement, value, idProcedimento, callback = false) {
    if (typeof idProcedimento !== "undefined" && idProcedimento != "" && idProcedimento !== null && idProcedimento != 0 && !checkProcessoSigiloso()) {
      if ($("#ifrArvore").length == 0) {
        if ($("#frmCheckerProcessoPro").length == 0) {
          getCheckerProcessoPro();
        }
        var url = "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + idProcedimento;
        $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
          var ifrArvore2 = $("#frmCheckerProcessoPro").contents().find("#ifrArvore");
          updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore2, callback);
        });
      } else {
        var ifrArvore = $("#ifrArvore");
        updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback);
      }
    } else {
      return false;
    }
  }
  function updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback) {
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    var url = getTreeLinkUrlByName(nameLink);
    if (typeof url !== "undefined" && url != "") {
      $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
        var iframe = $(this).contents();
        var element = iframe.find("#" + idElement);
        if (element.is("select") && !hasNumber(value)) {
          element.find('option:contains("' + value + '")').prop("selected", true);
        } else {
          if (element.is(":radio") || element.is(":checkbox")) {
            element.prop("checked", true).trigger("change");
            if (idElement == "optRestrito" || idElement == "optSigiloso") {
              iframe.find("#selHipoteseLegal").after('<input id="selHipoteseLegal" value="' + value + '" name="selHipoteseLegal"></input>').remove();
            }
          } else {
            element.val(value);
            var nameElement = idElement.indexOf("sel") !== -1 ? idElement.replace("sel", "") : false;
            if (nameElement && iframe.find("#hdnId" + nameElement).length > 0) {
              iframe.find("#hdnId" + nameElement).val(value);
            }
          }
        }
        $(this).unbind();
        if (iframe.find('button[type="submit"]').length > 0) {
          iframe.find('button[type="submit"]').trigger("click");
        } else {
          iframe.find('button[name="btnSalvar"]').trigger("click");
        }
        if (typeof callback === "function") callback();
      });
    } else {
      return false;
    }
  }
  function viewEspecifacaoProcesso() {
    setTimeout(() => {
      var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
      tableProc.find(".especifProc").remove();
      if (typeof storeGroupTablePro() === "undefined" || !storeGroupTablePro()) {
        tableProc.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').each(function() {
          var especifProc = extractTooltipToArray($(this).attr("onmouseover"));
          especifProc = especifProc ? especifProc[0] : false;
          if (especifProc) $(this).before('<div class="especifProc">' + especifProc + "</div>");
        });
      }
    }, 100);
  }
  function addNewItemSelect(_this) {
    if ($(_this).val().toString() == "0") {
      var textBox = 'Digite o nome do novo item:<br><br><span class="seiProForm" style="text-align: center; display: block; font-size: 9pt;">   <input type="text" style="width: 90% !important;" class="required infraText txtsheetsSelect" value="" id="nomeNovoItem"></span>';
      resetDialogBoxPro("alertBoxPro");
      alertBoxPro = $("#alertaBoxPro").html('<div class="dialogBoxDiv"> ' + textBox + "</span>").dialog({
        width: 400,
        title: "Adicionar novo item",
        open: function() {
          setTimeout(() => {
            $("#nomeNovoItem").focus();
          }, 500);
        },
        buttons: [{
          text: "Ok",
          class: "confirm",
          click: function() {
            saveNewItemSelect(_this);
          }
        }]
      });
    }
  }
  function saveNewItemSelect(_this) {
    var value = $("#nomeNovoItem").val();
    if (value != "") {
      resetDialogBoxPro("alertBoxPro");
      $(_this).prepend("<option selected>" + value + "</option>").val(value).change().chosen("destroy").chosen({
        placeholder_text_single: " ",
        no_results_text: "Nenhum resultado encontrado",
        normalize_search_text: function(text) {
          return removeAcentos(text.toLowerCase());
        }
      });
    }
  }
  function fullnameAtribuicao() {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    tableProc.find('a[href*="controlador.php?acao=procedimento_atribuicao_listar"]').each(function() {
      var nomeCompleto = getAtribuicaoDisplayLabel($(this).attr("title"), $(this).text(), true);
      if (nomeCompleto) $(this).text(nomeCompleto);
    });
  }
  function getAtribuicaoDisplayLabel(rawText, fallbackText = "", preferFullName = false) {
    var text = String(rawText || fallbackText || "").replace(/^Atribu[ií]do para\s*/i, "").trim();
    if (!text) {
      return "";
    }
    var parts = text.split(/\s-\s/).map(function(part) {
      return String(part || "").trim();
    }).filter(function(part) {
      return part !== "";
    });
    if (parts.length > 1) {
      var aliasPart = parts.filter(function(part) {
        return part.indexOf(".") !== -1 && part.indexOf(" ") === -1;
      })[0] || "";
      var namePart = parts.filter(function(part) {
        return part.indexOf(" ") !== -1;
      })[0] || "";
      if (preferFullName && namePart) {
        return namePart;
      }
      if (!preferFullName && aliasPart) {
        return aliasPart;
      }
      return namePart || aliasPart || parts[0];
    }
    return text;
  }
  function updateDadosArvoreMult(nameLink, values, idProcedimento, callback = false) {
    if (typeof idProcedimento !== "undefined" && idProcedimento != "" && idProcedimento !== null && idProcedimento != 0 && !checkProcessoSigiloso()) {
      if ($("#ifrArvore").length == 0) {
        if ($("#frmCheckerProcessoPro").length == 0) {
          getCheckerProcessoPro();
        }
        var url = "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + idProcedimento;
        $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
          var ifrArvore2 = $("#frmCheckerProcessoPro").contents().find("#ifrArvore");
          updateDadosArvoreMultIframe(nameLink, values, ifrArvore2, callback);
        });
      } else {
        var ifrArvore = $("#ifrArvore");
        updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback);
      }
    } else {
      return false;
    }
  }
  function updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback) {
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    var url = getTreeLinkUrlByName(nameLink);
    if (typeof url !== "undefined" && url != "") {
      $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
        var iframe = $(this).contents();
        function setValuesFrame(idElement, value) {
          var element = iframe.find("#" + idElement);
          if (element.is("select") && !hasNumber(value)) {
            element.find('option:contains("' + value + '")').prop("selected", true);
          } else {
            if (element.is(":radio") || element.is(":checkbox")) {
              element.prop("checked", true).trigger("change");
              if (idElement == "optRestrito" || idElement == "optSigiloso") {
                iframe.find("#selHipoteseLegal").after('<input id="selHipoteseLegal" value="' + value + '" name="selHipoteseLegal"></input>').remove();
              }
            } else {
              element.val(value);
              var nameElement = idElement.indexOf("sel") !== -1 ? idElement.replace("sel", "") : false;
              if (nameElement && iframe.find("#hdnId" + nameElement).length > 0) {
                iframe.find("#hdnId" + nameElement).val(value);
              }
            }
          }
        }
        $.each(values, function(i2, v) {
          setValuesFrame(v.element, v.value);
        });
        $(this).unbind();
        if (iframe.find('button[type="submit"]').length > 0) {
          iframe.find('button[type="submit"]').trigger("click");
        } else {
          iframe.find('button[name="btnSalvar"]').trigger("click");
        }
        if (typeof callback === "function") callback();
      });
    } else {
      return false;
    }
  }
  function automaticActions(type, mode, value = false, callback = false) {
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
    if (type == "anotacao" && mode == "remove") {
      updateDadosArvore("Anota\xE7\xF5es", "txaDescricao", "", id_procedimento, callback);
    } else if (type == "atribuicao" && mode == "remove") {
      updateDadosArvoreMult("Atribuir Processo", [{ element: "selAtribuicao", value: "null" }], id_procedimento, callback);
      console.log("Atribuir Processo", "selAtribuicao", "null", id_procedimento, callback);
    } else if (type == "urgencia_processo") {
      updateDadosArvore("Atualizar Andamento", "txaDescricao", (mode == "remove" ? "Removida" : "Adicionada") + " marca de urg\xEAncia no processo", id_procedimento, callback);
    } else if (type == "urgencia_documento") {
      console.log(type, mode, value);
      updateDadosArvore("Atualizar Andamento", "txaDescricao", (mode == "remove" ? "Removida" : "Adicionada") + " marca de urg\xEAncia no documento " + value, id_procedimento, callback);
    } else if (type == "marcador" && mode == "remove") {
      getRemoverMarcador(false);
    }
  }
  function getActionsOnSendProcess() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    ifrVisualizacao2.find("#frmAtividadeListar").on("submit", function() {
      var _this = $(this);
      var _parent = _this.closest("body");
      var checkMarcador = _parent.find("#chkSinRemoverMarcadores").is(":checked");
      var checkAtribuicao = _parent.find("#chkSinRemoverAtribuicao").is(":checked");
      var sendAutomaticActions = [];
      sendAutomaticActions[0] = { name: "marcador", method: "remove", send: checkMarcador, value: false, run: false, index: 0 };
      sendAutomaticActions[1] = { name: "atribuicao", method: "remove", send: checkAtribuicao, value: false, run: false, index: 1 };
      parent.window.sendAutomaticActions = sendAutomaticActions;
      getAutomaticActions();
    });
    htmlBoxActions = '<span id="divSinRemoveAttributes" style="margin: 0 10px;display: inline-block;">   <span style="margin: 0 10px;display: inline-block;">' + (SeiPro.sei.adapter.isNewSEI() ? '      <div class="infraCheckboxDiv "><input type="checkbox" id="chkSinRemoverMarcadores" name="chkSinRemoverMarcadores" class="infraCheckboxInput" tabindex="509"><label class="infraCheckboxLabel " for="chkSinRemoverMarcadores"></label></div>' : '      <input type="checkbox" id="chkSinRemoverMarcadores" name="chkSinRemoverMarcadores" class="infraCheckbox" tabindex="0">') + '     <label id="lblSinRemoverMarcadores" for="chkSinRemoverMarcadores" accesskey="" class="infraLabelCheckbox">Remover marcadores</label>   </span>   <span style="margin: 0 10px;display: inline-block;">' + (SeiPro.sei.adapter.isNewSEI() ? '      <div class="infraCheckboxDiv "><input type="checkbox" id="chkSinRemoverAtribuicao" name="chkSinRemoverAtribuicao" class="infraCheckboxInput" tabindex="509"><label class="infraCheckboxLabel " for="chkSinRemoverAtribuicao"></label></div>' : '      <input type="checkbox" id="chkSinRemoverAtribuicao" name="chkSinRemoverAtribuicao" class="infraCheckbox" tabindex="0">') + '     <label id="lblSinRemoverAtribuicao" for="chkSinRemoverAtribuicao" accesskey="" class="infraLabelCheckbox">Remover atribui\xE7\xE3o</label>   </span></span>';
    ifrVisualizacao2.find("#divSinRemoveAttributes").remove();
    ifrVisualizacao2.find("#divSinRemoverAnotacoes").append(htmlBoxActions);
    if (checkConfigValue("naoassinados") && $('div.ui-dialog[aria-describedby="dialogBoxPro"]').length == 0) {
      initCheckNaoAssinados();
    }
    ifrVisualizacao2.find("#txtUnidade").on("blur", function() {
      ifrVisualizacao2.find("#selUnidades").attr("size", ifrVisualizacao2.find("#selUnidades option").length);
    }).on("keypress", function() {
      ifrVisualizacao2.find("#selUnidades").attr("size", ifrVisualizacao2.find("#selUnidades option").length);
    });
    var hdnUnidades = ifrVisualizacao2.find("#hdnUnidades");
    if (interessadosSendPro && interessadosSendPro.length && hdnUnidades.val() == "") {
      $.each(interessadosSendPro, function(i2, v) {
        var hdnInteressadosProcedimento = v.id + "\xB1" + v.descricao;
        hdnInteressadosProcedimento = hdnUnidades.val() != "" ? hdnUnidades.val() + "\xA5" + hdnInteressadosProcedimento : hdnInteressadosProcedimento;
        ifrVisualizacao2.find("#hdnUnidades").val(hdnInteressadosProcedimento);
        ifrVisualizacao2.find("#selUnidades").append('<option value="' + v.id + '">' + v.descricao + "</option>");
      });
      ifrVisualizacao2.find("#selUnidades option").prop("selected", true);
    }
  }
  function getFaviconNrProcesso() {
    setTimeout(() => {
      var nrProcNVisualizados = $("a.processoNaoVisualizado").length;
      if (nrProcNVisualizados > 0) {
        window.favicon = new Favico({
          animation: "none"
        });
        favicon.badge(nrProcNVisualizados);
        if (SeiPro.sei.adapter.isNewSEI()) {
          setTimeout(() => {
            var icon = $('link[rel="shortcut icon"]').attr("href");
            $('link[rel="icon"]').attr("href", icon);
          }, 500);
        }
      }
    }, 1e3);
  }
  function getAutomaticActions() {
    var arrayAutomatic = parent.window.sendAutomaticActions;
    if (typeof arrayAutomatic !== "undefined" && arrayAutomatic !== null && arrayAutomatic.length > 0) {
      var nextRun = jmespath.search(arrayAutomatic, "[?run==`false`] | [0]");
      nextRun = nextRun !== null ? nextRun : false;
      if (nextRun) {
        if (nextRun.send) {
          automaticActions(nextRun.name, nextRun.method, nextRun.value, function() {
            parent.window.sendAutomaticActions[nextRun.index].run = true;
            setTimeout(function() {
              getAutomaticActions();
            }, 1e3);
          });
        }
      } else {
        parent.window.sendAutomaticActions === void 0;
      }
    }
  }
  function getListaGruposAcompEsp(html) {
    var indexSelected = 0;
    var selectGroup = html.find("#selGrupoAcompanhamento").find("option").map(function(i2, v) {
      if ($(this).is(":selected")) indexSelected = i2 - 1;
      if ($(this).text().trim() != "") {
        return { name: $(this).text().trim(), value: $(this).val() };
      }
    }).get();
    if (selectGroup.length > 0) {
      setOptionsPro("listaGruposAcompEsp", selectGroup);
      setOptionsPro("listaGruposAcompEsp_unidade", idUnidade);
    }
    return { array: selectGroup, indexSelected };
  }
  function initDocImagemPro() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvore = $("#ifrArvore").contents();
    var docSelected = ifrArvore.find(".infraArvoreNoSelecionado");
    var protocoloSelected = getParamsUrlPro(docSelected.closest("a").attr("href")).id_documento;
    if (typeof protocoloSelected !== "undefined") {
      var iconSelected = ifrArvore.find("#anchorImg" + protocoloSelected).find("img").attr("src");
      if (iconSelected.indexOf("imagem") !== -1) {
        checkDocImagemPro(ifrVisualizacao2);
      }
    }
  }
  function initCheckNaoAssinados() {
    var _ifrArvore = $("#ifrArvore");
    var ifrArvore = _ifrArvore.contents();
    var urlAllPasta = ifrArvore.find('#topmenu a[id*="anchorAP"]').attr("href");
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    ifrVisualizacao2.find("#checkNaoAssinados").remove();
    var htmlLoading = '<div id="checkNaoAssinados">   <i class="fas fa-sync fa-spin" style="color:#444;margin-right: 5px;"></i> Verificando documentos n\xE3o assinados na unidade <strong style="text-decoration: underline;">' + siglaUnidadeAtual + "</strong>   </div>";
    var htmlSucess = '<div id="checkNaoAssinados" style="background: #fff1f0">   <i class="fas fa-times-circle vermelhoColor" style="margin-right: 5px;"></i> Existem documentos n\xE3o assinados na unidade <strong style="text-decoration: underline;">' + siglaUnidadeAtual + '</strong>   <a class="newLink" onclick="parent.openCheckNaoAssinados()" style="margin: 0 10px;font-size: 1em;">Detalhes</a></div>';
    var htmlEmpty = '<div id="checkNaoAssinados">   <i class="fas fa-check-circle verdeColor" style="margin-right: 5px;"></i> Todos os documentos foram assinados na unidade <strong style="text-decoration: underline;">' + siglaUnidadeAtual + "</strong></div>";
    var htmlNull = '<div id="checkNaoAssinados">   <i class="fas fa-exclamation-triangle laranjaColor" style="margin-right: 5px;"></i> N\xE3o foi poss\xEDvel verificar a exist\xEAncia de documentos n\xE3o assinados na unidade <strong style="text-decoration: underline;">' + siglaUnidadeAtual + '</strong>   <a class="newLink" onclick="parent.initCheckNaoAssinados()" style="margin: 0 10px;font-size: 1em;">Tentar novamente</a></div>';
    var htmlCheckNaoAssinados = htmlLoading;
    ifrVisualizacao2.find("#divInfraBarraLocalizacao").append(htmlCheckNaoAssinados);
    mergeAllAndamentosProcesso(function() {
      var dadosProcesso = pullDadosProcessoSession();
      var listDocumentos = getTreeDocumentsSession(dadosProcesso);
      if (typeof listDocumentos !== "undefined" && listDocumentos.length > 0 && checkObjHasProperty(listDocumentos, "unidade")) {
        var listNaoAssinado = jmespath.search(listDocumentos, "[?assinado==`false`] | [?unidade=='" + siglaUnidadeAtual + "'] | [?nativo]");
        if (listNaoAssinado.length == 0) {
          htmlCheckNaoAssinados = htmlEmpty;
        } else if (listNaoAssinado.length > 0) {
          htmlCheckNaoAssinados = htmlSucess;
          openCheckNaoAssinados();
        } else if (listNaoAssinado == null) {
          htmlCheckNaoAssinados = htmlNull;
        }
        ifrVisualizacao2.find("#checkNaoAssinados").remove();
        ifrVisualizacao2.find("#divInfraBarraLocalizacao").append(htmlCheckNaoAssinados);
        if (listNaoAssinado.length == 0) {
          ifrVisualizacao2.find("#txtUnidade").focus();
        }
      } else if (typeof listDocumentos !== "undefined" && typeof urlAllPasta !== "undefined" && urlAllPasta !== "") {
        getListDocumentosArvore(ifrArvore);
        initCheckNaoAssinados();
      }
      console.log("listNaoAssinado", listNaoAssinado, listDocumentos);
    });
    setTimeout(function() {
      if (ifrVisualizacao2.find("#checkNaoAssinados").hasClass("loadingNaoAssinados")) {
        htmlCheckNaoAssinados = htmlNull;
        ifrVisualizacao2.find("#checkNaoAssinados").remove();
        ifrVisualizacao2.find("#divInfraBarraLocalizacao").append(htmlCheckNaoAssinados);
        if (pullDadosProcessoSession()) {
          dadosProcessoPro = pullDadosProcessoSession();
        }
      }
    }, 12e3);
  }
  function openCheckNaoAssinados() {
    var _ifrArvore = $("#ifrArvore");
    var ifrArvore = _ifrArvore.contents();
    var urlAllPasta = "";
    if (typeof urlAllPasta !== "undefined" && urlAllPasta !== "") {
      _ifrArvore.attr("src", urlAllPasta).unbind().on("load", function() {
        $(this).unbind();
        boxCheckNaoAssinados();
      });
    } else {
      boxCheckNaoAssinados();
    }
  }
  function boxCheckNaoAssinados() {
    var dadosProcesso = pullDadosProcessoSession();
    var listDocumentos = getTreeDocumentsSession(dadosProcesso);
    var listNaoAssinado = jmespath.search(listDocumentos, "[?assinado==`false`] | [?unidade=='" + siglaUnidadeAtual + "'] | [?nativo]");
    var htmlBox = '<div style="font-size: 10pt;display: block;color: #444;margin: 10px 0;padding: 5px;background: #fff1f0;border-radius: 5px;">   <i class="fas fa-times-circle vermelhoColor" style="margin-right: 5px;"></i> Existem documentos n\xE3o assinados na unidade <strong style="text-decoration: underline;">' + siglaUnidadeAtual + '</strong></div><div style="max-height: 280px;overflow-y: scroll;padding: 10px 0;">';
    $.each(listNaoAssinado, function(index, value) {
      htmlBox += '<div style="margin: 15px 0">   <a class="newLink" onclick="getDocOnArvore(' + value.id_protocolo + ')" style="display: initial;font-size: 10pt;"><i class="far fa-file azulColor" style="margin-right: 5px;"></i>' + value.documento + " (" + value.nr_sei + ')</a>   <span style="float: right;font-size: 10pt;">' + (value.data_documento && value.data_documento !== "" ? getDatesPreview({ date: value.data_documento }) : "") + "</span></div>";
    });
    htmlBox += "</div>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "Documentos pendentes de assinatura",
      width: 700,
      open: function() {
        var ifrArvore = $("#ifrArvore");
        var href = getTreeLinkUrlByName("Enviar Processo");
        if (href !== null) {
          setTimeout(function() {
            document.getElementById(ifrVisualizacao_).setAttribute("src", href[0]);
          }, 500);
        }
      },
      close: function() {
        $("#dialogBoxDiv").remove();
        resetDialogBoxPro("dialogBoxPro");
      }
    });
  }
  function getDocOnArvore(id_documento) {
    var _ifrArvore = $("#ifrArvore");
    var _ifrVisualizacao = $($ifrVisualizacao);
    var ifrArvore = _ifrArvore.contents();
    var linkDoc = ifrArvore.find("#anchor" + id_documento);
    var urlDoc = linkDoc.attr("href");
    if (typeof urlDoc !== "undefined") {
      _ifrVisualizacao.attr("src", urlDoc);
      linkDoc.unbind("click").trigger("click");
      scrollToElement(ifrArvore.find("#container"), linkDoc, 10);
    }
  }
  function checkDocImagemPro(ifrVisualizacao2, TimeOut = 9e3) {
    var imgDoc = ifrVisualizacao2.find($ifrArvoreHtml).contents().find("img");
    if (TimeOut <= 0) {
      return;
    }
    if (imgDoc.length > 0) {
      setTimeout(function() {
        ifrVisualizacao2.find($ifrArvoreHtml).contents().find("img").eq(0).addClass("zoomInPro").css({ "width": "100%", "cursor": "zoom-in" }).attr("onclick", "parent.parent.zoomImagemPro(this)");
        console.log("initDocImagemPro");
      }, 500);
    } else {
      setTimeout(function() {
        checkDocImagemPro(ifrVisualizacao2, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload checkDocImagemPro");
      }, 500);
    }
  }
  function zoomImagemPro(this_) {
    var _this = $(this_);
    if (_this.hasClass("zoomInPro")) {
      _this.removeClass("zoomInPro").css({ "width": "", "cursor": "zoom-out" });
    } else {
      _this.addClass("zoomInPro").css({ "width": "100%", "cursor": "zoom-in" });
    }
  }
  function initDocZipPro() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvore = $("#ifrArvore").contents();
    var docSelected = ifrArvore.find(".infraArvoreNoSelecionado");
    var protocoloSelected = getParamsUrlPro(docSelected.closest("a").attr("href")).id_documento;
    if (typeof protocoloSelected !== "undefined") {
      var iconSelected = ifrArvore.find("#anchorImg" + protocoloSelected).find("img").attr("src");
      var linkFile = ifrVisualizacao2.find(divInformacao + " " + ancoraArvoreDownload).attr("href");
      if (iconSelected.indexOf("zip") !== -1) {
        checkDocZipPro(ifrVisualizacao2);
      }
    }
  }
  function checkDocZipPro(ifrVisualizacao2, TimeOut = 9e3) {
    var linkFile = ifrVisualizacao2.find(divInformacao + " " + ancoraArvoreDownload).attr("href");
    if (TimeOut <= 0) {
      return;
    }
    if (typeof linkFile !== "undefined") {
      loadDocZipPro(linkFile, ifrVisualizacao2);
    } else {
      setTimeout(function() {
        checkDocZipPro(ifrVisualizacao2, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload checkDocZipPro");
      }, 500);
    }
  }
  function loadDocZipPro(linkFile, ifrVisualizacao2) {
    var divVideo = '<div id="divZip">   <div class="explorer">      <div class="directories">          <div id="tree" class="tree"></div>      </div>      <div id="separator" draggable="false"></div>      <div class="files">          <ul id="listing" class="listing"><div class="loading"><i class="fas fa-spin fa-spinner"></i></div></ul>      </div>   </div></div>';
    ifrVisualizacao2.find("#divZip").remove();
    ifrVisualizacao2.find(divInformacao).after(divVideo);
    if (typeof JSZipUtils !== "undefined") {
      openDocZipPro(ifrVisualizacao2);
    } else {
      $.getScript(URL_SPRO + "js/lib/jszip.min.js", function() {
        $.getScript(URL_SPRO + "js/lib/jszip-utils.min.js", function() {
          openDocZipPro(ifrVisualizacao2);
        });
      });
    }
  }
  function openDocZipPro(ifrVisualizacao2) {
    var urlZip = ifrVisualizacao2.find(ancoraArvoreDownload).attr("href");
    JSZipUtils.getBinaryContent(urlZip, function(err, data) {
      if (err) {
        throw err;
      }
      JSZip.loadAsync(data).then(function(zip) {
        let i2 = 0;
        window.zip = [];
        ifrVisualizacao2.find("#divZip .files #listing .loading").remove();
        zip.forEach(function(relativePath, zipEntry) {
          var name = zipEntry.name;
          var path = !zipEntry.dir && name.indexOf("/") !== -1 ? name.split("/") : false;
          name = path ? '<span class="tab"></span>'.repeat(path.length) + path[path.length - 1] : name;
          var date = moment(zipEntry.date).format("DD/MM/YYYY HH:mm:ss");
          var size = infraFormatarTamanhoBytes(zipEntry._data.uncompressedSize);
          size = !zipEntry.dir ? size : "";
          var click = zipEntry.dir ? "" : `onclick="parent.openFileZip(${i2})"`;
          ifrVisualizacao2.find("#divZip .files #listing").append(`<li ${click}><a>${name}</a><span class="date">${date}</span><span class="size">${size}</span></li>`);
          window.zip[i2] = zipEntry;
          i2++;
        });
      });
    });
  }
  function openFileZip(i2) {
    if (typeof window.zip !== "undefined") {
      window.zip[i2].async("blob").then(function(blob) {
        var nameFile = window.zip[i2].name;
        var downloadLink = document.createElement("a");
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = nameFile;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    }
  }
  function getScriptIframe(iframe, src, callback = false) {
    var script = iframe.contentWindow.document.createElement("script");
    script.type = "text/javascript";
    script.addEventListener("load", function(event2) {
      if (callback) callback();
    });
    script.src = src;
    iframe.contentWindow.document.head.appendChild(script);
  }
  function initDocVideoPro() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvore = $("#ifrArvore").contents();
    var docSelected = ifrArvore.find(".infraArvoreNoSelecionado");
    var protocoloSelected = getParamsUrlPro(docSelected.closest("a").attr("href")).id_documento;
    if (typeof protocoloSelected !== "undefined") {
      var iconSelected = ifrArvore.find("#anchorImg" + protocoloSelected).find("img").attr("src");
      var linkFile = ifrVisualizacao2.find(divInformacao + " " + ancoraArvoreDownload).attr("href");
      if (iconSelected.indexOf("video") !== -1) {
        checkDocVideoPro(ifrVisualizacao2);
      }
    }
  }
  function insertActionInteressadosSend(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var iconEnviar = ifrVisualizacao2.find('a[href*="acao=procedimento_enviar"]');
    if (iconEnviar.length) {
      iconEnviar.attr("onclick", "parent.setInteressadosSend()");
    } else {
      if (loop) {
        setTimeout(function() {
          insertActionInteressadosSend(false);
        }, 1500);
      }
    }
  }
  function insertIconNewTab() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvore = $("#ifrArvore");
    var arrayLinksArvoreAll2 = getTreeLinksAllSession();
    var docSelected = ifrArvore.contents().find(".infraArvoreNoSelecionado");
    var id_documento = getParamsUrlPro(docSelected.closest("a").attr("href")).id_documento;
    if (typeof id_documento !== "undefined") {
      var listLinks = getTreeLinksAllSession().filter(function(v) {
        return v.indexOf("id_documento=" + id_documento) !== -1 && v.indexOf("documento_visualizar") !== -1;
      });
      if (listLinks.length > 0 && listLinks[0] != "") {
        var html = '<a class="openNewTab" style="margin: 10px 5px;padding: 5px;border-radius: 5px 0 0 5px;background-color: #eaeaea;color: #666;text-decoration: none;right: 60px;position: absolute;user-select: none;" href="' + url_host.replace("controlador.php", "") + listLinks[0] + '" target="_blank">   <i class="fas fa-external-link-square-alt" style="color:#4285f4"></i> Abrir documento em nova aba</a><a class="openNewTab" data-id_protocolo="' + id_documento + `" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Baixar documento (HTML)')" style="margin: 10px 5px;padding: 5px;border-radius: 0 5px 5px 0;background-color: #eaeaea;color: #666;text-decoration: none;right: 40px;position: absolute;user-select: none;" onclick="parent.downloadDocumentVisualizacao(this)" target="_blank">   <i class="fas fa-download" style="color:#4285f4"></i></a>`;
        ifrVisualizacao2.find(".openNewTab").remove();
        ifrVisualizacao2.find("#divArvoreAcoes").after(html);
      }
    }
  }
  function getNomeSei(nameDoc) {
    var documento = nameDoc.split(" ");
    var nr_sei = nameDoc.indexOf(" ") !== -1 ? documento[documento.length - 1] : "";
    documento = documento.indexOf(nr_sei) !== -1 ? nameDoc.replace(nr_sei, "").trim() : nameDoc;
    return documento;
  }
  function downloadDocumentVisualizacao(this_) {
    var this_ = $(this_);
    var data = this_.data();
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvore = $("#ifrArvore").contents();
    var ifrArvoreHtml = ifrVisualizacao2.find($ifrArvoreHtml).contents();
    var doc = ifrArvore.find("#anchor" + data.id_protocolo);
    var nameDoc = doc.text().trim();
    var nr_sei = getNrSei(nameDoc);
    var citacaoDoc = getCitacaoDoc();
    var documento = getNomeSei(nameDoc);
    var nameFile = documento + " (" + citacaoDoc + nr_sei + ")";
    this_.find("i").attr("class", "fas fa-thumbs-up");
    setTimeout(function() {
      this_.find("i").attr("class", "fas fa-download");
    }, 1e3);
    var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
    contentDocument += ifrArvoreHtml.find("html")[0].outerHTML;
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\uFEFF", contentDocument]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile + ".html";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  function setHtmlProtocoloAlterar() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvore = $("#ifrArvore").contents();
    var form = ifrVisualizacao2.find("#frmProcedimentoCadastro");
    var formVisualizacao = form.attr("action");
    var divProtocolo = ifrVisualizacao2.find("#divProtocoloExibir");
    if (formVisualizacao.indexOf("controlador.php?acao=procedimento_alterar&acao_origem=procedimento_alterar&arvore=1&id_procedimento=") !== -1 && form.length == 1 && divProtocolo.length == 0) {
      var html = '<div id="divProtocoloExibir" class="infraAreaDados" style="height:4.5em;position:relative;width: 90%;">    <div style="float:left">    <label id="lblProtocoloExibir" for="txtProtocoloExibir" accesskey="" class="infraLabelObrigatorio">Protocolo:</label>    <input type="text" id="txtProtocoloExibir" name="_txtProtocoloExibir" class="infraText infraReadOnly" readonly="readonly" value="' + ifrVisualizacao2.find("#hdnProtocoloProcedimentoFormatado").val() + '">    </div>    <div style="float:right">       <label id="lblDtaGeracaoExibir" for="txtDtaGeracaoExibir" accesskey="" class="infraLabelObrigatorio">Data de Autua\xE7\xE3o:</label>       <input type="text" id="txtDtaGeracaoExibir" name="txtDtaGeracaoExibir" class="infraText infraReadOnly" readonly="readonly" value="' + ifrVisualizacao2.find("#hdnDtaGeracao").val() + '">    </div></div>';
      ifrVisualizacao2.find("#divInfraBarraComandosSuperior").after(html);
    }
    if (form.length > 0 && ifrVisualizacao2.find("#txtDescricao").length) {
      ifrVisualizacao2.find("div.urgentePro").remove();
      ifrVisualizacao2.find("#txtDescricao").css("width", "86%").attr("data-oldtext", ifrVisualizacao2.find("#txtDescricao").val()).after(`<div class="urgentePro" style="right: 11%;top: 10px;" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar('Adicionar/remover marca de Urg\xEAncia');" onmouseout="return infraTooltipOcultar();"></div>`);
      formControlerAlterarProcesso(ifrVisualizacao2);
    }
  }
  function formControlerAlterarProcesso(ifrVisualizacao2) {
    ifrVisualizacao2.find('button[name="btnSalvar"]').on("click", function() {
      var _this = $(this);
      var _parent = _this.closest("body");
      var oldText = _parent.find("#txtDescricao").attr("data-oldtext");
      var newTipoProc = _parent.find("#selTipoProcedimento").val();
      var newNameTipoProc = _parent.find("#selTipoProcedimento option:selected").text();
      var newText = _parent.find("#txtDescricao").val();
      var checkAddUrgencia = typeof oldText !== "undefined" && oldText.toLowerCase().indexOf("(urgente)") === -1 && typeof newText !== "undefined" && newText.toLowerCase().indexOf("(urgente)") !== -1 ? true : false;
      var checkRemoveUrgencia = typeof oldText !== "undefined" && oldText.toLowerCase().indexOf("(urgente)") !== -1 && typeof newText !== "undefined" && newText.toLowerCase().indexOf("(urgente)") === -1 ? true : false;
      var methodSend = checkAddUrgencia ? "add" : false;
      methodSend = checkRemoveUrgencia ? "remove" : methodSend;
      var checkSend = checkAddUrgencia || checkRemoveUrgencia ? true : false;
      if (typeof $($ifrVisualizacao)[0].contentWindow.OnSubmitForm !== "undefined" && $($ifrVisualizacao)[0].contentWindow.OnSubmitForm()) {
        if (typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.propProcesso === "undefined" && typeof pullDadosProcessoSession() !== "undefined" && pullDadosProcessoSession().propProcesso !== "undefined") {
          dadosProcessoPro.propProcesso = pullDadosProcessoSession().propProcesso;
        }
        if (typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.propProcesso !== "undefined" && typeof dadosProcessoPro.propProcesso.txtDescricao !== "undefined") {
          dadosProcessoPro.propProcesso.txtDescricao = newText;
          dadosProcessoPro.propProcesso.selTipoProcedimento = newTipoProc;
          dadosProcessoPro.propProcesso.hdnIdTipoProcedimento = newTipoProc;
          dadosProcessoPro.propProcesso.hdnNomeTipoProcedimento = newNameTipoProc;
          setSessionProcessosPro(dadosProcessoPro);
        }
        var sendAutomaticActions = [];
        sendAutomaticActions[0] = { name: "urgencia_processo", method: methodSend, send: checkSend, value: false, run: false, index: 0 };
        parent.window.sendAutomaticActions = sendAutomaticActions;
        getAutomaticActions();
      }
    });
  }
  function checkDocVideoPro(ifrVisualizacao2, TimeOut = 9e3) {
    var linkFile = ifrVisualizacao2.find(divInformacao + " " + ancoraArvoreDownload).attr("href");
    if (TimeOut <= 0) {
      return;
    }
    if (typeof linkFile !== "undefined") {
      loadDocVideoPro(linkFile, ifrVisualizacao2);
      console.log("loadDocVideoPro");
    } else {
      setTimeout(function() {
        checkDocVideoPro(ifrVisualizacao2, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload checkDocVideoPro");
      }, 500);
    }
  }
  function loadDocVideoPro(linkFile, ifrVisualizacao2) {
    var divVideo = '<div style="width:100%;margin-top: 10px;display: inline-block;clear: both;background: #505050;height: inherit;" id="divVideo">    <video width="100%" height="100%" autoplay muted controls loop>        <source src="' + linkFile + '">        Seu navegador n\xE3o suporta reproduzir v\xEDdeos. Baixe o arquivo para visualiz\xE1-lo.    </video></div>';
    ifrVisualizacao2.find("#divVideo").remove();
    ifrVisualizacao2.find(divInformacao).after(divVideo);
    ifrVisualizacao2.find("#divVideo video").on("loadedmetadata", function(event2) {
      this.currentTime = 0;
    });
  }
  function updateButtonConfirm(this_, check) {
    var _this = $(this_);
    var btnConfirm = _this.closest(".ui-dialog").find(".ui-dialog-buttonset .confirm");
    if (check) {
      btnConfirm.addClass("ui-state-active");
    } else {
      btnConfirm.removeClass("ui-state-active");
    }
  }
  function checkLoadingButtonConfirm() {
    var btnConfirm = $(".ui-dialog:visible").find(".ui-dialog-buttonset .confirm");
    if (btnConfirm.is(":visible") && btnConfirm.hasClass("loading")) {
      return true;
    } else {
      return false;
    }
  }
  function loadingButtonConfirm(check) {
    var i2 = 0;
    if ($(".ui-dialog:visible").length > 0) {
      var i_highest = 0;
      $(".ui-dialog:visible").each(function(index) {
        var i_current = parseInt($(this).css("zIndex"), 10);
        if (i_current > i_highest) {
          i_highest = i_current;
          i2 = index;
        }
      });
    }
    var btnConfirm = $(".ui-dialog:visible").eq(i2).find(".ui-dialog-buttonset .confirm");
    if (btnConfirm.is(":visible")) {
      var oldText = typeof btnConfirm.data("text") == "undefined" ? btnConfirm.data("text", btnConfirm.text()) : btnConfirm.data("text");
      oldText = btnConfirm.data("text");
      var html = check ? '<i class="fas fa-sync fa-spin cinzaColor"></i>' : oldText;
      btnConfirm.removeClass("ui-state-active").html(html);
      if (check) {
        btnConfirm.addClass("loading");
      } else {
        btnConfirm.removeClass("loading");
      }
    }
  }
  function checkLimitText(this_) {
    var _this = $(this_);
    var maxlength = _this.attr("maxlength");
    var currentLength = _this.is("textarea") ? _this.val().length : _this.text().trim().length;
    var textCount = currentLength >= maxlength ? "Voc\xEA atingiu o n\xFAmero m\xE1ximo de caracteres." : maxlength - currentLength + " caracteres restantes";
    _this.closest("div").find(".countLimit").html(textCount);
  }
  function followSelecionarItens(this_) {
    var _this = $(this_);
    if (_this.is(":checked")) {
      _this.closest("tr").addClass("infraTrMarcada");
    } else {
      _this.closest("tr").removeClass("infraTrMarcada");
    }
  }
  function waitLoadPro(Obj, ElemRaiz, Elem, func, TimeOut = 6e3) {
    if (TimeOut <= 0) return;
    var $obj = Obj && typeof Obj.find === "function" ? Obj : $(Obj);
    var $root = $obj.find(ElemRaiz);
    var hasTarget = function() {
      return $root.find(Elem).length > 0;
    };
    if (hasTarget()) {
      func();
      return;
    }
    if (typeof MutationObserver === "function") {
      var rootNode = $root.get(0) || $obj.get(0) || document.body || document.documentElement;
      if (rootNode && rootNode.nodeType === 9) {
        rootNode = rootNode.documentElement || rootNode.body || rootNode;
      }
      if (rootNode) {
        window.__SEI_PRO_WAIT_LOAD_OBSERVERS__ = window.__SEI_PRO_WAIT_LOAD_OBSERVERS__ || /* @__PURE__ */ new WeakMap();
        var rootObservers = window.__SEI_PRO_WAIT_LOAD_OBSERVERS__.get(rootNode);
        if (!rootObservers) {
          rootObservers = {};
          window.__SEI_PRO_WAIT_LOAD_OBSERVERS__.set(rootNode, rootObservers);
        }
        var waitKey = ElemRaiz + "::" + Elem;
        if (rootObservers[waitKey]) return;
        var observer = new MutationObserver(function() {
          if (hasTarget()) {
            observer.disconnect();
            delete rootObservers[waitKey];
            func();
          }
        });
        rootObservers[waitKey] = observer;
        observer.observe(rootNode, {
          childList: true,
          subtree: true
        });
        return;
      }
    }
    setTimeout(function() {
      waitLoadPro($obj, ElemRaiz, Elem, func, TimeOut - 100);
    }, 100);
  }
  function waitLoadProSimple(Elem, func, TimeOut = 6e3) {
    if (TimeOut <= 0) return;
    var $elem = Elem && typeof Elem.length !== "undefined" ? Elem : $(Elem);
    if ($elem && $elem.length > 0) {
      func();
      return;
    }
    if (typeof MutationObserver === "function") {
      var rootNode = document.body || document.documentElement;
      if (rootNode) {
        window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ = window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ || false;
        if (window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__) return;
        window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ = true;
        var observer = new MutationObserver(function() {
          var currentElem = Elem && typeof Elem.length !== "undefined" ? Elem : $(Elem);
          if (currentElem && currentElem.length > 0) {
            observer.disconnect();
            window.__SEI_PRO_WAIT_LOAD_SIMPLE_OBSERVER__ = false;
            func();
          }
        });
        observer.observe(rootNode, {
          childList: true,
          subtree: true
        });
        return;
      }
    }
    setTimeout(function() {
      waitLoadProSimple($elem, func, TimeOut - 100);
    }, 100);
  }
  function execArvorePro(func) {
    var Obj = $("#ifrArvore").contents();
    waitLoadPro(Obj, "#divArvore > div", `a[target="${ifrVisualizacao_}"]`, function() {
      func();
      Obj.find("#divArvore > div > div:hidden").each(function() {
        var idPasta = Obj.find(this).attr("id").substr(3);
        Obj.find("#ancjoin" + idPasta).on("click", function() {
          waitLoadPro(Obj, "#div" + idPasta, `a[target="${ifrVisualizacao_}"]`, func);
          $("#ifrArvore")[0].contentWindow.getLinksArvorePasta(idPasta);
          $(this).off("click");
        });
      });
    });
  }
  function setClickUrlAmigavel() {
    $("#ifrArvore").contents().find('a[target="ifrVisualizacao"]').unbind().on("click", function() {
      updateUrlPage(false);
    });
  }
  function arrayIDProcedimentos() {
    return localStorageRestorePro("arrayIDProcedimentos");
  }
  function setArrayIDProcedimentos(newArray) {
    localStorageStorePro("arrayIDProcedimentos", newArray);
    if (typeof newArray !== "undefined" && newArray.length > 0) {
      console.log("setArrayIDProcedimentos", "->", window.name, "->", "count->" + newArray.length, "time->" + totalSecondsTestText);
    }
    parent.updateCountnewFiltro(newArray);
  }
  function callInitCheckDadosProcedimentosFrame(frame, attemptsLeft = 20) {
    if (!frame || !frame.contentWindow) {
      return;
    }
    var frameWindow = frame.contentWindow;
    if (typeof frameWindow.initCheckDadosProcedimentos === "function") {
      frameWindow.statusPesquisaDadosProcedimentos = true;
      frameWindow.initCheckDadosProcedimentos();
      return;
    }
    if (attemptsLeft <= 0) {
      return;
    }
    setTimeout(function() {
      callInitCheckDadosProcedimentosFrame(frame, attemptsLeft - 1);
    }, 200);
  }
  function updateCountnewFiltro(newArray) {
    var max = parseInt($("#selectProgressoBar_GroupTable").attr("aria-valuemax"));
    max = typeof max !== "undefined" ? max : 0;
    var index = typeof newArray !== "undefined" && newArray.length > 0 && max > 0 ? max - newArray.length : 0;
    var i2 = index > 0 && max > 0 ? index + "/" + max : "";
    $("#newFiltroCounter").html(i2);
  }
  function getDadosProcedimentosControlar() {
    var newArrayIDProcedimentos = [];
    var storeRecebimento = typeof localStorageRestorePro("configDataRecebimentoPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configDataRecebimentoPro")) ? localStorageRestorePro("configDataRecebimentoPro") : [];
    $("#frmProcedimentoControlar").find("a.processoVisualizado").not(".processoNaoVisualizado, .processoNaoVisualizadoSigiloso, .processoVisualizadoSigiloso, .processoCredencialAssinaturaSigiloso").each(function() {
      var id_procedimento = String(getParamsUrlPro($(this).attr("href")).id_procedimento);
      var processo = $(this).text().trim();
      if (jmespath.search(storeRecebimento, "[?id_procedimento=='" + id_procedimento + "'] | length(@)") == 0 && jmespath.search(newArrayIDProcedimentos, "[?processo=='" + processo + "'] | length(@)") == 0) {
        newArrayIDProcedimentos.push({ processo, id_procedimento });
      }
    });
    setArrayIDProcedimentos(newArrayIDProcedimentos);
    initCheckDadosProcedimentos();
  }
  function newTabDadosProcedimentosControlar() {
    var href = window.location.href + "#&acao_pro=pesquisa_agrupamento";
    cancelDadosProcedimentosControlar();
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    setOptionsPro("newTabSearchProcedimentos", true);
    newTab = window.open(href, "Pesquisa de Processos", "height=100,width=400,toolbar=0,menubar=0,location=0");
    if (window.focus) {
      newTab.focus();
    }
    observeNewTabDados();
    $("#frmCheckerProcessoPro").remove();
  }
  function observeNewTabDados() {
    var loopNewTab = setInterval(function() {
      if (typeof newTab !== "undefined" && newTab.closed || !getOptionsPro("newTabSearchProcedimentos")) {
        clearInterval(loopNewTab);
        updateGroupTable($("#selectGroupTablePro"));
        setOptionsPro("newTabSearchProcedimentos", false);
        console.log("## close tab");
      } else {
        console.log("@ reload tab");
      }
    }, 1e3);
  }
  function initCheckDadosProcesso(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof jmespath !== "undefined") {
      getCheckDadosProcesso();
    } else {
      setTimeout(function() {
        initInfraImg(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initInfraImg");
      }, 500);
    }
  }
  function getCheckDadosProcesso() {
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    if (getUrlAcaoPro("duplicar_documento")) {
      var arrayCurrentCloneDoc = getOptionsPro("currentCloneDoc");
      if (arrayCurrentCloneDoc) {
        console.log("duplicar_documento", arrayCurrentCloneDoc);
        $("#ifrArvore")[0].contentWindow.getDuplicateDoc(arrayCurrentCloneDoc.nameDoc, arrayCurrentCloneDoc.paramDoc);
        removeOptionsPro("currentCloneDoc");
        history.replaceState("", document.title, window.location.href.split("#")[0]);
      }
    }
  }
  function initCheckDadosProcedimentos() {
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    if (typeof acao_pro === "undefined" && arrayIDProcedimentos().length > 0) {
      if (!getOptionsPro("newTabSearchProcedimentos")) {
        if ($("#frmCheckerProcessoPro").length == 0) {
          getCheckerProcessoPro();
        }
        var href = window.location.href + "#&acao_pro=pesquisa_agrupamento";
        $("#frmCheckerProcessoPro").attr("src", href).unbind().on("load", function() {
          callInitCheckDadosProcedimentosFrame(this);
          $(this).unbind();
        });
      } else {
        observeNewTabDados();
      }
    } else if (getUrlAcaoPro("pesquisa_agrupamento")) {
      if (arrayIDProcedimentos().length) {
        if (!$("#newFiltroProgress").is(":visible")) {
          parent.setProcessGroupTable();
          cleanPageProgress();
          loopIDProcedimentos();
          timerTest = setInterval(setTimeTest, 1e3);
        }
      }
    }
  }
  function cleanPageProgress() {
    $("#divInfraBarraSuperior").remove();
    $("#divInfraBarraSistema").hide();
    $("#divInfraBarraSistemaPadrao").hide();
    $("#divInfraAreaTelaE").remove();
    $("#divInfraBarraLocalizacao").remove();
    $(divComandos).remove();
    $("#divFiltro").remove();
    $("#divRecebidos").remove();
    $("#divGerados").remove();
    $("#panelHomePro").remove();
    $("#selectGroupTablePro").remove();
    $("#newFiltro").css({ "text-align": "left", "padding": "20px 0", "float": "left", "width": "auto" });
    $("#newFiltroProgress").css({ "margin": "20px 0", "left": "calc(50% - 113px)" });
    $("#divInfraAreaTelaD").removeAttr("style").removeAttr("class");
    $("#divInfraAreaTela").removeAttr("style").removeAttr("class");
    $("#divInfraAreaGlobal").removeAttr("style").removeAttr("class");
    $("#newTabFiltroProgress").remove();
    $("#newFiltroReturnTab").show();
    $("#newFiltroCancel").attr("class", "fas fa-sign-in-alt cinzaColor").attr("onmouseover", "return infraTooltipMostrar('Retornar janela de pesquisa')");
    var clearNewTabSearchProcedimentos = function() {
      setOptionsPro("newTabSearchProcedimentos", false);
    };
    if (!window.__seiProSearchProgressExitHandlerInstalled__) {
      window.__seiProSearchProgressExitHandlerInstalled__ = true;
      window.addEventListener("pagehide", clearNewTabSearchProcedimentos, { once: true });
      window.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "hidden") {
          clearNewTabSearchProcedimentos();
        }
      });
    }
  }
  function updateProcessGroupTable() {
    if ($("#selectProgressoBar_GroupTable .ui-progressbar-value").length) {
      var maxProgress = parseFloat($("#selectProgressoBar_GroupTable").attr("aria-valuemax"));
      var valueProgress = maxProgress - arrayIDProcedimentos().length;
      $("#selectProgressoBar_GroupTable").progressbar({ value: valueProgress });
      if (maxProgress < 10) {
        parent.initTableTag($("#selectGroupTablePro", window.parent.document).val());
      }
    }
  }
  function setProcessGroupTable() {
    var progressoBar = '<div id="newFiltroProgress" style="display: inline-block;position: absolute;margin: 50px 0 0 0; z-index: 99; width: ' + $("#selectGroupTablePro").width() + `px;right: 220px;">    <span id="newFiltroCounter" class="azulColor" style="float: left;margin: -4px 8px 0 0; color: #777"></span>    <i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: -4px 8px 0 0;"></i>    <i id="newFiltroCancel" onclick="breakDadosProcedimentosControlar()" class="fas fa-times-circle cinzaColor" style="float: right;margin: -4px;padding-left: 10px;cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Cancelar pesquisa')"></i>    <i onclick="newTabDadosProcedimentosControlar()" id="newTabFiltroProgress" class="fas fa-external-link-alt cinzaColor" style="float: right; margin: -4px; padding: 0 15px 0 20px; cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Pesquisar em nova aba')"></i>    <div onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Encontrando datas dos processos da unidade...')" class="selectProgressoBar" id="selectProgressoBar_GroupTable"></div></div>`;
    if ($("#newFiltroProgress").length == 0) {
      $("#selectGroupTablePro").before(progressoBar);
    } else {
      $("#newFiltroProgress").show();
    }
    setTimeout(function() {
      $("#selectProgressoBar_GroupTable").progressbar({ value: 0, max: arrayIDProcedimentos().length });
    }, 800);
  }
  function cleanTimeTest() {
    clearInterval(timerTest);
    totalSecondsTest = 0;
    totalSecondsTestText = "";
  }
  function cancelDadosProcedimentosControlar() {
    statusPesquisaDadosProcedimentos = false;
    if (arrayIDProcedimentos() !== null && arrayIDProcedimentos().length > 0) {
      endProcessGroupTable();
    }
    cleanTimeTest();
  }
  function endProcessGroupTable() {
    $("#newFiltroProgress").hide();
    setTimeout(function() {
      parent.updateGroupTable($("#selectGroupTablePro", window.parent.document));
      if (getUrlAcaoPro("pesquisa_agrupamento")) {
        window.close();
      }
    }, 800);
  }
  function breakDadosProcedimentosControlar() {
    cancelDadosProcedimentosControlar();
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    var valueSelect = $("#selectGroupTablePro").val();
    if (valueSelect == "arrivaldate" || valueSelect == "acessdate" || valueSelect == "senddate" || valueSelect == "senddepart" || valueSelect == "createdate") {
      localStorageStorePro("selectGroupTablePro", "");
    }
    localStorageRemovePro("arrayIDProcedimentos");
    $("#frmCheckerProcessoPro").attr("src", "about:blank").unbind();
  }
  function loopIDProcedimentos() {
    if (statusPesquisaDadosProcedimentos) {
      if (arrayIDProcedimentos() !== null && arrayIDProcedimentos().length > 0) {
        getArrayDadosHistorico(0);
        parent.updateProcessGroupTable();
      } else {
        parent.endProcessGroupTable();
        cleanTimeTest();
      }
    }
  }
  function getArrayDadosHistorico(index) {
    var i2 = arrayIDProcedimentos()[index];
    if (typeof i2 !== "undefined") {
      var newArrayIDProcedimentos = $.grep(arrayIDProcedimentos(), function(value) {
        return value.id_procedimento != i2.id_procedimento;
      });
      setArrayIDProcedimentos(newArrayIDProcedimentos);
      getDadosHistoricoPro(i2);
    }
  }
  function getDadosHistoricoPro(listProc, fullHistory = false, callback = false) {
    if (!checkProcessoSigiloso()) {
      var href = "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + String(listProc.id_procedimento);
      $.ajax({ url: href }).done(function(html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr("src");
        $.ajax({ url: urlArvore }).done(function(htmlArvore) {
          var acompanhamentoEsp = getLinksAcompanhamento(htmlArvore);
          var urlHistorico = $.map(htmlArvore.split("\n"), function(substr, i2) {
            return substr.indexOf("?acao=procedimento_consultar_historico") !== -1 ? substr : null;
          }).join("");
          urlHistorico = urlHistorico.split("'")[3];
          getDadosHistoricoUrlPro(urlHistorico, listProc, fullHistory, callback, acompanhamentoEsp);
        });
      });
    }
  }
  function getLinksArvoreAjax(htmlArvore) {
    var links = [];
    if (htmlArvore.indexOf("Nos[0].acoes = ") !== -1) {
      $.each(htmlArvore.split("\n"), function(ind, val) {
        if (val.indexOf("Nos[0].acoes = ") !== -1) {
          var barraControle = val.trim().replace("Nos[0].acoes = '", "").slice(0, -2);
          $("<div>" + barraControle + "</div>").find(parent.isNewSEI ? 'a[href*="controlador.php?acao="]' : "a.botaoSEI").each(function() {
            if (typeof $(this).attr("href") !== "undefined" && $(this).attr("href") != "#") {
              links.push({ name: $(this).find("img").attr("title"), url: $(this).attr("href") });
            }
          });
        }
      });
    }
    return links;
  }
  function getLinksAcompanhamento(htmlArvore) {
    var _return = "";
    if (htmlArvore.indexOf('NosAcoes[0] = new infraArvoreAcao("ACOMPANHAMENTO"') !== -1) {
      $.each(htmlArvore.split("\n"), function(ind, val) {
        if (val.indexOf('NosAcoes[0] = new infraArvoreAcao("ACOMPANHAMENTO"') !== -1) {
          var param = val.trim().replace("NosAcoes[0] = new infraArvoreAcao(", "").slice(0, -2);
          param = param.split('"');
          _return = param[11].split("\\n")[1];
        }
      });
    }
    return _return;
  }
  function getDadosHistoricoUrlPro(urlHistorico, listProc, fullHistory = false, callback = false, acompanhamentoEsp = "") {
    $.ajax({ url: urlHistorico }).done(function(htmlHistorico) {
      if ($(htmlHistorico).find(".infraAreaPaginacao").html().trim() != "") {
        var pg = $(htmlHistorico).find("#selInfraPaginacaoSuperior").length > 0 ? $(htmlHistorico).find("#selInfraPaginacaoSuperior option").length - 1 : 1;
        if (fullHistory) {
          getDadosHistoricoPaginacao($(htmlHistorico), listProc, 0, pg, fullHistory, callback, acompanhamentoEsp);
        } else {
          andamentoPaginacaoTemp = getArrayHistorico($(htmlHistorico));
          getDadosHistoricoPaginacao($(htmlHistorico), listProc, 1, pg, fullHistory, callback, acompanhamentoEsp);
        }
      } else {
        if (fullHistory) {
          getDadosHistoricoPaginacao($(htmlHistorico), listProc, 0, 1, fullHistory, callback, acompanhamentoEsp);
        } else {
          var andamento = getArrayHistorico($(htmlHistorico));
          var listAndamento = { historico_completo: false, processo: listProc.processo, id_procedimento: listProc.id_procedimento, andamento };
          if (!callback) {
            loopIDProcedimentos();
            getDataRecebimentoPro(listAndamento, listProc, acompanhamentoEsp);
          } else if (typeof callback === "function") {
            callback(listAndamento);
          }
        }
      }
    });
  }
  function getArrayHistorico(htmlHistorico) {
    var andamento = [];
    htmlHistorico.find("#tblHistorico").find("tr").each(function() {
      var datahora = $(this).find("td").eq(0).text().trim();
      datahora = moment(datahora, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm:ss");
      var unidade2 = $(this).find("td").eq(1).text();
      var usuario = $(this).find("td").eq(2).text();
      var descricao = $(this).find("td").eq(3).text();
      var url_doc = $(this).find("td").eq(3).find("a.ancoraHistoricoProcesso");
      var nr_sei = typeof url_doc !== "undefined" ? url_doc.text() : false;
      nr_sei = nr_sei != "" ? nr_sei : false;
      var id_documento = typeof url_doc !== "undefined" ? getParamsUrlPro(url_doc.attr("href")).id_documento : false;
      id_documento = typeof id_documento !== "undefined" ? id_documento : false;
      var descricao_alt = $(this).find("td").eq(3).find("a").attr("alt");
      if (unidade2 != "") {
        andamento.push({ datahora, unidade: unidade2, usuario, descricao, descricao_alt, nr_sei, id_documento });
      }
    });
    return andamento;
  }
  function getDadosHistoricoPaginacao(html, listProc, index, max, fullHistory = false, callback = false, acompanhamentoEsp = "") {
    if (index > max) {
      var listAndamento = { historico_completo: false, processo: listProc.processo, id_procedimento: listProc.id_procedimento, andamento: andamentoPaginacaoTemp };
      if (!callback) {
        loopIDProcedimentos();
        getDataRecebimentoPro(listAndamento, false, acompanhamentoEsp);
      } else if (typeof callback === "function") {
        callback(listAndamento);
      }
    } else {
      var form = html.find("#frmProcedimentoHistorico");
      var href = form.attr("action");
      var param = {};
      form.find("input[type=hidden]").map(function() {
        if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
          param[$(this).attr("name")] = $(this).val();
        }
      });
      param["hdnInfraPaginaAtual"] = index;
      param["hdnTipoHistorico"] = fullHistory ? "P" : "R";
      $.ajax({
        method: "POST",
        data: param,
        url: href
      }).done(function(htmlHistorico) {
        var andamento = getArrayHistorico($(htmlHistorico));
        $.merge(andamentoPaginacaoTemp, andamento);
        getDadosHistoricoPaginacao($(htmlHistorico), listProc, index + 1, max, fullHistory, callback, acompanhamentoEsp);
      });
    }
  }
  function initTablePaginacaoHistorico() {
    if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("removepaginacao")) {
      getTablePaginacao($($ifrVisualizacao).contents(), "#frmProcedimentoHistorico", "#tblHistorico", 1);
    }
  }
  function getTablePaginacao(ifrView, formID, tableID, index) {
    if (ifrView.find(".infraAreaPaginacao a").length > 0 && typeof window.tablepaginacao_cancel == "undefined") {
      var form = ifrView.find(formID);
      var href = form.attr("action");
      var param = {};
      form.find("input[type=hidden]").map(function() {
        if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
          param[$(this).attr("name")] = $(this).val();
        }
      });
      param["hdnInfraPaginaAtual"] = index;
      console.log(index);
      $.ajax({
        method: "POST",
        data: param,
        url: href
      }).done(function(html) {
        let $html = $(html);
        var tr = $html.find(tableID + " tbody").find("tr").not(".infraTrOrdenacao");
        if (tr.length > 0) {
          tr.each(function(index2) {
            if ($(this).find("th").length == 0 && !$(this).find("td").hasClass("infraTdSetaOrdenacao")) {
              if ($(this).find("input.infraCheckbox").length > 0) {
                $(this).find("input.infraCheckbox").attr("disabled", true).closest("td").attr("onmouseout", "return infraTooltipOcultar()").attr("onmouseover", `return infraTooltipMostrar('Desative a op\xE7\xE3o "Remover pagina\xE7\xE3o de processos" nas configura\xE7\xF0es do ` + NAMESPACE_SPRO + " para utilizar esta sele\xE7\xE3o')");
              }
              ifrView.find(tableID + " tbody").append($(this)[0].outerHTML);
            }
          });
          getTablePaginacao(ifrView, formID, tableID, index + 1);
          var caption = ifrView.find(tableID).find("caption.infraCaption");
          var nrRegistros = caption.text();
          nrRegistros = nrRegistros.indexOf("-") !== -1 ? nrRegistros.split("-")[0].trim() + "):" : nrRegistros;
          caption.html("<span>" + nrRegistros + "</span>");
        } else {
          param["hdnInfraPaginaAtual"] = 0;
          $.ajax({ method: "POST", data: param, url: href });
          ifrView.find(".infraAreaPaginacao").css("visibility", "hidden");
          ifrView.find(".loadRemovePag").remove();
          ifrView.find(tableID).trigger("update");
        }
      });
      if (ifrView.find(".loadRemovePag").length == 0) {
        ifrView.find(".infraAreaPaginacao").prepend('<label class="loadRemovePag" style="float: right;margin-right: 30px;"><i class="fas fa-sync fa-spin"></i> Removendo pagina\xE7\xE3o... <a href="javascript:void(0);" style="font-size: 1em;" onclick="parent.cancelTablePaginacao(this)"><i class="fas fa-times" style="text-decoration: underline;"></i> Cancelar</a></label>');
      }
    }
  }
  function initBlocoProcessoHistorico() {
    var listHistoryProc = pullDadosProcessoSession();
    listHistoryProc = listHistoryProc && typeof listHistoryProc.listAndamento !== "undefined" ? listHistoryProc.listAndamento : dadosProcessoPro.listAndamento;
    if (typeof listHistoryProc !== "undefined" && typeof listHistoryProc.historico_completo !== "undefined" && listHistoryProc.historico_completo) {
      return getBlocoProcessoHistorico();
    } else if (!delayCrash) {
      delayCrash = true;
      setTimeout(function() {
        delayCrash = false;
      }, 6e3);
      mergeAllAndamentosProcesso(function() {
        getBlocoProcessoHistorico();
      });
      return false;
    }
  }
  function getBlocoProcessoHistorico() {
    var listHistoryProc = pullDadosProcessoSession();
    listHistoryProc = listHistoryProc && typeof listHistoryProc.listAndamento !== "undefined" ? listHistoryProc.listAndamento : dadosProcessoPro.listAndamento;
    var retiradoBlocoProcesso = typeof listHistoryProc !== "undefined" && typeof listHistoryProc.andamento !== "undefined" && listHistoryProc.andamento.length ? jmespath.search(listHistoryProc.andamento, "[?unidade=='" + siglaUnidadeAtual + "'] | [?contains(descricao, 'Processo retirado do bloco')]") : null;
    retiradoBlocoProcesso = retiradoBlocoProcesso !== null && retiradoBlocoProcesso.length ? retiradoBlocoProcesso : false;
    var blocoProcesso = typeof listHistoryProc !== "undefined" && typeof listHistoryProc.andamento !== "undefined" && listHistoryProc.andamento.length ? jmespath.search(listHistoryProc.andamento, "[?unidade=='" + siglaUnidadeAtual + "'] | [?contains(descricao, 'Processo inserido no bloco')]") : null;
    blocoProcesso = blocoProcesso === null ? false : blocoProcesso;
    blocoProcesso = !retiradoBlocoProcesso ? blocoProcesso : blocoProcesso && blocoProcesso.length > 0 && moment(blocoProcesso[0].datahora, "YYYY-MM-DD HH:mm") >= moment(retiradoBlocoProcesso[0].datahora, "YYYY-MM-DD HH:mm") ? blocoProcesso : false;
    if (typeof blocoProcesso !== "undefined" && blocoProcesso !== null && blocoProcesso.length > 0) {
      setTimeout(function() {
        var ifrVisualizacao2 = $($ifrVisualizacao).contents();
        ifrVisualizacao2.find('a[onclick*="incluirEmBloco"]').addClass("verdeColor").attr("onmouseover", "return infraTooltipMostrar('" + blocoProcesso[0].descricao + "')");
      }, 1500);
    }
    return blocoProcesso;
  }
  function initGanttHistoryProc() {
    alertaBoxPro("Sucess", "sync fa-spin", "Aguarde... Pesquisando hist\xF3rico do processo");
    var listHistoryProc = pullDadosProcessoSession();
    listHistoryProc = listHistoryProc ? listHistoryProc.listAndamento : dadosProcessoPro.listAndamento;
    if (typeof listHistoryProc !== "undefined" && typeof listHistoryProc.historico_completo !== "undefined" && listHistoryProc.historico_completo) {
      getGanttHistoryProc(listHistoryProc);
    } else {
      mergeAllAndamentosProcesso(getGanttHistoryProc);
    }
  }
  function getGanttHistoryProc(listHistoryProc = false) {
    if (!listHistoryProc) {
      setSessionProcessosPro(dadosProcessoPro);
    }
    var proc = listHistoryProc ? listHistoryProc.andamento : dadosProcessoPro.listAndamento.andamento;
    var recebido = jmespath.search(proc, "[?contains(descricao, 'Processo recebido na unidade')]");
    var init_recebido = jmespath.search(proc, "[?contains(descricao, 'Processo p\xFAblico gerado')||contains(descricao, 'Processo restrito gerado')] | [0]");
    init_recebido = typeof init_recebido !== "undefined" && init_recebido !== null ? init_recebido : false;
    var init_remetido = jmespath.search(proc, "[?descricao=='Processo remetido pela unidade " + init_recebido.unidade + "'] | [?datahora >= `" + init_recebido.datahora + "`]  | [-1]");
    init_remetido = typeof init_remetido !== "undefined" && init_remetido !== null ? init_remetido : false;
    var init_documentos_gerados = init_recebido && init_remetido ? jmespath.search(proc, "[?contains(descricao, 'Gerado documento')] | [?unidade=='" + init_recebido.unidade + "'] | [?datahora >= `" + init_recebido.datahora + "`] | [?datahora <= `" + init_remetido.datahora + "`]") : [];
    var init_customClass = init_remetido && init_remetido.descricao.indexOf("Processo aberto na unidade") !== -1 ? "bar-complete" : "bar-ongoing";
    var taskProcesso = [];
    var htmlBox = '<div style="width: 100%;display: flex;margin-bottom: 10px;">   <div class="btn-group" role="group" style="float: right;margin-right: 10px;">         <button type="button" data-value="Day" class="btn btn-sm btn-light">Dia</button>         <button type="button" data-value="Week" class="btn btn-sm btn-light">Semana</button>         <button type="button" data-value="Month" class="btn btn-sm btn-light active">M\xEAs</button>   </div></div><div id="ganttHistoryPainel" style="width: 100%;height: 100%"></div>';
    var init_start = init_recebido.datahora;
    var init_end = init_remetido ? init_remetido.datahora : moment().format("YYYY-MM-DD HH:mm:ss");
    var init_diff = moment(init_end, "YYYY-MM-DD HH:mm:ss").diff(moment(init_start, "YYYY-MM-DD HH:mm:ss"));
    var init_duration = moment.duration(init_diff, "milliseconds");
    var taskInit = {
      id: randomString(4),
      index: 0,
      name: init_recebido.descricao + " / " + (init_remetido ? init_remetido.descricao : ""),
      start: init_recebido.datahora,
      end: init_remetido ? init_remetido.datahora : moment().format("YYYY-MM-DD HH:mm:ss"),
      documentos_gerados: init_documentos_gerados,
      recebido: init_recebido.usuario + ": " + init_recebido.descricao + " " + init_recebido.unidade,
      remetido: init_remetido ? init_remetido.usuario + ": " + init_remetido.descricao + " > " + init_remetido.unidade : init_remetido.descricao,
      progress: init_remetido && init_remetido.descricao.indexOf("Processo aberto na unidade") !== -1 ? 50 : 100,
      unidade: init_recebido.unidade,
      duration: init_duration,
      custom_class: init_customClass
    };
    taskProcesso.push(taskInit);
    $.each(recebido, function(index, value) {
      var recebido_i = value;
      var remetido_i = jmespath.search(proc, "[?descricao=='Processo remetido pela unidade " + recebido_i.unidade + "'] | [?datahora >= `" + recebido_i.datahora + "`] | [-1]");
      remetido_i = remetido_i === null ? jmespath.search(proc, "[?descricao=='Conclus\xE3o do processo na unidade'] | [?unidade=='" + recebido_i.unidade + "'] | [?datahora > `" + recebido_i.datahora + "`] | [-1]") : remetido_i;
      remetido_i = remetido_i === null ? { datahora: moment().format("YYYY-MM-DD HH:mm:ss"), unidade: recebido_i.unidade, descricao: "Processo aberto na unidade " + recebido_i.unidade, descricao_alt: "" } : remetido_i;
      var documentos_gerados = jmespath.search(proc, "[?contains(descricao, 'Gerado documento')] | [?unidade=='" + recebido_i.unidade + "'] | [?datahora >= `" + recebido_i.datahora + "`] | [?datahora <= `" + remetido_i.datahora + "`]");
      var customClass = remetido_i.descricao.indexOf("Processo aberto na unidade") !== -1 ? "bar-complete" : "bar-ongoing";
      var _start = recebido_i.datahora;
      var _end = remetido_i ? remetido_i.datahora : moment().format("YYYY-MM-DD HH:mm:ss");
      var _diff = moment(_end, "YYYY-MM-DD HH:mm:ss").diff(moment(_start, "YYYY-MM-DD HH:mm:ss"));
      var _duration = moment.duration(_diff, "milliseconds");
      var taskProc = {
        id: randomString(4),
        index: index + 1,
        name: recebido_i.descricao + " " + recebido_i.unidade + " / " + remetido_i.descricao,
        start: _start,
        end: _end,
        documentos_gerados,
        recebido: recebido_i.usuario + ": " + recebido_i.descricao + " " + recebido_i.unidade,
        remetido: typeof remetido_i.usuario !== "undefined" ? remetido_i.usuario + ": " + remetido_i.descricao + " > " + remetido_i.unidade : remetido_i.descricao,
        progress: remetido_i.descricao.indexOf("Processo aberto na unidade") !== -1 ? 50 : 100,
        unidade: recebido_i.unidade,
        duration: _duration,
        custom_class: customClass
      };
      taskProcesso.push(taskProc);
    });
    console.log(taskProcesso);
    taskProcesso = taskProcesso.length ? jmespath.search(taskProcesso, "sort_by([*],&start)") : [];
    resetDialogBoxPro("alertBoxPro");
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv" style="overflow: scroll;height: calc(100% - 30px);"> ' + htmlBox + "</div>").dialog({
      title: "Hist\xF3rico visual do processo",
      width: $("body").width() - 100,
      height: $("body").height() - 100,
      open: function() {
        var gantt = new Gantt("#ganttHistoryPainel", taskProcesso, {
          header_height: 50,
          column_width: 10,
          step: 24,
          language: "ptBr",
          view_modes: ["Day", "Week", "Month"],
          bar_height: 15,
          bar_corner_radius: 3,
          arrow_curve: 5,
          padding: 18,
          edit_task: false,
          view_mode: "Month",
          date_format: "YYYY-MM-DD HH:mm:ss",
          custom_popup_html: function(task) {
            var diff_ = moment(task.end, "YYYY-MM-DD HH:mm:ss").diff(moment(task.start, "YYYY-MM-DD HH:mm:ss"));
            var duration_ = task.duration;
            var subtract = moment().subtract(duration_, "milliseconds");
            var htmlDuration = getDatesPreview({ date: subtract.format("YYYY-MM-DD HH:mm:ss") });
            htmlDuration = htmlDuration && htmlDuration.indexOf("atr\xE1s") !== -1 ? htmlDuration.replace("atr\xE1s", "") : "";
            htmlDuration = moment(task.end, "YYYY-MM-DD HH:mm:ss").diff(moment(task.start, "YYYY-MM-DD HH:mm:ss"), "days") >= 1 ? htmlDuration : '<span class="dateboxDisplay tagTableText_date_vencido "><i class="fas fa-history" style="color: #777; padding-right: 3px; font-size: 12pt;"></i> ' + (typeof duration_ !== "undefined" ? moment.duration(duration_, "minutes").format("H[h]:m[m]") : "") + " </span>";
            var htmlDocs = $.map(task.documentos_gerados, function(v) {
              var nrSEI = v.descricao.indexOf("(") !== -1 ? v.descricao.split("(")[0] : false;
              nrSEI = nrSEI ? onlyNumber(nrSEI) : nrSEI;
              var htmlQuickView = nrSEI ? `<a class="quickview" style="font-size: 12px; cursor:pointer;" onmouseover="return infraTooltipMostrar('Visualiza\xE7\xE3o r\xE1pida');" onmouseout="return infraTooltipOcultar();" onclick="openSEINrPro(this, '` + nrSEI + `')"><i style="margin: 0 3px;" class="fas fa-eye azulColor"></i></a>` : "";
              return "<p>" + v.usuario + ": " + htmlQuickView + v.descricao + " em " + moment(v.datahora, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY [\xE0s] HH:mm") + "</p>";
            });
            htmlDocs = htmlDocs && htmlDocs.length ? htmlDocs.join("") : "Nenhum documento gerado";
            var html = '<div class="details-container seiProForm">   <table class="tableInfo">      <tr><td colspan="3"><h5><i class="iconPopup fas fa-hand-holding cinzaColor"></i> <span class="boxInfo" style="font-size: 11pt; font-weight: bold;">' + task.recebido + '</span><a style="float: right; margin: -4px -4px 0 0; padding: 5px; cursor:pointer;" onclick="ganttHistory.hide_popup()"><i class="far fa-times-circle cinzaColor"></i></a></h5></td></tr>      <tr><td colspan="3"><h5><i class="iconPopup fas fa-share cinzaColor"></i> <span class="boxInfo" style="font-size: 11pt; font-weight: bold;">' + task.remetido + '</span></h5></td></tr>      <tr><td style="vertical-align: bottom;"><p><i class="iconPopup fas fa-clock cinzaColor"></i> In\xEDcio:</td><td><span class="boxInfo">' + moment(task.start, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") + '</span></p></td></tr>      <tr><td style="vertical-align: bottom;"><p><i class="iconPopup far fa-clock cinzaColor"></i> Fim:</td><td><span class="boxInfo">' + moment(task.end, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") + '</span></p></td></tr>      <tr><td style="vertical-align: bottom;"><p><i class="iconPopup far fa-hourglass-half cinzaColor"></i> Dura\xE7\xE3o:</td><td><span class="boxInfo">' + htmlDuration + '</span></p></td></tr>      <tr><td style="vertical-align: middle;width: 120px;"><p><i class="iconPopup far fa-file-alt cinzaColor"></i> Documentos Gerados:</td><td><span class="boxInfo">' + htmlDocs + "</span></p></td></tr>   </table></div>";
            return html;
          }
        });
        ganttHistory = gantt;
        $(".dialogBoxDiv .btn-group").on("click", "button", function() {
          $btn = $(this);
          var mode = $btn.data("value");
          $btn.parent().find("button").removeClass("active");
          $btn.addClass("active");
          ganttHistory.change_view_mode(mode);
        });
      },
      close: function() {
        $("#dialogBoxDiv").remove();
        resetDialogBoxPro("dialogBoxPro");
      }
    });
  }
  function closeAllPopups() {
    for (i = 0; i < ganttProject.length; i++) {
      ganttProject[i].hide_popup();
    }
  }
  function cancelTablePaginacao(this_) {
    var _this = $(this_);
    window.tablepaginacao_cancel = true;
    _this.closest("label").remove();
  }
  function filterTagView(this_) {
    if ($("#kanbanAtivPanel").is(":visible")) {
      filterTagKanban(this_);
    } else if ($("#tabelaAtivPanel").is(":visible") || $("#monitoradosProDiv").is(":visible") || $("#tableAfastamentoPanel").is(":visible") || $('table.tableInfo[id*="tableConfiguracoesPanel_"]').is(":visible")) {
      filterTagTable(this_);
    } else if ($("#ifrArvore").length > 0) {
      $("#ifrArvore")[0].contentWindow.filterTagKanbanArvore(this_);
    }
  }
  function filterTagKanban(this_) {
    var _this = $(this_);
    var _parent = _this.closest("#kanbanAtivPanel");
    var data = _this.data();
    var tagName = typeof data.tagname !== "undefined" && data.tagname !== null && data.tagname !== "" ? data.tagname : false;
    var tagType = typeof data.type !== "undefined" && data.type !== null && data.type !== "" ? data.type : false;
    var htmlFilter = "";
    _parent.find("#filterTagKanban").remove();
    if (tagName) {
      _parent.find(".kanban-item").hide();
      var divPriorityUser = data.type == "user" && checkCapacidade("update_prioridades") ? getHtmlKanbanUserPriority() : "";
      var itemFilter = _parent.find(".kanban-item.tagKanName_" + tagName);
      var nameTag = typeof data.nametag !== "undefined" ? data.nametag : _this.text().trim();
      var iconTag = typeof data.icontag !== "undefined" ? "fas fa-" + data.icontag : _this.find("i").attr("class");
      itemFilter.show();
      htmlFilter = '<div id="filterTagKanban" class="tituloFilter" style="padding: 0 10px 20px; font-size: 9pt; text-align: center;">   Filtro:    <span class="tag" style="background-color: ' + data.colortag + '">       <span class="tag-text" style="color: ' + data.textcolor + '; margin-right: 5px;">           <i class="tagicon tagicon ' + iconTag + '" style="font-size: 120%; margin: 0 2px; color: ' + data.textcolor + '"></i>           ' + nameTag + '           </span>       <button onclick="filterTagKanban(this); return false;" class="tag-remove"></button>   </span>' + divPriorityUser + "</div>";
      _parent.prepend(htmlFilter);
      if (data.type == "user") {
        getKanbanUserPriority(this_, "add");
      } else {
        getKanbanUserPriority(this_, "remove");
      }
      dialogBoxPro = true;
      setTimeout(function() {
        dialogBoxPro = false;
      }, 100);
      setOptionsPro("filterTag_kanban", tagName ? tagName : "");
      setOptionsPro("filterTagType_kanban", tagType);
      setOptionsPro("filterTag_removed", false);
    } else {
      _parent.find(".kanban-item").show();
      _parent.find(".kanban-item-priority").remove();
      removeOptionsPro("filterTag_kanban");
      removeOptionsPro("filterTagType_kanban");
      getKanbanUserPriority(this_, "remove");
      setOptionsPro("filterTag_removed", true);
    }
    _parent.find(".kanban-container").animate({ scrollTop: 0 }, 500);
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    updateCountKanbanBoard();
  }
  function filterTagTable(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest("table");
    var tagName = typeof data.tagname !== "undefined" && data.tagname !== null && data.tagname !== "" ? "tagTableName_" + data.tagname : false;
    var tagName_ = tagName ? data.tagname : "";
    var th_head = _parent.find('th.tituloFilter[data-filter-type="' + data.type + '"]');
    var typeTable = _parent.data("tabletype");
    _parent.find("thead .tableHeader").find("span.tag").remove();
    $("#tabelaAtivPanel").find(".filterTagClean").hide();
    if (tagName) {
      var colorTag = data.colortag ? data.colortag : "#bfd5e8";
      var nameTag = data.nametag ? data.nametag : $(this_).text();
      var textColour = getBrightnessColor(colorTag) > 125 ? "black" : "white";
      var iconTagClass = _this.find("i").attr("class");
      var iconTag = '<i class="tagicon ' + iconTagClass + '" style="font-size: 120%; margin: 0 2px; color: ' + textColour + '"></i> ';
      var htmlFilter = '<span class="tag" style="margin-left: 10px; background-color: ' + colorTag + '"><span class="tag-text" style="color: ' + textColour + '; margin-right: 5px;">' + iconTag + nameTag + '</span><button onclick="filterTagView(this)" class="tag-remove"></button></span>';
      _parent.find("tbody").find("tr").hide();
      _parent.find("tbody").find("tr." + tagName).show();
      $("#tabelaAtivPanel").find(".filterTagClean").show();
      setOptionsPro("filterTag_removed", false);
    } else {
      var htmlFilter = "";
      $('.tableFollow[data-tabletype="' + typeTable + '"]').find("tbody tr").show();
      $("#tabelaAtivPanel").find(".filterTagClean").hide();
      setOptionsPro("filterTag_removed", true);
    }
    updateCountTableMonitorado();
    th_head.find(".tablesorter-header-inner").append(htmlFilter);
    setOptionsPro("filterTag_" + typeTable, tagName_);
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
  }
  function normalizeAreaTela() {
    $("#divInfraAreaTela").css({ "height": "", "margin-bottom": "40px", "display": "inline-block" });
  }
  function initClassicEditor() {
    if (typeof ClassicEditor === "undefined") {
      $.getScript(URL_SPRO + "js/lib/ckeditor/ckeditor.js");
    }
  }
  function initPanelResize(element, name, TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof $(element).resizable !== "undefined") {
      setPanelResize(element, name);
    } else {
      setTimeout(function() {
        initPanelResize(element, name, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initPanelResize");
      }, 500);
    }
  }
  function setPanelResize(element, name) {
    normalizeAreaTela();
    $(element).resizable({
      handles: "s",
      stop: function(event2, ui) {
        setOptionsPro("panelHeight_" + name, ui.size.height);
        normalizeAreaTela();
      }
    });
    if (getOptionsPro("panelHeight_" + name) != "") {
      $(element).css("height", getOptionsPro("panelHeight_" + name) + "px");
    }
    if (SeiPro.sei.adapter.isNewSEI() && $("#divRecebidosAreaPaginacaoInferior").is(":visible")) {
      $(element).find(".ui-resizable-handle.ui-resizable-s").css("bottom", "-30px");
    }
    $(element).find(".ui-resizable-handle.ui-resizable-s").dblclick(function() {
      removeOptionsPro("panelHeight_" + name);
      normalizeAreaTela();
      $(element).css("height", "");
    }).attr("onmouseout", "return infraTooltipOcultar()").attr("onmouseover", "return infraTooltipMostrar('Arraste para redimensionar. Dois cliques para desativar.')");
  }
  function saveFollowDesc(this_, mode) {
    var type_container = $(this_).closest(".kanban-content").length > 0 ? "kanban" : "table";
    var _container = type_container == "kanban" ? $(this_).closest(".kanban-container") : $(this_).closest("table");
    var _data_id = type_container == "kanban" ? $(this_).closest(".kanban-item").data("eid").replace("_id_", "") : $(this_).closest("tr").data("index");
    var _content = type_container == "kanban" ? $(this_).closest(".kanban-content") : $(this_).closest("tr");
    var _content_desc = _content.find(".content_desc");
    var info = _content_desc.find("span.info");
    var info_txt = _content_desc.find("span.info_txt");
    var value = info_txt.find("input").val().replace(/[\u200B]/g, "");
    var index = parseInt(_data_id);
    var id_procedimento = typeof $(this_).closest("tr").data("id_procedimento") !== "undefined" ? parseInt($(this_).closest("tr").data("id_procedimento")) : false;
    info.show();
    info_txt.hide();
    if (value != info.text()) {
      info.text(value);
      if (mode == "ativ") {
        parent.getServerAtividades({ action: "edit_assunto", id: index, assunto: value }, "edit_assunto");
        var ativIndex = index ? parent.arrayAtividades.findIndex(((obj) => obj.id_demanda == index)) : index;
        arrayAtividades[ativIndex].assunto = value;
        arrayAtividadesPro[ativIndex].assunto = value;
        console.log("saveFollowDesc", ativIndex);
        if (type_container == "table" && $(".kanban-item").is(":visible")) {
          var kanban_item = $('.kanban-item[data-eid="_id_' + index + '"] .content_desc');
          kanban_item.find("span.info").text(value);
          kanban_item.find("span.info_txt input").val(value);
        }
      } else if (mode == "monitorado") {
        var storeMonitorados = getStoreMonitoradoPro();
        var monitoradoIndex = id_procedimento ? storeMonitorados.monitorados.findIndex(((obj) => obj.id_procedimento == id_procedimento)) : index;
        storeMonitorados["monitorados"][monitoradoIndex].descricao = value;
        localStorageStorePro("configDataMonitoradosPro", storeMonitorados);
      }
    }
  }
  function editFollowDesc(this_, mode) {
    var type_container = $(this_).closest(".kanban-content").length > 0 ? "kanban" : "table";
    var _container = type_container == "kanban" ? $(this_).closest(".kanban-container") : $(this_).closest("table");
    var _all_desc = _container.find(".content_desc");
    var _content = type_container == "kanban" ? $(this_).closest(".kanban-content") : $(this_).closest("tr");
    var _content_desc = _content.find(".content_desc");
    var info = _content_desc.find("span.info");
    var info_txt = _content_desc.find("span.info_txt");
    showFollowEtiqueta(this_, "close", mode);
    if (info.is(":visible")) {
      _all_desc.find("span.info").show();
      _all_desc.find("span.info_txt").hide();
      info.hide();
      info_txt.show().find("input").focus().trigger("click");
      info_txt.show().find("input").select();
    } else if (info.is(":hidden")) {
      info.show();
      info_txt.hide();
      parent.saveFollowDesc(this_, mode);
    }
  }
  function keyFollowDesc(e, mode) {
    if (e.which == 13) {
      var target = e && e.target ? e.target : e && e.currentTarget ? e.currentTarget : e && e.path && e.path.length > 0 ? e.path[0] : false;
      if (target) parent.saveFollowDesc(target, mode);
      if (mode == "monitorado") {
        saveConfigMonitorado();
      }
    }
  }
  function showFollowEtiqueta(this_, status, mode) {
    var _this = $(this_);
    var table = _this.closest("table");
    var td = _this.closest("td");
    var td_info_tags_follow = td.find(".info_tags_follow");
    if (status == "close" && td.find("input.tag-input").val() != "") {
      td.find("input.tag-input").trigger($.Event("keypress", { which: 13 }));
    }
    checkEtiquetaPriority(this_);
    table.find(".info_tags_follow").show();
    table.find(".info_tags_follow_txt").hide();
    table.find(".followLinkTags").show();
    table.find(".btnCloseEtiqueta").remove();
    var emptyTagsClass = td.hasClass("seipro-monitorado-tags-cell") || mode == "monitorado" ? "seipro-monitorado-tags-empty" : "info_tags_follow_empty";
    td.removeClass(emptyTagsClass == "seipro-monitorado-tags-empty" ? "info_tags_follow_empty" : "seipro-monitorado-tags-empty");
    if (td_info_tags_follow.length > 0 && td_info_tags_follow.html().trim() == "") {
      td.addClass(emptyTagsClass);
    } else {
      td.removeClass(emptyTagsClass);
    }
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    if (status == "show") {
      var btnClose = `<a class="newLink btnCloseEtiqueta" onclick="parent.showFollowEtiqueta(this, 'close', '` + mode + `')" onmouseover="return infraTooltipMostrar('Fechar');" onmouseout="return infraTooltipOcultar();">   <i class="fas fa-check-square cinzaColor" style="font-size: 100%;"></i></a>`;
      td.find(".followLinkTags").hide();
      td_info_tags_follow.not(".info_tags_user").hide();
      td.find(".info_tags_follow_txt").show().find("input.tag-input").focus().trigger("click").after(btnClose);
      addOptionsEtiqueta(this_, mode);
    }
    setTimeout(function() {
      if (status == "close" && mode == "monitorado" && !_this.closest("tr").find(".content_desc span.info_txt").is(":visible")) {
        saveConfigMonitorado();
      }
    }, 500);
    if ($($ifrVisualizacao).length > 0) {
      $($ifrVisualizacao)[0].contentWindow.infraTooltipOcultar();
    }
  }
  function checkEtiquetaPriority(this_) {
    var tr = $(this_).closest("tr");
    if (tr.hasClass("tagTableName_urgente")) {
      tr.addClass("importanteBoxDisplay");
    } else if (tr.hasClass("tagTableName_importante")) {
      tr.addClass("urgenteBoxDisplay");
    } else {
      tr.removeClass("urgenteBoxDisplay").removeClass("importanteBoxDisplay");
    }
  }
  function getColorTags(mode) {
    var colorTags = mode == "ativ" ? typeof arrayConfigAtivUnidade !== "undefined" && arrayConfigAtivUnidade !== null && typeof arrayConfigAtivUnidade.config !== "undefined" && arrayConfigAtivUnidade.config !== null && typeof arrayConfigAtivUnidade.config.etiquetas !== "undefined" && arrayConfigAtivUnidade.config.etiquetas !== null ? arrayConfigAtivUnidade.config.etiquetas.config.colortags : [] : getStoreMonitoradoPro().config.colortags;
    colorTags = typeof colorTags !== "undefined" ? colorTags : [];
    return colorTags;
  }
  function addOptionsEtiqueta(this_, mode) {
    var colorTags = getColorTags(mode);
    $(this_).closest("table").find(".tagMonitoradoAddColor, .tagMonitoradoAddColorInput, .tagMonitoradoEditIcon").remove();
    $(this_).closest("table").find(".tagsinput .tag").each(function() {
      var tagNamed = $(this).find(".tag-text").text();
      var tagName = removeAcentos(tagNamed).replace(/\ /g, "").toLowerCase();
      var tags = jmespath.search(colorTags, "[?name=='" + tagName + "'].value | [0]");
      var colorValue = tags !== null && tags.length > 0 ? tags : "";
      colorValue = colorValue == "" ? "#bfd5e8" : colorValue;
      colorValue = tagName == "urgente" && tags === null ? "#c24242" : colorValue;
      colorValue = tagName == "importante" && tags === null ? "#da9d2a" : colorValue;
      var iconValue = jmespath.search(colorTags, "[?name=='" + tagName + "'].icon | length(@)") > 0 ? jmespath.search(colorTags, "[?name=='" + tagName + "'].icon | [0]") : "";
      iconValue = iconValue == "" ? "tag" : iconValue;
      iconValue = (tagName == "urgente" || tagName == "importante") && tags === null ? "exclamation" : iconValue;
      var textColour = colorValue != "" ? getBrightnessColor(colorValue) > 125 ? "black" : "white" : "";
      textColour = (tagName == "urgente" || tagName == "importante") && tags === null ? "white" : textColour;
      var backgroundColor = $(this).data("colortag") ? $(this).data("colortag") : colorValue;
      var htmlOptions = '<input type="color" class="tagMonitoradoAddColorInput" value="' + backgroundColor + `" onchange="parent.changeColorEtiqueta(this, '` + mode + `')"><i class="tagMonitoradoEditIcon fas fa-` + iconValue + '" data-icontag="' + iconValue + `" onclick="parent.openBoxIconsFA('selectIconEtiqueta', '` + tagName + "', '" + mode + `')" onmouseover="return infraTooltipMostrar('Alterar \xEDcone');" onmouseout="return infraTooltipOcultar();"></i><i class="tagMonitoradoAddColor fas fa-fill-drip" onclick="parent.openColorEtiqueta(this)" onmouseover="return infraTooltipMostrar('Alterar cor');" onmouseout="return infraTooltipOcultar();"></i>`;
      if (colorValue != "") {
        $(this).css({ "background-color": colorValue, "color": textColour }).find(".tag-text").css("color", textColour);
      }
      $(this).addClass("tagTableText_" + tagName);
      $(this).append(htmlOptions);
    });
  }
  function openColorEtiqueta(this_) {
    $(this_).closest(".tag").find('input[type="color"]').trigger("click");
  }
  function selectIconEtiqueta(this_, tagName, mode) {
    var table = mode == "ativ" ? $(".tableAtividades").is(":visible") ? $(".tableAtividades tbody, .atividadeInfo") : $(".kanbanAtividade, .atividadeInfo") : $(".seipro-table-monitorados tbody");
    table = $($ifrVisualizacao).contents().find(".seipro-monitorados-label-options").length > 0 ? $($ifrVisualizacao).contents().find(".seipro-monitorados-label-options table") : table;
    table = mode == "options" ? $("#dialogBoxPro") : table;
    var icon = $(this_).find(".iconListTxt").text();
    var value = table.find(".tag_text.tagTableText_" + tagName).data("colortag");
    table.find(".tag_text.tagTableText_" + tagName).attr("data-icontag", icon).data("icontag", icon).find("i.tagicon").attr("class", "fas fa-" + icon);
    table.find(".tag.tagTableText_" + tagName).attr("data-icontag", icon).data("icontag", icon).find("i.tagMonitoradoEditIcon").attr("data-icontag", icon).data("icontag", icon).attr("class", "tagMonitoradoEditIcon fas fa-" + icon);
    resetDialogBoxPro("alertBoxPro");
    $("#listIconsFontAwesome").remove();
    if (mode != "options") saveConfigEtiqueta(tagName, value, icon, mode);
  }
  function changeColorEtiqueta(this_, mode) {
    var value = $(this_).val();
    var textColour = getBrightnessColor(value) > 125 ? "black" : "white";
    var tagNamed = mode == "options" ? "afastamento" : removeAcentos($(this_).closest(".tag").find(".tag-text").text()).replace(/\ /g, "").toLowerCase();
    var tagName = "tagTableText_" + tagNamed;
    var index = parseInt($(this_).closest("tr").data("index"));
    var icon = $(this_).closest(".tag").find(".tagMonitoradoEditIcon").data("icontag");
    var table = mode == "options" ? $(this_).closest(".seiProForm") : $(this_).closest("tbody");
    table.find("." + tagName).attr("data-colortag", value).attr("data-textcolor", textColour).data("colortag", value).data("textcolor", textColour).css({ "background-color": value, "color": textColour }).find(".tag-text").css("color", textColour).find(".tagicon").css("color", textColour);
    table.find("." + tagName).find(".tagicon").css("color", textColour);
    table.find("." + tagName + " .tagMonitoradoAddColorInput").val(value);
    if (mode != "options") saveConfigEtiqueta(tagNamed, value, icon, mode);
  }
  function saveConfigEtiqueta(name, value, icon, mode) {
    var storeEtiqueta = mode == "ativ" ? typeof arrayConfigAtivUnidade.config !== "undefined" && typeof arrayConfigAtivUnidade.config.etiquetas !== "undefined" ? arrayConfigAtivUnidade.config.etiquetas : { config: { colortags: [] } } : getStoreMonitoradoPro();
    var colorTags = Object.keys(storeEtiqueta).length > 0 && typeof storeEtiqueta.config.colortags !== "undefined" ? storeEtiqueta.config.colortags : [];
    if (colorTags.findIndex(((obj) => obj.name == name)) != -1) {
      var index = colorTags.findIndex(((obj) => obj.name == name));
      storeEtiqueta["config"]["colortags"][index] = { name, value, icon };
    } else {
      storeEtiqueta["config"]["colortags"].push({ name, value, icon });
    }
    if (mode == "ativ" || mode == "tipo_ativ") {
      if (typeof arrayConfigAtivUnidade.config.etiquetas !== "undefined" && arrayConfigAtivUnidade.config.hasOwnProperty("etiquetas")) {
        arrayConfigAtivUnidade.config.etiquetas.config = storeEtiqueta.config;
      } else {
        var itemPushConfig = arrayConfigAtivUnidade["config"];
        itemPushConfig["etiquetas"] = { config: storeEtiqueta.config };
        arrayConfigAtivUnidade["config"] = itemPushConfig;
        console.log(itemPushConfig, arrayConfigAtivUnidade["config"]);
      }
      getServerAtividades({ action: "edit_etiqueta_config", config_etiquetas: arrayConfigAtivUnidade["config"]["etiquetas"] }, "edit_etiqueta_config");
    } else if (mode == "monitorado") {
      localStorageStorePro("configDataMonitoradosPro", storeEtiqueta);
    }
  }
  function saveFollowEtiqueta() {
    var mode = $(this).closest("td").data("etiqueta-mode");
    if ($(this).closest(".info_tags_follow_txt").is(":visible")) {
      var tags = $(this).closest(".info_tags_follow_txt").find(".tag-text").map(function() {
        return $(this).text();
      }).get();
      var tagsHtml = $.map(tags, function(value) {
        return getHtmlEtiqueta(value, mode);
      }).join("");
      var tagsMonitoradoClass = $.map(tags, function(value) {
        return "tagTableName_" + removeAcentos(value).replace(/\ /g, "").toLowerCase();
      }).join(" ");
      var index = parseInt($(this).closest("tr").data("index"));
      $(this).closest("td").find(".info_tags_follow").html(tagsHtml);
      $(this).closest("tr").attr("class", tagsMonitoradoClass);
      addOptionsEtiqueta(this, mode);
      if (typeof $(".ui-autocomplete-input").autocomplete !== "undefined") {
        $(".ui-autocomplete-input").autocomplete("option", { source: sugestEtiquetaPro(mode) });
      }
      if (mode == "ativ") {
        if ($("div.ui-dialog").is(":visible")) {
          $('.kanban-item[data-eid="_id_' + index + '"] .info_tags_follow_etiquetas').html(tagsHtml);
          $('.tableAtividades tbody tr[data-index="' + index + '"] td.tdmonitorado_tags .info_tags_follow').html(tagsHtml);
        }
        getServerAtividades({ action: "edit_etiqueta", id: index, etiquetas: tags }, "edit_etiqueta");
        if (typeof arrayConfigAtividades.etiquetas !== "undefined" && typeof arrayConfigAtividades.etiquetas.list !== "undefined") {
          $.each(tags, function(i2, value) {
            if (value != "" && $.inArray(value, arrayConfigAtividades["etiquetas"]["list"]) == -1) {
              arrayConfigAtividades["etiquetas"]["list"].push(value);
            }
          });
        }
        var demandaIndex = arrayAtividades.findIndex(((obj) => obj.id_demanda == index));
        if (demandaIndex != -1) {
          arrayAtividades[demandaIndex].etiquetas = tags;
          arrayAtividadesPro[demandaIndex].etiquetas = tags;
        }
      } else if (mode == "tipo_ativ") {
        console.log(index, tags);
        getServerAtividades({ action: "edit_etiqueta_atividades", id: index, etiquetas: tags }, "edit_etiqueta_atividades");
        if (typeof arrayConfigAtividades.etiquetas !== "undefined" && typeof arrayConfigAtividades.etiquetas.list !== "undefined") {
          $.each(tags, function(i2, value) {
            if (value != "" && $.inArray(value, arrayConfigAtividades["etiquetas"]["list"]) == -1) {
              arrayConfigAtividades["etiquetas"]["list"].push(value);
            }
          });
        }
        var atividadeIndex = tableConfigList.atividades.findIndex(((obj) => obj.id_atividade == index));
        if (atividadeIndex != -1) {
          tableConfigList.atividades[atividadeIndex].etiquetas = tags;
        }
      } else if (mode == "monitorado") {
        var storeMonitorados = getStoreMonitoradoPro();
        var id_procedimento = parseInt($(this).closest("tr").data("id_procedimento"));
        var monitoradoIndex = storeMonitorados.monitorados.findIndex(((obj) => obj.id_procedimento == id_procedimento));
        storeMonitorados["monitorados"][monitoradoIndex].etiquetas = tags;
        localStorageStorePro("configDataMonitoradosPro", storeMonitorados);
      }
      if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    }
  }
  function sugestEtiquetaPro(mode) {
    return mode == "ativ" ? typeof arrayConfigAtividades.etiquetas !== "undefined" ? arrayConfigAtividades["etiquetas"]["list"] : [] : uniqPro($.map(getStoreMonitoradoPro()["monitorados"], function(value) {
      return value.etiquetas;
    }));
  }
  function getHtmlEtiqueta(name, mode) {
    var colorTags = getColorTags(mode);
    var tagName = removeAcentos(name).replace(/\ /g, "").toLowerCase();
    var tags = jmespath.search(colorTags, "[?name=='" + tagName + "'].value | [0]");
    var backgroundColor = tags !== null && tags.length > 0 ? tags : "";
    backgroundColor = tagName == "urgente" && tags === null ? "#c24242" : backgroundColor;
    backgroundColor = tagName == "importante" && tags === null ? "#da9d2a" : backgroundColor;
    var iconTag = jmespath.search(colorTags, "[?name=='" + tagName + "'].icon | length(@)") > 0 ? jmespath.search(colorTags, "[?name=='" + tagName + "'].icon | [0]") : "tag";
    iconTag = (tagName == "urgente" || tagName == "importante") && tags === null ? "exclamation" : iconTag;
    var textColour = backgroundColor != "" ? getBrightnessColor(backgroundColor) > 125 ? "black" : "white" : "";
    textColour = (tagName == "urgente" || tagName == "importante") && tags === null ? "white" : textColour;
    var styleTag = backgroundColor != "" ? 'style="background-color: rgb(' + $.map(hexToRgb(backgroundColor), function(e) {
      return e;
    }).join(", ") + "); color: " + textColour + '"' : "";
    return '<span data-colortag="' + backgroundColor + '"  data-type="etiqueta" data-icontag="' + iconTag + '" ' + styleTag + ' data-tagname="' + tagName + '" data-textcolor="' + textColour + '" class="tag_text tagTableText_' + tagName + '" onclick="parent.filterTagView(this)"><i class="tagicon fas fa-' + iconTag + '" style="font-size: 90%;margin: 0 2px; color: ' + textColour + '"></i> ' + name + "</span>";
  }
  function openBoxIconsFA(action, nametag, mode) {
    var htmlBox = '<div id="listIconsFontAwesome">    <input type="text" id="searchIconFA" onkeyup="filterIconsFA()" placeholder="Filtrar pelo nome...">';
    $.each(listIconsFontAwesome, function(i2, value) {
      htmlBox += '<span class="iconList" onclick="' + action + "(this, '" + nametag + "', '" + mode + `')"><i class="fas fa-` + value + ' azulColor"></i> <span class="iconListTxt">' + value + "</span></span>";
    });
    htmlBox += "</div>";
    resetDialogBoxPro("alertBoxPro");
    alertBoxPro = $("#alertaBoxPro").html("<div>" + htmlBox + "</div>").dialog({
      title: "Icones",
      close: function() {
        $("#listIconsFontAwesome").remove();
      },
      width: 800
    });
  }
  function filterIconsFA() {
    var filter = $("#searchIconFA").val().toUpperCase();
    $("#listIconsFontAwesome").find(".iconList").each(function() {
      if ($(this).find(".iconListTxt").text().toUpperCase().indexOf(filter) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  function setOrderMenuSEISortable() {
    let arrayOrder = getOptionsPro("orderMenuSEI");
    arrayOrder = !!arrayOrder ? arrayOrder.reverse() : false;
    if (arrayOrder) {
      arrayOrder.forEach(function(v) {
        var elem = $(idMenu + " > li").map(function(t) {
          if ($(this).find("a").eq(0).text().trim() == v) return this;
        });
        elem.prependTo(idMenu);
      });
    }
  }
  function saveOrderMenuSEISortable() {
    let arrayOrder = $(idMenu + " > li").map(function() {
      return $(this).find("a").eq(0).text();
    }).get();
    setOptionsPro("orderMenuSEI", arrayOrder);
  }
  function initMenuSEISortable(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof $().sortable !== "undefined") {
      menuSEISortable();
    } else {
      setTimeout(function() {
        initMenuSEISortable(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initMenuSEISortable");
      }, 500);
    }
  }
  function menuSEISortable() {
    if (typeof $().sortable !== "undefined") {
      $(idMenu).sortable({
        items: "> li",
        cursor: "pointer",
        axis: "y",
        dropOnEmpty: false,
        start: function(e, ui) {
          ui.item.addClass("selected");
        },
        stop: function(e, ui) {
          ui.item.removeClass("selected");
          saveOrderMenuSEISortable();
        }
      });
      setOrderMenuSEISortable();
    }
  }
  function configFlashMenuTrPro(value, color, state, mode) {
    var index = randomString(4);
    return '        <tr>           <td>               <p><i class="iconPopup fa ' + value.icon + " " + color + '"></i><span class="info">' + value.name + '</span></p>           </td>           <td>               <div class="onoffswitch">                   <input type="checkbox" data-name="' + value.name + `" onchange="changeFlashMenuPro(this, '` + mode + `')" name="onoffswitch" class="onoffswitch-checkbox" id="itemFlashMenu_` + index + '" tabindex="0" ' + state + '>                   <label class="onoff-switch-label" for="itemFlashMenu_' + index + '"></label>               </div>           </td>        </tr>';
  }
  function configFlashMenuPro(arrayLinksArvore2) {
    var selectedItensMenu = typeof localStorageRestorePro("configViewFlashMenuPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configViewFlashMenuPro")) ? localStorageRestorePro("configViewFlashMenuPro") : [["Incluir Documento"], ["Consultar/Alterar Processo"], ["Enviar Documento Externo"], ["Atribuir Processo"], ["Add/Remover Urg\xEAncia"]];
    var selectedItensDocMenu = typeof localStorageRestorePro("configViewFlashDocMenuPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configViewFlashDocMenuPro")) ? localStorageRestorePro("configViewFlashDocMenuPro") : [["Copiar n\xFAmero SEI"], ["Copiar nome do documento"], ["Copiar link do documento"]];
    var selectedItensDocArvore = typeof localStorageRestorePro("configViewFlashDocArvorePro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configViewFlashDocArvorePro")) ? localStorageRestorePro("configViewFlashDocArvorePro") : [["Copiar n\xFAmero SEI"], ["Copiar link do documento"], ["Duplicar documento"]];
    var selectedItensPanelArvore = typeof localStorageRestorePro("configViewFlashPanelArvorePro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configViewFlashPanelArvorePro")) ? localStorageRestorePro("configViewFlashPanelArvorePro") : [["Anota\xE7\xF5es"], ["Marcador"], ["Acompanhamento Especial"], ["Tipo de Procedimento"], ["Assuntos"], ["Interessados"], ["Atribui\xE7\xE3o"], ["N\xEDvel de Acesso"], ["Observa\xE7\xF5es"]];
    var textBox = '<div id="flashMenu_tabs" style="border: none; min-height: 300px; margin: 0;">   <ul style="font-size: 10px;">       <li><a href="#tabs_flashMenuPro"><i class="fa fa-scroll cinzaColor"></i> Processo</a></li>       <li><a href="#tabs_flashDocMenuPro"><i class="fa fa-file cinzaColor"></i> Documentos</a></li>       <li><a href="#tabs_flashDocArvorePro"><i class="fa fa-tree cinzaColor"></i> \xC1rvore</a></li>       <li><a href="#tabs_flashPanelArvorePro"><i class="fa fa-info-circle cinzaColor"></i> Painel</a></li>   </ul>   <div id="tabs_flashMenuPro">       <h3 style="font-weight: bold; color: #666;">          <div class="onoffswitch" style="position: absolute;right: 30px;">              <input type="checkbox" data-name="Ativar menu do processo" data-mode="menuproc" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_proc" tabindex="0" ' + (getOptionsPro("optionsFlashMenu_menuproc") == "disabled" ? "" : "checked") + '>              <label class="onoff-switch-label" for="optionFlashMenu_proc"></label>          </div>          <i class="iconPopup fa fa-scroll cinzaColor"></i> Menu r\xE1pido do processo       </h3>       <div class="details-container optionsFlashMenu_menuproc ' + (getOptionsPro("optionsFlashMenu_menuproc") == "disabled" ? "disableOptions" : "") + '" style="height: 500px;overflow-y: scroll;">          <table class="tableInfo popup-wrapper tableZebra tableFlashMenu" style="font-size: 10pt;width: 100%;">';
    $.each(selectedItensMenu, function(index, value) {
      if (jmespath.search(iconsFlashMenu, "[?name=='" + value + "'] | length(@)") > 0) {
        var data = jmespath.search(iconsFlashMenu, "[?name=='" + value + "'] | [0]");
        textBox += configFlashMenuTrPro(data, "azulColor", "checked", "proc");
      }
    });
    $.each(iconsFlashMenu, function(index, value) {
      if (jmespath.search(selectedItensMenu, "[?[0]=='" + value.name + "'] | length(@)") == 0) {
        textBox += configFlashMenuTrPro(value, "cinzaColor", "", "proc");
      }
    });
    textBox += "          </table>       </div>   </div>";
    textBox += '   <div id="tabs_flashDocMenuPro">       <h3 style="font-weight: bold;color: #666;">          <div class="onoffswitch" style="position: absolute;right: 30px;">              <input type="checkbox" data-name="Ativar menu dos documentos" data-mode="menudoc" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_doc" tabindex="0" ' + (getOptionsPro("optionsFlashMenu_menudoc") == "disabled" ? "" : "checked") + '>              <label class="onoff-switch-label" for="optionFlashMenu_doc"></label>          </div>          <i class="iconPopup fa fa-file cinzaColor"></i> Menu r\xE1pido dos documentos       </h3>       <div class="details-container optionsFlashMenu_menudoc ' + (getOptionsPro("optionsFlashMenu_menudoc") == "disabled" ? "disableOptions" : "") + '" style="height: 500px;overflow-y: scroll;">          <table class="tableInfo popup-wrapper tableZebra tableFlashDocMenu" style="font-size: 10pt;width: 100%;">';
    var statusMenuClick = jmespath.search(selectedItensDocMenu, "[?[0]=='Ativar menu ao clicar'] | length(@)") > 0 ? { chekbox: "checked", class: "azulColor" } : { chekbox: "", class: "cinzaColor" };
    textBox += configFlashMenuTrPro({ name: "Ativar menu ao clicar", icon: "fas fa-mouse-pointer", alt: "" }, statusMenuClick.class, statusMenuClick.chekbox, "doc");
    $.each(selectedItensDocMenu, function(index, value) {
      if (jmespath.search(iconsFlashDocMenu, "[?name=='" + value + "'] | length(@)") > 0) {
        var data = jmespath.search(iconsFlashDocMenu, "[?name=='" + value + "'] | [0]");
        textBox += configFlashMenuTrPro(data, "azulColor", "checked", "doc");
      }
    });
    $.each(iconsFlashDocMenu, function(index, value) {
      if (jmespath.search(selectedItensDocMenu, "[?[0]=='" + value.name + "'] | length(@)") == 0) {
        textBox += configFlashMenuTrPro(value, "cinzaColor", "", "doc");
      }
    });
    textBox += "          </table>       </div>   </div>";
    textBox += '   <div id="tabs_flashDocArvorePro">       <h3 style="font-weight: bold;color: #666;">          <div class="onoffswitch" style="position: absolute;right: 30px;">              <input type="checkbox" data-name="Ativar icones na arvore" data-mode="iconstree" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_tree" tabindex="0" ' + (getOptionsPro("optionsFlashMenu_iconstree") == "disabled" ? "" : "checked") + '>              <label class="onoff-switch-label" for="optionFlashMenu_tree"></label>          </div>          <i class="iconPopup fa fa-tree cinzaColor"></i> \xCDcones r\xE1pidos na \xE1rvore       </h3>       <div class="details-container optionsFlashMenu_iconstree ' + (getOptionsPro("optionsFlashMenu_iconstree") == "disabled" ? "disableOptions" : "") + '" style="height: 500px;overflow-y: scroll;">          <table class="tableInfo popup-wrapper tableZebra tableFlashDocArvore" style="font-size: 10pt;width: 100%;">';
    $.each(selectedItensDocArvore, function(index, value) {
      if (jmespath.search(iconsFlashDocArvore, "[?name=='" + value + "'] | length(@)") > 0) {
        var data = jmespath.search(iconsFlashDocArvore, "[?name=='" + value + "'] | [0]");
        textBox += configFlashMenuTrPro(data, "azulColor", "checked", "tree");
      }
    });
    $.each(iconsFlashDocArvore, function(index, value) {
      if (jmespath.search(selectedItensDocArvore, "[?[0]=='" + value.name + "'] | length(@)") == 0) {
        textBox += configFlashMenuTrPro(value, "cinzaColor", "", "tree");
      }
    });
    textBox += "          </table>       </div>   </div>";
    textBox += '   <div id="tabs_flashPanelArvorePro">       <h3 style="font-weight: bold;color: #666;">          <div class="onoffswitch" style="position: absolute;right: 30px;">              <input type="checkbox" data-name="Ativar painel de informa\xE7\xF5es na arvore" data-mode="panelinfo" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_panelinfo" tabindex="0" ' + (getOptionsPro("optionsFlashMenu_panelinfo") == "disabled" ? "" : "checked") + '>              <label class="onoff-switch-label" for="optionFlashMenu_panelinfo"></label>          </div>          <i class="iconPopup fa fa-info-circle cinzaColor"></i> Painel de Informa\xE7\xF5es na \xE1rvore       </h3>       <div class="details-container optionsFlashMenu_panelinfo ' + (getOptionsPro("optionsFlashMenu_panelinfo") == "disabled" ? "disableOptions" : "") + '">          <table class="tableInfo popup-wrapper tableZebra tableFlashDocArvore" style="font-size: 10pt;width: 100%;">';
    $.each(selectedItensPanelArvore, function(index, value) {
      if (jmespath.search(iconsFlashPanelArvore, "[?name=='" + value + "'] | length(@)") > 0) {
        var data = jmespath.search(iconsFlashPanelArvore, "[?name=='" + value + "'] | [0]");
        textBox += configFlashMenuTrPro(data, "azulColor", "checked", "panel");
      }
    });
    $.each(iconsFlashPanelArvore, function(index, value) {
      if (jmespath.search(selectedItensPanelArvore, "[?[0]=='" + value.name + "'] | length(@)") == 0) {
        textBox += configFlashMenuTrPro(value, "cinzaColor", "", "panel");
      }
    });
    textBox += "           </table>       </div>   </div></div>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv"> ' + textBox + "</div>").dialog({
      title: "Personalizar Menu R\xE1pido",
      width: 600,
      open: function() {
        $("#flashMenu_tabs").tabs();
        setTimeout(function() {
          centralizeDialogBox(dialogBoxPro);
        }, 100);
      },
      buttons: [{
        text: "Ok",
        click: function() {
          var ifrArvore = getIframeArvoreElement();
          if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
          resetDialogBoxPro("dialogBoxPro");
        }
      }]
    }).on("dialogclose", function(event2) {
      var ifrArvore = getIframeArvoreElement();
      if (ifrArvore && ifrArvore.contentWindow) ifrArvore.contentWindow.location.reload();
    });
    $(".tableFlashMenu").sortable({
      items: "tr",
      cursor: "pointer",
      axis: "y",
      dropOnEmpty: false,
      start: function(e, ui) {
        ui.item.addClass("selected");
      },
      stop: function(e, ui) {
        ui.item.removeClass("selected");
        changeFlashMenuPro(ui.item, "proc");
      }
    });
    $(".tableFlashDocMenu").sortable({
      items: "tr",
      cursor: "pointer",
      axis: "y",
      dropOnEmpty: false,
      start: function(e, ui) {
        ui.item.addClass("selected");
      },
      stop: function(e, ui) {
        ui.item.removeClass("selected");
        changeFlashMenuPro(ui.item, "doc");
      }
    });
    $(".tableFlashDocArvore").sortable({
      items: "tr",
      cursor: "pointer",
      axis: "y",
      dropOnEmpty: false,
      start: function(e, ui) {
        ui.item.addClass("selected");
      },
      stop: function(e, ui) {
        ui.item.removeClass("selected");
        changeFlashMenuPro(ui.item, "tree");
      }
    });
  }
  function changeFlashMenuGeneralPro(this_) {
    var _this = $(this_);
    var mode = _this.data("mode");
    var _parent = _this.closest(".dialogBoxDiv");
    var status = _this.is(":checked");
    var status_var = status ? "enabled" : "disabled";
    if (status) {
      _parent.find(".optionsFlashMenu_" + mode).removeClass("disableOptions");
    } else {
      _parent.find(".optionsFlashMenu_" + mode).addClass("disableOptions");
    }
    setOptionsPro("optionsFlashMenu_" + mode, status_var);
    console.log(".optionsFlashMenu_" + mode, status, status_var);
  }
  function changeFlashMenuPro(this_, mode) {
    var configView = "";
    if (mode == "proc") {
      configView = "configViewFlashMenuPro";
    } else if (mode == "doc") {
      configView = "configViewFlashDocMenuPro";
    } else if (mode == "tree") {
      configView = "configViewFlashDocArvorePro";
    } else if (mode == "panel") {
      configView = "configViewFlashPanelArvorePro";
    }
    var arrayShowItensMenu = [];
    $(this_).closest("table").find("input").each(function() {
      if ($(this).is(":checked")) {
        arrayShowItensMenu.push([$(this).data("name")]);
        $(this).closest("tr").find(".iconPopup").addClass("azulColor").removeClass("cinzaColor");
      } else {
        $(this).closest("tr").find(".iconPopup").removeClass("azulColor").addClass("cinzaColor");
      }
    });
    console.log(configView, arrayShowItensMenu);
    localStorageStorePro(configView, arrayShowItensMenu);
  }
  function addUrgenteProcessoPro() {
    var id_procedimento = dadosProcessoPro.propProcesso.hdnIdProcedimento;
    var new_text = dadosProcessoPro.propProcesso.txtDescricao;
    new_text = typeof new_text !== "undefined" && new_text.toLowerCase().indexOf("(urgente)") === -1 ? new_text + " (URGENTE)" : typeof new_text !== "undefined" && new_text.toLowerCase().indexOf("(urgente)") !== -1 ? new_text.replace(/\(urgente\)/ig, "").trim() : false;
    var checkUrgencia = typeof new_text !== "undefined" && new_text && new_text.toLowerCase().indexOf("(urgente)") !== -1 ? true : false;
    var modeUrgencia = checkUrgencia ? "Adicionada" : "Removida";
    var txtUrgencia = modeUrgencia + " marca de urg\xEAncia no processo";
    updateDadosArvore("Consultar/Alterar Processo", "txtDescricao", new_text, id_procedimento, function() {
      dadosProcessoPro.propProcesso.txtDescricao = new_text;
      setSessionProcessosPro(dadosProcessoPro);
      resetDialogBoxPro("dialogBoxPro");
      alertaBoxPro("Sucess", "check-circle", txtUrgencia);
    });
  }
  function dialogCopyNewDoc(doc) {
    var textBox = '<div>Digite o n\xFAmero do processo que deseja copiar o documento <span style="display: inline-block; padding: 3px 5px; margin: 3px 5px;background: #eaeaea; border-radius: 5px; color: #666;">' + doc.text().trim() + `</span></div><div class="dialogBoxDiv seiProForm">   <input onkeypress="if (event.which == 13) { $(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click') }" id="dialogBoxProcesso" type="text" style="font-size: 10pt; width: 80%;"></div>`;
    removeOptionsPro("currentCloneDoc");
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv"> ' + textBox + "</span>").dialog({
      width: 450,
      title: "Copiar documento para outro processo",
      buttons: [{
        text: "Copiar",
        class: "confirm ui-state-active",
        open: function() {
          appendAutocompleteProc(this, $("#dialogBoxProcesso"));
        },
        click: function() {
          loadingButtonConfirm(true);
          getIDProtocoloSEI(
            $("#dialogBoxProcesso").val().trim(),
            function(html) {
              let $html = $(html);
              var params = getParamsUrlPro($html.find("#ifrArvore").attr("src"));
              $("#ifrArvore")[0].contentWindow.getDadosDoc(doc, params.id_procedimento);
            },
            function() {
              alertaBoxPro("Error", "exclamation-triangle", "Protocolo n\xE3o encontrado!");
              loadingButtonConfirm(false);
            }
          );
        }
      }]
    });
  }
  var appendAutocompleteProc = (this_, elem) => {
    const sourceAutocomplete = jmespath.search(objProcessosUnidadePro, "[*].{especificacao: especificacao, processo_sei: processo_sei}").map((item) => ({
      label: `${item.processo_sei}${item.especificacao ? " - " + item.especificacao : ""}`,
      value: item.processo_sei
    }));
    elem.autocomplete({
      source: sourceAutocomplete,
      minLength: 0
      // Permite abrir o menu sem precisar digitar
    }).focus(function() {
      $(this).autocomplete("search", "");
    });
    setTimeout(() => {
      $(this_).closest(".ui-dialog").css("overflow", "visible");
      elem.focus();
    }, 100);
  };
  function limitConfigValue(name) {
    return !checkHostLimit() ? checkConfigValue(name) : false;
  }
  function checkHostLimit() {
    if (verifyConfigValue("disablequery")) {
      return true;
    } else {
      if (NAMESPACE_SPRO == "SEI Pro") {
        var host = sessionStorage.getItem("configHost_Pro") !== null ? JSON.parse(sessionStorage.getItem("configHost_Pro")) : false;
        if (host) {
          var set_host = false;
          if (typeof host !== "undefined" && host !== null && typeof host.matches !== "undefined" && host.matches !== null && host.matches.length > 0) {
            for (i = 0; i < host.matches.length; i++) {
              if (window.location.host.indexOf(host.matches[i]) !== -1) set_host = true;
            }
          }
          if (set_host) {
            if (!checkConfigValue("disablequery") && !verifyConfigValue("disablequery")) return false;
            else return true;
          } else {
            return false;
          }
        } else {
          getConfigHost();
        }
      } else {
        return false;
      }
    }
  }
  function restrictConfigValue(name) {
    if (NAMESPACE_SPRO == "ANTAQ Pro" || NAMESPACE_SPRO == "ANTT Pro") {
      if (typeof checkUnidadeFuncBeta === "function" && checkUnidadeFuncBeta()) {
        return checkConfigValue(name);
      } else {
        return false;
      }
    } else {
      return checkConfigValue(name);
    }
  }
  function initNameConst(type = "get") {
    if (getOptionsPro("nomeVariaveisPro") && type == "get") {
      window.__ = getOptionsPro("nomeVariaveisPro");
    } else {
      setNameConst();
    }
  }
  function setNameConst() {
    var __demanda = getName("demanda", "demanda", true, false, false);
    var __Demanda = getName("demanda", "Demanda", true, false, true);
    var __demandas = getName("demanda", "demandas", false, false, false);
    var __as_demandas = getName("demanda", "as demandas", false, true, false);
    var __atividade = getName("atividade", "atividade", true, false, true);
    var __Atividade = getName("atividade", "Atividade", true, false, true);
    var __programa = getName("programa", "programa de gest\xE3o", true, false, true);
    var __Programa = getName("programa", "Programa de Gest\xE3o", true, false, true);
    var __ = {
      programa: __programa,
      Programa: __Programa,
      programas: getName("programa", "programas de gest\xE3o", false, false, false),
      Programas: getName("programa", "programas de gest\xE3o", false, false, true),
      o_programa: getName("programa", "o programa de gest\xE3o", true, true, false),
      demanda: __demanda,
      a_demanda: getName("demanda", "a demanda", true, true, false),
      a_demanda_selecionada: getName("demanda", "a demanda", true, true, false) + " " + getNameGenre("demanda", "selecionado", "selecionada"),
      A_demanda: getNameGenre("demanda", "O", "A") + " " + __demanda,
      As_demandas: getNameGenre("demanda", "O", "A") + "s " + __demandas,
      da_demanda: getNameGenre("demanda", "do", "da") + " " + __demanda,
      esta_demanda: getNameGenre("demanda", "este", "esta") + " " + __demanda,
      a_outra_demanda_vinculada: getNameGenre("demanda", "o outro", "a outra") + " " + __demanda + " " + getNameGenre("demanda", "vinculado", "vinculada"),
      nova_demanda: getNameGenre("demanda", "novo", "nova") + " " + __demanda,
      iniciada_a_demanda: getNameGenre("demanda", "iniciado", "iniciada") + " " + getName("demanda", "a demanda", true, true, false),
      demanda_programada: __demanda + " " + getNameGenre("demanda", "programado", "programada"),
      demandas: getName("demanda", "demandas", false, false, false),
      das_demandas: getNameGenre("demanda", "dos", "das") + " " + __demandas,
      minhas_demandas: getNameGenre("demanda", "meus", "minhas") + " " + __demandas,
      demandas_programadas: __demandas + " " + getNameGenre("demanda", "programados", "programadas"),
      Demanda: __Demanda,
      da_Demanda: getNameGenre("demanda", "do", "da") + " " + __Demanda,
      a_Demanda: getNameGenre("demanda", "o", "a") + " " + __Demanda,
      Nova_Demanda: getNameGenre("demanda", "Novo", "Nova") + " " + __Demanda,
      as_demandas: __as_demandas,
      as_demandas_selecionadas: __as_demandas + " " + getNameGenre("demanda", "selecionados", "selecionadas"),
      Demandas: getName("demanda", "Demanda", false, false, true),
      arquivar: getName("arquivar", "arquivar", true, false, false),
      Arquivar: getName("arquivar", "Arquivar", true, false, true),
      arquivamento: getName("arquivamento", "arquivamento", true, false, false),
      Arquivamento: getName("arquivamento", "Arquivamento", true, false, true),
      arquivado: getName("arquivado", "arquivado", true, false, false),
      Arquivado: getName("arquivado", "Arquivado", true, false, true),
      arquivados: getName("arquivado", "arquivados", false, false, false),
      arquivada: getName("arquivada", "arquivada", true, false, false),
      Arquivada: getName("arquivada", "Arquivada", true, false, true),
      Arquivadas: getName("arquivada", "Arquivadas", false, false, true),
      arquivadas: getName("arquivada", "arquivadas", false, false, false),
      paralisar: getName("paralisar", "paralisar", true, false, false),
      Paralisar: getName("paralisar", "Paralisar", true, false, true),
      paralisada: getName("paralisada", "paralisada", true, false, false),
      Paralisado: getName("paralisado", "Paralisado", true, false, true),
      Paralisada: getName("paralisada", "Paralisada", true, false, true),
      paralisacao: getName("paralisacao", "paralisa\xE7\xE3o", true, false, false),
      Paralisacao: getName("paralisacao", "Paralisa\xE7\xE3o", true, false, true),
      prescricao: getName("prescricao", "prescri\xE7\xE3o", true, false, false),
      Prescricao: getName("prescricao", "Prescri\xE7\xE3o", true, false, true),
      Prescricoes: getName("prescricao", "Prescri\xE7\xF5es", false, false, true),
      retomada: getName("retomada", "retomada", true, false, false),
      Retomada: getName("retomada", "Retomada", true, false, true),
      retomar: getName("retomar", "retomar", true, false, false),
      Retomar: getName("retomar", "Retomar", true, false, true),
      Prorrogar: getName("prorrogar", "Prorrogar", true, false, true),
      complexidade: getName("complexidade", "complexidade", true, false, false),
      Complexidade: getName("complexidade", "Complexidade", true, false, true),
      assunto: getName("assunto", "assunto", true, false, false),
      Assunto: getName("assunto", "Assunto", true, false, true),
      observacao: getName("observacao", "observa\xE7\xE3o", true, false, false),
      Observacao: getName("observacao", "Observa\xE7\xE3o", true, false, true),
      Observacoes: getName("observacao", "Observa\xE7\xF5es", false, false, true),
      gerencial: getName("gerencial", "gerencial", true, false, true),
      Gerencial: getName("gerencial", "Gerencial", true, false, true),
      tecnica: getName("tecnica", "t\xE9cnica", true, false, true),
      Tecnica: getName("tecnica", "T\xE9cnica", true, false, true),
      atividade: __atividade,
      Atividade: __Atividade,
      a_atividade: getName("atividade", "a atividade", true, true, false),
      a_Atividade: getName("atividade", "a Atividade", true, true, true),
      atividades: getName("atividade", "atividades", false, false, false),
      Atividades: getName("atividade", "Atividades", false, false, true),
      Deducoes: getName("deducao", "Dedu\xE7\xF5es", false, false, true)
    };
    window.__ = __;
    setOptionsPro("nomeVariaveisPro", __);
  }
  function copyTextThis(this_) {
    copyToClipboard($(this_).text().trim());
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  }
  function copyTextWithBR(_this) {
    copyToClipboardWithBR(_this);
    _this.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  }
  function markdownToHTML(markdown) {
    markdown = markdown.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
    markdown = markdown.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
    markdown = markdown.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
    markdown = markdown.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    markdown = markdown.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    markdown = markdown.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    markdown = markdown.replace(/^[-*] (.+)$/gm, "<li>$1</li>");
    markdown = markdown.replace(/(<li>.+<\/li>)/gms, "<ul>$1</ul>");
    markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    markdown = markdown.replace(/`([^`]+)`/g, "<code>$1</code>");
    markdown = markdown.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    markdown = markdown.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    markdown = markdown.replace(/\*(.+?)\*/g, "<em>$1</em>");
    markdown = markdown.replace(/\n{2,}/g, "</p><p>");
    markdown = markdown.replace(/\n/g, "<br>");
    return `<p>${markdown}</p>`;
  }
  function copyToClipboardWithBR(element) {
    var $temp = $("<textarea>");
    var brRegex = /<br\s*[\/]?>/gi;
    $("body").append($temp);
    $temp.val(element.clone().find(".copy_response").remove().end().html().replace(brRegex, "\r\n")).select();
    document.execCommand("copy");
    $temp.remove();
  }
  function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
  }
  function copyToClipboardHTML(str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }
  function targetIfrVisualizacaoPro(url) {
    if (typeof url !== "undefined" && url != "" && url !== null) {
      $($ifrVisualizacao).attr("src", url);
    }
  }
  function execIncluirEmBlocoPro() {
    $($ifrVisualizacao)[0].contentWindow.incluirEmBloco();
  }
  function execConcluirReabrirProcessoPro(url) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    if (ifrVisualizacao2.find('img[title="Reabrir Processo"]').length > 0) {
      $($ifrVisualizacao)[0].contentWindow.reabrirProcesso();
    } else if (ifrVisualizacao2.find('img[title="Concluir Processo"]').length > 0) {
      $($ifrVisualizacao)[0].contentWindow.concluirProcesso();
    } else {
      targetIfrVisualizacaoPro(url);
    }
  }
  function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  function getIDProtocoloSEI(protocolo, funcSucess, funcError) {
    var xhr = new XMLHttpRequest();
    var href = $("#frmProtocoloPesquisaRapida").attr("action");
    $.ajax({
      method: "POST",
      data: { txtPesquisaRapida: protocolo },
      url: href,
      xhr: function() {
        return xhr;
      },
      success: function(data) {
        var _return = getParamsUrlPro(xhr.responseURL);
        if (_return.id_protocolo != 0 && typeof _return.id_protocolo !== "undefined") {
          funcSucess(data);
        } else {
          funcError();
        }
      }
    });
  }
  function arraySheetToJSON(array) {
    var objDados = [];
    $.each(array, function(index, value) {
      if (index != 0 && typeof value[0] !== "undefined" && value[0] != "") {
        var obj = {};
        for (var i2 = 0; i2 < array[0].length; i2++) {
          var nameIndex = array[0][i2];
          obj[nameIndex] = typeof value[i2] !== "undefined" ? value[i2] : "";
        }
        objDados.push(obj);
      }
    });
    return objDados;
  }
  function arraySheetToJSON_WithRow(array) {
    var objDados = [];
    $.each(array, function(index, value) {
      if (index != 0 && value.length > 0) {
        var obj = {};
        obj["_ROW"] = index + 1;
        for (var i2 = 0; i2 < array[0].length; i2++) {
          var nameIndex = array[0][i2];
          obj[nameIndex] = typeof value[i2] !== "undefined" ? value[i2] : "";
        }
        objDados.push(obj);
      } else {
        objDados.push({ _ROW: index + 1 });
      }
    });
    return objDados;
  }
  function getCitacaoDoc() {
    var citacaoDoc = "SEI n\xBA ";
    citacaoDoc = getConfigValue("citacaodoc") == "citacaodoc_2" ? "SEI " : citacaoDoc;
    citacaoDoc = getConfigValue("citacaodoc") == "citacaodoc_5" ? "Doc. SEI n\xBA " : citacaoDoc;
    citacaoDoc = getConfigValue("citacaodoc") == "citacaodoc_3" || getConfigValue("citacaodoc") == "citacaodoc_4" ? "" : citacaoDoc;
    return citacaoDoc;
  }
  function checkFormRequiredPro(elementForm) {
    var required = true;
    $(elementForm + " .required").each(function(index) {
      if ($(this).val() == "") {
        required = false;
      }
    });
    return required;
  }
  function confirmaFraseBoxPro(text, phrase, func, cancel) {
    if (alertBoxPro) {
      alertBoxPro.dialog("destroy");
      alertBoxPro = false;
      $(".alertaAttencionPro").html("");
    }
    var phraseDiv = '<div class="dialogBoxDiv">Para confirmar, digite <b style="font-weight: bold;">' + phrase.toUpperCase() + `</b>:</div><div class="dialogBoxDiv seiProForm">   <input id="dialogBoxConfirmFrase" autocomplete="off" onkeypress="if (event.which == 13) { $(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click') }" oninput="if ('` + phrase.toUpperCase() + `' == $(this).val().trim().toUpperCase()) {updateButtonConfirm(this, true)} else {updateButtonConfirm(this, false)}" type="text" style="font-size: 10pt; width: 80%; text-transform: uppercase;"></div>`;
    alertBoxPro = $("#alertaBoxPro").html('<strong class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> ' + text + "</strong>" + phraseDiv).dialog({
      title: NAMESPACE_SPRO,
      width: 550,
      close: function() {
        alertBoxPro = false;
        $(".alertaAttencionPro").html("");
        if (typeof cancel === "function") {
          cancel();
        }
      },
      buttons: [{
        text: "Cancelar",
        click: function() {
          $(this).dialog("close");
          if (typeof cancel === "function") {
            cancel();
          }
        }
      }, {
        text: "OK",
        class: "confirm",
        click: function(event2) {
          event2.preventDefault();
          event2.stopPropagation();
          var confirmFrase = $("#dialogBoxConfirmFrase");
          if (phrase.toUpperCase() == confirmFrase.val().trim().toUpperCase()) {
            confirmFrase.removeClass("requiredNull");
            func();
            $(this).dialog("close");
          } else {
            confirmFrase.addClass("requiredNull");
          }
        }
      }]
    });
  }
  function confirmaBoxPro(text, func, titBtn = "OK", cancel = false, titBtnCancel = "Cancelar") {
    if (alertBoxPro) {
      alertBoxPro.dialog("destroy");
      alertBoxPro = false;
      $(".alertaAttencionPro").html("");
    }
    alertBoxPro = $("#alertaBoxPro").html('<strong class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> ' + text + "</strong>").dialog({
      title: NAMESPACE_SPRO,
      width: 500,
      close: function() {
        alertBoxPro = false;
        if (typeof cancel === "function") {
          cancel();
        }
        $(".alertaAttencionPro").html("");
      },
      buttons: [{
        text: titBtnCancel,
        click: function() {
          if (typeof cancel === "function") {
            cancel();
          }
          $(this).dialog("close");
        }
      }, {
        text: titBtn,
        class: "confirm ui-state-active",
        click: function() {
          func();
          $(this).dialog("close");
        }
      }]
    });
  }
  function alertaBoxPro(status, icon, text, func_ok = false, button_text = "OK", hide_close = false) {
    resetDialogBoxPro("alertBoxPro");
    alertBoxPro = $("#alertaBoxPro").html('<strong class="alerta' + status + 'Pro dialogBoxDiv"><i class="fas fa-' + icon + '" style="margin-right: 5px;"></i> ' + text + "</strong>").dialog({
      title: NAMESPACE_SPRO,
      width: 400,
      open: function() {
        var closeButton = $(this).closest(".ui-dialog").find(".ui-dialog-titlebar-close");
        closeButton.toggle(!hide_close);
      },
      close: function() {
        alertBoxPro = false;
        $(".alerta" + status + "Pro").html("");
      },
      buttons: [{
        text: button_text,
        class: "confirm",
        click: function() {
          $(this).dialog("close");
          if (typeof func_ok === "function") func_ok();
        }
      }]
    });
  }
  function openConfigBoxPro(html = "", func_open = false, func_close = false) {
    resetDialogBoxPro("configBoxPro");
    configBoxPro = $("#configBoxPro").html('<div id="configBoxProDiv" class="configBoxProDiv">' + html + "</div>").dialog({
      title: NAMESPACE_SPRO + ": Configura\xE7\xF5es",
      width: "95%",
      height: "auto",
      modal: true,
      open: function() {
        if (typeof func_open === "function") func_open();
      },
      close: function() {
        configBoxPro = false;
        if (typeof func_close === "function") func_close();
      },
      buttons: [{
        text: "OK",
        class: "confirm",
        click: function() {
          $(this).dialog("close");
        }
      }]
    });
  }
  function generateGreetings() {
    var currentHour = parseInt(moment().format("HH"));
    console.log(currentHour);
    if (currentHour >= 5 && currentHour < 12) {
      return "Bom dia";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Boa tarde";
    } else if (currentHour >= 18 || currentHour < 5) {
      return "Boa noite";
    } else {
      return "Ol\xE1";
    }
  }
  function togglePainelPro(idTable, mode) {
    if (mode == "hide") {
      $("#" + idTable + "_full").hide();
      $("#" + idTable + "_min").show();
      setOptionsPro(idTable, "hide");
    } else {
      $("#" + idTable + "_full").show();
      $("#" + idTable + "_min").hide();
      setOptionsPro(idTable, "show");
    }
  }
  function toggleTablePro(idTable, mode) {
    var elemTable = idTable.substring(1);
    if (mode == "hide") {
      $(idTable).addClass("displayNone");
      $("#" + elemTable + "_hideIcon").hide();
      $("#" + elemTable + "_showIcon").show();
      setOptionsPro(elemTable, "hide");
    } else {
      $(idTable).removeClass("displayNone").css("display", "");
      $("#" + elemTable + "_hideIcon").show();
      $("#" + elemTable + "_showIcon").hide();
      setOptionsPro(elemTable, "show");
    }
  }
  function toogleByID(this_) {
    var _this = $(this_);
    var _ref = _this.data("ref");
    var elem = $("#" + _ref);
    if (elem.is(":visible")) {
      elem.hide();
    } else {
      elem.show();
    }
  }
  function getProcessNotificationCountPro() {
    return $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso, a.processoCredencialAssinaturaSigiloso").length;
  }
  function getCurrentUserNamePro() {
    var userTitle = $("#lnkUsuarioSistema").attr("title") || "";
    var userText = $("#lnkUsuarioSistema").text() || "";
    var userName = "";
    var titleMatchers = [
      /(.+)\s-\s/,
      /(.+)\s\(.*/,
      /(.+?)\s*\/\s*.*/
    ];
    $.each(titleMatchers, function(_, matcher) {
      var match = userTitle.match(matcher);
      if (!userName && match && match[1]) {
        userName = match[1].trim();
      }
    });
    if (!userName && userTitle) {
      userName = userTitle.split("\n")[0].trim();
    }
    if (!userName && userText) {
      userName = userText.trim();
    }
    return userName;
  }
  function getSignatureBlockTablePro() {
    var table = $("#tblProtocolosBlocos").first();
    if (table.length) return table;
    table = $("#frmRelBlocoProtocoloLista #divInfraAreaTabela table.infraTable").first();
    return table.length ? table : $("table.infraTable").first();
  }
  function getSignatureColumnIndexPro(table) {
    var indexAssinatura = -1;
    var headerCells = table.find("thead tr:first th, thead tr:first td");
    if (!headerCells.length) {
      headerCells = table.find("tbody tr.tableHeader:first th, tbody tr.tableHeader:first td");
    }
    if (!headerCells.length) {
      headerCells = table.find("tr:first th, tr:first td");
    }
    headerCells.each(function(index) {
      if (/^Assinaturas?$/i.test($(this).text().trim())) {
        indexAssinatura = index;
        return false;
      }
    });
    return indexAssinatura;
  }
  function getSignatureBlockRowsPro(table, indexAssinatura) {
    return table.find("tbody tr").filter(function() {
      var tr = $(this);
      return !tr.hasClass("tableHeader") && !tr.hasClass("infraCaption") && tr.find('input[type="checkbox"]').length > 0 && tr.find("td").length > indexAssinatura;
    });
  }
  function toggleSignatureCheckboxPro(checkbox, checked) {
    var _checkbox = $(checkbox);
    if (_checkbox.prop("checked") !== checked) {
      _checkbox.trigger("click");
    }
  }
  function applySignatureBlockSelectionPro(type) {
    var table = getSignatureBlockTablePro();
    var indexAssinatura = getSignatureColumnIndexPro(table);
    var usuario = normalizeSignatureSelectionTextPro(getCurrentUserNamePro());
    if (!table.length || indexAssinatura < 0) return false;
    getSignatureBlockRowsPro(table, indexAssinatura).each(function() {
      var tr = $(this);
      var checkbox = tr.find('input[type="checkbox"]').first();
      var assinatura = normalizeSignatureSelectionTextPro(tr.find("td").eq(indexAssinatura).text());
      var hasAssinatura = assinatura.length > 0;
      var hasMinhaAssinatura = !!(usuario && hasAssinatura && assinatura.indexOf(usuario) !== -1);
      if (type === "todos") {
        toggleSignatureCheckboxPro(checkbox, true);
      } else if (type === "nenhum") {
        toggleSignatureCheckboxPro(checkbox, false);
      } else if (type === "sem-assinatura") {
        toggleSignatureCheckboxPro(checkbox, !hasAssinatura);
      } else if (type === "sem-minha-assinatura") {
        toggleSignatureCheckboxPro(checkbox, !hasMinhaAssinatura);
      } else if (type === "com-minha-assinatura") {
        toggleSignatureCheckboxPro(checkbox, hasMinhaAssinatura);
      }
    });
    return true;
  }
  function renderSignatureBlockSelectionPro() {
    var table = getSignatureBlockTablePro();
    var caption = $("#tblProtocolosBlocos caption.infraCaption").first();
    if (!caption.length) {
      caption = table.find("caption.infraCaption").first();
    }
    var toolbar = $("#frmRelBlocoProtocoloLista #divInfraBarraComandosSuperior").first();
    var target = caption.length ? caption : toolbar;
    if (!table.length || !target.length || target.find(".seiProSignatureSelection").length) {
      return false;
    }
    var htmlSelection = '<span class="seiProSignatureSelection">    <span class="seiProSignatureSelection_label">Selecionar:</span>    <a class="newLink" href="#" data-selection-signature="todos">Todos</a>    <a class="newLink" href="#" data-selection-signature="nenhum">Nenhum</a>    <a class="newLink" href="#" data-selection-signature="sem-assinatura">Sem assinatura</a>    <a class="newLink" href="#" data-selection-signature="sem-minha-assinatura">Sem minha assinatura</a>    <a class="newLink" href="#" data-selection-signature="com-minha-assinatura">Com minha assinatura</a></span>';
    if (caption.length) {
      caption.append(htmlSelection);
    } else {
      toolbar.append(htmlSelection);
    }
    return true;
  }
  window.initSmartSignatureSelectionPro = function initSmartSignatureSelectionPro() {
    if (window.location.href.indexOf("acao=rel_bloco_protocolo_listar") === -1 || window.__SEI_PRO_SMART_SIGNATURE_SELECTION__) {
      return false;
    }
    var start = function() {
      if (window.__SEI_PRO_SMART_SIGNATURE_SELECTION__) return;
      if (!checkConfigValue("selecaointeligenteblocoassinatura")) return;
      if (!$("#frmRelBlocoProtocoloLista").length || !$("#tblProtocolosBlocos").length) return;
      if (!$("#btnAssinar").length) return;
      if (!renderSignatureBlockSelectionPro()) return;
      $(document).on("click", ".seiProSignatureSelection a[data-selection-signature]", function(event2) {
        event2.preventDefault();
        applySignatureBlockSelectionPro($(this).attr("data-selection-signature"));
      });
      window.__SEI_PRO_SMART_SIGNATURE_SELECTION__ = true;
    };
    if (window.__SEI_PRO_CONFIG_READY__) {
      start();
    } else {
      window.addEventListener("sei-pro-config-ready", start, { once: true });
    }
    return true;
  };
  function syncProcessNotificationsPro(force) {
    if (typeof checkConfigValue !== "function") return false;
    var enabled = checkConfigValue("notificacaonovoprocesso");
    var count = enabled ? getProcessNotificationCountPro() : 0;
    var stateKey = [
      window.location.host || "",
      $("#lnkUsuarioSistema").attr("title") || getOptionsPro("usuarioSistema") || "",
      siglaUnidadeAtual || ""
    ].join("::");
    if (!stateKey.replace(/:/g, "").trim()) return false;
    if (!force && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.enabled === enabled && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.count === count && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.key === stateKey) {
      return false;
    }
    window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ = {
      enabled,
      count,
      key: stateKey
    };
    var runtimeApi = typeof browser !== "undefined" && browser.runtime ? browser : typeof chrome !== "undefined" && chrome.runtime ? chrome : null;
    if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== "function") {
      return false;
    }
    runtimeApi.runtime.sendMessage({
      action: "syncNotificacaoProcessos",
      enabled,
      count,
      key: stateKey,
      label: siglaUnidadeAtual || window.location.host || ""
    }, function() {
      var runtimeError = runtimeApi.runtime && runtimeApi.runtime.lastError;
      if (runtimeError && verifyConfigValue && verifyConfigValue("debugpage")) {
        console.warn("Falha ao sincronizar notifica\xE7\xF5es de processos:", runtimeError.message);
      }
    });
    return true;
  }
  window.initProcessNotificationsPro = function initProcessNotificationsPro() {
    if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;
    var start = function() {
      if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;
      syncProcessNotificationsPro(true);
      window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__ = window.setInterval(function() {
        syncProcessNotificationsPro(false);
      }, 1e4);
    };
    if (window.__SEI_PRO_CONFIG_READY__) {
      start();
    } else {
      window.addEventListener("sei-pro-config-ready", start, { once: true });
    }
  };
  function getProcessoUnidadePro(selected = false, obj = false) {
    if ($("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").length > 0) {
      var processosUnidade = [];
      var selectTableTr = selected ? $("#tblProcessosRecebidos, #tblProcessosGerados, .infraTable").find("tr.infraTrMarcada") : $("#tblProcessosRecebidos, #tblProcessosGerados, .infraTable").find("tr");
      if (selectTableTr.length > 0) {
        selectTableTr.each(function(index) {
          var a = $(this).find("td").eq(2).find("a").eq(0);
          var processo_sei = a.text();
          processo_sei = typeof processo_sei !== "undefined" ? processo_sei : false;
          var id_procedimento = getParamsUrlPro(a.attr("href")).id_procedimento;
          id_procedimento = typeof id_procedimento !== "undefined" ? id_procedimento : false;
          var especificacao = extractTooltipToArray(a.attr("onmouseover"));
          especificacao = especificacao ? especificacao[0] : false;
          if (processo_sei && id_procedimento) {
            var _return = obj ? { processo_sei, id_procedimento, especificacao } : processo_sei;
            processosUnidade.push(_return);
          }
        });
        if (obj) {
          processosUnidade.filter(
            (processosUnidade2, index, self) => index === self.findIndex((t) => t.processo_sei === processosUnidade2.processo_sei)
          );
          setOptionsPro("objProcessoUnidade", processosUnidade);
        } else {
          uniqPro(processosUnidade);
          setOptionsPro("listaProcessoUnidade", processosUnidade);
        }
      } else {
        processosUnidade = false;
      }
      return processosUnidade;
    } else {
      if (obj)
        return getOptionsPro("objProcessoUnidade");
      else
        return getOptionsPro("listaProcessoUnidade");
    }
  }
  function initListTypesSEI(callback = false, TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof arrayListTypesSEI.selectTipoProc !== "undefined") {
      if (typeof callback === "function") callback();
    } else {
      setTimeout(function() {
        if (TimeOut == 9e3) getListTypesSEI();
        initListTypesSEI(callback, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initListTypesSEI");
      }, 500);
    }
  }
  function getListTypesSEI() {
    var hrefConsulta = $(mainMenu).find('a[href*="protocolo_pesquisa"]').attr("href");
    if (typeof hrefConsulta !== "undefined" && hrefConsulta != "") {
      $.ajax({ url: hrefConsulta }).done(function(html) {
        var $htmlConsulta = $(html);
        var form = $htmlConsulta.find("#frmPesquisaProtocolo");
        var param = {};
        param["selectTipoProc"] = $htmlConsulta.find("#selTipoProcedimentoPesquisa option").map(function() {
          if ($(this).text().trim() != "") {
            return { name: $(this).text().trim(), value: $(this).val() };
          }
        }).get();
        param["selSeriePesquisa"] = $htmlConsulta.find("#selSeriePesquisa option").map(function() {
          if ($(this).text().trim() != "") {
            return { name: $(this).text().trim(), value: $(this).val() };
          }
        }).get();
        arrayListTypesSEI = param;
      });
    }
  }
  function getCheckerProcessoPro() {
    $("<iframe>", {
      id: "frmCheckerProcessoPro",
      name: "frmCheckerProcessoPro",
      frameborder: 0,
      style: checkBrowser() == "Firefox" ? "width: 1px; height: 1px; position: absolute; top: -100px;" : "width: 1px; height: 1px; position: absolute; top: -100px; display: none;",
      tableindex: "-1",
      scrolling: "no"
    }).appendTo("body");
  }
  function getDadosIframeProcessoPro(idProcedimento, mode) {
    if (typeof idProcedimento !== "undefined" && idProcedimento != "" && !checkProcessoSigiloso()) {
      if (mode == "monitorados") {
        getDadosAjaxMonitoradoPro(idProcedimento);
        return;
      }
      if ($("#frmCheckerProcessoPro").length == 0) {
        getCheckerProcessoPro();
      }
      var url = url_host.replace("controlador.php", "") + "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + idProcedimento;
      if (!checkProcessoSigiloso()) {
        $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
          checkDadosIframeProcessoPro(mode);
        });
      }
    }
  }
  function checkDadosIframeProcessoPro(mode) {
    var iframe = $("#frmCheckerProcessoPro").contents();
    var _ifrVisualizacao = iframe.find($ifrVisualizacao).contents();
    var _ifrArvore = iframe.find("#ifrArvore").contents();
    var ifrArvoreElem = iframe.find("#ifrArvore");
    if (!checkProcessoSigiloso(iframe)) {
      setTimeout(function() {
        if (_ifrVisualizacao.find("#divArvoreAcoes").length > 0) {
          getDadosProcessoPro(_ifrVisualizacao, _ifrArvore, mode);
          getLinksProcessoPro(_ifrVisualizacao, _ifrArvore);
          getLinksArvorePro(_ifrArvore);
          getDadosPesquisaPro(iframe, mode);
          getListaAtribuicaoProcesso(ifrArvoreElem, mode);
          unidade = SeiPro.sei.adapter.isNewSEI() ? $("#lnkInfraUnidade").text() : $("#selInfraUnidades").find("option:selected").text().trim();
        } else {
          checkDadosIframeProcessoPro(mode);
        }
      }, 500);
    } else {
      $("#frmCheckerProcessoPro, .sparkling-modal-container, #divInfraModalFundo").remove();
    }
  }
  function getDadosPesquisaPro(iframe, mode) {
    var href = iframe.find(mainMenu).find("li a").map(function() {
      if (typeof $(this).attr("href") !== "undefined" && $(this).attr("href").indexOf("acao=protocolo_pesquisar") !== -1) {
        return $(this).attr("href");
      }
    }).get().join();
    if (href != "") {
      var tiposDocumentos = [];
      $.ajax({ url: href }).done(function(html) {
        let $html = $(html);
        $html.find("#selSeriePesquisa").find("option").each(function() {
          var id = $(this).attr("value");
          var name = $(this).text().trim();
          if (name != "") {
            tiposDocumentos.push({ id, name });
          }
        });
        dadosProcessoPro.tiposDocumentos = tiposDocumentos;
      });
    }
  }
  var getTypeSEI = async (type = "documentos") => {
    try {
      if (type == "documentos" && typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.tiposDocumentos !== "undefined" && dadosProcessoPro.tiposDocumentos.length) return dadosProcessoPro.tiposDocumentos;
      if (type == "processos" && typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.propProcesso !== "undefined" && typeof dadosProcessoPro.propProcesso.selTipoProcedimento_select !== "undefined" && dadosProcessoPro.propProcesso.selTipoProcedimento_select.length) return dadosProcessoPro.propProcesso.selTipoProcedimento_select;
      const href = $(mainMenu).find("li a").map(function() {
        if (typeof $(this).attr("href") !== "undefined" && $(this).attr("href").indexOf("acao=protocolo_pesquisar") !== -1) {
          return $(this).attr("href");
        }
      }).get().join();
      if (href === "") {
        throw new Error("Erro ao obter a URL de pesquisa de protocolos");
      }
      const html = await $.ajax({ url: href });
      const $html = $(html);
      let listArray = [];
      const elemSelect = type === "documentos" ? $html.find("#selSeriePesquisa") : $html.find("#selTipoProcedimentoPesquisa");
      elemSelect.find("option").each(function() {
        const id = $(this).attr("value");
        const name = $(this).text().trim();
        if (name !== "") {
          listArray.push({ id, name });
        }
      });
      return listArray;
    } catch (error) {
      console.error("Erro ao obter tipos de documentos:", error);
      alertaBoxPro("Error", "exclamation-triangle", error.message);
      return [];
    }
  };
  function getDadosProcessoPro(_ifrVisualizacao, _ifrArvore, mode) {
    var processo = {};
    var acompEsp = _ifrArvore.find('a[target="ifrVisualizacao"][href*="controlador.php?acao=acompanhamento_cadastrar"]');
    var arrayAcompEsp = acompEsp.length > 0 ? { url: acompEsp.attr("href"), title: acompEsp.find("img").attr("title").split(/\r?\n|\r|\n/g)[1] } : "";
    if (_ifrVisualizacao.find("#divArvoreAcoes a").length) {
      _ifrVisualizacao.find("#divArvoreAcoes a").each(function(index) {
        var href = $(this).attr("href");
        if (href.indexOf("acao=procedimento_alterar") !== -1 || href.indexOf("acao=procedimento_consultar") !== -1) {
          ajaxDadosProcessoPro(href, mode, arrayAcompEsp);
        } else if (href.indexOf("acao=procedimento_gerar_pdf") !== -1) {
          ajaxDadosDocumentosPro(href, mode);
        }
      });
    } else {
      var linkArvore = getLinksArvoreAjax(_ifrArvore.find("html").html());
      if (linkArvore.length) {
        $.each(linkArvore, function(i2, v) {
          var href = v.url;
          if (href.indexOf("acao=procedimento_alterar") !== -1 || href.indexOf("acao=procedimento_consultar") !== -1) {
            ajaxDadosProcessoPro(href, mode, arrayAcompEsp);
          } else if (href.indexOf("acao=procedimento_gerar_pdf") !== -1) {
            ajaxDadosDocumentosPro(href, mode);
          }
        });
      }
    }
  }
  function getLisDocsProcessoPro() {
    var ifrArvore = $("#ifrArvore");
    var arrayLinksArvore2 = getTreeLinksSession();
    var href = getTreeLinkUrlByName("Gerar Arquivo PDF do Processo");
    if (href !== null) {
      ajaxDadosDocumentosPro(href, false);
    }
  }
  function getLinksArvorePro(_ifrArvore) {
    if (SeiPro.sei.adapter.isNewSEI() && getSeiVersionPro() && compareVersionNumbers(getSeiVersionPro(), "4.1.0") >= 0) {
      var link = _ifrArvore.find("#divConsultarAndamento a").attr("onclick");
      link = typeof link !== "undefined" ? link.split("'")[1] : false;
      if (link) getDadosAndamentoPro(link);
    } else {
      _ifrArvore.find("script").each(function(i2) {
        if (typeof $(this).attr("src") === "undefined" && $(this).html().indexOf("consultarAndamento") !== -1) {
          var text = $(this).html();
          var link2 = $.map(text.split("'"), function(substr, i3) {
            return i3 % 2 && substr.indexOf("controlador.php?acao=") !== -1 ? substr : null;
          });
          if (link2.length > 0) {
            $.each(link2, function(index, value) {
              var name = "";
              if (value.indexOf("?acao=procedimento_consultar_historico") !== -1) {
                getDadosAndamentoPro(value);
              }
            });
          }
        }
      });
    }
  }
  function getDadosAndamentoPro(href) {
    $.ajax({ url: href }).done(function(html) {
      let $html = $(html);
      var andamento = getArrayHistorico($html);
      var processo = $html.find("#divInfraBarraLocalizacao").text().trim().split(" ");
      processo = processo[processo.length - 1];
      var id_procedimento = $html.find("#frmProcedimentoHistorico").attr("action");
      id_procedimento = typeof id_procedimento !== "undefined" && id_procedimento != "" ? getParamsUrlPro(id_procedimento).id_procedimento : "";
      var listAndamento = { historico_completo: false, processo, id_procedimento, andamento };
      if (typeof dadosProcessoPro.listAndamento !== "undefined" && typeof dadosProcessoPro.listAndamento.historico_completo !== "undefined" && dadosProcessoPro.listAndamento.historico_completo) {
        console.log("Ignore getDataRecebimentoPro");
      } else {
        dadosProcessoPro.listAndamento = listAndamento;
        setSessionProcessosPro(dadosProcessoPro);
        getDataRecebimentoPro(listAndamento);
      }
    });
  }
  function getLinksProcessoPro(_ifrVisualizacao, _ifrArvore) {
    var linksArvore2 = [];
    _ifrVisualizacao.find("script").each(function(i2) {
      if (typeof $(this).attr("src") === "undefined" && $(this).html().indexOf("objAjaxVerificacaoAssinatura") !== -1) {
        var text = $(this).html();
        var link = $.map(text.split("'"), function(substr, i3) {
          return i3 % 2 && substr.indexOf("controlador.php?acao=") !== -1 ? substr : null;
        });
        if (link.length > 0) {
          $.each(link, function(index, value) {
            var name = "";
            if (value.indexOf("?acao=procedimento_concluir") !== -1 && _ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0) {
              name = "Concluir Processo";
            } else if (value.indexOf("?acao=procedimento_ciencia") !== -1 && _ifrVisualizacao.find('img[title="Ci\xEAncia"]').length > 0) {
              name = "Ci\xEAncia";
            } else if (value.indexOf("?acao=procedimento_enviar_email") !== -1 && _ifrVisualizacao.find('img[title="Enviar Correspond\xEAncia Eletr\xF4nica"]').length > 0) {
              name = "Enviar Correspond\xEAncia Eletr\xF4nica";
            } else if (value.indexOf("?acao=bloco_selecionar_processo") !== -1 && _ifrVisualizacao.find('img[title="Incluir em Bloco"]').length > 0) {
              name = "Incluir em Bloco";
            } else if (value.indexOf("?acao=procedimento_reabrir") !== -1 && _ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0) {
              name = "Reabrir Processo";
            } else if (value.indexOf("?acao=procedimento_atualizar_andamento") !== -1 && _ifrVisualizacao.find('img[title="Atualizar Andamento"]').length > 0) {
              name = "Atualizar Andamento";
            }
            var data = typeof jmespath !== "undefined" && parent.iconsFlashMenu ? jmespath.search(parent.iconsFlashMenu, "[?name=='" + name + "'] | [0]") : null;
            if (name != "" && data) {
              linksArvore2.push({ url: value, name: data.name, icon: data.icon, alt: data.alt });
            } else if (name != "") {
              linksArvore2.push({ url: value, name, icon: "", alt: name });
            }
          });
        }
      }
    });
    if (SeiPro.sei.adapter.isNewSEI() && getSeiVersionPro() && compareVersionNumbers(getSeiVersionPro(), "4.1.0") >= 0) {
      linksArvore2 = getLinksArvoreAjax(_ifrArvore.find("html").html());
      dadosProcessoPro.listLinks = linksArvore2;
    } else {
      dadosProcessoPro.listLinks = linksArvore2;
    }
    var ifrArvore = getIframeArvoreElement();
    if (ifrArvore && ifrArvore.contentWindow && typeof ifrArvore.contentWindow.initSeiProArvore === "function") {
      ifrArvore.contentWindow.initSeiProArvore();
    }
  }
  function ajaxDadosDocumentosPro(href, mode, callback = false) {
    var documentos = [];
    $.ajax({ url: href }).done(function(html) {
      let $html = $(html);
      $html.find("#tblDocumentos tbody tr.infraTrClara").each(function() {
        var a = $(this).find("td").eq(1).find("a");
        if (a.attr("href")) {
          documentos.push({
            id_documento: getParamsUrlPro(a.attr("href")).id_documento,
            id_protocolo: getParamsUrlPro(href).id_procedimento,
            nr_sei: a.text(),
            nome_documento: $(this).find("td").eq(2).text(),
            documento: $(this).find("td").eq(2).text(),
            data_assinatura: $(this).find("td").eq(3).text(),
            assinatura: void 0,
            sigilo: void 0,
            nativo: void 0
          });
        }
      });
      dadosProcessoPro.listDocumentosAssinados = documentos;
      setSessionProcessosPro(dadosProcessoPro);
      if (typeof callback === "function") callback(documentos);
    });
  }
  function ajaxDadosProcessoPro(href, mode, arrayAcompEsp, callback = false) {
    var processo = {};
    $.ajax({ url: href }).done(function(html) {
      let $html = $(html);
      processo.action = $html.find("#frmProcedimentoCadastro").attr("action");
      processo.acompanhamentoEsp = arrayAcompEsp;
      processo.selAssuntos_select = $html.find("#selAssuntos option").map(function() {
        return $(this).text();
      }).get();
      processo.selTipoProcedimento_select = $html.find("#selTipoProcedimento option").map(function() {
        return { id: $(this).val(), name: $(this).text() };
      }).get();
      processo.selHipoteseLegal_select = $html.find("#selHipoteseLegal option").map(function() {
        return { id: $(this).val(), name: $(this).text() };
      }).get();
      $html.find("form input[type=hidden]").each(function() {
        if ($(this).attr("id") && $(this).attr("id").indexOf("hdn") !== -1) {
          processo[$(this).attr("id")] = $(this).val();
        }
      });
      $html.find("form input[type=text]").each(function() {
        if ($(this).attr("id") && $(this).attr("id").indexOf("txt") !== -1) {
          processo[$(this).attr("id")] = $(this).val();
        }
      });
      $html.find("form select").each(function() {
        if ($(this).attr("id") && $(this).attr("id").indexOf("sel") !== -1) {
          processo[$(this).attr("id")] = $(this).val();
        }
      });
      processo.selInteressadosProcedimento = $html.find("#selInteressadosProcedimento option").map(function() {
        return $(this).text();
      }).get();
      processo.selInteressadosProcedimento_list = $html.find("#selInteressadosProcedimento option").map(function() {
        return { name: $(this).text(), value: $(this).attr("value") };
      }).get();
      processo.selAssuntos = $html.find("#selAssuntos option").map(function() {
        return $(this).text();
      }).get();
      processo.rdoNivelAcesso = $html.find("input[name=rdoNivelAcesso]:checked").val();
      processo.urlHipoteseLegal = getUrlHipoteseLegal(html);
      var txtObs = $html.find("#txaObservacoes").val();
      txtObs = txtObs.indexOf("\n") !== -1 ? $.map(txtObs.split("\n"), function(substr, i2) {
        if (substr.charAt(0) != "#") {
          return substr.trim();
        }
      }).join(" ") : txtObs.charAt(0) != "#" ? txtObs : "";
      var arrayObs = [{ unidade: siglaUnidadeAtual, observacao: txtObs }];
      if ($html.find("#divObservacoesOutras").length > 0) {
        var arrayObsList = $html.find("#divObservacoesOutras").find("tbody tr").map(function() {
          if ($(this).find("td").eq(0).text() != "") {
            var txtObsTd = $(this).find("td").eq(1).text();
            txtObsTd = txtObsTd.indexOf("\n") !== -1 ? $.map(txtObsTd.split("\n"), function(substr, i2) {
              if (substr.charAt(0) != "#") {
                return substr.trim();
              }
            }).join(" ") : txtObsTd.charAt(0) != "#" ? txtObsTd : "";
            return { unidade: $(this).find("td").eq(0).text(), observacao: txtObsTd };
          }
        }).get();
        if (arrayObsList.length > 0) {
          Array.prototype.push.apply(arrayObs, arrayObsList);
        }
      }
      processo.txaObservacoes = arrayObs;
      var tagsObs = $html.find("#txaObservacoes").val();
      tagsObs = tagsObs.indexOf("\n") !== -1 ? $.map(tagsObs.split("\n"), function(substr, i2) {
        if (substr.charAt(0) == "#") {
          return substr.indexOf(":") !== -1 ? [{ name: removeAcentos(substr.split(":")[0].replace("#", "")).replace(/\ /g, "").toLowerCase().trim(), value: substr.split(":")[1].trim() }] : null;
        }
      }) : tagsObs.charAt(0) == "#" ? tagsObs.indexOf(":") !== -1 ? [{ name: removeAcentos(tagsObs.split(":")[0].replace("#", "")).replace(/\ /g, "").toLowerCase().trim(), value: tagsObs.split(":")[1].trim() }] : null : null;
      var arrayTags = tagsObs !== null ? [{ unidade: siglaUnidadeAtual, tags: tagsObs }] : null;
      if ($html.find("#divObservacoesOutras").length > 0) {
        var arrayTagsList = $html.find("#divObservacoesOutras").find("tbody tr").map(function() {
          if ($(this).find("td").eq(0).text() != "") {
            var tagsObsTd = $(this).find("td").eq(1).text();
            tagsObsTd = tagsObsTd.indexOf("\n") !== -1 ? $.map(tagsObsTd.split("\n"), function(substr, i2) {
              if (substr.charAt(0) == "#") {
                return substr.indexOf(":") !== -1 ? [{ name: removeAcentos(substr.split(":")[0].replace("#", "")).replace(/\ /g, "").toLowerCase().trim(), value: substr.split(":")[1].trim() }] : null;
              }
            }) : tagsObsTd.charAt(0) == "#" ? tagsObsTd.indexOf(":") !== -1 ? [{ name: removeAcentos(tagsObsTd.split(":")[0].replace("#", "")).replace(/\ /g, "").toLowerCase().trim(), value: tagsObsTd.split(":")[1].trim() }] : null : null;
            return tagsObsTd !== null ? { unidade: $(this).find("td").eq(0).text(), tags: tagsObsTd } : null;
          }
        }).get();
        if (typeof arrayTags !== "undefined" && arrayTags !== null && typeof arrayTagsList !== "undefined" && arrayTagsList !== null && arrayTagsList.length > 0) {
          Array.prototype.push.apply(arrayTags, arrayTagsList);
        }
      }
      processo.txaTagsObservacoes = arrayTags;
      dadosProcessoPro.propProcesso = processo;
      if (typeof callback === "function") callback(processo);
      if (checkConfigValue("historicoproc")) {
        setHistoryProcessosPro(dadosProcessoPro);
      }
      setTimeout(function() {
        updateTitlePage(mode);
        if (typeof setTipoPrescricaoProcesso === "function") setTipoPrescricaoProcesso();
      }, 500);
      if (mode == "editor" || mode == "gantt" || mode == "projeto" || mode == "dados" || mode == "processo") {
        checkDadosIframeDocumentosPro(mode);
      }
      if (mode == "processo") {
        setTimeout(function() {
          resizeArvoreMaxWidth();
        }, 500);
      }
    }).fail(function(data) {
      console.log(dadosProcessoPro.propProcesso, "Erro ao acessar dadosProcessoPro.propProcesso");
    });
  }
  function getHipoteseLegal(urlHipoteseLegal = dadosProcessoPro.propProcesso.urlHipoteseLegal, nivelAcesso = 1, callback = false) {
    $.ajax({
      type: "POST",
      url: urlHipoteseLegal,
      dataType: "text",
      data: {
        primeiroItemValor: null,
        primeiroItemDescricao: "",
        valorItemSelecionado: "",
        staNivelAcesso: parseInt(nivelAcesso)
      },
      success: function(result) {
        var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>', "")).html();
        if (html_result != "" && typeof callback === "function") {
          callback(html_result);
        }
      }
    });
  }
  function checkDadosIframeDocumentosPro(mode) {
    var i2 = 0;
    var ifrArvore = $("#frmCheckerProcessoPro").contents().find("#ifrArvore").contents();
    ifrArvore.find("#topmenu a").each(function(index) {
      var href = $(this).attr("href");
      if (typeof href !== "undefined" && href.indexOf("&abrir_pastas=1") !== -1) {
        i2 = 1;
        $("#frmCheckerProcessoPro").attr("src", href).unbind().on("load", function() {
          var ifrArvoreOpen = $("#frmCheckerProcessoPro").contents();
          var ifrWin = this.contentWindow;
          if (ifrWin) {
            ifrWin.atualizarVisualizacao = function() {
              return;
            };
          }
          arrayDadosIframeDocumentosPro(ifrArvoreOpen, mode);
        });
      }
    });
    if (i2 == 0) {
      arrayDadosIframeDocumentosPro(ifrArvore, mode);
    }
  }
  function arrayDadosIframeDocumentosPro(ifrArvore, mode) {
    getListDocumentosArvore(ifrArvore);
    if (mode == "editor") {
      setTimeout(function() {
        if (typeof getDialogDadosEditor === "function") getDialogDadosEditor();
      }, 1e3);
      if (typeof insertAutomaticMinutaWatermark === "function") insertAutomaticMinutaWatermark();
      try {
        document.documentElement.setAttribute("data-seipro-processo-dados", "ready");
        window.dispatchEvent(new CustomEvent("seipro-processo-dados-ready"));
      } catch (e) {
      }
    } else if (mode == "gantt") {
      updateSelectConcluirEtapa();
    } else if (mode == "projeto") {
      updateSelectConcluirProjetoEtapa();
    } else if (mode == "monitorados") {
      parent.updateSelectMonitorados();
      if (typeof parent.initAppendIconMonitorados === "function") parent.initAppendIconMonitorados();
      console.log("updateSelectMonitorados");
    } else if (mode == "dados") {
    }
    var dadosProcessoPro2 = pullDadosProcessoSession();
    setSessionProcessosPro(dadosProcessoPro2);
    if ($("#actionsTablePro").length) {
      getDocumentosActions();
    }
  }
  function getArvoreInitSignature(root) {
    var scope = root && typeof root.find === "function" ? root : $(root || document);
    var targetFrame = typeof ifrVisualizacao_ !== "undefined" && ifrVisualizacao_ ? ifrVisualizacao_ : null;
    if (!targetFrame) return "";
    var anchors = scope.find('a[id*="anchor"][target="' + targetFrame + '"]');
    if (!anchors.length) return "";
    return anchors.map(function() {
      return [
        $(this).attr("id") || "",
        $(this).attr("href") || ""
      ].join("|");
    }).get().join("::");
  }
  function getListDocumentosArvore(ifrArvore) {
    var processo = [];
    var dadosProcessoPro2 = pullDadosProcessoSession();
    var existingDocs = typeof dadosProcessoPro2.listDocumentos !== "undefined" && $.isArray(dadosProcessoPro2.listDocumentos) ? dadosProcessoPro2.listDocumentos : [];
    var docsById = {};
    var docsOrder = [];
    function hasValue(value) {
      return typeof value !== "undefined" && value !== null && value !== "";
    }
    function mergePreservedFields(baseDoc, prevDoc) {
      var mergedDoc = $.extend({}, baseDoc);
      var fieldsToPreserve = ["assinatura", "data_documento", "data_assinatura", "unidade", "assinado", "sigilo", "nativo"];
      $.each(fieldsToPreserve, function(_, field) {
        if (!hasValue(mergedDoc[field]) && hasValue(prevDoc[field])) {
          mergedDoc[field] = prevDoc[field];
        }
      });
      return mergedDoc;
    }
    ifrArvore.find(`#divArvore a[target="${ifrVisualizacao_}"]`).each(function(index) {
      var txt = $(this).text().trim();
      var text = txt.split(" ");
      var id_protocolo = $(this).attr("id").replace("anchor", "");
      var nr_sei = txt.indexOf(" ") !== -1 ? text[text.length - 1] : "";
      var documento = txt.replace(nr_sei, "").trim();
      nr_sei = nr_sei.indexOf("(") !== -1 ? nr_sei.replace(")", "").replace("(", "") : nr_sei;
      var assinatura = ifrArvore.find("#anchorA" + id_protocolo).length ? (ifrArvore.find("#anchorA" + id_protocolo + " img").attr("title") || "").replace("Assinado por:", "").trim() : "";
      var sigilo = ifrArvore.find("#iconNA" + id_protocolo).length ? (ifrArvore.find("#iconNA" + id_protocolo).attr("title") || "").trim() : "";
      var data_assinatura = typeof dadosProcessoPro2.listDocumentosAssinados !== "undefined" && !$.isEmptyObject(dadosProcessoPro2.listDocumentosAssinados) && jmespath.search(dadosProcessoPro2.listDocumentosAssinados, "[?id_documento=='" + id_protocolo + "'].data_assinatura | length(@)") > 0 ? jmespath.search(dadosProcessoPro2.listDocumentosAssinados, "[?id_documento=='" + id_protocolo + "'].data_assinatura | [0]") : "";
      var nativo = ifrArvore.find("#anchorImg" + id_protocolo + ' img[src*="' + nameDocInterno + '"]').length ? true : false;
      if (id_protocolo.indexOf("CD") === -1) {
        var doc = {
          id_protocolo,
          nr_sei,
          documento,
          assinatura,
          data_documento: data_assinatura && data_assinatura != "" ? moment(data_assinatura, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") : false,
          data_assinatura,
          sigilo,
          nativo
        };
        if (typeof docsById[id_protocolo] === "undefined") {
          docsById[id_protocolo] = doc;
          docsOrder.push(id_protocolo);
        } else {
          docsById[id_protocolo] = mergePreservedFields(doc, docsById[id_protocolo]);
        }
      }
    });
    $.each(existingDocs, function(_, existingDoc) {
      if (!existingDoc || !hasValue(existingDoc.id_protocolo)) return true;
      var idDoc = existingDoc.id_protocolo;
      if (typeof docsById[idDoc] === "undefined") {
        docsById[idDoc] = existingDoc;
        docsOrder.push(idDoc);
      } else {
        docsById[idDoc] = mergePreservedFields(docsById[idDoc], existingDoc);
      }
    });
    $.each(docsOrder, function(_, idDoc) {
      if (typeof docsById[idDoc] !== "undefined") {
        processo.push(docsById[idDoc]);
      }
    });
    dadosProcessoPro2.treeModel = buildTreeModel({
      documents: processo,
      links: typeof arrayLinksArvore !== "undefined" ? arrayLinksArvore : [],
      linksAll: typeof arrayLinksArvoreAll !== "undefined" ? arrayLinksArvoreAll : [],
      iconsView: typeof arrayIconsView !== "undefined" ? arrayIconsView : [],
      pageLinks: typeof arrayLinksPage !== "undefined" ? arrayLinksPage : [],
      signature: getArvoreInitSignature(ifrArvore),
      source: window.location.href
    });
    dadosProcessoPro2.listDocumentos = dadosProcessoPro2.treeModel.documents;
    setSessionProcessosPro(dadosProcessoPro2);
  }
  function buildTreeModel(treeModel = {}) {
    var model = {
      documents: [],
      documentsSigned: [],
      links: [],
      linksAll: [],
      iconsView: [],
      pageLinks: [],
      signature: "",
      source: ""
    };
    model.documents = normalizeTreeDocuments(treeModel.documents || treeModel.listDocumentos || []);
    model.documentsSigned = normalizeTreeDocuments(treeModel.documentsSigned || treeModel.listDocumentosAssinados || []);
    model.links = $.isArray(treeModel.links) ? treeModel.links.slice() : [];
    model.linksAll = $.isArray(treeModel.linksAll) ? treeModel.linksAll.slice() : [];
    model.iconsView = $.isArray(treeModel.iconsView) ? treeModel.iconsView.slice() : [];
    model.pageLinks = $.isArray(treeModel.pageLinks) ? treeModel.pageLinks.slice() : [];
    model.signature = typeof treeModel.signature !== "undefined" && treeModel.signature !== null ? String(treeModel.signature) : "";
    model.source = typeof treeModel.source !== "undefined" && treeModel.source !== null ? String(treeModel.source) : "";
    return model;
  }
  function syncTreeModelSession(dadosProcesso = pullDadosProcessoSession(), patch = {}) {
    if (!dadosProcesso || typeof dadosProcesso !== "object") {
      return buildTreeModel(patch);
    }
    var treeModel = getTreeModelSession(dadosProcesso);
    treeModel = buildTreeModel($.extend({}, treeModel, patch || {}));
    dadosProcesso.treeModel = treeModel;
    dadosProcesso.listDocumentos = treeModel.documents;
    dadosProcesso.listDocumentosAssinados = treeModel.documentsSigned;
    dadosProcesso.listLinks = treeModel.links;
    dadosProcesso.listLinksAll = treeModel.linksAll;
    dadosProcesso.treeIconsView = treeModel.iconsView;
    dadosProcesso.treePageLinks = treeModel.pageLinks;
    dadosProcesso.treeSignature = treeModel.signature;
    setSessionProcessosPro(dadosProcesso);
    return treeModel;
  }
  function normalizeTreeDocuments(listDocumentos) {
    var docs = [];
    var docsById = {};
    var docsOrder = [];
    function hasValue(value) {
      return typeof value !== "undefined" && value !== null && value !== "";
    }
    function addDoc(doc) {
      if (!doc || !hasValue(doc.id_protocolo)) return;
      var idDoc = doc.id_protocolo;
      if (typeof docsById[idDoc] === "undefined") {
        docsById[idDoc] = $.extend({}, doc);
        docsOrder.push(idDoc);
      } else {
        docsById[idDoc] = $.extend({}, docsById[idDoc], doc);
      }
    }
    $.each(listDocumentos || [], function(_, doc) {
      addDoc(doc);
    });
    $.each(docsOrder, function(_, idDoc) {
      if (typeof docsById[idDoc] !== "undefined") {
        docs.push(docsById[idDoc]);
      }
    });
    return docs;
  }
  function getTreeModelSession(dadosProcesso = pullDadosProcessoSession()) {
    if (!dadosProcesso || typeof dadosProcesso !== "object") {
      return buildTreeModel();
    }
    var treeModel = typeof dadosProcesso.treeModel !== "undefined" && dadosProcesso.treeModel !== null ? buildTreeModel($.extend({}, dadosProcesso.treeModel)) : buildTreeModel({
      documents: typeof dadosProcesso.listDocumentos !== "undefined" ? dadosProcesso.listDocumentos : [],
      documentsSigned: typeof dadosProcesso.listDocumentosAssinados !== "undefined" ? dadosProcesso.listDocumentosAssinados : [],
      links: typeof dadosProcesso.listLinks !== "undefined" ? dadosProcesso.listLinks : [],
      linksAll: typeof dadosProcesso.listLinksAll !== "undefined" ? dadosProcesso.listLinksAll : [],
      iconsView: typeof dadosProcesso.treeIconsView !== "undefined" ? dadosProcesso.treeIconsView : [],
      pageLinks: typeof dadosProcesso.treePageLinks !== "undefined" ? dadosProcesso.treePageLinks : [],
      signature: typeof dadosProcesso.treeSignature !== "undefined" ? dadosProcesso.treeSignature : ""
    });
    if (!treeModel.links.length && $.isArray(dadosProcesso.listLinks)) {
      treeModel.links = $.merge([], dadosProcesso.listLinks);
    }
    if (!treeModel.links.length && typeof arrayLinksArvore !== "undefined" && $.isArray(arrayLinksArvore)) {
      treeModel.links = $.merge([], arrayLinksArvore);
    }
    if (!treeModel.linksAll.length && $.isArray(dadosProcesso.listLinksAll)) {
      treeModel.linksAll = $.merge([], dadosProcesso.listLinksAll);
    }
    if (!treeModel.linksAll.length && typeof arrayLinksArvoreAll !== "undefined" && $.isArray(arrayLinksArvoreAll)) {
      treeModel.linksAll = $.merge([], arrayLinksArvoreAll);
    }
    if (!treeModel.iconsView.length && $.isArray(dadosProcesso.treeIconsView)) {
      treeModel.iconsView = $.merge([], dadosProcesso.treeIconsView);
    }
    if (!treeModel.iconsView.length && typeof arrayIconsView !== "undefined" && $.isArray(arrayIconsView)) {
      treeModel.iconsView = $.merge([], arrayIconsView);
    }
    if (!treeModel.pageLinks.length && $.isArray(dadosProcesso.treePageLinks)) {
      treeModel.pageLinks = $.merge([], dadosProcesso.treePageLinks);
    }
    if (!treeModel.pageLinks.length && typeof arrayLinksPage !== "undefined" && $.isArray(arrayLinksPage)) {
      treeModel.pageLinks = $.merge([], arrayLinksPage);
    }
    if (!treeModel.documents.length && $.isArray(dadosProcesso.listDocumentos)) {
      treeModel.documents = normalizeTreeDocuments(dadosProcesso.listDocumentos);
    }
    if (!treeModel.documentsSigned.length && $.isArray(dadosProcesso.listDocumentosAssinados)) {
      treeModel.documentsSigned = normalizeTreeDocuments(dadosProcesso.listDocumentosAssinados);
    }
    return buildTreeModel(treeModel);
  }
  function getTreeDocumentsSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return treeModel && $.isArray(treeModel.documents) ? treeModel.documents : [];
  }
  function getTreeSignedDocumentsSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return treeModel && $.isArray(treeModel.documentsSigned) ? treeModel.documentsSigned : [];
  }
  function getTreeLinksSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return treeModel && $.isArray(treeModel.links) ? treeModel.links : [];
  }
  function getTreeLinksAllSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return treeModel && $.isArray(treeModel.linksAll) ? treeModel.linksAll : [];
  }
  function getTreeIconsViewSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return treeModel && $.isArray(treeModel.iconsView) ? treeModel.iconsView : [];
  }
  function getTreePageLinksSession(dadosProcesso = pullDadosProcessoSession()) {
    var treeModel = getTreeModelSession(dadosProcesso);
    return treeModel && $.isArray(treeModel.pageLinks) ? treeModel.pageLinks : [];
  }
  function getTreeLinkByName(nameLink, dadosProcesso = pullDadosProcessoSession(), includePageLinks = false) {
    if (!nameLink) return false;
    var listLinks = getTreeLinksSession(dadosProcesso);
    var link = $.grep(listLinks, function(item) {
      return item && item.name == nameLink;
    })[0];
    if (!link && includePageLinks) {
      listLinks = getTreePageLinksSession(dadosProcesso);
      link = $.grep(listLinks, function(item) {
        return item && item.name == nameLink;
      })[0];
    }
    return link || false;
  }
  function getTreeLinkUrlByName(nameLink, dadosProcesso = pullDadosProcessoSession(), includePageLinks = false) {
    var link = getTreeLinkByName(nameLink, dadosProcesso, includePageLinks);
    return link && typeof link.url !== "undefined" && link.url !== null && link.url !== "" ? link.url : false;
  }
  function getTreeDocumentIndexById(id_documento, dadosProcesso = pullDadosProcessoSession()) {
    var docs = getTreeDocumentsSession(dadosProcesso);
    if (!id_documento || !docs.length) return -1;
    return docs.findIndex(function(doc) {
      return doc && doc.id_protocolo == id_documento;
    });
  }
  function updateTreeDocumentById(id_documento, patch, dadosProcesso = pullDadosProcessoSession()) {
    var docs = getTreeDocumentsSession(dadosProcesso);
    var index = getTreeDocumentIndexById(id_documento, dadosProcesso);
    if (index === -1) return false;
    docs[index] = $.extend({}, docs[index], patch || {});
    dadosProcesso.listDocumentos = normalizeTreeDocuments(docs);
    return docs[index];
  }
  function removeTreeDocumentById(id_documento, dadosProcesso = pullDadosProcessoSession()) {
    var docs = getTreeDocumentsSession(dadosProcesso);
    var index = getTreeDocumentIndexById(id_documento, dadosProcesso);
    if (index === -1) return false;
    docs.splice(index, 1);
    dadosProcesso.listDocumentos = normalizeTreeDocuments(docs);
    return true;
  }
  function getHistoryProcessosPro() {
    $(infraBarraS + ".barSuspenso").trigger("click");
    var dadosHistoricoProcessoPro = localStorageRestorePro("dadosHistoricoProcessoPro");
    var htmlBox = '<div id="boxHistory" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">   <table id="historyTablePro" style="margin-top: 35px; font-size: 8pt !important;width: 100%;" class="seiProForm tableAtividades tableDialog tableInfo tableZebra">        <thead>            <tr class="tableHeader">                <th class="tituloControle" style="text-align: center; width: 180px;">Processo</th>                <th class="tituloControle" style="text-align: center;font-weight: bold;">Tipo / Descri\xE7\xE3o</th>                <th class="tituloControle" style="text-align: center;font-weight: bold;">Acesso</th>            </tr>        </thead>        <tbody>';
    if (dadosHistoricoProcessoPro) {
      $.each(dadosHistoricoProcessoPro, function(i2, v) {
        htmlBox += '   <tr style="text-align: left;">       <td>           <a style="margin-left: 5px;" href="' + url_host + "?acao=procedimento_trabalhar&id_procedimento=" + v.id_procedimento + '" target="_blank">               <span class="bLink">                   ' + v.protocolo + '                   <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i>               </span>           </a>       </td>       <td>           <div style="color: #666; padding-top: 5px;">' + v.tipo_processo + '</div>           <div style="font-weight: bold; padding: 5px 0;">' + v.descricao + '</div>       <td data-time-sorter="' + v.datetime + `">           <div onmouseover="return infraTooltipMostrar('Acessado em ` + moment(v.datetime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY [\xE0s] HH:mm") + `');" onmouseout="return infraTooltipOcultar();">               ` + getDatesPreview({ date: v.datetime }) + "           </div>       <td>   </tr>";
      });
    }
    htmlBox += "   </table></div>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "Hist\xF3rio de Processos Visitados",
      width: 980,
      height: 450,
      resize: function(event2, ui) {
        setTabelaPanelScrollHeight("#boxHistory", 30);
      },
      open: function(event2, ui) {
        setTabelaPanelScrollHeight("#boxHistory", 30);
      },
      close: function() {
        $("#boxHistory").remove();
        resetDialogBoxPro("dialogBoxPro");
      }
    });
    setTimeout(function() {
      var historyTable = $("#historyTablePro");
      historyTable.tablesorter({
        sortLocaleCompare: true,
        sortList: [[2, 1]],
        textExtraction: {
          2: function(elem, table, cellIndex) {
            var text_date = $(elem).data("time-sorter");
            return text_date;
          }
        },
        widgets: ["saveSort", "filter"],
        widgetOptions: {
          saveSort: true,
          filter_hideFilters: true,
          filter_columnFilters: true,
          filter_saveFilters: true,
          filter_hideEmpty: true,
          filter_excludeFilter: {}
        },
        sortReset: true,
        headers: {
          0: { sorter: true },
          1: { filter: true },
          2: { filter: true }
        }
      }).on("filterEnd", function(event2, data) {
        checkboxRangerSelectShift();
        var caption = $(this).find("caption").eq(0);
        var tx2 = caption.text();
        caption.text(tx2.replace(/\d+/g, data.filteredRows));
        $(this).find("tbody > tr:visible > td > input").prop("disabled", false);
        $(this).find("tbody > tr:hidden > td > input").prop("disabled", true);
      });
      var filterHistory = historyTable.find(".tablesorter-filter-row").get(0);
      if (typeof filterHistory !== "undefined") {
        var observerFilterHistory = new MutationObserver(function(mutations) {
          var _this = $(mutations[0].target);
          var _parent = _this.closest("table");
          var iconFilter = _parent.find(".filterTableHistory button");
          var checkIconFilter = iconFilter.hasClass("active");
          var hideme = _this.hasClass("hideme");
          if (hideme && checkIconFilter) {
            iconFilter.removeClass("active");
          }
        });
        setTimeout(function() {
          var htmlFilterHistory = '<div class="btn-group filterTableHistory" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       <span class="text">Baixar</span>   </button>   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       <span class="text">Copiar</span>   </button>   <button type="button" onclick="cleanHistoryPro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Apagar" class="btn btn-sm btn-light">       <i class="fas fa-trash-alt" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>       Apagar   </button>   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (historyTable.find("tr.tablesorter-filter-row").hasClass("hideme") ? "" : "active") + '">       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>       Pesquisar   </button></div>';
          historyTable.find("thead .filterTableHistory").remove();
          historyTable.find("thead").prepend(htmlFilterHistory);
          observerFilterHistory.observe(filterHistory, {
            attributes: true
          });
          historyTable.find(".tablesorter-filter-row input.tablesorter-filter").eq(2).attr("type", "date");
        }, 500);
      }
    }, 500);
    if (typeof $().visible == "undefined") $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
  }
  function getAllLinksFolder() {
    var _ifrArvore = $("#ifrArvore");
    var ifrArvore = _ifrArvore.contents();
    ifrArvore.find('a[id*="ancjoin"]').each(function() {
      if ($(this).find("img").attr("src").indexOf("plus.gif") !== -1) {
        var idPasta = $(this).attr("id").replace("ancjoin", "");
        _ifrArvore[0].contentWindow.getLinksArvorePasta(idPasta);
      }
    });
    _ifrArvore[0].contentWindow.getLinksArvore();
  }
  function initMergeAllAndamentosProcesso(callback, TimeOut = 9e3) {
    if (TimeOut <= 0 || parent.window.name != "") {
      return;
    }
    if (typeof dadosProcessoPro !== "undefined") {
      mergeAllAndamentosProcesso(callback);
    } else {
      setTimeout(function() {
        initMergeAllAndamentosProcesso(callback, TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initMergeAllAndamentosProcesso => " + TimeOut);
      }, 500);
    }
  }
  function mergeAllAndamentosProcesso(callback = false) {
    var _ifrArvore = $("#ifrArvore");
    var ifrArvore = _ifrArvore.contents();
    var arrayLinksArvoreAll2 = getTreeLinksAllSession();
    var id_procedimento = getParamsUrlPro(_ifrArvore.attr("src")).id_procedimento;
    var processo = ifrArvore.find(`a[target="${ifrVisualizacao_}"]`).eq(0).text().trim();
    var linkHistorico = SeiPro.sei.adapter.isSEI5() ? ifrArvore.find("#divConsultarAndamento a").attr("onclick").match(/consultarAndamento\('([^']+)'\)/)?.[1] : typeof arrayLinksArvoreAll2 !== "undefined" ? arrayLinksArvoreAll2.filter(function(v) {
      return v.indexOf("procedimento_consultar_historico") !== -1;
    }) : [];
    if (linkHistorico.length > 0) {
      var linkHistorico_ = SeiPro.sei.adapter.isSEI5() ? linkHistorico : linkHistorico[0];
      var listProc = { processo, id_procedimento };
      getDadosHistoricoUrlPro(linkHistorico_, listProc, true, function(andamento) {
        var dadosProcessoPro2 = typeof pullDadosProcessoSession().listAndamento !== "undefined" ? pullDadosProcessoSession() : dadosProcessoPro2;
        dadosProcessoPro2 = typeof dadosProcessoPro2 !== "undefined" ? dadosProcessoPro2 : {};
        dadosProcessoPro2.listAndamento = andamento;
        $.each(getTreeDocumentsSession(dadosProcessoPro2), function(index, value) {
          var data_documento = jmespath.search(dadosProcessoPro2.listAndamento.andamento, "[?id_documento=='" + value.id_protocolo + "'] | [?contains(descricao, 'Gerado documento')] | [0].datahora");
          data_documento = data_documento !== null ? data_documento : false;
          var assinatura = jmespath.search(dadosProcessoPro2.listAndamento.andamento, "[?id_documento=='" + value.id_protocolo + "'] | [?contains(descricao, 'Assinado')||contains(descricao, 'assinatura')]");
          var data_assinatura = assinatura !== null ? assinatura : false;
          data_assinatura = data_assinatura && data_assinatura.length > 0 && typeof data_assinatura[0].descricao !== "undefined" && data_assinatura[0].descricao.indexOf("Assinado Documento") !== -1 ? data_assinatura[0].datahora : value["data_assinatura"];
          data_assinatura = data_assinatura && data_assinatura.length > 0 && typeof data_assinatura[0].descricao !== "undefined" && data_assinatura[0].descricao.indexOf("Cancelamento de assinatura") !== -1 ? false : data_assinatura;
          var assinado = assinatura && assinatura !== null && assinatura.length > 0 && typeof assinatura[0].descricao !== "undefined" && assinatura[0].descricao.indexOf("Assinado Documento") !== -1 ? true : false;
          var unidade2 = jmespath.search(dadosProcessoPro2.listAndamento.andamento, "[?id_documento=='" + value.id_protocolo + "'] | [?contains(descricao, 'Gerado documento')] | [0].unidade");
          unidade2 = unidade2 !== null ? unidade2 : false;
          updateTreeDocumentById(value.id_protocolo, {
            unidade: unidade2,
            data_assinatura,
            data_documento,
            assinado
          }, dadosProcessoPro2);
        });
        dadosProcessoPro2.listAndamento.historico_completo = true;
        setSessionProcessosPro(dadosProcessoPro2);
        if (typeof callback === "function") callback();
      });
    }
  }
  function batchActionsPro(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    var _table = _parent.find(".tableDialog");
    var btnData = _this.data();
    var checkboxList = _table.find("tr." + btnData.action).find('input[type="checkbox"]:checked').map(function() {
      return $(this).val();
    }).get();
    window.loopActionsPro = { list: checkboxList, index: 0, sigilo: {}, assinatura: {} };
    $("#frmCheckerProcessoPro").remove();
    if (btnData.action !== "documento_alterar" && btnData.action !== "documento_assinar" && checkboxList.length > 0 && _parent.find("#iconsActions i.fa-spin").length == 0) {
      if (btnData.action == "documento_excluir") {
        confirmaBoxPro("Tem certeza que deseja excluir " + (checkboxList.length > 1 ? "os documentos selecionados" : "o documento selecionado") + "?", function() {
          getBatchActionsPro(this_);
          _this.data("lastclass", _this.find("i").attr("class")).find("i").attr("class", "fas fa-sync fa-spin cinzaColor");
        }, "Excluir");
      } else if (btnData.action == "editor_montar") {
        confirmaBoxPro("Tem certeza que deseja cancelar a assinatura " + (checkboxList.length > 1 ? "dos documentos selecionados" : "do documento selecionado") + "?", function() {
          getBatchActionsPro(this_);
          _this.data("lastclass", _this.find("i").attr("class")).find("i").attr("class", "fas fa-sync fa-spin cinzaColor");
        }, "Cancelar Assinatura");
      } else {
        getBatchActionsPro(this_);
        _this.data("lastclass", _this.find("i").attr("class")).find("i").attr("class", "fas fa-sync fa-spin cinzaColor");
      }
    } else if (btnData.action == "documento_assinar" && checkboxList.length > 0 && _parent.find("#iconsActions i.fa-spin").length == 0) {
      var arrayLinksArvoreAll2 = getTreeLinksAllSession();
      var linkDoc = arrayLinksArvoreAll2.filter(function(v) {
        return v.indexOf("acao=arvore_visualizar") !== -1 && v.indexOf("id_documento=" + checkboxList[0]) !== -1;
      });
      if (linkDoc.length > 0) {
        $.ajax({ url: linkDoc[0] }).done(function(htmlDoc) {
          var $htmlDoc = $(htmlDoc);
          var textLink = $htmlDoc.filter("script").not('[src*="js"]').text();
          var arrayLinksArvoreDoc = getLinksInText(textLink);
          var linkAssinar = arrayLinksArvoreDoc.filter(function(v) {
            return v.indexOf("documento_assinar") !== -1;
          });
          if (linkAssinar.length > 0) {
            $.ajax({ url: linkAssinar[0] }).done(function(htmlAssinar) {
              var $htmlAssinar = $(htmlAssinar);
              var selOrgao = $htmlAssinar.find("#selOrgao option").map(function() {
                if ($(this).val() !== "null") {
                  return { value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr("selected") };
                }
              }).get();
              var selContexto = $htmlAssinar.find("#selContexto option").map(function() {
                if ($(this).val() !== "null") {
                  return { value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr("selected") };
                }
              }).get();
              var selCargoFuncao = $htmlAssinar.find("#selCargoFuncao option").map(function() {
                if ($(this).val() !== "null") {
                  return { value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr("selected") };
                }
              }).get();
              var txtUsuario = $htmlAssinar.find("#txtUsuario").val();
              var textBox2 = '<div class="dialogBoxDiv seiProForm">   <div class="configBoxPro_selOrgao">       <label style="margin-bottom: 10px;display: block;">\xD3rg\xE3o do Assinante</label>       <select id="configBoxPro_selOrgao" style="font-size: 10pt; width: 100%;">' + $.map(selOrgao, function(v) {
                return '<option value="' + v.value + '" ' + (v.selected ? v.selected : "") + ">" + v.txt + "</option>";
              }).join("") + "       </select>   </div>" + (typeof txtUsuario !== "undefined" && txtUsuario != "" ? '   <div class="configBoxPro_txtUsuario" style="margin-top:20px">       <label style="margin-bottom: 10px;display: block;">Assinante</label>       <input id="configBoxPro_txtUsuario" type="text" value="' + txtUsuario + '" style="font-size: 10pt; width: 96%;" disabled>   </div>' : "") + '   <div class="configBoxPro_selContexto" style="margin-top:20px">       <label style="margin-bottom: 10px;display: block;">Contexto do Assinante</label>       <select id="configBoxPro_selContexto" style="font-size: 10pt; width: 100%;">' + $.map(selContexto, function(v) {
                return '<option value="' + v.value + '" ' + (v.selected ? v.selected : "") + ">" + v.txt + "</option>";
              }).join("") + '       </select>   </div>   <div class="configBoxPro_selCargoFuncao" style="margin-top:20px">       <label style="margin-bottom: 10px;display: block;">Cargo / Fun\xE7\xE3o</label>       <select id="configBoxPro_selCargoFuncao" style="font-size: 10pt; width: 100%;">' + $.map(selCargoFuncao, function(v) {
                return '<option value="' + v.value + '" ' + (v.selected ? v.selected : "") + ">" + v.txt + "</option>";
              }).join("") + `       </select>   </div>   <div class="configBoxPro_pwdSenha" style="margin-top:20px">       <label style="margin-bottom: 10px;display: block;">Senha</label>       <input id="configBoxPro_pwdSenha" onkeypress="if (event.which == 13) { $(this).closest('.ui-dialog').find('.confirm.ui-button').trigger('click') }" autocomplete="off" type="password" style="font-size: 10pt; width: 96%;">   </div></div>`;
              resetDialogBoxPro("configBoxPro");
              configBoxPro = $("#configBoxPro").html('<div class="configBoxProDiv"> ' + textBox2 + "</span>").dialog({
                width: 450,
                title: "Assinatura em lote",
                open: function() {
                  $("#configBoxPro_selOrgao").chosen({
                    placeholder_text_single: " ",
                    no_results_text: "Nenhum resultado encontrado",
                    normalize_search_text: function(text) {
                      return removeAcentos(text.toLowerCase());
                    }
                  });
                  if (selContexto.length > 0) {
                    $("#configBoxPro_selContexto").chosen({
                      placeholder_text_single: " ",
                      no_results_text: "Nenhum resultado encontrado",
                      normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                      }
                    });
                  } else {
                    $(".configBoxPro_selContexto").hide();
                  }
                  $("#configBoxPro_selCargoFuncao").chosen({
                    placeholder_text_single: " ",
                    disable_search: true,
                    no_results_text: "Nenhum resultado encontrado",
                    normalize_search_text: function(text) {
                      return removeAcentos(text.toLowerCase());
                    }
                  });
                  $('.ui-dialog[aria-describedby="configBoxPro"], #configBoxPro').css("overflow", "visible");
                  $("#configBoxPro_pwdSenha").focus();
                },
                buttons: [{
                  text: "Assinar",
                  class: "confirm ui-state-active",
                  click: function() {
                    loadingButtonConfirm(true);
                    var selOrgaoForm = $("#configBoxPro_selOrgao").val();
                    var selContextoForm = $("#configBoxPro_selContexto").val();
                    var selCargoFuncaoForm = $("#configBoxPro_selCargoFuncao").val();
                    var pwdSenhaForm = $("#configBoxPro_pwdSenha").val();
                    var txtUsuario2 = $("#configBoxPro_txtUsuario").val();
                    loopActionsPro.assinatura = { orgao: selOrgaoForm, usuario: txtUsuario2, contexto: selContextoForm, cargo: selCargoFuncaoForm, senha: pwdSenhaForm };
                    getBatchActionsPro(this_);
                    _this.data("lastclass", _this.find("i").attr("class")).find("i").attr("class", "fas fa-sync fa-spin cinzaColor");
                    resetDialogBoxPro("configBoxPro");
                  }
                }]
              });
            });
          }
        });
      }
    } else if (btnData.action == "documento_alterar" && checkboxList.length > 0 && _parent.find("#iconsActions i.fa-spin").length == 0) {
      var textBox = '<div class="dialogBoxDiv seiProForm">   <select id="configBoxProSigiloBatch" onchange="changeSelectHipoteseLegal(this)" style="font-size: 10pt; width: 100%;">       <option value="0" selected>P\xFAblico</option>       <option value="1">Restrito</option>       <option value="2">Sigiloso</option>   </select>   <div style="margin-top:20px">       <select id="configBoxProSigiloBatch_hipoteses" class="select_hipoteses" style="font-size: 10pt; width: 100%; margin-top:20px;display:none;">       </select>   </div></div>';
      resetDialogBoxPro("configBoxPro");
      configBoxPro = $("#configBoxPro").html('<div class="configBoxProDiv"> ' + textBox + "</span>").dialog({
        width: 450,
        title: "N\xEDvel de acesso",
        open: function() {
          $("#configBoxProSigiloBatch").chosen({
            placeholder_text_single: " ",
            no_results_text: "Nenhum resultado encontrado",
            normalize_search_text: function(text) {
              return removeAcentos(text.toLowerCase());
            }
          });
          $('.ui-dialog[aria-describedby="configBoxPro"], #configBoxPro').css("overflow", "visible");
        },
        buttons: [{
          text: "Editar",
          class: "confirm ui-state-active",
          click: function() {
            loadingButtonConfirm(true);
            var value = $("#configBoxProSigiloBatch").val().trim();
            var hipotese = $("#configBoxProSigiloBatch_hipoteses").val() !== null ? $("#configBoxProSigiloBatch_hipoteses").val().trim() : false;
            var text = value == "0" ? "" : "Acesso " + $("#configBoxProSigiloBatch").find("option:selected").text() + " " + $("#configBoxProSigiloBatch_hipoteses").find("option:selected").text();
            var elementOption = value == "0" ? "optPublico" : false;
            elementOption = value == "2" ? "optSigiloso" : elementOption;
            elementOption = value == "1" ? "optRestrito" : elementOption;
            loopActionsPro.sigilo = { value, hipotese, element: elementOption, text };
            getBatchActionsPro(this_);
            _this.data("lastclass", _this.find("i").attr("class")).find("i").attr("class", "fas fa-sync fa-spin cinzaColor");
            resetDialogBoxPro("configBoxPro");
          }
        }]
      });
    }
  }
  function getBatchActionsPro(this_) {
    var id_documento = loopActionsPro.list[loopActionsPro.index];
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    var _table = _parent.find(".tableDialog");
    var _ifrArvore = $("#ifrArvore");
    var ifrArvore = _ifrArvore.contents();
    var arrayLinksArvoreAll2 = getTreeLinksAllSession();
    var arrayIconsView2 = getTreeIconsViewSession();
    var doc = arrayLinksArvoreAll2.filter(function(v) {
      return v.indexOf("acao=arvore_visualizar") !== -1 && v.indexOf("id_documento=" + id_documento) !== -1;
    });
    if (doc.length > 0) {
      var tr = _table.find('tr[data-index="' + id_documento + '"]');
      td_doc = tr.find("td.documento");
      tr.find("td.documento").prepend('<i class="fas fa-sync fa-spin azulColor batchLoading"></i> ');
      $.ajax({ url: doc[0] }).done(function(html) {
        var id_documento2 = loopActionsPro.list[loopActionsPro.index];
        var $html = $(html);
        var textLink = $html.filter("script").not('[src*="js"]').text();
        var arrayLinksArvoreDoc = getLinksInText(textLink);
        var btnData = _this.data();
        var linkAction = arrayLinksArvoreDoc.filter(function(v) {
          return v.indexOf("acao=" + btnData.action) !== -1;
        });
        linkAction = linkAction.length == 0 ? arrayLinksArvoreAll2.filter(function(v) {
          return v.indexOf("id_documento=" + id_documento2) !== -1 && v.indexOf(btnData.action) !== -1;
        }) : linkAction;
        var listIconsView = arrayIconsView2.length > 0 ? jmespath.search(arrayIconsView2, "[?id_documento==`" + id_documento2 + "`] | [0].icones") : null;
        listIconsView = listIconsView === null ? [] : listIconsView;
        var checkIconView = listIconsView.filter(function(v) {
          return v.indexOf(btnData.icon) !== -1;
        });
        if (btnData.action != "documento_visualizar" && btnData.action != "documento_alterar" && btnData.action != "documento_assinar" && btnData.action != "documento_duplicar" && linkAction.length > 0 && checkIconView.length > 0) {
          $.ajax({ url: linkAction }).done(function(htmlArvore) {
            var dadosProcessoPro2 = pullDadosProcessoSession();
            var id_documento3 = loopActionsPro.list[loopActionsPro.index];
            tr.removeClass("infraTrMarcada").find("i.batchLoading").remove();
            tr.find("td.documento").prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
            tr.find("input").prop("checked", false);
            if (btnData.action == "documento_excluir") {
              tr.removeClass("documento_excluir").find("input").prop("disabled", true);
              tr.find("td.icons").html("");
              ifrArvore3.find("#anchorImg" + id_documento3).prev().remove().end().prev().remove();
              ifrArvore3.find("#anchorImg" + id_documento3 + ", #anchor" + id_documento3 + ",  #anchorUG" + id_documento3 + ', .action-doc[data-id="' + id_documento3 + '"], #anchorCD' + id_documento3).remove();
            } else if (btnData.action == "editor_montar") {
              ifrArvore3.find("#anchorA" + id_documento3).remove();
              tr.find("td.icons").find('a[data-action="editor_montar"]').remove();
              tr.find("td.assinatura").html("");
              tr.find("td.data_assinatura").html("");
            }
            if (btnData.action == "documento_excluir") {
              removeTreeDocumentById(id_documento3, dadosProcessoPro2);
            } else if (btnData.action == "editor_montar") {
              updateTreeDocumentById(id_documento3, {
                assinatura: "",
                data_assinatura: ""
              }, dadosProcessoPro2);
            }
            setSessionProcessosPro(dadosProcessoPro2);
            loopActionsPro.index = loopActionsPro.index + 1;
            if (typeof loopActionsPro.list[loopActionsPro.index] !== "undefined") {
              getBatchActionsPro(this_);
            } else {
              window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
              $(this_).find("i").attr("class", $(this_).data("lastclass"));
              var ifrArvore3 = getIframeArvoreElement();
              if (ifrArvore3 && ifrArvore3.contentWindow) ifrArvore3.contentWindow.location.reload();
              initAppendIconsDocumentosActions();
            }
          });
        } else if (btnData.action == "documento_duplicar" && checkIconView.length > 0) {
          let resetDocsActions2 = function() {
            window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
            $(this_).find("i").attr("class", $(this_).data("lastclass"));
            setTimeout(function() {
              var ifrArvore3 = getIframeArvoreElement();
              if (ifrArvore3 && ifrArvore3.contentWindow) ifrArvore3.contentWindow.location.reload();
              initAppendIconsDocumentosActions();
            }, 1e3);
          };
          var id_documento2 = loopActionsPro.list[loopActionsPro.index];
          if (typeof id_documento2 !== "undefined") {
            console.log(id_documento2, tr[0], loopActionsPro, loopActionsPro, loopActionsPro.index, loopActionsPro.list[loopActionsPro.index]);
            $("#ifrArvore")[0].contentWindow.getDadosDoc(
              $("#ifrArvore").contents().find("#anchor" + id_documento2),
              false,
              false,
              function() {
                tr.removeClass("infraTrMarcada").find("i.batchLoading").remove();
                tr.find("td.documento").prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                tr.find("input").prop("checked", false);
                loopActionsPro.index = loopActionsPro.index + 1;
                console.log(loopActionsPro.list[loopActionsPro.index]);
                getBatchActionsPro(this_);
                if (typeof loopActionsPro.list[loopActionsPro.index] === "undefined") {
                  resetDocsActions2();
                }
              },
              function() {
                tr.find("i.batchLoading").remove();
                tr.find("td.documento").prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
                loopActionsPro.index = loopActionsPro.index + 1;
                console.log(loopActionsPro.list[loopActionsPro.index]);
                getBatchActionsPro(this_);
                if (typeof loopActionsPro.list[loopActionsPro.index] === "undefined") {
                  resetDocsActions2();
                }
              }
            );
          } else if (typeof id_documento2 === "undefined" || typeof loopActionsPro.list[loopActionsPro.index + 1] === "undefined") {
            resetDocsActions2();
          }
        } else if (btnData.action == "documento_assinar" && linkAction.length > 0 && checkIconView.length > 0) {
          var orgao = loopActionsPro.assinatura.orgao;
          var contexto = loopActionsPro.assinatura.contexto;
          var cargo = loopActionsPro.assinatura.cargo;
          var senha = loopActionsPro.assinatura.senha;
          var usuario_assinante = loopActionsPro.assinatura.usuario;
          if ($("#frmCheckerProcessoPro").length == 0) {
            getCheckerProcessoPro();
          }
          $("#frmCheckerProcessoPro").attr("src", linkAction[0]).unbind().on("load", function() {
            var iframe = $(this).contents();
            var usuario = iframe.find("#txtUsuario").val();
            iframe.find("#selOrgao").val(orgao);
            iframe.find("#selContexto").val(contexto);
            iframe.find("#selCargoFuncao").val(cargo);
            iframe.find("#pwdSenha").remove();
            iframe.find("#divAutenticacao").append('<input id="pwdSenha" name="pwdSenha" type="hidden" value="' + senha + '">');
            var assinatura = usuario + " / " + cargo;
            var data_assinatura = moment().format("DD/MM/YYYY HH:mm");
            console.log(loopActionsPro, senha);
            $(this).unbind();
            iframe.find("#btnAssinar").trigger("click");
            $("#frmCheckerProcessoPro").on("load", function() {
              $(this).unbind();
              var _validacao = $(this).contents().find("#txaInfraValidacao");
              if (_validacao.length > 0 && _validacao.val() != "") {
                tr.find("i.batchLoading").remove();
                tr.find("td.documento").prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
                loopActionsPro.index = loopActionsPro.index + 1;
                if (typeof loopActionsPro.list[loopActionsPro.index] !== "undefined") {
                  getBatchActionsPro(this_);
                } else {
                  window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
                  $(this_).find("i").attr("class", $(this_).data("lastclass"));
                  var ifrArvore3 = getIframeArvoreElement();
                  if (ifrArvore3 && ifrArvore3.contentWindow) ifrArvore3.contentWindow.location.reload();
                  initAppendIconsDocumentosActions();
                }
              } else {
                tr.removeClass("infraTrMarcada").find("i.batchLoading").remove();
                tr.find("td.documento").prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                tr.find("td.assinatura").html(assinatura);
                tr.find("td.data_assinatura").html(data_assinatura);
                tr.find("input").prop("checked", false);
                var dadosProcessoPro2 = pullDadosProcessoSession();
                updateTreeDocumentById(id_documento2, {
                  assinatura,
                  data_assinatura
                }, dadosProcessoPro2);
                setSessionProcessosPro(dadosProcessoPro2);
                loopActionsPro.index = loopActionsPro.index + 1;
                if (typeof loopActionsPro.list[loopActionsPro.index] !== "undefined") {
                  getBatchActionsPro(this_);
                } else {
                  window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
                  $(this_).find("i").attr("class", $(this_).data("lastclass"));
                  setTimeout(function() {
                    var ifrArvore4 = getIframeArvoreElement();
                    if (ifrArvore4 && ifrArvore4.contentWindow) ifrArvore4.contentWindow.location.reload();
                    initAppendIconsDocumentosActions();
                  }, 1e3);
                }
              }
            });
          });
        } else if (btnData.action == "documento_visualizar" && linkAction.length > 0 && checkIconView.length > 0) {
          var id_documento2 = loopActionsPro.list[loopActionsPro.index];
          if (typeof id_documento2 !== "undefined") {
            console.log("*****", loopActionsPro);
            var urlLink = linkAction[0];
            var link = document.createElement("a");
            link.href = urlLink;
            if (urlLink.indexOf("documento_download_anexo") === -1) {
              link.download = ifrArvore2.find("#anchor" + id_documento2).text().trim() + ".html";
            } else {
              link.download = ifrArvore2.find("#anchor" + id_documento2).text().trim();
            }
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            tr.removeClass("infraTrMarcada").find("i.batchLoading").remove();
            tr.find("td.documento").prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
            tr.find("input").prop("checked", false);
            loopActionsPro.index = loopActionsPro.index + 1;
            if (typeof loopActionsPro.list[loopActionsPro.index] !== "undefined") {
              getBatchActionsPro(this_);
            } else {
              window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
              $(this_).find("i").attr("class", $(this_).data("lastclass"));
            }
          } else if (typeof id_documento2 === "undefined" || typeof loopActionsPro.list[loopActionsPro.index + 1] === "undefined") {
            resetDocsActions();
          }
        } else if (btnData.action == "documento_alterar" && linkAction.length > 0 && checkIconView.length > 0) {
          var idElement = loopActionsPro.sigilo.element;
          var hipotese = loopActionsPro.sigilo.hipotese;
          var text_hipotese = loopActionsPro.sigilo.text;
          if ($("#frmCheckerProcessoPro").length == 0) {
            getCheckerProcessoPro();
          }
          $("#frmCheckerProcessoPro").attr("src", linkAction[0]).unbind().on("load", function() {
            var iframe = $(this).contents();
            var element = iframe.find("#" + idElement);
            element.prop("checked", true).trigger("change");
            if (idElement == "optRestrito" || idElement == "optSigiloso") {
              iframe.find("#selHipoteseLegal").after('<input id="selHipoteseLegal" value="' + hipotese + '" name="selHipoteseLegal"></input>').remove();
            }
            $(this).unbind();
            if (iframe.find('button[type="submit"]').length > 0) {
              iframe.find('button[type="submit"]').trigger("click");
            } else {
              iframe.find('button[name="btnSalvar"]').trigger("click");
            }
            tr.removeClass("infraTrMarcada").find("i.batchLoading").remove();
            tr.find("td.documento").prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
            tr.find("td.sigilo").html(text_hipotese);
            tr.find("input").prop("checked", false);
            var dadosProcessoPro2 = pullDadosProcessoSession();
            updateTreeDocumentById(id_documento2, {
              sigilo: text_hipotese
            }, dadosProcessoPro2);
            setSessionProcessosPro(dadosProcessoPro2);
            loopActionsPro.index = loopActionsPro.index + 1;
            if (typeof loopActionsPro.list[loopActionsPro.index] !== "undefined") {
              getBatchActionsPro(this_);
            } else {
              window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
              $(this_).find("i").attr("class", $(this_).data("lastclass"));
              initAppendIconsDocumentosActions();
            }
          });
        } else {
          tr.find("i.batchLoading").remove();
          tr.find("td.documento").prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
          loopActionsPro.index = loopActionsPro.index + 1;
          if (typeof loopActionsPro.list[loopActionsPro.index] !== "undefined") {
            getBatchActionsPro(this_);
          } else {
            window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
            $(this_).find("i").attr("class", $(this_).data("lastclass"));
            var ifrArvore2 = getIframeArvoreElement();
            if (ifrArvore2 && ifrArvore2.contentWindow) ifrArvore2.contentWindow.location.reload();
            initAppendIconsDocumentosActions();
          }
        }
      });
    }
  }
  function getDocumentosActions() {
    getListDocumentosArvore($("#ifrArvore").contents());
    var dadosProcesso = pullDadosProcessoSession();
    var listDocumentos = getTreeDocumentsSession(dadosProcesso);
    var htmlBox = `<div id="iconsActions">   <a class="newLink documento_ciencia" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Ci\xEAncia')" data-action="documento_ciencia" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "ciencia" : "sei_ciencia") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-thumbs-up azulColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a>   <a class="newLink documento_visualizar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Baixar documento')" data-action="documento_visualizar" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "consultar_alterar_protocolo" : "sei_consultar_alterar_protocolo") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-download azulColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a>   <a class="newLink documento_excluir" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Excluir')" data-action="documento_excluir" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "protocolo_excluir" : "sei_lixeira") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-trash-alt vermelhoColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a>   <a class="newLink documento_alterar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Alterar Sigilo')" data-action="documento_alterar" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "documento_alterar" : "sei_consultar_alterar_protocolo") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-key laranjaColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a>   <a class="newLink documento_assinar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Assinar')" data-action="documento_assinar" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "documento_assinar" : "sei_assinar") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-pen-alt laranjaColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a>   <a class="newLink editor_montar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Cancelar Assinatura')" data-action="editor_montar" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "documento_editar_conteudo" : "sei_editar_conteudo") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-ban vermelhoColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a>   <a class="newLink documento_duplicar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Duplicar Documento')" data-action="documento_duplicar" data-icon="` + (SeiPro.sei.adapter.isNewSEI() ? "documento_alterar" : "sei_consultar_alterar_protocolo") + `">       <span class="fa-layers fa-fw">           <i class="fas fa-copy azulColor"></i>           <span class="fa-layers-counter" style="display:none">1</span>       </span>   </a></div><div id="boxActions" class="tabelaPanelScroll" style="margin-top: 10px;height: 550px;">   <table id="actionsTablePro" style="font-size: 8pt !important;width: 100%;" class="seiProForm tabelaControle tableDialog tableInfo tableZebra">        <thead>            <tr class="tableHeader" onmouseout="infraTooltipOcultar();">                <th class="tituloControle" style="text-align: center;width: 50px;"><span class="lblInfraCheck" aria-hidden="true"></span><a style="text-align: center; display: block;" id="lnkInfraCheck" onclick="setSelectAllTr(this, 'SemGrupo');"><img src="/infra_css/` + (SeiPro.sei.adapter.isNewSEI() ? "svg/check.svg" : "imagens/check.gif") + '" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>                <th class="tituloControle" style="text-align: center;">N\xBA SEI</th>                <th class="tituloControle" style="text-align: center;">Documento</th>                <th class="tituloControle" style="text-align: center;">Assinatura</th>                <th class="tituloControle" style="text-align: center;">Data da Assinatura</th>                <th class="tituloControle" style="text-align: center;">Data do Documento</th>                <th class="tituloControle" style="text-align: center;">Unidade</th>                <th class="tituloControle" style="text-align: center;">Sigilo</th>                <th class="tituloControle" style="text-align: center; width: 140px;">A\xE7\xF5es</th>            </tr>        </thead>        <tbody>';
    if (listDocumentos) {
      $.each(listDocumentos, function(i2, v) {
        htmlBox += '   <tr style="text-align: left;" data-tagname="SemGrupo" data-index="' + v.id_protocolo + '">       <td style="text-align: center;">           <input type="checkbox" onclick="followSelecionarItens(this)" name="actionsPro" value="' + v.id_protocolo + '">       </td>       <td>' + v.nr_sei + '</td>       <td class="documento"><a class="newLink" onclick="getDocOnArvore(' + v.id_protocolo + ')" style="display: initial;font-size: 10pt;text-decoration: underline;"><i class="far fa-file azulColor" style="margin-right: 5px;"></i>' + v.documento + '</a></td>       <td class="assinatura">' + v.assinatura + '</td>       <td class="data_assinatura"></td>       <td class="data_documento">' + (v.data_documento ? moment(v.data_documento, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") : "") + '</td>       <td class="unidade"></td>       <td class="sigilo">' + v.sigilo + '</td>       <td class="icons"></td>   </tr>';
      });
    }
    htmlBox += "   </table></div>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "A\xE7\xF5es em lote",
      width: $("body").width() - 300,
      height: 650,
      resize: function(event2, ui) {
        setTabelaPanelScrollHeight("#boxActions", 80);
      },
      open: function() {
        if (typeof $().chosen === "undefined" && typeof URL_SPRO !== "undefined") $.getScript(URL_SPRO + "js/lib/chosen.jquery.min.js");
        alertaBoxPro("Sucess", "sync fa-spin", "Aguarde... Pesquisando links de documentos");
        var urlAllPasta = $("#ifrArvore").contents().find('#topmenu a[id*="anchorAP"]').attr("href");
        if (typeof urlAllPasta !== "undefined" && urlAllPasta !== "") {
          $("#ifrArvore").attr("src", urlAllPasta).unbind().on("load", function() {
            $(this).unbind();
            getListDocumentosArvore($("#ifrArvore").contents());
            resetDialogBoxPro("alertBoxPro");
          });
        } else {
          getAllLinksFolder();
        }
        setTabelaPanelScrollHeight("#boxActions", 80);
        initAppendIconsDocumentosActions();
        mergeAllAndamentosProcesso(function() {
          var actionsTable = $("#actionsTablePro");
          var listDocumentos2 = getTreeDocumentsSession(dadosProcessoPro);
          if (listDocumentos2.length > 0) {
            actionsTable.find("tbody tr").each(function() {
              var id_protocolo = $(this).data("index");
              var values = jmespath.search(listDocumentos2, "[?id_protocolo=='" + id_protocolo + "'] | [0]");
              if (values !== null) {
                $(this).find("td.unidade").text(values.unidade ? values.unidade : "");
                $(this).find("td.data_assinatura").text(values.assinado && values.data_assinatura ? moment(values.data_assinatura, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") : "");
                if (values.data_documento) {
                  $(this).find("td.data_documento").text(moment(values.data_documento, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm"));
                }
              }
            }).trigger("update");
          }
          resetDialogBoxPro("alertBoxPro");
        });
        window.loopActionsPro = { list: [], index: 0, sigilo: {}, assinatura: {} };
      },
      close: function() {
        $("#boxActions").remove();
        resetDialogBoxPro("dialogBoxPro");
        resetDialogBoxPro("alertBoxPro");
      }
    });
    setTimeout(function() {
      var actionsTable = $("#actionsTablePro");
      actionsTable.tablesorter({
        sortLocaleCompare: true,
        textExtraction: {
          4: function(elem, table, cellIndex) {
            var text_date = $(elem).text() != "" ? moment($(elem).text(), "DD/MM/YYYY").format("YYYY-MM-DD") : false;
            return text_date;
          },
          5: function(elem, table, cellIndex) {
            var text_date = $(elem).text() != "" ? moment($(elem).text(), "DD/MM/YYYY").format("YYYY-MM-DD") : false;
            return text_date;
          },
          8: function(elem, table, cellIndex) {
            var sort = $(elem).find("a").map(function() {
              return $(this).data("action");
            }).get().join(" ");
            return sort;
          }
        },
        widgets: ["saveSort", "filter"],
        widgetOptions: {
          saveSort: true,
          filter_hideFilters: true,
          filter_columnFilters: true,
          filter_saveFilters: true,
          filter_hideEmpty: true,
          filter_excludeFilter: {}
        },
        sortReset: true,
        headers: {
          0: { sorter: false, filter: false },
          1: { filter: true },
          2: { filter: true },
          3: { filter: true },
          4: { filter: true },
          6: { filter: true },
          5: { filter: true }
        }
      }).on("filterEnd", function(event2, data) {
        checkboxRangerSelectShift();
        var caption = $(this).find("caption").eq(0);
        var tx2 = caption.text();
        caption.text(tx2.replace(/\d+/g, data.filteredRows));
        $(this).find("tbody > tr:visible > td > input").prop("disabled", false);
        $(this).find("tbody > tr:hidden > td > input").prop("disabled", true);
      });
      var filterAction = actionsTable.find(".tablesorter-filter-row").get(0);
      if (typeof filterAction !== "undefined") {
        var observerFilterAction = new MutationObserver(function(mutations) {
          var _this = $(mutations[0].target);
          var _parent = _this.closest("table");
          var iconFilter = _parent.find(".filterTableActions button");
          var checkIconFilter = iconFilter.hasClass("active");
          var hideme = _this.hasClass("hideme");
          if (hideme && checkIconFilter) {
            iconFilter.removeClass("active");
          }
        });
        var observerTableActions = new MutationObserver(function(mutations) {
          var _this = $(mutations[0].target);
          var _parent = _this.closest("table");
          function updateCountIcon(_parent2, class_icon) {
            var counter = _parent2.find("tr.infraTrMarcada." + class_icon).length;
            if (counter > 0) {
              $("#iconsActions").find("." + class_icon).find(".fa-layers-counter").text(counter).show();
            } else {
              $("#iconsActions").find("." + class_icon).find(".fa-layers-counter").hide();
            }
          }
          updateCountIcon(_parent, "documento_visualizar");
          updateCountIcon(_parent, "documento_ciencia");
          updateCountIcon(_parent, "documento_excluir");
          updateCountIcon(_parent, "documento_alterar");
          updateCountIcon(_parent, "documento_assinar");
          updateCountIcon(_parent, "editor_montar");
          updateCountIcon(_parent, "documento_duplicar");
        });
        setTimeout(function() {
          var htmlFilterActions = '<div class="btn-group filterTableActions" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       <span class="text">Baixar</span>   </button>   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       <span class="text">Copiar</span>   </button>   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (actionsTable.find("tr.tablesorter-filter-row").hasClass("hideme") ? "" : "active") + '">       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       Pesquisar   </button></div>';
          actionsTable.find("thead .filterTableActions").remove();
          actionsTable.find("thead").prepend(htmlFilterActions);
          observerFilterAction.observe(filterAction, {
            attributes: true
          });
          actionsTable.find("tbody tr").each(function() {
            observerTableActions.observe(this, {
              attributes: true
            });
          });
          checkboxRangerSelectShift();
        }, 1e3);
      }
    }, 500);
    if (typeof $().visible == "undefined") $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
  }
  function setTabelaPanelScrollHeight(target, padding) {
    var availableHeight = $("#dialogBoxPro").outerHeight(true) - padding;
    $(target).css({ "max-height": availableHeight, "height": availableHeight, "min-height": availableHeight });
  }
  function initAppendIconsDocumentosActions(TimeOut = 3e3) {
    if (TimeOut <= 0) {
      setAppendIconsDocumentosActions();
      return;
    }
    var arrayIconsView2 = getTreeIconsViewSession();
    if (typeof arrayIconsView2 !== "undefined" && arrayIconsView2.length >= $("#actionsTablePro").find("tbody tr").length) {
      setAppendIconsDocumentosActions();
    } else {
      setTimeout(function() {
        initAppendIconsDocumentosActions(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initAppendIconsDocumentosActions => " + TimeOut);
      }, 500);
    }
  }
  function setAppendIconsDocumentosActions() {
    var actionsTable = $("#actionsTablePro");
    var _ifrArvore = $("#ifrArvore");
    var arrayIconsView2 = getTreeIconsViewSession();
    var dadosProcesso = pullDadosProcessoSession();
    var listDocumentos = getTreeDocumentsSession(dadosProcesso);
    actionsTable.find("tbody tr").each(function() {
      var id_documento = $(this).data("index");
      var td_icon = $(this).find("td.icons");
      var iconList = jmespath.search(arrayIconsView2, "[?id_documento==`" + id_documento + "`] | [0].icones");
      var dataDocumento = listDocumentos.length > 0 ? jmespath.search(listDocumentos, "[?id_protocolo=='" + id_documento + "'] | [0]") : null;
      var htmlIcon = "";
      var classIcon = "";
      if (iconList !== null) {
        if (iconList.filter(function(v) {
          return v.indexOf("sei_lixeira") !== -1 || v.indexOf("protocolo_excluir") !== -1;
        }).length > 0) {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_excluir" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Excluir')" style="margin: 0;padding: 5px 0;"><i class="fas fa-trash-alt vermelhoColor"></i></a>`;
          classIcon += "documento_excluir ";
        }
        if (iconList.filter(function(v) {
          return v.indexOf("ciencia") !== -1;
        }).length > 0) {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_ciencia" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Ci\xEAncia')" style="margin: 0;padding: 5px 0;"><i class="fas fa-thumbs-up azulColor"></i></a>`;
          classIcon += "documento_ciencia ";
        }
        if (iconList.filter(function(v) {
          return v.indexOf("consultar") !== -1;
        }).length > 0) {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_visualizar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Baixar documento')" style="margin: 0;padding: 5px 0;"><i class="fas fa-download azulColor"></i></a>`;
          classIcon += "documento_visualizar ";
        }
        if (iconList.filter(function(v) {
          return v.indexOf("sei_consultar_alterar_protocolo") !== -1 || v.indexOf("documento_alterar") !== -1;
        }).length > 0) {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_alterar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Alterar sigilo')" style="margin: 0;padding: 5px 0;"><i class="fas fa-key laranjaColor"></i></a>`;
          classIcon += "documento_alterar ";
        }
        if (iconList.filter(function(v) {
          return v.indexOf("sei_assinar") !== -1 || v.indexOf("documento_assinar") !== -1;
        }).length > 0) {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_assinar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Assinar')" style="margin: 0;padding: 5px 0;"><i class="fas fa-pen-alt laranjaColor"></i></a>`;
          classIcon += "documento_assinar ";
        }
        if (iconList.filter(function(v) {
          return v.indexOf("sei_editar_conteudo") !== -1 || v.indexOf("sei_assinar") !== -1 || v.indexOf("documento_assinar") !== -1 || v.indexOf("documento_editar_conteudo") !== -1;
        }).length > 1 && dataDocumento !== null && typeof dataDocumento.assinatura !== "undefined" && dataDocumento.assinatura != "") {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="editor_montar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Cancelar Assinatura')" style="margin: 0;padding: 5px 0;"><i class="fas fa-ban vermelhoColor"></i></a>`;
          classIcon += "editor_montar ";
        }
        if (iconList.filter(function(v) {
          return v.indexOf("sei_consultar_alterar_protocolo") !== -1 || v.indexOf("documento_alterar") !== -1;
        }).length > 0) {
          htmlIcon += ` <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_duplicar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Duplicar Documento')" style="margin: 0;padding: 5px 0;"><i class="fas fa-copy azulColor"></i></a>`;
          classIcon += "documento_duplicar ";
        }
      }
      td_icon.html(htmlIcon);
      $(this).addClass(classIcon);
    }).trigger("update");
  }
  function batchActionsSinglePro(this_) {
    var _this = $(this_);
    var _table = _this.closest("table");
    var action = _this.data("action");
    _table.find('thead th a[onclick*="setSelectAllTr"]').data("index", 1).trigger("click");
    _this.closest("tr").find("input[type=checkbox]").trigger("click");
    $("#iconsActions").find("a." + action).trigger("click");
  }
  function copyLinkProcesso(this_) {
    var _this = $(this_);
    var id_procedimento = _this.data("id_procedimento");
    var linkProc = parent.url_host + "?acao=procedimento_trabalhar&id_procedimento=" + id_procedimento;
    copyToClipboard(linkProc);
    _this.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  }
  function getDocsArvore_fillSelect(select, optionBlank = false, disableId = false, docExternoDisable = true, docExternoOnlyPDF = false) {
    let idRef = $("#ifrArvore").contents().find("#content .infraArvoreNoSelecionado").attr("id");
    idRef = typeof idRef !== "undefined" ? idRef.replace("span", "") : false;
    let resultado = optionBlank ? '<option value="">&nbsp;</option>' : "";
    let contadorDocsValidos = 0;
    dataDocs.forEach((doc) => {
      if (doc.cancelado || docExternoDisable && doc.externo || !docExternoDisable && doc.externo && docExternoOnlyPDF && !/pdf/i.test(doc.image) || !doc.src || disableId == doc.id_documento) {
        resultado += `<option value="${doc.nome}" data-nr_sei="${doc.numero}" data-id_procedimento="${doc.id_procedimento}" data-id_documento="${doc.id_documento}" disabled title="Documento n\xE3o v\xE1lido">${doc.nome}</option>`;
      } else {
        let selected = idRef.toString() == doc.id_documento.toString() ? "selected" : "";
        resultado += `<option value="${doc.nome}" data-nr_sei="${doc.numero}" data-id_procedimento="${doc.id_procedimento}" data-id_documento="${doc.id_documento}" ${selected}>${doc.nome}</option>`;
        contadorDocsValidos++;
      }
    });
    if (contadorDocsValidos === 0) {
      select.after(`<small class="noFieldsError">N\xE3o h\xE1 documentos v\xE1lidos<small>`);
    } else {
      select.removeAttr("disabled");
      select.children().remove();
      select.append(resultado);
    }
    select.trigger("chosen:updated");
    $("#" + select.attr("id") + "_chosen").removeClass("chosenLoading");
  }
  function getDocsArvore(select = false, callback_end = false, callback_done = false, optionBlank = false, disableId = false) {
    dataDocs = [];
    const urlBtnExpandirPastas = $("#ifrArvore").contents().find("[id^='anchorAP']").attr("href");
    const urlArvore = $("#ifrArvore").attr("src");
    const urlBusca = urlBtnExpandirPastas ? urlBtnExpandirPastas : urlArvore;
    const id_procedimento = getParamsUrlPro(urlArvore).id_procedimento ?? false;
    $.get(urlBusca).done((htmlArvore) => {
      dataDocs = setDataDocs(htmlArvore, id_procedimento);
      if (typeof callback_end === "function") callback_end(select, optionBlank, disableId);
    }).then(() => {
      if (typeof callback_done === "function") callback_done();
    });
  }
  function setDataDocs(htmlArvore, id_procedimento) {
    let listDocs = [];
    const lines = htmlArvore.split("\n");
    const pattern1 = /^Nos\[\d{1,}\] = new infraArvoreNo\("DOCUMENTO/i;
    const pattern2 = /^Nos\[\d{1,}\]\.src = 'controlador/i;
    lines.forEach((line) => {
      if (pattern1.test(line)) {
        const nrNo = line.substring(1, line.indexOf("]")).match(/\d{1,}/)[0];
        const props = line.slice(line.indexOf("(") + 1, line.lastIndexOf(")")).replaceAll(`"`, ``).replaceAll(`\\\\`).split(",");
        const split_doc = line.split('"');
        if (props[17]) {
          listDocs.push({
            nrNo,
            nome: `${props[5]},${props[6]}`,
            numero: SeiPro.sei.adapter.isNewSEI() ? split_doc[25] : split_doc[21],
            id_documento: split_doc[3],
            cancelado: props[7].startsWith("Documento Cancelado") ? true : false,
            externo: props[9].includes("documento_interno") || /email/i.test(split_doc[15]) ? false : true,
            image: split_doc[15],
            id_procedimento
          });
        } else {
          listDocs.push({
            nrNo,
            nome: props[5],
            numero: SeiPro.sei.adapter.isNewSEI() ? split_doc[25] : split_doc[21],
            id_documento: split_doc[3],
            cancelado: props[6].startsWith("Documento Cancelado") ? true : false,
            externo: props[9].includes("documento_interno") || /email/i.test(split_doc[15]) ? false : true,
            image: split_doc[15],
            id_procedimento
          });
        }
      }
    });
    lines.forEach((line) => {
      if (pattern2.test(line)) {
        const nrNo = line.substring(1, line.indexOf("]")).match(/\d{1,}/)[0];
        const src = line.substring(line.indexOf(`'`) + 1, line.lastIndexOf(`'`));
        const docMatched = listDocs.find((dataDoc) => dataDoc.nrNo === nrNo);
        listDocs[listDocs.indexOf(docMatched)] = { ...docMatched, src };
      }
    });
    return listDocs;
  }
  function setCapaProcesso(loop = true) {
    var ifrArvore = $("#ifrArvore").contents();
    var _ifrConteudoViz = $("#ifrConteudoVisualizacao");
    var ifrVisualizacao2 = _ifrConteudoViz.length ? _ifrConteudoViz.contents().find("#ifrVisualizacao").contents() : $($ifrVisualizacao).contents();
    var dadosProcessoSession = pullDadosProcessoSession();
    var prop = dadosProcessoSession ? dadosProcessoSession.propProcesso : dadosProcessoPro.propProcesso;
    var _urlParamsCapa = getParamsUrlPro(window.location.href);
    var id_procedimento = typeof prop !== "undefined" && typeof prop.hdnIdProcedimento !== "undefined" ? prop.hdnIdProcedimento : _urlParamsCapa.id_procedimento || _urlParamsCapa.id_protocolo;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
    var hipoteseLegal = typeof prop !== "undefined" && typeof prop.rdoNivelAcesso !== "undefined" && prop.rdoNivelAcesso == "1" ? jmespath.search(prop.selHipoteseLegal_select, "[?id=='" + prop.selHipoteseLegal + "'] | [0].name") : null;
    hipoteseLegal = hipoteseLegal == null ? "" : hipoteseLegal;
    var dataNivelAcesso = typeof prop !== "undefined" && typeof prop.rdoNivelAcesso !== "undefined" && prop.rdoNivelAcesso == "0" ? { name: "P\xFAblico", icon: "fas fa-globe-americas" } : false;
    dataNivelAcesso = typeof prop !== "undefined" && typeof prop.rdoNivelAcesso !== "undefined" && prop.rdoNivelAcesso == "1" ? { name: "Restrito: " + hipoteseLegal, icon: "fas fa-lock" } : dataNivelAcesso;
    dataNivelAcesso = typeof prop !== "undefined" && typeof prop.rdoNivelAcesso !== "undefined" && prop.rdoNivelAcesso == "2" ? { name: "Sigiloso", icon: "fas fa-user-slash" } : dataNivelAcesso;
    var infoProcNode = ifrVisualizacao2.find("#divArvoreInformacao, #divInformacao").get(0);
    var coverContainer = ifrVisualizacao2.find("#divArvoreHtml");
    var coverPresent = coverContainer.length > 0;
    var rootSelected = !!(id_procedimento && ifrArvore.find("#span" + id_procedimento).hasClass("infraArvoreNoSelecionado"));
    var capaReady = !!prop && !!id_procedimento && coverPresent;
    var capaProgress = (prop ? 1 : 0) + (id_procedimento ? 1 : 0) + (coverPresent ? 1 : 0);
    if (loop && typeof nudgeOnce === "function") {
      nudgeOnce("__SEI_PRO_CAPA_NUDGE__", ["sei-pro-process-session-updated"], function() {
        setCapaProcesso(true);
      });
    }
    function retryCapaProcesso(reason) {
      if (!loop || typeof retryWithProgress !== "function") return;
      retryWithProgress({
        bag: window.__SEI_PRO_CAPA_PROCESSO_RETRY__ || (window.__SEI_PRO_CAPA_PROCESSO_RETRY__ = {}),
        key: id_procedimento || "pending",
        progress: capaProgress,
        reason,
        run: function() {
          setCapaProcesso(true);
        },
        onGiveUp: function(info) {
          console.warn("[SEI Pro]", "setCapaProcesso: retry limit reached for", info.key, "reason=", info.reason, "progress=", info.progress + "/3", "elapsed=", info.elapsed + "ms");
        }
      });
    }
    if (!capaReady) {
      if (ifrVisualizacao2.length === 0 && $("#ifrConteudoVisualizacao").length === 0 && $($ifrVisualizacao).length === 0 && ifrArvore.length === 0) {
        return;
      }
      if (!coverPresent && ifrVisualizacao2.length > 0 && !rootSelected && ifrArvore.find(".infraArvoreNoSelecionado").length > 0) {
        return;
      }
      var capaMissing = [];
      if (!prop) capaMissing.push("prop(dadosProcessoSession)");
      if (!id_procedimento) capaMissing.push("id_procedimento");
      if (!coverPresent) capaMissing.push("capaContainer(#divArvoreHtml)");
      retryCapaProcesso("n\xE3o pronto: faltando " + capaMissing.join(", "));
      return;
    }
    var checkBlocoInterno = typeof $("#ifrArvore")[0] !== "undefined" && typeof $("#ifrArvore")[0].contentWindow.selectedItensPanelArvore !== "undefined" && $.inArray("Bloco Interno", jmespath.search($("#ifrArvore")[0].contentWindow.selectedItensPanelArvore, "[]")) !== -1 ? true : false;
    var blocoProcesso = checkBlocoInterno ? initBlocoProcessoHistorico() : false;
    var dadosProcessoP = dadosProcessoSession || false;
    var descBlocoInterno = typeof blocoProcesso !== "undefined" && blocoProcesso !== null ? typeof blocoProcesso !== "undefined" && blocoProcesso.length > 0 && typeof blocoProcesso[0].descricao !== "undefined" ? blocoProcesso[0].descricao : false : false;
    descBlocoInterno = typeof blocoProcesso !== "undefined" && blocoProcesso !== null && blocoProcesso.length == 0 && typeof dadosProcessoP.listAndamento !== "undefined" && dadosProcessoP.listAndamento.historico_completo ? "Nenhum bloco localizado" : descBlocoInterno;
    var htmlMarcador = getHtmlMarcador(id_procedimento, false);
    var iconMarcador = htmlMarcador.icon;
    var linkPrazo = htmlMarcador.prazo;
    var dataMarcador = htmlMarcador.data;
    var capaDoc = ifrVisualizacao2[0] || document;
    function bindTooltip(el, text) {
      if (!el || !text) return el;
      el.title = text;
      el.setAttribute("aria-label", text);
      el.addEventListener("mouseenter", function() {
        if (typeof parent.infraTooltipMostrar === "function") parent.infraTooltipMostrar(text);
      });
      el.addEventListener("focus", function() {
        if (typeof parent.infraTooltipMostrar === "function") parent.infraTooltipMostrar(text);
      });
      el.addEventListener("mouseleave", function() {
        if (typeof parent.infraTooltipOcultar === "function") parent.infraTooltipOcultar();
      });
      el.addEventListener("blur", function() {
        if (typeof parent.infraTooltipOcultar === "function") parent.infraTooltipOcultar();
      });
      return el;
    }
    function createButton(opts) {
      var btn = capaDoc.createElement("button");
      btn.type = "button";
      btn.className = "newLink capaProcessoAction" + (opts && opts.className ? " " + opts.className : "");
      if (opts && opts.html) {
        btn.innerHTML = opts.html;
      } else {
        if (opts && opts.iconClass) {
          var icon = capaDoc.createElement("i");
          icon.className = opts.iconClass;
          btn.appendChild(icon);
          if (opts.text) btn.appendChild(capaDoc.createTextNode(" "));
        }
        if (opts && opts.text) {
          btn.appendChild(capaDoc.createTextNode(opts.text));
        }
      }
      bindTooltip(btn, opts && opts.tooltip ? opts.tooltip : "");
      return btn;
    }
    function createField(labelIconClass, labelText) {
      var field = capaDoc.createElement("div");
      field.className = "field";
      var label = capaDoc.createElement("div");
      label.className = "label txt_cinza";
      if (labelIconClass) {
        var icon = capaDoc.createElement("i");
        icon.className = labelIconClass + " iconDadosProcesso";
        label.appendChild(icon);
      }
      if (labelText) label.appendChild(capaDoc.createTextNode(labelText));
      var data = capaDoc.createElement("div");
      data.className = "data";
      field.appendChild(label);
      field.appendChild(data);
      return { field, data, label };
    }
    function appendValueButton(data, value, tooltip, clickHandler, opts) {
      var btn = createButton({
        text: value,
        html: opts && opts.html ? opts.html : "",
        iconClass: opts && opts.iconClass ? opts.iconClass : "",
        className: opts && opts.className ? opts.className : "",
        tooltip
      });
      if (clickHandler) btn.addEventListener("click", clickHandler);
      data.appendChild(btn);
      return btn;
    }
    function appendHtml(data, html) {
      if (!html) return null;
      var span = capaDoc.createElement("span");
      span.innerHTML = html;
      data.appendChild(span);
      return span;
    }
    function appendLineButton(data, text, tooltip, clickHandler, opts) {
      return appendValueButton(data, text, tooltip, clickHandler, opts || {});
    }
    var capaRoot = capaDoc.createElement("div");
    capaRoot.id = "capaProcessoPro";
    if (SeiPro.sei.adapter.isNewSEI()) capaRoot.className = "newSEI_capaProcessoPro";
    var infoSide = capaDoc.createElement("div");
    infoSide.style.cssText = "float:right;max-width:40%;";
    var qrcapa = capaDoc.createElement("div");
    qrcapa.className = "qrcapa";
    bindTooltip(qrcapa, "Aponte a c\xE2mera para abrir o processo em seu celular");
    infoSide.appendChild(qrcapa);
    var infocapa = capaDoc.createElement("div");
    infocapa.className = "infocapa";
    if (infoProcNode) {
      infocapa.appendChild(infoProcNode.cloneNode(true));
    }
    infoSide.appendChild(infocapa);
    capaRoot.appendChild(infoSide);
    var historyField = createField(null, "");
    historyField.data.style.cssText = "margin: 10px 0;";
    var historyBtn = createButton({
      iconClass: "fas fa-history azulColor iconDadosProcesso",
      text: "Hist\xF3rico de tramita\xE7\xE3o do processo",
      tooltip: "Abrir hist\xF3rico de tramita\xE7\xE3o do processo"
    });
    historyBtn.addEventListener("click", function(ev) {
      ev.preventDefault();
      if (typeof parent.initGanttHistoryProc === "function") parent.initGanttHistoryProc();
    });
    historyField.data.appendChild(historyBtn);
    capaRoot.appendChild(historyField.field);
    var processoField = createField("fas fa-scroll azulColor", "Processo:");
    if (typeof prop !== "undefined" && typeof prop.hdnProtocoloFormatado !== "undefined") {
      appendLineButton(processoField.data, prop.hdnProtocoloFormatado, "Clique para copiar", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      }, { className: "capaProcessoTextAction" });
      var linkBtn = createButton({
        iconClass: "fas fa-link iconDadosProcesso",
        tooltip: "Clique para copiar o link do processo",
        className: "capaProcessoLink"
      });
      linkBtn.dataset.id_procedimento = id_procedimento;
      linkBtn.addEventListener("click", function(ev) {
        ev.preventDefault();
        if (typeof parent.copyLinkProcesso === "function") parent.copyLinkProcesso(this);
      });
      processoField.data.appendChild(linkBtn);
    }
    capaRoot.appendChild(processoField.field);
    var autuacaoField = createField("fas fa-calendar-check azulColor", "Data de Autua\xE7\xE3o:");
    if (typeof prop !== "undefined" && typeof prop.hdnDtaGeracao !== "undefined") {
      appendLineButton(autuacaoField.data, prop.hdnDtaGeracao, "Clique para copiar", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      }, { className: "capaProcessoTextAction" });
    }
    capaRoot.appendChild(autuacaoField.field);
    var tipoField = createField("fas fa-inbox azulColor", "Tipo do Processo:");
    if (typeof prop !== "undefined" && typeof prop.hdnNomeTipoProcedimento !== "undefined") {
      appendLineButton(tipoField.data, prop.hdnNomeTipoProcedimento, "Clique para copiar", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      }, { className: "capaProcessoTextAction" });
    }
    capaRoot.appendChild(tipoField.field);
    var especificacaoField = createField("fas fa-comment-dots azulColor", "Especifica\xE7\xE3o:");
    if (typeof prop !== "undefined" && typeof prop.txtDescricao !== "undefined") {
      var descricao = String(prop.txtDescricao || "");
      var urgente = descricao.toLowerCase().indexOf("(urgente)") !== -1;
      var descricaoBtn = createButton({
        className: "capaProcessoTextAction" + (urgente ? " urgentePro" : ""),
        tooltip: "Clique para copiar"
      });
      if (urgente) {
        var urg = capaDoc.createElement("span");
        urg.className = "urgentePro";
        urg.setAttribute("aria-hidden", "true");
        descricaoBtn.appendChild(urg);
      }
      descricaoBtn.appendChild(capaDoc.createTextNode(descricao));
      descricaoBtn.addEventListener("click", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      });
      especificacaoField.data.appendChild(descricaoBtn);
    }
    capaRoot.appendChild(especificacaoField.field);
    var assuntosField = createField("fas fa-bookmark azulColor", "Assuntos:");
    if (typeof prop !== "undefined" && typeof prop.selAssuntos !== "undefined") {
      $.each(prop.selAssuntos, function(i2, v) {
        appendLineButton(assuntosField.data, v, "Clique para copiar", function() {
          if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
        }, { className: "capaProcessoTextAction" });
      });
    }
    capaRoot.appendChild(assuntosField.field);
    var interessadosField = createField("fas fa-users azulColor", "Interessados:");
    if (typeof prop !== "undefined" && typeof prop.selInteressadosProcedimento !== "undefined") {
      $.each(prop.selInteressadosProcedimento, function(i2, v) {
        appendLineButton(interessadosField.data, v, "Clique para copiar", function() {
          if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
        }, { className: "capaProcessoTextAction" });
      });
    }
    capaRoot.appendChild(interessadosField.field);
    var nivelField = createField(dataNivelAcesso ? dataNivelAcesso.icon : "fas fa-globe-americas", "N\xEDvel de Acesso:");
    if (dataNivelAcesso) {
      appendLineButton(nivelField.data, dataNivelAcesso.name, "Clique para copiar", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      }, { className: "capaProcessoTextAction" });
    }
    capaRoot.appendChild(nivelField.field);
    var marcadorField = createField("fas fa-tag azulColor", "Marcador:");
    if (dataMarcador) {
      var marcadorBtn = createButton({
        html: iconMarcador,
        tooltip: "Clique para copiar",
        className: "capaProcessoTextAction"
      });
      marcadorBtn.addEventListener("click", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      });
      marcadorField.data.appendChild(marcadorBtn);
      if (linkPrazo) appendHtml(marcadorField.data, linkPrazo);
    }
    capaRoot.appendChild(marcadorField.field);
    if (descBlocoInterno) {
      var blocoField = createField("fas fa-book azulColor", "Bloco Interno:");
      appendLineButton(blocoField.data, descBlocoInterno, "Clique para copiar", function() {
        if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
      }, { className: "capaProcessoTextAction" });
      capaRoot.appendChild(blocoField.field);
    }
    var obsField = createField("fas fa-comment-dots azulColor", "Observa\xE7\xF5es:");
    if (typeof prop !== "undefined" && typeof prop.txaObservacoes !== "undefined") {
      $.each(prop.txaObservacoes, function(i2, v) {
        var obsRow = capaDoc.createElement("div");
        var obsBtn = createButton({
          className: "capaProcessoTextAction",
          tooltip: "Clique para copiar"
        });
        obsBtn.appendChild(capaDoc.createTextNode((v.unidade || "") + ": " + (v.observacao || "")));
        obsBtn.addEventListener("click", function() {
          if (typeof parent.copyTextThis === "function") parent.copyTextThis(this);
        });
        obsRow.appendChild(obsBtn);
        obsField.data.appendChild(obsRow);
      });
    }
    capaRoot.appendChild(obsField.field);
    ifrVisualizacao2.find("#capaProcessoPro").remove();
    if (typeof clearRetry === "function") clearRetry(id_procedimento, window.__SEI_PRO_CAPA_PROCESSO_RETRY__);
    if (coverPresent) {
      coverContainer.prepend(capaRoot);
      ifrVisualizacao2.find(divInformacao).hide();
      if (SeiPro.sei.adapter.isSEI5()) ifrVisualizacao2.find("#divArvoreHtml").removeClass("d-flex");
      replaceColorsIcons(ifrVisualizacao2.find("#tagUserColorPro"));
      if (typeof $().qrcode === "function") {
        ifrVisualizacao2.find(".qrcapa").html("").qrcode({
          render: "image",
          size: "150",
          text: parent.url_host + "?acao=procedimento_trabalhar&id_procedimento=" + id_procedimento
        });
      } else {
        $.getScript(URL_SPRO + "js/lib/jquery-qrcode-0.18.0.min.js");
      }
      if (loop) {
        setTimeout(function() {
          setCapaProcesso(false);
        }, 1500);
      }
    }
  }
  function getHtmlMarcador(id_procedimento, processoAberto) {
    var listMarcadores = sessionStorageRestorePro("dadosMarcadoresProcessoPro");
    var dataMarcador = id_procedimento && listMarcadores ? jmespath.search(listMarcadores, "[?id_procedimento=='" + id_procedimento + "'] | [0]") : null;
    dataMarcador = dataMarcador !== null ? dataMarcador : false;
    var iconMarcador = processoAberto ? '<i class="fas fa-spinner fa-spin"></i>' : "";
    var linkPrazo = "";
    if (dataMarcador) {
      var tagNameClean = dataMarcador.tag && dataMarcador.tag != "" && dataMarcador.tag.indexOf("#") !== -1 ? dataMarcador.tag.replace(extractHexColor(dataMarcador.tag), "") : dataMarcador.tag;
      tagNameClean = typeof tagNameClean !== "undefined" && tagNameClean != "" ? tagNameClean.trim() : tagNameClean;
      var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
      var time = typeof dataMarcador.name !== "undefined" && dataMarcador.name !== null ? String(dataMarcador.name).match(/(\d{1,2}:\d{2})/img) : null;
      time = time !== null ? " " + time[0] : "";
      var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
      var checkDateDue = typeof dataMarcador.name !== "undefined" && dataMarcador.name !== null && typeof dataMarcador.name === "string" ? regexDue.exec(removeAcentos(String(dataMarcador.name).trim()).toLowerCase().replaceAll("  ", " ")) : null;
      datePrazoDue = checkDateDue !== null ? moment(checkDateDue[0] + time, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm:ss") : false;
      var checkDate = typeof dataMarcador.name !== "undefined" && dataMarcador.name !== null && typeof dataMarcador.name === "string" ? regex.exec(removeAcentos(dataMarcador.name.trim())) : null;
      datePrazo = checkDateDue === null && checkDate !== null ? moment(checkDate[0] + time, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm:ss") : false;
      iconPrazo = datePrazo ? parent.getDatesPreview({ date: datePrazo }) : false;
      iconPrazo = datePrazoDue ? parent.getDatesPreview({ date: datePrazoDue }) : iconPrazo;
      linkPrazo = iconPrazo ? `<a class="newLink" style="cursor:pointer;max-width: calc(100% - 70px);" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar('Clique para copiar');" onmouseout="return infraTooltipOcultar();">` + iconPrazo + "</a>" : "";
      iconMarcador = typeof dataMarcador.icon !== "undefined" ? (checkConfigValue("coresmarcadores") ? '<span data-color="true" class="tagUserColorPro">' : "") + '<img src="' + dataMarcador.icon + '" class="imagemStatus" title="' + dataMarcador.tag + '">' + (checkConfigValue("coresmarcadores") ? "</span>" : "") + " " + tagNameClean + (dataMarcador.name ? ": " + dataMarcador.name.replace(/\\r\\n/g, "<br>") : "") : "Nenhum marcador";
    }
    return { icon: iconMarcador, prazo: linkPrazo, data: dataMarcador };
  }
  function getDocCertidao(this_) {
    var _this = $(this_);
    var itemSelected = false;
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var ifrArvoreHtml = ifrVisualizacao2.find($ifrArvoreHtml).contents();
    var contentBody = ifrArvoreHtml.find("body").clone(true);
    contentBody.find('img[alt="QRCode Assinatura"]').closest("table").remove();
    contentBody.find('a[onclick*="alert"]').remove();
    var contentHtml = contentBody[0].outerHTML;
    var ifrArvore = $("#ifrArvore");
    var href = getTreeLinkUrlByName("Incluir Documento");
    var nameDoc = checkConfigValue("certidaosigilo_nomedoc") ? getConfigValue("certidaosigilo_nomedoc") : "Certid\xE3o";
    if (href !== null) {
      alertaBoxPro("Sucess", "sync fa-spin", "Aguarde... Gerando Certid\xE3o de Documento Oficial com Sigilo");
      $.ajax({ url: href }).done(function(htmlInitDoc) {
        var $htmlInitDoc = $(htmlInitDoc);
        var form = $htmlInitDoc.find("#frmDocumentoEscolherTipo");
        var hrefForm = form.attr("action");
        var param = {};
        form.find("input[type=hidden]").each(function() {
          if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
            param[$(this).attr("name")] = $(this).val();
          }
        });
        param.hdnFiltroSerie = "T";
        $.ajax({
          method: "POST",
          data: param,
          url: hrefForm
        }).done(function(htmlFullList) {
          var $htmlFullList = $(htmlFullList);
          $htmlFullList.find("#tblSeries tbody tr").each(function(v) {
            var text = $(this).data("desc").trim();
            var value = $(this).find("input").val();
            var urlDoc = $(this).find("a.ancoraOpcao").attr("href");
            if (text != "") {
              var nameOption = escapeRegExp(text.replace(/_|:/g, " "));
              nameDoc = nameDoc.replace(/_|:/g, " ");
              var reg = new RegExp("^\\b" + nameOption, "igm");
              if (reg.test(parent.removeAcentos(nameDoc.trim().toLowerCase()))) {
                if (typeof urlDoc !== "undefined" && text != "externo") {
                  itemSelected = true;
                  $.ajax({ url: urlDoc }).done(function(htmlDoc) {
                    var $htmlDoc = $(htmlDoc);
                    var form2 = $htmlDoc.find("#frmDocumentoCadastro");
                    var hrefForm2 = form2.attr("action");
                    var param2 = {};
                    form2.find("input[type=hidden]").each(function() {
                      if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
                        param2[$(this).attr("name")] = $(this).val();
                      }
                    });
                    form2.find("input[type=text]").each(function() {
                      if ($(this).attr("id") && $(this).attr("id").indexOf("txt") !== -1) {
                        param2[$(this).attr("id")] = $(this).val();
                      }
                    });
                    form2.find("select").each(function() {
                      if ($(this).attr("id") && $(this).attr("id").indexOf("sel") !== -1) {
                        param2[$(this).attr("id")] = $(this).val();
                      }
                    });
                    form2.find("input[type=radio]").each(function() {
                      if ($(this).attr("name") && $(this).attr("name").indexOf("rdo") !== -1) {
                        param2[$(this).attr("name")] = $(this).val();
                      }
                    });
                    param2.rdoNivelAcesso = "0";
                    param2.hdnFlagDocumentoCadastro = "2";
                    param2.txaObservacoes = "";
                    param2.txtDescricao = "de Documento Oficial com Sigilo";
                    var postData = "";
                    for (var k in param2) {
                      if (postData !== "") postData = postData + "&";
                      var valor = k == "hdnAssuntos" ? param2[k] : escapeComponent(param2[k]);
                      valor = k == "txtDataElaboracao" ? param2[k] : escapeComponent(param2[k]);
                      valor = k == "hdnInteressados" ? param2[k] : valor;
                      valor = k == "txtDescricao" ? parent.encodeURI_toHex(param2[k].normalize("NFC")) : valor;
                      valor = k == "txtNumero" ? escapeComponent(param2[k]) : valor;
                      postData = postData + k + "=" + valor;
                    }
                    var xhr = new XMLHttpRequest();
                    $.ajax({
                      method: "POST",
                      // data: param,
                      data: postData,
                      url: hrefForm2,
                      contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
                      xhr: function() {
                        return xhr;
                      }
                    }).done(function(htmlResult) {
                      var status = xhr.responseURL.indexOf("controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar") !== -1 ? true : false;
                      var class_icon = "";
                      var text_icon = "";
                      if (status) {
                        alertaBoxPro("Sucess", "check-circle", "Certid\xE3o gerada com sucesso");
                        var $htmlResult = $(htmlResult);
                        var urlEditor = [];
                        var idUser = false;
                        $.each($htmlResult.text().split("\n"), function(i2, v2) {
                          if (v2.indexOf("atualizarArvore('") !== -1) {
                            urlReload = v2.split("'")[1];
                          }
                          if (v2.indexOf("acao=editor_montar") !== -1) {
                            var editorUrlCert = extractEditorMontarUrl(v2);
                            if (editorUrlCert) urlEditor.push(editorUrlCert);
                          }
                          if (v2.indexOf("janelaEditor_") !== -1) {
                            idUser = v2.split("_")[1];
                          }
                        });
                        if (!urlEditor.length) {
                          var editorUrlCertHtml = extractEditorMontarUrl(htmlResult);
                          if (editorUrlCertHtml) urlEditor.push(editorUrlCertHtml);
                        }
                        if (urlEditor.length > 0 && idUser) {
                          sessionStorageStorePro("dadosDocCertidao", contentHtml);
                          sessionStorageStorePro("nomeDocCertidao", ifrArvore.contents().find(".infraArvoreNoSelecionado").eq(0).text());
                          openWindowEditor(urlEditor[0] + "#&acao_pro=set_certidao", idUser);
                        }
                        if (urlReload) {
                          ifrArvore.attr("src", urlReload);
                        } else {
                          var ifrArvoreElem = getIframeArvoreElement();
                          if (ifrArvoreElem && ifrArvoreElem.contentWindow) ifrArvoreElem.contentWindow.location.reload(true);
                        }
                      } else {
                        alertaBoxPro("Error", "exclamation-triangle", 'Erro ao gerar o documento do tipo "' + nameDoc + '".');
                      }
                    });
                  });
                }
                return false;
              }
            }
          });
          if (!itemSelected) {
            alertaBoxPro("Error", "exclamation-triangle", 'Erro ao selecionar o tipo de documento "' + nameDoc + '". Verifique se o tipo est\xE1 dispon\xEDvel no sistema e tente novamente');
          }
        });
      });
    } else {
      if (!itemSelected) {
        console.log("Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!");
      }
    }
  }
  function getUrlNewDocArvore() {
    var ifrArvore = $("#ifrArvore");
    var urlNewDoc = getTreeLinkUrlByName("Incluir Documento");
    urlNewDoc = urlNewDoc !== null ? urlNewDoc : false;
    return urlNewDoc;
  }
  function openWindowEditor(urlEditor, idUser) {
    if (!isValidEditorMontarUrl(urlEditor)) {
      console.warn("SEI Pro: openWindowEditor skipped \u2014 missing id_documento", urlEditor);
      if (typeof alertaBoxPro === "function") {
        alertaBoxPro("Error", "exclamation-triangle", "N\xE3o foi poss\xEDvel abrir o editor: documento sem identifica\xE7\xE3o.");
      }
      return;
    }
    var abs = toAbsoluteSeiUrl(urlEditor);
    var id_documento = getParamsUrlPro(urlEditor).id_documento;
    var nome = "janelaEditor_" + idUser + "_" + id_documento;
    var janelaEditor = null;
    try {
      janelaEditor = infraAbrirJanela(abs, nome, parent.infraClientWidth(), parent.infraClientHeight(), "location=0,status=0,resizable=1,scrollbars=1", false);
    } catch (e) {
      janelaEditor = null;
    }
    if (!janelaEditor) {
      openLinkNewTab(abs);
      return;
    }
    try {
      var href = "";
      try {
        href = String(janelaEditor.location.href || "");
      } catch (e2) {
        href = "";
      }
      if (editorWindowNeedsNavigate(href)) {
        janelaEditor.location.href = abs;
      }
      janelaEditor.focus();
    } catch (e3) {
      openLinkNewTab(abs);
    }
  }
  function toAbsoluteSeiUrl(url) {
    try {
      var a = document.createElement("a");
      a.href = url;
      return a.href;
    } catch (e) {
      return url;
    }
  }
  function firstEditorContextDocumentId(win) {
    const candidates = [];
    const add = (value) => {
      if (value) candidates.push(String(value));
    };
    try {
      let current = win;
      for (let depth = 0; current && depth < 3; depth++, current = current.parent) {
        add(current?.linkEditarConteudo);
        add(current?.location?.href);
        const doc = current?.document;
        if (!doc) continue;
        const input = doc.querySelector('[name="id_documento"], #hdnIdDocumento, #id_documento');
        add(input?.value);
        doc.querySelectorAll('a[href*="id_documento="]').forEach((link) => {
          add(link.href || link.getAttribute("href"));
        });
      }
    } catch (error) {
    }
    try {
      const parentDoc = win?.parent?.document;
      const tree = parentDoc?.querySelector("#ifrArvore");
      const selected = tree?.contentDocument?.querySelector(".infraArvoreNoSelecionado");
      add(selected?.closest("a")?.href);
      add(selected?.getAttribute("href"));
    } catch (error) {
    }
    for (const candidate of candidates) {
      const id = getUrlDocumentoId(candidate);
      if (/^\d+$/.test(id)) return id;
      if (/^\d+$/.test(candidate.trim())) return candidate.trim();
    }
    return "";
  }
  function editorLinksFromContext(win) {
    const links = [];
    const add = (value) => {
      const candidate = String(value || "").trim();
      if (candidate && /acao=editor_montar/i.test(candidate)) links.push(candidate);
    };
    try {
      let current = win;
      for (let depth = 0; current && depth < 3; depth++, current = current.parent) {
        add(current?.linkEditarConteudo);
        const doc = current?.document;
        doc?.querySelectorAll('a[href*="editor_montar"]').forEach((link) => {
          add(link.href || link.getAttribute("href"));
        });
      }
    } catch (error) {
    }
    return links;
  }
  function resolveNativeEditorUrl(win) {
    if (!win) return null;
    const documentId = firstEditorContextDocumentId(win);
    if (!documentId) return null;
    const base = editorLinksFromContext(win)[0] || "";
    if (!base) return null;
    const repaired = repairEditorMontarUrl(base, documentId, win.location?.href || "");
    return repaired && isValidEditorMontarUrl(repaired) ? repaired : null;
  }
  function patchNativeEditorOpen(win) {
    if (!win || win.__SEI_PRO_EDITOR_OPEN_PATCHED__) return false;
    if (typeof win.editarConteudo !== "function") return false;
    if (!resolveNativeEditorUrl(win)) return false;
    win.__SEI_PRO_EDITOR_OPEN_PATCHED__ = true;
    var orig = win.editarConteudo;
    win.editarConteudo = function patchedEditarConteudo(assinado) {
      try {
        if (win.INFRA_FF > 0 && win.INFRA_FF < 4) {
          win.alert('Para realizar a edi\xE7\xE3o de documentos no Firefox \xE9 recomendado atualizar o navegador para a vers\xE3o 4 ou posterior.\n\nPara iniciar a atualiza\xE7\xE3o autom\xE1tica acesse o menu "Ajuda / Verificar atualiza\xE7\xF5es..." ou "Ajuda / Sobre o Firefox" do navegador.');
        }
        if (assinado == "S") {
          if (win.objAjaxVerificacaoAssinatura) win.objAjaxVerificacaoAssinatura.bolAssinado = true;
        } else if (win.objAjaxVerificacaoAssinatura && typeof win.objAjaxVerificacaoAssinatura.executar === "function") {
          win.objAjaxVerificacaoAssinatura.executar();
        }
        if (win.objAjaxVerificacaoAssinatura && win.objAjaxVerificacaoAssinatura.bolAssinado) {
          if (!win.confirm("Este documento j\xE1 foi assinado. Se for editado perder\xE1 a assinatura e dever\xE1 ser assinado novamente.\n\n Deseja editar o documento?")) {
            if (assinado == "N" && typeof win.atualizarArvore === "function") {
              win.atualizarArvore(win.linkMontarArvoreProcessoDocumento);
            }
            return;
          }
        }
      } catch (ePre) {
        console.warn("SEI Pro: editarConteudo pre-check failed, falling back", ePre);
        try {
          return orig.apply(win, arguments);
        } catch (eOrig) {
        }
      }
      ensureNativeEditorWindowNavigates(win);
    };
    return true;
  }
  function ensureNativeEditorWindowNavigates(win) {
    const editorUrl = resolveNativeEditorUrl(win);
    if (!editorUrl) return false;
    var abs;
    try {
      var a = win.document.createElement("a");
      a.href = editorUrl;
      abs = a.href;
    } catch (e) {
      abs = editorUrl;
    }
    var nome = "janelaEditor_" + (win.nomeJanelaDocumento || "");
    var openFn = null;
    try {
      if (win.parent && typeof win.parent.infraAbrirJanela === "function") openFn = win.parent.infraAbrirJanela.bind(win.parent);
      else if (typeof win.infraAbrirJanela === "function") openFn = win.infraAbrirJanela.bind(win);
    } catch (eBind) {
    }
    var w = null;
    try {
      if (openFn) {
        w = openFn(abs, nome, win.infraClientWidth(), win.infraClientHeight(), "location=0,status=0,resizable=1,scrollbars=1", false);
      } else {
        w = win.open(abs, nome);
      }
    } catch (e2) {
      w = null;
    }
    if (!w) {
      if (typeof openLinkNewTab === "function") openLinkNewTab(abs);
      else try {
        win.open(abs, "_blank");
      } catch (e3) {
      }
      return true;
    }
    try {
      var href = "";
      try {
        href = String(w.location.href || "");
      } catch (e4) {
        href = "";
      }
      if (editorWindowNeedsNavigate(href)) {
        w.location.href = abs;
      }
      w.focus();
    } catch (e5) {
      if (typeof openLinkNewTab === "function") openLinkNewTab(abs);
    }
    return true;
  }
  function setResizeIfrArvore() {
    var ifrArvore = $("#ifrArvore");
    var ifrVisualizacao2 = $($ifrVisualizacao);
    if (ifrArvore.length > 0) {
      console.log(ifrArvore.width(), ifrVisualizacao2.width());
    }
  }
  function _infraTooltipMostrar(_this, text) {
    if (!$(_this).find(".text").is(":visible")) {
      if (typeof infraTooltipMostrar === "function") infraTooltipMostrar(text);
    }
  }
  function setResizeAreaTelaD() {
    if ($(".panelHomePro").is(":visible")) {
      var width = $(".panelHomePro:visible").width() - $(".panelHomePro:visible").width() * 0.02;
      $(".resizeObserve:visible").css("width", width);
    }
    if ($("#atividadesProActions").length > 0 && $("#atividadesProActions").is(":visible")) {
      $("#atividadesPro").removeClass("minView");
      if ($("#atividadesProActions").height() > 40) {
        $("#atividadesPro").addClass("minView");
      }
    }
  }
  function cleanHistoryPro(this_) {
    confirmaBoxPro("Tem certeza que deseja apagar o hist\xF3rico de processos?", function() {
      localStorageRemovePro("dadosHistoricoProcessoPro");
      resetDialogBoxPro("dialogBoxPro");
      alertaBoxPro("Sucess", "check-circle", "Hist\xF3rico apagado com sucesso!");
    }, "Apagar");
  }
  function downloadTablePro(this_) {
    var _this = $(this_);
    var table = _this.closest("table");
    var data_table = table.data();
    var data = _this.data();
    var nameTable = typeof data_table.nameTable !== "undefined" ? data_table.nameTable : $(".infraBarraLocalizacao").length > 0 ? removeAcentos($(".infraBarraLocalizacao").eq(0).text().trim()).toLowerCase().replace(/ /g, "_") : "tabela";
    downloadTableCSV(table, nameTable + "_SEIPro");
    _this.find(".text").text("Baixado...");
    _this.find("i").attr("class", "fas fa-thumbs-up");
    setTimeout(function() {
      _this.find(".text").text(data.value);
      _this.find("i").attr("class", data.icon);
    }, 1500);
  }
  function copyTablePro(this_) {
    var _this = $(this_);
    var table = _this.closest("table");
    var data = _this.data();
    var htmlTable = table.clone(true).find(".notCopy").remove().end()[0].outerHTML;
    copyToClipboardHTML(htmlTable);
    _this.find(".text").text("Copiado...");
    _this.find("i").attr("class", "fas fa-thumbs-up");
    setTimeout(function() {
      _this.find(".text").text(data.value);
      _this.find("i").attr("class", data.icon);
    }, 1500);
  }
  function changeInputDateTime(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog").length > 0 ? _this.closest(".ui-dialog") : _this.closest(".seiProForm");
    _parent.find(".cloneDateTime").remove();
    _parent.find('input[type="datetime-local"]').each(function() {
      var id = typeof $(this).attr("id") !== "undefined" ? $(this).attr("id") : randomString(4);
      var partValue = $(this).val().split("T");
      var dateValue = partValue[0];
      var timeValue = partValue[1];
      var dateInput = $(this).clone().prop("id", id + "_clone_date").removeAttr("onchange").removeAttr("data-key").removeAttr("data-type").removeAttr("data-name").removeData().attr("max", typeof $(this).attr("max") !== "undefined" && $(this).attr("max") != "" ? $(this).attr("max").split("T")[0] : "").attr("min", typeof $(this).attr("min") !== "undefined" && $(this).attr("min") != "" ? $(this).attr("min").split("T")[0] : "").attr("data-refid", id).attr("value", dateValue).prop("type", "date").attr("style", "width: 50% !important;float: left;").attr("onchange", "updateInputDateTime(this)").val(dateValue).addClass("cloneDateTime");
      var timeInput = $(this).clone().prop("id", id + "_clone_time").removeAttr("onchange").removeAttr("data-key").removeAttr("data-type").removeAttr("data-name").removeData().removeAttr("max").removeAttr("min").attr("data-refid", id).attr("value", timeValue).prop("type", "time").attr("style", "width: 30% !important;float: right;").attr("onchange", "updateInputDateTime(this)").val(timeValue).addClass("cloneDateTime");
      $(this).after(timeInput).after(dateInput).hide();
      $(this).closest("td").addClass("dateonly");
    });
  }
  function updateInputDateTime(this_) {
    var _this = $(this_);
    var _parent = _this.closest("td");
    var data = _this.data();
    var _date = _parent.find("#" + data.refid + "_clone_date");
    var _time = _parent.find("#" + data.refid + "_clone_time");
    _parent.find("#" + data.refid).val(_date.val() + "T" + _time.val()).trigger("change");
    console.log(_date.val(), _time.val());
    changeInputDateTime(this_);
  }
  function updateDatesRange(this_) {
    var _this = $(this_);
    var _parent = _this.closest("tr");
    var _inicio = _parent.find('input[data-range="inicio"]');
    var _fim = _parent.find('input[data-range="fim"]');
    setTimeout(() => {
      _fim.attr("min", _inicio.val());
      _inicio.attr("max", _fim.val());
    }, 1500);
  }
  function setSortLocaleCompare() {
    $.tablesorter.characterEquivalents = {
      "a": "\xE1\xE0\xE2\xE3\xE4\u0105\xE5",
      // áàâãäąå
      "A": "\xC1\xC0\xC2\xC3\xC4\u0104\xC5",
      // ÁÀÂÃÄĄÅ
      "c": "\xE7\u0107\u010D",
      // çćč
      "C": "\xC7\u0106\u010C",
      // ÇĆČ
      "e": "\xE9\xE8\xEA\xEB\u011B\u0119",
      // éèêëěę
      "E": "\xC9\xC8\xCA\xCB\u011A\u0118",
      // ÉÈÊËĚĘ
      "i": "\xED\xEC\u0130\xEE\xEF\u0131",
      // íìİîïı
      "I": "\xCD\xCC\u0130\xCE\xCF",
      // ÍÌİÎÏ
      "o": "\xF3\xF2\xF4\xF5\xF6\u014D",
      // óòôõöō
      "O": "\xD3\xD2\xD4\xD5\xD6\u014C",
      // ÓÒÔÕÖŌ
      "ss": "\xDF",
      // ß (s sharp)
      "SS": "\u1E9E",
      // ẞ (Capital sharp s)
      "u": "\xFA\xF9\xFB\xFC\u016F",
      // úùûüů
      "U": "\xDA\xD9\xDB\xDC\u016E"
      // ÚÙÛÜŮ
    };
  }
  function filterTablePro(this_) {
    var _this = $(this_);
    var _parent = _this.closest("thead");
    var table = _this.closest("table");
    var filter = _parent.find(".tablesorter-filter-row");
    if (_this.hasClass("active")) {
      filter.addClass("hideme");
      _this.removeClass("active");
      table.trigger("filterReset").trigger("updateAll");
    } else {
      filter.removeClass("hideme");
      _this.addClass("active");
      setTimeout(function() {
        filter.find("input:visible").map(function() {
          if ($(this).visible(false, true)) {
            return this;
          }
        }).eq(0).focus();
      }, 500);
    }
  }
  function setHistoryProcessosPro(dadosProcessoPro2) {
    var prop = dadosProcessoPro2.propProcesso;
    var dadosProcessoPro_push = {
      datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
      data_geracao: prop.hdnDtaGeracao,
      id_procedimento: prop.hdnIdProcedimento,
      tipo_processo: prop.hdnNomeTipoProcedimento,
      protocolo: typeof prop.txtProtocoloExibir === "undefined" ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir,
      nivel_acesso: prop.rdoNivelAcesso,
      assuntos: prop.selAssuntos_select,
      observacoes: prop.txaObservacoes,
      descricao: prop.txtDescricao
    };
    var dadosHistoricoProcessoPro = localStorageRestorePro("dadosHistoricoProcessoPro");
    if (dadosHistoricoProcessoPro !== null) {
      dadosHistoricoProcessoPro = reverseArray(dadosHistoricoProcessoPro);
      dadosHistoricoProcessoPro = dadosHistoricoProcessoPro.filter(
        (thing, index, self) => index === self.findIndex((t) => t.id_procedimento === thing.id_procedimento)
      );
      dadosHistoricoProcessoPro = reverseArray(dadosHistoricoProcessoPro);
    }
    if (dadosHistoricoProcessoPro !== null) {
      for (i = 0; i < dadosHistoricoProcessoPro.length; i++) {
        if (i > 500 || dadosHistoricoProcessoPro[i].id_procedimento == dadosProcessoPro_push.id_procedimento) {
          dadosHistoricoProcessoPro.splice(i, 1);
          i--;
        }
      }
    }
    if (dadosHistoricoProcessoPro) {
      dadosHistoricoProcessoPro.push(dadosProcessoPro_push);
    } else {
      dadosHistoricoProcessoPro = [dadosProcessoPro_push];
    }
    localStorageStorePro("dadosHistoricoProcessoPro", dadosHistoricoProcessoPro);
  }
  function resolveProcessoSessionId(id_procedimento = false) {
    if (typeof id_procedimento !== "undefined" && id_procedimento !== null && id_procedimento !== "") {
      return String(id_procedimento);
    }
    var idAtual = getParamsUrlPro(window.location.href).id_procedimento;
    if (typeof idAtual !== "undefined" && idAtual !== null && idAtual !== "") {
      return String(idAtual);
    }
    if ($("#ifrArvore").length > 0) {
      var srcArvore = $("#ifrArvore").attr("src");
      if (typeof srcArvore !== "undefined" && srcArvore !== null && srcArvore !== "") {
        var paramsArvore = getParamsUrlPro(srcArvore);
        if (typeof paramsArvore.id_procedimento !== "undefined" && paramsArvore.id_procedimento !== null && paramsArvore.id_procedimento !== "") {
          return String(paramsArvore.id_procedimento);
        }
      }
    }
    return false;
  }
  function pullDadosProcessoSession(id_procedimento = false) {
    return getDadosProcessoSession(id_procedimento) ? getDadosProcessoSession(id_procedimento) : dadosProcessoPro;
  }
  function getDadosProcessoSession(id_procedimento = false) {
    id_procedimento = resolveProcessoSessionId(id_procedimento);
    if (!id_procedimento) return false;
    if (typeof jmespath === "undefined") return false;
    var dadosSessionProcessoPro = sessionStorageRestorePro("dadosSessionProcessoPro");
    var dadosProcesso = dadosSessionProcessoPro ? jmespath.search(dadosSessionProcessoPro, "[?propProcesso.hdnIdProcedimento=='" + id_procedimento + "' || listAndamento.id_procedimento=='" + id_procedimento + "'] | [0]") : null;
    return dadosProcesso && dadosProcesso !== null ? dadosProcesso : false;
  }
  function setSessionProcessosPro(dadosProcessoPro2) {
    var dadosProcessoPro_push = dadosProcessoPro2;
    if (dadosProcessoPro_push && typeof dadosProcessoPro_push.treeModel !== "undefined" && dadosProcessoPro_push.treeModel !== null) {
      dadosProcessoPro_push.treeModel = buildTreeModel(dadosProcessoPro_push.treeModel);
    }
    if (dadosProcessoPro_push && typeof dadosProcessoPro_push.listDocumentos !== "undefined" && $.isArray(dadosProcessoPro_push.listDocumentos)) {
      dadosProcessoPro_push.listDocumentos = normalizeTreeDocuments(dadosProcessoPro_push.listDocumentos);
    }
    if (dadosProcessoPro_push && typeof dadosProcessoPro_push.treeModel !== "undefined" && dadosProcessoPro_push.treeModel !== null) {
      dadosProcessoPro_push.listDocumentos = dadosProcessoPro_push.treeModel.documents;
      dadosProcessoPro_push.listDocumentosAssinados = dadosProcessoPro_push.treeModel.documentsSigned;
      dadosProcessoPro_push.listLinks = dadosProcessoPro_push.treeModel.links;
      dadosProcessoPro_push.listLinksAll = dadosProcessoPro_push.treeModel.linksAll;
      dadosProcessoPro_push.treeIconsView = dadosProcessoPro_push.treeModel.iconsView;
      dadosProcessoPro_push.treePageLinks = dadosProcessoPro_push.treeModel.pageLinks;
      dadosProcessoPro_push.treeSignature = dadosProcessoPro_push.treeModel.signature;
    }
    var dadosSessionProcessoPro = sessionStorageRestorePro("dadosSessionProcessoPro");
    var id_procedimento = typeof dadosProcessoPro_push.propProcesso !== "undefined" && typeof dadosProcessoPro_push.propProcesso.hdnIdProcedimento !== "undefined" ? dadosProcessoPro_push.propProcesso.hdnIdProcedimento : getParamsUrlPro(window.location.href).id_procedimento ? getParamsUrlPro(window.location.href).id_procedimento : void 0;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
    id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
    if (dadosSessionProcessoPro !== null) {
      for (i = 0; i < dadosSessionProcessoPro.length; i++) {
        if (i > 500 || (typeof dadosSessionProcessoPro[i].propProcesso !== "undefined" && typeof dadosSessionProcessoPro[i].propProcesso.hdnIdProcedimento !== "undefined" && dadosSessionProcessoPro[i].propProcesso.hdnIdProcedimento == id_procedimento || typeof dadosSessionProcessoPro[i].listAndamento !== "undefined" && dadosSessionProcessoPro[i].listAndamento.id_procedimento == id_procedimento)) {
          dadosSessionProcessoPro.splice(i, 1);
          i--;
        }
      }
    }
    if (dadosSessionProcessoPro) {
      dadosSessionProcessoPro.push(dadosProcessoPro_push);
    } else {
      dadosSessionProcessoPro = [dadosProcessoPro_push];
    }
    if (typeof sessionStorageStoreBoundedPro === "function") {
      sessionStorageStoreBoundedPro("dadosSessionProcessoPro", dadosSessionProcessoPro, { maxEntries: 25 });
    } else {
      sessionStorageStorePro("dadosSessionProcessoPro", dadosSessionProcessoPro);
    }
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("sei-pro-process-session-updated", {
        detail: {
          id_procedimento,
          hasPropProcesso: typeof dadosProcessoPro_push.propProcesso !== "undefined" && dadosProcessoPro_push.propProcesso !== null,
          hasListAndamento: typeof dadosProcessoPro_push.listAndamento !== "undefined" && dadosProcessoPro_push.listAndamento !== null,
          hasListDocumentosAssinados: typeof dadosProcessoPro_push.listDocumentosAssinados !== "undefined" && dadosProcessoPro_push.listDocumentosAssinados !== null
        }
      }));
    }
  }
  function updateTitlePage(mode, dadosProcesso = false) {
    var processo = dadosProcesso ? dadosProcesso.propProcesso : dadosProcessoPro.propProcesso;
    if (!processo || typeof processo !== "object") {
      return;
    }
    if (typeof processo.txtDescricao !== "undefined") {
      var protocolo = typeof processo !== "undefined" && typeof processo.txtProtocoloExibir === "undefined" ? processo.hdnProtocoloFormatado : processo.txtProtocoloExibir;
      if (mode == "processo") {
        $("head title").text(processo.txtDescricao + " | SEI - Processo " + protocolo);
        if (parent.verifyConfigValue("urlamigavel")) {
          updateUrlPage(true, dadosProcesso);
        }
      } else if (mode == "editor") {
        var title = $("head title").text();
        title = title.indexOf("-") !== -1 ? title.split("-")[2] + " " + title.split("-")[1] : title;
        $("head title").text("Editor: " + title + " - " + processo.txtDescricao + " | SEI - Processo " + protocolo);
      }
    }
  }
  function updateUrlPage(update = true, dadosProcesso = false) {
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
      return;
    }
    var processo = dadosProcesso ? dadosProcesso.propProcesso : dadosProcessoPro.propProcesso;
    var protocolo = typeof processo !== "undefined" && typeof processo.txtProtocoloExibir === "undefined" ? processo.hdnProtocoloFormatado : typeof processo !== "undefined" ? processo.txtProtocoloExibir : null;
    if (typeof protocolo !== "undefined" && protocolo !== null && $("#ifrArvore").length > 0) {
      var ifrArvore = $("#ifrArvore").contents();
      var nrSEI = ifrArvore.find(".infraArvoreNoSelecionado").eq(0);
      nrSEI = typeof nrSEI !== "undefined" && nrSEI !== null ? getNrSei(nrSEI.text().trim()) : "";
      nrSEI = nrSEI != "" ? "@" + nrSEI : "";
      if (update) {
        window.history.replaceState({ sei: nrSEI }, document.title, "/sei/#" + protocolo + nrSEI);
      } else {
        window.history.pushState({ sei: nrSEI }, document.title, "/sei/#" + protocolo + nrSEI);
        iHistoryArray.push({ id: iHistory, sei: nrSEI });
      }
      iHistory++;
    }
  }
  function getIfrArvoreDadosProcesso() {
    if ($("#ifrArvore").length > 0) {
      var ifrArvore = $("#ifrArvore").contents();
      var ifrVisualizacao2 = $($ifrVisualizacao).contents();
      var ifrArvoreHtml = ifrVisualizacao2.find($ifrArvoreHtml).contents();
      var assunto = ifrVisualizacao2.find($ifrArvoreHtml).length > 0 ? ifrArvoreHtml.find("p").map(function() {
        var reg = new RegExp("assunto:", "igm");
        if (reg.test($(this).text())) {
          return $(this).text().replace(reg, "").trim().replace(/[\u200B]/g, "");
        }
      }).get(0) : "";
      var usuarios = typeof arrayConfigAtividades !== "undefined" && typeof arrayConfigAtividades.planos !== "undefined" ? uniqPro(jmespath.search(arrayConfigAtividades.planos, "[*].apelido")) : [];
      usuarios = usuarios.sort((a, b) => b.length - a.length);
      var usuario = ifrVisualizacao2.find($ifrArvoreHtml).length > 0 ? ifrArvoreHtml.find("p").map(function() {
        var txt2 = removeAcentos($(this).text());
        var reg = new RegExp("\\b" + removeAcentos(usuarios.join("|")) + "\\b", "im");
        if (reg.test(txt2)) {
          var u = false;
          var textMatch = txt2.replace(reg, function(match) {
            u = match;
            return false;
          });
          return u;
        }
        ;
      }).get(0) : false;
      var prazo = ifrVisualizacao2.find($ifrArvoreHtml).length > 0 ? ifrArvoreHtml.find("p").map(function() {
        var txt2 = $(this).text();
        var reg = new RegExp("prazo", "i");
        var p = false;
        if (reg.test(txt2)) {
          p = txt2.substr(txt2.indexOf("prazo") + 5).trim();
          p = p.match(/^\d+|\d+\b|\d+(?=\w)/g);
          return p !== null ? parseInt(p[0]) : false;
        }
      }).get(0) : false;
      var assinatura = ifrVisualizacao2.find($ifrArvoreHtml).length > 0 ? ifrArvoreHtml.find("p").map(function() {
        var txt2 = $(this).text();
        var reg = new RegExp("documento assinado eletronicamente", "i");
        var p = false;
        if (reg.test(txt2)) {
          var date2 = txt2.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
          var time2 = txt2.match(/(\d{1,2}:\d{2})/img);
          return date2 !== null && time2 !== null ? date2[0] + " " + time2[0] : false;
        }
      }).get(0) : false;
      var versao = false;
      if (ifrVisualizacao2.find($ifrArvoreHtml).length > 0) {
        var txt = ifrArvoreHtml.find("body").text().trim();
        txt = txt.substr(txt.lastIndexOf("\n") + 1);
        var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
        var time = txt.match(/(\d{1,2}:\d{2})/img);
        versao = date !== null && time !== null ? date[0] + " " + time[0] : false;
      }
      var data_documento = assinatura ? assinatura : versao;
      var processoLnk = ifrArvore.find(`a[target="${ifrVisualizacao_}"]`).eq(0);
      var processo_sei = processoLnk.text().trim();
      var tipo = processoLnk.find("span").attr("title");
      var tipo = typeof tipo !== "undefined" ? tipo.trim() : tipo;
      var id_procedimento = processoLnk.attr("href");
      id_procedimento = typeof id_procedimento !== "undefined" && id_procedimento.length > 0 ? getParamsUrlPro(id_procedimento).id_procedimento : false;
      var requisicaoLnk = ifrArvore.find("#container .infraArvoreNoSelecionado");
      var id_documento = requisicaoLnk.closest("a").attr("href");
      id_documento = typeof id_documento !== "undefined" && id_documento.length > 0 ? getParamsUrlPro(id_documento).id_documento : false;
      var nome_documento = requisicaoLnk.text().replace(/[0-9]/g, "").replace(/\(\)/g, "").trim();
      var nr_sei = requisicaoLnk.text().trim().split(" ");
      nr_sei = requisicaoLnk.text().indexOf(" ") !== -1 ? nr_sei[nr_sei.length - 1] : "";
      nr_sei = nr_sei.indexOf("(") !== -1 ? nr_sei.replace(")", "").replace("(", "").trim() : nr_sei;
      nr_sei = typeof requisicaoLnk.attr("id") !== "undefined" && requisicaoLnk.attr("id").length > 0 && requisicaoLnk.attr("id").indexOf("PASTA") === -1 ? nr_sei : "";
      var numero_documento = ifrVisualizacao2.find($ifrArvoreHtml).length > 0 ? ifrArvoreHtml.find("p").map(function() {
        var reg = new RegExp(removeAcentos(nome_documento), "igm");
        if (reg.test(removeAcentos($(this).text()))) {
          return removeAcentos($(this).text()).replace(reg, "").replace(/[\u200B]/g, "").replace(/n[\u00BA]/g, "").trim();
        }
      }).get(0) : "";
      var processos = ifrArvoreHtml.find("a.ancoraSei").map(function() {
        var processo_sei2 = $(this).text().trim();
        var param = getParamsUrlPro($(this).attr("href"));
        var id_proced = param && typeof param.id_protocolo !== "undefined" ? param.id_protocolo : param && typeof param.id_procedimento !== "undefined" ? param.id_procedimento : false;
        if (id_proced && id_proced != id_procedimento && processo_sei2 !== "" && processo_sei2.match(/(-|\/|\.)/)) {
          return { processo_sei: processo_sei2, id_procedimento: id_proced };
        }
      }).get();
      return {
        processo_sei: typeof processo_sei !== "undefined" ? processo_sei : false,
        id_procedimento: typeof id_procedimento !== "undefined" ? id_procedimento : false,
        tipo: typeof tipo !== "undefined" ? tipo : false,
        nome_documento: typeof nome_documento !== "undefined" ? nome_documento : false,
        id_documento: typeof id_documento !== "undefined" ? id_documento : false,
        nr_sei: typeof nr_sei !== "undefined" ? nr_sei : false,
        numero_documento: typeof numero_documento !== "undefined" ? numero_documento : false,
        assunto: typeof assunto !== "undefined" ? assunto : false,
        usuario: typeof usuario !== "undefined" ? usuario : false,
        prazo: typeof prazo !== "undefined" ? parseInt(prazo) > 100 ? 100 : parseInt(prazo) : false,
        assinatura: typeof assinatura !== "undefined" ? assinatura : false,
        versao: typeof versao !== "undefined" ? versao : false,
        processos: typeof processos !== "undefined" && processos.length > 0 ? processos : false,
        data_documento: typeof data_documento !== "undefined" ? data_documento : false
      };
    } else {
      return false;
    }
  }
  function loadCSSResize(iframe) {
    var cssScript = "img::selection{color:transparent}img.ckimgrsz{outline:1px dashed #000}#ckimgrsz{position:absolute;margin:-8px -8px;width:0;height:0;cursor:default;z-index:10001}#ckimgrsz span{display:none;position:absolute;top:0;left:0;width:0;height:0;background-size:100% 100%;opacity:.65;outline:1px dashed #000}#ckimgrsz i{position:absolute;display:block;width:5px;height:5px;background:#fff;border:1px solid #000}#ckimgrsz i.active,#ckimgrsz i:hover{background:#000}#ckimgrsz i.br,#ckimgrsz i.tl{cursor:nwse-resize}#ckimgrsz i.bm,#ckimgrsz i.tm{cursor:ns-resize}#ckimgrsz i.bl,#ckimgrsz i.tr{cursor:nesw-resize}#ckimgrsz i.lm,#ckimgrsz i.rm{cursor:ew-resize}body.dragging-br,body.dragging-br *,body.dragging-tl,body.dragging-tl *{cursor:nwse-resize!important}body.dragging-bm,body.dragging-bm *,body.dragging-tm,body.dragging-tm *{cursor:ns-resize!important}body.dragging-bl,body.dragging-bl *,body.dragging-tr,body.dragging-tr *{cursor:nesw-resize!important}body.dragging-lm,body.dragging-lm *,body.dragging-rm,body.dragging-rm *{cursor:ew-resize!important}";
    if (iframe.find("head").find('style[data-style="seipro-resizeimg"]').length == 0) {
      iframe.find("head").append("<style type='text/css' data-style='seipro-resizeimg'> " + cssScript + "</style>");
    }
  }
  function initResizeImg(editor) {
    var window2 = editor.window.$, document2 = editor.document.$;
    var snapToSize = typeof IMAGE_SNAP_TO_SIZE === "undefined" ? null : IMAGE_SNAP_TO_SIZE;
    var resizer = new Resizer(editor, { snapToSize });
    document2.addEventListener("mousedown", function(e) {
      if (resizer.isHandle(e.target)) {
        resizer.initDrag(e);
      }
    }, false);
    function selectionChange() {
      var selection = editor.getSelection();
      if (!selection) return;
      if (selection.getType() !== CKEDITOR.SELECTION_NONE && selection.getStartElement().is("img")) {
        if (!window2.event || !window2.event.button || window2.event.button === 0) {
          resizer.show(selection.getStartElement().$);
        }
      } else {
        resizer.hide();
      }
    }
    editor.on("selectionChange", selectionChange);
    editor.on("getData", function(e) {
      var html = e.data.dataValue || "";
      html = html.replace(/<div id="ckimgrsz"([\s\S]*?)<\/div>/i, "");
      html = html.replace(/\b(ckimgrsz)\b/g, "");
      e.data.dataValue = html;
    });
    editor.on("beforeUndoImage", function() {
      resizer.hide();
    });
    editor.on("afterUndoImage", function() {
      selectionChange();
    });
    editor.on("blur", function() {
      resizer.hide();
    });
    editor.on("beforeModeUnload", function self() {
      editor.removeListener("beforeModeUnload", self);
      resizer.hide();
    });
    var resizeTimeout;
    editor.window.on("resize", function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(selectionChange, 50);
    });
  }
  function Resizer(editor, cfg) {
    this.editor = editor;
    this.window = editor.window.$;
    this.document = editor.document.$;
    this.cfg = cfg || {};
    this.init();
  }
  Resizer.prototype = {
    init: function() {
      var container = this.container = this.document.createElement("div");
      container.id = "ckimgrsz";
      this.preview = this.document.createElement("span");
      container.appendChild(this.preview);
      var handles = this.handles = {
        tl: this.createHandle("tl"),
        tm: this.createHandle("tm"),
        tr: this.createHandle("tr"),
        lm: this.createHandle("lm"),
        rm: this.createHandle("rm"),
        bl: this.createHandle("bl"),
        bm: this.createHandle("bm"),
        br: this.createHandle("br")
      };
      for (var n in handles) {
        container.appendChild(handles[n]);
      }
    },
    createHandle: function(name) {
      var el = this.document.createElement("i");
      el.classList.add(name);
      return el;
    },
    isHandle: function(el) {
      var handles = this.handles;
      for (var n in handles) {
        if (handles[n] === el) return true;
      }
      return false;
    },
    show: function(el) {
      this.el = el;
      if (this.cfg.snapToSize) {
        this.otherImages = toArray(this.document.getElementsByTagName("img"));
        this.otherImages.splice(this.otherImages.indexOf(el), 1);
      }
      var box = this.box = getBoundingBox(this.window, el);
      positionElement(this.container, box.left, box.top);
      this.document.body.appendChild(this.container);
      this.el.classList.add("ckimgrsz");
      this.showHandles();
    },
    hide: function() {
      var elements = this.document.getElementsByClassName("ckimgrsz");
      for (var i2 = 0; i2 < elements.length; ++i2) {
        elements[i2].classList.remove("ckimgrsz");
      }
      this.hideHandles();
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    },
    initDrag: function(e) {
      if (e.button !== 0) {
        return;
      }
      var resizer = this;
      var drag = new DragEvent(this.window, this.document);
      drag.onStart = function() {
        resizer.showPreview();
        resizer.isDragging = true;
        resizer.editor.getSelection().lock();
      };
      drag.onDrag = function() {
        resizer.calculateSize(this);
        resizer.updatePreview();
        var box = resizer.previewBox;
        resizer.updateHandles(box, box.left, box.top);
      };
      drag.onRelease = function() {
        resizer.isDragging = false;
        resizer.hidePreview();
        resizer.hide();
        resizer.editor.getSelection().unlock();
        resizer.editor.fire("saveSnapshot");
      };
      drag.onComplete = function() {
        resizer.resizeComplete();
        resizer.editor.fire("saveSnapshot");
      };
      drag.start(e);
    },
    updateHandles: function(box, left, top) {
      left = left || 0;
      top = top || 0;
      var handles = this.handles;
      positionElement(handles.tl, -3 + left, -3 + top);
      positionElement(handles.tm, Math.round(box.width / 2) - 3 + left, -3 + top);
      positionElement(handles.tr, box.width - 4 + left, -3 + top);
      positionElement(handles.lm, -3 + left, Math.round(box.height / 2) - 3 + top);
      positionElement(handles.rm, box.width - 4 + left, Math.round(box.height / 2) - 3 + top);
      positionElement(handles.bl, -3 + left, box.height - 4 + top);
      positionElement(handles.bm, Math.round(box.width / 2) - 3 + left, box.height - 4 + top);
      positionElement(handles.br, box.width - 4 + left, box.height - 4 + top);
    },
    showHandles: function() {
      var handles = this.handles;
      this.updateHandles(this.box);
      for (var n in handles) {
        handles[n].style.display = "block";
      }
    },
    hideHandles: function() {
      var handles = this.handles;
      for (var n in handles) {
        handles[n].style.display = "none";
      }
    },
    showPreview: function() {
      this.preview.style.backgroundImage = 'url("' + this.el.src + '")';
      this.calculateSize();
      this.updatePreview();
      this.preview.style.display = "block";
    },
    updatePreview: function() {
      var box = this.previewBox;
      positionElement(this.preview, box.left, box.top);
      resizeElement(this.preview, box.width, box.height);
    },
    hidePreview: function() {
      var box = getBoundingBox(this.window, this.preview);
      this.result = { width: box.width, height: box.height };
      this.preview.style.display = "none";
    },
    calculateSize: function(data) {
      var box = this.previewBox = { top: 0, left: 0, width: this.box.width, height: this.box.height };
      if (!data) return;
      var attr = data.target.className;
      if (~attr.indexOf("r")) {
        box.width = Math.max(32, this.box.width + data.delta.x);
      }
      if (~attr.indexOf("b")) {
        box.height = Math.max(32, this.box.height + data.delta.y);
      }
      if (~attr.indexOf("l")) {
        box.width = Math.max(32, this.box.width - data.delta.x);
      }
      if (~attr.indexOf("t")) {
        box.height = Math.max(32, this.box.height - data.delta.y);
      }
      if (attr.indexOf("m") < 0 && !data.keys.shift) {
        var ratio = this.box.width / this.box.height;
        if (box.width / box.height > ratio) {
          box.height = Math.round(box.width / ratio);
        } else {
          box.width = Math.round(box.height * ratio);
        }
      }
      var snapToSize = this.cfg.snapToSize;
      if (snapToSize) {
        var others = this.otherImages;
        for (var i2 = 0; i2 < others.length; i2++) {
          var other = getBoundingBox(this.window, others[i2]);
          if (Math.abs(box.width - other.width) <= snapToSize && Math.abs(box.height - other.height) <= snapToSize) {
            box.width = other.width;
            box.height = other.height;
            break;
          }
        }
      }
      if (~attr.indexOf("l")) {
        box.left = this.box.width - box.width;
      }
      if (~attr.indexOf("t")) {
        box.top = this.box.height - box.height;
      }
    },
    resizeComplete: function() {
      resizeElement(this.el, this.result.width, this.result.height);
    }
  };
  function DragEvent(window2, document2) {
    this.window = window2;
    this.document = document2;
    this.events = {
      mousemove: bind(this.mousemove, this),
      keydown: bind(this.keydown, this),
      mouseup: bind(this.mouseup, this)
    };
  }
  DragEvent.prototype = {
    start: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.target = e.target;
      this.attr = e.target.className;
      this.startPos = { x: e.clientX, y: e.clientY };
      this.update(e);
      var events = this.events;
      this.document.addEventListener("mousemove", events.mousemove, false);
      this.document.addEventListener("keydown", events.keydown, false);
      this.document.addEventListener("mouseup", events.mouseup, false);
      this.document.body.classList.add("dragging-" + this.attr);
      this.onStart && this.onStart();
    },
    update: function(e) {
      this.currentPos = { x: e.clientX, y: e.clientY };
      this.delta = { x: e.clientX - this.startPos.x, y: e.clientY - this.startPos.y };
      this.keys = { shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey };
    },
    mousemove: function(e) {
      this.update(e);
      this.onDrag && this.onDrag();
      if (e.which === 0) {
        this.mouseup(e);
      }
    },
    keydown: function(e) {
      if (e.keyCode === 27) {
        this.release();
      }
    },
    mouseup: function(e) {
      this.update(e);
      this.release();
      this.onComplete && this.onComplete();
    },
    release: function() {
      this.document.body.classList.remove("dragging-" + this.attr);
      var events = this.events;
      this.document.removeEventListener("mousemove", events.mousemove, false);
      this.document.removeEventListener("keydown", events.keydown, false);
      this.document.removeEventListener("mouseup", events.mouseup, false);
      this.onRelease && this.onRelease();
    }
  };
  function bind(fn, ctx) {
    if (fn.bind) {
      return fn.bind(ctx);
    }
    return function() {
      fn.apply(ctx, arguments);
    };
  }
  function positionElement(el, left, top) {
    el.style.left = String(left) + "px";
    el.style.top = String(top) + "px";
  }
  function resizeElement(el, width, height) {
    el.style.width = String(width) + "px";
    el.style.height = String(height) + "px";
  }
  function getBoundingBox(window2, el) {
    var rect = el.getBoundingClientRect();
    return {
      left: rect.left + window2.pageXOffset,
      top: rect.top + window2.pageYOffset,
      width: rect.width,
      height: rect.height
    };
  }
  function setMomentPtBr() {
    moment.defineLocale("pt-br", {
      months: "janeiro_fevereiro_mar\xE7o_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
      monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
      weekdays: "domingo_segunda-feira_ter\xE7a-feira_quarta-feira_quinta-feira_sexta-feira_s\xE1bado".split("_"),
      weekdaysShort: "dom_seg_ter_qua_qui_sex_s\xE1b".split("_"),
      weekdaysMin: "dom_2\xAA_3\xAA_4\xAA_5\xAA_6\xAA_s\xE1b".split("_"),
      longDateFormat: {
        LT: "HH:mm",
        L: "DD/MM/YYYY",
        LL: "D [de] MMMM [de] YYYY",
        LLL: "D [de] MMMM [de] YYYY [\xE1s] LT",
        LLLL: "dddd, D [de] MMMM [de] YYYY [\xE1s] LT"
      },
      calendar: {
        sameDay: "[Hoje \xE0s] LT",
        nextDay: "[Amanh\xE3 \xE0s] LT",
        nextWeek: "dddd [\xE0s] LT",
        lastDay: "[Ontem \xE0s] LT",
        lastWeek: function() {
          return this.day() === 0 || this.day() === 6 ? "[\xDAltimo] dddd [\xE1s] LT" : (
            // Saturday + Sunday
            "[\xDAltima] dddd [\xE1s] LT"
          );
        },
        sameElse: "L"
      },
      relativeTime: {
        future: "em %s",
        past: "%s atr\xE1s",
        s: "segundos",
        m: "um minuto",
        mm: "%d minutos",
        h: "uma hora",
        hh: "%d horas",
        d: "um dia",
        dd: "%d dias",
        M: "um m\xEAs",
        MM: "%d meses",
        y: "um ano",
        yy: "%d anos"
      },
      ordinal: "%d\xBA"
    });
    moment.locale("pt-br");
  }
  var CSSJSON = new function() {
    var e = this;
    e.init = function() {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
      }, String.prototype.repeat = function(e2) {
        return new Array(1 + e2).join(this);
      };
    }, e.init();
    var t = /\/\*[\s\S]*?\*\//g, r = /([^\:]+):([^\;]*);/, n = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gim, o = function(e2) {
      return void 0 === e2 || 0 == e2.length || null == e2;
    };
    e.toJSON = function(i2, a2) {
      var s2 = { children: {}, attributes: {} }, u2 = null, l2 = 0;
      if (void 0 === a2) a2 = { ordered: false, comments: false, stripComments: false, split: false };
      for (a2.stripComments && (a2.comments = false, i2 = i2.replace(t, "")); null != (u2 = n.exec(i2)); ) if (!o(u2[1]) && a2.comments) {
        var f = u2[1].trim();
        s2[l2++] = f;
      } else if (o(u2[2])) {
        if (!o(u2[3])) return s2;
        if (!o(u2[4])) {
          var c = u2[4].trim(), d = r.exec(c);
          if (d) {
            p = d[1].trim();
            var m = d[2].trim();
            if (a2.ordered) (S = {}).name = p, S.value = m, S.type = "attr", s2[l2++] = S;
            else if (p in s2.attributes) {
              var v = s2.attributes[p];
              v instanceof Array || (s2.attributes[p] = [v]), s2.attributes[p].push(m);
            } else s2.attributes[p] = m;
          } else s2[l2++] = c;
        }
      } else {
        var p = u2[2].trim(), h = e.toJSON(i2, a2);
        if (a2.ordered) {
          var S;
          (S = {}).name = p, S.value = h, S.type = "rule", s2[l2++] = S;
        } else {
          if (a2.split) var y = p.split(",");
          else y = [p];
          for (var b = 0; b < y.length; b++) {
            var g = y[b].trim();
            if (g in s2.children) for (var C in h.attributes) s2.children[g].attributes[C] = h.attributes[C];
            else s2.children[g] = h;
          }
        }
      }
      return s2;
    }, e.toCSS = function(e2, t2, r2) {
      var n2 = "";
      if (void 0 === t2 && (t2 = 0), void 0 === r2 && (r2 = false), e2.attributes) for (i in e2.attributes) {
        var o2 = e2.attributes[i];
        if (o2 instanceof Array) for (var a2 = 0; a2 < o2.length; a2++) n2 += u(i, o2[a2], t2);
        else n2 += u(i, o2, t2);
      }
      if (e2.children) {
        var s2 = true;
        for (i in e2.children) r2 && !s2 ? n2 += "\n" : s2 = false, n2 += l(i, e2.children[i], t2);
      }
      return n2;
    }, e.toHEAD = function(t2, r2, i2) {
      var n2 = document.getElementsByTagName("head")[0], u2 = document.getElementById(r2), l2 = null !== u2 && u2 instanceof HTMLStyleElement;
      if (!o(t2) && n2 instanceof HTMLHeadElement) {
        if (l2) {
          if (true !== i2 && !o(i2)) return;
          u2.removeAttribute("id");
        }
        (function(e2) {
          return !o(e2) && e2.attributes && e2.children;
        })(t2) && (t2 = e.toCSS(t2));
        var f = document.createElement("style");
        if (f.type = "text/css", o(r2) ? f.id = "cssjson_" + s() : f.id = r2, f.styleSheet ? f.styleSheet.cssText = t2 : f.appendChild(document.createTextNode(t2)), n2.appendChild(f), a(f)) l2 && u2.parentNode.removeChild(u2);
        else {
          if (f.parentNode.removeChild(f), !l2) return;
          u2.setAttribute("id", r2), f = u2;
        }
        return f;
      }
    }, "undefined" != typeof window && (window.createCSS = e.toHEAD);
    var a = function(e2) {
      return e2 instanceof HTMLStyleElement && e2.sheet.cssRules.length > 0;
    }, s = function() {
      return Date.now() || +/* @__PURE__ */ new Date();
    }, u = function(e2, t2, r2) {
      return "	".repeat(r2) + e2 + ": " + t2 + ";\n";
    }, l = function(t2, r2, i2) {
      var n2 = "	".repeat(i2) + t2 + " {\n";
      return n2 += e.toCSS(r2, i2 + 1), n2 += "	".repeat(i2) + "}\n";
    };
  }();
  function loadGoogleDocs(url, iframeDoc, mode) {
    $.ajax({
      url,
      type: "GET",
      success: function(data) {
        if (data) {
          console.log(data);
          var r = confirm("Deseja substituir o conte\xFAdo atual pelo arquivo importado?");
          if (r == true) {
            oEditor.focus();
            oEditor.fire("saveSnapshot");
            if ($(mode == "sheets" ? "#replaceTextSheets" : "#replaceTextDocs").val() == true) {
              iframeDoc.find("body").html(data);
              oEditor.fire("saveSnapshot");
              enableButtonSavePro();
              DocsToSEI(iframeDoc, mode);
            } else {
              var select = oEditor.getSelection().getStartElement();
              var pElement = $(select.$).closest("p");
              if (pElement.length > 0) {
                iframeDoc.find(pElement).before(data);
                oEditor.fire("saveSnapshot");
                enableButtonSavePro();
                DocsToSEI(iframeDoc, mode);
              }
            }
            resetDialogBoxPro("dialogBoxPro");
          }
        }
      },
      error: function(data) {
        alertaBoxPro("Error", "exclamation-triangle", "Nenhum documento encontrado! \nConfira se o documento est\xE1 acess\xEDvel por qualquer pessoa na internet e tente novamente.");
      }
    });
  }
  function getBase64Image(imgObj) {
    var imgUrl = imgObj.attr("src");
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.src = imgUrl;
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      imgObj.attr("src", dataURL).css({ "overflow": "", "display": "", "transform": "", "margin-top": "", "margin-left": "" }).addClass("img-base64");
      imgObj.closest("span").replaceWith(function() {
        return $("img", this);
      });
    };
  }
  function validarTagsPro() {
    for (inst in CKEDITOR.instances) {
      var editor = CKEDITOR.instances[inst];
      if (!editor.readOnly) {
        var tags = ["img", "button", "input", "select", "iframe", "frame", "embed", "object", "param", "video", "audio", "form"];
        for (var i2 = 0; i2 < tags.length; i2++) {
          var elements = editor.document.getElementsByTag(tags[i2]);
          if (elements.count() > 0) {
            switch (tags[i2]) {
              case "img":
                var erro = false;
                if (arrImgPermitida.length == 0) {
                  console.log("Nao sao permitidas imagens no conteudo.");
                  erro = true;
                  break;
                } else {
                  var posIni = null;
                  var posFim = null;
                  var n = elements.count();
                  for (var j = 0; j < n; j++) {
                    ImgSrc = elements.getItem(j).getAttribute("src");
                    posIni = ImgSrc.indexOf("/");
                    if (posIni != -1) {
                      posFim = ImgSrc.indexOf(";", posIni);
                      if (posFim != -1) {
                        posIni = posIni + 1;
                        if (arrImgPermitida.indexOf(ImgSrc.substr(posIni, posFim - posIni)) == -1) {
                          console.log('Imagem formato "' + ImgSrc.substr(posIni, posFim - posIni) + '" nao permitida.');
                          erro = true;
                          break;
                        }
                      } else {
                        console.log("Nao sao permitidas imagens referenciadas.");
                        console.log(ImgSrc, posIni, posFim);
                        erro = true;
                        break;
                      }
                    }
                  }
                }
                if (erro) break;
                continue;
              case "button":
              case "input":
              case "select":
                console.log("Nao sao permitidos componentes de formulario HTML no conteudo.");
                break;
              case "iframe":
                console.log("Nao sao permitidos formularios ocultos no conte\xFAdo.");
                break;
              case "frame":
              case "form":
                console.log("Nao sao permitidos formularios no conte\xFAdo.");
                break;
              case "embed":
              case "object":
              case "param":
                console.log("Nao sao permitidos objetos no conteudo.");
                break;
              case "video":
                console.log("Nao sao permitidos videos no conteudo.");
                break;
              case "audio":
                console.log("Nao e permitido audio no conte\xFAdo.");
                break;
            }
            return false;
          }
        }
      }
    }
    return true;
  }
  function enableButtonSavePro() {
    if (frmEditor.length) {
      var idEditor = $("#idEditor").val();
      $("div#cke_" + idEditor).find(".cke_button__save").removeClass("cke_button_disabled").addClass("cke_button_off").removeAttr("aria-disabled").css("background-color", "");
      CKEDITOR.instances[idEditor].commands.save.state = void 0;
      if (CKEDITOR.dialog.getCurrent() != null) {
        CKEDITOR.dialog.getCurrent().hide();
      }
      console.log("enableButtonSavePro");
    }
  }
  function DocsToSEI(iframeDoc, mode) {
    if (mode == "sheets") {
      iframeDoc.find("body #sheets-viewport div").each(function() {
        var _this = $(this);
        var idTab = _this.attr("id");
        var titleTab = iframeDoc.find("#sheet-button-" + idTab);
        titleTab = titleTab.length > 0 ? titleTab.text() : false;
        _this.show();
        if (titleTab) {
          _this.prepend(
            '<p class="Texto_Alinhado_Esquerda"><br></p><p class="Texto_Alinhado_Esquerda"><strong>' + titleTab + '</strong></p><p class="Texto_Alinhado_Esquerda"><br></p>'
          );
        }
      });
      iframeDoc.find("body #sheets-viewport").css("display", "contents");
      iframeDoc.find("body #top-bar").remove();
      iframeDoc.find("body #footer").remove();
      iframeDoc.find("body table tbody th.row-headers-background.row-header-shim").remove();
    }
    iframeDoc.find("body link").remove();
    iframeDoc.find("body style").data("style", "seipro-import");
    iframeDoc.find("body meta").remove();
    iframeDoc.find("body title").remove();
    iframeDoc.find("body script").remove();
    iframeDoc.find("a").each(function() {
      var urlLink = typeof $(this).attr("href") !== "undefined" && $(this).attr("href") != "" ? $(this).attr("href") : "";
      urlLink = urlLink != "" && urlLink.indexOf("https://www.google.com/url?q=") !== -1 ? getParamsUrlPro(urlLink).q : urlLink;
      $(this).attr("href", urlLink).attr("target", "_blank").attr("rel", "noreferrer");
    });
    ImgToBase64(iframeDoc);
    convertCSSToStyle(iframeDoc);
    enableButtonSavePro();
  }
  function convertCSSToStyle(iframeDoc) {
    var seiproImport = iframeDoc.find('style[data-style="seipro-import"]');
    if (typeof seiproImport !== "undefined" && seiproImport.length > 0) {
      seiproImport.each(function() {
        var css = $.map($(this).text().split(";"), function(substr, i2) {
          return substr.indexOf("@import") === -1 ? substr : null;
        }).join(";");
        $(this).text(css);
      });
      var CSSString = seiproImport.html().toString();
      var arrayCSS = CSSJSON.toJSON(CSSString).children;
      for (var key in arrayCSS) {
        if (arrayCSS.hasOwnProperty(key)) {
          var style = arrayCSS[key].attributes;
          var className = key.toString().replace(".", "");
          if (!$.isEmptyObject(style)) {
            iframeDoc.find(key).each(function() {
              if (typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "P" || typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "SPAN") {
                for (var key2 in style) {
                  if (style.hasOwnProperty(key2)) {
                    if (key2 == "font-style" && style[key2] == "italic") {
                      $(this).wrapInner("<em></em>");
                    } else if (key2 == "font-weight" && (style[key2] == "bold" || style[key2] == "bolder" || parseFloat(style[key2]) >= 600)) {
                      $(this).wrapInner("<strong></strong>");
                    } else if (key2 == "text-decoration" && style[key2] == "underline") {
                      $(this).wrapInner("<u></u>");
                    } else if (key2 == "text-decoration" && style[key2] == "line-through") {
                      $(this).wrapInner("<s></s>");
                    } else if (key2 == "vertical-align" && style[key2] == "sub") {
                      $(this).wrapInner("<sub></sub>");
                    } else if (key2 == "vertical-align" && style[key2] == "super") {
                      $(this).wrapInner("<sup></sup>");
                    }
                  }
                }
              }
              if (typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "P") {
                var styleP = style["text-align"] == "center" ? "Texto_Centralizado" : "Texto_Alinhado_Esquerda";
                styleP = $(this).hasClass("Texto_Centralizado") ? "Texto_Centralizado" : styleP;
                styleP = $(this).hasClass("Tabela_Texto_Alinhado_Esquerda") ? "Tabela_Texto_Alinhado_Esquerda" : styleP;
                var allowed = ["background-color"];
                var filteredStyle = Object.keys(style).filter((key3) => allowed.includes(key3)).reduce((obj, key3) => {
                  obj[key3] = style[key3];
                  return obj;
                }, {});
                $(this).addClass(styleP).removeClass(className);
              } else if (typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "TABLE") {
                $(this).css("margin", "auto");
              } else if (typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "SPAN") {
                var allowed = ["color", "background-color"];
                var filteredStyle = Object.keys(style).filter((key3) => allowed.includes(key3)).reduce((obj, key3) => {
                  obj[key3] = style[key3];
                  return obj;
                }, {});
                $(this).css(filteredStyle).removeClass(className);
                if ($.isEmptyObject(filteredStyle)) {
                  $(this).after($(this).html()).remove();
                }
              } else if (typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "LI" || typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "UL") {
                var allowed = ["margin", "margin-left", "margin-top", "margin-right", "margin-left", "padding", "padding-left", "padding-top", "padding-right", "padding-left", "color", "background-color"];
                var filteredStyle = Object.keys(style).filter((key3) => allowed.includes(key3)).reduce((obj, key3) => {
                  obj[key3] = style[key3];
                  return obj;
                }, {});
                if (typeof $(this)[0] !== "undefined" && $(this)[0].tagName == "LI" && $(this).find("p.Tabela_Texto_Alinhado_Esquerda").length == 0) {
                  $(this).wrapInner("<p></p>").find("p").eq(0).addClass("Tabela_Texto_Alinhado_Esquerda").css("display", "contents");
                }
                $(this).css(filteredStyle).removeClass(className);
              } else {
                $(this).css(style).removeClass(className);
              }
            });
          } else {
            iframeDoc.find(key).each(function() {
              if (typeof $(this)[0] !== "undefined" && ($(this)[0].tagName == "P" || $(this)[0].tagName == "SPAN")) {
                $(this).removeClass(className);
              }
            });
          }
        }
      }
    }
  }
  function ImgToBase64(iframeDoc, TimeOut = 1e3) {
    if (TimeOut <= 0) {
      iframeDoc.find("img").not(".img-base64").each(function() {
        if (!isBase64($(this).attr("src"))) {
          $(this).after('<span style="color:#FF0000;"><span style="background-color:#FFFF00;">[!Erro ao converter a imagem!]</span></span>');
          $(this).remove();
        }
      });
      return;
    }
    iframeDoc.find("img").not(".img-base64").each(function() {
      if (!isBase64($(this).attr("src"))) {
        getBase64Image($(this));
      }
    });
    setTimeout(function() {
      if (!validarTagsPro()) {
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload => " + TimeOut);
        ImgToBase64(iframeDoc, TimeOut - 200);
      }
    }, 1e3);
  }
  function openLinkNewTab(url) {
    var win = window.open(url, "_blank");
    if (win) {
      win.focus();
    } else {
      alert("Por favor, permita popups para essa p\xE1gina");
    }
  }
  function openLinkSEIPro(id_procedimento) {
    var url = url_host + "?acao=procedimento_trabalhar&id_procedimento=" + id_procedimento;
    var win = window.open(url, "_blank");
    if (win) {
      win.focus();
    } else {
      alert("Por favor, permita popups para essa p\xE1gina");
    }
  }
  function openSEINrPro(this_, nrSEI) {
    var _this = $(this_);
    var title = _this.text();
    var iconLoad = _this.find("i").attr("class");
    _this.data("icon-load", iconLoad);
    _this.find("i").attr("class", "fas fa-spinner fa-spin");
    getIDProtocoloSEI(
      nrSEI,
      function(html) {
        let $html = $(html);
        var param = getParamsUrlPro($html.find("#ifrArvore").attr("src"));
        param.title = title;
        console.log(param);
        openDialogDoc(param);
        _this.find("i").attr("class", _this.data("icon-load"));
      },
      function() {
        alertBoxPro();
      }
    );
  }
  function openEditorDoc(paramData) {
    var htmlEditorBox = '<div class="editorBoxProDiv" style="width: 100%; margin: 0; text-align: center;">  <input type="hidden" id="editor_id" value="' + paramData.id + '" tabindex="0">  <textarea id="editor_doc" class="setClassEditor" name="editor_doc" style="min-height: 200px;">' + paramData.text + "</textarea></div>";
    resetDialogBoxPro("editorBoxPro");
    editorBoxPro = $("#editorBoxPro").html(htmlEditorBox).dialog({
      width: 980,
      height: 820,
      title: paramData.title_page ? paramData.title_page : "",
      open: function() {
        updateButtonConfirm(this, true);
        getEditorConfigOptions();
      },
      buttons: [{
        text: "Salvar documento",
        icon: "ui-icon-disk",
        click: function(event2) {
          var dataEditor = configClassicEditor["editor_doc"].getData();
          var action = "edit_documento";
          var param = {
            action,
            id_documento: paramData.id_documento,
            title: paramData.title,
            mode: paramData.mode,
            id_reference: paramData.id_reference,
            reference: paramData.reference,
            type: paramData.type,
            text: dataEditor
          };
          getConfigServer(action, param);
        }
      }]
    });
  }
  function openEditorViewDoc(paramData, paramTarget, dataResult) {
    if (!paramTarget.return_sign || paramTarget.return_sign && (dataResult.status_assinatura || !dataResult.status_assinatura && paramTarget.return_user == arrayConfigAtividades.perfil.id_user)) {
      var htmlEditorBox = '<div class="editorBoxProDiv ck ck-reset ck-editor ck-rounded-corners" style="width: 100%; margin: 0; text-align: center;">  <div class="ck ck-editor__main">      <div id="view_doc" class="readOnly ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" name="view_doc">      </div>  </div>' + (dataResult.status_assinatura ? '  <div class="signed">      <span>          <i class="fas fa-key laranjaColor" style="margin-right: 10px;"></i>          Documento assinado eletronicamente por <strong style="font-weight: bold;">' + dataResult.config.assinatura[0].nome_completo + "</strong>, em " + moment(dataResult.config.assinatura[0].datetime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY [\xE0s] HH:mm") + ", conforme hor\xE1rio oficial de Bras\xEDlia      </span>  </div>" : "") + "</div>";
      resetDialogBoxPro("editorBoxPro");
      var btnDialogBoxPro = [{
        text: "Imprimir Documento",
        icon: "ui-icon-print",
        click: function(event2) {
          printDocumento();
        }
      }];
      if (paramTarget.return_sign && dataResult.status_assinatura) {
        if (checkCapacidade("sign_cancel_documento")) {
          btnDialogBoxPro = [{
            text: "Imprimir Documento",
            icon: "ui-icon-print",
            click: function(event2) {
              printDocumento();
            }
          }, {
            text: "Cancelar Assinatura",
            icon: "ui-icon-close",
            click: function(event2) {
              signCancelDocumento(paramData);
            }
          }];
        }
      } else if (paramTarget.return_sign && !dataResult.status_assinatura && paramTarget.return_user == arrayConfigAtividades.perfil.id_user) {
        btnDialogBoxPro = [{
          text: "Assinar documento",
          class: "confirm ui-state-active",
          click: function(event2) {
            if (!checkDocAssinatura(this)) {
              scrollToElement($(this).closest(".ui-dialog").find("#view_doc"), $(this).closest(".ui-dialog").find(".requiredNull").eq(0));
              alertaBoxPro("Error", "exclamation-triangle", "Preencha os campos sinalizados no documento!", function() {
                $("input.requiredNull").focus();
              });
            } else {
              var _this = this;
              confirmaFraseBoxPro("Voc\xEA est\xE1 de acordo com os termos do documento proposto?", "DE ACORDO", function() {
                var keys = extractDataDocument(_this);
                closeEditorViewBeforeSign(_this);
                var dataEditor = $("#view_doc").html();
                var action = "sign_documento";
                var param = {
                  action,
                  id_documento: paramData.id_documento,
                  title: paramData.title,
                  mode: paramData.mode,
                  id_reference: paramData.id_reference,
                  reference: paramData.reference,
                  text: fixedEncodeURIComponent(dataEditor),
                  keys,
                  type: paramData.type
                };
                getConfigServerDoc(action, param);
              });
            }
          }
        }];
      }
      editorBoxPro = $("#editorBoxPro").html(htmlEditorBox).dialog({
        width: 980,
        height: dataResult.status_assinatura ? 790 : 750,
        title: paramData.title_page ? paramData.title_page : "",
        open: function() {
          updateButtonConfirm(this, true);
          var textEncode = is_html(paramData.text) ? paramData.text : $("<div/>").html(paramData.text).text();
          if (paramData.reference == "modelo" && paramTarget.return_sign) {
            var user = typeof paramTarget.return_user !== "undefined" && paramTarget.return_user ? paramTarget.return_user : false;
            var id_reference = typeof paramTarget.id_reference !== "undefined" && paramTarget.id_reference ? paramTarget.id_reference : false;
            var type = typeof paramTarget.type !== "undefined" && paramTarget.type ? paramTarget.type : false;
            textEncode = setParamEditorAtiv(paramData.mode, textEncode, user, id_reference, type);
          }
          $("#view_doc").html(textEncode);
          if (paramTarget.return_sign) {
            loadFunctionEditorView(this);
          }
        },
        buttons: btnDialogBoxPro
      });
    } else {
      var btnDialogBoxPro = [{
        text: "OK",
        class: "confirm",
        click: function() {
          $(this).dialog("close");
        }
      }];
      if (checkPerfilNivelAdm()) {
        btnDialogBoxPro.unshift({
          text: "Dispensar assinatura",
          icon: "ui-icon-pencil",
          click: function(event2) {
            confirmaBoxPro("Tem certeza que deseja dispensar a assinatura?", function() {
              var action = "sign_documento";
              var param = {
                action,
                id_documento: paramData.id_documento,
                title: paramData.title,
                mode: paramData.mode,
                id_reference: paramData.id_reference,
                reference: paramData.reference,
                text: fixedEncodeURIComponent('<p style="text-align: center;font-size: 11pt;font-family: monospace;color: #666;padding: 10pt 0;">Assinatura dispensada pelo administrador do sistema em ' + moment().format("DD/MM/YYYY [\xE0s] HH:mm") + "</p>"),
                keys: { dispensa_admin: true, data_dispensa: moment().format("YYYY-MM-DD HH:mm:ss") },
                type: paramData.type,
                permission: "dispensa_admin"
              };
              getConfigServerDoc(action, param);
            }, "Dispensar");
          }
        });
      }
      resetDialogBoxPro();
      dialogBoxPro = $("#dialogBoxPro").html('<div id="dialogBoxPro" style="width: auto; min-height: 51.5938px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content"><strong class="alertaErrorPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> Assinatura dispon\xEDvel apenas para o usu\xE1rio!</strong></div>').dialog({
        title: NAMESPACE_SPRO,
        width: 400,
        buttons: btnDialogBoxPro
      });
    }
  }
  function printDocumento() {
    var htmlPrint = $(".signed").length ? $("#view_doc").html() + $(".signed")[0].outerHTML : $("#view_doc").html();
    $("#printBoxPro").addClass("hidePrint").html(htmlPrint);
    $(".infraAreaGlobal").addClass("hidePrint");
    $(".ui-dialog").addClass("hidePrint");
    window.print();
    setTimeout(function() {
      $("#printBoxPro").removeClass("hidePrint").html("");
      $(".infraAreaGlobal").removeClass("hidePrint");
      $(".ui-dialog").removeClass("hidePrint");
    }, 500);
  }
  function checkDocAssinatura(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    var count_list = 0;
    var check_list = false;
    var check_required = false;
    _parent.find('.todo-list input[type="checkbox"]').each(function() {
      count_list = $(this).attr("checked") == "checked" ? count_list + 1 : count_list;
    });
    if (count_list != 1) {
      _parent.find(".todo-list").addClass("requiredNull");
      check_list = true;
    } else {
      _parent.find(".todo-list").removeClass("requiredNull");
    }
    _parent.find("input").each(function() {
      if ($(this).prop("required") && $(this).val() == "") {
        $(this).addClass("requiredNull");
        check_required = true;
      } else {
        $(this).removeClass("requiredNull");
      }
    });
    return !check_list && !check_required ? true : false;
  }
  function closeEditorViewBeforeSign(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    var style_field = "font-weight: bold;padding: 5px 8px;margin: 5px 0px;display: inline-block;background: #f5f5f5;border-radius: 5px;";
    _parent.find('input[type="time"]').each(function() {
      $(this).after('<span style="' + style_field + '">' + $(this).val() + "</span>").remove();
    });
    _parent.find("select").each(function() {
      $(this).after('<span style="' + style_field + '">' + $(this).find("option:selected").val() + "</span>").remove();
    });
    _parent.find('input[type="text"]').each(function() {
      $(this).after('<span style="' + style_field + '">' + $(this).val() + "</span>").remove();
    });
    _parent.find('input[type="number"]').each(function() {
      $(this).after('<span style="' + style_field + '">' + parseInt($(this).val()) + "</span>").remove();
    });
    _parent.find('input[type="date"]').each(function() {
      $(this).after('<span style="' + style_field + '">' + moment($(this).val(), "YYYY-MM-DD").format("DD/MM/YYYY") + "</span>").remove();
    });
    _parent.find('input[type="datetime-local"]').each(function() {
      $(this).after('<span style="' + style_field + '">' + moment($(this).val(), "YYYY-MM-DDTHH:mm").format("DD/MM/YYYY HH:mm") + "</span>").remove();
    });
    _parent.find('input[type="checkbox"]').each(function() {
      if ($(this).attr("checked") == "checked") {
        var icone = "[X]";
        $(this).closest("label").css({ "background": "#f5f5f5", "border-radius": "5px", "text-decoration": "underline" });
        $(this).closest("label").find(".todo-list__label__description").css({ "font-weight": "bold" });
      } else {
        var icone = "[_]";
      }
      $(this).after('<span style="' + style_field + '">' + icone + "</span>").remove();
    });
  }
  function loadFunctionEditorView(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    _parent.find(".todo-list__label").find('input[type="checkbox"]').prop("disabled", false);
    _parent.find(".todo-list__label").unbind().on("click", function(e) {
      e.preventDefault();
      $('.todo-list__label input[type="checkbox"]').not(this).attr("checked", false);
      var checkbox = $(this).find('input[type="checkbox"]');
      if (checkbox.attr("checked") == "checked") {
        checkbox.removeProp("checked");
        checkbox.removeAttr("checked");
      } else {
        checkbox.prop("checked", "checked");
        checkbox.attr("checked", "checked");
      }
    });
    if (typeof $.mask !== "undefined") {
      if (_parent.find("input[data-key='tel_celular']").length > 0) {
        _parent.find("input[data-key='tel_celular']").mask("+99 (99) 99999-999?9", { placeholder: "+55 (__) _____-____", completed: function() {
          this.removeClass("requiredNull");
        } }).on("focus", function() {
          setTimeout(() => {
            if ($(this).val() == "+55 (__) _____-____") {
              setCaretPosition(this, 5);
            }
          }, 1e3);
        });
      }
      if (_parent.find("input[data-key='tel_residencial']").length > 0) {
        _parent.find("input[data-key='tel_residencial']").mask("(99) 9999-9999");
      }
    }
  }
  function getEditorConfigOptions(readonly = false) {
    if ($(".setClassEditor").length > 0) {
      $(".setClassEditor").each(function() {
        ClassicEditor.create(this, {
          toolbar: readonly ? null : {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "link",
              "bulletedList",
              "numberedList",
              "alignment",
              "|",
              "fontColor",
              "fontBackgroundColor",
              "fontFamily",
              "fontSize",
              "|",
              "highlight",
              "strikethrough",
              "subscript",
              "superscript",
              "horizontalLine",
              "|",
              "undo",
              "redo",
              "-",
              "todoList",
              "insertTable",
              "|",
              "blockQuote",
              "outdent",
              "indent",
              "|",
              "htmlEmbed",
              "mediaEmbed",
              "sourceEditing"
            ],
            shouldNotGroupWhenFull: true
          },
          language: "pt-br",
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side"
            ]
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableCellProperties",
              "tableProperties"
            ]
          }
        }).then((editor) => {
          console.log("Editor was initialized", editor);
          configClassicEditor[$(this).attr("id")] = editor;
          if (readonly) {
            configClassicEditor[$(this).attr("id")].isReadOnly = true;
          }
        }).catch((error) => {
          console.error(error);
        });
      });
    }
  }
  function openDialogAnexo(this_) {
    var _this = $(this_);
    var data = _this.data();
    var iconLoad = _this.find("i").attr("class");
    _this.data("icon-load", iconLoad);
    _this.find("i").attr("class", "fas fa-spinner fa-spin");
    var btnDialogBoxPro = [{
      text: "Baixar",
      icon: "ui-icon-disk",
      click: function(event2) {
        var link = document.createElement("a");
        link.href = data.url;
        link.download = data.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, {
      text: "Abrir",
      icon: "ui-icon-extlink",
      click: function(event2) {
        var win = window.open(data.url, "_blank");
        if (win) {
          win.focus();
        } else {
          alert("Por favor, permita popups para essa p\xE1gina");
        }
        resetDialogBoxPro("iframeBoxPro");
      }
    }];
    resetDialogBoxPro("iframeBoxPro");
    iframeBoxPro = $("#iframeBoxPro").html('<div class="iframeBoxDiv" style="width: 100%; height: 100%; margin: 0;"><iframe src="' + data.url + '" frameborder="0" height="100%" width="100%"></iframe></div>').dialog({
      width: 950,
      height: $(window).height(),
      title: data.title,
      open: function() {
        _this.find("i").attr("class", _this.data("icon-load"));
      },
      buttons: btnDialogBoxPro
    });
  }
  function openDialogDoc(param, forceDownload = false, _this = false) {
    var href = url_host + "?acao=procedimento_trabalhar&id_procedimento=" + param.id_procedimento + "&id_documento=" + param.id_documento;
    if (forceDownload) {
      _this.find("i").attr("class", "fas fa-spinner fa-spin");
    } else {
      var btnDialogBoxPro = [{
        text: "Imprimir",
        icon: "ui-icon-print",
        click: function(event2) {
          var htmlPrint = $(".iframeBoxDiv iframe").contents().find("html");
          $("#printBoxPro").addClass("hidePrint").html(htmlPrint);
          $(".infraAreaGlobal").addClass("hidePrint");
          $(".ui-dialog").addClass("hidePrint");
          window.print();
          setTimeout(function() {
            $("#printBoxPro").removeClass("hidePrint").html("");
            $(".infraAreaGlobal").removeClass("hidePrint");
            $(".ui-dialog").removeClass("hidePrint");
            resetDialogBoxPro("iframeBoxPro");
          }, 500);
        }
      }, {
        text: "Baixar",
        icon: "ui-icon-disk",
        click: function(event2) {
          var iframeBoxDiv = $(".iframeBoxDiv iframe").contents();
          var nameFile = iframeBoxDiv.find("title").text();
          var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
          contentDocument += iframeBoxDiv.find("html")[0].outerHTML;
          var downloadLink = document.createElement("a");
          var blob = new Blob(["\uFEFF", contentDocument]);
          var url = URL.createObjectURL(blob);
          downloadLink.href = url;
          downloadLink.download = nameFile + ".html";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      }, {
        text: "Abrir",
        icon: "ui-icon-extlink",
        click: function(event2) {
          var win = window.open(href, "_blank");
          if (win) {
            win.focus();
          } else {
            alert("Por favor, permita popups para essa p\xE1gina");
          }
          resetDialogBoxPro("iframeBoxPro");
        }
      }];
      resetDialogBoxPro("iframeBoxPro");
      iframeBoxPro = $("#iframeBoxPro").html('<div class="iframeBoxDiv" style="width: 100%; margin: 10% 0; text-align: center;"><i class="fas fa-spinner fa-spin azulColor" style="font-size: 22pt;"></i></div>').dialog({
        width: 500,
        height: 200,
        title: param.title ? param.title : "",
        buttons: btnDialogBoxPro
      });
    }
    $.ajax({ url: href }).done(function(html) {
      let $html = $(html);
      var urlArvore = $html.find("#ifrArvore").attr("src");
      $.ajax({ url: urlArvore }).done(function(htmlArvore) {
        var urlVisualizacao = $.map(htmlArvore.split("\n"), function(substr, i2) {
          return substr.indexOf("'controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento=" + param.id_documento + "&") !== -1 ? substr : null;
        }).join("");
        urlVisualizacao = urlVisualizacao != "" ? urlVisualizacao.split("'")[1] : false;
        urlVisualizacao = urlVisualizacao ? url_host + urlVisualizacao.replace("controlador.php", "") : false;
        var procVisualizacao = $.map(htmlArvore.split("\n"), function(substr, i2) {
          return substr.indexOf('new infraArvoreNo("PROCESSO"') !== -1 ? substr : null;
        }).join("");
        procVisualizacao = procVisualizacao != "" ? procVisualizacao.split(",") : false;
        procVisualizacao = procVisualizacao ? procVisualizacao[procVisualizacao.length - 1] : false;
        procVisualizacao = procVisualizacao ? procVisualizacao.split('"')[1] : false;
        if (urlVisualizacao) {
          if (forceDownload) {
            if ($("#frmCheckerProcessoPro").length == 0) {
              getCheckerProcessoPro();
            }
            $("#frmCheckerProcessoPro").attr("src", urlVisualizacao).unbind().on("load", function() {
              var nameFile = $(this).contents().find("title").text();
              var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
              contentDocument += $(this).contents().find("html")[0].outerHTML;
              var downloadLink = document.createElement("a");
              var blob = new Blob(["\uFEFF", contentDocument]);
              var url = URL.createObjectURL(blob);
              downloadLink.href = url;
              downloadLink.download = nameFile + ".html";
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              _this.attr("onmouseover", "return infraTooltipMostrar('Documento baixado')").find("i").attr("class", "fas fa-download verdeColor");
              _this.closest("tr").addClass("infraTrAcessada").addClass("infraDocBaixado");
            });
          } else {
            resetDialogBoxPro("iframeBoxPro");
            iframeBoxPro = $("#iframeBoxPro").html('<div class="iframeBoxDiv" style="width: 100%; height: 100%; margin: 0;"><iframe src="' + urlVisualizacao + '" frameborder="0" height="100%" width="100%"></iframe></div>').dialog({
              width: 950,
              height: $(window).height(),
              title: param.title ? param.title : "",
              close: function() {
                iframeBoxPro = false;
                $(".iframeBoxPro").html("");
              },
              buttons: btnDialogBoxPro
            });
          }
        } else {
          if (forceDownload) {
            _this.attr("onmouseover", "return infraTooltipMostrar('Erro ao baixar documento')").find("i").attr("class", "fas fa-exclamation-circle vermelhoColor");
          } else {
            resetDialogBoxPro("iframeBoxPro");
            alertaBoxPro("Error", "exclamation-triangle", 'N\xE3o foi poss\xEDvel acessar o documento. <br> Verifique se o processo <a href="' + href + '" target="_blank" class="bLink" style="text-decoration: underline; font-size: 10pt;">' + procVisualizacao + '<i class="fas fa-external-link-alt bLink"" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i></a> est\xE1 acess\xEDvel para sua unidade');
          }
        }
      }).fail(function(data) {
        if (forceDownload) {
          _this.attr("onmouseover", "return infraTooltipMostrar('Erro ao baixar documento')").find("i").attr("class", "fas fa-exclamation-circle vermelhoColor");
        } else {
          resetDialogBoxPro("iframeBoxPro");
          alertaBoxPro("Error", "exclamation-triangle", "Erro ao acessar o documento.");
        }
      });
    }).fail(function(data) {
      if (forceDownload) {
        _this.attr("onmouseover", "return infraTooltipMostrar('Erro ao baixar documento')").find("i").attr("class", "fas fa-exclamation-circle vermelhoColor");
      } else {
        resetDialogBoxPro("iframeBoxPro");
        alertaBoxPro("Error", "exclamation-triangle", "Erro ao acessar o documento.");
      }
    });
  }
  function getContentDocSEI(param, callback) {
    var urlProcesso = "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + param.id_procedimento + "&id_documento=" + param.id_documento;
    $.ajax({ url: urlProcesso }).done(function(html) {
      let $html = $(html);
      var urlArvore = $html.find("#ifrArvore").attr("src");
      $.ajax({ url: urlArvore }).done(function(htmlArvore) {
        var urlVisualizacao = $.map(htmlArvore.split("\n"), function(substr, i2) {
          return substr.indexOf("'controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento=" + param.id_documento + "&") !== -1 ? substr : null;
        }).join("");
        urlVisualizacao = urlVisualizacao != "" ? urlVisualizacao.split("'")[1] : false;
        urlVisualizacao = urlVisualizacao ? url_host + urlVisualizacao.replace("controlador.php", "") : false;
        if (urlVisualizacao) {
          $.ajax({ url: urlVisualizacao }).done(function(contentDoc) {
            if (typeof callback === "function") callback(contentDoc);
          }).fail(function(data) {
            alertaBoxPro("Error", "exclamation-triangle", "Erro ao acessar o documento.");
          });
        }
      }).fail(function(data) {
        alertaBoxPro("Error", "exclamation-triangle", "Erro ao acessar o documento.");
      });
    }).fail(function(data) {
      alertaBoxPro("Error", "exclamation-triangle", "Erro ao acessar o documento.");
    });
  }
  function updateDialogDefinitionPro() {
    CKEDITOR.on("dialogDefinition", function(ev) {
      var dialogName = ev.data.name;
      var dialogDefinition = ev.data.definition;
      var dialog = dialogDefinition.dialog;
      if (dialogName == "linkseiDialog") {
        dialogDefinition.onShow = function() {
          var idEditor = this.getParentEditor().name;
          $("#idEditor").val(idEditor);
          insertProtocoloOnBox(idEditor);
        };
      }
      if (dialogName == "simpleLinkDialog") {
        dialogDefinition.onShow = function() {
          var idEditor = this.getParentEditor().name;
          $("#idEditor").val(idEditor);
          insertTextTotLink(idEditor);
        };
        dialogDefinition.onOk = function() {
          var a = this.getParentEditor(), b = {}, c = a.document.createElement("a");
          this.commitContent(b);
          c.setAttribute("href", b.url);
          b.newPage && c.setAttribute("target", "_blank");
          switch (b.style) {
            case "b":
              c.setStyle("font-weight", "bold");
              break;
            case "u":
              c.setStyle("text-decoration", "underline");
              break;
            case "i":
              c.setStyle("font-style", "italic");
          }
          c.setHtml(b.contents);
          a.insertElement(c);
          setTimeout(function() {
            initDropImages();
          }, 1e3);
        };
      }
    });
  }
  function centralizeDialogBoxEditor() {
    let dialog = CKEDITOR.dialog.getCurrent();
    if (!!dialog) dialog.move(dialog.getPosition().x, ($(window).height() - $(".cke_dialog_body").height()) / 2);
  }
  function centralizeDialogBox(el, resize = true) {
    if (!dialogIsDraggable) {
      $(document).ready(function() {
        if (el) {
          var paramPos = $(window).height() > $(el).outerHeight() ? { my: "center", at: "center", of: window } : { my: "top", at: "top", of: window };
          el.dialog({ position: paramPos, width: resize && $(el).outerWidth() < 800 ? "auto" : void 0 });
          if (resize) el.dialog({ width: $(el).outerWidth() });
        }
      });
    }
  }
  function resizeHeigthDialogBox(dialogBox = dialogBoxPro) {
    const heightSelectBox = dialogBox ? dialogBox.find(".dialogBoxDiv").outerHeight(true) : 0;
    const heightDialogUI = dialogBox ? dialogBox.closest(".ui-dialog").outerHeight(true) : 0;
    const heightDialogBox = dialogBox ? dialogBox.outerHeight(true) : 0;
    const diff = parseInt(heightSelectBox - heightDialogBox);
    if (diff > 0) dialogBox.dialog({ height: heightDialogUI + diff });
  }
  var getImageBase64FromImgElement = async (imgElement) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        } catch (e) {
          reject("Erro ao converter imagem para base64");
        }
      };
      img.onerror = () => reject("Erro ao carregar imagem");
      img.src = imgElement.src;
    });
  };
  var getDataBodyResolveCaptcha = (prompt_text, imageBase64 = null) => {
    const parts = imageBase64 ? [
      { text: prompt_text },
      {
        inlineData: {
          mimeType: "image/png",
          // ou "image/jpeg"
          data: imageBase64.replace(/^data:image\/(png|jpeg);base64,/, "")
        }
      }
    ] : [
      { text: prompt_text }
    ];
    return JSON.stringify({
      contents: [{ role: "user", parts }]
    });
  };
  var resolveCaptchaAI = async (prompt_text, imageBase64 = null) => {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${perfilGemini.KEY_USER}`;
    const data = getDataBodyResolveCaptcha(prompt_text, imageBase64);
    var hasRuntime = typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;
    var net = hasRuntime && (typeof SeiPro !== "undefined" && SeiPro.core && SeiPro.core.net);
    if (net) {
      return net.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
      }).then(function(response) {
        if (response.status === 200) {
          try {
            return JSON.parse(response.body).candidates[0].content.parts[0].text;
          } catch (e) {
            return Promise.reject("Erro ao processar a resposta da IA");
          }
        }
        try {
          var error = JSON.parse(response.body);
          var errorMsg = error?.error?.message ?? "Erro inesperado";
          console.error(errorMsg);
          return Promise.reject(errorMsg);
        } catch (e) {
          return Promise.reject("Erro inesperado");
        }
      }, function() {
        return Promise.reject("Erro inesperado");
      });
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              let responseText = JSON.parse(xhr.responseText);
              responseText = responseText.candidates[0].content.parts[0].text;
              resolve(responseText);
            } catch (e) {
              reject("Erro ao processar a resposta da IA");
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              const errorMsg = error?.error?.message ?? "Erro inesperado";
              console.error(errorMsg);
              reject(errorMsg);
            } catch (e) {
              reject("Erro inesperado");
            }
          }
        }
      };
      xhr.send(data);
    });
  };
  function checkInternalWidthDialogBox() {
    var dialogBoxW = $("#dialogBoxPro").width();
    var dialogBoxTableW = $("#dialogBoxPro table").width();
    if (dialogBoxTableW > dialogBoxW) {
      var widthDialog = dialogBoxTableW + 35;
      widthDialog = widthDialog > $(window).width() ? $(window).width() : widthDialog;
      dialogBoxPro.dialog("option", "width", widthDialog);
    }
  }
  function selectTextPro(el) {
    var sel, range;
    if (window.getSelection && document.createRange) {
      sel = window.getSelection();
      if (sel.toString() == "") {
        window.setTimeout(function() {
          range = document.createRange();
          range.selectNodeContents(el);
          sel.removeAllRanges();
          sel.addRange(range);
        }, 1);
      }
    }
  }
  function hashCompareDocToggle(this_) {
    if ($(this_).find("i").hasClass("fa-chevron-circle-down")) {
      $(this_).closest("#hashIntegrityPro").find(".hashCompareDoc").show();
      $(this_).find("i").addClass("fa-chevron-circle-up").removeClass("fa-chevron-circle-down");
    } else {
      $(this_).closest("#hashIntegrityPro").find(".hashCompareDoc").hide();
      $(this_).find("i").addClass("fa-chevron-circle-down").removeClass("fa-chevron-circle-up");
    }
  }
  function updateChecksumPro(hash) {
    var nameDoc = $("#ifrArvore").contents().find(".infraArvoreNoSelecionado").text();
    var droppableDoc = '  <div class="input">      <div id="droppable-zone">          <div id="droppable-zone-wrapper">              <div id="droppable-zone-text"><i class="fa fa-upload cinzaColor" style="font-size: 16pt;"></i> Clique ou arraste para carregar um documento</div>          </div>          <input id="inputCompareDoc" type="file" placeholder="Clique ou arraste para carregar um documento" class="droppable-file">      </div>  </div>';
    var tableIntegrity = '<table>  <tr>    <td colspan="2"><h3><i class="iconPopup fa fa-file azulColor" style="margin: 3px 3px 0 0;"></i>' + nameDoc + '</h3></td>  </tr>  <tr>    <td><label>MD5:</label></td>    <td><label class="hash hashMD5">' + hash.hashMD5 + '</label></td>  </tr>  <tr>    <td><label>SHA256:</label></td>    <td><label class="hash hashSHA256">' + hash.hashSHA256 + '</label></td>  </tr></table><div><a onclick="hashCompareDocToggle(this)" class="newLink link_line" style="cursor:pointer"><i class="fa fa-chevron-circle-down cinzaColor" style="margin: 3px 3px 0 0;"></i> Comparar documento</a></div><div class="hashCompareDoc" style="display:none;">          <input id="inputCompareDoc" style="font-size: 10pt; padding: 15px 10px;" type="file" placeholder="Clique ou arraste para carregar um documento">  <div id="outputompareDoc" style="border-radius: 10px; padding: 0 10px;"></div></div>';
    $("#hashIntegrityPro").html(tableIntegrity).find("label.hash").on("mouseup", function() {
      selectTextPro($(this)[0]);
    });
    $("#inputCompareDoc").on("change", function() {
      var input = $("#inputCompareDoc")[0];
      if (input.files && input.files[0]) {
        centralizeDialogBox(dialogBoxPro);
        $("#outputompareDoc").html('<i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...').css("background", "#fff");
        var global = global || window;
        const reader = new global.FileReader();
        reader.onload = (event2) => {
          var result = event2.target.result;
          var wordArray = CryptoJS.lib.WordArray.create(result), hashMD5 = CryptoJS.MD5(wordArray).toString(), hashSHA256 = CryptoJS.SHA256(wordArray).toString();
          compareChecksumPro({ hashMD5, hashSHA256 });
        };
        reader.readAsArrayBuffer(input.files[0]);
      }
    });
  }
  function compareChecksumPro(hash) {
    var hashMD5 = $("#hashIntegrityPro").find(".hashMD5").text();
    var hashSHA256 = $("#hashIntegrityPro").find(".hashSHA256").text();
    var statusCompare = hashMD5 == hash.hashMD5 && hashSHA256 == hash.hashSHA256 ? { background: "#f8fdf7", icon: "check-circle", color: "verdeColor", text: "Os c\xF3digos de integridade s\xE3o id\xEAnticos" } : { background: "#fdf7f7", icon: "times-circle", color: "vermelhoColor", text: "Os c\xF3digos de integridade N\xC3O s\xE3o id\xEAnticos" };
    var tableIntegrityCompare = '<table>  <tr>    <td colspan="2"><h3><i class="iconPopup fa fa-' + statusCompare.icon + " " + statusCompare.color + '" style="font-size: 18pt;"></i>' + statusCompare.text + '</h3></td>  </tr>  <tr>    <td><label>MD5:</label></td>    <td><label class="hash hashMD5_compare">' + hash.hashMD5 + '</label></td>  </tr>  <tr>    <td><label>SHA256:</label></td>    <td><label class="hash hashSHA256_compare">' + hash.hashSHA256 + "</label></td>  </tr></table>";
    $("#outputompareDoc").html(tableIntegrityCompare).css("background", statusCompare.background).find("label.hash").on("mouseup", function() {
      selectTextPro($(this)[0]);
    });
    centralizeDialogBox(dialogBoxPro);
  }
  function openChecksumPro() {
    var htmlBox = '<div id="hashIntegrityPro"><i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...</div>';
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "Visualizar C\xF3digo de Integridade",
      width: 650
    });
  }
  function calculateHashPro(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function() {
      var wordArray = CryptoJS.lib.WordArray.create(reader.result), hashMD5 = CryptoJS.MD5(wordArray).toString(), hashSHA256 = CryptoJS.SHA256(wordArray).toString();
      updateChecksumPro({ hashMD5, hashSHA256 });
      centralizeDialogBox(dialogBoxPro);
    };
  }
  function sendChecksumPro(url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onreadystatechange = function(event2) {
      if (event2.target.readyState == 4) {
        if (event2.target.status == 200 || event2.target.status == 0) {
          var blob = this.response;
          calculateHashPro(blob);
        } else {
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }
  function getChecksumPro() {
    var linkAnexo = $($ifrVisualizacao).contents().find(divInformacao + " a");
    var url = linkAnexo.length > 0 && linkAnexo.attr("href").indexOf("acao=documento_download_anexo") !== -1 ? linkAnexo.attr("href") : false;
    if (url) {
      openChecksumPro();
      sendChecksumPro(url);
    }
  }
  function noNotifyPro(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".no_notifyPro");
    var data = _parent.data();
    if (_this.is(":checked")) {
      setOptionsPro("noNotify_" + data.notify, true);
    } else {
      removeOptionsPro("noNotify_" + data.notify);
    }
  }
  function checkPageVisualizacao() {
    const ifrV = SeiPro.sei.adapter.isSEI5() ? $($ifrVisualizacao).contents().find("#ifrVisualizacao").contents() : $($ifrVisualizacao).contents();
    waitLoadPro(ifrV, "#frmDocumentoCadastro", "label#lblPublico", setNewDocDefault);
    waitLoadPro(ifrV, "#frmProcedimentoCadastro", "#divInfraBarraComandosSuperior", setHtmlProtocoloAlterar);
    waitLoadPro(ifrV, '#frmAtividadeListar[action*="acao=procedimento_enviar"]', infraBarraComandos, getActionsOnSendProcess);
    waitLoadPro(ifrV, '#frmProcedimentoHistorico[action*="acao=procedimento_consultar_historico"]', ".infraAreaTabela", initTablePaginacaoHistorico);
    waitLoadPro(ifrV, "form", "select", replaceSelectAllVisualizacao);
    waitLoadPro(ifrV, "form", "#optRestrito", insertActionHipoteseLegal);
    waitLoadPro(ifrV, "form", ".infraImg, .InfraImg", function() {
      setInfraImg($($ifrVisualizacao).contents());
    });
  }
  function addUrgentPro(this_) {
    var _this = $(this_);
    var text = _this.closest(".infraAreaDados").find('input[type="text"]').last();
    if (text.length && text.val().toLowerCase().indexOf("(urgente)") !== -1) {
      text.val(text.val().replace(/\(urgente\)/ig, "").trim());
    } else if (text.length && typeof text.val() !== "undefined") {
      text.val(text.val().trim() + " (URGENTE)");
    }
  }
  function setNewDocDefault() {
    var ifrVisualizacao2 = SeiPro.sei.adapter.isSEI5() ? $($ifrVisualizacao).contents().find("#ifrVisualizacao").contents() : $($ifrVisualizacao).contents();
    ifrVisualizacao2.find("#txtProtocoloDocumentoTextoBase").removeAttr("maxlength");
    var form = ifrVisualizacao2.find("#frmDocumentoCadastro");
    var now = moment().format("DD/MM/YYYY");
    if (form.length > 0 && ifrVisualizacao2.find("#txtNumero").length) {
      ifrVisualizacao2.find("div.urgentePro").remove();
      ifrVisualizacao2.find("#txtNumero").css("width", "46%").attr("data-oldtext", ifrVisualizacao2.find("#txtNumero").val()).after(`<div class="urgentePro" style="right: 48%;top: 10px;" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar('Adicionar/remover marca de Urg\xEAncia');" onmouseout="return infraTooltipOcultar();"></div>`);
      formControlerAlterarDocumento(ifrVisualizacao2);
    }
    if (form.length > 0 && typeof checkConfigValue !== "undefined" && checkConfigValue("newdocdefault")) {
      if (form.attr("action").indexOf("controlador.php?acao=documento_gerar&acao_origem=documento_gerar&arvore=1") !== -1) {
        if (checkConfigValue("newdocnivel")) {
          ifrVisualizacao2.find("#optPublico").trigger("click");
        }
        if (getConfigValue("newdocname") && ifrVisualizacao2.find("#txtNumero").is(":visible")) {
          ifrVisualizacao2.find("#txtNumero").val(getConfigValue("newdocname"));
        }
        if (getConfigValue("newdocobs")) {
          ifrVisualizacao2.find("#txaObservacoes").val(getConfigValue("newdocobs"));
        }
        if (getConfigValue("newdocespec")) {
          ifrVisualizacao2.find("#txtDescricao").val(getConfigValue("newdocespec"));
        }
        if (checkConfigValue("newdocsigilo")) {
          var valueNewDocSigilo = getConfigValue("newdocsigilo");
          valueNewDocSigilo = valueNewDocSigilo != "" && valueNewDocSigilo.indexOf("|") !== -1 ? valueNewDocSigilo.split("|") : false;
          if (valueNewDocSigilo) {
            ifrVisualizacao2.find('input[name="rdoNivelAcesso"][value="' + valueNewDocSigilo[1] + '"]').trigger("click");
            waitLoadPro(ifrVisualizacao2, "#selHipoteseLegal", 'option[value="' + valueNewDocSigilo[0] + '"]', function() {
              ifrVisualizacao2.find("#selHipoteseLegal").val(valueNewDocSigilo[0]).trigger("chosen:updated");
            });
          }
        }
      } else if (form.attr("action").indexOf("controlador.php?acao=documento_receber&acao_origem=documento_receber&arvore=1") !== -1) {
        if (typeof checkConfigValue !== "undefined" && checkConfigValue("newdocformat") && getConfigValue("newdocformat").indexOf("digitalizado") !== -1) {
          ifrVisualizacao2.find("#optDigitalizado").trigger("click");
          var tipoConferencia = parseInt(getConfigValue("newdocformat").split("_")[1]);
          ifrVisualizacao2.find("#selTipoConferencia").val(tipoConferencia);
        } else {
          ifrVisualizacao2.find("#optNato").trigger("click");
        }
        if (typeof checkConfigValue !== "undefined" && checkConfigValue("newdocnivel")) {
          ifrVisualizacao2.find("#optPublico").trigger("click");
        }
        if (typeof checkConfigValue !== "undefined" && checkConfigValue("newdoctoday")) {
          ifrVisualizacao2.find("#txtDataElaboracao").val(now);
        }
        if (typeof getConfigValue !== "undefined" && getConfigValue("newdocname") && ifrVisualizacao2.find("#txtNumero").is(":visible")) {
          ifrVisualizacao2.find("#txtNumero").val(getConfigValue("newdocname"));
        }
        if (typeof getConfigValue !== "undefined" && getConfigValue("newdocobs")) {
          ifrVisualizacao2.find("#txaObservacoes").val(getConfigValue("newdocobs"));
        }
        if (typeof getConfigValue !== "undefined" && getConfigValue("newdocespec")) {
          ifrVisualizacao2.find("#txtDescricao").val(getConfigValue("newdocespec"));
        }
        if (typeof checkConfigValue !== "undefined" && checkConfigValue("newdocsigilo")) {
          var valueNewDocSigilo = getConfigValue("newdocsigilo");
          valueNewDocSigilo = valueNewDocSigilo != "" && valueNewDocSigilo.indexOf("|") !== -1 ? valueNewDocSigilo.split("|") : false;
          if (valueNewDocSigilo) {
            ifrVisualizacao2.find('input[name="rdoNivelAcesso"][value="' + valueNewDocSigilo[1] + '"]').trigger("click");
            waitLoadPro(ifrVisualizacao2, "#selHipoteseLegal", 'option[value="' + valueNewDocSigilo[0] + '"]', function() {
              ifrVisualizacao2.find("#selHipoteseLegal").val(valueNewDocSigilo[0]).trigger("chosen:updated");
            });
          }
        }
      }
    }
  }
  function setNewProcDefault() {
    var form = $("#frmProcedimentoCadastro");
    var now = moment().format("DD/MM/YYYY");
    if (form.length > 0 && $("#txtNumero").length) {
      $("div.urgentePro").remove();
      $("#txtDescricao").css("width", "46%").attr("data-oldtext", $("#txtDescricao").val()).after(`<div class="urgentePro" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar('Adicionar/remover marca de Urg\xEAncia');" onmouseout="return infraTooltipOcultar();"></div>`);
      formControlerAlterarDocumento(ifrVisualizacao);
    }
    if (form.length > 0 && typeof checkConfigValue !== "undefined" && checkConfigValue("newdocdefault")) {
      if (form.attr("action").indexOf("controlador.php?acao=procedimento_gerar&acao_origem=procedimento_gerar") !== -1) {
        if (checkConfigValue("newdocnivel")) {
          $("#optPublico").trigger("click");
        }
        if (getConfigValue("newdocobs")) {
          $("#txaObservacoes").val(getConfigValue("newdocobs"));
        }
        if (getConfigValue("newdocespec")) {
          $("#txtDescricao").val(getConfigValue("newdocespec"));
        }
        if (checkConfigValue("newdocsigilo")) {
          var valueNewDocSigilo = getConfigValue("newdocsigilo");
          valueNewDocSigilo = valueNewDocSigilo != "" && valueNewDocSigilo.indexOf("|") !== -1 ? valueNewDocSigilo.split("|") : false;
          if (valueNewDocSigilo) {
            $('input[name="rdoNivelAcesso"][value="' + valueNewDocSigilo[1] + '"]').trigger("click");
            waitLoadPro(ifrVisualizacao, "#selHipoteseLegal", 'option[value="' + valueNewDocSigilo[0] + '"]', function() {
              $("#selHipoteseLegal").val(valueNewDocSigilo[0]).trigger("chosen:updated");
            });
          }
        }
        if (checkConfigValue("newproc_selfunidade")) {
          var siglaUnidadePesquisa = siglaUnidadeAtual;
          $("head script").each(function() {
            if (typeof $(this).attr("src") === "undefined" && $(this).html().indexOf("acao_ajax") !== -1) {
              var text = $(this).html();
              var link = $.map(text.split("'"), function(substr, i2) {
                return i2 % 2 && substr.indexOf("controlador_ajax.php?acao_ajax=contato_auto_completar") !== -1 ? substr : null;
              });
              if (link.length) {
                $.ajax({
                  type: "POST",
                  url: link[0],
                  dataType: "text",
                  data: {
                    palavras_pesquisa: siglaUnidadePesquisa
                  },
                  success: function(result) {
                    var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>', "")).html();
                    var id_result = $(html_result).map(function() {
                      if ($(this).attr("descricao").indexOf("(" + siglaUnidadePesquisa + ")") !== -1) return { id: $(this).attr("id"), descricao: $(this).attr("descricao") };
                    }).get();
                    if (typeof id_result[0] !== "undefined") {
                      var hdnInteressadosProcedimento = id_result[0].id + "\xB1" + id_result[0].descricao;
                      $("#hdnInteressadosProcedimento").val(hdnInteressadosProcedimento);
                      $("#selInteressadosProcedimento").append('<option value="' + id_result[0].id + '">' + id_result[0].descricao + "</option>");
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  function formControlerAlterarDocumento(ifrVisualizacao2) {
    ifrVisualizacao2.find("#frmDocumentoCadastro").attr("onsubmit", "return OnSubmitForm();parent.confirmaDadosUrgencia(this);");
  }
  function confirmaDadosUrgencia(_this) {
    if (delayCrash) return false;
    delayCrash = true;
    setTimeout(function() {
      delayCrash = false;
    }, 300);
    var _this = $(_this);
    var contentW = $($ifrVisualizacao)[0].contentWindow;
    var _parent = _this.closest("body");
    var oldText = _parent.find("#txtNumero").attr("data-oldtext");
    var newText = _parent.find("#txtNumero").val();
    var checkAddUrgencia = typeof oldText !== "undefined" && oldText.toLowerCase().indexOf("(urgente)") === -1 && typeof newText !== "undefined" && newText.toLowerCase().indexOf("(urgente)") !== -1 ? true : false;
    var checkRemoveUrgencia = typeof oldText !== "undefined" && oldText.toLowerCase().indexOf("(urgente)") !== -1 && typeof newText !== "undefined" && newText.toLowerCase().indexOf("(urgente)") === -1 ? true : false;
    var methodSend = checkAddUrgencia ? "add" : false;
    methodSend = checkRemoveUrgencia ? "remove" : methodSend;
    var checkSend = checkAddUrgencia || checkRemoveUrgencia ? true : false;
    var nrSEI = $("#ifrArvore").contents().find(".infraArvoreNoSelecionado").eq(0);
    nrSEI = typeof nrSEI !== "undefined" && nrSEI !== null ? getNrSei(nrSEI.text().trim()) : "";
    if (typeof contentW !== "undefined" && typeof contentW.OnSubmitForm === "function" && contentW.OnSubmitForm()) {
      var sendAutomaticActions = [];
      sendAutomaticActions[0] = { name: "urgencia_documento", method: methodSend, send: checkSend, value: nrSEI, run: false, index: 0 };
      parent.window.sendAutomaticActions = sendAutomaticActions;
      getAutomaticActions();
      if (typeof dadosProcessoPro !== "undefined" && typeof dadosProcessoPro.propProcesso === "undefined" && typeof getDadosProcessoSession() !== "undefined" && getDadosProcessoSession().propProcesso !== "undefined") {
        dadosProcessoPro.propProcesso = getDadosProcessoSession().propProcesso;
      }
    }
  }
  function insertIconBatchActions() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendIconBatchActions);
  }
  function appendIconBatchActions(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var htmlIconbatchActions = `<a href="#" id="iconBatchActions" onclick="parent.getDocumentosActions();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Iniciar a\xE7\xF5es em lote')"  tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="` + URL_SPRO + 'icons/menu/acao_lote.svg" alt="Iniciar a\xE7\xF5es em lote" title="Iniciar a\xE7\xF5es em lote"></a>';
    if (!ifrVisualizacao2.find("#iconBatchActions").length) {
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconbatchActions);
    }
    if (loop) {
      setTimeout(function() {
        appendIconBatchActions();
      }, 1500);
    }
  }
  function insertIconAIActions() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendIconAIActions);
  }
  function appendIconAIActions(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var htmlIconAIActions = `<a href="#" id="iconAIActions" onclick="parent.initBoxAIActions();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Ferramentas de IA')"  tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="` + URL_SPRO + 'icons/menu/botpro_icon.svg" alt="Ferramentas de IA" title="Ferramentas de IA"></a>';
    if (!ifrVisualizacao2.find("#iconAIActions").length) {
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconAIActions);
    }
    if (loop) {
      setTimeout(function() {
        appendIconAIActions();
      }, 1500);
    }
  }
  function initBoxAIActions(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof loadSEIProAI !== "undefined") {
      loadBoxAIActions();
    } else {
      if (TimeOut == 9e3) $.getScript(URL_SPRO + "js/sei-pro-ai.js");
      setTimeout(function() {
        initBoxAIActions(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initBoxAIActions");
      }, 500);
    }
  }
  function insertIconCompareDocs() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendIconCompareDocs);
  }
  function appendIconCompareDocs(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var htmlIconCompareDocs = `<a href="#" id="iconCompareDocs" onclick="parent.initDialogCompareDocs();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Iniciar Comparador de Documentos')"  tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="` + URL_SPRO + 'icons/menu/compare_doc.svg" alt="Iniciar Comparador de Documentos" title="Iniciar Comparador de Documentos"></a>';
    if (ifrVisualizacao2.find("#iconCompareDocs").length == 0) {
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconCompareDocs);
    }
    if (loop) {
      setTimeout(function() {
        appendIconCompareDocs();
      }, 1500);
    }
  }
  function insertIconBatchDocs() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendIconBatchDocs);
  }
  function appendIconBatchDocs(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var htmlIconBatchDocs = `<a href="#" id="iconBatchDocs" onclick="parent.initDocLoteModalSelecaoDoc();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Iniciar Documentos em Lote')"  tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="` + URL_SPRO + 'icons/menu/doc_lote.svg" alt="Iniciar Documentos em Lote" title="Iniciar Documentos em Lote"></a>';
    if (ifrVisualizacao2.find("#iconBatchDocs").length == 0) {
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconBatchDocs);
    }
    if (loop) {
      setTimeout(function() {
        appendIconBatchDocs();
      }, 1500);
    }
  }
  function initDocLoteModalSelecaoDoc(TimeOut = 9e3) {
    if (TimeOut <= 0) {
      return;
    }
    if (typeof $().chosen !== "undefined" && typeof URL_SPRO !== "undefined") {
      docLoteModalSelecaoDoc();
    } else {
      if (TimeOut == 9e3) $.getScript(URL_SPRO + "js/lib/chosen.jquery.min.js");
      setTimeout(function() {
        initDocLoteModalSelecaoDoc(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initDocLoteModalSelecaoDoc");
      }, 500);
    }
  }
  function setProgressBarOnProcesso() {
    if (typeof arrayConfigAtividades !== "undefined" && typeof arrayConfigAtividades.prescricoes !== "undefined" && checkConfigValue("gerenciarprescricoes")) {
      var tableProcesso = $("#tblProcessosGerados, #tblProcessosRecebidos, #tblProcessosDetalhado");
      $.each(arrayConfigAtividades.prescricoes, function(i2, v) {
        var value_prescricao = typeof arrayConfigAtividades.tipos_prescricoes !== "undefined" ? jmespath.search(arrayConfigAtividades.tipos_prescricoes, "[?id_tipo_prescricao==`" + v.id_tipo_prescricao + "`] | [0]") : null;
        value_prescricao = value_prescricao !== null ? value_prescricao : false;
        var config = value_prescricao ? value_prescricao.config : false;
        var nivel_critico = config && typeof config.nivel_critico !== "undefined" ? config.nivel_critico : 75;
        var porcentagem = parseFloat((v.tempo_decorrido / v.prazo * 100).toFixed(2));
        var classProgress = porcentagem >= nivel_critico ? "urgente" : "";
        classProgress = v.suspensao ? "suspenso" : classProgress;
        var id_progress = v.id_procedimento ? v.id_procedimento : v.key_prescricao;
        var elemProcesso = v.id_procedimento ? $("#P" + v.id_procedimento).find('a[href*="controlador.php?acao=procedimento_trabalhar"]') : tableProcesso.find("a[href*='controlador.php?acao=procedimento_trabalhar']:contains('" + v.processo_sei + "')");
        var txtTip = "Prazo: " + v.prazo + " dias<br>Decorrido: " + v.tempo_decorrido + " dias (" + porcentagem + "%) <br>Documento: " + v.documento_relacionado + " (" + moment(v.data_inicio).format("DD/MM/YYYY HH:mm") + ")','" + (v.suspensao ? "(SUSPENSO) " : "") + v.nome_prescricao;
        var progress = '<div id="progressPrescricao_' + id_progress + `" style="margin: 5px 0 0 0;max-width: 300px;position:relative;" onmouseover="return infraTooltipMostrar('` + txtTip + `');" onmouseout="return infraTooltipOcultar();" class="progressPrescricao ui-progressbar ui-widget ui-widget-content ui-corner-all ` + classProgress + '" role="progressbar" aria-valuemin="0" aria-valuemax="' + v.prazo + '" aria-percent="' + porcentagem + '" data-percent="' + porcentagem.toLocaleString("pt-BR") + '%" aria-valuenow="' + v.tempo_decorrido + '">   <div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: ' + porcentagem + '%;"></div></div>';
        $("#progressPrescricao_" + id_progress).remove();
        elemProcesso.after(progress);
      });
      tableProcesso.trigger("updateAll");
    }
  }
  function appendIconCtrPrescricao(loop = true) {
    if (typeof checkCapacidade !== "undefined" && checkCapacidade("view_prescricoes") && typeof arrayConfigAtividades !== "undefined" && typeof arrayConfigAtividades.tipos_prescricoes !== "undefined" && $.map(arrayConfigAtividades.tipos_prescricoes, function(v) {
      if (checkListTipoPrescricaoInProcesso(v)) {
        return v;
      }
    }).length && checkConfigValue("gerenciarprescricoes")) {
      var ifrVisualizacao2 = $($ifrVisualizacao).contents();
      var iconLabel = localStorage.getItem("iconLabel");
      var iconBoxSlim = localStorage.getItem("seiSlim");
      var base64IconCtrPrescricao = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABFJJREFUeJztmG9MG2UYwFeyaTZwcSwx2WzLBjNxGx/mvuAHiYl+WGCML/uDMZWVAHPqNJsxS8acY1sy/DMzQRNzxj8fNNEYPxmTJc4P6jelQLtCS0t71/ZKodcrEOjd296fPr7vXTsKQgbxrsbIk/zy3uV67/3yXNvned9NmzZiI/4D0dba99Khvec+r7e/QhnBQdtZqssx0GiYYHPjFcpe1QH2KqchWCtPwwvH3jtjmGBT41WKTGrTwA+pxLLauH7IHNbKdmg79q5xgq3P91K1O7uhrrpIJ9Tt6FoXtYRqMpJ7O6H9xAfGCc7xcoUkJzfTKamfTskQSKgwEsmvC3eB0ajyBp9UKgiGCRYjzClUmJPBP7l+wSL3oso5w8WMFVT/x4KJKf+nbMILEdYFweDPmLsQmFgb5LPkHob985IpcjmVrxATH1/N0j2Agp0guqyAXLvxuFZ2gTCIR/adblMEScjpO/sRcwVQ+CIII4dAcNnwQ9dGZtAKmeH6lMx/v800QZTntiD2w7sofBlE3wksuEd78IPkRCLoqoGM78ht0+SKIfLf7kbx/l9E+nIeYUlxsOaBmcwM1Sli4PgXIv/VTtMFSSD+xxox9v5PiHk7I461gDD0ZEHGvixzOLsjB+YFf/OXmYU79rLIFUPKTmzPcV8/i2I3f0fhN0EcbcKiTywKDu0T0L2G78TIxcNZObRdgbSlrIJ54C0oz2zJpr55DE0OdKPo9UkxeAZEz9MgeBsjC4GTbRL9+iN5NWUhlFWuNOK8spXm5CN0Ev3GTo3JsekIMHxuMMLnGhJz0kP/mhi/IFtiXG4Pw0mf4AozTypMkRAGS3Ohabk3GFceL7sck5KraE7qwzJsqVgpPtzxeGIquKMq62Wla/RktjzZjKZQJZa7iSXkleUUGE8oWmul119St9WsN5a7wKSkh00XZLhcP40lVsvcOM6ce8VGQYVRVnrLVLnErLqVTkppehU5AnmtK3cyCngiii+eVjebJsgklaMri0mYHCTYX2F84g9wMwoMR+S/ZZDgjalPmSfIKTdCqwjGp8ZgIfAazLibYCzkwTLLBXW8MdlhmmCIk6hSMfKqQykJ2KlxEOnrIPhPauVubrgBfGG/9lr1zJU2rLKZHbVMLc9cdDoG85EByIZ7cIfThusvqcdW4DwvgjccLkiWSRD/eil6SQZnIMPcBkSaWIzgP6W1VsV6nHa3gIeZXZJFjxmLptm0rNVShpNv4f9AIDBJAWbYHwAxlzA9+ohfMelgRJfeA5Ix7ruBJTOapFv/Dp6fS4OFYJhg63PXKG3BvqNbX4iTBXh1Bz4+jXHCvkd19PN2vDh3LKGu2gl78WK9trCAJ3M4jt8ybuHe/EwvZStsfVgL6OftYLt/jNnWUbjuvM/iNYJT2/YwfG/mKBbU9lYM2jyyGS14qqXPUW9/9bOD9rPUP8ZGeJnqcnxk3PZbRkhbCIZNuBEbsRh/AXsKOj5cMZb5AAAAAElFTkSuQmCC";
      var htmlIconCtrPrescricao = `<a href="#" id="iconCtrPrescicao" onclick="parent.getCtrPrescricao();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Gerenciar Prescri\xE7\xF5es')"  tabindex="452" class="botaoSEI ` + (iconLabel ? "iconLabel" : "") + " " + (iconBoxSlim ? "iconBoxSlim" : "") + '"><img class="infraCorBarraSistema" tabindex="452" src="' + base64IconCtrPrescricao + '" alt="Gerenciar Prescri\xE7\xF5es" title="Gerenciar Prescri\xE7\xF5es"></a>';
      if (ifrVisualizacao2.find("#iconCtrPrescicao").length == 0) {
        ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconCtrPrescricao);
      }
      if (loop) {
        setTimeout(function() {
          appendIconCtrPrescricao();
        }, 1500);
      }
    }
  }
  function checkTipoPrescricaoProcesso() {
    if (typeof arrayConfigAtividades.tipos_prescricoes !== "undefined") {
      var arrayTipoPrescicaoProcesso = [];
      var id_tipo_procedimento = typeof dadosProcessoPro.propProcesso !== "undefined" ? dadosProcessoPro.propProcesso.hdnIdTipoProcedimento : false;
      if (id_tipo_procedimento) {
        $.each(arrayConfigAtividades.tipos_prescricoes, function(i2, v) {
          if (typeof v.config !== "undefined" && typeof v.config.tipo_processo !== "undefined") {
            if (jmespath.search(v.config.tipo_processo, "[?value=='" + id_tipo_procedimento + "']") !== null) arrayTipoPrescicaoProcesso.push(v);
          }
        });
        return arrayTipoPrescicaoProcesso;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function insertIconDocCertidao() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendIconDocCertidao);
  }
  function insertIconPublicacaoEletronica() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="], a[onclick*="acao=publicacao_agendar"]', appendIconPublicacaoEletronica);
  }
  function appendIconPublicacaoEletronica(loop = true) {
    if (checkConfigValue("atalhopublicacoeseletronicas")) {
      var ifrVisualizacao2 = $($ifrVisualizacao).contents();
      var iconId = "#iconPublicacaoEletronica";
      var actionSelector = [
        `${infraBarraComandos} a[href*="acao=publicacao_agendar"]`,
        `${infraBarraComandos} a[onclick*="acao=publicacao_agendar"]`,
        'a[href*="acao=publicacao_agendar"]',
        'a[onclick*="acao=publicacao_agendar"]'
      ].join(", ");
      var sourceLink = ifrVisualizacao2.find(actionSelector).not(iconId).first();
      if (sourceLink.length > 0 && ifrVisualizacao2.find(iconId).length === 0) {
        var shortcut = sourceLink.clone(false);
        var image = shortcut.find("img").first();
        var title = image.attr("title") || shortcut.attr("title") || "Publica\xE7\xF5es Eletr\xF4nicas";
        shortcut.attr("id", "iconPublicacaoEletronica").addClass("botaoSEI").removeClass("newLink").removeAttr("style");
        if (image.length > 0) {
          image.attr("alt", title).attr("title", title);
        } else {
          shortcut.text("Publica\xE7\xF5es Eletr\xF4nicas").attr("title", title);
        }
        ifrVisualizacao2.find("#divArvoreAcoes").append(shortcut);
      }
      if (loop) {
        setTimeout(function() {
          appendIconPublicacaoEletronica(false);
        }, 1500);
      }
    }
  }
  function appendIconDocCertidao(loop = true) {
    if (checkConfigValue("certidaosigilo")) {
      var _ifrVisualizacao = $($ifrVisualizacao);
      var ifrVisualizacao2 = _ifrVisualizacao.contents();
      var ifrArvore = $("#ifrArvore").contents();
      var id_documento = getParamsUrlPro(ifrArvore.find(".infraArvoreNoSelecionado").eq(0).closest("a").attr("href")).id_documento;
      id_documento = typeof id_documento !== "undefined" ? id_documento : getParamsUrlPro(_ifrVisualizacao.attr("src")).id_documento;
      id_documento = typeof id_documento !== "undefined" ? id_documento : false;
      var newDocLink = getTreeLinkUrlByName("Incluir Documento");
      var base64IconDocCertidao = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUQ3ODhDOEI5OUQyMTFFQzhDNkZBNEM3ODE5MUQ3RkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUQ3ODhDOEE5OUQyMTFFQzhDNkZBNEM3ODE5MUQ3RkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIwMjAgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjVEODg1QzYyOTVGOENCN0Y5QzcxMzg0RUE0NzVCNTVEIiBzdFJlZjpkb2N1bWVudElEPSI1RDg4NUM2Mjk1RjhDQjdGOUM3MTM4NEVBNDc1QjU1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr+rRM0AAAs8SURBVHjatFh7cFTVHf7OvXd37z6S7CaY94uHiYRARCt2BIuKrdTqTLUWxz6oOjq1jlalHerYh9ZxRs1Ua6ctRfCFf0hpqdjpUChUnTIqihIMBTSUBELAYJLdTbLv++zvnN1sdrNJCEx7Zs7evXfPnvOd3+P7fecy27Yx1swDf2V0yT4IQk7f0BjDVwrDG4CkJ2BLingGSNQtTNcsy4YsM9RVNqXHW/pkowC1BIc69oDJcvbpgralYoXclgU3MAZuvC2i3mEzR4oWitJMI2As0+WpeoT+E6cNJen6gyl3YU+9QWWy0TJZh9ksfZuxqeX0dgoLMPHcOT5emtaC2bWdnnXQErQ5vIRzaAUAJQLXU9FCIK3xJWw08g9maGMAz6mxsbmc7heRjJAP2cZpzTYdQEYAZYozyc6bwLBl5bzAFTSXdwNScb7TTTMBKU203olZ8yaAYwI2bPu8Mdk2y5/P5X2FLnek5z4HgNwVWXfkRhGbamG7oJ/d3yzdnR4ei98/G8g8F/eWzZno2vFIZ7nUYcHhUOB2u8V3PkCSGEzTQiql5YDHNDQkLLkeqSgZyf7DjF08kybL9DdJgmEY6QAABzfGeTIZiCFLAvy7bU5tSbVoHQ24fUYA39p9CD2d3ahUJMRCySrG/M+EB+JvD/b235Hr1rq6euzb+xFqq1tw5Zeux7LlX0NLy+X4xk3fQ/fR49j/QQdCAyF4PCrtwwFd15CIhqfesSfwMn3eYZ3NxbpuCrdYkvJoStMeCx89ZGuQYkUu5apw7xmoFWVQVQc0LYGS4mJcveJLqKmuFIYYHhlBZVUVPF43UkYRFKcC3TTFhmSqPGcGe6AOB5AybXg9HvEfK4OIhwf55SVFkUcZk/4ygVXG3br11VdRV1+zutijbErFoj8/FTOe+LA/hruubamJDoRPmZoOd9UFIqkDgWKUltbwApnpXuEQTRsUrtNpLLccLQhFURCPRzEcGUbvsV709w/A63MXxLnH6d4Gid089mjlDbflW7CqeS4u8KqbTvSe2qwx5YkkAog6SsRv3soyDB7vhx4cRVlVKaLRBGKJbjCLQXHIBCxF3YBCfMk4t2dikF8N8ozL5USgqBTll1fh+PET6D1+kkLALWI2G2+WdcKezsVxU3WPDIephGJTDLNwkfQuFjs76Jcfp7OX3OsyDcpeFwYHQzhy+BM4nS7Mm9uIZ579HV56eTPqa6sL6KbvdD+efvJRrFy5AqdOnSaXy2JTvGmaRuBdgg0mI7Q8gH2DMUdRkY2QUhe60HgTreZayjJ6ngEoqaWIxUcFnfCdB/x+4T6JrLagdQFuvPE6VFaW5wG0yN1Dnw+hobEWLocDXq+Psl/H7IbZAtihjzuRpPGqSguZ5vRJ0qx0MUNeiGZ9j69VJ3DSHBWsFr7RY66IvwleMwjN1AXX+XwetC1uTScV7f6ee27HmjX35VEKB8pphjEXEokR6nFU1FRQUlCs0hwcfOvFi3D430cQiyVR5HEWFKw8gEvZK68gSqa3Tv4drNkE8xKJaQh0/Z4FpAQBJg8kLQyNrkCy7VsiS3m8cedEIlGMxkiFWfmRz/Wd2+UWmep0qhnATHBobDRKyeLB4kvbcOjgEYxGYuK33MqQLxZYUTXMbvpSosJy0K+0mocAjxoQ94xfNZQ6dHTRZF2f/geqyzmppqM6Qlb2CuBrH/4lWS9F7vUI8XrkyFGsXr0KGzf+Fr296WSZv2g+eug5myBI8gHaXAkVpReTeCpStQhrUFSiEC61wEFaMGkcj8FSikHJIU8pcniMcQsuW/ZFERpuSigOoLGxHs0tzUgmE+I+Hk+IsRfNv5Cynp1NsGasUe3Flo1deGzDAF77RTMWX1lHbJzK1mIvEfKCxS2wLbtArvFFJYUUOY2TKYnWL1ufKVpjxwSZXDxE1uujmu4Q4zXiTQZzJoo64/64gdk1bnxhHsNFdcV0rxcoGT2ZzEgpO/MsMymB8pC1JCqZfFw0Opg3uZZKIBpLCHB5QTGJFlCmrI8EqKrei6o5xXA3BYhr6HjhUjJiQUYkGsOxo90Ug66czLNRXFyEgcEhPP54OxyyQxC0ldkAz95j3Sfw3e98E/fdf5fYSCqln5uiznXzLAfDyjYCFybXKvlnD4lKGAfndDpyrApxr7pUVFReQPEnEfc5s4KVZ3KCrM7ruETVYCb6cUKS5ASoZsJdpuKa68qAM2beSIPY3+/3oWH5FYK0xxUUE1zXOKcR27dvHT9xZVOciRhMJmMIh0NIpkwCeg6CFY7U69AQopWGxFyc2WMa12we+NtuFjyYGETYvxA2AQuHh6lsSWkXM2TFK9eFp/s/yyTNRBlIPGglUTa8n46GQaTUagQd82HAJX6vL4mRBWI4GSufpNRd2P40XZ6eJGtqbEm6GUJ82mhoaMAb2/6GVavuRHPT3LRVLQNDQ2G0P/UYFi6cj4GBQSFkJza3ZGKR8j6B+xDwFcNlF6EaYZyRL4XGvJhYjvMAkg4k+jNxtgMSr6UekvutC5sJbL2Q9dx45eUjKC7xwUHB73KrBafAYrcDl408xBciT5NKcnmA4BAJ0RdQ6d+ChP/euVTBaH1zcj1o7WhHX8tXSfYYEzHV2pLcN7agSa7nPOgnoh47e/Cf+PdILAZTNwoqAm8Vh++l2CbXu6q4BgMCFN/8+DDQlwbrJwtW3D0Pvpbuk6EE6hsuzpf8FqkSAoJJVI+daw1OF1wwBINBcmuQriG6hhAKhZEgfuOky2VUbg+E9lL8HiQgteQ3ynw3gTm0gwBSqWxZQjU+DoSO0LX7QTj9U7y3IOqoP/EBeYC/l2GZLgl0uZZOH4TSRwSexdyivBuGmUc5ud2ZOk6m94kEQLAX6NoNRCkBP/oTcOBfVP5JqccIuN5zNQZ2NI4ZRJlYQvhkDQ1zspSQsa1zKHwGocGgqJnn1bjM0ZO0osYPSUB/hp4itGBjgJcf2glZ0wh5Sba7y2oqpyBqjvzwHtzyk2cpEVRBqJah9bW/uB5NTZfgszNHaS7HuQOMUbwxkmz8xYC/IlOVyOIaASylezoyiBiUyrvhCJzcu2UTrl29Nj9JjN2/AXP7IfMJmI7tz7dDoVLFXyS91q2++Pzrf/62lky4UnqigN/O1txaP9SOGwgoze3xprm7nA5dWkKcsaFSvbe66GB050OoXPXcNWUVeCto51uQ1LBIRoMAKbqOGNVJlYLY5XTi0zd3vjDXV2JccUlrRNdJpJ/Hu5pf//SmlQ3l21oxQEnAE4EkGEpmASQe4KXsTi5+G+atz6Gf4a29uwpdLC/4MrO694lXRRTxWHXfI9i67ilysxsP3/2VfeveeM/V/clBUlDMoEQ5Z4TFu74+B7WNrbieOFIj/vORWwMxnm3AO0QzB2f34yoCGumH2RiHXMCDJzs4P0l2ZNBmyahtE0fJJJu2bfgVnR+c2LB9H8KkpAngpDw3VXu3l5Kjp7scd//wcxjkyjaKvdY4j8EgysrK0EVn5A6K6+hp4MlHlmPJ0j3Gh1uhXHbLBJoRnGBZTC3i6SwRdzAzlcJN96ylr/pM3pZN3vZ/BGze/DOYZK06mqSHHPcyrzR33YYtgc/RSTDKCXQxgdz5z3vx8YGscpEmU6tkVkuqbhqLS17bhHI+79eXBw4sx86d94NLMyJxKAS0XtqORdW7Mb/kH2Bhii+FazXg/b238s3IRbMKS93/rf1xSxs6P76camMce/a0k5KowgMPXIcVK3aRPqvBj9acIoKNYMmSNVTUGcVQJx58aN/0gvV/2WSpEwsXdYILiHnz9uO99x7H0qW7CCglSeA0li9/He++8wKd/ncgOkpUFM/+9b8CDABPKOOfpzxXBAAAAABJRU5ErkJggg==";
      var htmlIconNewDoc = '<a href="#" onclick="parent.getDocCertidao();" id="iconDocCertidao" class="botaoSEI">   <img class="infraCorBarraSistema" src="' + base64IconDocCertidao + '" alt="Gerar Certid\xE3o de Documento Oficial com Sigilo" title="Gerar Certid\xE3o de Documento Oficial com Sigilo"></a>';
      var nativo = id_documento && ifrArvore.find("#anchorImg" + id_documento + ' img[src*="' + nameDocInterno + '"]').length ? true : false;
      var assinado = id_documento && ifrArvore.find("#iconA" + id_documento).length ? true : false;
      if (newDocLink !== null && newDocLink != "" && ifrVisualizacao2.find("#iconDocCertidao").length == 0 && nativo && assinado) {
        ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconNewDoc);
      }
      if (loop) {
        setTimeout(function() {
          appendIconDocCertidao(false);
        }, 1500);
      }
    }
  }
  function insertTooltipOnButtons() {
    waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendTooltipOnButtons);
  }
  function appendTooltipOnButtons() {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    ifrVisualizacao2.find("#divArvoreAcoes a img[title]").each(function() {
      var _this = $(this);
      var title = _this.attr("title");
      var link = _this.closest("a");
      if (typeof title !== "undefined" && typeof link !== "undefined") {
        _this.removeAttr("title");
        link.attr("onmouseover", "return infraTooltipMostrar('" + title + "')").attr("onmouseout", "return infraTooltipOcultar()");
      }
    });
  }
  function insertIconNewDoc() {
    if (!SeiPro.sei.adapter.isNewSEI()) waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", "a.botaoSEI", appendIconNewDoc);
  }
  function appendIconNewDoc(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var newDocLink = jmespath.search(linksArvore, "[?name=='Incluir Documento'] | [0].url");
    var htmlIconNewDoc = '<a href="' + newDocLink + '" tabindex="451" class="botaoSEI">   <img class="infraCorBarraSistema" src="imagens/sei_incluir_documento.gif" alt="Incluir Documento" title="Incluir Documento"></a>';
    if (newDocLink !== null && newDocLink != "" && ifrVisualizacao2.find('a.botaoSEI[href*="acao=documento_escolher_tipo"]').length == 0) {
      ifrVisualizacao2.find("#divArvoreAcoes").prepend(htmlIconNewDoc);
    }
    if (loop) {
      setTimeout(function() {
        appendIconNewDoc();
      }, 1500);
    }
  }
  function initMoveIconDeleteToEnd() {
    if (!SeiPro.sei.adapter.isNewSEI()) waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", "a.botaoSEI", moveIconDeleteToEnd);
  }
  function moveIconDeleteToEnd(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    ifrVisualizacao2.find('a[onclick*="excluirDocumento("]').appendTo(ifrVisualizacao2.find("#divArvoreAcoes"));
    if (loop) {
      setTimeout(function() {
        moveIconDeleteToEnd(false);
      }, 1500);
    }
  }
  function insertIconDynamicField() {
    waitLoadPro($("#ifrArvore").contents(), "#divArvore", 'img[src*="formulario1.gif"]', appendIconDynamicField);
  }
  function appendIconDynamicField(loop = true) {
    var ifrArvore = $("#ifrArvore").contents();
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    if (ifrVisualizacao2.find("#iconDynamicField").length == 0 && ifrArvore.find("span.infraArvoreNoSelecionado").closest("a").prev().find('img[src*="formulario1.gif"]').length > 0) {
      var base64IconDynamicField = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTcwNzVBRjk4MkE3MTFFQ0EwQzJFQkVGNzNCNzNCQzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTcwNzVBRkE4MkE3MTFFQ0EwQzJFQkVGNzNCNzNCQzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ODVFRkVBMjgyOTExMUVDQTBDMkVCRUY3M0I3M0JDNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NzA3NUFGODgyQTcxMUVDQTBDMkVCRUY3M0I3M0JDNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjLf6nQAAAXeSURBVHja7FhbaFxFGP7nnJNN01yaS3OtlSCtRhEEL4giQiOkNohCESnRRi0xQiH0QXyytAg+iKLgS7CoVGMJwYdqqUXagkUqbUUJ1aY2SW9W64O0TUxN0yS7Z8bvn5nds5ezm90lQsFMmMw5c/7zzzf/5fvnrFBK0a3cHLrF2xLAJYBLABdoXrYHrV+cVJfOXiOSybMCPZ2WhB2VeSRyrBZ/VSS9AxOtWbuSzj53nygI4KXRa/TWMw+SLw0IVyi9ON97joBqZeHFr0UCpBDpzwN0wb3RxXq37/+pcAvyLmuXubT16z+NVBRqPZG0e7SYndMj31MgW+KkzVs511owKvXY/9SqTKfkBdBXVB/B45URuMFNdWHClUkuV5keD9wt0gTstZTUyGsUBRCtKgJwleUAqBaIw1AXUOqO0kDb2K7gNYpJElKCOppnSXUut8EsjFIGK0XAAfG5VNNmyY404Pxu5GagrzALGkXDp8bIARAfaARcouLujkvpOUfLBIhTW83sMLWe7gke3Q0N2LeYNcuo9RiPJZROo1fm5WLemfAAzPG0IANhQOmbEAA9cuqkCV3fz1DzqLMv2BP2p5bhTT8rJb2fpwWVdp3D4DzTfZjAtdzO14zVlTFcCaqpa6IN69vDVe3uNmDm0ZstwOuhAHej78wzBo0FS2FBF5nW19dH69Y9AXaIpbh348ZnATZG1dXl4Xp+32toRljrNWDfN0PB/Y2+pSAe5ETxoZWt9vGuj7SLpZS689w8bOfPz5Mbc2hFdW24np/fMGMUvc7GXrj1agqsxVwSJFwLKADW8+orNDQ0RIODg8ThMzC0B/eD+hkDr6uuzlRxfZzor9Egd1rCrSdO9BfHg3FNDKh/1y69H7Yeu3bTpi6zjVhMg2yoCzHAeL8JFbYeIiCGPXhTaQAbthJN3VUkQMkWNKBUTBMedEsNOEEZsE4J/o2fv4iM9xIsDOPT2pEPAvfeiRCcSwUn8a6z+m1c/VjMcUsYcuYrz9GiynKdqzvZ7uhNRFARkufqpw6YrGULlmGAgUU0CRwEL9afg7Cb8wiUm2bYXrw478MxAA0NSg3Et8El8OzY0aMpPPi8v82g5Zi7nfS7ydw3B2u2TG0mGjlHZx67wlO/JvsOfQX6bQtWkjLsgZPA81JFYziZeOBJaYk7hQdvXCIaTPJRPYY095axutnj+rqtPF5fMlpvXjGoQNa9vT3U0dEBYIYHu7peoIGBTzFu1rZM4cHh7QYMl7KVUAMXO7M5SnN4490eyUHUxsXsPhcgP/t8CBbz4UKFpJA0B8Nt2dIDwPPEmBM8eOMC0Zk9ZmHujQAXs1TArQS9NBGskGd/ZwDl6nxkAaK2HrI89/KLXdTe3k7d3S/RJwMDCTGmGyG8gAd/26cphcoeAhCfVNM0MpoPsFDolZGKVJG4PAJqmTSgS80mKEigTvRDCRjZfvoQO75VasfDdGVyBmGEPx2DkuJnBcfmv0QszskoNdfVJdHMAu3NR4gmzqO4oaxsQLy2YW4mYblDeZY6Xl3ZlJKcFXpksPpeGoQx1GsXaq5OTiaeJY9xGQ48x5G0/J8xKm85ocsex6dCaoibWqwD/XCBPOgg20wW+w6ljGSvDQfmL1M+ts0kCZvmDhPqlT/oE9bhAj+a9OcbVZSVUEUIP6aUXKeCauR0fjKXhw03roYT+HOn9QBNf1VaBFE3uSR2Hs/+/aExcEpGbADlkPNwAPTn6J2G3fR6vLLgY672+/do6kvctGR3ZNYkGT19Wl2ZmNC8xzJChBPWzKykqorIgnLc1l1oNwf6NTiFrXiXJqIP6AJQX1tLbVP3ioIAFt0+xDpNlqST2zJ6nP6g7/hrQ91PnWKOvtEFTVLxn51FtSa7aCQtFScAiIGsoieRtQfz/VVo8QH6oWemRrh2OcA9japxcFF+PCq6uSFEdpV+AbjX4Pb9nCBsXT5usaX5hCNyuHjxY3BvRqw3AuQ98dqqLRzNU9f8fwHw//YD5r8CDAC8bShVAQ+VhAAAAABJRU5ErkJggg==";
      var htmlIconDynamicField = '<a href="#" id="iconDynamicField" onclick="parent.openCamposDinamicosForm();" tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="' + base64IconDynamicField + '" alt="Adicionar campos din\xE2micos do formul\xE1rio" title="Adicionar campos din\xE2micos do formul\xE1rio"></a>';
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconDynamicField);
    }
    if (loop) {
      setTimeout(function() {
        appendIconDynamicField();
      }, 1500);
    }
  }
  function insertIconFormSheet() {
    waitLoadPro($("#ifrArvore").contents(), "#divArvore", 'img[src*="formulario1.gif"]', appendIconFormSheet);
  }
  function appendIconFormSheet(loop = true) {
    var ifrArvore = $("#ifrArvore").contents();
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    if (ifrVisualizacao2.find("#iconFormSheet").length == 0 && ifrArvore.find("span.infraArvoreNoSelecionado").closest("a").prev().find('img[src*="formulario1.gif"]').length > 0) {
      var base64IconFormSheet = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNDkxZTA3Ni04ZjNkLTQ0MzctOTAxMS02MDAwOTNlYTQ0OGEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUY1NEE2MzM4N0QwMTFFQzkxMzY4RjBERUI1MTJBOEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUY1NEE2MzI4N0QwMTFFQzkxMzY4RjBERUI1MTJBOEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMjRmYmE0Mi1iN2UyLTQ0NmEtYWMzMS04MjAzNjhiNTg3YzkiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiNDkyMWRjZi1kZDNhLTI4NGYtOWEyMC1hNmZiNmQ5MDhhMzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7dqi3RAAAH5UlEQVR42uxYbWwc1RU9szNee9dre9e7mDjEdZw0sRLSxASVqkRAbGMHGlqaNKGWlSY0CqSo8Q9aCVWUH/wA2oZWlUAKiehH4lKBqqoUWlrbkKoiIiUKjW1cEuyUOAQcbLPBJv5Y79oz0/PezM7OruOPtUDlB08azeyb994979x7z7uzimma+Cw3Dz7j7XOAnwP8fzftSp2+P7SbE2ejgPHp05O3IoLYXdcpWQGc6I7i4W98GYYN0GPzLH57PgHO3es+/OLJ7BkULZynoumv73EENzdlWnd3S/Zle3fNf/KOsoW5WLj2ai9fRXI/GcpmoFHaMLAwBgNeL1Dg//TSyLBtLJTB20vjML9WkMp1w3XP7FsAONm88YUzKNqprm7pYZ0oFLrEzHB3ss/qdqOfnhTuqWKe6Ft//aoFMmjvUtEIzKPJQQKIYkwHIPpPd3XKZ13X50Xg2rVVXGtqXjKmzaZRHgFOsy6dq6m2P8WzwKrRiGA3FF6E2zfVzAvcsdf+JdebmppfeMzKYC4ZVJlpTU1NqK6uxaTYtctNW7duI8ApBIP5GbQCCY5VlekI8oOFyMnLgZqgCZ0Dg15MjMXU9tigflmPI0egZgmY583DjcVls8WgR7IjWPvVoaelKw0ZOxaTCe5ATySgTnlQFCx2Zr0yeBZ1B1YCoVXS0Kytjbo49jZ8f99x1NzSvLE12pNNkhjSFR4C27P3HtTW1tEtU9je0IDfP/eMHPHtbXdJ4JFg0JlV1/sqULqBElWWOjJm5IAAfYvI4spblM7f1F1auf1Ex9jA5XlnsRVvwIFDhySjgj3h2oaGRsuTBCw2UBIOOeN3+SI4otOwTnDmHABNjzWOa+8OLG4Ltx/cMrz++y3/HumbmEcMCgYtUOaUtYgi3Ip0LRQx0/NOr0wc0aJjoyJArUCcM01Ne6wOr6IyQBc9Hzx1cOtw1T2tb00Oj8+RxVaAC6kRdsRmFUPEZHqcerT0ZWSmJ/HJScos+PjO4JVbgDWRMnwvz4+RyBf+FHzvpU3m6oa2OV1sEJzX0htpywopQ4LUbWFW+O74sWOODl4Mf0xQghl2xIfYmUjpiQCbmTgKleHtNuw7+TfWXj6CDQCTE63K84/1mj9+c9msAH3EL5JAJEtaIUOXS2LtJCgrr8BNG74qn1s7/4w3zinCCA1GmADllquNSWBkkL8XZ4AU4AlSuwR0tUHuXtjr76uQDHY8ZblgNdfh2S1mLmP+OzFo0of33rsH9fX1MotFa2zcgebmw/IujOcXBtIF1OS44V6Y93eh43If/jP+ESKaF7ddVYkjfe0o8abrpkAw6vPhhm/uR/kTt3E+NxfUUkmSqzngQGnrdSaSPZUgj/zuOTKm04Umk8JAnBh2795DwAnJZmGgMN2csKj50BOL4ronqgDeUbAEr993Anf/cj2NF6dHl3B9/wAee6gD+FI18Nphi9XkqEgQp5NjvZo7TzzSxd/d1Yiamhrs3Hk3ft3c7LwXciOOw1ChP2XLtKsDw+SNP1Z8nQAZi/4gQmoOf9cBhaU2bw4TQPE5rDLoXx/HLKYTu085AMu4frKs6HbOR4+VHCptHT7cLF0nYm7Hjp2pTwCyF2d/cVGBrUxGKjv1GC8T5+/8Ofpio7KYrgiEcXT7QYQ0v53mKdYvc/wtIYbdy6ziC8PANUscgPtcJ2ZJ5oeDIWKKsSfufX8sQdUK4NK6qPMuh2ijQ0NJ0cFYPG4JtCePEgUsffxaMthPo0twYu9x1D66nC4OZriYz4P9eLDpKN/xBOo9z3vEAVgXY4Ll5MrfIbcO+phN44Ytzo7m8XulM4LBqkH4Veu9n2OT4xSpe4rcoCI0rnIzM2BIVAkIsQBAJZOg4Or0UkbMCffiRuH6qQnLe/FJB6D6EU8/VyKOyrlMjgDjwZ2fJRWu5w6Sve6fCBRcb30iJKsV1dY6Y4xhqOP8HY/jwuQIchmPS/PDeOVbTyKs+adJ2jD1cmPxUlofsEXecAD2DI9hrbsiMjfU46Hf7sKj/fX8Br0qJfw3ZazauRF3vvNDvHhxU6pvzbB9iOaTGA9dXMk1PuSqi3F83+u49RHGSKhIpGPqKBTH3AeDeOD+fwBFdPHQBSeJBEBRmmzrOAsZX8n2SNkRec3VXlj+C0S/+Ba6PA/I3z+hOrx8wdLCa3wEUsFCdvQDcc5ijXBt+Q0yHtOFkC7z9WBzcTn265OWB1wMvpAcJ0BWci41M6sWMVtQrbf041aztKb1ZAup2wRKxl8GzkD/zrO4mBhhxus4Nx7Fhb1tLGQVZFaKuTxC/DlkdehdxqDXIVdzibmc0/2+1VFEsS+m/rL4hapaIe2Z5WDsfheLYk8pN2PZz6wiLVSOxmca0ShOlWTBINgRWjhjbcf3Qboxj7I13j+t3BKrsNqEjLSPx6wrs7nDwM082w+q7jNfRcv+B61KS5TzyzNKLiVD/2b4L0vUiMaV68Gb7ftmcVDwutaWHiFCpVcq5zr+K5/WEdybqV5zhnpwrr+bDWsPim4fSTOXWy/ZF2a0kAKnElwKyUBHyFpWs+vxBf7tNTk+v5L/Spsc52HR8z5EoZdLcOnvgxVn8MazX0HJRasYzbaJeI1zrmp95yjtB7KankQjSg0Z7dMAsv309NHIQCL2YUDzZo+PJ1A0EVt9oGrLGUFftgyKQ1f8jVA926Afra6NppcrC2//E2AAkfXiPiMSHfIAAAAASUVORK5CYII=";
      var htmlIconFormSheet = '<a href="#" id="iconFormSheet" onclick="parent.openFormSheet();" tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="' + base64IconFormSheet + '" alt="Salvar dados na planilha" title="Salvar dados na planilha"></a>';
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconFormSheet);
    }
    if (loop) {
      setTimeout(function() {
        appendIconFormSheet();
      }, 1500);
    }
  }
  function insertIconIntegrity() {
    waitLoadPro($($ifrVisualizacao).contents(), divInformacao, ancoraArvoreDownload, appendIconIntegrity);
  }
  function appendIconIntegrity(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    if (ifrVisualizacao2.find("#iconIntegrityPro").length == 0) {
      var base64IconIntegrity = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDgxQ0NGRjUyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDgxQ0NGRjYyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODFDQ0ZGMzI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowODFDQ0ZGNDI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm2LucYAAAbsSURBVHja7FhZjBRVFL2vqndmkxnEZomQIQIKyC9qXACXD/1xASLqYOTTL2NCjB9+8aEJLvjhhl9C3KIk6J8GNSrEJSGETUeRgYHpYVZmpreq99593rdU9YwBHLrHhBhq5nVVv35dfeqce8+9VUwpBVfz5sFVvl0D+L8HmLgseuZ5r3x88ni+PbOQUTIh6IRioBNL/5n/yUmG+livo1U0z+ng7O+neud28A3PbnngyK49X5nFyZQHjLEpv/XUo2vdKXD6APW5cmlo2rwun6tNWUCIFi5IBYJOqrEhvWjAAu2FVMoh7Oo7v1TM7fj81Xf2bti6+d5DEciZkthTQqogxJggVAwkMgLlEzYfOF2jhBQgS4H00jQyAH4WkPaSZaA5x2BWZ2dnt+r88rW3P7uNQLIZjUFUlhVl5ARixw49L9GyhYY1y6CcPIjZalHASBGgd86K/K+47JM33t17Z9dj69jMJYmU+t/IqcNDOSotm0ZhM4y8hlnNsP4aMwvGywh/jgCUKCAPqXnz9p1fuPv197+4m2KO+b4H0agrSUzE6VhzDAoNT/+4AWkBKlXbS42Ugl+698pPAB+7AP6Bb2A553ATSqgGsKCPB7s3bHx+afexwWJDWWxTQlnpoh+NB7OswVSQ0ZykV0YAu7rug8qYhNKED8UxD6oVBkdP7L/+7Jme9IIbVzcOUHuFllg6xtC5gNC2o5gDp8y8ZdmuY2iPs21JSDcnIVcFaA0BKsMMfusGHvKqx9gMxKBShgsnoY03nRA0bUBF4NCqHzMZ6ljUFiRo0F4lFWRaFSTIsFDakNnx8hNM2xUi1s+gBaBM3OEkOTV7JpONxsxIGiWNiU/EWmw6dnmsgDsJbcVSYD+sOwaJKsOQY8n8OGhzhlrCgJVbuNTWn0mHQ5oLiZi1QLjQzhDgB3u+Vql0EhKJBLz3Vr0MSnSeBzFQSZGhHKsGp3S+GMUiWFZ1KEjKXq6tSpkpCr4kHQhYs2Zl+snN69ngUEFlMpkGksSBUi6+jNRoYwjBeaBjR2EtBPT8UO8pCMYL4NvqHJ9yze0t2YT/0HcbNz3y8JyO/NGBwQFVP0AjsYoTJAIhYvnQ2UsNmPI8GC2cg/LQX7B8WSe0tbWaL+kGwchM+3Pn+pf09Jz58McfDjxIRt1Tf5KYLFNTAMioLkcVJTJttJ/7PsBAoQD5phxwLuDnX47ARLFMYSIhSfE2u60FFi/OUwiwW4ZHL6xun91xOu5CrpxBjKU19gLM1FmlauUuAh4dMxpBKCFIBNDfX4DCOMKilfeAYB6IoSr8cexbaG/P0poQSmMl39mdrDMG0fhWDMbZh7UXazciKoUONEMbn0JwM/zUdZCalQEVCsjkWihqkhAEVUCdzQobqyRWYuth0gGRUQXBWubiJEY503QQIBaYcwQqbeZ0a0bhSd9Jm5ZMQRpCXgkaB2hYqVlIlMUyNmEVH2sLSpTOQ3NlP6SwYjyzpdIEfv8w+BSPfiUNLfgT4EgLZKrD0Dwrc8dHu178ftPW7WN1AWQmg10XE7VdrtxJ1/YLVfNH5BVo6dsOa1fdQAxmTRx4jKQUB0FlK8Baq7BiviBv7IUl8wHKYye3jQ43LaKFj7tidaUM2kqivyrijgUmlTmYmix8ArJsHGbfvJMm+mgIWk8qCmpcZIkucoKSqEznqdLF0yVhEgondq4nKjSWsI5+ULmuGlzToGJwkcUol+VWdo8aIJ2YF4AXj9EE9TS8RMlSogJCwESFzkmdJYFmtA8mBojNVIUW+Q3VYisxxiYdg8OoP6S7ONc7KtNNUwCIkI45HVOvJQNaS++1sdNKpoxx0V4Q+Eb6QalqNRinShqBrXmibfeFMczQyMoIoCTmpCBJFYFVxBxZj6LPtcRIQDnV6wa6GWszGHcnNbCKOWmRubUusyWBw6IBxkhiLasGp2UFGRpwYNgk6pCbnnFyra7jnsTVWF1FjNpkzgwntf3MdTa6Nnu0lgDIcfrtkutsLTgtMdMAkTuQkt5rBhuRGFiWVzh4g2XDoGeeGjBIqMgTmH3a4Bp0Uab2ilcJQJGYIzmZslmsY1E5cJo9FIZVSSzKRgCOjo0c/HTvvrzSCeJqsLmVMsaNUTW03QrNVcPAe/r+8FbmBZ5hjy7DM7cN0tV17t5zp4X11HoByjd3PLOF9ulLBslFztl116oeUeqh5C1Ed15kh9xkrGVPWol1mGBJW2XuUuf/N4DaACZolKb7JKAt5WWPHz78Qmlk20vatG3PK+MaETW07jmUljfsPg3PXayKgH0IpS73dKueJ2bU00MzDc2KP431whFQNGr/o7v5LwAyp0ximmGBDqR1rCt8/FbPpkzQ2dHwxq495W9w+1uAAQAiHKY4X2XbYgAAAABJRU5ErkJggg==";
      var htmlIconIntegrity = '<a href="#" id="iconIntegrityPro" onclick="parent.getChecksumPro();" tabindex="452" class="botaoSEI"><img class="infraCorBarraSistema" tabindex="452" src="' + base64IconIntegrity + '" alt="Visualizar C\xF3digo de Integridade (Hashcode)" title="Visualizar C\xF3digo de Integridade (Hashcode)"></a>';
      ifrVisualizacao2.find("#divArvoreAcoes").append(htmlIconIntegrity);
    }
    if (loop) {
      setTimeout(function() {
        appendIconIntegrity();
      }, 1500);
    }
  }
  function setReplaceSelectAllVisualizacao() {
    if (verifyConfigValue("substituiselecao")) {
      var target = $($ifrVisualizacao).contents();
      if (typeof $().chosen !== "undefined") {
        target.find("select").chosen("destroy");
        target.find("select").not("[multiple]").not("#selSerie").not("[size]").filter(function() {
          return !($(this).css("visibility") == "hidden" || $(this).css("display") == "none");
        }).chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
        chosenReparePosition(target);
        target.find(".infraAreaDados").css("overflow", "initial");
        target.find("select").not("[multiple]").eq(0).trigger("chosen:activate");
      }
    }
  }
  function replaceSelectAllVisualizacao(TimeOut = 9e3) {
    if (TimeOut <= 0) return;
    var ifrVisualizacao2 = $($ifrVisualizacao)[0];
    if (!ifrVisualizacao2) return;
    var ifrVisualizacaoWindow = ifrVisualizacao2.contentWindow;
    if (!ifrVisualizacaoWindow || typeof ifrVisualizacaoWindow.$ !== "function") {
      setTimeout(function() {
        replaceSelectAllVisualizacao(TimeOut - 300);
      }, 300);
      return;
    }
    if (typeof ifrVisualizacaoWindow.$().chosen === "undefined") {
      getScriptIframe(ifrVisualizacao2, URL_SPRO + "js/lib/chosen.jquery.min.js", function() {
        getScriptIframe(ifrVisualizacao2, URL_SPRO + "js/sei-pro-visualizacao-chosen.js", function() {
          if (typeof ifrVisualizacaoWindow.replaceSelectOnVisualizacao !== "undefined") ifrVisualizacaoWindow.replaceSelectOnVisualizacao();
        });
      });
    }
  }
  function insertActionHipoteseLegal() {
    var target = $($ifrVisualizacao).contents();
    target.find('input[name="rdoFormato"]').on("change", function() {
      parent.replaceSelectAllVisualizacao();
      if ($(this).attr("id") == "optNato") {
        setTimeout(() => {
          target.find("#selTipoConferencia").hide();
          target.find("#selTipoConferencia_chosen").remove();
        });
      } else {
        setTimeout(function() {
          if (typeof $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao === "function") $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao(true);
        }, 500);
      }
    });
    target.find('input[name="rdoNivelAcesso"], input[name="rdoTextoInicial"]').on("change", function() {
      parent.replaceSelectAllVisualizacao();
      if ($(this).attr("id") == "optPublico") {
        target.find("#selHipoteseLegal").hide();
        target.find("#selHipoteseLegal_chosen").remove();
      } else {
        setTimeout(function() {
          if (typeof $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao === "function") $($ifrVisualizacao)[0].contentWindow.setReplaceSelectOnVisualizacao(true);
        }, 500);
      }
    });
    target.find("#newdocsigilo").remove();
    target.find("#lblHipoteseLegal").append('<span id="newdocsigilo" style="float: right;font-size: 0.8em;"><a onclick="parent.setNewDocSigilo(this)">Definir como padr\xE3o para novos documentos</a></span>');
    target.find("#fldNivelAcesso").css("height", "110%");
    target.find("#divInfraBarraComandosInferior").css("margin-top", "20px");
  }
  function enableConsultasExtras() {
    var urlConfig = url_host.replace("controlador.php", "") + "?#&acao_pro=set_option&option_key=disablequery&option_value=false";
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    $("#frmCheckerProcessoPro").attr("src", urlConfig).unbind().on("load", function() {
      setTimeout(function() {
        parent.alertaBoxPro("Sucess", "check-circle", "Consultas adicionais ativadas com sucesso!", function() {
          window.location.reload();
        });
        $("#frmCheckerProcessoPro").remove();
      }, 500);
    });
  }
  function setNewDocSigilo(this_) {
    var _this = $(this_);
    var _parent = _this.closest("form");
    var selectHipoteseLegal = _parent.find("#selHipoteseLegal");
    var valueNivelAcesso = _parent.find('input[name="rdoNivelAcesso"]:checked');
    var valueNewDocSigilo = selectHipoteseLegal.length ? selectHipoteseLegal.val() + "|" + valueNivelAcesso.val() + "|" + selectHipoteseLegal.find("option:selected").text() : "";
    var urlConfigSigilo = url_host.replace("controlador.php", "") + "?#&acao_pro=set_option&option_key=newdocsigilo&option_value=" + encodeURIComponent(valueNewDocSigilo);
    var urlConfigPublico = url_host.replace("controlador.php", "") + "?#&acao_pro=set_option&option_key=newdocnivel&option_value=false";
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    $("#frmCheckerProcessoPro").attr("src", urlConfigSigilo).unbind().on("load", function() {
      setTimeout(function() {
        $("#frmCheckerProcessoPro").remove();
        if ($("#frmCheckerProcessoPro").length == 0) {
          getCheckerProcessoPro();
        }
        $("#frmCheckerProcessoPro").attr("src", urlConfigPublico).unbind().on("load", function() {
          alertaBoxPro("Sucess", "check-circle", "Padr\xE3o de sigilo definido com sucesso!");
          $("#frmCheckerProcessoPro").remove();
        });
      }, 500);
    });
  }
  function openStyleBoxSlimPro() {
    checkLoadJqueryUI(openStyleBoxSlimPro_);
  }
  function openStyleBoxSlimPro_() {
    try {
      if (localStorage.getItem("seiSlim")) {
        sessionStorageRemovePro("seiSlim_openBox");
        var oldColorPage = getOptionsPro("oldColorPage");
        var colorSlim = getOptionsPro("colorSlimPro") ? getOptionsPro("colorSlimPro") : oldColorPage ? oldColorPage : "#0494c7";
        if (!getOptionsPro("colorSlimPro") && oldColorPage) {
          setColorSlimPro(oldColorPage);
        }
        var htmlBox = '<table style="font-size: 10pt;width: 100%;" class="seiProForm tableInfo">      <tr>          <td style="vertical-align: bottom; text-align: left;" class="label">               <label for="colorPalette"><i class="iconPopup iconSwitch fas fa-palette azulColor"></i>Cor personalizada:</label>           </td>           <td style="text-align: right;">               <input type="color" id="colorPalette" value="' + colorSlim + '" onchange="_setColorSlimPro(this)">           </td>      </tr>      <tr>          <td style="vertical-align: bottom; text-align: left;" class="label">               <label for="iconLabel"><i class="iconPopup iconSwitch fas fa-text-width azulColor"></i>\xCDcones com legenda:</label>           </td>           <td style="text-align: right;">              <div class="onoffswitch" style="float: right;">                  <input type="checkbox" onchange="setIconLabel(this)" name="onoffswitch" class="onoffswitch-checkbox" id="iconLabel" ' + (localStorage.getItem("iconLabel") ? "checked" : "") + '>                  <label class="onoff-switch-label" for="iconLabel"></label>              </div>           </td>      </tr>      <tr>          <td style="vertical-align: bottom; text-align: left;" class="label">               <label for="darkModePro"><i class="iconPopup iconSwitch fas fa-moon azulColor"></i>Modo noturno:</label>           </td>           <td style="text-align: right;">              <div class="onoffswitch" style="float: right;">                  <input type="checkbox" onchange="setDarkModePro(this)" name="onoffswitch" class="onoffswitch-checkbox" id="darkModePro" ' + (localStorage.getItem("darkModePro") ? "checked" : "") + '>                  <label class="onoff-switch-label" for="darkModePro"></label>              </div>           </td>      </tr>      <tr>          <td style="vertical-align: bottom; text-align: left;" class="label">               <label for="seiBtnRight"><i class="iconPopup iconSwitch fas fa-grip-vertical azulColor"></i>Barra de Bot\xF5es na Vertical:</label>           </td>           <td style="text-align: right;">              <div class="onoffswitch" style="float: right;">                  <input type="checkbox" onchange="setBtnRight(this)" name="onoffswitch" class="onoffswitch-checkbox" id="seiBtnRight" ' + (localStorage.getItem("seiBtnRight") ? "checked" : "") + '>                  <label class="onoff-switch-label" for="seiBtnRight"></label>              </div>           </td>      </tr></table></div>';
        dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
          title: "Cor Principal do Layout",
          width: 300
        });
      } else {
        $("#changeSlimPro").trigger("click");
      }
    } catch (e) {
    }
  }
  function changeSlimPro(this_) {
    if ($(this_).is(":checked")) {
      localStorageStorePro("seiSlim", true);
      sessionStorageStorePro("seiSlim_openBox", true);
      setOptionsPro("oldColorPage", rgbToHexString($(".infraAreaGlobal").css("border-left-color")));
    } else {
      localStorageRemovePro("seiSlim");
      sessionStorageRemovePro("seiSlim_openBox");
      removeOptionsPro("oldColorPage");
      removeOptionsPro("colorSlimPro");
      removeOptionsPro("iframeSizeSlimPro");
      localStorage.removeItem("iconLabel");
      localStorage.removeItem("darkModePro");
      localStorage.removeItem("seiBtnRight");
    }
    window.location.reload();
  }
  function _setColorSlimPro(this_) {
    var _this = $(this_);
    var backgroundColor = _this.val();
    setColorSlimPro(backgroundColor);
  }
  function setColorSlimPro(backgroundColor) {
    var color = getBrightnessColor(backgroundColor) > 125 ? "#515151" : "#ffffff";
    $("head").find('style[data-style="seipro-colorpage"]').remove();
    $("head").prepend("<style type='text/css' data-style='seipro-colorpage'>   .seiSlim .infraAcaoBarraSistema a.iconBoxSlim i.fas {\n      background: -webkit-gradient(linear, left top, left bottom, from(" + color + "), to(" + color + "));\n      -webkit-background-clip: text;\n  }\n  .seiSlim.dark-mode .panelHome .iconBoxSlim:hover .newIconTitle, \n  .seiSlim #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a:hover:before { \n      color: " + color + " !important;\n  }\n  .seiSlim #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a:before { \n      color: " + backgroundColor + " !important;\n  }\n  .seiSlim.seiSlim_parent div#divInfraBarraSistemaPadrao, \n  .seiSlim.seiSlim_parent div#divInfraBarraSistema { \n      box-shadow: " + addAlpha(color, 0.5) + " 0px -5px 6px -3px inset;\n  }\n  .seiSlim.seiSlim_parent div#divInfraBarraSistemaPadrao, \n  .seiSlim.seiSlim_parent div#divInfraBarraSistema, \n  .seiSlim.seiSlim_parent div#divInfraBarraSuperior,\n  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover, \n  .seiSlim.dark-mode .infraAreaDados a.ancoraPadraoPreta:hover, \n  .seiSlim.dark-mode a.newLink:hover, \n  .seiSlim.dark-mode .panelHome .iconBoxSlim:hover, \n  .seiSlim.dark-mode .iconBoxSlim.botaoSEI:hover, \n  .seiSlim .iconBoxSlim.botaoSEI:hover {\n      background: " + backgroundColor + " !important;\n  }\n  .seiSlim.dark-mode #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a:hover,\n  .seiSlim " + divComandos + " a.botaoSEI:hover,\n  .seiSlim #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a:hover {\n      background: " + backgroundColor + " !important;\n      color: " + color + " !important;\n  }\n  .seiSlim .infraAcaoBarraSistema a::before,\n  .seiSlim #divComandos a.botaoSEI:hover:before,\n  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover,\n  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover:before,\n  div" + infraBarraS + ".barSuspenso::before {\n      color: " + color + " !important;\n      border-color: " + backgroundColor + " !important;\n  }\n  .seiSlim .iconBoxSlim:not(.newLink) .fas {\n      color: " + backgroundColor + " !important;\n      -webkit-background-clip: text;\n  }\n  .seiSlim .iconBoxSlim.botaoSEI:hover i.fas, \n  .seiSlim #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a:hover i.fas, \n  .seiSlim.dark-mode #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a:hover i.fas, \n  .seiSlim.dark-mode .iconBoxSlim.botaoSEI:hover .newIconTitle, \n  .seiSlim .iconBoxSlim.botaoSEI:hover .newIconTitle {\n      color: " + color + " !important;\n      background: -webkit-gradient(linear, left top, left bottom, from(" + color + "), to(" + color + "));\n      -webkit-background-clip: text;\n  }\n  .seiSlim #divInfraAreaTelaE " + (SeiPro.sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu") + " li a i.fas {\n      background: -webkit-gradient(linear, left top, left bottom, from(" + backgroundColor + "), to(" + backgroundColor + "));\n      -webkit-background-clip: text;\n  }\n</style>");
    if (getBrightnessColor(backgroundColor) > 125) {
      $(infraBarraS).addClass("dark");
    } else {
      $(infraBarraS).removeClass("dark");
    }
    setOptionsPro("colorSlimPro", backgroundColor);
  }
  function setIconLabel(this_) {
    if ($(this_).is(":checked")) {
      localStorage.setItem("iconLabel", true);
    } else {
      localStorage.removeItem("iconLabel");
    }
    window.location.reload();
  }
  function setBtnRight(this_) {
    if ($(this_).is(":checked")) {
      localStorage.setItem("seiBtnRight", true);
    } else {
      localStorage.removeItem("seiBtnRight");
    }
    window.location.reload();
  }
  function initToolbarOnTop() {
    var toolbar = $(divComandos);
    if (toolbar.length) {
      var topWindow = SeiPro.sei.adapter.isNewSEI() ? 80 : 200;
      var topElement = toolbar.offset().top;
      topElement = topElement - topWindow;
      var toolbarFixedSelector = divComandos + ".fixed";
      var updateToolbarFixedPosition = function() {
        if (!SeiPro.sei.adapter.isNewSEI() || divComandos !== "#divBotoesControleProcessos") return;
        var fixedToolbar = $(toolbarFixedSelector);
        var menuButton = $("#divInfraBarraSistemaPadraoD #lnkInfraMenuSistema:visible").first();
        if (!menuButton.length) {
          menuButton = $("#lnkInfraMenuSistema:visible").first();
        }
        if (!fixedToolbar.length || !menuButton.length) return;
        var menuOffset = menuButton.offset();
        if (!menuOffset) return;
        var toolbarWidth = fixedToolbar.outerWidth(true) || fixedToolbar.outerWidth() || 0;
        fixedToolbar.css({
          display: "inline-flex",
          right: "auto",
          left: Math.max(12, Math.round(menuOffset.left - toolbarWidth - 12)) + "px",
          width: "max-content",
          whiteSpace: "nowrap",
          transform: "none"
        });
      };
      $(SeiPro.sei.adapter.isNewSEI() ? "#divInfraAreaTelaD" : window).scroll(function() {
        if ($(this).scrollTop() > topWindow) {
          delayCrash = true;
          setTimeout(function() {
            delayCrash = false;
          }, 300);
          if ($(toolbarFixedSelector).length == 0) {
            $(divComandos).before($(divComandos).clone()).addClass("fixed");
          }
          updateToolbarFixedPosition();
        } else {
          if (!delayCrash || $(this).scrollTop() <= topWindow) {
            $(toolbarFixedSelector).remove();
          }
        }
      });
      $(window).on("resize.seiProToolbarTop", function() {
        updateToolbarFixedPosition();
      });
    }
  }
  function getUnidadesPermissaoSEI() {
    if (SeiPro.sei.adapter.isNewSEI()) {
      if (sessionStorageRestorePro("unidadesPermissaoSEIPro") !== null) {
        setSelectUnidadePro();
      } else {
        let url = $("a#lnkInfraUnidade").attr("onclick");
        url = typeof url !== "undefined" ? url.split("'")[1] : false;
        if (url) {
          $.ajax({
            url
          }).done(function(html) {
            var $html = $(html);
            var param = [];
            $html.find("form#frmInfraSelecaoUnidade div#divInfraAreaTabela table tbody tr").each(function() {
              let _this = $(this);
              let id = _this.find("td").eq(0).find("a").attr("name");
              id = typeof id !== "undefined" ? parseInt(id.replace("ID-", "")) : false;
              let sigla = _this.find("td").eq(1).text();
              let descricao = _this.find("td").eq(2).text();
              let orgao = _this.find("td").eq(3).text();
              if (id) {
                param.push({
                  id,
                  sigla,
                  descricao,
                  orgao
                });
              }
            });
            sessionStorageStorePro("unidadesPermissaoSEIPro", param);
            setSelectUnidadePro();
          });
        }
      }
    }
  }
  function _changeUnidadeSEI(this_) {
    changeUnidadeSEI($(this_).data("url"), $(this_).val());
  }
  function changeUnidadeSEI(url, idUnidade2) {
    if (typeof url !== "undefined") {
      $.ajax({
        url
      }).done(function(html) {
        let $html = $(html);
        let param = {};
        let form = $html.find("form#frmProcedimentoControlar");
        form.find("input[type=hidden]").map(function() {
          if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
            param[$(this).attr("name")] = $(this).val();
          }
        });
        param.selInfraUnidades = idUnidade2;
        $.ajax({
          method: "POST",
          data: param,
          url: form.attr("action")
        }).done(function(html2) {
          window.location.reload();
        });
      });
    }
  }
  function setSelectUnidadePro() {
    if (SeiPro.sei.adapter.isNewSEI()) {
      let url = $("a#lnkInfraUnidade").attr("onclick");
      url = typeof url !== "undefined" ? url.split("'")[1] : false;
      let listUnidades = sessionStorageRestorePro("unidadesPermissaoSEIPro");
      let htmlOptionsUnidades = $.map(listUnidades, function(v) {
        let selected = $("#lnkInfraUnidade").text() == v.sigla ? "selected" : "";
        return `<option value="${v.id}" ${selected}>${v.sigla} (${v.orgao})</option>`;
      }).join("");
      let htmlSelect = `<select data-url="${url}" style="width: 200px;" onchange="_changeUnidadeSEI(this)" id="changeUnidadeSEIPro">${htmlOptionsUnidades}</select>`;
      $("#changeUnidadeSEIPro").remove();
      $("#divInfraBarraSistemaPadraoD .input-group.align-self-center").html(htmlSelect);
      if (verifyConfigValue("substituiselecao") && typeof $().chosen === "function") {
        $("#changeUnidadeSEIPro").chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
      }
    }
  }
  function setDarkModePro(this_) {
    var _ifrVisualizacao = $($ifrVisualizacao);
    var _ifrArvore = $("#ifrArvore");
    var _ifrArvoreHtml = _ifrVisualizacao.contents().find($ifrArvoreHtml);
    if ($(this_).is(":checked") || $(this_).hasClass("fa-house-night")) {
      $("body").addClass("dark-mode");
      localStorage.setItem("darkModePro", true);
      if (_ifrVisualizacao.length > 0) _ifrVisualizacao.contents().find("body").addClass("dark-mode");
      if (_ifrArvore.length > 0) _ifrArvore.contents().find("body").addClass("dark-mode");
      if (_ifrArvoreHtml.length > 0) _ifrArvoreHtml.contents().find("body").addClass("dark-mode");
      $("#iconDarkMode").attr("class", "fas fa-house-day brancoColor").attr("onmouseover", "return infraTooltipMostrar('Desativar modo noturno')");
    } else {
      $("body").removeClass("dark-mode");
      localStorage.removeItem("darkModePro");
      if (_ifrVisualizacao.length > 0) _ifrVisualizacao.contents().find("body").removeClass("dark-mode");
      if (_ifrArvore.length > 0) _ifrArvore.contents().find("body").removeClass("dark-mode");
      if (_ifrArvoreHtml.length > 0) _ifrArvoreHtml.contents().find("body").removeClass("dark-mode");
      $("#iconDarkMode").attr("class", "fas fa-house-night brancoColor").attr("onmouseover", "return infraTooltipMostrar('Ativar modo noturno')");
    }
  }
  function insertNewIcons() {
    try {
      if (localStorage.getItem("seiSlim")) {
        waitLoadPro($($ifrVisualizacao).contents(), "#divArvoreAcoes", 'a[href*="controlador.php?acao="]', appendNewIcons);
      }
    } catch (e) {
    }
  }
  function appendStyleNewIcons(ifrVisualizacao2, backgroundColor) {
    ifrVisualizacao2.find("#divArvoreAcoes a").addClass("botaoSEI");
    if (ifrVisualizacao2.find('style[data-style="seipro-styleicon"]').length == 0) {
      var color = backgroundColor && getBrightnessColor(backgroundColor) > 125 ? "#515151" : "#ffffff";
      ifrVisualizacao2.find("head").prepend("<style type='text/css' data-style='seipro-styleicon'>   body.seiSlim .iconBoxSlim.botaoSEI:hover {\n      background: " + backgroundColor + " !important;\n   }\n   .seiSlim .iconBoxSlim.botaoSEI:hover .newIconTitle, \n   .seiSlim .iconBoxSlim.botaoSEI:hover::before {\n      color: " + color + " !important;\n   }\n</style>");
      ifrVisualizacao2.find("body").addClass("seiSlim").addClass("seiSlim_view");
      if (localStorage.getItem("darkModePro")) {
        ifrVisualizacao2.find("body").addClass("dark-mode");
      }
      if (localStorage.getItem("seiBtnRight")) {
        ifrVisualizacao2.find("body").addClass("seiBtnRight");
      }
      if (localStorage.getItem("iconLabel")) {
        ifrVisualizacao2.find("body").addClass("seiIconLabel");
      }
    }
  }
  function appendNewIcons(loop = true) {
    var ifrVisualizacao2 = $($ifrVisualizacao).contents();
    var colorSlim = getOptionsPro("colorSlimPro") ? getOptionsPro("colorSlimPro") : rgbToHexString(ifrVisualizacao2.find(".infraCorBarraSistema").css("background-color"));
    appendStyleNewIcons(ifrVisualizacao2, colorSlim);
    replaceNewIcons(ifrVisualizacao2.find(`${infraBarraComandos} a.botaoSEI`));
    if (loop) {
      setTimeout(function() {
        appendNewIcons(false);
      }, 1500);
    }
  }
  function replaceNewIcons(element) {
    element.find(".newIconTitle").remove();
    element.each(function() {
      var title = $(this).find("img").attr("title");
      $(this).addClass("iconBoxSlim");
      if (localStorage.getItem("iconLabel") && typeof title !== "undefined" && title != "") {
        $(this).addClass("iconLabel").append('<span class="newIconTitle">' + title + "</span>");
      } else {
        $(this).attr("onmouseover", "return infraTooltipMostrar('" + title + "')").attr("onmouseout", "return infraTooltipOcultar()");
      }
    });
  }
  function replaceColorsIcons(element) {
    element.each(function() {
      var img = $(this).find("img").attr("src");
      if (typeof img !== "undefined" && img != "") {
        var arrayTip = typeof $(this).attr("onmouseover") !== "undefined" ? extractTooltipToArray($(this).attr("onmouseover")) : ["", $(this).find("img").attr("title")];
        var colorTag = typeof arrayTip !== "undefined" && typeof arrayTip[1] !== "undefined" && extractHexColor(arrayTip[1]) !== null ? extractHexColor(arrayTip[1])[0] : false;
        colorTag = $("#frmMarcadorLista").length ? extractHexColor($(this).closest("td").next().text()) ? extractHexColor($(this).closest("td").next().text())[0] : false : colorTag;
        colorTag = $(this).hasClass("dd-option") ? extractHexColor($(this).find(".dd-option-text").text()) ? extractHexColor($(this).find(".dd-option-text").text())[0] : false : colorTag;
        colorTag = $(this).hasClass("dd-selected") ? extractHexColor($(this).find(".dd-selected-text").text()) ? extractHexColor($(this).find(".dd-selected-text").text())[0] : false : colorTag;
        var color = false;
        color = img.indexOf("preto") !== -1 ? "#000000" : color;
        color = img.indexOf("branco") !== -1 ? "#fbfbfe" : color;
        color = img.indexOf("cinza") !== -1 ? "#c0c0c0" : color;
        color = img.indexOf("vermelho") !== -1 ? "#ed1c24" : color;
        color = img.indexOf("amarelo") !== -1 ? "#fff201" : color;
        color = img.indexOf("verde") !== -1 ? "#0aff00" : color;
        color = img.indexOf("azul") !== -1 ? "#4285f4" : color;
        color = img.indexOf("rosa") !== -1 ? "#ff1cae" : color;
        color = img.indexOf("roxo") !== -1 ? "#68329b" : color;
        color = img.indexOf("ciano") !== -1 ? "#09ffff" : color;
        color = colorTag ? colorTag : color;
        var shadow = false;
        shadow = img.indexOf("branco") !== -1 ? true : shadow;
        shadow = img.indexOf("amarelo") !== -1 ? true : shadow;
        if (color) $(this).attr("data-color", true).css("color", color);
        if (shadow) $(this).attr("data-shadow", shadow);
      }
    });
  }
  var arrayProtocoloSEI = [];
  function loopIDProtocoloSEI(protocoloSEI, index, TimeOut = 200) {
    if (TimeOut <= 0) {
      var next = index + 1;
      var htmlTr = '<tr>    <td style="font-size: 9pt; text-align: center;">' + arrayProtocoloSEI[index] + '</td>    <td style="font-size: 9pt; text-align: center;">ERROR</td>    <td style="font-size: 9pt; word-break: break-all;">-</td></tr>';
      $(".tableResultProtocoloSEI").find("tbody").append(htmlTr);
      loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
      return;
    }
    if (index < arrayProtocoloSEI.length) {
      getIDProtocoloSEI(
        protocoloSEI,
        function(html) {
          let $html = $(html);
          var params = getParamsUrlPro($html.find("#ifrArvore").attr("src"));
          var next2 = index + 1;
          loopIDProtocoloSEI(arrayProtocoloSEI[next2], next2);
          appendSearchProtocoloSEI(params, index);
        },
        function() {
          setTimeout(function() {
            loopIDProtocoloSEI(arrayProtocoloSEI[index], index, TimeOut - 100);
            console.log("ERROR", "Reload loopIDProtocoloSEI => " + TimeOut);
          }, 500);
        }
      );
    } else {
      setTimeout(function() {
        alertaBoxPro("Sucess", "check-circle", "Protocolos pesquisados com sucesso!", function() {
          loadingButtonConfirm(false);
        });
        loadingButtonConfirm(false);
        $(".ui-dialog .ui-dialog-buttonset .confirm.ui-button").addClass("ui-state-active");
      }, 500);
    }
  }
  function initBoxSearchProtocoloSEI() {
    resetDialogBoxPro();
    var htmlBox = '<div class="searchProtocoloSEI" style="width: 100%; float: left;"><textarea placeholder="Insira os n\xFAmeros de processo ou n\xFAmeros SEI, um em cada linha..." id="searchProtocoloSEI" style="width: 90%; border: 2px solid #c5c5c5; height: 330px; border-radius: 5px;"></textarea></div><div id="resultProtocoloSEI" class="resultProtocoloSEI" style="float: right; display: none;">    <div id="divResulProtocoloSEI" style="overflow-y: scroll; height: 300px;">       <table style="font-size: 9pt !important; width: 100%;" class="tableInfo tableZebra tableFollow seiProForm tableResultProtocoloSEI resultProtocoloSEI">           <thead>               <tr>                   <th class="tituloControle" style="width: 140px; padding: 5px 0px;">Protocolo</th>                   <th class="tituloControle" style="width: 90px; padding: 5px 0px;">Tipo</th>                   <th class="tituloControle" style="padding: 5px 0px;">Link Permanente</th>               </tr>           </thead>           <tbody>           </thead>       </table>    </div>    <div class="ui-dialog-buttonpane actionsResultProtocoloSEI">        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="copyTableResultProtocoloSEI()">Copiar Tabela</button>        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="downloadTableResultProtocoloSEI()">Baixar CSV</button>    </div></div>';
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "Pesquisar Link Permanente",
      width: 300,
      open: function(event2, ui) {
        var processosTela = getProcessoUnidadePro();
        processosTela = processosTela.length > 0 ? processosTela.join("\n") : "";
        if (processosTela != "") {
          $("#searchProtocoloSEI").val(processosTela);
        }
      },
      close: function() {
        $("#configDatesBox").remove();
      },
      buttons: [{
        text: "Limpar",
        click: function() {
          cleanSearchProtocoloSEI();
        }
      }, {
        text: "Pesquisar",
        class: "confirm ui-state-active",
        click: function() {
          initSearchProtocoloSEI();
        }
      }]
    });
  }
  function initSearchProtocoloSEI() {
    var lines = $("#searchProtocoloSEI").val().split(/\n/);
    arrayProtocoloSEI = [];
    for (var i2 = 0; i2 < lines.length; i2++) {
      if (/\S/.test(lines[i2])) {
        arrayProtocoloSEI.push($.trim(lines[i2]));
      }
    }
    if (arrayProtocoloSEI !== null && arrayProtocoloSEI.length > 0 && !checkLoadingButtonConfirm()) {
      loopIDProtocoloSEI(arrayProtocoloSEI[0], 0);
      $(".resultProtocoloSEI").show();
      $(".searchProtocoloSEI").css("width", "30%");
      $("#resultProtocoloSEI").css("width", "70%");
      dialogBoxPro.dialog("option", "width", 900);
      loadingButtonConfirm(true);
    }
  }
  function cleanSearchProtocoloSEI() {
    $(".tableResultProtocoloSEI").find("tbody").html("");
    $(".resultProtocoloSEI").hide();
    $(".searchProtocoloSEI").css("width", "100%");
    $("#resultProtocoloSEI").css("width", "");
    dialogBoxPro.dialog("option", "width", 300);
    $("#searchProtocoloSEI").val("");
    loadingButtonConfirm(false);
    $(".ui-dialog .ui-dialog-buttonset .confirm.ui-button").addClass("ui-state-active");
  }
  function appendSearchProtocoloSEI(params, index) {
    var documento = params.id_documento != "" ? "&id_documento=" + String(params.id_documento) : "";
    var tipo = params.id_documento != "" ? '<i class="far fa-file"></i> Documento' : '<i class="far fa-folder-open"></i> Protocolo';
    var href = url_host + "?acao=procedimento_trabalhar&id_procedimento=" + String(params.id_procedimento) + documento;
    var htmlTr = '<tr>    <td style="font-size: 9pt; text-align: center;">' + arrayProtocoloSEI[index] + '</td>    <td style="font-size: 9pt; text-align: center;">' + tipo + '</td>    <td style="font-size: 9pt; word-break: break-all;"><a style="text-decoration: underline; font-size: 9pt;" class="bLink" target="_blank" href="' + href + '">' + href + "</a></td></tr>";
    $(".tableResultProtocoloSEI").find("tbody").append(htmlTr);
    var d = $("#divResulProtocoloSEI");
    d.scrollTop(d.prop("scrollHeight"));
  }
  function setNewDoc(id_procedimento, id_tipo_documento, insertHtml = false, openProc = true) {
    if (!checkProcessoSigiloso()) {
      var href = url_host.replace("controlador.php", "") + "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + String(id_procedimento);
      $.ajax({ url: href }).done(function(html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr("src");
        $.ajax({ url: urlArvore }).done(function(htmlArvore) {
          var $htmlArvore = $(htmlArvore);
          var textLink = $htmlArvore.filter("script").not('[src*="js"]').text();
          var arrayLinksArvoreDoc = getLinksInText(textLink);
          var urlNewDoc = arrayLinksArvoreDoc.filter(function(v) {
            return v.indexOf("acao=documento_escolher_tipo") !== -1;
          });
          if (urlNewDoc) {
            $.ajax({ url: urlNewDoc }).done(function(htmlNewDoc) {
              let $htmlNewDoc = $(htmlNewDoc);
              var urlDoc = $htmlNewDoc.find('a[href*="&id_serie=' + id_tipo_documento + '&"]').attr("href");
              console.log(urlDoc, id_tipo_documento);
              if (typeof urlDoc !== "undefined") {
                $.ajax({ url: urlDoc }).done(function(htmlDoc) {
                  var $htmlDoc = $(htmlDoc);
                  var form = $htmlDoc.find("#frmDocumentoCadastro");
                  var hrefForm = form.attr("action");
                  var param = {};
                  form.find("input[type=hidden]").each(function() {
                    if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
                      param[$(this).attr("name")] = $(this).val();
                    }
                  });
                  form.find("input[type=text]").each(function() {
                    if ($(this).attr("id") && $(this).attr("id").indexOf("txt") !== -1) {
                      param[$(this).attr("id")] = $(this).val();
                    }
                  });
                  form.find("select").each(function() {
                    if ($(this).attr("id") && $(this).attr("id").indexOf("sel") !== -1) {
                      param[$(this).attr("id")] = $(this).val();
                    }
                  });
                  form.find("input[type=radio]").each(function() {
                    if ($(this).attr("name") && $(this).attr("name").indexOf("rdo") !== -1) {
                      param[$(this).attr("name")] = $(this).val();
                    }
                  });
                  param.rdoNivelAcesso = "0";
                  param.hdnFlagDocumentoCadastro = "2";
                  param.txaObservacoes = "";
                  param.txtDescricao = "";
                  var postData = "";
                  for (var k in param) {
                    if (postData !== "") postData = postData + "&";
                    var valor = k == "hdnAssuntos" ? param[k] : escapeComponent(param[k]);
                    valor = k == "txtDataElaboracao" ? param[k] : escapeComponent(param[k]);
                    valor = k == "hdnInteressados" ? param[k] : valor;
                    valor = k == "txtDescricao" ? parent.encodeURI_toHex(param[k].normalize("NFC")) : valor;
                    valor = k == "txtNumero" ? escapeComponent(param[k]) : valor;
                    postData = postData + k + "=" + valor;
                  }
                  var xhr = new XMLHttpRequest();
                  $.ajax({
                    method: "POST",
                    // data: param,
                    data: postData,
                    url: hrefForm,
                    contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
                    xhr: function() {
                      return xhr;
                    }
                  }).done(function(htmlResult) {
                    var status = xhr.responseURL.indexOf("controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar") !== -1 ? true : false;
                    var ifrArvore = $("#ifrArvore");
                    if (status) {
                      console.log("Documento gerado com sucesso");
                      var $htmlResult = $(htmlResult);
                      var urlEditor = [];
                      var idUser = false;
                      $.each($htmlResult.text().split("\n"), function(i2, v) {
                        if (v.indexOf("atualizarArvore('") !== -1) {
                          urlReload = v.split("'")[1];
                        }
                        if (v.indexOf("acao=editor_montar") !== -1) {
                          var editorUrlNew = extractEditorMontarUrl(v);
                          if (editorUrlNew) urlEditor.push(editorUrlNew);
                        }
                        if (v.indexOf("janelaEditor_") !== -1) {
                          idUser = v.split("_")[1];
                        }
                      });
                      if (!urlEditor.length) {
                        var editorUrlNewHtml = extractEditorMontarUrl(htmlResult);
                        if (editorUrlNewHtml) urlEditor.push(editorUrlNewHtml);
                      }
                      if (urlEditor.length > 0 && idUser) {
                        var acao_pro = insertHtml ? "set_automatico" : "set_new_doc";
                        if (openProc) openLinkNewTab(href);
                        openWindowEditor(urlEditor[0] + "#&acao_pro=" + acao_pro, idUser);
                        if (insertHtml) alertaBoxPro("Sucess", "check-circle", "Documento gerado com sucesso", refreshDocViewArvorePro);
                      }
                      if (ifrArvore.length) {
                        if (urlReload) {
                          ifrArvore.attr("src", urlReload);
                        } else {
                          var ifrArvoreElem = getIframeArvoreElement();
                          if (ifrArvoreElem && ifrArvoreElem.contentWindow) ifrArvoreElem.contentWindow.location.reload(true);
                        }
                      }
                    } else {
                      alertaBoxPro("Error", "exclamation-triangle", "Erro ao gerar o documento.");
                    }
                  });
                });
              } else {
                alertaBoxPro("Error", "exclamation-triangle", "Erro ao selecionar o tipo de documento. Verifique se o tipo est\xE1 dispon\xEDvel no sistema e tente novamente");
              }
            });
          } else {
            alertaBoxPro("Error", "exclamation-triangle", "Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!");
          }
        });
      });
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Funcionalidade n\xE3o dispon\xEDvel para processos sigilosos!");
    }
  }
  function refreshDocViewArvorePro() {
    $("#ifrArvore").contents().find(".infraArvoreNoSelecionado").trigger("click");
  }
  function setNewProc(id_tipo_procedimento, id_tipo_documento) {
    var urlInitProc = $(mainMenu + ' a[href*="acao=procedimento_escolher_tipo"]').attr("href");
    if (urlInitProc !== null) {
      $.ajax({ url: urlInitProc }).done(function(htmlInitProc) {
        var $htmlInitProc = $(htmlInitProc);
        var form = $htmlInitProc.find("#frmIniciarProcessoEscolhaTipo");
        var hrefForm = form.attr("action");
        var param = {};
        form.find("input[type=hidden]").each(function() {
          if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
            param[$(this).attr("name")] = $(this).val();
          }
        });
        param.hdnFiltroTipoProcedimento = "T";
        $.ajax({
          method: "POST",
          data: param,
          url: hrefForm
        }).done(function(htmlFullList) {
          let $htmlFullList = $(htmlFullList);
          var urlProc = $htmlFullList.find('a[href*="procedimento_escolher_tipo&id_tipo_procedimento=' + id_tipo_procedimento + '"]').attr("href");
          if (urlProc !== null) {
            $.ajax({ url: urlProc }).done(function(htmlFormProc) {
              var $htmlFormProc = $(htmlFormProc);
              var form2 = $htmlFormProc.find("#frmProcedimentoCadastro");
              var hrefForm2 = form2.attr("action");
              var param2 = {};
              form2.find("input[type=hidden]").each(function() {
                if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
                  param2[$(this).attr("name")] = $(this).val();
                }
              });
              form2.find("input[type=text]").each(function() {
                if ($(this).attr("id") && $(this).attr("id").indexOf("txt") !== -1) {
                  param2[$(this).attr("id")] = $(this).val();
                }
              });
              form2.find("select").each(function() {
                if ($(this).attr("id") && $(this).attr("id").indexOf("sel") !== -1) {
                  param2[$(this).attr("id")] = $(this).val();
                }
              });
              form2.find("input[type=radio]").each(function() {
                if ($(this).attr("name") && $(this).attr("name").indexOf("rdo") !== -1) {
                  param2[$(this).attr("name")] = $(this).val();
                }
              });
              param2.rdoNivelAcesso = "0";
              param2.hdnFlagProcedimentoCadastro = "2";
              param2.rdoProtocolo = "M";
              param2.txaObservacoes = "";
              param2.hdnAssuntos = $htmlFormProc.find("#selAssuntos option").length == 0 ? [] : $htmlFormProc.find("#selAssuntos option").map(function() {
                return $(this).val() + "\xB1" + $(this).text();
              }).get().join("\xA5").replaceAll(" ", "+");
              param2.hdnInteressados = $htmlFormProc.find("#selInteressados option").map(function() {
                return $(this).val() + "\xB1" + $(this).text();
              }).get().join("\xA5").replaceAll(" ", "+");
              var postData = "";
              for (var k in param2) {
                if (postData !== "") postData = postData + "&";
                var valor = k == "hdnNomeTipoProcedimento" ? escapeComponent(param2[k]) : param2[k];
                valor = k == "hdnAssuntos" ? escapeComponent(param2[k]) : valor;
                postData = postData + k + "=" + valor;
              }
              console.log(param2, postData);
              var xhr = new XMLHttpRequest();
              $.ajax({
                method: "POST",
                // data: param,
                data: postData,
                url: hrefForm2,
                contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
                xhr: function() {
                  return xhr;
                }
              }).done(function(htmlResult) {
                var status = xhr.responseURL.indexOf("controlador.php?acao=procedimento_trabalhar&acao_origem=procedimento_gerar") !== -1 ? true : false;
                if (status) {
                  var $htmlResult = $(htmlResult);
                  var linkProc = $htmlResult.find("#ifrArvore").attr("src");
                  var id_procedimento = linkProc !== null ? getParamsUrlPro(linkProc).id_procedimento : false;
                  id_procedimento = typeof id_procedimento !== "undefined" ? id_procedimento : false;
                  var href = url_host.replace("controlador.php", "") + "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + String(id_procedimento);
                  if (id_procedimento && href) {
                    setNewDoc(id_procedimento, id_tipo_documento);
                  } else {
                    alertaBoxPro("Error", "exclamation-triangle", "N\xE3o foi poss\xEDvel abrir o processo gerado. Verifique na caixa de entrada de sua unidade");
                  }
                }
              });
            });
          } else {
            alertaBoxPro("Error", "exclamation-triangle", "Erro ao selecionar o tipo de processo. Verifique se o tipo est\xE1 dispon\xEDvel no sistema e tente novamente");
          }
        });
      });
    } else {
      alertaBoxPro("Error", "exclamation-triangle", "Erro ao iniciar a cria\xE7\xE3o do processo");
    }
  }
  function setSizeIframePro(tLeft, saveSize = true) {
    $("head").find('style[data-style="seipro-sizeiframe"]').remove();
    $("head").prepend("<style type='text/css' data-style='seipro-sizeiframe'>   .seiSlim:not(.newSEI) iframe#ifrArvore {\n      width: " + (tLeft - 6) + "px !important;\n  }\n  .seiSlim.seiSlim_hidemenu:not(.newSEI) iframe#ifrVisualizacao,\n  .seiSlim.seiSlim_hidemenu:not(.newSEI) iframe#ifrConteudoVisualizacao {\n      width: calc(97vw - " + (tLeft - 6) + "px) !important;\n  }\n  .seiSlim:not(.newSEI) iframe#ifrVisualizacao,\n  .seiSlim:not(.newSEI) iframe#ifrConteudoVisualizacao {\n      width: calc(78vw - " + (tLeft - 6) + "px) !important;\n  }\n</style>");
    if (saveSize) setOptionsPro("iframeSizeSlimPro", tLeft);
    if (SeiPro.sei.adapter.isNewSEI()) $("#divIframeArvore").css("width", tLeft);
  }
  function infraMenuSistemaEsquema() {
    return false;
  }
  function infraMenuSistemaEsquemaPro() {
    if (!delayCrash) {
      if (SeiPro.sei.adapter.isNewSEI()) {
        if (!checkMenuVisible()) {
          showMenuSEIPro();
        } else {
          hideMenuSEIPro();
        }
      } else {
        if ($("#divInfraAreaTelaE").is(":visible")) {
          hideMenuSEIPro();
        } else {
          showMenuSEIPro();
        }
      }
      delayCrash = true;
      setTimeout(function() {
        delayCrash = false;
      }, 300);
    }
  }
  function hideMenuSEIPro() {
    if (verifyConfigValue("menususpenso") && !SeiPro.sei.adapter.isNewSEI()) {
      $("#divInfraAreaTelaE").hide({ effect: "slide", direction: "left", duration: 300, complete: function() {
        $(this).attr("style", "display:none;");
      } });
      $(infraBarraS).addClass("barSuspenso_hide").removeClass("barSuspenso_show");
      $("#divInfraAreaTelaE").hide();
      $("#divInfraAreaTelaD").css({ "width": "99%" });
      setOptionsPro("showMenuSEIPro", true);
      $("body").addClass("seiSlim_hidemenu");
    } else {
      $("#divInfraAreaTelaE").hide();
      $("#divInfraAreaTelaD").css({ "width": "99%" });
      setOptionsPro("showMenuSEIPro", true);
      $("body").addClass("seiSlim_hidemenu");
      if (SeiPro.sei.adapter.isNewSEI()) {
        $("#divInfraAreaTelaE").addClass("infraMenuAnimacao");
        $("#divInfraAreaTelaE").addClass("text-truncate");
        $("#divInfraAreaTelaE").removeClass("infraAreaTelaEExibeGrande");
        $("#divInfraAreaTelaE").addClass("infraAreaTelaEEscondeGrande");
        $("#divInfraAreaTelaE").removeClass("infraAreaTelaEExibePequeno");
        $("#divInfraAreaTelaD").removeClass("infraAreaTelaDEscondePequeno");
        $("#divInfraAreaTelaE").addClass("infraAreaTelaEEscondePequeno");
        $("#divInfraSidebarMenu").css("overflow-x", "hidden");
        if (verifyConfigValue("menususpenso")) $(infraBarraS).addClass("barSuspenso_hide").removeClass("barSuspenso_show");
      }
    }
  }
  function showMenuSEIPro() {
    if (verifyConfigValue("menususpenso") && !SeiPro.sei.adapter.isNewSEI()) {
      if (typeof $.easing !== "undefined") {
        $("#divInfraAreaTelaE").show({ effect: "slide", direction: "left", duration: 300, complete: function() {
          $(this).removeAttr("style");
        } });
      }
      $(infraBarraS).addClass("barSuspenso_show").removeClass("barSuspenso_hide");
    } else {
      $("#divInfraAreaTelaE").show();
      $("#divInfraAreaTelaD").css({ "width": "79%" });
      setOptionsPro("showMenuSEIPro", false);
      $("body").removeClass("seiSlim_hidemenu");
      if (SeiPro.sei.adapter.isNewSEI()) {
        $("#divInfraAreaTelaE").addClass("text-truncate");
        $("#divInfraAreaTelaE").addClass("infraMenuAnimacao");
        $("#divInfraAreaTelaE").addClass("infraAreaTelaEExibeGrande");
        $("#divInfraAreaTelaE").removeClass("infraAreaTelaEEscondeGrande");
        $("#divInfraAreaTelaE").addClass("infraAreaTelaEExibePequeno");
        $("#divInfraAreaTelaD").addClass("infraAreaTelaDEscondePequeno");
        $("#divInfraAreaTelaE").removeClass("infraAreaTelaEEscondePequeno");
        if (verifyConfigValue("menususpenso")) $(infraBarraS).addClass("barSuspenso_show").removeClass("barSuspenso_hide");
      }
    }
  }
  function checkMenuVisible() {
    let displayMenu = $("#divInfraAreaTelaE").attr("style");
    displayMenu = typeof displayMenu !== "undefined" ? displayMenu.replace(/ /g, "") : "";
    return displayMenu == "display:none;" ? false : true;
  }
  function checkMenuSEIPro() {
    setTimeout(() => {
      $("#lnkInfraMenuSistema").attr("onclick", "return false;").off("click.seiProMenuSistema").on("click.seiProMenuSistema", function(event2) {
        event2.preventDefault();
        event2.stopPropagation();
        infraMenuSistemaEsquemaPro();
        return false;
      });
      if (verifyConfigValue("menususpenso")) {
        $("#divInfraAreaTelaE").addClass("menuSuspenso");
        $(infraBarraS).addClass("barSuspenso").attr("onclick", "infraMenuSistemaEsquemaPro()");
      }
      if (getOptionsPro("showMenuSEIPro") && checkMenuVisible()) hideMenuSEIPro();
    }, 500);
    $('img[title="Exibir/Ocultar Menu do Sistema"]').hide();
  }
  function sumTagValue(value) {
    var return_ = value;
    var prop = dadosProcessoPro.propProcesso;
    var docs = getTreeDocumentsSession(dadosProcessoPro);
    docs = docs.length === 0 ? getTreeSignedDocumentsSession(dadosProcessoPro) : docs;
    var i2 = parseInt(value.replace(/[^0-9\.]+/g, ""));
    i2 = value.indexOf("-") !== -1 ? i2 * -1 : i2;
    i2 = i2 - 1;
    if (value.indexOf("hoje") !== -1) {
      return_ = '<span class="ancoraSei dynamicField">' + moment().add(i2 + 1, "d").format("LL") + "</span>";
    } else if (value.indexOf("ano") !== -1) {
      return_ = '<span class="ancoraSei dynamicField">' + moment().format("Y") + "</span>";
    } else if (value.indexOf("assunto") !== -1) {
      var index = i2 + 1 > prop.selAssuntos_select.length ? prop.selAssuntos_select.length - 1 : i2;
      return_ = '<span class="ancoraSei dynamicField">' + prop.selAssuntos_select[index] + "</span>";
    } else if (value.indexOf("interessado") !== -1) {
      var index = i2 + 1 > prop.selInteressadosProcedimento.length ? prop.selInteressadosProcedimento.length - 1 : i2;
      return_ = '<span class="ancoraSei dynamicField">' + prop.selInteressadosProcedimento[index] + "</span>";
    } else if (value.indexOf("observacao") !== -1) {
      var index = i2 + 1 > prop.txaObservacoes.length ? prop.txaObservacoes.length - 1 : i2;
      return_ = '<span class="ancoraSei dynamicField">' + prop.txaObservacoes[index].unidade + ": " + prop.txaObservacoes[index].observacao + "</span>";
    } else if (value.indexOf("documento") !== -1) {
      var docValue = "";
      if (value.indexOf("+") !== -1 || value.indexOf("-") !== -1) {
        var indexDoc = 0;
        var indexCurrent = false;
        $.each(docs, function(i3, v) {
          if (v.id_protocolo == getParamsUrlPro(window.location.href).id_documento) {
            indexCurrent = i3;
            return indexDoc;
          }
          indexDoc++;
        });
        var iDoc = indexDoc + (i2 + 1);
        iDoc = docs.length <= iDoc ? docs.length - 1 : iDoc;
        iDoc = value.indexOf("-") !== -1 && value.split("-")[1] == "ultimo" ? docs.length - 1 : iDoc;
        iDoc = value.indexOf("-") !== -1 && value.split("-")[1] == "atual" ? indexCurrent : iDoc;
        docValue = getHtmlListDocumentos(docs[iDoc]);
      } else if (hasNumber(value)) {
        docValue = getHtmlListDocumentos(docs[i2]);
      }
      return_ = '<span class="ancoraSei dynamicField">' + docValue + "</span>";
    }
    return return_;
  }
  function getHtmlListDocumentos(value) {
    if (typeof value !== "undefined") {
      var nrSei = value.nr_sei != "" ? value.nr_sei : value.documento;
      var citacaoDoc = getCitacaoDoc();
      var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei' + value.id_protocolo + '" style="text-indent:0;">' + nrSei + "</a></span>";
      return value.nr_sei != "" || getConfigValue("citacaodoc") == "citacaodoc_4" ? value.documento.trim() + "&nbsp;(" + citacaoDoc + nrSeiHtml + ")" : nrSeiHtml;
    } else {
      return "";
    }
  }
  function getQRProcesso() {
    var optionsProc = {
      "render": "image",
      "ecLevel": "L",
      "minVersion": 6,
      "fill": "#333333",
      "background": "#ffffff",
      "text": url_host + "?acao=procedimento_trabalhar&id_procedimento=" + getParamsUrlPro(window.location.href).id_procedimento,
      "size": 150,
      "radius": 0.5,
      "quiet": 1,
      "mode": 0,
      "mSize": 0.2,
      "mPosX": 0.5,
      "mPosY": 0.5,
      "label": "SEI Pro PRF Dev",
      "fontname": "Arial",
      "fontcolor": "#ff9818",
      "image": {}
    };
    var srcImg = $("<div>").qrcode(optionsProc).find("img").attr("src");
    return `<img src="${srcImg}">`;
  }
  function camposDinamicosProcesso(arrayTags) {
    var prop = dadosProcessoPro.propProcesso;
    var docs = getTreeDocumentsSession(dadosProcessoPro);
    docs = docs.length === 0 ? getTreeSignedDocumentsSession(dadosProcessoPro) : docs;
    var processo = typeof prop.txtProtocoloExibir === "undefined" ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
    processo = typeof processo !== "undefined" ? '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei' + prop.hdnIdProcedimento + '" class="ancoraSei" style="text-indent:0px;">' + processo + "</a></span>" : null;
    processo = processo !== null && $.inArray("processo_texto", arrayTags) !== -1 ? '<span class="ancoraSei dynamicField">' + (prop.hdnProtocoloFormatado || prop.txtProtocoloExibir) + "</span>" : processo;
    var autuacao = typeof prop.txtDtaGeracaoExibir === "undefined" ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
    autuacao = typeof autuacao !== "undefined" ? '<span class="ancoraSei dynamicField">' + autuacao + "</span>" : null;
    var tipo = typeof prop.hdnNomeTipoProcedimento !== "undefined" ? '<span class="ancoraSei dynamicField">' + prop.hdnNomeTipoProcedimento + "</span>" : null;
    var especificacao = typeof prop.txtDescricao !== "undefined" ? '<span class="ancoraSei dynamicField">' + prop.txtDescricao + "</span>" : null;
    var hoje = '<span class="ancoraSei dynamicField">' + moment().format("LL") + "</span>";
    var ano = '<span class="ancoraSei dynamicField">' + moment().format("Y") + "</span>";
    var qrcode = '<span class="ancoraSei dynamicField">' + getQRProcesso() + "</span>";
    var interessados = typeof prop.selInteressadosProcedimento !== "undefined" ? $.inArray("interessados_lista", arrayTags) !== -1 ? $.map(prop.selInteressadosProcedimento, function(substr, i2) {
      return '<span class="ancoraSei dynamicField">' + substr + "</span><br>";
    }).join("") : '<span class="ancoraSei dynamicField">' + joinAnd(prop.selInteressadosProcedimento) + "</span>" : null;
    var assuntos = typeof prop.selAssuntos_select !== "undefined" ? $.inArray("assuntos_lista", arrayTags) !== -1 ? $.map(prop.selAssuntos_select, function(substr, i2) {
      return '<span class="ancoraSei dynamicField">' + substr + "</span><br>";
    }).join("") : '<span class="ancoraSei dynamicField">' + joinAnd(prop.selAssuntos_select) + "</span>" : null;
    var unidadeObs = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='" + siglaUnidadeAtual + "'] | [0]");
    var observacao = typeof prop.txaObservacoes !== "undefined" && prop.txaObservacoes.length > 0 && unidadeObs !== null && unidadeObs.observacao != "" ? '<span class="ancoraSei dynamicField">' + unidadeObs.unidade + ": " + unidadeObs.observacao + "</span>" : null;
    var observacoes = typeof prop.txaObservacoes !== "undefined" && prop.txaObservacoes.length > 0 ? $.inArray("observacoes_lista", arrayTags) !== -1 ? $.map(prop.txaObservacoes, function(value, i2) {
      return value.unidade + ": " + value.observacao + "<br>";
    }).join("") : joinAnd($.map(prop.txaObservacoes, function(value, i2) {
      return value.unidade + ": " + value.observacao;
    })) : null;
    observacoes = observacoes !== null ? '<span class="ancoraSei dynamicField">' + observacoes + "</span>" : observacoes;
    var acesso = typeof prop.rdoNivelAcesso !== "undefined" && prop.rdoNivelAcesso == 0 ? '<span class="ancoraSei dynamicField">&#127760;&nbsp; <span>P\xFAblico</span></span>' : null;
    acesso = acesso !== null && prop.rdoNivelAcesso == 1 ? '<span class="ancoraSei dynamicField">&#128274;&nbsp; <span>Restrito</span></span>' : acesso;
    acesso = acesso !== null && prop.rdoNivelAcesso == 2 ? '<span class="ancoraSei dynamicField">&#9940;&nbsp; <span>Sigiloso</span></span>' : acesso;
    acesso = acesso !== null && $.inArray("acesso_texto", arrayTags) !== -1 ? $(acesso).find("span").text() : acesso;
    var documentos = typeof docs !== "undefined" ? $.inArray("documentos_lista", arrayTags) !== -1 ? $.map(docs, function(value, i2) {
      return getHtmlListDocumentos(value) + "<br>";
    }).join("") : joinAnd($.map(docs, function(value, i2) {
      return getHtmlListDocumentos(value);
    })) : null;
    documentos = documentos !== null ? '<span class="ancoraSei dynamicField">' + documentos + "</span>" : documentos;
    var totaldocumentos = typeof docs !== "undefined" && docs !== null && $.inArray("totaldocumentos", arrayTags) !== -1 ? '<span class="ancoraSei dynamicField">' + docs.length + "</span>" : null;
    var dadosProcesso = { processo, autuacao, tipo, especificacao, hoje, ano, interessados, assuntos, acesso, documentos, totaldocumentos, observacoes, observacao, qrcode };
    return dadosProcesso;
  }
  function setInfraImg(target = $("html")) {
    target.find('img[src*="/infra_css/"], img.infraImg, img.InfraImg').wrap(function() {
      if ($(this).is(":visible")) {
        return $(this).closest(".infraImgPro").length == 0 && $(this).closest("#tblAnexos").length == 0 ? '<span class="infraImgPro" data-img="' + $(this).attr("src") + '"></span>' : false;
      } else {
        return false;
      }
    });
  }
  function initModalNewSEISigiloso(TimeOut = 1e3) {
    var sigilosoHost = (function() {
      try {
        return window.top || window;
      } catch (e) {
        return window;
      }
    })();
    if (window !== sigilosoHost) {
      return;
    }
    if (sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__) {
      return;
    }
    if (TimeOut <= 0 || !SeiPro.sei.adapter.isNewSEI() || !checkProcessoSigiloso() || $("#divInfraSparklingModalContent").is(":visible")) {
      return;
    }
    if (typeof $.modalLink !== "undefined" && typeof $().resizable !== "undefined") {
      if (checkProcessoSigiloso()) {
        try {
          if (typeof inicializar !== "function") {
            sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__ = false;
            return;
          }
          sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__ = true;
          inicializar();
        } catch (e) {
          sigilosoHost.__SEI_PRO_SIGILOSO_INIT_DONE__ = false;
          throw e;
        }
      }
    } else {
      setTimeout(function() {
        initModalNewSEISigiloso(TimeOut - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initModalNewSEISigiloso");
      }, 500);
    }
  }
  function fnJqueryPro() {
    try {
      refreshSeiPageSelectors();
    } catch (e) {
    }
    if (typeof $.tablesorter !== "undefined") {
      $.tablesorter.characterEquivalents = {
        "a": "\xE1\xE0\xE2\xE3\xE4\u0105\xE5",
        // áàâãäąå
        "A": "\xC1\xC0\xC2\xC3\xC4\u0104\xC5",
        // ÁÀÂÃÄĄÅ
        "c": "\xE7\u0107\u010D",
        // çćč
        "C": "\xC7\u0106\u010C",
        // ÇĆČ
        "e": "\xE9\xE8\xEA\xEB\u011B\u0119",
        // éèêëěę
        "E": "\xC9\xC8\xCA\xCB\u011A\u0118",
        // ÉÈÊËĚĘ
        "i": "\xED\xEC\u0130\xEE\xEF\u0131",
        // íìİîïı
        "I": "\xCD\xCC\u0130\xCE\xCF",
        // ÍÌİÎÏ
        "o": "\xF3\xF2\xF4\xF5\xF6\u014D",
        // óòôõöō
        "O": "\xD3\xD2\xD4\xD5\xD6\u014C",
        // ÓÒÔÕÖŌ
        "ss": "\xDF",
        // ß (s sharp)
        "SS": "\u1E9E",
        // ẞ (Capital sharp s)
        "u": "\xFA\xF9\xFB\xFC\u016F",
        // úùûüů
        "U": "\xDA\xD9\xDB\xDC\u016E"
        // ÚÙÛÜŮ
      };
    }
    $.fn.wrapInTag = function(opts) {
      function getText(obj) {
        return obj.textContent ? obj.textContent : obj.innerText;
      }
      var tag = opts.tag || "span", words = opts.words || [], tagclass = opts.class || "", regex = RegExp("\\b" + words.join("|") + "\\b", "igm"), replacement = "<" + tag + ' class="' + tagclass + '">$&</' + tag + ">";
      $(this).contents().each(function() {
        if (this.nodeType === 3) {
          $(this).replaceWith(getText(this).replace(regex, replacement));
        } else if (!opts.ignoreChildNodes) {
          $(this).wrapInTag(opts);
        }
      });
    };
    $.fn.extend({
      insertAtCaret: function(myValue) {
        this.each(function() {
          if (document.selection) {
            this.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
          } else if (this.selectionStart || this.selectionStart == "0") {
            var startPos = this.selectionStart;
            var endPos = this.selectionEnd;
            var scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
            this.focus();
            this.selectionStart = startPos + myValue.length;
            this.selectionEnd = startPos + myValue.length;
            this.scrollTop = scrollTop;
          } else {
            this.value += myValue;
            this.focus();
          }
        });
        return this;
      }
    });
    $.fn.moveTo = function(selector) {
      return this.each(function() {
        var cl = $(this).clone();
        $(cl).prependTo(selector);
        $(this).remove();
      });
    };
    $.extend({
      replaceTag: function(element, tagName, withDataAndEvents, deepWithDataAndEvents) {
        var newTag = $("<" + tagName + ">")[0];
        $.each(element.attributes, function() {
          newTag.setAttribute(this.name, this.value);
        });
        $(element).children().clone(withDataAndEvents, deepWithDataAndEvents).appendTo(newTag);
        return newTag;
      }
    });
    $.fn.extend({
      replaceTag: function(tagName, withDataAndEvents, deepWithDataAndEvents) {
        return this.map(function() {
          return jQuery.replaceTag(this, tagName, withDataAndEvents, deepWithDataAndEvents);
        });
      }
    });
    if (SeiPro.sei.adapter.isNewSEI()) $("body").addClass("newSEI");
    if (SeiPro.sei.adapter.isSEI5()) $("body").addClass("SeiPro.sei.adapter.isSEI5()");
    initModalNewSEISigiloso();
    if (typeof window.__seiProReadyResolve === "function") {
      window.__seiProReadyResolve(window);
      window.__seiProReadyResolve = null;
    }
  }
  function loadScriptVisualizacaoPro() {
    if ($($ifrVisualizacao).length) {
      let tryPatchWindow = function(w) {
        try {
          if (!w) return;
          if (!patchNativeEditorOpen(w) && !w.__SEI_PRO_EDITOR_OPEN_PATCHED__) {
            if (w.__SEI_PRO_EDITOR_OPEN_RETRY__) return;
            w.__SEI_PRO_EDITOR_OPEN_RETRY__ = true;
            var tries = 0;
            var timer = setInterval(function() {
              tries++;
              if (patchNativeEditorOpen(w) || w.__SEI_PRO_EDITOR_OPEN_PATCHED__ || tries >= 20) {
                clearInterval(timer);
                w.__SEI_PRO_EDITOR_OPEN_RETRY__ = false;
              }
            }, 250);
          }
        } catch (e) {
        }
      }, tryPatchViz = function() {
        var w = $($ifrVisualizacao)[0] && $($ifrVisualizacao)[0].contentWindow;
        tryPatchWindow(w);
      }, tryPatchNestedViz = function() {
        var $ifrInternoVisualizacao = $($ifrVisualizacao).contents().find("#ifrVisualizacao");
        if (!$ifrInternoVisualizacao.length) return;
        var nestedWindow = $ifrInternoVisualizacao[0] && $ifrInternoVisualizacao[0].contentWindow;
        tryPatchWindow(nestedWindow);
        $ifrInternoVisualizacao.off("load.seipro-editor-open").on("load.seipro-editor-open", function() {
          tryPatchWindow(this.contentWindow);
          scriptVisualizacaoPro($(this).contents());
        });
      };
      $($ifrVisualizacao).off("load.seipro").on("load.seipro", function() {
        tryPatchViz();
        tryPatchNestedViz();
        scriptVisualizacaoPro($($ifrVisualizacao).contents());
      });
      try {
        var readyWin = $($ifrVisualizacao)[0] && $($ifrVisualizacao)[0].contentWindow;
        if (readyWin && readyWin.document && readyWin.document.readyState === "complete") {
          tryPatchViz();
          tryPatchNestedViz();
        }
      } catch (e2) {
      }
    }
  }
  function scriptVisualizacaoPro(ifrV) {
    if (typeof loadStyleDesign === "function") loadStyleDesign(ifrV.find("body"), "view");
    if (typeof loadFontIcons === "function") loadFontIcons("head", ifrV);
    if (typeof checkPageVisualizacao === "function") checkPageVisualizacao();
    if (typeof checkPageAtividadesVisualizacao === "function") checkPageAtividadesVisualizacao();
    if (typeof checkPageMonitoradosVisualizacao === "function") checkPageMonitoradosVisualizacao();
  }
  function loadScriptArvorePro() {
    if (!window.__SEI_PRO_ARVORE_READY_LISTENER__) {
      window.__SEI_PRO_ARVORE_READY_LISTENER__ = true;
      window.addEventListener("sei-pro-arvore-ready", function() {
        if (typeof loadResizeIframeArvoreNewSEI === "function") loadResizeIframeArvoreNewSEI();
        if (typeof resizeArvoreMaxWidth === "function" && typeof verifyConfigValue === "function" && verifyConfigValue("resizearvore")) resizeArvoreMaxWidth(true);
      });
    }
    if ($("#ifrArvore").length) {
      $("#ifrArvore").off("load.seipro").on("load.seipro", function() {
        if (typeof loadResizeIframeArvoreNewSEI === "function") loadResizeIframeArvoreNewSEI();
      });
    }
  }
  function initLoadSeiProArvore(TimeOut = 1e3) {
    var ifrArvore = getIframeArvoreElement();
    if (ifrArvore && ifrArvore.contentWindow && typeof ifrArvore.contentWindow.initSeiProArvore === "function") {
      ifrArvore.contentWindow.initSeiProArvore();
    }
  }
  try {
    if (localStorage.getItem("seiSlim") && !SeiPro.sei.adapter.isNewSEI()) {
      let movemouse = function(e) {
        if (e == null) {
          e = window.event;
        }
        if (e.button <= 1 && isdrag) {
          var tamanhoRedimensionamento = null;
          tamanhoRedimensionamento = nn6 ? tx + e.clientX - x : tx + event.clientX - x;
          var tamanhoLeft = 0;
          var tamanhoRight = 0;
          if (tamanhoRedimensionamento > 0) {
            tamanhoLeft = divLeftTamanhoInicial + tamanhoRedimensionamento;
            tamanhoRight = divRightTamanhoInicial - tamanhoRedimensionamento;
          } else {
            tamanhoLeft = divLeftTamanhoInicial - Math.abs(tamanhoRedimensionamento);
            tamanhoRight = divRightTamanhoInicial + Math.abs(tamanhoRedimensionamento);
          }
          if (tamanhoLeft < 0 || tamanhoRight < 0) {
            if (tamanhoRedimensionamento > 0) {
              tamanhoLeft = 0;
              tamanhoRight = divLeftTamanhoInicial - divRightTamanhoInicial;
            } else {
              tamanhoLeft = divLeftTamanhoInicial - divRightTamanhoInicial;
              tamanhoRight = 0;
            }
          }
          if (tamanhoLeft > 50 && tamanhoRight > 100) {
            setSizeIframePro(tamanhoLeft);
          }
        }
        return false;
      };
    } else if (localStorage.getItem("seiSlim") && SeiPro.sei.adapter.isNewSEI() && typeof $().resizable === "function") {
      loadResizeIframeArvoreNewSEI();
    }
  } catch (e) {
  }
  function loadResizeIframeArvoreNewSEI() {
    if ($("#divIframeArvore").length && typeof $().resizable === "function") {
      if ($("#divIframeArvore").data("ui-resizable")) return;
      $("#divIframeArvore").resizable({
        handles: "e,  w",
        minWidth: 200,
        maxWidth: $(document).width() - 600,
        start: function() {
          ifr = $("#ifrArvore");
          var d = $("<div></div>");
          $("#divConteudo").append(d[0]);
          d[0].id = "temp_div";
          d.css({
            position: "absolute"
          });
          d.css({
            top: ifr.position().top,
            left: 0
          });
          d.height(ifr.height());
          d.width("100%");
        },
        stop: function() {
          $("#temp_div").remove();
          setSizeIframePro($("#ifrArvore").width());
        }
      });
      loadDBClickResizeIframeArvore();
    }
  }
  function loadDBClickResizeIframeArvore() {
    $("#divIframeArvore").on("dblclick", function() {
      setResizeArvoreMaxWidth(60, true);
    }).attr("onmouseover", "return infraTooltipMostrar('Duplo clique para redimensionar pela largura total da \xE1rvore')").attr("onmouseout", "return infraTooltipOcultar();");
  }
  function loadScriptPro() {
    if (frmEditor.length || $("#divEditores").length) {
    } else {
      $(document).ready(function() {
        loadScriptVisualizacaoPro();
        loadScriptArvorePro();
        checkMenuSEIPro();
      });
    }
  }
  loadScriptPro();
  (function() {
    function getRuntimeApiSeiPro() {
      if (typeof browser !== "undefined" && browser.runtime) return browser;
      if (typeof chrome !== "undefined" && chrome.runtime) return chrome;
      return null;
    }
    function getProcessNotificationCountSeiPro() {
      return $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso, a.processoCredencialAssinaturaSigiloso").length;
    }
    window.initProcessNotificationsPro = function initProcessNotificationsPro2() {
      if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;
      var start = function() {
        if (window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__) return;
        if (typeof checkConfigValue !== "function") return;
        var sync = function(force) {
          var enabled = checkConfigValue("notificacaonovoprocesso");
          var count = enabled ? getProcessNotificationCountSeiPro() : 0;
          var stateKey = [
            window.location.host || "",
            $("#lnkUsuarioSistema").attr("title") || (typeof getOptionsPro === "function" ? getOptionsPro("usuarioSistema") : "") || "",
            typeof siglaUnidadeAtual !== "undefined" ? siglaUnidadeAtual : ""
          ].join("::");
          if (!stateKey.replace(/:/g, "").trim()) return false;
          if (!force && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.enabled === enabled && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.count === count && window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__.key === stateKey) {
            return false;
          }
          window.__SEI_PRO_PROCESS_NOTIFICATION_LAST__ = {
            enabled,
            count,
            key: stateKey
          };
          var runtimeApi = getRuntimeApiSeiPro();
          if (!runtimeApi || !runtimeApi.runtime || typeof runtimeApi.runtime.sendMessage !== "function") {
            return false;
          }
          runtimeApi.runtime.sendMessage({
            action: "syncNotificacaoProcessos",
            enabled,
            count,
            key: stateKey,
            label: (typeof siglaUnidadeAtual !== "undefined" ? siglaUnidadeAtual : "") || window.location.host || ""
          }, function() {
          });
          return true;
        };
        sync(true);
        window.__SEI_PRO_PROCESS_NOTIFICATION_INTERVAL__ = window.setInterval(function() {
          sync(false);
        }, 1e4);
      };
      if (window.__SEI_PRO_CONFIG_READY__) {
        start();
      } else {
        window.addEventListener("sei-pro-config-ready", start, { once: true });
      }
    };
    window.initSmartSignatureSelectionPro = function initSmartSignatureSelectionPro2() {
      if (window.location.href.indexOf("acao=rel_bloco_protocolo_listar") === -1 || window.__SEI_PRO_SMART_SIGNATURE_SELECTION__) {
        return false;
      }
      var normalize = function(text) {
        return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
      };
      var getCurrentUserName = function() {
        var userTitle = $("#lnkUsuarioSistema").attr("title") || "";
        var userText = $("#lnkUsuarioSistema").text() || "";
        var userName = "";
        var titleMatchers = [
          /(.+)\s-\s/,
          /(.+)\s\(.*/,
          /(.+?)\s*\/\s*.*/
        ];
        $.each(titleMatchers, function(_, matcher) {
          var match = userTitle.match(matcher);
          if (!userName && match && match[1]) userName = match[1].trim();
        });
        if (!userName && userTitle) userName = userTitle.split("\n")[0].trim();
        if (!userName && userText) userName = userText.trim();
        return userName;
      };
      var getTable = function() {
        var table = $("#tblProtocolosBlocos").first();
        if (table.length) return table;
        table = $("#frmRelBlocoProtocoloLista #divInfraAreaTabela table.infraTable").first();
        return table;
      };
      var getSignatureColumnIndex = function(table) {
        var indexAssinatura = -1;
        var headerCells = table.find("thead tr:first th, thead tr:first td");
        if (!headerCells.length) headerCells = table.find("tr:first th, tr:first td");
        headerCells.each(function(index) {
          if (/^Assinaturas?$/i.test($(this).text().trim())) {
            indexAssinatura = index;
            return false;
          }
        });
        return indexAssinatura;
      };
      var toggleCheckbox = function($checkbox, checked) {
        if ($checkbox.prop("checked") !== checked) {
          $checkbox.trigger("click");
        }
      };
      var applySelection = function(type) {
        var table = getTable();
        var indexAssinatura = getSignatureColumnIndex(table);
        var usuario = normalize(getCurrentUserName());
        if (!table.length || indexAssinatura < 0) return false;
        table.find("tr").each(function() {
          var tr = $(this);
          var checkbox = tr.find('input[type="checkbox"]').first();
          var cells = tr.find("td");
          if (!checkbox.length || cells.length <= indexAssinatura) return;
          var assinatura = normalize(cells.eq(indexAssinatura).text());
          var hasAssinatura = assinatura.length > 0;
          var hasMinhaAssinatura = !!(usuario && hasAssinatura && assinatura.indexOf(usuario) !== -1);
          if (type === "todos") toggleCheckbox(checkbox, true);
          if (type === "nenhum") toggleCheckbox(checkbox, false);
          if (type === "sem-assinatura") toggleCheckbox(checkbox, !hasAssinatura);
          if (type === "sem-minha-assinatura") toggleCheckbox(checkbox, !hasMinhaAssinatura);
          if (type === "com-minha-assinatura") toggleCheckbox(checkbox, hasMinhaAssinatura);
        });
        return true;
      };
      var render = function() {
        var table = getTable();
        var caption = $("#tblProtocolosBlocos caption.infraCaption").first();
        if (!caption.length) caption = table.find("caption.infraCaption").first();
        var toolbar = $("#frmRelBlocoProtocoloLista #divInfraBarraComandosSuperior").first();
        var target = caption.length ? caption : toolbar;
        if (!table.length || !target.length || target.find(".seiProSignatureSelection").length) {
          return false;
        }
        target.append(
          '<span class="seiProSignatureSelection"><span class="seiProSignatureSelection_label">Selecionar:</span><a class="newLink" href="#" data-selection-signature="todos">Todos</a><a class="newLink" href="#" data-selection-signature="nenhum">Nenhum</a><a class="newLink" href="#" data-selection-signature="sem-assinatura">Sem assinatura</a><a class="newLink" href="#" data-selection-signature="sem-minha-assinatura">Sem minha assinatura</a><a class="newLink" href="#" data-selection-signature="com-minha-assinatura">Com minha assinatura</a></span>'
        );
        return true;
      };
      var start = function() {
        if (window.__SEI_PRO_SMART_SIGNATURE_SELECTION__) return;
        if (typeof checkConfigValue !== "function" || !checkConfigValue("selecaointeligenteblocoassinatura")) return;
        if (!$("#frmRelBlocoProtocoloLista").length || !$("#tblProtocolosBlocos").length || !$("#btnAssinar").length) return;
        if (!render()) return;
        $(document).off("click.seiProSignatureSelection").on("click.seiProSignatureSelection", ".seiProSignatureSelection a[data-selection-signature]", function(event2) {
          event2.preventDefault();
          applySelection($(this).attr("data-selection-signature"));
        });
        window.__SEI_PRO_SMART_SIGNATURE_SELECTION__ = true;
      };
      if (window.__SEI_PRO_CONFIG_READY__) {
        start();
      } else {
        window.addEventListener("sei-pro-config-ready", start, { once: true });
      }
      return true;
    };
    window.initGlobalSignatureBlockIndicatorPro = function initGlobalSignatureBlockIndicatorPro() {
      if (window.__SEI_PRO_SIGNATURE_BLOCKS_INDICATOR__) return false;
      var cacheKey = "seiProSignatureBlocksIndicatorCache";
      var cacheTtlMs = 60 * 1e3;
      var getTargetLinks = function() {
        return $('#infraMenu a[href*="acao=bloco_assinatura_listar"], #main-menu a[href*="acao=bloco_assinatura_listar"]');
      };
      var renderCount = function(count) {
        getTargetLinks().each(function() {
          var link = $(this);
          var badge = link.find(".seiProSignatureBlocksIndicator");
          if (!badge.length) {
            badge = $('<span class="seiProSignatureBlocksIndicator is-zero"></span>');
            link.append(badge);
          }
          if (count > 0) {
            badge.text(count > 99 ? "99+" : String(count)).removeClass("is-zero");
          } else {
            badge.text("").addClass("is-zero");
          }
        });
      };
      var getListUrl = function() {
        var menuLink = getTargetLinks().first().attr("href");
        if (menuLink) return menuLink;
        var url = new URL(window.location.href);
        url.search = "";
        url.hash = "";
        return url.pathname + "?acao=bloco_assinatura_listar";
      };
      var getCachedCount = function() {
        try {
          var cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
          if (!cached || !cached.key || !cached.updatedAt) return null;
          var cacheScope = [
            window.location.host || "",
            $("#lnkUsuarioSistema").attr("title") || "",
            typeof siglaUnidadeAtual !== "undefined" ? siglaUnidadeAtual : ""
          ].join("::");
          if (cached.key !== cacheScope) return null;
          if (Date.now() - cached.updatedAt > cacheTtlMs) return null;
          return cached.count;
        } catch (error) {
          return null;
        }
      };
      var setCachedCount = function(count) {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({
            key: [
              window.location.host || "",
              $("#lnkUsuarioSistema").attr("title") || "",
              typeof siglaUnidadeAtual !== "undefined" ? siglaUnidadeAtual : ""
            ].join("::"),
            count,
            updatedAt: Date.now()
          }));
        } catch (error) {
        }
      };
      var shouldEnable = function() {
        if (typeof checkConfigValue !== "function") return true;
        return checkConfigValue("indicadorglobalblocoassinatura");
      };
      var fetchCount = function() {
        if (!shouldEnable()) {
          renderCount(0);
          return;
        }
        var url = getListUrl();
        if (!url) return;
        fetch(url, { credentials: "same-origin" }).then(function(response) {
          if (!response.ok) throw new Error("Falha ao consultar blocos de assinatura");
          return response.text();
        }).then(function(html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var count = doc.querySelectorAll('#tblBlocos tbody tr td a[onclick*="acaoAssinar("]').length;
          setCachedCount(count);
          renderCount(count);
        }).catch(function(error) {
          if (typeof verifyConfigValue === "function" && verifyConfigValue("debugpage")) {
            console.warn("Falha ao atualizar indicador global de blocos de assinatura:", error && error.message ? error.message : error);
          }
        });
      };
      var start = function() {
        if (window.__SEI_PRO_SIGNATURE_BLOCKS_INDICATOR__) return;
        if (!getTargetLinks().length) return;
        var cachedCount = getCachedCount();
        if (cachedCount !== null) renderCount(cachedCount);
        fetchCount();
        window.__SEI_PRO_SIGNATURE_BLOCKS_INDICATOR__ = window.setInterval(fetchCount, cacheTtlMs);
      };
      $(function() {
        window.setTimeout(start, 300);
      });
      return true;
    };
  })();

  // src/features/sei-functions/legacy-api.js
  function installSeiFunctionsLegacyApi() {
    installSeiFunctionsState();
    [domain_exports, io_exports].forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
      });
    });
    Object.keys(body_exports).forEach((name) => {
      const value = body_exports[name];
      if (typeof value === "function") aliasGlobal(name, value);
    });
    aliasGlobal("refreshSeiPageSelectors", refreshSeiPageSelectors);
  }

  // src/features/sei-functions/index.js
  installSeiFunctionsState();
  var namespace = globalThis.SeiPro = globalThis.SeiPro || {};
  namespace.features = namespace.features || {};
  namespace.features.seiFunctions = {
    format2DecimalDomain,
    getSeiFunctionsNet,
    refreshSeiPageSelectors
  };
  installSeiFunctionsLegacyApi();
  ready(function() {
    try {
      refreshSeiPageSelectors();
    } catch (e) {
    }
    fnJqueryPro();
  });
})();
