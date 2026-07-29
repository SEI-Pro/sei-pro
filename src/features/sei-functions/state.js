/**
 * Sei Functions Pro — mutable runtime state on globalThis.
 * Load-time DOM/adapter selectors are refreshed defensively (content_script may
 * evaluate before the SEI chrome is fully present).
 */
export function installSeiFunctionsState() {
    const g = globalThis;
    if (g.__SEI_PRO_FUNCTIONS_STATE_INSTALLED__) return g;

    g.loadFunctionsPro = true;
    if (!g.SeiProReady) {
        g.SeiProReady = new Promise(function (resolve) { g.__seiProReadyResolve = resolve; });
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

    g.url_host = window.location.href.split('?')[0];

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

    g.tableHomeTimeout = 3000;

    g.iconsFlashMenu = [
                        {name: 'Copiar n\u00FAmero do processo', icon: 'fas fa-copyright', alt: ''},
                        {name: 'Copiar somente o n\u00FAmero', icon: 'fab fa-cuttlefish', alt: ''},
                        {name: 'Copiar link do processo', icon: 'fas fa-link', alt: ''},
                        {name: 'Enviar Documento Externo', icon: 'fa-upload', alt: ''},
                        {name: 'A\u00E7\u00F5es em lote', icon: 'fa-cogs', alt: ''},
                        {name: 'Adicionar ou Remover Urg\u00EAncia', icon: 'fa-exclamation-circle', alt: 'Add/Remover Urg\u00EAncia'},
                        {name: 'Incluir Documento', icon: 'fas fa-file-alt', alt: 'Incluir Novo Documento'},
                        {name: 'Consultar/Alterar Processo', icon: 'fa-file-signature', alt: ''},
                        {name: 'Iniciar Processo Relacionado', icon: 'fa-sync-alt', alt: 'Iniciar Proc. Relacionado'},
                        {name: 'Acompanhamento Especial', icon: 'fas fa-eye', alt: ''},
                        {name: 'Enviar Processo', icon: 'fas fa-share-square', alt: ''},
                        {name: 'Atualizar Andamento', icon: 'fas fa-globe-americas', alt: ''},
                        {name: 'Atribuir Processo', icon: 'fa-user-friends', alt: ''},
                        {name: 'Duplicar Processo', icon: 'fa-copy', alt: ''},
                        {name: 'Relacionamentos do Processo', icon: 'fa-retweet', alt: ''},
                        {name: 'Gerenciar Disponibiliza\u00E7\u00F5es de Acesso Externo', icon: 'fa-users-cog', alt: 'Gerenciar Acesso Externo'},
                        {name: 'Anota\u00E7\u00F5es', icon: 'fas fa-sticky-note', alt: ''},
                        {name: 'Sobrestar Processo', icon: 'fa-pause-circle', alt: ''},
                        {name: 'Anexar Processo', icon: 'fa-paperclip', alt: ''},
                        {name: 'Gerar Arquivo PDF do Processo', icon: 'fa-file-pdf', alt: 'Gerar Arquivo PDF'},
                        {name: 'Gerar Arquivo ZIP do Processo', icon: 'fa-file-archive', alt: 'Gerar Arquivo ZIP'},
                        {name: 'Gerenciar Ponto de Controle', icon: 'fa-flag', alt: 'Gerenciar Ponto de Controle'},
                        {name: 'Gerenciar Marcador', icon: 'fa-tags', alt: ''},
                        {name: 'Concluir Processo', icon: 'fa-folder-open', alt: 'Concluir/Reabrir Processo'},
                        {name: 'Ci\u00EAncia', icon: 'fa-thumbs-up', alt: ''},
                        {name: 'Enviar Correspond\u00EAncia Eletr\u00F4nica', icon: 'fa-envelope-open-text', alt: 'Enviar Correspond\u00EAncia'},
                        {name: 'Incluir em Bloco', icon: 'fa-layer-group', alt: ''},
                        {name: 'Reabrir Processo', icon: 'fa-folder-open', alt: 'Concluir/Reabrir Processo'},
                        {name: 'Ordenar \u00C1rvore do Processo', icon: 'fa-sort-amount-down-alt', alt: 'Ordenar \u00C1rvore'}
                    ];

    g.iconsFlashDocMenu = [
                        {name: 'Copiar n\u00FAmero SEI', icon: 'fas fa-copyright', alt: '', show: true},
                        {name: 'Copiar nome do documento', icon: 'fas fa-file-alt', alt: '', show: true},
                        {name: 'Copiar link do documento', icon: 'fas fa-link', alt: '', show: true},
                        {name: 'Duplicar documento', icon: 'fa-copy', alt: '', show: true},
                        {name: 'Copiar para...', icon: 'fa-share', alt: '', show: true},
                        {name: 'Imprimir Web', icon: 'fa-print', alt: '', show: false},
                        {name: 'Visualizar em nova aba', icon: 'fa-window-restore', alt: '', show: false},
                        {name: 'Baixar documento', icon: 'fa-download', alt: '', show: false},
                        {name: 'Consultar documento', icon: 'fa-users', alt: '', show: false},
                        {name: 'Incluir em bloco', icon: 'fa-book', alt: '', show: false},
                        {name: 'Cancelar documento', icon: 'fa-ban', alt: '', show: false},
                        {name: 'Vers\u00F5es do documento', icon: 'fa-code-branch', alt: '', show: false},
                        {name: 'Gerar circular', icon: 'fa-circle-notch', alt: '', show: false},
                        {name: 'Assinatura externa', icon: 'fa-file-signature', alt: '', show: false},
                        {name: 'Excluir documento', icon: 'fa-trash-alt', alt: '', show: false},
                        {name: 'Editar documento', icon: 'fa-edit', alt: '', show: false},
                        {name: 'Assinar documento', icon: 'fa-pen-alt', alt: '', show: false},
                        {name: 'Adicionar aos monitorados', icon: 'fa-star', alt: '', show: false},
                        {name: 'Ci\u00EAncia', icon: 'fa-thumbs-up', alt: '', show: false},
                        {name: 'Enviar por e-mail', icon: 'fa-at', alt: '', show: false},
                        {name: 'Mover p/ outro processo', icon: 'fa-people-carry', alt: '', show: false},
                        {name: 'Intima\u00E7\u00E3o eletr\u00F4nica', icon: 'fa-bullhorn', alt: '', show: false},
                        {name: 'Copiar n\u00FAmero com link', icon: 'fab fa-creative-commons-sa', alt: '', show: true},
                        {name: 'Copiar nome com link', icon: 'fa-external-link-alt', alt: '', show: true}
                    ];

    g.iconsFlashDocArvore = [
                        {name: 'Copiar n\u00FAmero SEI', icon: 'far fa-copyright', alt: '', mode: 'copy'},
                        {name: 'Copiar nome do documento', icon: 'far fa-file-alt', alt: '', mode: 'name'},
                        {name: 'Copiar link do documento', icon: 'fas fa-link', alt: '', mode: 'link'},
                        {name: 'Duplicar documento', icon: 'far fa-copy', alt: '', mode: 'clone'},
                        {name: 'Copiar para...', icon: 'fas fa-share', alt: 'Copiar documento para outro processo', mode: 'copyto'},
                        {name: 'Copiar n\u00FAmero com link', icon: 'fab fa-creative-commons-sa', alt: '', mode: 'numberlink'},
                        {name: 'Copiar nome com link', icon: 'fas fa-external-link-alt', alt: '', mode: 'namelink'},
                        {name: 'Visualizar em nova aba', icon: 'fas fa-window-restore', alt: '', mode: 'view'},
                    ];

    g.iconsFlashPanelArvore = [
                        {name: 'Anota\u00E7\u00F5es', icon: 'fas fa-sticky-note', alt: 'Anota\u00E7\u00F5es'},
                        {name: 'Atribui\u00E7\u00E3o', icon: 'fas fa-user-tie', alt: 'Atribui\u00E7\u00E3o'},
                        {name: 'Tipo de Procedimento', icon: 'fas fa-inbox', alt: 'Tipo de Procedimento'},
                        {name: 'Marcador', icon: 'fas fa-tags', alt: 'Marcador'},
                        {name: 'N\u00EDvel de Acesso', icon: 'fas fa-lock', alt: 'N\u00EDvel de Acesso'},
                        {name: 'Interessados', icon: 'fas fa-users', alt: 'Interessados'},
                        {name: 'Assuntos', icon: 'fas fa-bookmark', alt: 'Assuntos'},
                        {name: 'Observa\u00E7\u00F5es', icon: 'fas fa-comment-alt', alt: 'Observa\u00E7\u00F5es'},
                        {name: 'Bloco Interno', icon: 'fas fa-book', alt: 'Bloco Interno'},
                        {name: 'Acompanhamento Especial', icon: 'fas fa-eye', alt: 'Acompanhamento Especial'}
                    ];

    // rangeEtapasPro / rangeProjetosPro removed — Projetos no longer uses Sheets tabs.

    g.rangeFeriadosNacionaisPro = "FeriadosNacionais";

    g.rangeConfigGeral = "ConfigGeral";

    g.CLIENT_ID_PRO = false;

    g.API_KEY_PRO = false;

    g.listIconsFontAwesome = ["ad","address-book","address-card","adjust","air-freshener","align-center","align-justify","align-left","align-right","allergies","ambulance","american-sign-language-interpreting","anchor","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","angry","ankh","apple-alt","archive","archway","arrow-alt-circle-down","arrow-alt-circle-left","arrow-alt-circle-right","arrow-alt-circle-up","arrow-circle-down","arrow-circle-left","arrow-circle-right","arrow-circle-up","arrow-down","arrow-left","arrow-right","arrow-up","arrows-alt","arrows-alt-h","arrows-alt-v","assistive-listening-systems","asterisk","at","atlas","atom","audio-description","award","baby","baby-carriage","backspace","backward","bacon","bacteria","bacterium","bahai","balance-scale","balance-scale-left","balance-scale-right","ban","band-aid","barcode","bars","baseball-ball","basketball-ball","bath","battery-empty","battery-full","battery-half","battery-quarter","battery-three-quarters","bed","beer","bell","bell-slash","bezier-curve","bible","bicycle","biking","binoculars","biohazard","birthday-cake","blender","blender-phone","blind","blog","bold","bolt","bomb","bone","bong","book","book-dead","book-medical","book-open","book-reader","bookmark","border-all","border-none","border-style","bowling-ball","box","box-open","box-tissue","boxes","braille","brain","bread-slice","briefcase","briefcase-medical","broadcast-tower","broom","brush","bug","building","bullhorn","bullseye","burn","bus","bus-alt","business-time","calculator","calendar","calendar-alt","calendar-check","calendar-day","calendar-minus","calendar-plus","calendar-times","calendar-week","camera","camera-retro","campground","candy-cane","cannabis","capsules","car","car-alt","car-battery","car-crash","car-side","caravan","caret-down","caret-left","caret-right","caret-square-down","caret-square-left","caret-square-right","caret-square-up","caret-up","carrot","cart-arrow-down","cart-plus","cash-register","cat","certificate","chair","chalkboard","chalkboard-teacher","charging-station","chart-area","chart-bar","chart-line","chart-pie","check","check-circle","check-double","check-square","cheese","chess","chess-bishop","chess-board","chess-king","chess-knight","chess-pawn","chess-queen","chess-rook","chevron-circle-down","chevron-circle-left","chevron-circle-right","chevron-circle-up","chevron-down","chevron-left","chevron-right","chevron-up","child","church","circle","circle-notch","city","clinic-medical","clipboard","clipboard-check","clipboard-list","clock","clone","closed-captioning","cloud","cloud-download-alt","cloud-meatball","cloud-moon","cloud-moon-rain","cloud-rain","cloud-showers-heavy","cloud-sun","cloud-sun-rain","cloud-upload-alt","cocktail","code","code-branch","coffee","cog","cogs","coins","columns","comment","comment-alt","comment-dollar","comment-dots","comment-medical","comment-slash","comments","comments-dollar","compact-disc","compass","compress","compress-alt","compress-arrows-alt","concierge-bell","cookie","cookie-bite","copy","copyright","couch","credit-card","crop","crop-alt","cross","crosshairs","crow","crown","crutch","cube","cubes","cut","database","deaf","democrat","desktop","dharmachakra","diagnoses","dice","dice-d20","dice-d6","dice-five","dice-four","dice-one","dice-six","dice-three","dice-two","digital-tachograph","directions","disease","divide","dizzy","dna","dog","dollar-sign","dolly","dolly-flatbed","donate","door-closed","door-open","dot-circle","dove","download","drafting-compass","dragon","draw-polygon","drum","drum-steelpan","drumstick-bite","dumbbell","dumpster","dumpster-fire","dungeon","edit","egg","eject","ellipsis-h","ellipsis-v","envelope","envelope-open","envelope-open-text","envelope-square","equals","eraser","ethernet","euro-sign","exchange-alt","exclamation","exclamation-circle","exclamation-triangle","expand","expand-alt","expand-arrows-alt","external-link-alt","external-link-square-alt","eye","eye-dropper","eye-slash","fan","fast-backward","fast-forward","faucet","fax","feather","feather-alt","female","fighter-jet","file","file-alt","file-archive","file-audio","file-code","file-contract","file-csv","file-download","file-excel","file-export","file-image","file-import","file-invoice","file-invoice-dollar","file-medical","file-medical-alt","file-pdf","file-powerpoint","file-prescription","file-signature","file-upload","file-video","file-word","fill","fill-drip","film","filter","fingerprint","fire","fire-alt","fire-extinguisher","first-aid","fish","fist-raised","flag","flag-checkered","flag-usa","flask","flushed","folder","folder-minus","folder-open","folder-plus","font","football-ball","forward","frog","frown","frown-open","funnel-dollar","futbol","gamepad","gas-pump","gavel","gem","genderless","ghost","gift","gifts","glass-cheers","glass-martini","glass-martini-alt","glass-whiskey","glasses","globe","globe-africa","globe-americas","globe-asia","globe-europe","golf-ball","gopuram","graduation-cap","greater-than","greater-than-equal","grimace","grin","grin-alt","grin-beam","grin-beam-sweat","grin-hearts","grin-squint","grin-squint-tears","grin-stars","grin-tears","grin-tongue","grin-tongue-squint","grin-tongue-wink","grin-wink","grip-horizontal","grip-lines","grip-lines-vertical","grip-vertical","guitar","h-square","hamburger","hammer","hamsa","hand-holding","hand-holding-heart","hand-holding-medical","hand-holding-usd","hand-holding-water","hand-lizard","hand-middle-finger","hand-paper","hand-peace","hand-point-down","hand-point-left","hand-point-right","hand-point-up","hand-pointer","hand-rock","hand-scissors","hand-sparkles","hand-spock","hands","hands-helping","hands-wash","handshake","handshake-alt-slash","handshake-slash","hanukiah","hard-hat","hashtag","hat-cowboy","hat-cowboy-side","hat-wizard","hdd","head-side-cough","head-side-cough-slash","head-side-mask","head-side-virus","heading","headphones","headphones-alt","headset","heart","heart-broken","heartbeat","helicopter","highlighter","hiking","hippo","history","hockey-puck","holly-berry","home","horse","horse-head","hospital","hospital-alt","hospital-symbol","hospital-user","hot-tub","hotdog","hotel","hourglass","hourglass-end","hourglass-half","hourglass-start","house-damage","house-user","hryvnia","i-cursor","ice-cream","icicles","icons","id-badge","id-card","id-card-alt","igloo","image","images","inbox","indent","industry","infinity","info","info-circle","italic","jedi","joint","journal-whills","kaaba","key","keyboard","khanda","kiss","kiss-beam","kiss-wink-heart","kiwi-bird","landmark","language","laptop","laptop-code","laptop-house","laptop-medical","laugh","laugh-beam","laugh-squint","laugh-wink","layer-group","leaf","lemon","less-than","less-than-equal","level-down-alt","level-up-alt","life-ring","lightbulb","link","lira-sign","list","list-alt","list-ol","list-ul","location-arrow","lock","lock-open","long-arrow-alt-down","long-arrow-alt-left","long-arrow-alt-right","long-arrow-alt-up","low-vision","luggage-cart","lungs","lungs-virus","magic","magnet","mail-bulk","male","map","map-marked","map-marked-alt","map-marker","map-marker-alt","map-pin","map-signs","marker","mars","mars-double","mars-stroke","mars-stroke-h","mars-stroke-v","mask","medal","medkit","meh","meh-blank","meh-rolling-eyes","memory","menorah","mercury","meteor","microchip","microphone","microphone-alt","microphone-alt-slash","microphone-slash","microscope","minus","minus-circle","minus-square","mitten","mobile","mobile-alt","money-bill","money-bill-alt","money-bill-wave","money-bill-wave-alt","money-check","money-check-alt","monument","moon","mortar-pestle","mosque","motorcycle","mountain","mouse","mouse-pointer","mug-hot","music","network-wired","neuter","newspaper","not-equal","notes-medical","object-group","object-ungroup","oil-can","om","otter","outdent","pager","paint-brush","paint-roller","palette","pallet","paper-plane","paperclip","parachute-box","paragraph","parking","passport","pastafarianism","paste","pause","pause-circle","paw","peace","pen","pen-alt","pen-fancy","pen-nib","pen-square","pencil-alt","pencil-ruler","people-arrows","people-carry","pepper-hot","percent","percentage","person-booth","phone","phone-alt","phone-slash","phone-square","phone-square-alt","phone-volume","photo-video","piggy-bank","pills","pizza-slice","place-of-worship","plane","plane-arrival","plane-departure","plane-slash","play","play-circle","plug","plus","plus-circle","plus-square","podcast","poll","poll-h","poo","poo-storm","poop","portrait","pound-sign","power-off","pray","praying-hands","prescription","prescription-bottle","prescription-bottle-alt","print","procedures","project-diagram","pump-medical","pump-soap","puzzle-piece","qrcode","question","question-circle","quidditch","quote-left","quote-right","quran","radiation","radiation-alt","rainbow","random","receipt","record-vinyl","recycle","redo","redo-alt","registered","remove-format","reply","reply-all","republican","restroom","retweet","ribbon","ring","road","robot","rocket","route","rss","rss-square","ruble-sign","ruler","ruler-combined","ruler-horizontal","ruler-vertical","running","rupee-sign","sad-cry","sad-tear","satellite","satellite-dish","save","school","screwdriver","scroll","sd-card","search","search-dollar","search-location","search-minus","search-plus","seedling","server","shapes","share","share-alt","share-alt-square","share-square","shekel-sign","shield-alt","shield-virus","ship","shipping-fast","shoe-prints","shopping-bag","shopping-basket","shopping-cart","shower","shuttle-van","sign","sign-in-alt","sign-language","sign-out-alt","signal","signature","sim-card","sink","sitemap","skating","skiing","skiing-nordic","skull","skull-crossbones","slash","sleigh","sliders-h","smile","smile-beam","smile-wink","smog","smoking","smoking-ban","sms","snowboarding","snowflake","snowman","snowplow","soap","socks","solar-panel","sort","sort-alpha-down","sort-alpha-down-alt","sort-alpha-up","sort-alpha-up-alt","sort-amount-down","sort-amount-down-alt","sort-amount-up","sort-amount-up-alt","sort-down","sort-numeric-down","sort-numeric-down-alt","sort-numeric-up","sort-numeric-up-alt","sort-up","spa","space-shuttle","spell-check","spider","spinner","splotch","spray-can","square","square-full","square-root-alt","stamp","star","star-and-crescent","star-half","star-half-alt","star-of-david","star-of-life","step-backward","step-forward","stethoscope","sticky-note","stop","stop-circle","stopwatch","stopwatch-20","store","store-alt","store-alt-slash","store-slash","stream","street-view","strikethrough","stroopwafel","subscript","subway","suitcase","suitcase-rolling","sun","superscript","surprise","swatchbook","swimmer","swimming-pool","synagogue","sync","sync-alt","syringe","table","table-tennis","tablet","tablet-alt","tablets","tachometer-alt","tag","tags","tape","tasks","taxi","teeth","teeth-open","temperature-high","temperature-low","tenge","terminal","text-height","text-width","th","th-large","th-list","theater-masks","thermometer","thermometer-empty","thermometer-full","thermometer-half","thermometer-quarter","thermometer-three-quarters","thumbs-down","thumbs-up","thumbtack","ticket-alt","times","times-circle","tint","tint-slash","tired","toggle-off","toggle-on","toilet","toilet-paper","toilet-paper-slash","toolbox","tools","tooth","torah","torii-gate","tractor","trademark","traffic-light","trailer","train","tram","transgender","transgender-alt","trash","trash-alt","trash-restore","trash-restore-alt","tree","trophy","truck","truck-loading","truck-monster","truck-moving","truck-pickup","tshirt","tty","tv","umbrella","umbrella-beach","underline","undo","undo-alt","universal-access","university","unlink","unlock","unlock-alt","upload","user","user-alt","user-alt-slash","user-astronaut","user-check","user-circle","user-clock","user-cog","user-edit","user-friends","user-graduate","user-injured","user-lock","user-md","user-minus","user-ninja","user-nurse","user-plus","user-secret","user-shield","user-slash","user-tag","user-tie","user-times","users","users-cog","users-slash","utensil-spoon","utensils","vector-square","venus","venus-double","venus-mars","vest","vest-patches","vial","vials","video","video-slash","vihara","virus","virus-slash","viruses","voicemail","volleyball-ball","volume-down","volume-mute","volume-off","volume-up","vote-yea","vr-cardboard","walking","wallet","warehouse","water","wave-square","weight","weight-hanging","wheelchair","wifi","wind","window-close","window-maximize","window-minimize","window-restore","wine-bottle","wine-glass","wine-glass-alt","won-sign","wrench","x-ray","yen-sign","yin-yang"];

    g.invisibleCharacters = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;

    g.html_initContentPro = '<div class="sheetsUpdate seiProForm" id="sheetsCompleteEtapaForm" style="display:none"></div>';

    try {
        refreshSeiPageSelectors(g);
    } catch (e) {
        // Selectors refresh later from fnJqueryPro / callers when DOM is ready.
    }

    g.__SEI_PRO_FUNCTIONS_STATE_INSTALLED__ = true;
    return g;
}

export function refreshSeiPageSelectors(g = globalThis) {
    const $ = g.$ || g.jQuery;
    const adapter = g.SeiPro && g.SeiPro.sei && g.SeiPro.sei.adapter;
    if (typeof $ !== 'function' || !adapter) return g;

    const getIsNewSEI = typeof g.getIsNewSEI === 'function' ? g.getIsNewSEI : () => adapter.isNewSEI();
    const getSeiVersionPro = g.getSeiVersionPro;
    const compareVersionNumbers = g.compareVersionNumbers;
    const getParamsUrlPro = g.getParamsUrlPro;
    const localStorageRestorePro = g.localStorageRestorePro;
    const isNew = !!getIsNewSEI();
    const version = typeof getSeiVersionPro === 'function' ? getSeiVersionPro() : null;
    const gte410 = version && typeof compareVersionNumbers === 'function'
        ? compareVersionNumbers(version, '4.1.0') >= 0
        : false;
    const gte5 = version && typeof compareVersionNumbers === 'function'
        ? compareVersionNumbers(version, '5') >= 0
        : false;

    g.isNewSEI = isNew;
    g.isSEI_5 = isNew && gte5;

    const lnkInfraUnidade = $('#lnkInfraUnidade').attr('onclick');
    g.lnkInfraUnidade = lnkInfraUnidade;
    g.infra_unidade_atual = (lnkInfraUnidade && typeof getParamsUrlPro === 'function')
        ? getParamsUrlPro(lnkInfraUnidade.split("'")[1]).infra_unidade_atual
        : null;

    g.siglaUnidadeAtual = adapter.isNewSEI()
        ? $('#lnkInfraUnidade').text().trim()
        : $('#selInfraUnidades').find('option:selected').text().trim();
    g.frmEditor = adapter.isSEI5() ? $('.infra-editor__editor-completo') : $('#frmEditor');
    g.idUnidade = adapter.isNewSEI() ? g.infra_unidade_atual : $('#selInfraUnidades').val();
    g.divInformacao = adapter.isNewSEI() ? '#divArvoreInformacao' : '#divInformacao';
    g.mainMenu = adapter.isNewSEI() ? '#infraMenu' : '#main-menu';
    g.ancoraArvoreDownload = adapter.isNewSEI() ? 'a.ancoraVisualizacaoArvore' : 'a.ancoraArvoreDownload';
    g.infraBarraComandos = adapter.isNewSEI() ? '.barraBotoesSEI' : '.infraBarraComandos';
    g.idMenu = adapter.isNewSEI() ? '#divInfraSidebarMenu ' + g.mainMenu : '#divInfraAreaTelaE ' + g.mainMenu;
    g.infraBarraS = adapter.isNewSEI() ? '#divInfraBarraSistemaPadraoE' : '#divInfraBarraSistemaE';
    g.nameDocInterno = adapter.isNewSEI() ? 'documento_interno.svg' : 'sei_documento_interno.gif';
    g.nomeInstituicao = adapter.isNewSEI()
        ? $('#divInfraBarraSistema h6.infraCorBarraSuperior').eq(0).text().trim()
        : $('#divInfraBarraSuperior label').text().trim();
    g.divComandos = (adapter.isNewSEI() && gte410) ? '#divBotoesControleProcessos' : '#divComandos';
    g.ifrVisualizacao_ = (adapter.isNewSEI() && gte410) ? 'ifrConteudoVisualizacao' : 'ifrVisualizacao';
    g['$ifrVisualizacao'] = '#' + g.ifrVisualizacao_;
    g.ifrArvoreHtml_ = (adapter.isNewSEI() && gte410) ? 'ifrVisualizacao' : 'ifrArvoreHtml';
    g['$ifrArvoreHtml'] = '#' + g.ifrArvoreHtml_;

    const docTarget = g.ifrVisualizacao_;
    g.seiProArvore = (function () {
        const PROCESS_TARGET = 'ifrVisualizacao';
        const DOC_TARGET = docTarget;
        function asEl(x) {
            if (!x) return null;
            if (x.jquery) return x.get(0) || null;
            if (x.nodeType === 1) return x;
            return null;
        }
        function anchorOf(x) {
            const el = asEl(x);
            if (!el) return null;
            if (el.matches && el.matches('a.infraArvoreNo')) return el;
            if (el.closest) {
                const w = el.closest('div.infraArvore');
                if (w) return w.querySelector('a.infraArvoreNo');
            }
            if (el.id && /^anchorImg(\d+)$/.test(el.id)) {
                const sib = el.parentNode && el.parentNode.querySelector('#anchor' + RegExp.$1);
                if (sib) return sib;
            }
            return null;
        }
        return {
            SEL_PROCESS: 'a.infraArvoreNo[target="' + PROCESS_TARGET + '"]',
            SEL_DOCUMENT: 'a.infraArvoreNo[target="' + DOC_TARGET + '"]',
            SEL_FOLDER_IMG: 'a[id^="anchorImgPASTA"]',
            isProcessNode(x) {
                const a = anchorOf(x);
                return !!(a && a.getAttribute('target') === PROCESS_TARGET);
            },
            isDocumentNode(x) {
                const a = anchorOf(x);
                return !!(a && a.getAttribute('target') === DOC_TARGET);
            },
            getNodeIdProc(x) {
                const a = anchorOf(x);
                if (!a) return null;
                const m = /^anchor(\d+)$/.exec(a.id || '');
                return m ? m[1] : null;
            },
            getNodeWrapper(x) {
                const el = asEl(x);
                return (el && el.closest) ? el.closest('div.infraArvore') : null;
            }
        };
    })();

    try {
        g._parentSPRO = (typeof parent !== 'undefined' && typeof parent._P === 'function') ? parent._P() : null;
    } catch (e) {
        g._parentSPRO = null;
    }
    const parentSpro = g._parentSPRO;
    g.URL_SPRO = (parentSpro && parentSpro.URL_SPRO != null) ? parentSpro.URL_SPRO : undefined;
    g.NAMESPACE_SPRO = parentSpro ? parentSpro.NAMESPACE_SPRO : undefined;
    g.URLPAGES_SPRO = parentSpro ? parentSpro.URLPAGES_SPRO : undefined;
    g.VERSION_SPRO = parentSpro ? parentSpro.VERSION_SPRO : undefined;
    g.ICON_SPRO = parentSpro ? parentSpro.ICON_SPRO : undefined;
    if (g.URL_SPRO) g.iconSeiPro = g.URL_SPRO + 'icons/menu/seipro.png';

    try {
        g.urlTxtPadrao = $(g.mainMenu + ' a[href*="acao=texto_padrao_interno_listar"]').attr('href');
    } catch (e) { /* ignore */ }

    try {
        let userSEI = $('#hdnInfraPrefixoCookie').val();
        userSEI = (typeof userSEI !== 'undefined' && userSEI != '' && userSEI.indexOf('_') !== -1) ? userSEI.split('_') : false;
        userSEI = userSEI ? userSEI[userSEI.length - 1] : false;
        g.userSEI = userSEI ? userSEI.toLowerCase() : false;
    } catch (e) {
        g.userSEI = false;
    }

    try {
        g.sortListSaved = (typeof localStorageRestorePro === 'function'
            && localStorageRestorePro('tablesorter-savesort') != null)
            ? localStorageRestorePro('tablesorter-savesort')[window.location.pathname]
            : false;
    } catch (e) {
        g.sortListSaved = false;
    }

    try {
        if ($('#sheetsCompleteEtapaForm').length == 0) {
            const host = adapter.isNewSEI() ? '#divInfraBarraSistemaPadrao' : '#divInfraBarraSistema';
            $(host).append(g.html_initContentPro);
        }
    } catch (e) { /* ignore */ }

    return g;
}

export function getSeiFunctionsState() {
    return installSeiFunctionsState();
}
