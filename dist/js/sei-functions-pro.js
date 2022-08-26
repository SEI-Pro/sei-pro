var dadosProcessoPro = {};
var dadosProjetosObj = [];
var dadosEtapasObj = [];
var dadosProjetosUniq = [];
var feriadosNacionaisProArray = [];
var configGeralObj = [];
var ganttProject = [];
var ganttProjectSelect = [];
var url_host = window.location.href.split('?')[0];
var statusPesquisaDadosProcedimentos = true;
var dialogBoxPro = false;
var configBoxPro = false;
var alertBoxPro = false;
var iframeBoxPro = false;
var editorBoxPro = false;
var iHistory = 0;
var iHistoryCurrent = 0;
var iHistoryArray = [];
var linksArvore = [];
var configClassicEditor = [];
var arrayListTypesSEI = {};
var andamentoPaginacaoTemp = [];
var filesystem = null;
var FileError = null;
var fileSystemPro = false;
var fileSystemContentPro = false;
var delayCrash = false;
var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
var isNewSEI = $('#divInfraSidebarMenu ul#infraMenu').length ? true : false;
var divInformacao = isNewSEI ? '#divArvoreInformacao' : '#divInformacao';
var mainMenu = isNewSEI ? '#infraMenu' : '#main-menu';
var idMenu = isNewSEI ? '#divInfraSidebarMenu '+mainMenu : '#divInfraAreaTelaE '+mainMenu;
var iconsFlashMenu = [
                    {name: 'Copiar n\u00FAmero do processo', icon: 'fas fa-copyright', alt: ''},
                    {name: 'Copiar somente o n\u00FAmero', icon: 'fab fa-cuttlefish', alt: ''},
                    {name: 'Copiar link do processo', icon: 'fas fa-link', alt: ''},
                    {name: 'Enviar Documento Externo', icon: 'fa-upload', alt: ''},
                    {name: 'A\u00E7\u00F5es em lote', icon: 'fa-cogs', alt: ''},
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
var iconsFlashDocMenu = [
                    {name: 'Copiar n\u00FAmero SEI', icon: 'fas fa-copyright', alt: '', show: true},
                    {name: 'Copiar nome do documento', icon: 'fas fa-file-alt', alt: '', show: true},
                    {name: 'Copiar link do documento', icon: 'fas fa-link', alt: '', show: true},
                    {name: 'Duplicar documento', icon: 'fa-copy', alt: '', show: true},
                    {name: 'Copiar para...', icon: 'fa-share', alt: '', show: true},
                    {name: 'Imprimir Web', icon: 'fa-print', alt: '', show: false},
                    {name: 'Visualizar em nova aba', icon: 'fa-window-restore', alt: '', show: false},
                    {name: 'Consultar documento', icon: 'fa-users', alt: '', show: false},
                    {name: 'Incluir em bloco', icon: 'fa-book', alt: '', show: false},
                    {name: 'Cancelar documento', icon: 'fa-ban', alt: '', show: false},
                    {name: 'Vers\u00F5es do documento', icon: 'fa-code-branch', alt: '', show: false},
                    {name: 'Gerar circular', icon: 'fa-circle-notch', alt: '', show: false},
                    {name: 'Assinatura externa', icon: 'fa-file-signature', alt: '', show: false},
                    {name: 'Excluir documento', icon: 'fa-trash-alt', alt: '', show: false},
                    {name: 'Editar documento', icon: 'fa-edit', alt: '', show: false},
                    {name: 'Assinar documento', icon: 'fa-pen-alt', alt: '', show: false},
                    {name: 'Adicionar aos favoritos', icon: 'fa-star', alt: '', show: false},
                    {name: 'Ci\u00EAncia', icon: 'fa-thumbs-up', alt: '', show: false},
                    {name: 'Enviar por e-mail', icon: 'fa-at', alt: '', show: false},
                    {name: 'Mover p/ outro processo', icon: 'fa-people-carry', alt: '', show: false},
                    {name: 'Intima\u00E7\u00E3o eletr\u00F4nica', icon: 'fa-bullhorn', alt: '', show: false},
                    {name: 'Copiar n\u00FAmero com link', icon: 'fab fa-creative-commons-sa', alt: '', show: true},
                    {name: 'Copiar nome com link', icon: 'fa-external-link-alt', alt: '', show: true}
                ];
var iconsFlashDocArvore = [
                    {name: 'Copiar n\u00FAmero SEI', icon: 'far fa-copyright', alt: '', mode: 'copy'},
                    {name: 'Copiar nome do documento', icon: 'far fa-file-alt', alt: '', mode: 'name'},
                    {name: 'Copiar link do documento', icon: 'fas fa-link', alt: '', mode: 'link'},
                    {name: 'Duplicar documento', icon: 'far fa-copy', alt: '', mode: 'clone'},
                    {name: 'Copiar para...', icon: 'fas fa-share', alt: 'Copiar documento para outro processo', mode: 'copyto'},
                    {name: 'Copiar n\u00FAmero com link', icon: 'fab fa-creative-commons-sa', alt: '', mode: 'numberlink'},
                    {name: 'Copiar nome com link', icon: 'fas fa-external-link-alt', alt: '', mode: 'namelink'}
                ];
var iconsFlashPanelArvore = [
                    {name: 'Anota\u00E7\u00F5es', icon: 'fas fa-sticky-note', alt: 'Anota\u00E7\u00F5es'},
                    {name: 'Atribui\u00E7\u00E3o', icon: 'fas fa-user-tie', alt: 'Atribui\u00E7\u00E3o'},
                    {name: 'Tipo de Procedimento', icon: 'fas fa-inbox', alt: 'Tipo de Procedimento'},
                    {name: 'Marcador', icon: 'fas fa-tags', alt: 'Marcador'},
                    {name: 'N\u00EDvel de Acesso', icon: 'fas fa-lock', alt: 'N\u00EDvel de Acesso'},
                    {name: 'Interessados', icon: 'fas fa-users', alt: 'Interessados'},
                    {name: 'Assuntos', icon: 'fas fa-bookmark', alt: 'Assuntos'},
                    {name: 'Observa\u00E7\u00F5es', icon: 'fas fa-comment-alt', alt: 'Observa\u00E7\u00F5es'}
                ];
var rangeProjetosPro = "Projetos";
var rangeEtapasPro = "Etapas";
var rangeFeriadosNacionaisPro = "FeriadosNacionais";
var rangeConfigGeral = "ConfigGeral";

var userSEI = $('#hdnInfraPrefixoCookie').val();
    userSEI = (typeof userSEI !== 'undefined' && userSEI != '' && userSEI.indexOf('_') !== -1) ? userSEI.split('_') : false;
    userSEI = (userSEI) ? userSEI[userSEI.length-1] : false;
    userSEI = (userSEI) ? userSEI.toLowerCase() : false;


var sortListSaved = (typeof localStorageRestorePro('tablesorter-savesort') !== 'undefined' && localStorageRestorePro('tablesorter-savesort') !== null) ? localStorageRestorePro('tablesorter-savesort')[window.location.pathname] : false;

var iconSeiPro = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAFXWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjU2IgogICB0aWZmOkltYWdlV2lkdGg9IjI1NiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIuMCIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIuMCIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjI1NiIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjI1NiIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA4LTAyVDIyOjQ3OjQ4LTAzOjAwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA4LTAyVDIyOjQ3OjQ4LTAzOjAwIj4KICAgPGRjOnRpdGxlPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5zZWktcHJvLWljb248L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzp0aXRsZT4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0icHJvZHVjZWQiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFmZmluaXR5IFBob3RvIChNYXIgMzEgMjAyMCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjAtMDgtMDJUMjI6NDc6NDgtMDM6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0iciI/PlbsjgwAAAGBaUNDUHNSR0IgSUVDNjE5NjYtMi4xAAAokXWR3yuDURjHP9vIYpriwoWLJdwY+VHiRtkSamnNlOFme+2H2ubtfbe03Cq3K0rc+HXBX8Ctcq0UkZIrF66JG9brOaYm2Tmd83zO9zzP03OeA/ZwWsuYNX2QyeaM0ITPMxeZ99Q94cQBdNMf1Ux9LBgMUHW832JT9rpH5aru9+9oWIqbGticwqOabuSEJ4UDqzld8ZZwi5aKLgmfCHsNKVD4RumxMj8rTpb5U7ERDvnB3iTsSf7i2C/WUkZGWF5ORyad137qUS9xxbOzM2LbZbVhEmICHx6mGMfPEP2MyD5EDwP0yokq8X3f8dOsSKwmu04Bg2WSpMjhFTUv2eNiE6LHZaYpqP7/7auZGBwoZ3f5oPbRsl47oW4TSkXL+jiwrNIhOB7gPFuJX9mH4TfRixWtYw/c63B6UdFi23C2Aa33etSIfkvq7+2JBLwcQ2MEmq+gfqHcs597ju4gvCZfdQk7u9Al/u7FL1WPZ94WCeG6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAbPklEQVR4nO3deXgV9b3H8fc5J/tGSAImIcg6qBRRwZ3Fihar+IittSqt21OrHa2917aWqu1z+9xWe9Vu97Z1unmtS7VWW4U+UulVcUUpCip1CVORNQQwO9lzzrl/TCIhJOQsM/ObmfN9Pc95lHAy8zkhv+/5zZzfEkL4m2GGgSOBo4BKoDjJR5b7oUf2y6O/qDqCI254/yHVEYblqX98cRiGOQarkQ99aECewmTCx6QAeI1hZgFzgdOBoznQ0CtVxhLBJAVANasLPxtY1P9YiNU1F8JxUgDcZpghrHf0gQZ/JlCmNJPIWFIA3GCYlcASDjR66c4LT5AC4BTDLACWApcD5wBhtYGEOJQUADtZ1/MLgCuAi5FreeFxUgDsYJhHYb3TfxGYpDiNEAmTApAqwywHLsF6tz9FcRohUiIFIFmGOQ1YDlwJ5ChOI0RapAAkyjBnArcClyE39ERASAEYjWHOAW4DPqs6ihB2kwIwEsOch9Xwz1UdRQinSAEYzBqldxZWw/+k2jBCOE8KwADDXAjchdzRFxlECoBhHoHV8K9QHUUIt2VuATDMCHAdcAcwRnEaIZTIzAJgmCcD92DNuxciY2VWATDMMuB2rHf+kOI0QiiXGQXAmqRzJda1foXiNEJ4RvALgGEeCxjAPNVRhPCa4BYA6zP9G4AfI2P2hRhWMAuAtYLuvcBFqqMI4WXBKwCGORf4EzBVdRQhvC44BUC6/EIkLRgFwDBLsbr8MmNPiCT4vwAY5olYXf4pqqMI4Tf+LQBWl/9G4EdAtuI0QviSPwuAYeYC92GtziOESJH/CoBhFgNPYM3bF0KkwV8FwDDHA38D5qiOIkQQ+KcAGOYU4O/AdNVRhAgKf6xua5jHAWuRxi+ErbxfAAzzDOBFZENNIWzn7QJgmJ8FVgMlqqMIEUTeLQCGeS3wGJCrOooQQeXNAmCYy4Ff49V8QgSE9xqYYV4H/JfqGEJkAm8VAOua/x7VMYTIFN4pANbd/ofxUiYhAs4bjc36nH8lcsNPCFepLwCGORV4GvmoTwjXqS0A1tj+1cggHyGUUFcArFl9q5DhvUIoo6YAWPP5n0C25hJCKfcLgLWSz++R+fxCKKeiB3AjcKmC8wohhnC3ABjmSVhr+AkhPMC9AmAt3f0osoCnEJ7hzopA1nX/vXh46e7ai2ogBCFC1r7hoQP7h4cO+n/r/w75u/4vhOg/xqDNx0P9zxt6LPqfN3if8oE/h/oPOvg8Q4818IzBxz4026CzDXlNHz938Ose8tqjsTidvXE6+2J09lqPjt4YLV0xdrb28kFzD7XNvaxv7OFfPTGEv7i1JNgNeHzTjhnj8lRH8KRIOERRboii3NE7i82dUbY397Bhdycv7OzgyfpummNxF1KKVDlfAKyNO37s+HmEcqX5EUrz85ldlc9Vc8q4pzfGO3u6WF/XwYoP21nd1Ks6ohjC2QJg7dL7KLJXX0bKzw5zYk0BJ9YUoJ9cwXt7u1hZ28pvzP1skcsFT3CuAFjX/b9DdukV/Y4Zn8cx4/P499PG8fLW/Tz4bgv313WpjpXRnPwU4Hrgcw4eX/hUblaIs6YX8/sLath4wQQur5L7L6o4UwAM81jgJ44cWwTK8dX5PLC0hvXnV3PJETIb3G32FwDDDAMGct0vknBiTQGPfGYin575UwqyZXKoW5zoAVwBzHPguCLgQsDU8adx6ckPctR4uXp0g70FwDDLgLttPabIOHnZxZw185ucN+sXFORUq44TaHb3AG4HKmw+pshQkytO5LKTHmDi2DNVRwks+wqANdHnOtuOJwSQm13Ektk/YPaEq1VHCSR7CoBhRrBu/IVGe6oQyQqHIszXruOTM/6TUMg/G1r7gV09gOuQ1X2Ew2ZWL+aC2b8iK1yoOkpgpF8ADPMI4I70owgxugljZ3H+7P8hEs5XHSUQ7OgB3AWMseE4QiSkuvQTLJn130TCMoIwXekVAMNciPW5vxCuqimbzbmf+AnhkIw3S0fqBcCa7COf+Qtljiyfw9lHy9VnOtLpAZwFnGxXECFSMf2I+Rxf82XVMXwrnQJwm20phEjDqdOuYsKYBapj+FJqBcAw5wGftDWJECkKhyIs/sR3KMypUR3Fd1LtAci7v/CU/JwxLJ75fdUxfCf5AmCYc4Bz7Y8iRHqqSo/h2OorVcfwlVR6APLuLzzrlKlXyqVAEpIrAIY5E48v7y0yW05WAWfMWK46hm8k2wO4xZEUQthocsVJTK1YojqGLyReAAxzGrDMuShC2GfukfKrmohkegDLk3y+EMqMK5nGhNKFqmN4XmKTqw2zHJDbqzZp6uzj+Ie3qY6RkEl5ESYVZTGhMIsjCiKML8yioiDCzHF5TCz19jj8EyZeyq7mF1XH8LREV1e4BFnl1zbxOGzv9ceeedt7+3iprW/YvzuvLIeLphVxxuRCppV7b0nvieUnUFYwk8aOd1VH8axEu/Qy408cYlVjD19a38j0x3aw6JFtPLCxke4+7xS2ECFOOPJy1TE8bfQCYJhHAac4H0X42ZqWXq5c18inHt3GK9v2q47zsenj58vKwoeRSA/gi46nEIHxUlsf8/9Wzw2r6tjZ0qM6DpFwNsfXSC9gJIcvANYuP/LTE0m7Z3sHxz+6g2c/aFMdhWOqF5MdKVEdw5NG6wEsACa5EUQET0MszpL/28PK91qU5sjNKmRW1aVKM3jVaAVAbv6JtHQDS1/Yx8NvNSnNMXXcfKXn96qRC4BhFgAXuxdFBNkXXm3g3jcalJ1/XMlUWU58GIfrAVwAFLsVRATfNeubWLejXcm5w6EsJpTKnrVDHa4ASPdf2E5fs5eWrqiSc9eMlb1rhhq+ABhmJXCOu1FEJtjYEeU/X9yr5NzVpbOUnNfLRuoBLDnM3wmRlp9saWdVbavr560omkJOVqnr5/WykRq57McsHPUf/2igN+rusOFQKEyN3Ac4yKEFwNrwY5H7UUQmeb09ynNb3B8kVFMq9wEGG64HcBRQ5XYQkXnuebMZt6cOyX2Agw1XAOTdX7hiZUMPG3Z1uHrOsUUTycuucPWcXiYFQCj10D/dHSYcIsSYvKmuntPLDi4A1uQfuQEoXPP4jg76Yu5eCBTklLt6Pi8b2gOYDZSpCCIy086+OJv3dbt6zvzssa6ez8uGFgDp/gvXbdjd6er58nOkAAwYWgCk+y9c97LLNwLzs2Uw0IADBcAws4Az1EURmWpFXRdxF28D5OeMce9kHje4BzAXmf0nFKiPxtnf494EobxsWR1owOACcLqyFCLjNbs4Q1AKwAGDC8DRylKIjNfqagGQju6AwQXgKGUpRMZzsweQLz2Aj0kBEJ7Q0hVz7VyhkMx0H2D9JAxzDFCpNorIZAXZ7jXKrl71S5V7xcBPXd79hVJj8qQAqCAFQHjCmLyIa+fq6nV/NSKvkgIgPKEkVwqAClIAhCeUSA9ACSkAQrnzy3PIiYRcO19nr9qtyrwk3L8GgKY6iMhciybku3q+zp5mV8/nZWHgSCBPdRCRuU6sdrkA9Krdp9BLwkj3Xyg2u9LtHkCjq+fzsjAyAEgodH55jqsfAQK0du9w9XxeFkamAAuFrp7p7rj8tq59tHVtdfWcXiYFQCgzPSfMuTPcLQC7m9919XxeJwVAKHPTrBLyXZwDALCr+U1Xz+d1UgCEEiUh+NxM99fm29H0iuvn9DIpAEKJ5ceUML4oy9VztnTWs797u6vn9DopAMJ1C4qz+LdT3d+ea3fzO66f0+ukAAhX5QK/OOsICnPcX5RDrv8PJQVAuOqnc0pdH/hjicv1/zCkAAjXXFaZxzVz1ezL19xRR0dPnZJze5kUAOGKqyfk87sl1WS7OOtvsG0Nrys5r9dJARCOu3FyAca51a6u+zdYLN7HWzv/oOTcXhcGilSHEMF1i1bETxZXkZul5p0f4IO9r8rHfyNw94NYkTFm5Ib54cllXDizlLC6tg/Axh0PqQ3gYVnAfkD2Sxa2yAW+O7OEG04qpzTf3Vl+w9nVtImP9r+lOoZnZQFtSAEQNrisMo/vnl7BMeO9s77Mxh2Pqo7gaQMFQIiUXHpELhdMK2LhpCImjMlWHecgDfu3sb3xGdUxPE0KgEjI5OwwRxVFmFiYRXVhFseNz2X+pCLXx/Mn4+2dT6iO4HlSABQoyYvw3kU1qmMkpCQ3wtj8iOvTdtPV3t1I7Z4/q47heVIAFMgKhzh6nHeuk4Po7Z0riMV7VcfwvDBSAETANO7fzls7/1d1DF+QAiACJR6Psab2R/Lun5ifSwEQgfLPXX9jT9s/VMfwizYpACIw2rr28dqHP1Udw0+kAIhgiMb6eObdO+iN7lcdxU+kAIhgWPuv37K79VXVMfymLQzUq04hRDpq659nU939qmP4UX0YqFWdQohU7WvbwvObv6c6hl/VhoHtQJfqJEIkq7mjjqc2fYNoTH59U9AJ7AijazHAVJ1GiGS0du5hxZtfo6Nnt+oofmWia7GBAd5yGSB8o61rHyve/BrtPTtVR/GzWjiwIpAUAOELe/b3cunKDp5vvV11FL+TAiD85Z09nSx7up63O6OqowSBFADhH09vbuWLz++jIRZXHSUopAAI74vF4Z51H3Hjm82qowRNLVizAUHXWpABQcJjdrb0cNXKndL47bcbXWuFg5cFrwUq1eQR4oBoPM5jm5q5aV0j9VHp8jvg4x7/0AJwhvtZhDhgW1MP335+D3/c0606SpANWwDeVxBECMD6eO/eDU3c+V4rrfKm77RhC8BaBUFEhvuovY/73mzijndaaZY7/G75eJ/0wQXgDaypwbJZqHDcBw3dPPl+K3e928peuc53UyuwYeAPBwqArvVhmC8A5ysIJTJAa1eUZz5o46H323hin1zjK/ICutY38IehuzqsQQqAsNHe/b1s3N3Jmm0d/G5LuwzkUW/N4D8MLQDPuRhEBFBTZx9v7e7iH3UdrN7RyXMt6lfnDYegPC9CdUEW1YUD/7V+9eva+6jr6KOuPUpdRx8NXVECXqMOauNDC8DbQCNQ5loc4Rt9sThdvXE6+2Ls746ys6WX7S29bGnpobapl9ebeqjtjqmOCcDk4myWTi5k6eRC5lflkZ3gHuU9sTiv7O5ixdZ2VmxtZ2ub+gJmowZg0+AvHPpTMczHgYtcCuQZ8a9Md+1cLV1RvrByl2vnS1Uc2N8Xo6EnRn1P3PPd9xljslmmFXPhlEKOK8+15ZhvNXTz5Ift/MFsw/RAbyZNj6NrFw/+wnA7Oz5HBhYAN0VjcZ5q7FEdIzCqCrL43ollfOmYEiKJvdEn7LjyXI4rz+U7c8u4971Wvvd6I7s7+kb/Rm865BJ/uB0f5T6A8IWSnDA/OLmcfy2bxLUz7W/8g0VCcO3MEv61bBLfP6mMkhx/bZbaL6ECUAvIOkvC0y6dXsQHyyZx25yxFGQ52PKHKMgK8Z25ZXywbBKXTCty7bw2qAM2D/3ioQVA1+JIL0B4VDgEd5xSziNnV1KRF1GWoyIvwh8/VcntJ5eT4P1F1Z7rb9sHGakfs2aErwuhTHF2mL+cU8UtJ4xVHeVjt84Zy1/OqaI42/OXBMO26ZFSPwV44/McIYApxdms/UwNSycXqo5yiKWTC3nlMzVMKc5WHWUkUWDVcH8xfAHQtXpgtYOBhEjYuPwIay6YwKyyHNVRRnRsWQ7PXVDNuHx1lyWHsbq/TR/icP2WBxwKI0TCcsIh/ry4kknFw31i7S2Ti7N5fHElOd67KTBiWz5cAViBbBwqFAoBv1gwjgVV+aqjJGxhVT4/nz9umBF2yrQCK0f6y5ELgK51Ao85EEiIhHx11hi+fEyJ6hhJu3ZmCTfMGqM6xoDH+tvysEa7dSmXAUKJ4yty+em8capjpOxn88bZNhw5TYdtw6MVgJeAbfZlESIxd55S7ujIPqdFQnDnqeWqY2wFXj7cEw5fAKyNQx+0L48Qozu7poDFEwtUx0jbORMLOGuC0vsXD/a34RElMnpBCoBwTTgEd6l/57TNXadVqBwpOGrbHb0A6NpmYJ0daYQYzaXTizmhwhPXzraYU5HLJdOULLP5GrpmjvakRMcvys1A4Yrlx3tnmK9dvq1m6HJCbTbRAvAoIBPYhaOmlmQzu9y7o/1SNbs8x+1hwj3AnxJ5YmIFQNcagPvTCCTEqLw4zt8uS6e4+tp+399mR5XMFKY7kQlCwkEXuttIXHWhe8UtitVWE5J4AdC1D4CHUwgkxKgq8iLMr/TPkN9kLajKd2v9gofRtS2JPjnZScw/TPL5QiTk00cW+GVhjZSEQ9ZrdFicJNtocgVA194F/pLU9wiRgOklnp1Lb5tpzr/Gv6Br7yXzDaksY3J7Ct8jxGENbNQRZNUFjr/GpNtm8gVA1zYAf0v6+4Q4jOoCTy6kYavqQkdf4yp0bWOy35TqQmbSCxC2yogegLOvMaU2mVoB0LVXgOdT+l4hhpERBcC5S4A16NraVL4xnaVMpRcgbFOW6/lVddNWnufYa0y5LaaT6FlkkpCwyUddUdURHLev05HXuI409vFIvQBYmwx8K+XvF2KQuvbgF4C6Dkde483DbfiRqPT6JLr2IjJTUNigzr8bbiasrt3213g/uvZSOgew46LkW0CLDccRGcyBxuE5Nhe5ZmzogadfAHRtD3Br2scRGS0jLgHsfY23omt70z2IXbclfw28YdOxRAba3BL85SY2N9v2Gl8HfmPHgewpALoWBXSsyQhCJO3pHR30xYL769MXi7N6Z4cdh4oDen+bS5t9H0zq2nqsnoAQSWvujvF83Yj7V/jemrpOmrttWU7jV+ja63YcCOwsAJbbgI9sPqbIEE9ubVcdwTFPfmjLa9uH1cZsY28B0LVG4GZbjykyxsoAFwCbXtvN6FqTHQca4MTYxAeAVxw4rgi4Hfv7WL+3W3UM263f283O9D/mfBkHxtzYXwCsnUh0ZBVhkYI7NjaqjmC72zek/Zp6gOvTGfE3EmdmJ+jaJuDrjhxbBNqKD9tZW9+lOoZtXqnvsqP7f1N/m7Kdk1Ow7gEed/D4IoDiwM2vBec+8rde+yjdz8YfAwxbwgzDuQJgdVeuARJeoVQIgLX1XXbdNVfqifR7M1uALzvR9R/g7CRsXWsBPo/cDxBJumVdA91R/w4M6o7GuWVdQntzjKQH+Hx/G3KM86sw6NobwDccP48IlPebe/jyC2kPdVfmmhf2Upve0N+v97cdR7m1DMsvkeXERZIe3NzG3W/a+rG3K+56s4mHNrelc4jHse6hOc69rRgMsxTYAExx7ZzC9yIhWPHpKpZM8se2YU9ta2fp07tJ4+plCzDH6a7/APcWYtO1Zqz7Ab2unVP4XjQOy57dw3tN3r+N9G5TD8ue3ZNO4+8FLnGr8YObBQDon8TwTVfPKXyvtSfGmSt3eXp8wNr6Lhat3EVrT1oTfr5h50SfRKhYivXnwCMKzit8bE9nlEV/3cV977eqjnKI+95vZdFfd7EnvUU/HwF+YVOkhKnZjtEwc4GngLOUnF/4Vgi4aXYpd59WoXwz0VgcvvnqR/zs7eZ0B/s8A5yPrrk+EULdj9Awi4E1wFxlGYRvnTOxgF8tHMfkYjWbim5t6+UrL+5j9Y60F/l4HViErqX1sUGq1NZQwxyPNXNwutIcwpdyIyH0T4zhO3PGUp7nzt6CDV1RfrChCeOdFjsGKpnAfDvW9kuV+h3ZDXMKsBaoVB1F+NOYnDDLTxjLTbNLyYs48yvd2RfnZ5uauXNjEy3p3egbUA+cjq59aMfBUqW+AAAY5nHAi0CJ6ijCv6oKsvjc1EIunFLEGdX5pFsLonF4oa6TJz/cz+Nb2tlt37LercACdO1tuw6YKm8UAADDPANYDeSqjiL8ryw3wnmTClg6uZAFVfmMz4+M+sseB/Z2RnlpdycrtrazalsHjd22L1feDSzu31RHOe8UAADD/CzW9Mfg7xQpXJUdDnFEfoTqwiyqCyMf79Rb19FHXXuUuvY+9nRG6XV2ZeIYcBG69qSTJ0mGtwoAgGFei6wuLILpWnTtt6pDDOa9d1pd+w3wbdUxhLDZcq81fvBiD2CA1RMw8GKREiJxMeArXmz84OUCAAP3BB5GbgwKf+oGLkPXnlAdZCTeLgAw8OnASuQjQuEvLcAFXrnbPxLvFwAYGCfwNDJYSPhDPXCOFz7nH40/CgAMjBj8OzJsWHibidX4lY7wS5R/brBZP9B5yDbkwrvewBrb74vGD34qAED/pIkzgWdVRxFiiGeAM1VO7EmFvwoA0D9tcgmyqIjwjkeAJaqm9KbDfwUA6F844QvA15A1BoU6PcCNwBfQNe8vWjgM/9wEHIlhngj8CVltWLhrC9bGHb6+J+XPHsBg1iKKc4A/q44iMsbjWEt3+7rxQxAKAAwsOX4x8FVkGzLhnB6s3zHHt+xyi/8vAYYyzLlYlwRTVUcRgbIFuBhd26A6iJ2C0QMYzOqWzUG2Jhf2eQyryx+oxg9BLAAweFdiuSQQ6egBbsDl3XrcFLxLgKEM81isacXzVEcRvvIycD26tkl1ECcFswcwmPUPuBC4GtinOI3wvn3AVcDCoDd+yIQewGCGORa4HfgKmfbaxWjiwK+A29A1/+1JnqLMbASGeRLWZYHsSiTA2p3nenRtveogbgv+JcBwrH/oU4DrgWbFaYQ6zVi/A6dmYuOHTO0BDGZtT3YXcKXqKMJV9wPf8tvsPbtJARhgmAuAu7F6BiK41gE3o2svqQ7iBZl5CTAc6xfiNOBsrF2LRbCswfq3PU0a/wHSAxiJYZ4O3AacpzqKSMsq4HZ0ba3qIF4kBWA0hjkHuBX4LPLz8os41uzQO9C1jarDeJn8QifKMGcCtwCXAe5sRi+SFcXaR+KH6Np7qsP4gRSAZBnmVGA51mixHLVhRL8e4PfAnejaFsVZfEUKQKoMsxxrwtEVwKmK02Sq14AHgD+haw2qw/iRFAA7GOYM4PL+xyTFaYJuK/Ag8BC6tllxFt+TAmAnwwwD87F6BZ8HitUGCoxWrDn5DwAvo2sxxXkCQwqAUwwzH1iK1Ss4B7lxmKwosBqr0a9E1zoV5wkkKQBuMMxKrPEEi/ofVWoDedZurE1f1gCr0LV6xXkCTwqA2wwzBMzgQDE4EyhXmkmdBqzG/lz/YzO6FlcbKbNIAVDNum9wLAcKwhkE995BK/ACBxr9JrmeV0sKgNcYZhbWoqbzgKMGPfx22bAbqB30eAXYgK71KU0lDiIFwC8Ms4SDC8LAYwaQpyhVF7CZgxu69dC1VkWZRBKkAPiddQkxEasYVGJdPiTzAGhL8lGP1dB3SBfe3/4fpSnJ5EyqiyYAAAAASUVORK5CYII=';
var listIconsFontAwesome = ["ad","address-book","address-card","adjust","air-freshener","align-center","align-justify","align-left","align-right","allergies","ambulance","american-sign-language-interpreting","anchor","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","angry","ankh","apple-alt","archive","archway","arrow-alt-circle-down","arrow-alt-circle-left","arrow-alt-circle-right","arrow-alt-circle-up","arrow-circle-down","arrow-circle-left","arrow-circle-right","arrow-circle-up","arrow-down","arrow-left","arrow-right","arrow-up","arrows-alt","arrows-alt-h","arrows-alt-v","assistive-listening-systems","asterisk","at","atlas","atom","audio-description","award","baby","baby-carriage","backspace","backward","bacon","bacteria","bacterium","bahai","balance-scale","balance-scale-left","balance-scale-right","ban","band-aid","barcode","bars","baseball-ball","basketball-ball","bath","battery-empty","battery-full","battery-half","battery-quarter","battery-three-quarters","bed","beer","bell","bell-slash","bezier-curve","bible","bicycle","biking","binoculars","biohazard","birthday-cake","blender","blender-phone","blind","blog","bold","bolt","bomb","bone","bong","book","book-dead","book-medical","book-open","book-reader","bookmark","border-all","border-none","border-style","bowling-ball","box","box-open","box-tissue","boxes","braille","brain","bread-slice","briefcase","briefcase-medical","broadcast-tower","broom","brush","bug","building","bullhorn","bullseye","burn","bus","bus-alt","business-time","calculator","calendar","calendar-alt","calendar-check","calendar-day","calendar-minus","calendar-plus","calendar-times","calendar-week","camera","camera-retro","campground","candy-cane","cannabis","capsules","car","car-alt","car-battery","car-crash","car-side","caravan","caret-down","caret-left","caret-right","caret-square-down","caret-square-left","caret-square-right","caret-square-up","caret-up","carrot","cart-arrow-down","cart-plus","cash-register","cat","certificate","chair","chalkboard","chalkboard-teacher","charging-station","chart-area","chart-bar","chart-line","chart-pie","check","check-circle","check-double","check-square","cheese","chess","chess-bishop","chess-board","chess-king","chess-knight","chess-pawn","chess-queen","chess-rook","chevron-circle-down","chevron-circle-left","chevron-circle-right","chevron-circle-up","chevron-down","chevron-left","chevron-right","chevron-up","child","church","circle","circle-notch","city","clinic-medical","clipboard","clipboard-check","clipboard-list","clock","clone","closed-captioning","cloud","cloud-download-alt","cloud-meatball","cloud-moon","cloud-moon-rain","cloud-rain","cloud-showers-heavy","cloud-sun","cloud-sun-rain","cloud-upload-alt","cocktail","code","code-branch","coffee","cog","cogs","coins","columns","comment","comment-alt","comment-dollar","comment-dots","comment-medical","comment-slash","comments","comments-dollar","compact-disc","compass","compress","compress-alt","compress-arrows-alt","concierge-bell","cookie","cookie-bite","copy","copyright","couch","credit-card","crop","crop-alt","cross","crosshairs","crow","crown","crutch","cube","cubes","cut","database","deaf","democrat","desktop","dharmachakra","diagnoses","dice","dice-d20","dice-d6","dice-five","dice-four","dice-one","dice-six","dice-three","dice-two","digital-tachograph","directions","disease","divide","dizzy","dna","dog","dollar-sign","dolly","dolly-flatbed","donate","door-closed","door-open","dot-circle","dove","download","drafting-compass","dragon","draw-polygon","drum","drum-steelpan","drumstick-bite","dumbbell","dumpster","dumpster-fire","dungeon","edit","egg","eject","ellipsis-h","ellipsis-v","envelope","envelope-open","envelope-open-text","envelope-square","equals","eraser","ethernet","euro-sign","exchange-alt","exclamation","exclamation-circle","exclamation-triangle","expand","expand-alt","expand-arrows-alt","external-link-alt","external-link-square-alt","eye","eye-dropper","eye-slash","fan","fast-backward","fast-forward","faucet","fax","feather","feather-alt","female","fighter-jet","file","file-alt","file-archive","file-audio","file-code","file-contract","file-csv","file-download","file-excel","file-export","file-image","file-import","file-invoice","file-invoice-dollar","file-medical","file-medical-alt","file-pdf","file-powerpoint","file-prescription","file-signature","file-upload","file-video","file-word","fill","fill-drip","film","filter","fingerprint","fire","fire-alt","fire-extinguisher","first-aid","fish","fist-raised","flag","flag-checkered","flag-usa","flask","flushed","folder","folder-minus","folder-open","folder-plus","font","football-ball","forward","frog","frown","frown-open","funnel-dollar","futbol","gamepad","gas-pump","gavel","gem","genderless","ghost","gift","gifts","glass-cheers","glass-martini","glass-martini-alt","glass-whiskey","glasses","globe","globe-africa","globe-americas","globe-asia","globe-europe","golf-ball","gopuram","graduation-cap","greater-than","greater-than-equal","grimace","grin","grin-alt","grin-beam","grin-beam-sweat","grin-hearts","grin-squint","grin-squint-tears","grin-stars","grin-tears","grin-tongue","grin-tongue-squint","grin-tongue-wink","grin-wink","grip-horizontal","grip-lines","grip-lines-vertical","grip-vertical","guitar","h-square","hamburger","hammer","hamsa","hand-holding","hand-holding-heart","hand-holding-medical","hand-holding-usd","hand-holding-water","hand-lizard","hand-middle-finger","hand-paper","hand-peace","hand-point-down","hand-point-left","hand-point-right","hand-point-up","hand-pointer","hand-rock","hand-scissors","hand-sparkles","hand-spock","hands","hands-helping","hands-wash","handshake","handshake-alt-slash","handshake-slash","hanukiah","hard-hat","hashtag","hat-cowboy","hat-cowboy-side","hat-wizard","hdd","head-side-cough","head-side-cough-slash","head-side-mask","head-side-virus","heading","headphones","headphones-alt","headset","heart","heart-broken","heartbeat","helicopter","highlighter","hiking","hippo","history","hockey-puck","holly-berry","home","horse","horse-head","hospital","hospital-alt","hospital-symbol","hospital-user","hot-tub","hotdog","hotel","hourglass","hourglass-end","hourglass-half","hourglass-start","house-damage","house-user","hryvnia","i-cursor","ice-cream","icicles","icons","id-badge","id-card","id-card-alt","igloo","image","images","inbox","indent","industry","infinity","info","info-circle","italic","jedi","joint","journal-whills","kaaba","key","keyboard","khanda","kiss","kiss-beam","kiss-wink-heart","kiwi-bird","landmark","language","laptop","laptop-code","laptop-house","laptop-medical","laugh","laugh-beam","laugh-squint","laugh-wink","layer-group","leaf","lemon","less-than","less-than-equal","level-down-alt","level-up-alt","life-ring","lightbulb","link","lira-sign","list","list-alt","list-ol","list-ul","location-arrow","lock","lock-open","long-arrow-alt-down","long-arrow-alt-left","long-arrow-alt-right","long-arrow-alt-up","low-vision","luggage-cart","lungs","lungs-virus","magic","magnet","mail-bulk","male","map","map-marked","map-marked-alt","map-marker","map-marker-alt","map-pin","map-signs","marker","mars","mars-double","mars-stroke","mars-stroke-h","mars-stroke-v","mask","medal","medkit","meh","meh-blank","meh-rolling-eyes","memory","menorah","mercury","meteor","microchip","microphone","microphone-alt","microphone-alt-slash","microphone-slash","microscope","minus","minus-circle","minus-square","mitten","mobile","mobile-alt","money-bill","money-bill-alt","money-bill-wave","money-bill-wave-alt","money-check","money-check-alt","monument","moon","mortar-pestle","mosque","motorcycle","mountain","mouse","mouse-pointer","mug-hot","music","network-wired","neuter","newspaper","not-equal","notes-medical","object-group","object-ungroup","oil-can","om","otter","outdent","pager","paint-brush","paint-roller","palette","pallet","paper-plane","paperclip","parachute-box","paragraph","parking","passport","pastafarianism","paste","pause","pause-circle","paw","peace","pen","pen-alt","pen-fancy","pen-nib","pen-square","pencil-alt","pencil-ruler","people-arrows","people-carry","pepper-hot","percent","percentage","person-booth","phone","phone-alt","phone-slash","phone-square","phone-square-alt","phone-volume","photo-video","piggy-bank","pills","pizza-slice","place-of-worship","plane","plane-arrival","plane-departure","plane-slash","play","play-circle","plug","plus","plus-circle","plus-square","podcast","poll","poll-h","poo","poo-storm","poop","portrait","pound-sign","power-off","pray","praying-hands","prescription","prescription-bottle","prescription-bottle-alt","print","procedures","project-diagram","pump-medical","pump-soap","puzzle-piece","qrcode","question","question-circle","quidditch","quote-left","quote-right","quran","radiation","radiation-alt","rainbow","random","receipt","record-vinyl","recycle","redo","redo-alt","registered","remove-format","reply","reply-all","republican","restroom","retweet","ribbon","ring","road","robot","rocket","route","rss","rss-square","ruble-sign","ruler","ruler-combined","ruler-horizontal","ruler-vertical","running","rupee-sign","sad-cry","sad-tear","satellite","satellite-dish","save","school","screwdriver","scroll","sd-card","search","search-dollar","search-location","search-minus","search-plus","seedling","server","shapes","share","share-alt","share-alt-square","share-square","shekel-sign","shield-alt","shield-virus","ship","shipping-fast","shoe-prints","shopping-bag","shopping-basket","shopping-cart","shower","shuttle-van","sign","sign-in-alt","sign-language","sign-out-alt","signal","signature","sim-card","sink","sitemap","skating","skiing","skiing-nordic","skull","skull-crossbones","slash","sleigh","sliders-h","smile","smile-beam","smile-wink","smog","smoking","smoking-ban","sms","snowboarding","snowflake","snowman","snowplow","soap","socks","solar-panel","sort","sort-alpha-down","sort-alpha-down-alt","sort-alpha-up","sort-alpha-up-alt","sort-amount-down","sort-amount-down-alt","sort-amount-up","sort-amount-up-alt","sort-down","sort-numeric-down","sort-numeric-down-alt","sort-numeric-up","sort-numeric-up-alt","sort-up","spa","space-shuttle","spell-check","spider","spinner","splotch","spray-can","square","square-full","square-root-alt","stamp","star","star-and-crescent","star-half","star-half-alt","star-of-david","star-of-life","step-backward","step-forward","stethoscope","sticky-note","stop","stop-circle","stopwatch","stopwatch-20","store","store-alt","store-alt-slash","store-slash","stream","street-view","strikethrough","stroopwafel","subscript","subway","suitcase","suitcase-rolling","sun","superscript","surprise","swatchbook","swimmer","swimming-pool","synagogue","sync","sync-alt","syringe","table","table-tennis","tablet","tablet-alt","tablets","tachometer-alt","tag","tags","tape","tasks","taxi","teeth","teeth-open","temperature-high","temperature-low","tenge","terminal","text-height","text-width","th","th-large","th-list","theater-masks","thermometer","thermometer-empty","thermometer-full","thermometer-half","thermometer-quarter","thermometer-three-quarters","thumbs-down","thumbs-up","thumbtack","ticket-alt","times","times-circle","tint","tint-slash","tired","toggle-off","toggle-on","toilet","toilet-paper","toilet-paper-slash","toolbox","tools","tooth","torah","torii-gate","tractor","trademark","traffic-light","trailer","train","tram","transgender","transgender-alt","trash","trash-alt","trash-restore","trash-restore-alt","tree","trophy","truck","truck-loading","truck-monster","truck-moving","truck-pickup","tshirt","tty","tv","umbrella","umbrella-beach","underline","undo","undo-alt","universal-access","university","unlink","unlock","unlock-alt","upload","user","user-alt","user-alt-slash","user-astronaut","user-check","user-circle","user-clock","user-cog","user-edit","user-friends","user-graduate","user-injured","user-lock","user-md","user-minus","user-ninja","user-nurse","user-plus","user-secret","user-shield","user-slash","user-tag","user-tie","user-times","users","users-cog","users-slash","utensil-spoon","utensils","vector-square","venus","venus-double","venus-mars","vest","vest-patches","vial","vials","video","video-slash","vihara","virus","virus-slash","viruses","voicemail","volleyball-ball","volume-down","volume-mute","volume-off","volume-up","vote-yea","vr-cardboard","walking","wallet","warehouse","water","wave-square","weight","weight-hanging","wheelchair","wifi","wind","window-close","window-maximize","window-minimize","window-restore","wine-bottle","wine-glass","wine-glass-alt","won-sign","wrench","x-ray","yen-sign","yin-yang"];

var html_initContentPro = '<div class="sheetsUpdate seiProForm" id="sheetsCompleteEtapaForm" style="display:none"></div>';
if ( $('#sheetsCompleteEtapaForm').length == 0 ) { $('#divInfraBarraSistema').append(html_initContentPro) }


function getConfigHost(callback = false, callback_else = false) {
    var hosts = URL_SPRO+"config_hosts.json";
        fetch(hosts)
        .then((response) => response.json()) //assuming file contains json
        .then((json) => setConfigHost(json, callback, callback_else));
}
function setConfigHost(host, callback, callback_else){
    var set_host = false;
    if (typeof host !== 'undefined' && host !== null &&typeof host.matches !== 'undefined' && host.matches !== null && host.matches.length > 0) {
        for (i = 0; i < host.matches.length; i++) {
            if (window.location.host.indexOf(host.matches[i]) !== -1) set_host = true;
        }
    }
    if (set_host && typeof callback === 'function') {
        sessionStorage.setItem('configHost_Pro', JSON.stringify(host));
        callback();
    } else if (!set_host && typeof callback_else === 'function') {
        callback_else();
    }
}
function initUrlExtension(url) {
    if (typeof getUrlExtension === 'function') {
        return getUrlExtension(url);
    } else if (typeof URL_SPRO !== 'undefined') {
        return URL_SPRO+url;
    }
}
function calcFilterResume(table) {
    table.find('.filterResume').each(function(){
        var data = $(this).data();
        var total = $('.filterResume_'+data.resumetype+':visible').map(function(v){ if ($(this).text() != '') return parseFloat($(this).text()); }).get();
        var count = $('.filterResume_'+data.resumetype+':visible').map(function(v){ if ($(this).text() != '') return $(this).text().trim(); }).get();
        var dist = (count.length > 0) ? uniqPro(count).length : 0;
        var sum = total.reduce(function(a, b) { return a + b; }, 0);
        var avg = (sum/total.length) || 0;
        var result = (data.resumemod == 'avg') ? avg.toFixed(2)+' <sup>[MED]</sup>' : sum.toFixed(2)+' <sup>[TOTAL]</sup>';
            result = (data.resumemod == 'dist') ? dist+' <sup>[DIST]</sup>' : result;
        $(this).html(result);
    })
}
function getStylesOnEditor() {
    var styles = false;
    $('script').each(function(){
        if (typeof $(this).attr('src') == 'undefined' && $(this).html().indexOf('stylesheetParser_validSelectors') !== -1) {
            var text = $(this).html();
                styles = text.indexOf('/') === -1 ? false : $.map(text.split('/'), function(v) {
                    return (v.indexOf('(') !== -1) ? v.replace('(p)','').match(/\(([^)]+)\)/) : null;
                });
                styles = styles ? styles.map(function(v){ return v.replace("(","").replace(")","") }) : false;
                styles = styles ? styles.join('|').replace(":before","").replace('||','|').replace(/\\r\\n/g, '') : false;
                styles = styles && styles.indexOf('|') !== -1 ? uniqPro(styles.split('|')) : false;
                styles = styles ? styles.filter(function(v){ return v.indexOf('before') === -1 }) : false;
        }
    });
    if (styles) {
        setOptionsPro('stylesEditor',styles);
    } else {
        removeOptionsPro('stylesEditor');
    }
}
function filterTextExtractDate(elem, table, cellIndex) {
    var text = $(elem).text();
    if ($(table).find('tr.tablesorter-headerRow th.tablesorter-header[data-column="'+cellIndex+'"]').text().toLowerCase().indexOf('data') !== -1) {
        text = (text.indexOf(':') !== -1) ? moment(text, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : moment(text, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
    return text;
}
function insertFontIcon(elementTo, target = $('html')) {
    var iconBoxSlim = (localStorage.getItem('seiSlim')) ? true : false;
    var pathExtension = URL_SPRO;
    if ( target, target.find('link[datastyle="seipro-fonticon"]').length == 0 && target.find('style[data-style="seipro-fonticon"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            datastyle: "seipro-fonticon",
            href: initUrlExtension(iconBoxSlim ? "css/fontawesome.pro.min.css" : "css/fontawesome.min.css") 
        }).appendTo(target.find(elementTo));
        
        var htmlStyleFont = '<style type="text/css" data-style="seipro-fonticon" data-index="1">'+
                            '    @font-face {\n'+
                            '       font-family: "Font Awesome 5 '+(iconBoxSlim ? 'Pro' : 'Free')+'";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.woff2) format("woff2"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.woff) format("woff"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.ttf) format("truetype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-solid-900.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 '+(iconBoxSlim ? 'Pro' : 'Free')+'";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 400;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.eot?#iefix) format("embedded-opentype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.woff2) format("woff2"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.woff) format("woff"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.ttf) format("truetype"),url('+pathExtension+'webfonts'+(iconBoxSlim ? "/pro/" : "/")+'fa-regular-400.svg#fontawesome) format("svg") !important;\n'+
                            '   }\n'+
                            (iconBoxSlim ?
                            '   @font-face { \n'+
                            '       font-family: "Font Awesome 5 Pro";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 300;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-light-300.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-light-300.eot?#iefix) format("embedded-opentype"), url('+pathExtension+'webfonts/pro/fa-light-300.woff2) format("woff2"), url('+pathExtension+'webfonts/pro/fa-light-300.woff) format("woff"), url('+pathExtension+'webfonts/pro/fa-light-300.ttf) format("truetype"), url('+pathExtension+'webfonts/pro/fa-light-300.svg#fontawesome) format("svg") !important; }\n'+
                            '   }\n'+
                            '   @font-face {\n'+
                            '       font-family: \"Font Awesome 5 Duotone\";\n'+
                            '       font-style: normal;\n'+
                            '       font-weight: 900;\n'+
                            '       font-display: block;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.eot) !important;\n'+
                            '       src: url('+pathExtension+'webfonts/pro/fa-duotone-900.eot?#iefix) format(\"embedded-opentype\"), url('+pathExtension+'webfonts/pro/fa-duotone-900.woff2) format("woff2"), url('+pathExtension+'webfonts/pro/fa-duotone-900.woff) format("woff"), url('+pathExtension+'webfonts/pro/fa-duotone-900.ttf) format("truetype"), url('+pathExtension+'webfonts/pro/fa-duotone-900.svg#fontawesome) format("svg") !important; }\n'+
                            '   }\n'
                            : '')
                            '</style>';
        target.find('head').append(htmlStyleFont);
    }
}
function numberToLetter(number) {
    return (parseInt(number) + 9).toString(36).toUpperCase();
}
function decimalHourToMinute(minutes) {
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}
function reloadModalLink() {
    var urlModalink = $('head').find('script[src*="modalLink"]');
    urlModalink = (typeof urlModalink !== 'undefined') ? urlModalink.attr('src') : false;

    if (urlModalink) {
        $.getScript(urlModalink);
    }
}
function loadStylePro(url, elementTo = $('head'), iframeTo = $('head')) {
    if (iframeTo.find('link[data-style="seipro-style"]').length == 0) {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: url
        }).appendTo(elementTo);
    }
}
function checkLoadJqueryUI() {
    if (typeof $().dialog === 'undefined') {
        $.getScript(URL_SPRO+"js/lib/jquery-ui.min.js");
        loadStylePro(URL_SPRO+'css/jquery-ui.css');
    }
}
function checkLoadFileRobot(callback = false) {
    if (typeof window.FilerobotImageEditor === 'undefined') {
        $.getScript(URL_SPRO+"js/lib/filerobot-image-editor.min.js", function(){
            if (typeof callback === 'function') callback();
        });
    } else {
        if (typeof callback === 'function') callback();
    }
}
function checkValue(elem) {
    var len = (typeof elem.val() !== 'undefined' && elem.val() !== null) ? elem.val().trim().length : 0;
    return (len > 0) ? true : false;
}
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function avgArray(array) {
    var sum = 0;
    for( var i = 0; i < array.length; i++ ){
        sum += parseInt( array[i], 10 ); //don't forget to add the base
    }
    return sum/array.length;
}
function convertJsonBools(obj) {
    return JSON.parse(JSON.stringify(obj), (k, v) => v === "true" ? true : v === "false" ? false : v);
}
function zeroWidthTrim(stringToTrim) {
    var ZERO_WIDTH_SPACES_REGEX = /([\u200B]+|[\u200C]+|[\u200D]+|[\u200E]+|[\u200F]+|[\uFEFF]+)/g;
    var trimmedString = stringToTrim.replace(ZERO_WIDTH_SPACES_REGEX, '');
    return trimmedString;
  };
function goToTextInDoc(pesquisaTexto) {
    var ifrArvoreHtml = $('#ifrVisualizacao').contents().find('#ifrArvoreHtml');
    var urlDoc = ifrArvoreHtml.attr('src');
        urlDoc = (urlDoc.indexOf('#') !== -1) ? urlDoc.split('#')[0] : urlDoc;
        ifrArvoreHtml.attr('src', urlDoc+'#:~:text='+encodeURIComponent(pesquisaTexto));
}
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}
function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}
function extractCPFs(text) {
    return text.match(/(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))/gi);
}
function extractHexColor(text) {
    return text.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi);
}
function getChartLabelItemStore(idElem, chartObj){
    if (getOptionsPro(idElem+'_canvas')){
        var arrayLabels = getOptionsPro(idElem+'_canvas');
            arrayLabels.forEach(function(value, i) {
                // console.log({type: typeof chartObj.getDatasetMeta(0), meta: chartObj.getDatasetMeta(0), obj: chartObj});
                if (typeof chartObj.getDatasetMeta(0) === 'object') {
                    var _meta = (chartObj.config.type == 'pie' || chartObj.config.type == 'doughnut' || chartObj.config.type == 'line') 
                        ? (typeof chartObj.getDatasetMeta(0).data[value.index] !== 'undefined' ? chartObj.getDatasetMeta(0).data[value.index] : false)
                        : (typeof chartObj.getDatasetMeta(value.index) !== 'undefined' ? chartObj.getDatasetMeta(value.index) : false);

                    // console.log(idElem, typeof _meta, i, _meta);
                    if (_meta && typeof _meta === 'object' && typeof _meta.hidden !== 'undefined' && (value.hidden || value.hidden === null)) {
                        _meta.hidden = (value && value.hasOwnProperty('hidden') ? value.hidden : null);
                    }
                }
            });
            chartObj.update();
    }
}
function setChartLabelItemStore(e, legendItem){
    var ci = this.chart;
    var is_line = (typeof legendItem.datasetIndex !== 'undefined') ? true : false;
    var index = (is_line) ? legendItem.datasetIndex : legendItem.index;
    var _meta = (is_line) ? ci.getDatasetMeta(index) : ci.getDatasetMeta(0).data[index];
    var _metas = (is_line) ? ci.data.datasets : ci.data.datasets[0].data;

    var alreadyHidden = (_meta.hidden === null) ? false : _meta.hidden;  
    if (alreadyHidden) {
        _meta.hidden = null;
    } else {
        _meta.hidden = true;
    }
    
    var arrayMetaChart = [];
    _metas.forEach(function(e, i) {
        var meta = (is_line) ? ci.getDatasetMeta(i) : ci.getDatasetMeta(0).data[i];
        arrayMetaChart.push({index: i, hidden: meta.hidden});
    });
    console.log(arrayMetaChart);

    ci.update();
    setOptionsPro($(this.chart.canvas).attr('id'), arrayMetaChart);
}
function extractAllTextBetweenQuotes(str){
  const re = /'(.*?)'/g;
  const result = [];
  let current;
  while (current = re.exec(str)) {
    result.push(current.pop());
  }
  return result.length > 0
    ? result
    : [str];
}
function userTyped(this_) {
    $(this_).data('user-typed', ($(this_).val().trim() == '' ? false : true));
}
function dragColumnTable(elemTable) {
    var local = {};
        local.containment = 'parent';
        local.revert = true;
        elemTable.find('thead th').not('.sorter-false').draggable(local);
        elemTable.find('thead th').not('.sorter-false').droppable({
            drop: dropZone
        });
    function dropZone(myEvent, myUI ) {
        var head = {};

        head.dragIndex = myUI.draggable.index();
        head.dropIndex = $(this).index();
        head.rows = $(this).closest('thead').find('tr');
        head.cellIndex = head.rows.find('th').length-1;
        head.rows.each(processTableHeaderRows);

        function processTableHeaderRows(index, element) {
            var row = {}

            row.tr = $(element);
            row.drag = row.tr.find('th:eq(' + head.dragIndex + ')');
            row.drop = row.tr.find('th:eq(' + head.dropIndex + ')');
            if (head.dropIndex === head.cellIndex) {
                row.drag.detach().insertAfter(row.drop);
            } else {
                row.drag.detach().insertBefore(row.drop);
            }
        }
        // Same thing here for td instead of th
        $(this).closest('table').find('tbody > tr').each(processRows);
        function processRows(index, element) {
            var row = {};

            row.tr = $(element);
            row.drag = row.tr.find('td:eq(' + head.dragIndex + ')');
            row.drop = row.tr.find('td:eq(' + head.dropIndex + ')');
            if (head.dropIndex === head.cellIndex) {
                row.drag.detach().insertAfter(row.drop);
            } else {
                row.drag.detach().insertBefore(row.drop);
            }
        }
        setOptionsPro('panelAtividadesViewTableSort', getColumnsSortable(elemTable));
        setTimeout(function(){ 
            repareStickColumnsSortable(elemTable, true);
        }, 500);
    }
    repareStickColumnsSortable(elemTable);
    setTimeout(function(){ 
        if (elemTable.find('thead tr').is(':hidden')) {
            repareStickColumnsSortable(elemTable, true);
        }
    }, 500);
}
function repareStickColumnsSortable(elemTable, refresh = false) {
    elemTable.find('thead tr.headerStick').remove();
    var headerStick = elemTable.find('thead tr.tableHeader').clone(true, true).addClass('headerStick').hide();
    elemTable.find('thead').prepend(headerStick);
    elemTable.find('thead tr.headerStick th').not('.sorter-false').removeAttr('style').removeClass('ui-draggable-dragging').find('.fa-arrows-alt-h').remove();


    var tableHeader = elemTable.find('thead tr.tableHeader').not('.headerStick');
        tableHeader.show().find('.fa-arrows-alt-h').remove();
        tableHeader.find('th.tablesorter-header').not('.sorter-false').find('.tablesorter-header-inner').append('<i class="fas fa-arrows-alt-h" style="float: right;right: 20px;position: absolute;"></i>');
    var headerStick = elemTable.find('thead tr.headerStick');

    $('#tabelaAtivPanel').unbind('scroll').scroll(function() {
        if (typeof $(this).offset() !== 'undefined' && $(this).offset() !== null && typeof headerStick.offset() !== 'undefined' && headerStick.offset() !== null) {
            var wrapperTop = $(this).offset().top-25;
            var headerTop = headerStick.offset().top;
            setTimeout(function(){ 
                if ( headerTop < wrapperTop || headerTop == 0) {
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
        setTimeout(function(){ 
            // $('#tabelaAtivPanel').trigger('scroll');
        }, 100);
    }
}
function getColumnsSortable(elemTable) {
    var arrayColumns = elemTable.find('thead tr.tableHeader').not('.headerStick').find('th.tituloControle').not('.sorter-false').map(function(v){
        return $(this).data('filter-type');
    }).get();
    return arrayColumns;
}
function initFileSystem() {
    // Allow for vendor prefixes.
    window.requestFileSystem = window.requestFileSystem ||
    window.webkitRequestFileSystem;
    // Create a variable that will store a reference to the FileSystem.
    // Start the app by requesting a FileSystem (if the browser supports the API)
    if (window.requestFileSystem) {
        setFileSystem();
    } else {
        console.log('Desculpe! Seu navegador n\u00E3o possui suporte ao sistema de arquivos local (FileSystem API)');
    }
}
// A simple error handler to be used throughout this demo.
function errorHandler(error) {
    console.log(error);
}
// Request a FileSystem and set the filesystem variable.
function setFileSystem() {
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
        function(grantedSize) {
            // Request a file system with the new size.
            window.requestFileSystem(window.PERSISTENT, grantedSize, function(fs) {
                // Set the filesystem variable.
                filesystem = fs;
                // Setup event listeners on the form.
                // Update the file browser.
                fileSystemListFiles();
            }, errorHandler);
        }, errorHandler);
}
  
function fileSystemLoadFile(filename) {
    filesystem.root.getFile(filename, {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                // Update the form fields.
                var return_this = (typeof this.result !== 'undefined') ? this.result : false;
                    return_this = (return_this && isJson(JSON.parse(this.result))) ? JSON.parse(this.result) : [];
                // console.log(filename, return_this);
                fileSystemContentPro = return_this;
            };
            reader.readAsText(file);
        }, errorHandler);

    }, errorHandler);
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
// Save a file in the FileSystem.
function fileSystemSaveFile(filename, content) {
    filesystem.root.getFile(filename, {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                // Update the file browser.
                fileSystemListFiles();
                // console.log('File saved');
            };
            fileWriter.onerror = function(e) {
                console.log('Write error: ' + e.toString());
                console.log('Ocorreu um erro e n\u00E3o foi poss\u00EDvel salvar seu arquivo');
            };
            var contentBlob = new Blob([content], {type: 'text/plain'});
            fileWriter.write(contentBlob);
        }, errorHandler);
    }, errorHandler);
}
function fileSystemDeleteFile(filename) {
    filesystem.root.getFile(filename, {create: false}, function(fileEntry) {
        fileEntry.remove(function(e) {
            // Update the file browser.
            fileSystemListFiles();
            // console.log('File deleted!');
        }, errorHandler);
    }, errorHandler);
}
function fileSystemUpdateFile(filename, content) {
    initFileSystem();
    setTimeout(function(){ 
        if (fileSystemPro) { fileSystemDeleteFile(filename); }
    }, 10);
    setTimeout(function(){ 
        fileSystemSaveFile(filename, content);
        fileSystemLoadFile(filename);
    }, 100);
}
function getLocalFilePro() {
    initFileSystem();
    setTimeout(function(){ 
        if (fileSystemPro) { 
            fileSystemLoadFile('configPro.json'); 
            setTimeout(function(){ 
                console.log(fileSystemPro, fileSystemContentPro);
            }, 100);
        }
    }, 10);
}
function setLocalFilePro(content) {
    initFileSystem();
    setTimeout(function(){ 
        if (fileSystemPro) { 
            fileSystemUpdateFile('configPro.json', JSON.stringify(content)); 
            console.log('setLocalFilePro', content);
        }
    }, 10);
    setTimeout(function(){ 
        getLocalFilePro();
    }, 500);
}
function initDownloadLocalFilePro(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if ((typeof fileSystemContentPro !== 'undefined' && fileSystemContentPro) || (typeof localStorageRestorePro('configDataFavoritesPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataFavoritesPro'))) ) { 
        downloadLocalFilePro(this_);
    } else {
        $(this_).find('i').attr('class','fas fa-spinner fa-spin cinzaColor');
        if (TimeOut == 9000) fileSystemLoadFile('configPro.json');
        setTimeout(function(){ 
            initDownloadLocalFilePro(this_, TimeOut - 100); 
            console.log('Reload initDownloadLocalFilePro'); 
        }, 500);
    }
}
function downloadLocalFilePro(this_) {
    var _this = $(this_);
    var configPro = JSON.stringify(localStorageRestorePro('configDataFavoritesPro'));
    var nameFile = 'configPro';

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", configPro]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile+'_'+moment().format('YYYYMMDD_HH:mm:ss')+'.json';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    _this.find('i').attr('class','fas fa-thumbs-up azulColor');
    setTimeout(function(){ 
        _this.find('i').attr('class','fas fa-download azulColor');
    }, 1000);
}
function initLoadLocalFilePro() {
    $('#selectLocalFilesPro[type=file]').trigger('click');
}
function loadLocalFilePro() {
    confirmaFraseBoxPro('Esta a\u00E7\u00E3o ir\u00E1 substituir todos os dados de processos favoritos. Tem certeza que deseja prosseguir?', 'SIM', 
        function(){
            var files = document.getElementById('selectLocalFilesPro').files;
            if (files.length <= 0) { return false; }
            
            var fr = new FileReader();
            fr.onload = function(e) { 
                var result = JSON.parse(e.target.result); 
                    result.datetime = moment().format('YYYY-MM-DD HH:mm:ss');

                    setLocalFilePro(result);
                    localStorageStorePro('configDataFavoritesPro', result);
                    setPanelFavorites('refresh');
                    resetDialogBoxPro('dialogBoxPro');
                setTimeout(function(){ 
                        alertaBoxPro('Sucess', 'check-circle', 'Configura\u00E7\u00F5es carregadas com sucesso!');
                        console.log('loadLocalFilePro', result.datetime, result, getStoreFavoritePro());
                }, 500);
            }
            fr.readAsText(files.item(0));
    });
}
function htmlIconFavorites(id_procedimento, float = false) {
    var storeFavorites = getStoreFavoritePro()['favorites'];
    var dataFavorites = (jmespath.search(storeFavorites, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") > 0) ? jmespath.search(storeFavorites, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : '';
    var floatStyle = (float) ? 'float: '+float+';' : '';
    var iconStar = (dataFavorites == '') 
                    ? '<i title="Adicionar Processo aos Favoritos" id="iconFavoritePro_'+id_procedimento+'" data-id_procedimento="'+id_procedimento+'" onclick="parent.actFavoritePro(this, \'add\')" class="far fa-star iconFavoritePro" style="font-size: 12pt; margin: 0 5px; color: #666; cursor: pointer; '+floatStyle+'"></i>'
                    : '<i title="Remover Processo dos Favoritos" id="iconFavoritePro_'+id_procedimento+'" data-id_procedimento="'+id_procedimento+'" onclick="parent.actFavoritePro(this, \'remove\')" class="fas fa-star starGold iconFavoritePro" style="font-size: 12pt; margin: 0 5px; cursor: pointer; -webkit-text-fill-color: #FED35B; -webkit-text-stroke-color: rgb(216 162 22); -webkit-text-stroke-width: 2px; '+floatStyle+'"></i>';
    return iconStar;
}
function resizeWinArvore(widthArvore) {
    var indent = 10; // reduz 10 pixel a largura do visualizador para compensar a barra divisoria existente entre a arvore e o visualizador
    var widthConteudo = $('#divConteudo').width(); // capta o tamanho total da janela do SEI (janela interna)
    var widthVisualizacao = widthConteudo-widthArvore-indent; // calcula o novo tamanho total da janela de visualizacao, sendo o tamanho util da janela (menos) o tamanho da arvore (menos) a folga de 10pixels
    
    // $('#ifrArvore').css('width', widthArvore); // redimensiona a janela da arvore
    // $('#ifrVisualizacao').css('width', widthVisualizacao); // redimensiona a janela do visualizador de documentos
}
function resizeArvoreMaxWidth() {
    if ($('#ifrArvore').length > 0 && verifyConfigValue('resizearvore')) { // verifica se a arvore existe e se a opcao da extensao esta ativa
        var indent = 40; // adiciona 40 pixel a largura da arvore para compensar as margens internas e externas
        // resizeWinArvore(widthArvore+indent); // chama a funcao de redimensar as janelas da arvore e do visualizador de documentos, já com o valor da arvore menos o folga de 20pixels
        waitLoadPro($('#ifrArvore').contents(), 'form', "#divArvore", function(){
            var widthArvore = $('#ifrArvore').contents().find('#divArvore')[0].scrollWidth; // captura a largura da arvore de processo dentro do iframe
                widthArvore = (typeof widthArvore !== 'undefined') ? widthArvore+60 : false;

                if (widthArvore) {
                    removeOptionsPro('iframeSizeSlimPro');
                    setSizeIframePro(widthArvore, false);
                }
        });
    }
}
function addTextToTextarea(source, target, text) {
    target.insertAtCaret(text);
    source.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
function reverseArray(array){
    return array.map((item,idx) => array[array.length-1-idx])
}
function checkObjHasProperty(obj, key) {
    var return_ = true;
    for(var i = 0; i < obj.length; i++) {
        if (typeof obj[i][key] === "undefined" || !obj[i].hasOwnProperty(key)) {
            return_ = false;
            break;
        }
    }
    return return_;
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
function roundToTwo(num){
    return Math.round((num + Number.EPSILON) * 100) / 100
}
function infraFormatarTamanhoBytes(numBytes){
    var ret = null;
    if (numBytes > 1099511627776){
        ret = Math.round(numBytes/1099511627776 * 100) / 100 + ' Tb';
    } else if (numBytes > 1073741824) {
        ret = Math.round(numBytes/1073741824 * 100) / 100 + ' Gb';
    } else if (numBytes > 1048576) {
        ret = Math.round(numBytes/1048576 * 100) / 100 + ' Mb';
    } else /* if (numBytes > 1024) */ {
        ret = Math.round(numBytes/1024* 100) / 100 +' Kb';
    }
    return ret;
}
function is_html(str) {
    var regex = /<\/?[a-z][\s\S]*>/i; 
    return regex.test(str);
}
function validateEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    return regex.test(email);
}
// encodeURIComponent para ISO-8859-1
function escapeComponent(str) {  
    return escape(str).replace(/\+/g, '%2B');
}
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
function escapeHtml(string) {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }
function forceOnLoadBodyPage() {
    var onload = new Function($('body').attr('onload'));
    onload();
}
function downloadTableCSV(element, nameFile) {
  var titles = [];
  var data = [];
  element.find('th').each(function() { titles.push($(this).text().trim()) });
  element.find('td').each(function() { if (!$(this).closest('tr').hasClass('notCopy')) { data.push($(this).text().trim()) } });
  var CSVString = prepCSVRow(titles, titles.length, '');
  CSVString = prepCSVRow(data, titles.length, CSVString);

  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", CSVString]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = nameFile+'_'+moment().format('YYYYMMDD_HH:mm:ss')+'.csv';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
function prepCSVRow(arr, columnCount, initial) {
  var row = '';
  var delimeter = ';';
  var newLine = '\r\n';

  function splitArray(_arr, _count) {
    var splitted = [];
    var result = [];
    _arr.forEach(function(item, idx) {
      if ((idx + 1) % _count === 0) {
        splitted.push(item);
        result.push(splitted);
        splitted = [];
      } else {
        splitted.push(item);
      }
    });
    return result;
  }
  var plainArr = splitArray(arr, columnCount);
  plainArr.forEach(function(arrItem) {
    arrItem.forEach(function(item, idx) {
      row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
    });
    row += newLine;
  });
  return initial + row;
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function toNumBr(num) {
    return num.toString().replace(/\./g, ',');
}
function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
function rgbToHexString(string) {
    string = (typeof string !== 'undefined' && string !== null) ? string.substring(4, string.length-1).replace(/ /g, '').split(',') : false;
  return (string) ? rgbToHex(parseInt(string[0]), parseInt(string[1]), parseInt(string[2])) : '';
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function addAlpha(color, opacity) {
    // coerce values so ti is between 0 and 1.
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}
function getHashTagsPro(inputText) {  
    var regex = /(?:^|\s)(?:#)([a-zA-Z+-§\d]+)/gm;
    var matches = [];
    var match;
    while ((match = regex.exec(inputText))) {
        matches.push(match[1].trim().replace(/\.|\,|\:|\//g, ''));
    }
    return matches;
}
function hasNumber(str) {
  return /\d/.test(str);
}
function onlyNumber(str) {
    return hasNumber(str) ? str.match(/\d+/g).join('') : str;
}
function joinAnd(a) {
    return (a.length==1) ? a[0] : a.slice(0, -1).join(', ')+' e '+a.slice(-1);
}
function getBrightnessColor(value) {
    var rgb = hexToRgb(value);
    return Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) / 1000);
}
function removeDuplicatesArray(list, ref) {
    var result = [];
    $.each(list, function (i, e) {
        var matchingItems = $.grep(result, function (item) {
           return item[ref] === e[ref];
        });
        if (matchingItems.length === 0){
            result.push(e);
        }
    });
    return result;
}
function extractOnlyAlphaNum(string) {
    string = (string != '') ? string.replace(/[^a-z0-9 ]/gi, '').replace(/  /g, ' ') : string;
    return string;
}
function extractTooltip(elem) {
    return extractOnlyAlphaNum(removeAcentos($("<div/>").html(elem.replace('return infraTooltipMostrar(', '').replace(');', '').replace(',', ' ').replace(/["']/g, "")).text()));
}
function extractTooltipToArray(elem) {
        elem = $("<div>").html(elem).text();
        elem = elem.replace(/<[^>]*>?/gm, '');
        elem = removeAcentos(elem);
        elem = elem.replace('return infraTooltipMostrar(', '').replace(');', '').replace(/["']/g, '"');
        // console.log(elem);
    // var array = (elem != '') ? [] : [];
    var array = (elem != '' && isJson('['+elem+']')) ? JSON.parse('['+elem+']') : [];
    return (array.length > 0) ? array : false;
}
function ganttAutoProgressPercent(dtStar, dtEnd) {
    var dtNow = moment();
    var progressDat = dtEnd.diff(dtStar, 'days');
    var progressDatNow = dtNow.diff(dtStar, 'days');
    var percentProgress = Math.round((progressDatNow/progressDat)*100);
        percentProgress = ( percentProgress < 0 ) ? 0 : percentProgress;
    return percentProgress;
}
function changePanelSortPro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelSortPro', true);
        if ($('#panelHomePro').hasClass('ui-sortable')) {
            $('#panelHomePro').sortable('enable');
        } else {
            setSortDivPanel();
        }
    } else {
        removeOptionsPro('panelSortPro');
        $('#panelHomePro').sortable('disable');
        $('#panelHomePro .titlePanelHome').unbind();
    }
}
function changePanelSortColumnsPro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelSortColumnsPro', true);
    } else {
        removeOptionsPro('panelSortColumnsPro');
    }
}
function changePanelLocalStorePro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelLocalStorePro', true);
    } else {
        removeOptionsPro('panelLocalStorePro');
    }
}
function changePanelLabPro(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        setOptionsPro('panelLabPro', true);
    } else {
        removeOptionsPro('panelLabPro');
    }
}
function setSortDivPanel() {
    if (getOptionsPro('panelSortPro')) {
        if ($('#panelHomePro').hasClass('ui-sortable')) {
            // console.log('### refresh #panelHomePro');
            setTimeout(function(){ 
                $('#panelHomePro').sortable().sortable('refresh');
                controleSortDivPanel();
            }, 1000);
        } else {
            // console.log('### init #panelHomePro');
            $('#panelHomePro').sortable({
                items: '.panelHomePro',
                cursor: 'grabbing',
                handle: '.titlePanelHome',
                forceHelperSize: true,
                opacity: 0.5,
                update: function(event, ui) {
                    var orderPanelHome = [];
                    $('.panelHomePro').each(function(index){
                        //$(this).find('.infraBarraLocalizacao').append('<span>'+index+'</span>');
                        orderPanelHome.push({name: $(this).attr('id'), index: index});
                        $(this).data('order', index).attr('data-order', index);
                    });
                    console.log(orderPanelHome);
                    setOptionsPro('orderPanelHome',orderPanelHome);
                }
            });
            controleSortDivPanel();
        }
    }
}
function controleSortDivPanel() {
    $('#panelHomePro .titlePanelHome').unbind().mouseenter(function() {
        // console.log('enable');
        $('#panelHomePro').sortable('enable');
    }).mouseleave(function() {
        // console.log('disable');
        $('#panelHomePro').sortable('disable');
    });
}
function forcePlaceHoldChosen() {
    $('select').each(function(){
        var _this = $(this);
        var placeholder = _this.data('placeholder');
            placeholder = (typeof placeholder !== 'undefined') ? placeholder : false;
        if (placeholder) {
            setPlaceHoldChosen(this);
            _this.unbind().on('change', function() {
                setPlaceHoldChosen(this);
            })
        }
    });
}
function setPlaceHoldChosen(this_) {
    var emptyvalue = ($(this_).val() !== null) ? $(this_).val().trim() : '';
        emptyvalue = (emptyvalue == '0' || emptyvalue == '') ? true : false;
    var placeholder = $(this_).data('placeholder');
        placeholder = (typeof placeholder !== 'undefined') ? placeholder : false;
    var chosenMin = $(this_).hasClass('chosen-min');
    var id = $(this_).attr('id');
        id = (typeof id !== 'undefined') ? id+'_chosen' : false;
    if (id && $('#'+id).length > 0 && emptyvalue && placeholder) {
        $('#'+id).find('.chosen-single span').text(placeholder);
        if (chosenMin) $('#'+id).addClass('chosen-min');
    }
}
function initChosenReplace(mode, this_ = false, force = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') {
        var _this = $(this_);
        var _parent = (_this.closest('.popup-wrapper').length > 0) ? _this.closest('.popup-wrapper') : _this.closest('.ui-dialog');
            _parent = (typeof _parent !== 'undefined' && _parent.length) ? _parent : _this.closest('.cke_dialog');
        if  (mode == 'panel') {
            $('.panelHome select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado'
            });
        } else if (mode == 'box_init') {
            _parent.find('select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado'
            });
        } else if (mode == 'box_refresh') {
            _parent.find('select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .trigger('chosen:updated');
        } else if (mode == 'box_reload') {
            _parent.find('select')
                .not('[multiple]')
                .filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') || force
                })
                .chosen("destroy")
                .chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado'
            });
        }
        chosenReparePosition();
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') { 
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
            console.log('@load chosen');
        }
        setTimeout(function(){ 
            initChosenReplace(mode, this_, force, TimeOut - 100); 
            console.log('Reload initChosenReplace'); 
        }, 500);
    }
}
function chosenReparePosition(target = $('body')) {
    target.find('.chosen-container').each(function(){
            var id = $(this).attr('id');
                id = (typeof id !== 'undefined') ? id.replace('_chosen', '') : false;
            if (id && target.find('#'+id).css('position') == 'absolute') {
                var cssElem = {
                    'position': 'absolute',
                    'left': target.find('#'+id).css('left'),
                    'top': target.find('#'+id).css('top')
                }
                $(this).css(cssElem);
            }
        });
}
function setMenuSistemaView(force = false) {
    var checkMenu = $('#divInfraAreaTelaE').is(':visible');
    $('#divInfraAreaTelaD').css('width',(checkMenu ? '79%' : '99%'));
    if (checkMenu || force) {
        // removeOptionsPro('panelMenuSistemaView');
        $('#divInfraAreaTelaE').removeClass('menuSuspenso');
        $('#divInfraBarraSistemaE').removeClass('barSuspenso').removeClass('barSuspenso_show');
    } else {
        // setOptionsPro('panelMenuSistemaView', 'active');
        $('#divInfraAreaTelaE').addClass('menuSuspenso');
        $('#divInfraBarraSistemaE').addClass('barSuspenso');
    }
}
function hideMenuSistemaView() {
    if ($('#divInfraAreaTelaE').length > 0) {
        $('#lnkInfraMenuSistema').unbind().on("click", function () {
            setMenuSistemaView();
        });
        if (getOptionsPro('panelMenuSistemaView') == 'active' && !$('#divInfraAreaTelaE').is(':visible')) {
            $('#divInfraAreaTelaE').addClass('menuSuspenso');
            $('#divInfraBarraSistemaE').addClass('barSuspenso').removeClass('barSuspenso_show');
        }
        $('#divInfraBarraSistemaE').unbind().on('click', function(event){
            event.stopPropagation();
            event.preventDefault();
            if (!delayCrash) {
                var menu = $('#divInfraAreaTelaE');
                if (!$(this).hasClass('barSuspenso')) {
                    $(this).addClass('barSuspenso');
                    menu.addClass('menuSuspenso');
                    setOptionsPro('panelMenuSistemaView', 'active');
                    $('#divInfraAreaTelaD').css('width','99%');
                }
                $('body').addClass('seiSlim_hidemenu');
                if (menu.is(':visible')) {
                    menu.hide("slide", { direction: "left" }, 300);
                    $(this).removeClass('barSuspenso_show');
                } else {
                    menu.show("slide", { direction: "left" }, 300);
                    $(this).addClass('barSuspenso_show');
                }
                delayCrash = true;
                setTimeout(function(){ delayCrash = false }, 300);
            }
        });
    }
}
function checkMenuSistemaView() {
    if ($('#divInfraAreaTelaE').is(':visible')) {
        $('body').removeClass('seiSlim_hidemenu');
    } else {
        $('body').addClass('seiSlim_hidemenu');
    }
}
function checkboxRangerSelectShift(elemSelect = false) {
    var elem = (elemSelect) ? $(elemSelect) : $('body');
    var $chkboxes = $('input[type="checkbox"]');
    var lastChecked = null;
    $chkboxes.unbind().on('click',function(e) {
        if (!lastChecked) {
            lastChecked = this;
            return;
        }
        if (e.shiftKey) {
            var start = $chkboxes.index(this);
            var end = $chkboxes.index(lastChecked);
            $chkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).trigger('click');
            this.click();
            $chkboxes.eq(end).trigger('click');
        }
        lastChecked = this;
    });
}
function corrigeTableSEI(elementSelect) {
    if ($(elementSelect).find('thead').length == 0) {
        $(elementSelect).each(function() {
            if (typeof $(this).attr('id') === 'undefined') {
                $(this).attr('id','infraTable_'+randomString(4));
            }
            $("<thead></thead>").insertBefore($(this).find('tbody')).append($(this).find('tbody>tr:first-child'));
        })
    }
}
function rememberScroll(elementScroll, nameScroll, animated = true) {
    var scrollPos = getOptionsPro('rememberScroll_'+nameScroll);
    if (getOptionsPro('rememberScroll_'+nameScroll)) {
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
    container.animate({
        scrollTop: scrollToElem.offset().top - container.offset().top + container.scrollTop() - stick
    });
}
function resetDialogBoxPro(elementBox) {
    if (elementBox == 'alertBoxPro' && alertBoxPro) { 
        alertBoxPro.dialog('destroy');
        alertBoxPro = false;
        $('.alertaBoxDiv').remove();
    } else if (elementBox == 'dialogBoxPro' && dialogBoxPro) { 
        dialogBoxPro.dialog('destroy');
        dialogBoxPro = false;
        $('.dialogBoxDiv').remove();
    } else if (elementBox == 'configBoxPro' && configBoxPro) { 
        configBoxPro.dialog('destroy');
        configBoxPro = false;
        $('.configBoxProDiv').remove();
    } else if (elementBox == 'iframeBoxPro' && iframeBoxPro) { 
        iframeBoxPro.dialog('destroy');
        iframeBoxPro = false;
        $('.iframeBoxDiv').remove();
    } else if (elementBox == 'editorBoxPro' && editorBoxPro) { 
        editorBoxPro.dialog('destroy');
        editorBoxPro = false;
        $('.editorBoxProDiv').remove();
    }
    infraTooltipOcultar();
}
function updateDadosProcesso(idElement, value, callback = false) {
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = dadosProcessoPro.propProcesso.action;
    if (typeof url !== 'undefined' && url != '') {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();
                iframe.find('#'+idElement).val(value);
                $(this).unbind();
                iframe.find('#btnSalvar, #sbmSalvar').trigger('click');
                if (typeof callback === 'function') callback();
        });
    } else {
        return false;
    }
}
function extractDataFormulario(output = 'obj', allFields = false) {
    var ifrArvoreHtml = $('#ifrVisualizacao').contents().find('#ifrArvoreHtml').contents();
    var arrayData = ifrArvoreHtml.find('#conteudo').html().split('\n');
    var nr_sei = ifrArvoreHtml.find('#titulo label').text();
        nr_sei = (typeof nr_sei !== 'undefined' && nr_sei != '' && nr_sei.indexOf('-') !== -1) ? nr_sei.split('-')[nr_sei.split('-').length-1].trim() : false;
    var data_assinatura = ifrArvoreHtml.find('#assinaturas').text();
        data_assinatura = (typeof data_assinatura !== 'undefined' && data_assinatura != '') 
            ? data_assinatura.split('\n').map(function(txt) {
                    var reg = new RegExp('documento assinado eletronicamente', "i");
                    var p = false;
                    if (reg.test(txt)) { 
                        var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
                        var time = txt.match(/(\d{1,2}:\d{2})/img);
                        return (date !== null && time !== null) ? date[0]+' '+time[0] : false; 
                    }
                }).join('') 
            : false;
    var processo = $('#ifrArvore').contents().find("a[target='ifrVisualizacao']").eq(0).text().trim();
    var objOut = {};
    var arrayOut = [];
    var fieldsOut = [];
    var stringOut = '';
    var dataForm = arrayData.map(function(v, i){
        if (v.indexOf(':') !== -1 && v.indexOf('<b>') !== -1 ) {
            var name = removeAcentos($('<div>'+v+'</div>').text().trim()).toLowerCase();
                name = (name.indexOf(' (') !== -1) ? name.split('(')[0].trim() : name;
                name = extractOnlyAlphaNum(name).replace(/ /g, '_');
            var value = (typeof arrayData[i+1] !== 'undefined') ? $('<div>'+arrayData[i+1]+'</div>').text().trim() : null;
            objOut[name] = value;
            arrayOut.push({name: name, value: value});
            fieldsOut.push(name);
            stringOut += '#'+name+': '+value+'\n';
        }
    });
    if (allFields) {
        arrayOut.push({name: 'data_assinatura', value: data_assinatura});
        arrayOut.push({name: 'nr_sei', value: nr_sei});
        arrayOut.push({name: 'processo', value: processo});
        objOut[data_assinatura] = data_assinatura;
        objOut[nr_sei] = nr_sei;
        objOut[processo] = processo;
        stringOut += '#data_assinatura: '+data_assinatura+'\n';
        stringOut += '#nr_sei: '+nr_sei+'\n';
        stringOut += '#processo: '+processo+'\n';
    }
    return (output == 'obj') 
            ? objOut 
            : (output == 'array') 
                ? arrayOut
                : (output == 'fields') 
                    ? fieldsOut
                    : stringOut;
}
function openCamposDinamicosForm() {
    var arrayNewDynamicField = extractDataFormulario('array');
    var htmlBox =   '<table class="tableInfo tableZebra" style="font-size: 10pt;width: 100%;">'+
                    '   <thead>'+
                    '        <tr>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\u00E2mico</th>'+
                    '            <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'+
                    '        </tr>'+
                    '   </thead>'+
                    '   <tbody>';
    arrayNewDynamicField.map(function(v, i){
        htmlBox +=  '       <tr>'+
                    '          <td><span style="font-weight: bold;background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">#'+v.name+'</span></td>'+
                    '          <td><span style="background: #e4e4e4; padding: 2px 5px; border-radius: 5px;">'+v.value+'</span></td>'+
                    '       </tr>';
                    '   </tbody>';
    });
    htmlBox += '</table>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+htmlBox+'</div>')
        .dialog({
            title: "Adicionar campos din\u00E2micos",
        	width: 600,
        	buttons: [{
                text: "Adicionar",
                click: function() { 
                    var stringNewDynamicField = extractDataFormulario('string');
                    var txaObservacoes = (typeof dadosProcessoPro.propProcesso.txaObservacoes !== 'undefined') ? jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='"+unidade+"'].observacao | [0]") : null;
                    var txtObsDynamicField = (txaObservacoes !== null) ? stringNewDynamicField+txaObservacoes : txtObsDynamicField;
                    console.log(txtObsDynamicField);
                    if (txtObsDynamicField && txtObsDynamicField != '') {
                        updateDadosProcesso('txaObservacoes', txtObsDynamicField, function(){
                            alertaBoxPro('Sucess', 'check-circle', 'Campos din\u00E2micos adicionados com sucesso!');
                        });
                    }
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
    });
}

function editDadosArvorePro(this_, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined' && typeof URL_SPRO !== 'undefined') { 
        editDadosArvorePro_(this_);
    } else {
        if (TimeOut == 9000) $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
        setTimeout(function(){ 
            editDadosArvorePro(this_, TimeOut - 100); 
            console.log('Reload editDadosArvorePro'); 
        }, 500);
    }
}
function editDadosArvorePro_(this_) {
    var _this = $(this_);
    var data = _this.data();
    var prop = dadosProcessoPro.propProcesso;
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;

    if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");

    if (data.mode == 'descricao') {
        var textTitle = 'Editar especifica\u00E7\u00E3o do processo';
        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <input maxlength="100" value="'+prop.txtDescricao+'" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="dialogBoxProcesso" type="text" style="font-size: 10pt; width: 100%;">'+
                        '</div>';
    } else if (data.mode == 'tipo_procedimento') {
        var textTitle = 'Editar tipo de procedimento';
        var optionsSelect = $.map(prop.selTipoProcedimento_select, function(v){ 
                var selected = (typeof prop.selTipoProcedimento !== 'undefined' && prop.selTipoProcedimento == v.id) ? 'selected' : '';
                return '<option value="'+v.id+'" '+selected+'>'+v.name+'</option>';
            }).join('');
        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <select id="dialogBoxProcesso" style="font-size: 10pt; width: 100%;">'+optionsSelect+'</select>'+
                        '</div>';
    } else if (data.mode == 'nivel_acesso') {
        var textTitle = 'Editar n\u00EDvel de acesso';
        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <select id="dialogBoxProcesso" onchange="changeSelectHipoteseLegal(this)" style="font-size: 10pt; width: 100%;">'+
                        '       <option value="0" '+(prop.rdoNivelAcesso == '0' ? 'selected' : '')+'>P\u00FAblico</option>'+
                        '       <option value="1" '+(prop.rdoNivelAcesso == '1' ? 'selected' : '')+'>Restrito</option>'+
                        '       <option value="2" '+(prop.rdoNivelAcesso == '2' ? 'selected' : '')+'>Sigiloso</option>'+
                        '   </select>'+
                        '   <div style=" margin-top:20px">'+
                        '       <select id="dialogBoxProcesso_hipoteses" class="select_hipoteses" style="font-size: 10pt; width: 100%; margin-top:20px;'+((prop.rdoNivelAcesso == '1' || prop.rdoNivelAcesso == '1') ? 'display:block;' : 'display:none;')+'">'+
                        '       </select>'+
                        '   </div>'+
                        '</div>';
    } else if (data.mode == 'responsaveis') {
        var textTitle = 'Editar atribui\u00E7\u00E3o de processo';
        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <select id="dialogBoxProcesso" style="font-size: 10pt; width: 100%;">'+
                        '       <option value="0">Carregando lista...</option>'+
                        '   </select>'+
                        '</div>';
    } else if (data.mode == 'marcador') {
        var textTitle = 'Editar marcador';
        var listMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
        var dataMarcador = (id_procedimento && listMarcadores) ? jmespath.search(listMarcadores, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : null;
            dataMarcador = (dataMarcador !== null) ? dataMarcador : false;

        var htmlDatePrazo = '';
        var checkPrazo = false;
        var datePrazoDue = false;
        var dateRef = moment().format('YYYY-MM-DD');
        var timeRef = '23:59';
        var tagName = false;
        
        if (dataMarcador) {
            var textTag = dataMarcador.name;
                tagName = dataMarcador.tag;
            
            var time = (textTag) ? textTag.match(/(\d{1,2}:\d{2})/img) : null;
                time = (time !== null) ? ' '+time[0] : '';
            var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
            var checkDateDue = (textTag) ? regexDue.exec(removeAcentos(textTag.trim()).toLowerCase().replaceAll('  ',' ')) : null;
                datePrazoDue = (checkDateDue !== null) ? moment(checkDateDue[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : false;

            var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
            var checkDate = (textTag) ? regex.exec(removeAcentos(textTag.trim())) : null;
                datePrazo = (checkDateDue === null && checkDate !== null) ? moment(checkDate[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
                checkPrazo = (datePrazoDue || datePrazo) ? true : false;
            
                htmlDatePrazo = (datePrazo) ? getDatesPreview({date: datePrazo}) : false;
                htmlDatePrazo = (datePrazoDue) ? getDatesPreview({date: datePrazoDue}) : htmlDatePrazo;
                htmlDatePrazo = (htmlDatePrazo) ? $('<div>'+htmlDatePrazo+'</div>').find('.dateboxDisplay').html(): htmlDatePrazo;
                dateRef = (checkPrazo) ? moment(checkDate[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD') : dateRef;
                timeRef = (checkPrazo) ? moment(checkDate[0]+time, 'DD/MM/YYYY HH:mm').format('HH:mm') : timeRef;
                textTag = (checkPrazo) ? textTag.replace(checkDate[0]+time, '').replace('Ate ', '').replace(/\\r\\n/g, '').trim() : textTag;
                textTag = (!textTag) ? '' : textTag;
        }

        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <table style="font-size: 10pt;width: 100%;">'+
                        '      <tr style="height: 40px;">'+
                        '          <td style="vertical-align: bottom;min-width: 200px;">'+
                        '               <i class="iconPopup iconSwitch far fa-clock '+(checkPrazo ? 'azulColor' : 'cinzaColor')+'"></i> '+
                        '               Controlar Prazo?'+
                        '          </td>'+
                        '          <td>'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="configDatesSwitchChangePrazo(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_setdate" data-type="setdate" tabindex="0" '+(checkPrazo ? 'checked' : '')+'>'+
                        '                  <label class="onoffswitch-label" for="configDatesBox_setdate"></label>'+
                        '              </div>'+
                        '          </td>'+
                        '      </tr>'+
                        '      <tr style="height: 40px;'+(checkPrazo ? '' : 'display:none')+'" class="configDates_setdate">'+
                        '          <td style="vertical-align: bottom;">'+
                        '               <i class="iconPopup iconSwitch fas fa-calendar-alt '+(datePrazoDue ? 'azulColor' : 'cinzaColor')+'"></i> '+
                        '               Controlar vencimento?'+
                        '          </td>'+
                        '          <td>'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="configDatesSwitchChangeHome(this)" name="onoffswitch" class="onoffswitch-checkbox" id="configDatesBox_duesetdate" data-type="duesetdate" tabindex="0" '+(datePrazoDue ? 'checked' : '')+'>'+
                        '                  <label class="onoffswitch-label" for="configDatesBox_duesetdate"></label>'+
                        '              </div>'+
                        '          </td>'+
                        '      </tr>'+
                        '      <tr style="height: 40px;'+(checkPrazo ? '' : 'display:none')+'" class="configDates_duesetdate">'+
                        '          <td class="label" style="vertical-align: bottom;">'+
                        '               <i class="iconPopup '+(datePrazoDue ? 'fas fa-clock' : 'far fa-clock')+' azulColor"></i> <span>'+(datePrazoDue ? 'Data de vencimento' : 'Data inicial')+'</span>'+
                        '          </td>'+
                        '          <td class="input" style="position:relative">'+
                        '               <span class="newLink_active" style="margin: 0px;padding: 5px 8px;border-radius: 5px;position: absolute;top: 10px;'+(datePrazoDue ? 'display:block;' : 'display:none;')+'">At\u00E9</span>'+
                        '               <input type="date" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="configDatesBox_date" value="'+dateRef+'" style="width:130px; margin-left: 50px !important;">'+
                        '               <input type="time" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="configDatesBox_time" value="'+timeRef+'" style="width:80px; float: right;">'+ 
                        '           </td>'+
                        '      </tr>'+
                        '      <tr style="height: 40px;">'+
                        '          <td class="label" style="vertical-align: bottom;">'+
                        '               <i class="iconPopup fas fa-tags azulColor"></i> <span>Marcador</span>'+
                        '          </td>'+
                        '          <td>'+
                        '               <select id="configDatesBox_tag" style="width:310px; float: right;">'+
                        '               </select>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr style="height: 40px;">'+
                        '          <td class="label" style="vertical-align: bottom;">'+
                        '               <i class="iconPopup fas fa-comment-alt azulColor"></i> <span>Texto</span>'+
                        '          </td>'+
                        '          <td>'+
                        '               <input type="text" id="configDatesBox_text" style="width:294px; float: right;" value="'+textTag+'">'+
                        '           </td>'+
                        '      </tr>'+
                        '   </table>'+
                        '</div>';
    }

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
            width: (data.mode == 'marcador' ? 570 : 450),
            title: textTitle,
        	open: function(){
                if ($('#dialogBoxProcesso').is('select') && typeof $().chosen !== 'undefined') {
                    $('#dialogBoxProcesso').chosen({
                        placeholder_text_single: ' ',
                        no_results_text: 'Nenhum resultado encontrado'
                    });
                }
                if (data.mode == 'nivel_acesso' && (prop.rdoNivelAcesso == '1' || prop.rdoNivelAcesso == '2')) {
                    getSelectHipoteseLegal($('#dialogBoxProcesso_hipoteses'), prop.rdoNivelAcesso);
                } else if (data.mode == 'responsaveis') {
                    getSelectAtribuicaoProcesso(function(html_result){
                        var elementSelect = $('#dialogBoxProcesso');
                        var select_result = $.map(html_result, function(v, i){
                            var username = (v.name.indexOf('-') !== -1) ? v.name.split('-')[0].trim() : false;
                            var data_text = (data.text.indexOf('para') !== -1) ? data.text.split('para')[1].trim() : false;
                                data_text = (data_text && data_text.indexOf(')') !== -1) ? data_text.split(')')[0].trim() : data_text;
                            var selected = (username && data_text == username) ? 'selected' : '';
                            return '<option value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                        }).join('');

                        elementSelect.html('<option value="">&nbsp;</option>'+select_result);
                        elementSelect.chosen('destroy').chosen({
                            placeholder_text_single: ' ',
                            no_results_text: 'Nenhum resultado encontrado'
                        }).trigger('chosen:updated');
                    });
                } else if (data.mode == 'marcador') {
                    var listaMarcadores = getOptionsPro('listaMarcadores');
                    var listaMarcadores_unidade = getOptionsPro('listaMarcadores_unidade');
                    if (listaMarcadores && listaMarcadores_unidade == $('#selInfraUnidades').val()) {
                        var htmlOptions = $.map(listaMarcadores, function(v){
                                            var selected = (tagName && tagName == v.name) ? 'selected' : '';
                                            return '<option data-img-src="'+v.img+'" value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                                        }).join('');
                        $('#configDatesBox_tag').html(htmlOptions).chosenImage();
                    } else {
                        var ifrArvore = $('#ifrArvore');
                        var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
                            arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
                        var href = jmespath.search(arrayLinksArvore, "[?name=='Gerenciar Marcador'].url");
                        if (href !== null) {
                            $.ajax({ 
                                url: href
                            }).done(function (html) {
                                var $html = $(html);
                                    listaMarcadores = getListaMarcadores($html).array;
                                var htmlOptions = $.map(listaMarcadores, function(v){
                                                    var selected = (tagName && tagName == v.name) ? 'selected' : '';
                                                    return '<option data-img-src="'+v.img+'" value="'+v.value+'" '+selected+'>'+v.name+'</option>';
                                                }).join('');
                                $('#configDatesBox_tag').html(htmlOptions).chosenImage();
                            });
                        }
                    }
                }
            },
            buttons: [{
                text: "Editar",
                class: 'confirm ui-state-active',
                click: function() {
                    loadingButtonConfirm(true);
                    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
                        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
                        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
                    
                    if (data.mode == 'descricao') {
                        var new_text = $('#dialogBoxProcesso').val().trim();
                        updateDadosArvore('Consultar/Alterar Processo', 'txtDescricao', new_text, id_procedimento, function(){ 
                            dadosProcessoPro.propProcesso.txtDescricao = new_text;
                            setSessionProcessosPro(dadosProcessoPro);
                            resetDialogBoxPro('dialogBoxPro');
                            alertaBoxPro('Sucess', 'check-circle', 'Especifica\u00E7\u00E3o do processo alterada com sucesso!');
                        });
                    } else if (data.mode == 'tipo_procedimento') {
                        var new_id = $('#dialogBoxProcesso').val().trim();
                        var new_text = $('#dialogBoxProcesso').find('option:selected').text().trim();
                        updateDadosArvore('Consultar/Alterar Processo', 'selTipoProcedimento', new_id, id_procedimento, function(){ 
                            dadosProcessoPro.propProcesso.selTipoProcedimento = new_id;
                            dadosProcessoPro.propProcesso.hdnIdTipoProcedimento = new_id;
                            dadosProcessoPro.propProcesso.hdnNomeTipoProcedimento = new_text;
                            setSessionProcessosPro(dadosProcessoPro);
                            resetDialogBoxPro('dialogBoxPro');
                            alertaBoxPro('Sucess', 'check-circle', 'Tipo de procedimento alterado com sucesso!');
                        });
                    } else if (data.mode == 'nivel_acesso') {
                        var new_id = $('#dialogBoxProcesso').val().trim();
                        var new_id_hipoteses = $('#dialogBoxProcesso_hipoteses').val() !== null ? $('#dialogBoxProcesso_hipoteses').val().trim() : false;
                        var elementOption = (new_id == '0') ? 'optPublico' : false;
                            elementOption = (new_id == '2') ? 'optSigiloso' : elementOption;
                            elementOption = (new_id == '1') ? 'optRestrito' : elementOption;
                        updateDadosArvore('Consultar/Alterar Processo', elementOption, new_id_hipoteses, id_procedimento, function(){ 
                            dadosProcessoPro.propProcesso.rdoNivelAcesso = new_id;
                            dadosProcessoPro.propProcesso.selHipoteseLegal = new_id_hipoteses;
                            setSessionProcessosPro(dadosProcessoPro);
                            resetDialogBoxPro('dialogBoxPro');
                            alertaBoxPro('Sucess', 'check-circle', 'N\u00EDvel de sigilo alterado com sucesso!');
                        });
                    } else if (data.mode == 'responsaveis') {
                        var new_id = $('#dialogBoxProcesso').val().trim();
                        console.log('Atribuir Processo', 'selAtribuicao', new_id, id_procedimento);
                        updateDadosArvore('Atribuir Processo', 'selAtribuicao', new_id, id_procedimento, function(){ 
                            resetDialogBoxPro('dialogBoxPro');
                            alertaBoxPro('Sucess', 'check-circle', 'Atribui\u00E7\u00E3o de processo alterada com sucesso!');
                        });
                    } else if (data.mode == 'marcador') {
                        var _dateRef = $('#configDatesBox_date').val();
                        var _timeRef = $('#configDatesBox_time').val();
                        var _tagSelected = $('#configDatesBox_tag').val();
                        var _textTag = $('#configDatesBox_text').val();
                            _textTag = (_textTag != '') ? '\n'+_textTag : '';
                            _dateRef = _dateRef+' '+(_timeRef != '' ? _timeRef : '23:59');
                        var _dateTo = ($('#configDatesBox_duesetdate').is(':checked')) ? _dateRef : false;
                        var dateSubmit = (_dateTo) ? 'Ate '+moment(_dateTo, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm') : moment(_dateRef, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm');
                            dateSubmit = ($('#configDatesBox_setdate').is(':checked')) ? dateSubmit+_textTag : _textTag;
                        if (_dateRef == '') {
                            alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma data!');
                        } else {
                            var valuesIframe = [
                                {element: 'txaTexto', value: dateSubmit},
                                {element: 'hdnIdMarcador', value: _tagSelected}
                            ];
                            updateDadosArvoreMult('Gerenciar Marcador', valuesIframe, id_procedimento, function(){ 
                                var listMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
                                var objIndexDoc = (!listMarcadores) ? -1 : listMarcadores.findIndex((obj => obj.id_procedimento == String(id_procedimento)));
                                if (objIndexDoc !== -1) {
                                    listMarcadores[objIndexDoc] = {
                                        id_procedimento: listMarcadores[objIndexDoc].id_procedimento,
                                        icon: $('#configDatesBox_tag').find('option:selected').data('img-src'),
                                        tag: $('#configDatesBox_tag').find('option:selected').text(),
                                        name: dateSubmit
                                    }
                                    sessionStorageStorePro('dadosMarcadoresProcessoPro',listMarcadores);
                                }
                                // console.log(listMarcadores[objIndexDoc]);
                                resetDialogBoxPro('dialogBoxPro');
                                alertaBoxPro('Sucess', 'check-circle', 'Marcador alterado com sucesso!');
                            });
                        }
                    }
                }
            }]
    });
}
function getSelectAtribuicaoProcesso(callback = false) {
    var ifrArvore = $('#ifrArvore');
    var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
        arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
    var href = jmespath.search(arrayLinksArvore, "[?name=='Atribuir Processo'].url");
    if (href !== null) {
        $.ajax({ url: href }).done(function (html) {
            var $html = $(html);
            var selectAtribuicao = $html.find('#selAtribuicao option').map(function(){ if($(this).text().trim() != '') { return {name: $(this).text().trim(), value: $(this).val()} } }).get();
            if (selectAtribuicao.length && typeof callback === 'function') {
                callback(selectAtribuicao);
            }
        });
    }
}
function getLinhaNumerada() {
    var _ifrArvoreHtml = $('#ifrVisualizacao').contents().find('#ifrArvoreHtml');
    if (_ifrArvoreHtml.length && verifyConfigValue('linhanumerada')) {
        var ifrArvoreHtml = _ifrArvoreHtml.contents();
        ifrArvoreHtml.find('p').filter(function(){ return $(this).text().trim() != '' }).addClass('linhaNumerada');
    }
}
/*
function getLinksArvorePasta(nomePasta) {
    var ifrArvore = $('#ifrArvore');
    var ifrArvoreForm = ifrArvore.contents();
    var arrayLinksArvoreAll = ifrArvore[0].contentWindow.arrayLinksArvoreAll;
    var href = (nomePasta) ? arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('procedimento_paginar') !== -1 && v.indexOf('no_pai='+nomePasta) !== -1) }) : [];
    console.log(nomePasta, href, {
        hdnArvore: ifrArvoreForm.find('#hdnArvore').val(),
        hdnPastaAtual: ifrArvoreForm.find('#hdnPastaAtual').val(),
        hdnProtocolos: ifrArvoreForm.find('#hdnProtocolos').val(),
    });
    
    if (href.length > 0) {
        $.ajax({ 
            method: 'POST',
            url: href[0],
            data: {
                hdnArvore: ifrArvoreForm.find('#hdnArvore').val(),
                hdnPastaAtual: ifrArvoreForm.find('#hdnPastaAtual').val(),
                hdnProtocolos: ifrArvoreForm.find('#hdnProtocolos').val(),
            }
        }).done(function (html) {
            // var $html = $('<script>'+html+'</script>');
            // console.log(getLinksInText($html.text()));
            var newLinks = getLinksInText(html);
                $.merge(newLinks, arrayLinksArvoreAll);
                newLinks = uniqPro(newLinks);
                ifrArvore[0].contentWindow.arrayLinksArvoreAll = newLinks;
                console.log(newLinks);
        });
    }
}
*/
function getLinksInText(text) {
    var array = [];
    text.split("'").filter(function(el) { return el.indexOf('controlador.php') !== -1 }).map(function(v){
        if (v.indexOf('\"') !== -1) {
            v.split('"').filter(function(i){ return i.indexOf('controlador.php') !== -1}).map(function(j){
                var link = j.replace(/[\\"]/g, '');
                array.push(link);
            });
            return false;
        } else {
            var link = v.replace(/[\\"]/g, '');
            array.push(link);
            return false;
        }
    });
    array = (array.length > 0) 
        ?   array.sort().filter(function(item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }) 
        : [];
    return array;
}
function changeSelectHipoteseLegal(this_) {
    if ($(this_).val() == '1' || $(this_).val() == '2') {
        getSelectHipoteseLegal($('.select_hipoteses'), $(this_).val());
    } else {
        $('.select_hipoteses').html('').chosen('destroy').hide();
    }
}
function getSelectHipoteseLegal(elementHipotese = $('#dialogBoxProcesso_hipoteses'), nivelAcesso = 1) {
    getHipoteseLegal(dadosProcessoPro.propProcesso.urlHipoteseLegal, nivelAcesso, function(html_result){
        elementHipotese.show().html(html_result);
        if (dadosProcessoPro.propProcesso.selHipoteseLegal) {
            elementHipotese.val(dadosProcessoPro.propProcesso.selHipoteseLegal);
        }
        elementHipotese.chosen('destroy').chosen({
            placeholder_text_single: ' ',
            no_results_text: 'Nenhum resultado encontrado'
        }).trigger('chosen:updated');
    });
}
function updateDadosArvore(nameLink, idElement, value, idProcedimento, callback = false) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' && idProcedimento !== null && idProcedimento != 0 ) {
        if ($('#ifrArvore').length == 0) {
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
            $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
                var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
                updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback);
            });
        } else {
            var ifrArvore = $('#ifrArvore');
            updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback);
        }
    } else {
        return false;
    }
}
function updateDadosArvoreIframe(nameLink, idElement, value, ifrArvore, callback) {
    var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
        arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = jmespath.search(arrayLinksArvore, "[?name=='"+nameLink+"'].url");
    if (typeof url !== 'undefined' && url != '') {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();
            var element = iframe.find('#'+idElement);
            if (element.is('select') && !hasNumber(value)) {
                element.find('option:contains("'+value+'")').prop('selected',true);
            } else {
                if (element.is(':radio') || element.is(':checkbox')) {
                    element.prop('checked',true).trigger('change');
                    if (idElement == 'optRestrito' || idElement == 'optSigiloso') {
                        iframe.find('#selHipoteseLegal').after('<input id="selHipoteseLegal" value="'+value+'" name="selHipoteseLegal"></input>').remove();
                    }
                } else {
                    element.val(value);
                    var nameElement = (idElement.indexOf('sel') !== -1) ? idElement.replace('sel','') : false;
                    if ( nameElement && iframe.find('#hdnId'+nameElement).length > 0 ) {
                        iframe.find('#hdnId'+nameElement).val(value);
                    }
                }
            }
            
            $(this).unbind();
            if (iframe.find('button[type="submit"]').length > 0) {
                iframe.find('button[type="submit"]').trigger('click');
            } else {
                iframe.find('button[name="btnSalvar"]').trigger('click');
            }

            // console.log(arrayLinksArvore, url,  nameLink, idElement, value);
            if (typeof callback === 'function') callback();
        });
    } else {
        return false;
    }
    
}
function updateDadosArvoreMult(nameLink, values, idProcedimento, callback = false) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' && idProcedimento !== null && idProcedimento != 0 ) {
        if ($('#ifrArvore').length == 0) {
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
            $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
                var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore');
                updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback);
            });
        } else {
            var ifrArvore = $('#ifrArvore');
            updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback);
        }
    } else {
        return false;
    }
}
function updateDadosArvoreMultIframe(nameLink, values, ifrArvore, callback) {
    var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
        arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    var url = jmespath.search(arrayLinksArvore, "[?name=='"+nameLink+"'].url");
    if (typeof url !== 'undefined' && url != '') {
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();

            function setValuesFrame(idElement, value) {
                var element = iframe.find('#'+idElement);
                if (element.is('select') && !hasNumber(value)) {
                    element.find('option:contains("'+value+'")').prop('selected',true);
                } else {
                    if (element.is(':radio') || element.is(':checkbox')) {
                        element.prop('checked',true).trigger('change');
                        if (idElement == 'optRestrito' || idElement == 'optSigiloso') {
                            iframe.find('#selHipoteseLegal').after('<input id="selHipoteseLegal" value="'+value+'" name="selHipoteseLegal"></input>').remove();
                        }
                    } else {
                        element.val(value);
                        var nameElement = (idElement.indexOf('sel') !== -1) ? idElement.replace('sel','') : false;
                        if ( nameElement && iframe.find('#hdnId'+nameElement).length > 0 ) {
                            iframe.find('#hdnId'+nameElement).val(value);
                        }
                    }
                }
            }

            $.each(values, function(i, v){
                setValuesFrame(v.element, v.value);
            });
            
            $(this).unbind();
            if (iframe.find('button[type="submit"]').length > 0) {
                iframe.find('button[type="submit"]').trigger('click');
            } else {
                iframe.find('button[name="btnSalvar"]').trigger('click');
            }
            if (typeof callback === 'function') callback();
        });
    } else {
        return false;
    }
}
function automaticActions(type, mode, value = false, callback = false) {
    var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    if (type == 'anotacao' && mode == 'remove') {
        updateDadosArvore('Anota\u00E7\u00F5es', 'txaDescricao', '', id_procedimento, callback);
    } else if (type == 'atribuicao' && mode == 'remove') {
        updateDadosArvore('Atribuir Processo', 'selAtribuicao', 'null', id_procedimento, callback);
    } else if (type == 'urgencia_processo') {
        updateDadosArvore('Atualizar Andamento', 'txaDescricao', (mode == 'remove' ? 'Removida' : 'Adicionada')+' marca de urg\u00EAncia no processo', id_procedimento, callback);
    } else if (type == 'urgencia_documento') {
        console.log(type, mode, value);
        updateDadosArvore('Atualizar Andamento', 'txaDescricao', (mode == 'remove' ? 'Removida' : 'Adicionada')+' marca de urg\u00EAncia no documento '+value, id_procedimento, callback);
    } else if (type == 'marcador' && mode == 'remove') {
        updateDadosArvore('Gerenciar Marcador', 'hdnIdMarcador', '', id_procedimento, callback);
    }
}
function getActionsOnSendProcess() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    ifrVisualizacao.find('#frmAtividadeListar').on('submit', function() {
        var _this = $(this);
        var _parent = _this.closest('body');
        var checkMarcador = _parent.find('#chkSinRemoverMarcadores').is(':checked');
        var checkAtribuicao = _parent.find('#chkSinRemoverAtribuicao').is(':checked');

        var sendAutomaticActions = [];
            sendAutomaticActions[0] = {name: 'marcador', method: 'remove', send: checkMarcador, value: false, run: false, index: 0};
            sendAutomaticActions[1] = {name: 'atribuicao', method: 'remove', send: checkAtribuicao, value: false, run: false, index: 1};
            parent.window.sendAutomaticActions = sendAutomaticActions;
            getAutomaticActions();
    });
    htmlBoxActions =    '<span id="divSinRemoveAttributes" style="margin: 0 10px;display: inline-block;">'+
                        '   <span style="margin: 0 10px;display: inline-block;">'+
                        '      <input type="checkbox" id="chkSinRemoverMarcadores" name="chkSinRemoverMarcadores" class="infraCheckbox" tabindex="0">'+
                        '     <label id="lblSinRemoverMarcadores" for="chkSinRemoverMarcadores" accesskey="" class="infraLabelCheckbox">Remover marcadores</label>'+
                        '   </span>'+
                        '   <span style="margin: 0 10px;display: inline-block;">'+
                        '      <input type="checkbox" id="chkSinRemoverAtribuicao" name="chkSinRemoverAtribuicao" class="infraCheckbox" tabindex="0">'+
                        '     <label id="lblSinRemoverAtribuicao" for="chkSinRemoverAtribuicao" accesskey="" class="infraLabelCheckbox">Remover atribui\u00E7\u00E3o</label>'+
                        '   </span>'
                        '</span>';
    ifrVisualizacao.find('#divSinRemoveAttributes').remove();
    ifrVisualizacao.find('#divSinRemoverAnotacoes').append(htmlBoxActions);

    if (checkConfigValue('naoassinados') && $('div.ui-dialog[aria-describedby="dialogBoxPro"]').length == 0) {
        initCheckNaoAssinados();
    }
}
function getAutomaticActions() {
    var arrayAutomatic = parent.window.sendAutomaticActions;
    if (typeof arrayAutomatic !== 'undefined' && arrayAutomatic !== null && arrayAutomatic.length > 0) {
        var nextRun = jmespath.search(arrayAutomatic, "[?run==`false`] | [0]");
            nextRun = (nextRun !== null) ? nextRun : false;
            if (nextRun) {
                if (nextRun.send) {
                    automaticActions(nextRun.name, nextRun.method, nextRun.value, function(){
                        parent.window.sendAutomaticActions[nextRun.index].run = true;
                        setTimeout(function(){ 
                            // console.log(nextRun);
                            getAutomaticActions();
                        }, 1000);
                    });
                }
            } else {
                parent.window.sendAutomaticActions === undefined;
            }
    }
}
// INICIA O REDIMENSIONAMENTO AUTOMATICO DE IMAGENS NO VISUALIZADOR DE DOCUMENTOS
function initDocImagemPro() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents(); // seleciona o conteudo do iframe de visualizacao de documentos
    var ifrArvore = $('#ifrArvore').contents(); // seleciona o conteudo do iframe de arvore do processo

    var docSelected = ifrArvore.find('.infraArvoreNoSelecionado'); // seleciona o documento ativo na arvore
    var protocoloSelected = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento; // seleciona o protocolo do documento ativo na arvore e extrai o seu id de documento
    if (typeof protocoloSelected !== 'undefined') { // checa se o documento ativo possui um id de documento valido
        var iconSelected = ifrArvore.find('#anchorImg'+protocoloSelected).find('img').attr('src'); // encontra o icone do documento ativo na arvore correspondente ao id de documento
        if (iconSelected.indexOf('imagem') !== -1) { // checa se o icone do documento ativo na arvore é do tipo imagem
            checkDocImagemPro(ifrVisualizacao); // aciona a funcao de redimensionar a imagem no visualizador de documentos
        }
    }
}
function initCheckNaoAssinados() {
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
    var urlAllPasta = ifrArvore.find('#topmenu a[id*="anchorAP"]').attr('href');
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
        ifrVisualizacao.find('#checkNaoAssinados').remove();
    var htmlLoading =   '<div id="checkNaoAssinados" class="loadingNaoAssinados" style="font-size: 10pt;display: inline;color: #444;margin: 0 20px;">'+
                        '   <i class="fas fa-sync fa-spin" style="color:#444;margin-right: 5px;"></i> Verificando documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+unidade+'</strong>'+
                        '   </div>';
    var htmlSucess =    '<div id="checkNaoAssinados" style="font-size: 10pt;display: inline;color: #444;margin: 0 20px;padding: 5px;background: #fff1f0;border-radius: 5px;">'+
                        '   <i class="fas fa-times-circle vermelhoColor" style="margin-right: 5px;"></i> Existem documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+unidade+'</strong>'+
                        '   <a class="newLink" onclick="parent.openCheckNaoAssinados()" style="margin: 0 10px;font-size: 1em;">Detalhes</a>'+
                        '</div>';
    var htmlEmpty =     '<div id="checkNaoAssinados" style="font-size: 10pt;display: inline;color: #444;margin: 0 20px;padding: 5px;border-radius: 5px;">'+
                        '   <i class="fas fa-check-circle verdeColor" style="margin-right: 5px;"></i> Todos os documentos foram assinados na unidade <strong style="text-decoration: underline;">'+unidade+'</strong>'+
                        '</div>';
    var htmlNull =      '<div id="checkNaoAssinados" style="font-size: 10pt;display: inline;color: #444;margin: 0 20px;padding: 5px;border-radius: 5px;">'+
                        '   <i class="fas fa-exclamation-triangle laranjaColor" style="margin-right: 5px;"></i> N\u00E3o foi poss\u00EDvel verificar a exist\u00EAncia de documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+unidade+'</strong>'+
                        '   <a class="newLink" onclick="parent.initCheckNaoAssinados()" style="margin: 0 10px;font-size: 1em;">Tentar novamente</a>'+
                        '</div>';    

    var htmlCheckNaoAssinados = htmlLoading;

        ifrVisualizacao.find('#divInfraBarraLocalizacao').append(htmlCheckNaoAssinados);
        mergeAllAndamentosProcesso(function(){
            var dadosProcesso = getDadosProcessoSession();
            var listDocumentos = (dadosProcesso) ? dadosProcesso.listDocumentos : dadosProcessoPro.listDocumentos;
            if (typeof listDocumentos !== 'undefined' && listDocumentos.length > 0 && checkObjHasProperty(listDocumentos, 'unidade')) {
                var listNaoAssinado = jmespath.search(listDocumentos, "[?assinado==`false`] | [?unidade=='"+unidade+"'] | [?nativo]");
                if (listNaoAssinado.length == 0) {
                    htmlCheckNaoAssinados = htmlEmpty;
                } else if (listNaoAssinado.length > 0) {
                    htmlCheckNaoAssinados = htmlSucess;
                    openCheckNaoAssinados();
                } else if (listNaoAssinado == null) {
                    htmlCheckNaoAssinados = htmlNull;    
                }
                ifrVisualizacao.find('#checkNaoAssinados').remove();
                ifrVisualizacao.find('#divInfraBarraLocalizacao').append(htmlCheckNaoAssinados);

                if (listNaoAssinado.length == 0) {
                    ifrVisualizacao.find('#txtUnidade').focus();
                }
                // console.log(listNaoAssinado, listDocumentos);
            } else if (typeof listDocumentos !== 'undefined' && typeof urlAllPasta !== 'undefined' && urlAllPasta !== '') {
                _ifrArvore.attr('src', urlAllPasta).unbind().on('load', function(){
                    $(this).unbind();
                    getListDocumentosArvore(ifrArvore);
                    initCheckNaoAssinados();
                });
            }
            // console.log('listNaoAssinado',listNaoAssinado, listDocumentos);
        });
        setTimeout(function(){
            if (ifrVisualizacao.find('#checkNaoAssinados').hasClass('loadingNaoAssinados')) {
                htmlCheckNaoAssinados = htmlNull;
                ifrVisualizacao.find('#checkNaoAssinados').remove();
                ifrVisualizacao.find('#divInfraBarraLocalizacao').append(htmlCheckNaoAssinados);   
                if (getDadosProcessoSession()) {
                    dadosProcessoPro = getDadosProcessoSession();
                }
            }
        }, 12000);
}
function openCheckNaoAssinados() {
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
    var urlAllPasta = ifrArvore.find('#topmenu a[id*="anchorAP"]').attr('href');
    if (typeof urlAllPasta !== 'undefined' && urlAllPasta !== '') {
        _ifrArvore.attr('src', urlAllPasta).unbind().on('load', function(){
            $(this).unbind();
            boxCheckNaoAssinados();
        });
    } else {
        boxCheckNaoAssinados();
    }
}
function boxCheckNaoAssinados() {
    var listNaoAssinado = jmespath.search(dadosProcessoPro.listDocumentos, "[?assinado==`false`] | [?unidade=='"+unidade+"'] | [?nativo]");
    var htmlBox =   '<div style="font-size: 10pt;display: inline;color: #444;margin: 0 20px;padding: 5px;background: #fff1f0;border-radius: 5px;">'+
                    '   <i class="fas fa-times-circle vermelhoColor" style="margin-right: 5px;"></i> Existem documentos n\u00E3o assinados na unidade <strong style="text-decoration: underline;">'+unidade+'</strong>'+
                    '</div>'+
                    '<div style="max-height: 280px;overflow-y: scroll;">';
        $.each(listNaoAssinado, function(index, value) {
            htmlBox +=    '<div style="margin: 8px">'+
                            '   <a class="newLink" onclick="getDocOnArvore('+value.id_protocolo+')" style="font-size: 10pt;"><i class="far fa-file azulColor" style="margin-right: 5px;"></i>'+value.documento+' ('+value.nr_sei+')</a>'+
                            '   <span style="float: right;font-size: 10pt;">'+(value.data_documento && value.data_documento !== '' ? getDatesPreview({date: value.data_documento}) : '')+'</span>'+
                            '</div>';
        });
        htmlBox += '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Documentos pendentes de assinatura',
            width: 700,
            open: function() { 
                var ifrArvore = $('#ifrArvore');
                var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
                    arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
                var href = jmespath.search(arrayLinksArvore, "[?name=='Enviar Processo'].url");
                if (href !== null) {
                    setTimeout(function(){ 
                        document.getElementById('ifrVisualizacao').setAttribute("src",href[0]);
                    }, 500);
                }
            },
            close: function() { 
                $('#dialogBoxDiv').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
}
function getDocOnArvore(id_documento) {
    var _ifrArvore = $('#ifrArvore');
    var _ifrVisualizacao = $('#ifrVisualizacao');
    var ifrArvore = _ifrArvore.contents();
    
    var linkDoc = ifrArvore.find('#anchor'+id_documento);
    var urlDoc = linkDoc.attr('href');
    if (typeof urlDoc !== 'undefined') {
        _ifrVisualizacao.attr('src', urlDoc);
        linkDoc.unbind('click').trigger('click');
        scrollToElement(ifrArvore.find('#container'), linkDoc, 10);
    }
}
// VERIFICA SE A IMAGEM A SER REDIMENSIONADA FOI CARREGADA
function checkDocImagemPro(ifrVisualizacao, TimeOut = 9000) {
    var imgDoc = ifrVisualizacao.find('#ifrArvoreHtml').contents().find('img'); // localiza a imagem dentro do iframe do conteudo do documento
    if (TimeOut <= 0) { return; } // retorna se o tempo de checagem for expirado
    if (imgDoc.length > 0) {  // verifica se a imagem existe
        setTimeout(function(){ // delay para carregamento da imagem
            ifrVisualizacao.find('#ifrArvoreHtml').contents().find('img')
                .eq(0) // encontra a primeira imagem do documento
                .addClass('zoomInPro') // aplica a classe de zoom
                .css({'width': '100%', 'cursor': 'zoom-in'}) // aplica o estilo de redimensionamento total da tela e o cursor de Lupa(+)
                .attr('onclick','parent.parent.zoomImagemPro(this)'); //adiciona acao de ativar ou desativar o zoom
            console.log('initDocImagemPro');
        }, 500);
    } else { // caso nao encontrada a imagem, reinicia a funcao com o timeout decrescido
        setTimeout(function(){ 
            checkDocImagemPro(ifrVisualizacao, TimeOut - 100); 
            console.log('Reload checkDocImagemPro'); 
        }, 500);
    }
}
// ATIVA OU DESATIVA O REDIMENSIONAMENTO DA IMAGEM
function zoomImagemPro(this_) {
    var _this = $(this_); // converte a referencia em objeto jquery
    if (_this.hasClass('zoomInPro')) { // verifica se o elemento possui a classe de zoom
        _this.removeClass('zoomInPro').css({'width': '', 'cursor': 'zoom-out'}); // remove o estilo redimensionado e altera o cursor do mouse para Lupa(-)
    } else {
        _this.addClass('zoomInPro').css({'width': '100%', 'cursor': 'zoom-in'}); // adicionar o estilo redimensionado e altera o cursor do mouse para Lupa(+)
    }
}
function initDocZipPro() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var ifrArvore = $('#ifrArvore').contents();

    var docSelected = ifrArvore.find('.infraArvoreNoSelecionado');
    var protocoloSelected = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento;
    if (typeof protocoloSelected !== 'undefined') {
        var iconSelected = ifrArvore.find('#anchorImg'+protocoloSelected).find('img').attr('src');
        var linkFile = ifrVisualizacao.find(divInformacao+' a.ancoraArvoreDownload').attr('href');
        if (iconSelected.indexOf('zip') !== -1) {
            checkDocZipPro(ifrVisualizacao);
        }
    }
}
function checkDocZipPro(ifrVisualizacao, TimeOut = 9000) {
    var linkFile = ifrVisualizacao.find(divInformacao+' a.ancoraArvoreDownload').attr('href');
    if (TimeOut <= 0) { return; }
    if (typeof linkFile !== 'undefined') { 
            loadDocZipPro(linkFile, ifrVisualizacao);
            console.log('loadDocZipPro');
    } else {
        setTimeout(function(){ 
            checkDocZipPro(ifrVisualizacao, TimeOut - 100); 
            console.log('Reload checkDocZipPro'); 
        }, 500);
    }
}
function loadDocZipPro(linkFile, ifrVisualizacao) {
    var divVideo =  '<div id="divZip">'+
                    '   <div style="width:100%;margin-top: 10px;display: inline-block;clear: both;background: #505050;height: inherit;" class="explorer">'+
                    '      <div class="directories">'+
                    '          <div id="tree" class="tree"></div>'+
                    '      </div>'+
                    '      <div id="separator" draggable="false"></div>'+
                    '      <div class="files">'+
                    '          <ul id="listing" class="listing"></ul>'+
                    '      </div>'+
                    '   </div>'+
                    '</div>';
    ifrVisualizacao.find('#divZip').remove();
    ifrVisualizacao.find(divInformacao).after(divVideo);

    var urlZip = ifrVisualizacao.find('a.ancoraArvoreDownload').attr('href');

    $.getScript(parent.URL_SPRO+'js/lib/jszip.min.js', function(){
        $.getScript(parent.URL_SPRO+'js/lib/jszip-utils.min.js', function(){
            JSZipUtils.getBinaryContent(urlZip, function(err, data) {
                if(err) {
                    throw err; // or handle err
                }
                JSZip.loadAsync(data).then(function (zip) {
                    zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                        console.log(relativePath, zipEntry);
                        var name = zipEntry.name;
                        var date = moment(zipEntry.date).format('DD/MM/YYYY HH:mm:ss')
                        ifrVisualizacao.find('#divZip .files #listing').append('<li><a>'+name+'</a><span class="date">'+date+'</span></li>');
                    });
                });
            }); 
        });
    }); 
}
function getScriptIframe(iframe, src, callback = false) {
    var script = iframe.contentWindow.document.createElement('script');
        script.type = 'text/javascript';
        script.addEventListener("load", function(event) {
            if (callback) callback();
        });
        script.src = src;    
        iframe.contentWindow.document.head.appendChild(script);
}
function initDocVideoPro() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var ifrArvore = $('#ifrArvore').contents();

    var docSelected = ifrArvore.find('.infraArvoreNoSelecionado');
    var protocoloSelected = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento;
    if (typeof protocoloSelected !== 'undefined') {
        var iconSelected = ifrArvore.find('#anchorImg'+protocoloSelected).find('img').attr('src');
        var linkFile = ifrVisualizacao.find(divInformacao+' a.ancoraArvoreDownload').attr('href');
        if (iconSelected.indexOf('video') !== -1) {
            checkDocVideoPro(ifrVisualizacao);
        }
    }
}
function insertIconNewTab() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var ifrArvore = $('#ifrArvore');
    var arrayLinksArvoreAll = ifrArvore[0].contentWindow.arrayLinksArvoreAll;
    var docSelected = ifrArvore.contents().find('.infraArvoreNoSelecionado');
    var id_documento = getParamsUrlPro(docSelected.closest('a').attr('href')).id_documento;
    
    if (typeof id_documento !== 'undefined') {
        var listLinks = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf('documento_visualizar') !== -1) });
        if (listLinks.length > 0 && listLinks[0] != '') {
            var html =  '<a class="openNewTab" style="margin: 10px 5px;padding: 5px;border-radius: 5px 0 0 5px;background-color: #eaeaea;color: #666;text-decoration: none;right: 60px;position: absolute;user-select: none;" href="'+url_host.replace('controlador.php','')+listLinks[0]+'" target="_blank">'+
                        '   <i class="fas fa-external-link-square-alt" style="color:#4285f4"></i> Abrir documento em nova aba'+
                        '</a>'+
                        '<a class="openNewTab" data-id_protocolo="'+id_documento+'" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Baixar documento (HTML)\')" style="margin: 10px 5px;padding: 5px;border-radius: 0 5px 5px 0;background-color: #eaeaea;color: #666;text-decoration: none;right: 40px;position: absolute;user-select: none;" onclick="parent.downloadDocumentVisualizacao(this)" target="_blank">'+
                        '   <i class="fas fa-download" style="color:#4285f4"></i>'+
                        '</a>';

                ifrVisualizacao.find('.openNewTab').remove()
                ifrVisualizacao.find('#divArvoreAcoes').after(html);
        }
    }
}
function getNomeSei(nameDoc) {
    var documento = nameDoc.split(' ');
    var nr_sei = (nameDoc.indexOf(' ') !== -1) ? documento[documento.length-1] : '';
        documento = (documento.indexOf(nr_sei) !== -1) ? nameDoc.replace(nr_sei,'').trim() : nameDoc;
    return documento;
}
function downloadDocumentVisualizacao(this_) {
    var this_ = $(this_);
    var data = this_.data();
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var ifrArvore = $('#ifrArvore').contents();
    var ifrArvoreHtml = ifrVisualizacao.find('#ifrArvoreHtml').contents();

    var doc = ifrArvore.find('#anchor'+data.id_protocolo);
    var nameDoc = doc.text().trim();
    var nr_sei = getNrSei(nameDoc);
    var citacaoDoc = getCitacaoDoc();
    var documento = getNomeSei(nameDoc);
    var nameFile = documento+' ('+citacaoDoc+nr_sei+')';

    this_.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function() {
        this_.find('i').attr('class','fas fa-download');
    }, 1000);

    var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
        contentDocument += ifrArvoreHtml.find('html')[0].outerHTML;
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", contentDocument]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = nameFile+'.html';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
function setHtmlProtocoloAlterar() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var ifrArvore = $('#ifrArvore').contents();
    var form = ifrVisualizacao.find('#frmProcedimentoCadastro');
    var formVisualizacao = form.attr('action');
    var divProtocolo = ifrVisualizacao.find('#divProtocoloExibir');
    if (
        formVisualizacao.indexOf('controlador.php?acao=procedimento_alterar&acao_origem=procedimento_alterar&arvore=1&id_procedimento=') !== -1 &&
        form.length == 1 &&
        divProtocolo.length == 0
        ) {
        var html =      '<div id="divProtocoloExibir" class="infraAreaDados" style="height:4.5em;position:relative;width: 90%;">'+
                        '    <div style="float:left">'+
                        '    <label id="lblProtocoloExibir" for="_txtProtocoloExibir" accesskey="" class="infraLabelObrigatorio">Protocolo:</label>'+
                        '    <input type="text" id="txtProtocoloExibir" name="_txtProtocoloExibir" class="infraText infraReadOnly" readonly="readonly" value="'+ifrVisualizacao.find('#hdnProtocoloProcedimentoFormatado').val()+'">'+
                        '    </div>'+
                        '    <div style="float:right">'+
                        '       <label id="lblDtaGeracaoExibir" for="_txtDtaGeracaoExibir" accesskey="" class="infraLabelObrigatorio">Data de Autua\u00E7\u00E3o:</label>'+
                        '       <input type="text" id="txtDtaGeracaoExibir" name="txtDtaGeracaoExibir" class="infraText infraReadOnly" readonly="readonly" value="'+ifrVisualizacao.find('#hdnDtaGeracao').val()+'">'+
                        '    </div>'+
                        '</div>';
            ifrVisualizacao.find('#divInfraBarraComandosSuperior').after(html);
    }

    if (form.length > 0 && ifrVisualizacao.find('#txtDescricao').length ) {
        ifrVisualizacao.find('div.urgentePro').remove();
        ifrVisualizacao.find('#txtDescricao').css('width','86%').attr('data-oldtext',ifrVisualizacao.find('#txtDescricao').val()).after('<div class="urgentePro" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar(\'Adicionar/remover marca de Urg\u00EAncia\');" onmouseout="return infraTooltipOcultar();"></div>');
        formControlerAlterarProcesso(ifrVisualizacao);
    }
}
function formControlerAlterarProcesso(ifrVisualizacao) {
    ifrVisualizacao.find('button[name="btnSalvar"]').on('click', function() {
        var _this = $(this);
        var _parent = _this.closest('body');
        var oldText = _parent.find('#txtDescricao').attr('data-oldtext');
        var newText = _parent.find('#txtDescricao').val();
        var checkAddUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') === -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') !== -1 ) ? true : false;
        var checkRemoveUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') !== -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') === -1 ) ? true : false;
        var methodSend = checkAddUrgencia ? 'add' : false;
            methodSend = checkRemoveUrgencia ? 'remove' : methodSend;
        var checkSend = (checkAddUrgencia || checkRemoveUrgencia) ? true : false;
        if ($('#ifrVisualizacao')[0].contentWindow.OnSubmitForm()) {
            if (typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso === 'undefined' && typeof getDadosProcessoSession() !== 'undefined' && getDadosProcessoSession().propProcesso !== 'undefined' ) {
                dadosProcessoPro.propProcesso = getDadosProcessoSession().propProcesso;
            }

            if (typeof dadosProcessoPro !== 'undefined' && typeof dadosProcessoPro.propProcesso !== 'undefined' && typeof dadosProcessoPro.propProcesso.txtDescricao !== 'undefined') {
                dadosProcessoPro.propProcesso.txtDescricao = newText;
                setSessionProcessosPro(dadosProcessoPro);
            }
            
            var sendAutomaticActions = [];
            sendAutomaticActions[0] = {name: 'urgencia_processo', method: methodSend, send: checkSend, value: false, run: false, index: 0};
            parent.window.sendAutomaticActions = sendAutomaticActions;
            getAutomaticActions();
        }
    });
}
function checkDocVideoPro(ifrVisualizacao, TimeOut = 9000) {
    var linkFile = ifrVisualizacao.find(divInformacao+' a.ancoraArvoreDownload').attr('href');
    if (TimeOut <= 0) { return; }
    if (typeof linkFile !== 'undefined') { 
            loadDocVideoPro(linkFile, ifrVisualizacao);
            console.log('loadDocVideoPro');
    } else {
        setTimeout(function(){ 
            checkDocVideoPro(ifrVisualizacao, TimeOut - 100); 
            console.log('Reload checkDocVideoPro'); 
        }, 500);
    }
}
function loadDocVideoPro(linkFile, ifrVisualizacao) {
    var divVideo =  '<div style="width:100%;margin-top: 10px;display: inline-block;clear: both;background: #505050;height: inherit;" id="divVideo">'+
                    '    <video width="100%" height="100%" autoplay muted controls loop>'+
                    '        <source src="'+linkFile+'">'+
                    '        Seu navegador n\u00E3o suporta reproduzir v\u00EDdeos. Baixe o arquivo para visualiz\u00E1-lo.'+
                    '    </video>'+
                    '</div>';
    ifrVisualizacao.find('#divVideo').remove();
    ifrVisualizacao.find(divInformacao).after(divVideo);
    ifrVisualizacao.find('#divVideo video').on('loadedmetadata', function(event) {
          this.currentTime = 0;
    });
}
function updateButtonConfirm(this_, check) {
    var _this = $(this_);
    var btnConfirm = _this.closest('.ui-dialog').find('.ui-dialog-buttonset .confirm');
    if (check) { btnConfirm.addClass('ui-state-active') } else { btnConfirm.removeClass('ui-state-active') }
}
function checkLoadingButtonConfirm() {
    var btnConfirm = $('.ui-dialog:visible').find('.ui-dialog-buttonset .confirm');
    if (btnConfirm.is(':visible') && btnConfirm.hasClass('loading')) {
        return true;
    } else {
        return false;
    }
}
function loadingButtonConfirm(check) {
    var i = 0;
    // verifica qual caixa de dialogo esta na frente, caso exista mais de uma
    if ($('.ui-dialog:visible').length > 0) {
        var i_highest = 0;
        $('.ui-dialog:visible').each(function(index) { 
            var i_current = parseInt($(this).css("zIndex"), 10);
            if(i_current > i_highest) {
                i_highest = i_current;
                i = index;
            }
        });
    }
    var btnConfirm = $('.ui-dialog:visible').eq(i).find('.ui-dialog-buttonset .confirm');
    if (btnConfirm.is(':visible')) {
        var oldText = (typeof btnConfirm.data('text') == 'undefined') ? btnConfirm.data('text', btnConfirm.text()) : btnConfirm.data('text');
            oldText = btnConfirm.data('text');
        var html = (check) ? '<i class="fas fa-sync fa-spin cinzaColor"></i>' : oldText;
        btnConfirm.removeClass('ui-state-active').html(html);
        if (check) { btnConfirm.addClass('loading') } else { btnConfirm.removeClass('loading') }
    } 
}
function checkLimitText(this_) {
    var _this = $(this_);
    var maxlength = _this.attr('maxlength');
    var currentLength = (_this.is('textarea')) ? _this.val().length : _this.text().trim().length;
    var textCount = (currentLength >= maxlength) ? 'Voc\u00EA atingiu o n\u00FAmero m\u00E1ximo de caracteres.' : (maxlength - currentLength)+' caracteres restantes';
    _this.closest('div').find('.countLimit').html(textCount);
    // console.log(this_, maxlength, textCount, _this.closest('div').find('.countLimit'));
}
function followSelecionarItens(this_) {
    var _this = $(this_);
    if (_this.is(':checked')) {
        _this.closest('tr').addClass('infraTrMarcada');
    } else {
        _this.closest('tr').removeClass('infraTrMarcada');
    }
}
function waitLoadPro(Obj, ElemRaiz, Elem, func, TimeOut = 6000) {
  if (TimeOut <= 0) { 
      //console.log("Script não executado: TIMEOUT"); 
      return; 
  }
  setTimeout(function () {
    if (Obj.find(ElemRaiz).find(Elem).length == 0) {
      //console.log(ElemRaiz + ": find -> " + Elem + " : carregando...");
      waitLoadPro(Obj, ElemRaiz, Elem, func, TimeOut - 100);
    } else {
      //console.log(ElemRaiz + " : Script executado.");
      func();
    }
  }, 100);
}
function waitLoadProSimple(Elem, func, TimeOut = 6000) {
  if (TimeOut <= 0) { 
      return; 
  }
  setTimeout(function () {
    if (Elem.length == 0) {
      waitLoadPro(Elem, func, TimeOut - 100);
    } else {
      func();
    }
  }, 100);
}
function execArvorePro(func) {
  var Obj = $("#ifrArvore").contents();
  waitLoadPro(Obj, "#divArvore > div", "a[target='ifrVisualizacao']", function () {
    func();
    Obj.find("#divArvore > div > div:hidden").each(function () {
      var idPasta = Obj.find(this).attr("id").substr(3);
    //   console.log(idPasta + " -> evento click adicionado.");
      Obj.find("#ancjoin" + idPasta).on('click', function () {
        waitLoadPro(Obj, "#div" + idPasta, "a[target='ifrVisualizacao']", func);
        // console.log(idPasta + " -> evento click adicionado2.");
        $('#ifrArvore')[0].contentWindow.getLinksArvorePasta(idPasta);
        $(this).off("click");
      });
    });
  });
}
function setClickUrlAmigavel() {
    $("#ifrArvore").contents().find('a[target="ifrVisualizacao"]').unbind().on('click',function(){
        updateUrlPage(false);
    });
}
function arrayIDProcedimentos() {
    return localStorageRestorePro('arrayIDProcedimentos');
}
function setArrayIDProcedimentos(newArray) {
    localStorageStorePro('arrayIDProcedimentos', newArray);
    if(typeof newArray !== 'undefined' && newArray.length > 0) { console.log('setArrayIDProcedimentos', 'count->'+newArray.length, 'time->'+totalSecondsTestText) }
    parent.updateCountnewFiltro(newArray);
}
function updateCountnewFiltro(newArray) {
    var max = parseInt($('#selectProgressoBar_GroupTable').attr('aria-valuemax'));
        max = (typeof max !== 'undefined') ? max : 0;
    var index = (typeof newArray !== 'undefined' && newArray.length > 0 && max > 0) ? max-newArray.length : 0;
    var i = (index >  0 && max > 0) ? index+'/'+max : '';
    $('#newFiltroCounter').html(i);
}
function getDadosProcedimentosControlar() {
    var newArrayIDProcedimentos = []
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    $('#frmProcedimentoControlar').find('a.processoVisualizado').not('.processoNaoVisualizado, .processoNaoVisualizadoSigiloso, .processoVisualizadoSigiloso, .processoCredencialAssinaturaSigiloso').each(function(){
        var id_procedimento = String(getParamsUrlPro($(this).attr('href')).id_procedimento);
        var processo = $(this).text().trim();
        if (  jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") == 0 
            && jmespath.search(newArrayIDProcedimentos, "[?processo=='"+processo+"'] | length(@)") == 0 ) {
            newArrayIDProcedimentos.push({processo: processo, id_procedimento: id_procedimento});
        }
    });
    setArrayIDProcedimentos(newArrayIDProcedimentos);
    initCheckDadosProcedimentos();
}
function newTabDadosProcedimentosControlar() {  
    var href = window.location.href+'#&acao_pro=pesquisa_agrupamento';
    cancelDadosProcedimentosControlar();
    infraTooltipOcultar();
    setOptionsPro('newTabSearchProcedimentos', true);
    newTab = window.open(href,'Pesquisa de Processos','height=100,width=400,toolbar=0,menubar=0,location=0');
    if (window.focus) {newTab.focus()}
    observeNewTabDados();
    $('#frmCheckerProcessoPro').remove();
}
function observeNewTabDados() {  
    var loopNewTab = setInterval(function() {   
        if((typeof newTab !== 'undefined' && newTab.closed) || !getOptionsPro('newTabSearchProcedimentos')) {  
            clearInterval(loopNewTab);  
            updateGroupTable($('#selectGroupTablePro'));
            setOptionsPro('newTabSearchProcedimentos', false);
            console.log('## close tab');
        } else {
            console.log('@ reload tab');
        }
    }, 1000);
}
function initCheckDadosProcesso() {   
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    if (getUrlAcaoPro('duplicar_documento')) {
        var arrayCurrentCloneDoc = getOptionsPro('currentCloneDoc');
        if (arrayCurrentCloneDoc) {
            console.log('duplicar_documento', arrayCurrentCloneDoc);
            $('#ifrArvore')[0].contentWindow.getDuplicateDoc(arrayCurrentCloneDoc.nameDoc, arrayCurrentCloneDoc.paramDoc);
            removeOptionsPro('currentCloneDoc');
            history.replaceState("", document.title, window.location.href.split('#')[0]); 
        }
    }
}
function initCheckDadosProcedimentos() {   
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    
    if (typeof acao_pro === 'undefined' && arrayIDProcedimentos().length > 0) {
        if (!getOptionsPro('newTabSearchProcedimentos')) {
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            var href = window.location.href+'#&acao_pro=pesquisa_agrupamento';
            $('#frmCheckerProcessoPro').attr('src', href).unbind();
        } else {
            observeNewTabDados();
        }
    } else if (getUrlAcaoPro('pesquisa_agrupamento')) {
        if (arrayIDProcedimentos().length) {
            if (!$('#newFiltroProgress').is(':visible')) { 
                parent.setProcessGroupTable();
                cleanPageProgress();
                loopIDProcedimentos();
                timerTest = setInterval(setTimeTest, 1000);
            }
        }
    }
}
function cleanPageProgress() {
    $('#divInfraBarraSuperior').remove();
    $('#divInfraBarraSistema').hide();
    $('#divInfraAreaTelaE').remove();
    $('#divInfraBarraLocalizacao').remove();
    $('#divComandos').remove();
    $('#divFiltro').remove();
    $('#divRecebidos').remove();
    $('#divGerados').remove();
    $('#panelHomePro').remove();
    $('#selectGroupTablePro').remove();
    $('#newFiltro').css({'text-align':'left','padding':'20px 0', 'float': 'left', 'width': 'auto'});
    $('#newFiltroProgress').css({'margin':'20px 0', 'left': 'calc(50% - 113px)'});
    $('#divInfraAreaTelaD').removeAttr('style').removeAttr('class');
    $('#divInfraAreaTela').removeAttr('style').removeAttr('class');
    $('#divInfraAreaGlobal').removeAttr('style').removeAttr('class');
    $('#newTabFiltroProgress').remove();
    $('#newFiltroReturnTab').show();
    $('#newFiltroCancel').attr('class', 'fas fa-sign-in-alt cinzaColor').attr("onmouseover", "return infraTooltipMostrar(\'Retornar janela de pesquisa\')");
    window.onbeforeunload = function(){
        setOptionsPro('newTabSearchProcedimentos', false);
    }
}
function updateProcessGroupTable() {
    if ($('#selectProgressoBar_GroupTable .ui-progressbar-value').length) {
        var maxProgress = parseFloat($('#selectProgressoBar_GroupTable').attr('aria-valuemax'));
        var valueProgress = maxProgress-arrayIDProcedimentos().length;
        $('#selectProgressoBar_GroupTable').progressbar({ value: valueProgress });
        if (maxProgress < 10 ) { 
            parent.initTableTag($('#selectGroupTablePro', window.parent.document).val()); 
            //console.log('#### updateProcessGroupTable', maxProgress);
        }
    }
}
function setProcessGroupTable() {
    var progressoBar =  '<div id="newFiltroProgress" style="display: inline-block;position: absolute;margin: 50px 0 0 0; z-index: 99; width: '+($('#selectGroupTablePro').width()+50)+'px">'+
                        '    <span id="newFiltroCounter" class="azulColor" style="float: left;margin: -4px 8px 0 0; color: #777"></span>'+
                        '    <i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: -4px 8px 0 0;"></i>'+
                        '    <i id="newFiltroCancel" onclick="breakDadosProcedimentosControlar()" class="fas fa-times-circle cinzaColor" style="float: right;margin: -4px;padding-left: 10px;cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar pesquisa\')"></i>'+
                        '    <i onclick="newTabDadosProcedimentosControlar()" id="newTabFiltroProgress" class="fas fa-external-link-alt cinzaColor" style="float: right; margin: -4px; padding: 0 15px 0 20px; cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Pesquisar em nova aba\')"></i>'+
                        '    <div onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Encontrando datas dos processos da unidade...\')" class="selectProgressoBar" id="selectProgressoBar_GroupTable"></div>'+
                        '</div>';
    if ($('#newFiltroProgress').length == 0) { 
        $('#selectGroupTablePro').before(progressoBar);
    } else {
        $('#newFiltroProgress').show();
    }
    setTimeout(function(){ 
        $('#selectProgressoBar_GroupTable').progressbar({value: 0, max: arrayIDProcedimentos().length });
    }, 800);
}
function cleanTimeTest() {
    clearInterval(timerTest);
    console.log('###FIM cleanTimeTest', totalSecondsTestText);
    totalSecondsTest = 0;
    totalSecondsTestText = '';
}
function cancelDadosProcedimentosControlar() {
    statusPesquisaDadosProcedimentos = false;
    if(arrayIDProcedimentos() !== null && arrayIDProcedimentos().length > 0) {
        endProcessGroupTable();
    }
    cleanTimeTest();
}
function getUrlAcaoPro(param) {
    var acao_pro = getParamsUrlPro(window.location.href).acao_pro;
    if (typeof acao_pro !== 'undefined' && acao_pro == param) {
        return true;
    } else {
        return false;
    }
}
function endProcessGroupTable() {
    $('#newFiltroProgress').hide();
    setTimeout(function(){ 
        parent.updateGroupTable($('#selectGroupTablePro', window.parent.document));
        if (getUrlAcaoPro('pesquisa_agrupamento')) { window.close(); }
    }, 800);
}
function breakDadosProcedimentosControlar() {
    cancelDadosProcedimentosControlar();
    infraTooltipOcultar();
    var valueSelect = $('#selectGroupTablePro').val();
    if (valueSelect == 'arrivaldate' || valueSelect == 'acessdate' || valueSelect == 'senddate' || valueSelect == 'senddepart' || valueSelect == 'createdate') { 
        localStorageStorePro('selectGroupTablePro', '');
    }
    localStorageRemovePro('arrayIDProcedimentos');
    $('#frmCheckerProcessoPro').attr('src', 'about:blank').unbind();
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
        var i = arrayIDProcedimentos()[index];
        if (typeof i !== 'undefined') { 
            var newArrayIDProcedimentos = $.grep(arrayIDProcedimentos(), function(value) {
                  return value.id_procedimento != i.id_procedimento;
                });
            setArrayIDProcedimentos(newArrayIDProcedimentos);
            getDadosHistoricoPro(i);
        }
}
function getDadosHistoricoPro(listProc, fullHistory = false, callback = false) {
    //setTimeout(function(){ loopIDProcedimentos() }, 500);
    var href = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(listProc.id_procedimento);
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr('src');
        //loopIDProcedimentos();
        $.ajax({ url: urlArvore }).done(function (htmlArvore) {
            var urlHistorico = $.map(htmlArvore.split('\n'), function(substr, i) {
                    return (substr.indexOf('?acao=procedimento_consultar_historico') !== -1) ? substr : null;
                }).join('');
                urlHistorico = urlHistorico.split("'")[3];
                getDadosHistoricoUrlPro(urlHistorico, listProc, fullHistory, callback);
        });
    });
}
function getDadosHistoricoUrlPro(urlHistorico, listProc, fullHistory = false, callback = false) {
    $.ajax({ url: urlHistorico }).done(function (htmlHistorico) {
        if($(htmlHistorico).find('.infraAreaPaginacao').html().trim() != '') {
            var pg = ($(htmlHistorico).find('#selInfraPaginacaoSuperior').length > 0) ? $(htmlHistorico).find('#selInfraPaginacaoSuperior option').length-1 : 1;
            if (fullHistory) {
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, 0, pg, fullHistory, callback);
            } else {
                andamentoPaginacaoTemp = getArrayHistorico($(htmlHistorico));
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, 1, pg, fullHistory, callback);
            }
        } else {
            if (fullHistory) {
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, 0, 1, fullHistory, callback);
            } else {
                var andamento = getArrayHistorico($(htmlHistorico));
                var listAndamento = {historico_completo: false, processo: listProc.processo, id_procedimento: listProc.id_procedimento, andamento: andamento};
                if (!callback) {
                    loopIDProcedimentos();
                    getDataRecebimentoPro(listAndamento);
                } else if (typeof callback === 'function') {
                    callback(listAndamento);
                }
            }
            //console.log('getDadosHistoricoPro',listAndamento);
        }
    });
}
function getArrayHistorico(htmlHistorico) {
    var andamento = [];
    htmlHistorico.find("#tblHistorico").find('tr').each(function(){
        var datahora = $(this).find('td').eq(0).text().trim();
            datahora = moment(datahora,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
        var unidade = $(this).find('td').eq(1).text();
        var usuario = $(this).find('td').eq(2).text();
        var descricao = $(this).find('td').eq(3).text();
        var url_doc = $(this).find('td').eq(3).find('a.ancoraHistoricoProcesso');
        var nr_sei = (typeof url_doc !== 'undefined') ? url_doc.text() : false;
            nr_sei = (nr_sei != '') ? nr_sei : false;
        var id_documento = (typeof url_doc !== 'undefined') ? getParamsUrlPro(url_doc.attr('href')).id_documento : false;
            id_documento = (typeof id_documento !== 'undefined') ? id_documento : false;
        var descricao_alt = $(this).find('td').eq(3).find('a').attr('alt');
        if ( unidade != '' ) { andamento.push({datahora: datahora, unidade: unidade, usuario: usuario, descricao: descricao, descricao_alt: descricao_alt, nr_sei: nr_sei, id_documento: id_documento}) }
    });
    return andamento;
}
function getDadosHistoricoPaginacao(html, listProc, index, max, fullHistory = false, callback = false) {
    if (index > max) {
        var listAndamento = {historico_completo: false, processo: listProc.processo, id_procedimento: listProc.id_procedimento, andamento: andamentoPaginacaoTemp};
        if (!callback) {
            loopIDProcedimentos();
            getDataRecebimentoPro(listAndamento);
        } else if (typeof callback === 'function') {
            callback(listAndamento);
        }
        //console.log('getDadosHistoricoPaginacao',listAndamento);
    } else {
        var form = html.find('#frmProcedimentoHistorico');
        var href = form.attr('action');
        var param = {};
            form.find("input[type=hidden]").map(function () {
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            param['hdnInfraPaginaAtual'] = index;
            param['hdnTipoHistorico'] = (fullHistory) ? 'P' : 'R';

        $.ajax({
            method: 'POST',
            data: param,
            url: href
        }).done(function (htmlHistorico) {
            var andamento = getArrayHistorico($(htmlHistorico));
                $.merge(andamentoPaginacaoTemp, andamento);
                getDadosHistoricoPaginacao($(htmlHistorico), listProc, index+1, max, fullHistory, callback);
        });
    }
}
function initTablePaginacaoHistorico() {
    if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('removepaginacao')) {
        getTablePaginacao($('#ifrVisualizacao').contents(), '#frmProcedimentoHistorico', '#tblHistorico', 1);
    }
}
function getTablePaginacao(ifrView, formID, tableID, index) {
    if (ifrView.find('.infraAreaPaginacao a').length > 0 && typeof window.tablepaginacao_cancel == 'undefined') {
        var form = ifrView.find(formID);
        var href = form.attr('action');
        var param = {};
            form.find("input[type=hidden]").map(function () { 
                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) { 
                    param[$(this).attr('name')] = $(this).val(); 
                }
            });
            param['hdnInfraPaginaAtual'] = index;
            console.log(index);

        $.ajax({ 
            method: 'POST',
            data: param,
            url: href
        }).done(function (html) {
            let $html = $(html);
            var tr = $html.find(tableID+' tbody').find('tr').not('.infraTrOrdenacao');
                if(tr.length > 0) {
                    tr.each(function(index){
                        if ($(this).find('th').length == 0 && !$(this).find('td').hasClass('infraTdSetaOrdenacao')) {
                            if ($(this).find('input.infraCheckbox').length > 0) {
                                $(this).find('input.infraCheckbox').attr('disabled', true).closest('td').attr('onmouseout','return infraTooltipOcultar()').attr('onmouseover','return infraTooltipMostrar(\'Desative a op\u00E7\u00E3o "Remover pagina\u00E7\u00E3o de processos" nas configura\u00E7\u00F0es do '+NAMESPACE_SPRO+' para utilizar esta sele\u00E7\u00E3o\')');
                            }
                            ifrView.find(tableID+' tbody').append($(this)[0].outerHTML);
                        }
                    });
                    getTablePaginacao(ifrView, formID, tableID, index+1);
                    var caption = ifrView.find(tableID).find('caption.infraCaption');
                    var nrRegistros = caption.text();
                        nrRegistros = (nrRegistros.indexOf('-') !== -1) ? nrRegistros.split('-')[0].trim()+'):' : nrRegistros;
                        caption.html('<span>'+nrRegistros+'</span>');
                } else {
                    param['hdnInfraPaginaAtual'] = 0;
                    $.ajax({  method: 'POST', data: param, url: href });
                    ifrView.find('.infraAreaPaginacao').css('visibility','hidden');
                    ifrView.find('.loadRemovePag').remove();
                    ifrView.find(tableID).trigger('update');
                }
        });
        if (ifrView.find('.loadRemovePag').length == 0) {
            ifrView.find('.infraAreaPaginacao').prepend('<label class="loadRemovePag" style="float: right;margin-right: 30px;"><i class="fas fa-sync fa-spin"></i> Removendo pagina\u00E7\u00E3o... <a href="javascript:void(0);" style="font-size: 1em;" onclick="parent.cancelTablePaginacao(this)"><i class="fas fa-times" style="text-decoration: underline;"></i> Cancelar</a></label>');
        }
    }
}
function cancelTablePaginacao(this_) {
    var _this = $(this_);
    window.tablepaginacao_cancel = true;
    _this.closest('label').remove();
}
function filterTagView(this_) {
    if ($('#kanbanAtivPanel').is(':visible')) {
        filterTagKanban(this_);
    } else if ($('#tabelaAtivPanel').is(':visible') || $('#favoritesProDiv').is(':visible') || $('#tableAfastamentoPanel').is(':visible') || $('table.tableInfo[id*="tableConfiguracoesPanel_"]').is(':visible')) {
        filterTagTable(this_);
    } else if ($('#ifrArvore').length > 0) {
        $('#ifrArvore')[0].contentWindow.filterTagKanbanArvore(this_);
    }
}
function filterTagKanban(this_) {
    var _this = $(this_);
    var _parent = _this.closest('#kanbanAtivPanel');
    var data = _this.data();
    var tagName = (typeof data.tagname !== 'undefined' && data.tagname !== null && data.tagname !== '') ? data.tagname : false;
    var tagType = (typeof data.type !== 'undefined' && data.type !== null && data.type !== '') ? data.type : false;
    var htmlFilter = '';
        _parent.find('#filterTagKanban').remove();
    if (tagName) {
        _parent.find('.kanban-item').hide();
        var divPriorityUser = (data.type == 'user' && checkCapacidade('update_prioridades')) ? getHtmlKanbanUserPriority() : '';
        var itemFilter = _parent.find('.kanban-item.tagKanName_'+tagName);
        var nameTag = (typeof data.nametag !== 'undefined') ? data.nametag : _this.text().trim();
        var iconTag = (typeof data.icontag !== 'undefined') ? 'fas fa-'+data.icontag : _this.find('i').attr('class');
            itemFilter.show();
            htmlFilter =    '<div id="filterTagKanban" class="tituloFilter" style="padding: 0 10px 20px; font-size: 9pt; text-align: center;">'+
                            '   Filtro: '+
                            '   <span class="tag" style="background-color: '+data.colortag+'">'+
                            '       <span class="tag-text" style="color: '+data.textcolor+'; margin-right: 5px;">'+
                            '           <i class="tagicon tagicon '+iconTag+'" style="font-size: 120%; margin: 0 2px; color: '+data.textcolor+'"></i>'+
                            '           '+nameTag+
                            '           </span>'+
                            '       <button onclick="filterTagKanban(this); return false;" class="tag-remove"></button>'+
                            '   </span>'+divPriorityUser+
                            '</div>';
            _parent.prepend(htmlFilter);
            if (data.type == 'user') { getKanbanUserPriority(this_, 'add') } else { getKanbanUserPriority(this_, 'remove') }
            dialogBoxPro = true;
        setTimeout(function(){
            dialogBoxPro = false;
        }, 100);
        setOptionsPro('filterTag_kanban', (tagName ? tagName : ''));
        setOptionsPro('filterTagType_kanban', tagType);
        setOptionsPro('filterTag_removed', false);
    } else {
        _parent.find('.kanban-item').show();
        _parent.find('.kanban-item-priority').remove();
        removeOptionsPro('filterTag_kanban');
        removeOptionsPro('filterTagType_kanban');
        getKanbanUserPriority(this_, 'remove');
        setOptionsPro('filterTag_removed', true);
    }
    // console.log('$$$$$$ tagName', tagName);
    _parent.find('.kanban-container').animate({scrollTop: 0}, 500);
    infraTooltipOcultar();
    updateCountKanbanBoard();
}
function filterTagTable(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest('table');
    var tagName = (typeof data.tagname !== 'undefined' && data.tagname !== null && data.tagname !== '') ? 'tagTableName_'+data.tagname : false;
    var tagName_ = (tagName) ? data.tagname : '';
    var th_head = _parent.find('th.tituloFilter[data-filter-type="'+data.type+'"]');
    var typeTable = _parent.data('tabletype');
        _parent.find('thead .tableHeader').find('span.tag').remove();
        $('#tabelaAtivPanel').find('.filterTagClean').hide();
    if (tagName) {
        var colorTag = (data.colortag) ? data.colortag : '#bfd5e8';
        var nameTag = (data.nametag) ? data.nametag : $(this_).text();
        var textColour = (getBrightnessColor(colorTag) > 125) ? 'black' : 'white';
        var iconTagClass = _this.find('i').attr('class');
        var iconTag = '<i class="tagicon '+iconTagClass+'" style="font-size: 120%; margin: 0 2px; color: '+textColour+'"></i> ';
        var htmlFilter = '<span class="tag" style="margin-left: 10px; background-color: '+colorTag+'"><span class="tag-text" style="color: '+textColour+'; margin-right: 5px;">'+iconTag+nameTag+'</span><button onclick="filterTagView(this)" class="tag-remove"></button></span>';
            _parent.find('tbody').find('tr').hide();
            _parent.find('tbody').find('tr.'+tagName).show();
            $('#tabelaAtivPanel').find('.filterTagClean').show();
            setOptionsPro('filterTag_removed', false);
    } else {
        var htmlFilter = '';
        $('.tableFollow[data-tabletype="'+typeTable+'"]').find('tbody tr').show();
        $('#tabelaAtivPanel').find('.filterTagClean').hide();
        setOptionsPro('filterTag_removed', true);
    }
        /*    
        console.log({
            mode: 'show', 
            len: th_head.find('.tablesorter-header-inner').length, 
            type: data.type, 
            html: htmlFilter, 
            tagName: tagName, 
            typeTable: typeTable, 
            table_len: _this.closest('table').length,
            class: _this.attr('class'), 
            table_len: _this.closest('table').length, 
            tr_len: _this.closest('table').find('tbody tr').length
        });
        */
       
        updateCountTableFav();
        th_head.find('.tablesorter-header-inner').append(htmlFilter);
        setOptionsPro('filterTag_'+typeTable, tagName_);
        infraTooltipOcultar();
}
function getRecentDateRow(inicio, seconds) {
    if (moment().format('YYYY-MM-DD') == moment(inicio,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) {
        var diff = moment().add(seconds, 'seconds').diff(moment(inicio,'YYYY-MM-DD HH:mm:ss'));
        return (diff < 0) ? true : false;
    }
}
function normalizeAreaTela() {
    $('#divInfraAreaTela').css({'height':'','margin-bottom': '40px', 'display': 'inline-block'});
}
function initClassicEditor() {
    if (typeof ClassicEditor === 'undefined') {
        $.getScript(URL_SPRO+"js/lib/ckeditor/ckeditor.js");  
        // var htmlScript = '<script data-config="ckeditor-seipro" type="text/javascript" charset="UTF-8" src="'+URL_SPRO+'js/lib/ckeditor/ckeditor.js"></script>';
        // $(htmlScript).appendTo('head');
    }
}
function initPanelResize(element, name, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $(element).resizable !== 'undefined') { 
        setPanelResize(element, name);
    } else {
        setTimeout(function(){ 
            initPanelResize(element, name, TimeOut - 100); 
            console.log('Reload initPanelResize'); 
        }, 500);
    }
}
function setPanelResize(element, name) {
    normalizeAreaTela();
    $(element).resizable({
        handles: 's',
        stop: function( event, ui ) {
            setOptionsPro('panelHeight_'+name, ui.size.height);
            normalizeAreaTela()
        }
    });
    if (getOptionsPro('panelHeight_'+name) != '') {
        $(element).css('height',getOptionsPro('panelHeight_'+name)+'px');
    }
    $(element)
        .find('.ui-resizable-handle.ui-resizable-s')
        .dblclick(function() {
            removeOptionsPro('panelHeight_'+name);
            normalizeAreaTela();
        $(element).css('height','');
        })
        .attr('onmouseout','return infraTooltipOcultar()')
        .attr('onmouseover','return infraTooltipMostrar(\'Arraste para redimensionar. Dois cliques para desativar.\')');
}
function saveFollowDesc(this_, mode) {
    var type_container = ($(this_).closest('.kanban-content').length > 0) ? 'kanban' : 'table';
    var _container = (type_container == 'kanban') ? $(this_).closest('.kanban-container') : $(this_).closest('table');
    var _data_id = (type_container == 'kanban') ? $(this_).closest('.kanban-item').data('eid').replace('_id_','') : $(this_).closest('tr').data('index');
    var _content = (type_container == 'kanban') ? $(this_).closest('.kanban-content') : $(this_).closest('tr');
    var _content_desc = _content.find('.content_desc');

    var info = _content_desc.find('span.info');
    var info_txt = _content_desc.find('span.info_txt');
    var value = info_txt.find('input').val().replace(/[\u200B]/g, '');
    var index = parseInt(_data_id);
    var id_procedimento = (typeof $(this_).closest('tr').data('id_procedimento') !== 'undefined') ? parseInt($(this_).closest('tr').data('id_procedimento')) : false;
        info.show();
        info_txt.hide();
        // console.log(index, value, mode);
    if (value != info.text()) {
        info.text(value);
        if (mode == 'ativ') {
            parent.getServerAtividades({action: 'edit_assunto', id: index, assunto: value}, 'edit_assunto');
            var ativIndex = (index) ? parent.arrayAtividades.findIndex((obj => obj.id_demanda == index)) : index;
            arrayAtividades[ativIndex].assunto = value;
            arrayAtividadesPro[ativIndex].assunto = value;
            console.log('saveFollowDesc', ativIndex);
            if (type_container == 'table' && $('.kanban-item').is(':visible')) {
                var kanban_item = $('.kanban-item[data-eid="_id_'+index+'"] .content_desc');
                    kanban_item.find('span.info').text(value);
                    kanban_item.find('span.info_txt input').val(value);
            }
        } else if (mode == 'fav') {
            var storeFavorites = getStoreFavoritePro();
            var favoriteIndex = (id_procedimento) ? storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento)) : index;
                storeFavorites['favorites'][favoriteIndex].descricao = value;
                localStorageStorePro('configDataFavoritesPro', storeFavorites);
        }
    }
}
function editFollowDesc(this_, mode) {
    var type_container = ($(this_).closest('.kanban-content').length > 0) ? 'kanban' : 'table';
    var _container = (type_container == 'kanban') ? $(this_).closest('.kanban-container') : $(this_).closest('table');
    var _all_desc = _container.find('.content_desc');
    var _content = (type_container == 'kanban') ? $(this_).closest('.kanban-content') : $(this_).closest('tr');
    var _content_desc = _content.find('.content_desc');
    var info = _content_desc.find('span.info');
    var info_txt = _content_desc.find('span.info_txt');
        showFollowEtiqueta(this_, 'close', mode);
    if (info.is(':visible')) {
        _all_desc.find('span.info').show();
        _all_desc.find('span.info_txt').hide();
        info.hide();
        info_txt.show().find('input').focus().trigger('click');
        info_txt.show().find('input').select();  
    } else if (info.is(':hidden')) {
        info.show();
        info_txt.hide();
        parent.saveFollowDesc(this_, mode);
    }
}
function keyFollowDesc(e, mode) {
    if(e.which == 13) {
        parent.saveFollowDesc(e.path[0], mode);
        if (mode == 'fav') {
            saveConfigFav();
        }
    }
}
function showFollowEtiqueta(this_, status, mode) {
    var _this = $(this_);
    var table = _this.closest('table');
    var td = _this.closest('td');
    var td_info_tags_follow = td.find('.info_tags_follow');
    if(status == 'close' && td.find('input.tag-input').val() != '') {
        td.find('input.tag-input').trigger($.Event( "keypress", { which: 13 } ));
    }
    checkEtiquetaPriority(this_); 
    table.find('.info_tags_follow').show();
    table.find('.info_tags_follow_txt').hide();
    table.find('.followLinkTags').show();
    table.find('.btnCloseEtiqueta').remove();
    if (td_info_tags_follow.length > 0 && td_info_tags_follow.html().trim() == '') {
        td.addClass('info_tags_follow_empty');
    } else {
        td.removeClass('info_tags_follow_empty');
    }
    infraTooltipOcultar();
    if(status == 'show') {
        var btnClose =  '<a class="newLink btnCloseEtiqueta" onclick="parent.showFollowEtiqueta(this, \'close\', \''+mode+'\')" onmouseover="return infraTooltipMostrar(\'Fechar\');" onmouseout="return infraTooltipOcultar();">'+
                        '   <i class="fas fa-check-square cinzaColor" style="font-size: 100%;"></i>'+
                        '</a>';
        td.find('.followLinkTags').hide();
        td_info_tags_follow.not('.info_tags_user').hide();
        td.find('.info_tags_follow_txt').show().find('input.tag-input').focus().trigger('click').after(btnClose);
        addOptionsEtiqueta(this_, mode);
    } 
    setTimeout(function(){ 
        if (status == 'close' && mode == 'fav' && !_this.closest('tr').find('.content_desc span.info_txt').is(':visible')) {
            saveConfigFav();
        }
    }, 500);
    if ($('#ifrVisualizacao').length > 0) {
        $('#ifrVisualizacao')[0].contentWindow.infraTooltipOcultar();
    }
}
function checkEtiquetaPriority(this_) {
    var tr = $(this_).closest('tr');
    if (tr.hasClass('tagTableName_urgente')) {
        // tr.css('background-color','#f9e2e0');
        tr.addClass('importanteBoxDisplay');
    } else if (tr.hasClass('tagTableName_importante')) {
        // tr.css('background-color','#fffcd7');
        tr.addClass('urgenteBoxDisplay');
    } else {
        // tr.css('background-color','');
        tr.removeClass('urgenteBoxDisplay').removeClass('importanteBoxDisplay');
    }
}
function getColorTags(mode) {
    var colorTags = (mode == 'ativ') 
            ? (typeof arrayConfigAtivUnidade !== 'undefined' && arrayConfigAtivUnidade !== null && typeof arrayConfigAtivUnidade.config !== 'undefined' && arrayConfigAtivUnidade.config !== null && typeof arrayConfigAtivUnidade.config.etiquetas !== 'undefined' && arrayConfigAtivUnidade.config.etiquetas !== null) 
                ? arrayConfigAtivUnidade.config.etiquetas.config.colortags
                : []
            : getStoreFavoritePro().config.colortags;
        colorTags = (typeof colorTags !== 'undefined') ? colorTags : [];
    return colorTags;
}
function addOptionsEtiqueta(this_, mode) {
    var colorTags = getColorTags(mode);
    $(this_).closest('table').find('.tagFavAddColor, .tagFavAddColorInput, .tagFavEditIcon').remove();
    $(this_).closest('table').find('.tagsinput .tag').each(function(){
        var tagNamed = $(this).find('.tag-text').text();
        var tagName = removeAcentos(tagNamed).replace(/\ /g, '').toLowerCase();
        var tags = jmespath.search(colorTags, "[?name=='"+tagName+"'].value | [0]");
        var colorValue = (tags !== null && tags.length > 0) ? tags : '';
            colorValue = (colorValue == '') ? '#bfd5e8' : colorValue;
            colorValue = (tagName == 'urgente' && tags === null) ? '#c24242' : colorValue;
            colorValue = (tagName == 'importante' && tags === null) ? '#da9d2a' : colorValue;
        var iconValue = (jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | length(@)") > 0) ? jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | [0]") : '';
            iconValue = (iconValue == '') ? 'tag' : iconValue;
            iconValue = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'exclamation' : iconValue;
        var textColour = (colorValue != '') ? (getBrightnessColor(colorValue) > 125) ? 'black' : 'white' : '';
            textColour = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'white' : textColour;
        var backgroundColor = ($(this).data('colortag')) ? $(this).data('colortag') : colorValue;
        var htmlOptions =   '<input type="color" class="tagFavAddColorInput" value="'+backgroundColor+'" onchange="parent.changeColorEtiqueta(this, \''+mode+'\')">'+
                            '<i class="tagFavEditIcon fas fa-'+iconValue+'" data-icontag="'+iconValue+'" onclick="parent.openBoxIconsFA(\'selectIconEtiqueta\', \''+tagName+'\', \''+mode+'\')" onmouseover="return infraTooltipMostrar(\'Alterar \u00EDcone\');" onmouseout="return infraTooltipOcultar();"></i>'+
                            '<i class="tagFavAddColor fas fa-fill-drip" onclick="parent.openColorEtiqueta(this)" onmouseover="return infraTooltipMostrar(\'Alterar cor\');" onmouseout="return infraTooltipOcultar();"></i>';
        if (colorValue != '') {
            $(this).css({'background-color': colorValue, 'color': textColour}).find('.tag-text').css('color',textColour);
        }
        $(this).addClass('tagTableText_'+tagName);
        $(this).append(htmlOptions);
    });
}
function openColorEtiqueta(this_) {
    $(this_).closest('.tag').find('input[type="color"]').trigger('click');
}
function selectIconEtiqueta(this_, tagName, mode) {
    var table = (mode == 'ativ') 
            ? $('.tableAtividades').is(':visible') 
                ? $('.tableAtividades tbody, .atividadeInfo') 
                : $('.kanbanAtividade, .atividadeInfo')
            : $('.tableFavoritos tbody');
        table = ($('#ifrVisualizacao').contents().find('.favoritosLabelOptions').length > 0) ? $('#ifrVisualizacao').contents().find('.favoritosLabelOptions table') : table;
    var icon = $(this_).find('.iconListTxt').text();
    var value = table.find('.tag_text.tagTableText_'+tagName).data('colortag');
    table.find('.tag_text.tagTableText_'+tagName).data('icontag', icon).find('i.tagicon').attr('class', 'fas fa-'+icon);
    table.find('.tag.tagTableText_'+tagName).data('icontag', icon).find('i.tagFavEditIcon').data('icontag', icon).attr('class', 'tagFavEditIcon fas fa-'+icon);
    resetDialogBoxPro('alertBoxPro');
    $('#listIconsFontAwesome').remove();
    saveConfigEtiqueta(tagName, value, icon, mode);
}
function changeColorEtiqueta(this_, mode) {
    var value = $(this_).val();
    var textColour = (getBrightnessColor(value) > 125) ? 'black' : 'white';
    var tagNamed = removeAcentos($(this_).closest('.tag').find('.tag-text').text()).replace(/\ /g, '').toLowerCase();
    var tagName = 'tagTableText_'+tagNamed;
    var index = parseInt($(this_).closest('tr').data('index'));
    var icon = $(this_).closest('.tag').find('.tagFavEditIcon').data('icontag');
        $(this_).closest('tbody').find('.'+tagName).data('colortag',value).css({'background-color': value, 'color': textColour}).find('.tag-text').css('color', textColour).find('.tagicon').css('color', textColour);
        $(this_).closest('tbody').find('.'+tagName).find('.tagicon').css('color', textColour);
        $(this_).closest('tbody').find('.'+tagName+' .tagFavAddColorInput').val(value);
        saveConfigEtiqueta(tagNamed, value, icon, mode);
}
function saveConfigEtiqueta(name, value, icon, mode) {
    var storeEtiqueta = (mode == 'ativ') 
            ? (typeof arrayConfigAtivUnidade.config !== 'undefined' && typeof arrayConfigAtivUnidade.config.etiquetas !== 'undefined') 
                ? arrayConfigAtivUnidade.config.etiquetas : {config: {colortags: []}}
            : getStoreFavoritePro();
            // console.log(storeEtiqueta);
    var colorTags = (Object.keys(storeEtiqueta).length > 0 && typeof storeEtiqueta.config.colortags !== 'undefined') 
                        ? storeEtiqueta.config.colortags : [];
    if (colorTags.findIndex((obj => obj.name == name)) != -1) {
        var index = colorTags.findIndex((obj => obj.name == name));
        storeEtiqueta['config']['colortags'][index] = {name: name, value: value, icon: icon};
    } else {
        storeEtiqueta['config']['colortags'].push({name: name, value: value, icon: icon});
    }
    
    if (mode == 'ativ') {
        if (typeof arrayConfigAtivUnidade.config.etiquetas !== 'undefined' && arrayConfigAtivUnidade.config.hasOwnProperty('etiquetas')) {
            arrayConfigAtivUnidade.config.etiquetas.config = storeEtiqueta.config;
        } else {
            var itemPushConfig = arrayConfigAtivUnidade['config'];
                itemPushConfig['etiquetas'] = {config: storeEtiqueta.config};
            arrayConfigAtivUnidade['config'] = itemPushConfig;
            console.log(itemPushConfig, arrayConfigAtivUnidade['config']);
        }
        getServerAtividades({action: 'edit_etiqueta_config', config_etiquetas: arrayConfigAtivUnidade['config']['etiquetas']}, 'edit_etiqueta_config');
    } else if (mode == 'fav') {
        localStorageStorePro('configDataFavoritesPro', storeEtiqueta);
    }
}
function saveFollowEtiqueta() {
    var mode = $(this).closest('td').data('etiqueta-mode');
    if ($(this).closest('.info_tags_follow_txt').is(':visible')) {
        var tags = $(this).closest('.info_tags_follow_txt').find('.tag-text').map(function () { return $(this).text(); }).get();
        var tagsHtml = $.map(tags, function (value) { return getHtmlEtiqueta(value, mode) }).join('');
        var tagsFavClass = $.map(tags, function (value) { return 'tagTableName_'+removeAcentos(value).replace(/\ /g, '').toLowerCase(); }).join(' ');   
        var index = parseInt($(this).closest('tr').data('index'));
            $(this).closest('td').find('.info_tags_follow').html(tagsHtml);
            $(this).closest('tr').attr('class',tagsFavClass);
            addOptionsEtiqueta(this, mode);
        if (typeof $('.ui-autocomplete-input').autocomplete !== 'undefined') {
            $('.ui-autocomplete-input').autocomplete("option", { source: sugestEtiquetaPro(mode) });
        }
        if (mode == 'ativ') {
            if ($('div.ui-dialog').is(':visible')) {
                $('.kanban-item[data-eid="_id_'+index+'"] .info_tags_follow_etiquetas').html(tagsHtml);
                $('.tableAtividades tbody tr[data-index="'+index+'"] td.tdfav_tags .info_tags_follow').html(tagsHtml);
            }
            getServerAtividades({action: 'edit_etiqueta', id: index, etiquetas: tags}, 'edit_etiqueta');
            $.each(tags, function(i,value){
                if (value != '' && $.inArray(value, arrayConfigAtividades['etiquetas']['list']) == -1) {
                    arrayConfigAtividades['etiquetas']['list'].push(value);
                }
            });
            var demandaIndex = arrayAtividades.findIndex((obj => obj.id_demanda == index));
            if (demandaIndex != -1) {
                arrayAtividades[demandaIndex].etiquetas = tags;
                arrayAtividadesPro[demandaIndex].etiquetas = tags;
            }
                
        } else if (mode == 'fav') {
            var storeFavorites = getStoreFavoritePro();
            var id_procedimento = parseInt($(this).closest('tr').data('id_procedimento'));
            var favoriteIndex = storeFavorites.favorites.findIndex((obj => obj.id_procedimento == id_procedimento));
            storeFavorites['favorites'][favoriteIndex].etiquetas = tags;
            localStorageStorePro('configDataFavoritesPro', storeFavorites);
        }
        infraTooltipOcultar();
    }
}
function normalizeNameTag(tag) {
    return removeAcentos(tag).replace(/\ /g, '').toLowerCase().replace(/[^a-z0-9]/gi,'');
}
function sugestEtiquetaPro(mode) {
    return (mode == 'ativ') 
        ? (typeof arrayConfigAtividades.etiquetas !== 'undefined' ? arrayConfigAtividades['etiquetas']['list'] : [])
        : uniqPro($.map(getStoreFavoritePro()['favorites'], function (value) { return value.etiquetas; }));
}
function getHtmlEtiqueta(name, mode) {
    var colorTags = getColorTags(mode);
    var tagName = removeAcentos(name).replace(/\ /g, '').toLowerCase();
    var tags = jmespath.search(colorTags, "[?name=='"+tagName+"'].value | [0]");
    var backgroundColor = (tags !== null && tags.length > 0) ? tags : '';
        backgroundColor = (tagName == 'urgente' && tags === null) ? '#c24242' : backgroundColor;
        backgroundColor = (tagName == 'importante' && tags === null) ? '#da9d2a' : backgroundColor;
    var iconTag = (jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | length(@)") > 0) ? jmespath.search(colorTags, "[?name=='"+tagName+"'].icon | [0]") : 'tag';
        iconTag = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'exclamation' : iconTag;
    var textColour = (backgroundColor != '') ? (getBrightnessColor(backgroundColor) > 125) ? 'black' : 'white' : '';
        textColour = ((tagName == 'urgente' || tagName == 'importante') && tags === null) ? 'white' : textColour;
    var styleTag = (backgroundColor != '') ? 'style="background-color: rgb('+$.map(hexToRgb(backgroundColor),function(e){ return e }).join(", ")+'); color: '+textColour+'"' : '';
    return '<span data-colortag="'+backgroundColor+'"  data-type="etiqueta" data-icontag="'+iconTag+'" '+styleTag+' data-tagname="'+tagName+'" data-textcolor="'+textColour+'" class="tag_text tagTableText_'+tagName+'" onclick="parent.filterTagView(this)"><i class="tagicon fas fa-'+iconTag+'" style="font-size: 90%;margin: 0 2px; color: '+textColour+'"></i> '+name+'</span>'; 
}
function getDatesFormatBR(value) {
    return (moment(value, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss') == '00:00:00') ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
}
function getDatesPreview(config, dateduepreview=false) {
    var formatDate = 'YYYY-MM-DD HH:mm:ss';
    var displayFormat = (typeof config !== 'undefined' && typeof config.displayformat !== 'undefined' && config.displayformat !== null && config.displayformat) ? config.displayformat : 'DD/MM/YYYY';
        config.dateTo = (typeof config.dateTo === 'undefined') ? moment().format(formatDate) : config.dateTo;
    var resultDate = getDateSemantic(config); 
    var resultDateDate = (resultDate.date != '') ? moment(resultDate.date, formatDate).format(displayFormat) : resultDate.date;
    var displayDueText = (typeof config.displaydue_txt === 'undefined') ? 'Vencimento:' : config.displaydue_txt;
    var displayTipText = (config.displaytip) ? '<br>'+config.displaytip : '';
    var displayModeTip = (config.displaydue) 
                            ? 'infraTooltipMostrar(\'Criado '+resultDate.dateref+' ('+resultDateDate+') '+displayTipText+'\', \''+displayDueText+' '+resultDate.duedate+'\')' 
                            : 'infraTooltipMostrar(\''+displayDueText+' '+resultDate.duedate+' '+displayTipText+'\', \''+resultDate.duecalcref+'\')';
        displayModeTip = (config.deliverydoc) 
                            ? 
                            (config.dateDue !== null) 
                                ? 'infraTooltipMostrar(\'Avalia\u00E7\u00E3o at\u00E9 '+resultDate.duedate+' ('+resultDate.duecalcref+') '+displayTipText+'\', \''+displayDueText+' '+moment(resultDate.date, formatDate).format(displayFormat)+'\')' 
                                : 'infraTooltipMostrar(\''+config.displaytip+'\',\''+displayDueText+' '+moment(resultDate.date, formatDate).format(displayFormat)+'\')' 
                            : displayModeTip;
    var displayMode = (config.displaydue) ? resultDate.duecalcref : resultDate.dateref;
    var htmlDateDueBox = ((config.duedate || config.duesetdate) && resultDate.duecalcref != '' && dateduepreview) ? '<div class="infraTooltipPro" style="margin-top: 20px;"><strong>'+resultDate.duecalcref+'</strong>Vencimento em: '+resultDate.duedate+'</div>' : '';
    var htmlProgress = getProgressPreview(config);
    var backgroundDiv = ((config.duedate || config.duesetdate) && resultDate.alertdate) ? 'urgenteBoxDisplay' : '';
    var iconDate = (moment(config.date, formatDate).diff(moment(), 'days') > 0) ? 'far fa-clock' : 'fas fa-history';
        iconDate = (config.displayicon) ? config.displayicon : iconDate;
    var iconDateColor = (moment().format(formatDate) == config.dateDue) ? '#ad0606' : '#4285f4';
    var iconDateClass = (config.deliverydoc) ? config.deliverydoc_style : 'far fa-clock';
        iconDateClass = (config.displayicon) ? config.displayicon : iconDateClass;
    var tagName = (moment(config.date, formatDate).diff(moment(), 'days') > 0) ? { name: 'Seguinte', value: 'date_seguinte', color: '#eef4f9' } : { name: 'Vencida', value: 'date_vencido', color: '#f9e2e0'};
        tagName = (config.displaydue) ? { name: 'No prazo', value: 'date_noprazo', color: '#eef4f9' } : tagName;
        tagName = ((config.duedate || config.duesetdate) && (resultDate.alertdate)) ? { name: 'Atrasada', value: 'date_atrasado', color: '#f9e2e0'} : tagName;
        tagName = (moment().format(formatDate) == config.dateDue) ? { name: 'Hoje', value: 'date_hoje', color: '#f9e2e0' } : tagName;
        tagName = (config.deliverydoc) ? { name: 'Entregue', value: 'date_entregue', color: '#ddf1dd' } : tagName;
        tagName = (typeof config.ratingdoc !== 'undefined' && config.ratingdoc) ? { name: 'Avaliada', value: 'date_avaliado', color: '#f1ecdd' } : tagName;
        tagName = (typeof config.paused !== 'undefined' && config.paused) ? { name: 'Pausada', value: 'date_pausado', color: '#f1ecdd' } : tagName;
        tagName = (typeof config.senddoc !== 'undefined' && config.senddoc) ? { name: 'Arquivada', value: 'date_enviado', color: '#ececec' } : tagName;
        tagName = (typeof config.nametag !== 'undefined' && config.nametag) ? config.nametag : tagName;
    var tagAction = (typeof config.action !== 'undefined' && config.action != '') ? config.action : 'parent.filterTagView(this)';
    var htmlDateDue = (config.duedate || config.duesetdate) 
                        ? (resultDate.alertdate) 
                            ? '<span class="dateBoxIcon" onmouseover="return '+displayModeTip+';" onmouseout="return infraTooltipOcultar();"><i class="'+(config.displayicon ? config.displayicon : 'fas fa-exclamation-triangle vermelhoColor')+'" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span>' 
                            : '<span class="dateBoxIcon" onmouseover="return '+displayModeTip+';" onmouseout="return infraTooltipOcultar();">'+htmlProgress+'<i class="'+iconDateClass+'" style="color: '+iconDateColor+'; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span>' 
                        : '<i class="'+iconDate+'" style="color: #777; padding-right: 3px; font-size: 12pt;"></i>';
    // console.log('getDatesPreview',resultDate);
   return '<span class="dateboxDisplay tagTableText_'+tagName.value+' '+backgroundDiv+'" data-duesetdate="'+config.duesetdate+'" data-colortag="'+tagName.color+'" data-tagname="'+tagName.value+'" data-nametag="'+tagName.name+'" data-time-sorter="'+resultDate.date+'" data-type="date" onclick="'+tagAction+'">'+htmlDateDue+' '+displayMode+'</span>'+htmlDateDueBox;
}
function calculeDatesDurationTemplate() {
    var duration = this.duration;
    var return_ = [];
        if (duration.years() == 1) { return_.push('Y [ano]') } else if (duration.years() > 1) {  return_.push('Y [anos]') };
        if (duration.months() == 1) { return_.push('M [mes]') } else if (duration.months() > 1) { return_.push('M [meses]') } else if (duration.years() == 0 && duration.months() == 0 && duration.days() > 7) { if (duration.weeks() == 1 ) { return_.push('w [semana]') } else { return_.push('w [semanas]') } };
        if (duration.days() == 1) { return_.push('d [dia]') } else if (duration.days() > 1) { if (duration.months() == 0 && duration.days() % 7 === 0 ) { } else { return_.push('d [dias]') } } else if (duration.years() == 0 && duration.months() == 0 && duration.weeks() == 0 && duration.days() == 0) {  return_.push('[hoje]') };
        return_ = return_.join(', ');
        return_ = (return_ == '') ? 'd [dias]' : return_;
    return return_;
}
function calculeDatesDuration(date, dateTo, countdays) {
    var diff = moment(date).diff(moment(dateTo), 'milliseconds');
    var diff_d = moment(date).diff(moment(dateTo), 'days');
        // diff_d = (countdays && diff_d <= -1) ? diff_d-1 : diff_d;
    var day_formated = (diff_d).toLocaleString('pt-BR');
    var diff_ = (diff < 0) ? diff*-1 : moment(date).diff(moment(dateTo).add(-1,'d'), 'milliseconds');
    var duration = moment.duration(diff_, 'milliseconds');
        duration = (typeof duration !== 'undefined' && duration !== null && typeof duration.format !== 'undefined') ? duration.format(calculeDatesDurationTemplate) : '';
    var day_txt = (diff_d >= -1 && diff_d <= 1) ? 'dia' : 'dias';
    var duration_ = (diff == 0) ? 'hoje' : (diff < 0) ? (duration.trim() == 'hoje') ? moment(date).fromNow() : duration.trim()+' atr\u00E1s' : 'em '+duration;
        duration_ = (countdays && diff_d >= 1) ? day_formated+' '+day_txt+' atr\u00E1s' : duration_;
        duration_ = (countdays && diff_d <= -1) ? 'em '+Math.abs(day_formated)+' '+day_txt : duration_;
        duration_ = (countdays && diff_d == 0) ? day_formated+' '+day_txt : duration_;
    
    return  duration_;
}
function getDateSemantic(config) {
    var formatDate = 'YYYY-MM-DD HH:mm:ss';
    var displayFormat = (config.displayformat) ? config.displayformat : 'DD/MM/YYYY';
    var duration = (config.countdays) ? moment(config.dateTo, formatDate).diff(moment(config.date, formatDate), 'days') : moment(config.date, formatDate).diff(moment(config.dateTo, formatDate), 'days');
    var listaFeriados = (config.workday && config.countdays) ? getHolidayBetweenDates(moment(config.date, formatDate).format('Y')+'-01-01',moment(config.dateTo, formatDate).format('Y')+'-01-01') : [];
    var arrayFeriados = (config.workday && config.countdays) ? jmespath.search(listaFeriados, "[*].d_") : [];
    var calcWorkday = (config.workday) ? moment().isoWeekdayCalc({  
                          rangeStart: moment(config.date,formatDate),  
                          rangeEnd: moment(config.dateTo,formatDate),  
                          weekdays: [1,2,3,4,5],  
                          exclusions: arrayFeriados
                        }) : '';
    //var txtCalcWorkday = (config.workday && config.countdays) ? ((calcWorkday-1) == 1 || (calcWorkday-1) == 0) ? (calcWorkday-1).toLocaleString('pt-BR')+' dia \u00FAtil' : (calcWorkday-1).toLocaleString('pt-BR')+' dias \u00FAteis' : '';
    var calcWorkday_ = (calcWorkday-1);
    var day_txt = (calcWorkday_ >= -1 && calcWorkday_ <= 1 ) ? 'dia \u00FAtil' : 'dias \u00FAteis';
    var txtCalcWorkday = (config.workday && config.countdays && duration >= 1) ? calcWorkday_.toLocaleString('pt-BR')+' '+day_txt+' atr\u00E1s' : '';
        txtCalcWorkday = (config.workday && config.countdays && duration <= -1) ? 'em '+calcWorkday_.toLocaleString('pt-BR')+' '+day_txt : txtCalcWorkday;
        txtCalcWorkday = (config.workday && config.countdays && duration == 0) ? calcWorkday_.toLocaleString('pt-BR')+' '+day_txt : txtCalcWorkday;
    //console.log(calcWorkday_, duration, config.date);
    var frowNow = (config.workday && config.countdays) 
                    ? txtCalcWorkday
                    : (config.countdays) ? calculeDatesDuration(config.dateTo, config.date, config.countdays) : calculeDatesDuration(config.date, config.dateTo, config.countdays);
    var duedate = (config.duesetdate)
                    ? moment(config.dateDue, formatDate)
                    : (config.duecounter == 'util')
                        ? moment(config.date, formatDate).isoAddWeekdaysFromSet({  
                                          'workdays': config.duenumber,  
                                          'weekdays': [1,2,3,4,5],  
                                          'exclusions': arrayFeriados
                                        })
                        : moment(config.date,formatDate).add(config.duenumber, 'd');
    
    var alertdate = (moment(config.dateTo, formatDate) > moment(duedate)) ? true : false;
    var calcalert = (alertdate) ? moment(config.dateTo, formatDate).diff(moment(duedate), 'days') : moment(duedate).diff(moment(config.dateTo, formatDate), 'days');
        calcalert = (calcalert).toLocaleString('pt-BR');
    var duecalcref = (alertdate) 
                        ? (calcalert == 1) ? calcalert+' dia de atraso' : (calcalert > 1) ? calcalert+' dias de atraso' : (calcalert == 0) ? moment(duedate,formatDate).fromNow() : ''
                        : (calcalert == 1) ? 'em '+calcalert+' dia' : (calcalert > 1) ? 'em '+calcalert+' dias' : (calcalert == 0) ? moment(duedate,formatDate).fromNow() : '';
    
    return {date: config.date, dateref: frowNow, duedate: duedate.format(displayFormat), alertdate: alertdate, calcalert: calcalert, duecalcref: duecalcref};
}
function configDatesPreview() {
    var config = getConfigDatesFav();
    if (config.selectdoc) { configDatesSetUpdate() }
        config.dateTo = moment().format('YYYY-MM-DD');
    var htmlDatePreview = getDatesPreview(config, true);
        $('#dateboxPreview').show().html(htmlDatePreview);
        //console.log(config);
}
function getProgressPreview(config) {
    var max = moment(config.dateDue, 'YYYY-MM-DD').diff(moment(config.date, 'YYYY-MM-DD'), 'days');
    var progress = moment().diff(moment(config.date, 'YYYY-MM-DD'), 'days');
    if ((config.duesetdate || config.duedate) && progress <= max && progress >= 0) {
        var percentProgresso = Math.round((progress/max)*100);
        var colorProgresso = ( percentProgresso > 100 ) 
                                    ? 'style="stroke: #ff010199;"' 
                                    : (config.deliverydoc) ? 'style="stroke: #72a50a70;"' : '';
            htmlProgress = '<svg viewBox="0 0 36 36" class="circular-chart"><path '+colorProgresso+' class="circle" stroke-dasharray="'+percentProgresso+', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path></svg>';
            // console.log(max, progress, percentProgresso, config.date, config.dateDue, config.dateProgress);
    } else {
        htmlProgress = '';
    }
    return htmlProgress;
}
function updateTablePrazoProcesso() {
    var tblProcessos = $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado');
    if (tblProcessos.find('tbody tr').not('.tableHeader').find('td.prazosBoxDisplay').length == 0) {
            tblProcessos.find('tbody tr').not('.tableHeader').append('<td class="prazosBoxDisplay" style="text-align: right;"></td>');

        if ( tblProcessos.find('thead').length > 0 ) {
            tblProcessos.find('thead tr').append('<th class="tituloControle tablesorter-header prazosBoxDisplay">Prazos</th>');
        } else {
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').find('.prazosBoxDisplay').remove();
            $('#tblProcessosRecebidos tbody tr:first, #tblProcessosGerados tbody tr:first, #tblProcessosDetalhado tbody tr:first').not('.tableHeader').append('<th class="tituloControle tablesorter-header prazosBoxDisplay">Prazos</th>');
        }
        if ($('.tabelaControle').find('tr').hasClass('tableHeader')) { 
            $('.tabelaControle').find('tr.tableHeader').each(function(){ 
                var td = $(this).find('th.tituloControle').eq(1);
                var colspan = parseInt(td.attr('colspan'));
                if (colspan == 6) {
                    td.attr('colspan',colspan+1);
                }
            });
        }
        if ($('.tabelaControle').hasClass('tablesorter')) {
            $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').trigger("destroy");
            setTableSorterHome();
        }
    }
    tblProcessos.find('tbody tr').each(function(){
        var tag = $(this).find('a[href*="acao=andamento_marcador_gerenciar"]');
        if (tag.length > 0) {
            var linkTag = tag.attr('href');
            var textTag = (typeof tag.attr('onmouseover') !== 'undefined') ? extractTooltip(tag.attr('onmouseover')) : '';

            var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
            var checkDateDue = regexDue.exec(removeAcentos(textTag.trim()).toLowerCase().replaceAll('  ',' '));
            var datePrazoDue = (checkDateDue !== null) ? moment(checkDateDue[0], 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss') : false;

            var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
            var checkDate = regex.exec(removeAcentos(textTag.trim()));
            var datePrazo = (checkDateDue === null && checkDate !== null) ? moment(checkDate[0], 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss') : false;
            
            var htmlDatePrazo = (datePrazo) ? getDatesPreview({date: datePrazo}) : false;
                htmlDatePrazo = (datePrazoDue) ? getDatesPreview({date: datePrazoDue}) : htmlDatePrazo;
                htmlDatePrazo = (htmlDatePrazo) ? $('<div>'+htmlDatePrazo+'</div>').find('.dateboxDisplay').html(): htmlDatePrazo;

            var dateSorter = (htmlDatePrazo) ? (datePrazo || datePrazoDue): '';


            var htmlPrazo = (htmlDatePrazo) 
                            ?   '<span class="info_dates_fav">'+
                                '    <span class="dateboxDisplay">'+
                                '        '+htmlDatePrazo+
                                '    </span>'+
                                '</span>'
                            : ''; 

            $(this).find('td.prazosBoxDisplay').html(htmlPrazo).attr('data-time-sorter', dateSorter);

            console.log({url: linkTag, text: textTag, data: datePrazo, datadue: datePrazoDue, html: htmlDatePrazo});
        }
    });
}
function openBoxIconsFA(action, nametag, mode) {
    var htmlBox = '<div id="listIconsFontAwesome">'+
                  '    <input type="text" id="searchIconFA" onkeyup="filterIconsFA()" placeholder="Filtrar pelo nome...">';
        $.each(listIconsFontAwesome, function(i,value){
            htmlBox += '<span class="iconList" onclick="'+action+'(this, \''+nametag+'\', \''+mode+'\')"><i class="fas fa-'+value+' azulColor"></i> <span class="iconListTxt">'+value+'</span></span>';
        });
        htmlBox += '</div>';
    
        resetDialogBoxPro('alertBoxPro');
        alertBoxPro = $('#alertaBoxPro')
            .html('<div>'+htmlBox+'</div>')
            .dialog({
                title: "Icones",
                close: function() { $('#listIconsFontAwesome').remove() },
                width: 800
        });
}
function filterIconsFA() {
  var filter = $('#searchIconFA').val().toUpperCase();
      $("#listIconsFontAwesome").find('.iconList').each(function(){
        if ($(this).find('.iconListTxt').text().toUpperCase().indexOf(filter) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
      });
}
function configFlashMenuTrPro(value, color, state, mode) { 
    var index = randomString(4);
    return  '        <tr>'+
            '           <td>'+
            '               <p><i class="iconPopup fa '+value.icon+' '+color+'"></i><span class="info">'+value.name+'</span></p>'+
            '           </td>'+
            '           <td>'+
            '               <div class="onoffswitch">'+
            '                   <input type="checkbox" data-name="'+value.name+'" onchange="changeFlashMenuPro(this, \''+mode+'\')" name="onoffswitch" class="onoffswitch-checkbox" id="itemFlashMenu_'+index+'" tabindex="0" '+state+'>'+
            '                   <label class="onoffswitch-label" for="itemFlashMenu_'+index+'"></label>'+
            '               </div>'+
            '           </td>'+
            '        </tr>';
}
function configFlashMenuPro(arrayLinksArvore) { 
    var selectedItensMenu = ( typeof localStorageRestorePro('configViewFlashMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashMenuPro')) ) ? localStorageRestorePro('configViewFlashMenuPro') : [['Incluir Documento'],['Consultar/Alterar Processo'],['Enviar Documento Externo'],['Atribuir Processo']];
    var selectedItensDocMenu = ( typeof localStorageRestorePro('configViewFlashDocMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashDocMenuPro')) ) ? localStorageRestorePro('configViewFlashDocMenuPro') : [['Copiar n\u00FAmero SEI'],['Copiar nome do documento'],['Copiar link do documento']];
    var selectedItensDocArvore = ( typeof localStorageRestorePro('configViewFlashDocArvorePro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashDocArvorePro')) ) ? localStorageRestorePro('configViewFlashDocArvorePro') : [["Copiar n\u00FAmero SEI"],["Copiar link do documento"],["Duplicar documento"]];
    var selectedItensPanelArvore = ( typeof localStorageRestorePro('configViewFlashPanelArvorePro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashPanelArvorePro')) ) ? localStorageRestorePro('configViewFlashPanelArvorePro') : [["Anota\u00E7\u00F5es"],["Marcador"],["Tipo de Procedimento"],["Assuntos"],["Interessados"],["Atribui\u00E7\u00E3o"],["N\u00EDvel de Acesso"],["Observa\u00E7\u00F5es"]];

    var textBox =   '<div id="flashMenu_tabs" style="border: none; min-height: 300px; margin: 0;">'+
                    '   <ul style="font-size: 10px;">'+
                    '       <li><a href="#tabs_flashMenuPro"><i class="fa fa-scroll cinzaColor"></i> Processo</a></li>'+
                    '       <li><a href="#tabs_flashDocMenuPro"><i class="fa fa-file cinzaColor"></i> Documentos</a></li>'+
                    '       <li><a href="#tabs_flashDocArvorePro"><i class="fa fa-tree cinzaColor"></i> \u00C1rvore</a></li>'+
                    '       <li><a href="#tabs_flashPanelArvorePro"><i class="fa fa-info-circle cinzaColor"></i> Painel</a></li>'+
                    '   </ul>'+
                    '   <div id="tabs_flashMenuPro">'+
                    '       <h3 style="font-weight: bold; color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar menu do processo" data-mode="menuproc" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_proc" tabindex="0" '+(getOptionsPro('optionsFlashMenu_menuproc') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoffswitch-label" for="optionFlashMenu_proc"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-scroll cinzaColor"></i> Menu r\u00E1pido do processo'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_menuproc '+(getOptionsPro('optionsFlashMenu_menuproc') == 'disabled' ? 'disableOptions' : '')+'" style="height: 500px;overflow-y: scroll;">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashMenu" style="font-size: 10pt;width: 100%;">';
    
        $.each(selectedItensMenu,function(index, value){
            if ( jmespath.search(iconsFlashMenu, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashMenu, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'proc');
            }         
        });
        $.each(iconsFlashMenu,function(index, value){
            if ( jmespath.search(selectedItensMenu, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'proc');
            }            
        });
        textBox +=  '          </table>'+
                    '       </div>'+
                    '   </div>';
    
        textBox +=  '   <div id="tabs_flashDocMenuPro">'+
                    '       <h3 style="font-weight: bold;color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar menu dos documentos" data-mode="menudoc" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_doc" tabindex="0" '+(getOptionsPro('optionsFlashMenu_menudoc') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoffswitch-label" for="optionFlashMenu_doc"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-file cinzaColor"></i> Menu r\u00E1pido dos documentos'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_menudoc '+(getOptionsPro('optionsFlashMenu_menudoc') == 'disabled' ? 'disableOptions' : '')+'" style="height: 500px;overflow-y: scroll;">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashDocMenu" style="font-size: 10pt;width: 100%;">';
    
    var statusMenuClick = ( jmespath.search(selectedItensDocMenu, "[?[0]=='Ativar menu ao clicar'] | length(@)") > 0 ) ? {chekbox: 'checked', class: 'azulColor'} : {chekbox: '', class: 'cinzaColor'};    
    textBox += configFlashMenuTrPro({name: "Ativar menu ao clicar", icon: "fas fa-mouse-pointer", alt: ""}, statusMenuClick.class, statusMenuClick.chekbox, 'doc');
    
        $.each(selectedItensDocMenu,function(index, value){
            if ( jmespath.search(iconsFlashDocMenu, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashDocMenu, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'doc');
            }         
        });
        $.each(iconsFlashDocMenu,function(index, value){
            if ( jmespath.search(selectedItensDocMenu, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'doc');
            }            
        });
        textBox +=  '          </table>'+
                    '       </div>'+
                    '   </div>';

        textBox +=  '   <div id="tabs_flashDocArvorePro">'+
                    '       <h3 style="font-weight: bold;color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar icones na arvore" data-mode="iconstree" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_tree" tabindex="0" '+(getOptionsPro('optionsFlashMenu_iconstree') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoffswitch-label" for="optionFlashMenu_tree"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-tree cinzaColor"></i> \u00CDcones r\u00E1pidos na \u00E1rvore'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_iconstree '+(getOptionsPro('optionsFlashMenu_iconstree') == 'disabled' ? 'disableOptions' : '')+'" style="height: 500px;overflow-y: scroll;">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashDocArvore" style="font-size: 10pt;width: 100%;">';    
        $.each(selectedItensDocArvore,function(index, value){
            if ( jmespath.search(iconsFlashDocArvore, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashDocArvore, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'tree');
            }         
        });
        $.each(iconsFlashDocArvore,function(index, value){
            if ( jmespath.search(selectedItensDocArvore, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'tree');
            }            
        });
        textBox +=  '          </table>'+
                    '       </div>'+
                    '   </div>';

        textBox +=  '   <div id="tabs_flashPanelArvorePro">'+
                    '       <h3 style="font-weight: bold;color: #666;">'+
                    '          <div class="onoffswitch" style="position: absolute;right: 30px;">'+
                    '              <input type="checkbox" data-name="Ativar painel de informa\u00E7\u00F5es na arvore" data-mode="panelinfo" onchange="changeFlashMenuGeneralPro(this)" name="onoffswitch" class="onoffswitch-checkbox optionFlashMenu" id="optionFlashMenu_panelinfo" tabindex="0" '+(getOptionsPro('optionsFlashMenu_panelinfo') == 'disabled' ? '' : 'checked')+'>'+
                    '              <label class="onoffswitch-label" for="optionFlashMenu_panelinfo"></label>'+
                    '          </div>'+
                    '          <i class="iconPopup fa fa-info-circle cinzaColor"></i> Painel de Informa\u00E7\u00F5es na \u00E1rvore'+
                    '       </h3>'+
                    '       <div class="details-container optionsFlashMenu_panelinfo '+(getOptionsPro('optionsFlashMenu_panelinfo') == 'disabled' ? 'disableOptions' : '')+'">'+
                    '          <table class="tableInfo popup-wrapper tableZebra tableFlashDocArvore" style="font-size: 10pt;width: 100%;">';    
        $.each(selectedItensPanelArvore,function(index, value){
            if ( jmespath.search(iconsFlashPanelArvore, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashPanelArvore, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'panel');
            }         
        });
        $.each(iconsFlashPanelArvore,function(index, value){
            if ( jmespath.search(selectedItensPanelArvore, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'panel');
            }            
        });
        textBox +=  '           </table>'+
                    '       </div>'+
                    '   </div>'+
                    '</div>';
    
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</div>')
        .dialog({
            title: "Personalizar Menu R\u00E1pido",
        	width: 600,
        	open: function(){
                $('#flashMenu_tabs').tabs();
                setTimeout(function(){ 
                    centralizeDialogBox(dialogBoxPro);
                }, 100);
            },
        	buttons: [{
                text: "Ok",
                click: function() { 
                    document.getElementById('ifrArvore').contentWindow.location.reload();
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
    }).on('dialogclose', function(event) {
         document.getElementById('ifrArvore').contentWindow.location.reload();
     });
    $(".tableFlashMenu").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'proc');
        }
    });
    $(".tableFlashDocMenu").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'doc');
        }
    });
    $(".tableFlashDocArvore").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'tree');
        }
    });
}
function changeFlashMenuGeneralPro(this_) {
    var _this = $(this_);
    var mode = _this.data('mode');
    var _parent = _this.closest('.dialogBoxDiv');
    var status = _this.is(':checked');
    var status_var = (status) ? 'enabled' : 'disabled';
    if (status) {
        _parent.find('.optionsFlashMenu_'+mode).removeClass('disableOptions');
    } else {
        _parent.find('.optionsFlashMenu_'+mode).addClass('disableOptions');
    }
    setOptionsPro('optionsFlashMenu_'+mode, status_var);
    console.log('.optionsFlashMenu_'+mode, status, status_var);
}
function changeFlashMenuPro(this_, mode) {
    var configView = '';
    if (mode == 'proc') {
        configView = 'configViewFlashMenuPro';
    } else if (mode == 'doc') {
        configView = 'configViewFlashDocMenuPro';
    } else if (mode == 'tree') {
        configView = 'configViewFlashDocArvorePro';
    } else if (mode == 'panel') {
        configView = 'configViewFlashPanelArvorePro';
    } 
    var arrayShowItensMenu = []
    $(this_).closest('table').find('input').each(function(){
        if ($(this).is(':checked')) {
            arrayShowItensMenu.push([$(this).data('name')]);
            $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        } else {
            $(this).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
        }
    });
    console.log(configView, arrayShowItensMenu);
    localStorageStorePro(configView, arrayShowItensMenu);
}
function dialogCopyNewDoc(doc) {
    var textBox =   '<div>Digite o n\u00FAmero do processo que deseja copiar o documento <span style="display: inline-block; padding: 3px 5px; margin: 3px 5px;background: #eaeaea; border-radius: 5px; color: #666;">'+doc.text().trim()+'</span></div>'+
                    '<div class="dialogBoxDiv seiProForm">'+
                    '   <input onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" id="dialogBoxProcesso" type="text" style="font-size: 10pt; width: 80%;">'+
                    '</div>';
    console.log('dialogCopyNewDoc', doc);
    removeOptionsPro('currentCloneDoc');

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
            width: 450,
            title: 'Copiar documento para outro processo',
            buttons: [{
                text: "Copiar",
                class: 'confirm ui-state-active',
                click: function() {
                    loadingButtonConfirm(true);
                    getIDProtocoloSEI($('#dialogBoxProcesso').val().trim(),  
                        function(html){
                            let $html = $(html);
                            var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                            $('#ifrArvore')[0].contentWindow.getDadosDoc(doc, params.id_procedimento);    
                        }, 
                        function(){
                            alertaBoxPro('Error', 'exclamation-triangle', 'Protocolo n\u00E3o encontrado!');
                            loadingButtonConfirm(false);
                        }
                    );
                }
            }]
    });
}
function getConfigValue(name) {
    var configBasePro = ( typeof localStorage.getItem('configBasePro') !== 'undefined' && localStorage.getItem('configBasePro') != '' ) ? JSON.parse(localStorage.getItem('configBasePro')) : [];
    var dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(configBasePro, "[*].configGeral | [0]") : false;
        dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(dataValuesConfig, "[?name=='"+name+"'].value | [0]") : false;
        dataValuesConfig = (dataValuesConfig !== null) ? dataValuesConfig : false;

    return (dataValuesConfig !== null) ? dataValuesConfig : false;
}
function verifyConfigValue(name) {
    var configBasePro = ( typeof localStorage.getItem('configBasePro') !== 'undefined' && localStorage.getItem('configBasePro') != '' ) ? JSON.parse(localStorage.getItem('configBasePro')) : [];
    var dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(configBasePro, "[*].configGeral | [0]") : false;
        dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(dataValuesConfig, "[?name=='"+name+"'].value | [0]") : false;
        dataValuesConfig = (dataValuesConfig !== null) ? dataValuesConfig : false;
    
    if (dataValuesConfig == true ) {
        return true;
    } else {
        return false;
    }
}
function checkConfigValue(name) {
    var configBasePro = ( typeof localStorage.getItem('configBasePro') !== 'undefined' && localStorage.getItem('configBasePro') != '' ) ? JSON.parse(localStorage.getItem('configBasePro')) : [];
    var dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(configBasePro, "[*].configGeral | [0]") : false;
        dataValuesConfig = (typeof jmespath !== 'undefined') ? jmespath.search(dataValuesConfig, "[?name=='"+name+"'].value | [0]") : false;
        // dataValuesConfig = (dataValuesConfig !== null) ? dataValuesConfig : false;
    if (dataValuesConfig == false && typeof configBasePro !== 'undefined' && configBasePro !== null && configBasePro.length > 0 ) {
        return false;
    } else {
        return true;
    }
}
function copyTextThis(this_) {
    copyToClipboard($(this_).text().trim());
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
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
};
function targetIfrVisualizacaoPro(url) { 
    if ( typeof url !== 'undefined' && url != '' && url !== null ) {
        $("#ifrVisualizacao").attr("src", url);
    }
}
function execIncluirEmBlocoPro() { 
    $('#ifrVisualizacao')[0].contentWindow.incluirEmBloco();
}
function execConcluirReabrirProcessoPro(url) { 
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    if ( ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0 ) {
        $('#ifrVisualizacao')[0].contentWindow.reabrirProcesso();    
    } else if ( ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0 ) {
        $('#ifrVisualizacao')[0].contentWindow.concluirProcesso();    
    } else {
        targetIfrVisualizacaoPro(url);
    }
}
//Initializes the API client library and sets up sign-in state listeners.
function initClientPro() {
    if ( typeof spreadsheetIdProjetos_Pro !== 'undefined' || typeof spreadsheetIdAtividades_Pro !== 'undefined' || typeof spreadsheetIdFormularios_Pro !== 'undefined'  || typeof spreadsheetIdSyncProcessos_Pro !== 'undefined' ) {

        gapi.client.init({
          apiKey: API_KEY_PRO,
          clientId: CLIENT_ID_PRO,
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(function () {
          // Listen for sign-in state changes.
            
            if (typeof loadEtapasSheet === "function") { loadEtapasSheet() }
            if (typeof loadAtividadesSheet === "function") { loadAtividadesSheet() }
            if (typeof loadFormulariosSheet === "function") { loadFormulariosSheet() }
            /*
            */
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatusPro);

            // Handle the initial sign-in state.
            updateSigninStatusPro(gapi.auth2.getAuthInstance().isSignedIn.get());
            $('#authorizeButtonPro').on('click',function() { handleAuthClickPro() });
            $('#signoutButtonPro').on('click',function() { handleSignoutClickPro() });

        }, function(error) {
          alertaBoxPro('Error', 'exclamation-triangle', JSON.stringify(error, null, 2));
        });
    }
}
function onSignInPro(response) {
    const responsePayload = parseJwt(response.credential);
    var googleUser = {response: response, decode: responsePayload};
        window.googleUser = googleUser;
        sessionStorageStorePro('googleUser', googleUser);
}
// Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
function updateSigninStatusPro(isSignedIn) {
    if (isSignedIn) {
        $('#authorizeButtonPro').hide();
        $('#signoutButtonPro').show();
        if (typeof loadEtapasSheet === "function") { loadEtapasSheet() }
        if (typeof loadAtividadesSheet === "function") { loadAtividadesSheet() }
        if (typeof loadFormulariosSheet === "function") { loadFormulariosSheet() }
    } else {
        $('#authorizeButtonPro').show();
        $('#signoutButtonPro').hide();
    }
}
function loadSheetIconPro(status) {
    if ( status == 'load' ) {
      $('#signoutButtonPro').removeClass('noperfil').addClass('spinner');
      $('#signoutButtonPro i').attr('class','fas fa-spinner fa-spin brancoColor');
    } else if ( status == 'noperfil' ) {
        $('#signoutButtonPro').removeClass('spinner');
        $('#signoutButtonPro').addClass('noperfil').show().attr('onmouseover', 'return infraTooltipMostrar(\'Perfil n&atilde;o autorizado. Solicite acesso &agrave; planilha\')').find('i').attr('class','fas fa-user-slash brancoColor');
    } else {
        $('#signoutButtonPro').removeClass('noperfil').removeClass('spinner');
        $('#signoutButtonPro i').attr('class','fas fa-power-off brancoColor');
    }
}
// Sign in the user upon button click.
function handleAuthClickPro(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClickPro(event) {
    gapi.auth2.getAuthInstance().signOut();
    logoutSheetPro();
}
function logoutSheetPro() {
    $('#projetosGantt').remove();
    localStorageRemovePro('loadEtapasSheet');
    localStorageRemovePro('loadFormulariosSheet');
    //localStorageRemovePro('configBasePro');
    removeOptionsPro('configBaseSelectedPro');
    removeOptionsPro('configBaseSelectedFormPro');
    removeOptionsPro('projetosGanttActiveTabs');
}
function uniqPro(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
function getParamsUrlPro(url) {
    var params = {};
    if (typeof url !== 'undefined' && url.indexOf('?') !== -1 && url.indexOf('&') !== -1) {
        var vars = url.split('?')[1].split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    } else { return false; }
}
function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
 };
function getIDProtocoloSEI(protocolo, funcSucess, funcError) {
    var xhr = new XMLHttpRequest();
    var href = $('#frmProtocoloPesquisaRapida').attr('action');
    $.ajax({ 
        method: 'POST',
        data: { txtPesquisaRapida: protocolo },
        url: href,
        xhr: function() {
             return xhr;
        },
        success: function(data) { 
          var _return = getParamsUrlPro(xhr.responseURL);
            if ( _return.id_protocolo != 0 && typeof _return.id_protocolo !== 'undefined' ) {
                funcSucess(data);
            } else {
                funcError();
            }
        }
    });
}
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
function arraySheetToJSON(array) {
    var objDados = [];
    $.each(array,function(index, value){
        if ( index != 0 && typeof value[0] !== 'undefined' && value[0] != '' ) {
            var obj = {};
            for (var i = 0 ; i < array[0].length; i++) {
                var nameIndex = array[0][i];
                obj[nameIndex] = (typeof value[i] !== 'undefined') ? value[i] : '';
            }
            objDados.push(obj);
        }
    });
    return objDados;
}
function arraySheetToJSON_WithRow(array) {
    var objDados = [];
    $.each(array,function(index, value){
        if ( index != 0 && value.length > 0 ) {
            var obj = {};
                obj['_ROW'] = index+1;
                for (var i = 0 ; i < array[0].length; i++) {
                    var nameIndex = array[0][i];
                    obj[nameIndex] = (typeof value[i] !== 'undefined') ? value[i] : '';
                }
                objDados.push(obj);
        } else {
            objDados.push({_ROW: index+1});
        }
    });
    return objDados;
}
function getCitacaoDoc() {
    var citacaoDoc = 'SEI n\u00BA ';
        citacaoDoc = (getConfigValue('citacaodoc') == 'citacaodoc_2') ? 'SEI ' : citacaoDoc;
        citacaoDoc = (getConfigValue('citacaodoc') == 'citacaodoc_3' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? '' : citacaoDoc;
    return citacaoDoc;
}
function checkFormRequiredPro(elementForm) {
    var required = true;
    $(elementForm+' .required').each(function( index ) {
    	if ( $(this).val() == '' ) { required = false; }
    });
    return required;
}
function confirmaFraseBoxPro(text, phrase, func, cancel) {
    if (alertBoxPro) { 
        alertBoxPro.dialog('destroy');
        alertBoxPro = false;
        $('.alertaAttencionPro').html('');
    }
    var phraseDiv = '<div class="dialogBoxDiv">Para confirmar, digite <b style="font-weight: bold;">'+phrase.toUpperCase()+'</b>:</div>'+
                    '<div class="dialogBoxDiv seiProForm">'+
                    '   <input id="dialogBoxConfirmFrase" autocomplete="off" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" oninput="if (\''+phrase.toUpperCase()+'\' == $(this).val().trim().toUpperCase()) {updateButtonConfirm(this, true)} else {updateButtonConfirm(this, false)}" type="text" style="font-size: 10pt; width: 80%; text-transform: uppercase;">'+
                    '</div>';
    alertBoxPro = $('#alertaBoxPro')
        .html('<strong class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> '+text+'</strong>'+phraseDiv)
        .dialog({
            title: NAMESPACE_SPRO,
        	width: 550,
        	close: function() { 
                alertBoxPro = false;
                $('.alertaAttencionPro').html('');
                if (typeof cancel === 'function') {
                    cancel();
                }
            },
        	buttons: [{
                text: "Cancelar",
                click: function() {
                    $(this).dialog('close');
                    if (typeof cancel === 'function') {
                        cancel();
                    }
                }
            },{
                text: "OK",
                class: "confirm",
                click: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var confirmFrase = $('#dialogBoxConfirmFrase');
                    if (phrase.toUpperCase() == confirmFrase.val().trim().toUpperCase()) {
                        confirmFrase.removeClass('requiredNull');
                        func();
                        $(this).dialog('close');
                    } else {
                        confirmFrase.addClass('requiredNull');
                    }
                }
            }]
        });
}
function confirmaBoxPro(text, func, titBtn = 'OK', cancel) {
    if (alertBoxPro) { 
        alertBoxPro.dialog('destroy');
        alertBoxPro = false;
        $('.alertaAttencionPro').html('');
    }
    alertBoxPro = $('#alertaBoxPro')
        .html('<strong class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> '+text+'</strong>')
        .dialog({
            title: NAMESPACE_SPRO,
        	width: 500,
        	close: function() { 
                alertBoxPro = false;
                if (typeof cancel === 'function') { cancel() }
                $('.alertaAttencionPro').html('');
            },
        	buttons: [{
                text: "Cancelar",
                click: function() {
                    if (typeof cancel === 'function') { cancel() }
                    $(this).dialog('close');
                }
            },{
                text: titBtn,
                class: "confirm ui-state-active",
                click: function() {
                    func();
                    $(this).dialog('close');
                }
            }]
        });
}
function alertaBoxPro(status, icon, text) {
    resetDialogBoxPro('alertBoxPro');
    alertBoxPro = $('#alertaBoxPro')
        .html('<strong class="alerta'+status+'Pro dialogBoxDiv"><i class="fas fa-'+icon+'" style="margin-right: 5px;"></i> '+text+'</strong>')
        .dialog({
            title: NAMESPACE_SPRO,
        	width: 400,
        	close: function() { 
                alertBoxPro = false;
                $('.alerta'+status+'Pro').html('');
             },
        	buttons: [{
                text: "OK",
                class: "confirm",
                click: function() {
                    $(this).dialog('close');
                }
            }]
        });
}
function openConfigBoxPro(html = '', func_open = false, func_close = false) {
    resetDialogBoxPro('configBoxPro');
    configBoxPro = $('#configBoxPro')
        .html('<div id="configBoxProDiv" class="configBoxProDiv">'+html+'</div>')
        .dialog({
            title: NAMESPACE_SPRO+': Configura\u00E7\u00F5es',
        	width: '95%',
        	height: 'auto',
            modal: true,
        	open: function() { 
                if (typeof func_open === 'function') func_open();
            },
        	close: function() { 
                configBoxPro = false;
                if (typeof func_close === 'function') func_close();
            },
        	buttons: [{
                text: "OK",
                class: "confirm",
                click: function() {
                    $(this).dialog('close');
                }
            }]
        });
}
function generateGreetings(){
    var currentHour = parseInt(moment().format("HH"));
    console.log(currentHour);
    if (currentHour >= 5 && currentHour < 12){
        return "Bom dia";
    } else if (currentHour >= 12 && currentHour < 18){
        return "Boa tarde";
    } else if (currentHour >= 18 || currentHour < 5){
        return "Boa noite";
    } else {
        return "Ol\u00E1"
    }
}
function togglePainelPro(idTable, mode) {
	if ( mode == 'hide' ) {
		$('#'+idTable+'_full').hide();
		$('#'+idTable+'_min').show();
        setOptionsPro(idTable, 'hide');
	} else {
		$('#'+idTable+'_full').show();
		$('#'+idTable+'_min').hide();
        setOptionsPro(idTable, 'show');
	}
}
function toggleTablePro(idTable, mode) {
    var elemTable = idTable.substring(1);
	if ( mode == 'hide' ) {
		$(idTable).addClass('displayNone');
		$('#'+elemTable+'_hideIcon').hide();
		$('#'+elemTable+'_showIcon').show();
        setOptionsPro(elemTable, 'hide');
	} else {
		$(idTable).removeClass('displayNone').css('display', 'inline-table');
		$('#'+elemTable+'_hideIcon').show();
		$('#'+elemTable+'_showIcon').hide();
        setOptionsPro(elemTable, 'show');
	}
}
function getColorID() {
	var colorID = {
		color1: { 
			light: '#dddddd', 
			dark: '#646464'
		},
		color2: { 
			light: '#e2daf1', 
			dark: '#7b54c0'
		},
		color3: { 
			light: '#eed7e9', 
			dark: '#b1489c'
		},
		color4: { 
			light: '#f2d7dc', 
			dark: '#c2495e'
		},
		color5: { 
			light: '#ecdacf', 
			dark: '#a85723'
		},
		color6: { 
			light: '#dfdfc8', 
			dark: '#6e6b06'
		},
		color7: { 
			light: '#d1e2cc', 
			dark: '#2f7c16'
		},
		color8: { 
			light: '#c9e4d7', 
			dark: '#0a824a'
		},
		color9: { 
			light: '#cae2e6', 
			dark: '#0e7a8b'
		},
		color10: { 
			light: '#d4def0', 
			dark: '#3b68b9'
		}
	};
	return colorID;
}
function getStyleTable(color, width = 80) {
	var styleTable = {
		tableStyle1: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: '',
			tr: '',
			td_head: 'background-color: '+color.light+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle2: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'background-color: '+color.light+';',
			tr: ['','background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle3: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%; border-left: none;border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle4: {
			table: 'border-collapse:collapse; margin-left:auto;margin-right:auto;width:'+width+'%;border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'border-left: none; border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle5: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%;border: none;',
			tr_head: 'border: none;',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle6: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%; border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: 'background-color: '+color.light+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'background-color: '+color.light+'; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle7: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle8: {
			table: 'border-collapse:collapse; border-bottom: 1px solid '+color.dark+'; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:'+width+'%;',
			tr_head: 'border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border-left: 1px solid '+color.dark+';',
			td_first: 'border-right: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle9: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto;width:'+width+'%; border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border: 1px solid '+color.dark+';',
			td_first: 'border-left: none;border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle10: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'color: #fff;',
			tr: '',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle11: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%; border: none;',
			tr_head: 'color: #fff; border: 1px solid '+color.dark+'; border-bottom: 1px solid #fff !important',
			tr: 'border: none;',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'background-color: '+color.light+'; border-bottom: 1px solid #fff; border-right: 1px solid #fff',
			td_first: 'color: #fff;background-color: '+color.dark+'; border: 1px solid '+color.dark+'; border-bottom: 1px solid #fff !important;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle12: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle13: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto ;width:'+width+'%; border: none;',
			tr_head: 'background-color: '+color.light+'; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border: 1px solid '+color.dark+';',
			td_first: 'border-left: none;border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle14: {
			table: 'border-collapse:collapse;margin-left:auto;margin-right:auto;width:'+width+'%;border: none;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle15: {
			table: 'border-collapse:collapse;margin-left:auto;margin-right:auto;width:'+width+'%;border-left: none; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border-bottom: 1px solid '+color.dark+';',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle16: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: 'color: #fff;',
			tr: '',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border: none;',
			td_first: 'border: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle17: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto;width:'+width+'%;',
			tr_head: 'color: #fff;',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border: none;',
			td_first: 'border: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle18: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:'+width+'%;border: none;',
			tr_head: 'color: #fff; border: 1px solid '+color.dark+'; border-bottom: 3px solid #fff !important',
			tr: ['border: none; background-color: '+color.light+';','color: #fff; border: none; background-color: '+color.dark+';'],
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border:none;',
			td_first: 'border: none; border-right: 3px solid #fff',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle19: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto;width:'+width+'%; border-left: none;border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle20: {
			table: 'border-collapse:collapse; margin-left:auto;margin-right:auto;width:'+width+'%;border: none;',
			tr_head: 'background-color: '+color.light+'; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'border-left: none; border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle21: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:'+width+'%;',
			tr_head: '',
			tr: '',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		}
	};
	return styleTable;
}
function localStorageRestorePro(item) {
    return isJson(localStorage.getItem(item)) ? JSON.parse(localStorage.getItem(item)) : false;
}
function localStorageStorePro(item, result) {
    localStorage.setItem(item, JSON.stringify(result));
}
function localStorageRemovePro(item) {
    localStorage.removeItem(item);
}
function sessionStorageRestorePro(item) {
    return JSON.parse(sessionStorage.getItem(item));
}
function sessionStorageStorePro(item, result) {
    sessionStorage.setItem(item, JSON.stringify(result));
}
function sessionStorageRemovePro(item) {
    sessionStorage.removeItem(item);
}
function hybridStorageRestorePro(item) {
    if (localStorageRestorePro(item) !== null) {
        return localStorageRestorePro(item);
    } else if (sessionStorageRestorePro(item) !== null) {
        return sessionStorageRestorePro(item);
    } else {
        return false;
    }
}
function hybridStorageRemovePro(item) {
    if (localStorageRemovePro(item) !== null) {
        return localStorageRemovePro(item);
    } else if (sessionStorageRemovePro(item) !== null) {
        return sessionStorageRemovePro(item);
    } else {
        return false;
    }
}
function hybridStorageStorePro(item, result) {
    try {
        localStorageStorePro(item, result);
    } catch(e) {
        sessionStorageStorePro(item, result);
    }
    return true;
}
function verifyOptionsPro(item) {
    var option = localStorageRestorePro('optionsPro');
    if (typeof option !== 'undefined') {
        if (typeof option !== 'undefined' && !$.isEmptyObject(option) && typeof option[item] !== 'undefined' && option[item] !== null) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function getOptionsPro(item) {
    updateOptionsPro(item);
    var option = localStorageRestorePro('optionsPro');
    if (typeof option !== 'undefined' && !$.isEmptyObject(option) && typeof option[item] !== 'undefined' && option[item] !== null) {
        return option[item];
    } else {
        return false;
    }
}
function setOptionsPro(item, value) {
    var option = localStorageRestorePro('optionsPro');
    if (typeof option !== 'undefined') {
        if ($.isEmptyObject(option)) {
            option = {[item]: value};
        } else {
            option[item] = value;
        }
        localStorageStorePro('optionsPro', option);
        return true;
    } else {
        return false;
    }
}
function removeOptionsPro(item) {
    var option = localStorageRestorePro('optionsPro');
    if (typeof option !== 'undefined' && !$.isEmptyObject(option) && option[item] !== null) {
        delete option[item];
        localStorageStorePro('optionsPro', option);
    }
    return true;
}
function updateOptionsPro(item) {
    var oldOption = localStorageRestorePro(item);
    if (typeof oldOption !== 'undefined' && oldOption !== null) {
        setOptionsPro(item, oldOption);
        localStorageRemovePro(item);
    }
}
function createCookiePro(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else { var expires = ""; }
    
    if ( typeof readCookiePro(name) !== 'undefined' && days >= 0) { eraseCookiePro(name); }

    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookiePro(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookiePro(name) {
    createCookiePro(name, "", -1);
}
function removeAcentos(str) {
    return (typeof str !== 'undefined' && str !== null) ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
}
function encodeURI_toHex(str){
    var hex, i;
    var result = "";
    for (i=0; i<str.length; i++) {
        var test = removeAcentos(str.charAt(i));
        if (str.charAt(i) == ' ') {
            result += '+';
        } else if (str.charAt(i) != test && str.charAt(i) != '') {
            hex = str.charCodeAt(i).toString(16);
            result += ("%"+hex).slice(-4).toUpperCase();
        } else {
            result += str.charAt(i);
        }
    }
    return result
}
function encodeJSON_toHex(str){
    var hex, i;
    var result = "";
    for (i=0; i<str.length; i++) {
        var test = removeAcentos(str.charAt(i));
        if (str.charAt(i) != test && str.charAt(i) != '') {
            hex = str.charCodeAt(i).toString(16);
            result += "\\u"+("00"+hex).slice(-4).toUpperCase();
        } else {
            result += str.charAt(i);
        }
    }
    return result
}
function unicodeToChar(text) {
    if (text != '') {
        return text.replace(/\\u[\dA-F]{4}/gi, 
            function (match) {
                    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
    } else {
        return text;
    }
 }
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function randomString(length) {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getProcessoUnidadePro(selected = false, obj = false) {
    if ($('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0) {
        var processosUnidade = [];
        var selectTableTr = (selected) 
                            ? $('#tblProcessosRecebidos, #tblProcessosGerados, .infraTable').find('tr.infraTrMarcada')
                            : $('#tblProcessosRecebidos, #tblProcessosGerados, .infraTable').find('tr');
        if (selectTableTr.length > 0) {
            selectTableTr.each(function(index){ 
                var a = $(this).find('td').eq(2).find('a').eq(0)
                var processo_sei = a.text();
                    processo_sei = (typeof processo_sei !== 'undefined') ? processo_sei : false;
                var id_procedimento = getParamsUrlPro(a.attr('href')).id_procedimento;
                    id_procedimento = (typeof id_procedimento !== 'undefined') ? id_procedimento : false;
                if (processo_sei && id_procedimento) { 
                    var _return = (obj) 
                                    ? {processo_sei: processo_sei, id_procedimento: id_procedimento}
                                    : processo_sei;
                    processosUnidade.push(_return); 
                }
            });
            if (obj) {
                processosUnidade.filter((processosUnidade, index, self) =>
                    index === self.findIndex((t) => (
                        t.processo_sei === processosUnidade.processo_sei
                    ))
                );
            } else {
                uniqPro(processosUnidade);
            }
        } else {
            processosUnidade = false;
        }
        setOptionsPro('listaProcessoUnidade', processosUnidade);
        return processosUnidade;
    } else {
        return getOptionsPro('listaProcessoUnidade');
    }
}
function getListTypesSEI() {
    var hrefConsulta = $(mainMenu).find('a[href*="protocolo_pesquisa"]').attr('href');
    if (typeof hrefConsulta !== 'undefined' && hrefConsulta != '') {
        $.ajax({ url: hrefConsulta }).done(function (html) {
            var $htmlConsulta = $(html);
            var form = $htmlConsulta.find('#frmPesquisaProtocolo');
            var param = {};
                param['selectTipoProc'] = $htmlConsulta.find('#selTipoProcedimentoPesquisa option').map(function(){ if($(this).text().trim() != '') { return {name: $(this).text().trim(), value: $(this).val()} } }).get();
                param['selSeriePesquisa'] = $htmlConsulta.find('#selSeriePesquisa option').map(function(){ if($(this).text().trim() != '') { return {name: $(this).text().trim(), value: $(this).val()} } }).get();
            arrayListTypesSEI = param;
        });
    }
}
function getCheckerProcessoPro() {
    $('<iframe>', {
        id:  'frmCheckerProcessoPro',
        name:  'frmCheckerProcessoPro',
        frameborder: 0,
        style: (checkBrowser() == 'Firefox') 
            ? 'width: 1px; height: 1px; position: absolute; top: -100px;' 
            : 'width: 1px; height: 1px; position: absolute; top: -100px; display: none;',
        tableindex: '-1',
        scrolling: 'no'
    }).appendTo('body');
}
function getDadosIframeProcessoPro(idProcedimento, mode) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' ) {
        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
        var url = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
        /*
        var xhr = new XMLHttpRequest();
        $.ajax({
            url: url,
            xhr: function() {
                return xhr;
            }
        }).done(function (htmlResult) {
            console.log(xhr.responseURL);
            var newUrl = xhr.responseURL;
            alert(newUrl);
            $('#frmCheckerProcessoPro').attr('src', newUrl).unbind().on('load', function(){
                checkDadosIframeProcessoPro(mode);
            });
        });
        */
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            checkDadosIframeProcessoPro(mode);
        });
    }
}
function checkDadosIframeProcessoPro(mode) {
    var iframe = $('#frmCheckerProcessoPro').contents();  
    var ifrVisualizacao = iframe.find('#ifrVisualizacao').contents();
    var ifrArvore = iframe.find('#ifrArvore').contents();  
    setTimeout(function () { 
        if ( ifrVisualizacao.find('#divArvoreAcoes').length > 0) {
            getDadosProcessoPro(ifrVisualizacao, mode);
            getLinksProcessoPro(ifrVisualizacao);
            getLinksArvorePro(ifrArvore);
            getDadosPesquisaPro(iframe, mode);
            unidade = iframe.find('#selInfraUnidades').find('option:selected').text().trim();
        } else {
            checkDadosIframeProcessoPro(mode);
        }
    }, 500);
}
function getDadosPesquisaPro(iframe, mode) {
    var href = iframe.find(mainMenu).find('li a').map(function () { if ($(this).attr('href').indexOf('acao=protocolo_pesquisar') !== -1) { return $(this).attr('href') } }).get().join();
    if (href != '') {
        var tiposDocumentos = [];
        $.ajax({ url: href }).done(function (html) {
            let $html = $(html);
                $html.find("#selSeriePesquisa").find('option').each(function(){
                    var id = $(this).attr('value');
                    var name = $(this).text().trim();
                    if ( name != '' ) { tiposDocumentos.push({id: id, name: name}) }
                });
                dadosProcessoPro.tiposDocumentos = tiposDocumentos;
        });
    }
}
function getDadosProcessoPro(ifrVisualizacao, mode) {
    var processo = {};
    ifrVisualizacao.find('#divArvoreAcoes a').each(function(index){
        var href = $(this).attr('href');
        if ((href.indexOf('acao=procedimento_alterar') !== -1) || (href.indexOf('acao=procedimento_consultar') !== -1)) {
            ajaxDadosProcessoPro(href, mode);
        } else if (href.indexOf('acao=procedimento_gerar_pdf') !== -1) {
            ajaxDadosDocumentosPro(href, mode);
        }
    });
}
function getLisDocsProcessoPro() {
    var ifrArvore = $('#ifrArvore');
    var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
        arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
    var href = jmespath.search(arrayLinksArvore, "[?name=='Gerar Arquivo PDF do Processo'].url");
    if (href !== null) {
        ajaxDadosDocumentosPro(href, false);
    }
}
function getLinksArvorePro(ifrArvore) { 
    ifrArvore.find('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('consultarAndamento') !== -1) { 
            var text = $(this).html();
            var link = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
            });
            if ( link.length > 0 ) {
                $.each(link,function(index, value){
                    var name = '';
                    if ( value.indexOf('?acao=procedimento_consultar_historico') !== -1 ) { 
                        getDadosAndamentoPro(value);
                    }
                });
            }
        }
    });
}
function getDadosAndamentoPro(href) {
    //var andamento = [];
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
            /*
            $html.find("#tblHistorico").find('tr').each(function(){
                var datahora = $(this).find('td').eq(0).text().trim();
                    datahora = moment(datahora,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
                var unidade = $(this).find('td').eq(1).text();
                var usuario = $(this).find('td').eq(2).text();
                var descricao = $(this).find('td').eq(3).text();
                var descricao_alt = $(this).find('td').eq(3).find('a').attr('alt');
                if ( unidade != '' ) { andamento.push({datahora: datahora, unidade: unidade, usuario: usuario, descricao: descricao, descricao_alt: descricao_alt}) }
            });
            */
        var andamento = getArrayHistorico($html);
        var processo = $html.find('#divInfraBarraLocalizacao').text().trim().split(' ');
            processo = processo[processo.length-1];
        var id_procedimento = $html.find('#frmProcedimentoHistorico').attr('action'); 
            id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento != '') ? getParamsUrlPro(id_procedimento).id_procedimento : '';
            
        var listAndamento = {historico_completo: false, processo: processo, id_procedimento: id_procedimento, andamento: andamento};
            dadosProcessoPro.listAndamento = listAndamento;
            getDataRecebimentoPro(listAndamento);
    });
}
function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
function getDataRecebimentoPro(listAndamento) {
    var dataRecebimento = [];
    var datesend = '',
        descricaosend = '',
        unidadesend = '',
        unidadesendfull = '',
        datageracao = '',
        descricaodatageracao = '';
    //var unidade = $('#selInfraUnidades').find('option:selected').text().trim();

    $.each(listAndamento.andamento,function(k, g){
        if (g.descricao.indexOf('Processo p\u00FAblico gerado') !== -1 || g.descricao.indexOf('Processo restrito gerado') !== -1 ) {
            datageracao = g.datahora;
            descricaodatageracao = g.descricao;
            return false;
        }
    });
    $.each(listAndamento.andamento,function(j, e){
        if (unidade == e.unidade && e.descricao.indexOf('Processo remetido pela unidade') !== -1) {
            datesend = e.datahora;
            descricaosend = e.descricao;
            unidadesend = e.descricao.replace('Processo remetido pela unidade','').trim();
            unidadesendfull = (e.descricao_alt != '') ? e.descricao_alt+' - '+unidadesend : '';
            return false;
        }
    });
    $.each(listAndamento.andamento,function(i, v){
        //var datevisit = randomDate(new Date(2020, 0, 1), new Date(), 0, 24);
        var datevisit = moment().format('YYYY-MM-DD HH:mm:ss');
        if (unidade == v.unidade && (v.descricao == 'Processo recebido na unidade' || v.descricao == 'Reabertura do processo na unidade')) {
            dataRecebimento.push({id_procedimento: listAndamento.id_procedimento, processo: listAndamento.processo, datahora: v.datahora, unidade: v.unidade, descricao: v.descricao, datetime: datevisit, datesend: datesend, descricaosend: descricaosend, unidadesend: unidadesend, unidadesendfull: unidadesendfull, datageracao: datageracao, descricaodatageracao: descricaodatageracao});
            return false;
        } else if (unidade == v.unidade && (v.descricao == 'Processo p\u00FAblico gerado' || v.descricao.indexOf('Processo restrito gerado') !== -1 )) {
            dataRecebimento.push({id_procedimento: listAndamento.id_procedimento, processo: listAndamento.processo, datahora: v.datahora, unidade: v.unidade, descricao: v.descricao, datetime: datevisit, datesend: datesend, descricaosend: descricaosend, unidadesend: unidadesend, unidadesendfull: unidadesendfull, datageracao: datageracao, descricaodatageracao: descricaodatageracao});
            return false;
        }
    });
    if (dataRecebimento.length) { 
        var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
        var objIndex = -1;
            $.each(storeRecebimento, function(i, v) {
                if (v.id_procedimento == listAndamento.id_procedimento) { objIndex = i; return false; }
            });
            if (objIndex == -1) {
                storeRecebimento.push(dataRecebimento[0]);
            } else {
                storeRecebimento[objIndex] = dataRecebimento[0];
            }
            localStorageStorePro('configDataRecebimentoPro', storeRecebimento);
    }
}
function getLinksProcessoPro(ifrVisualizacao) {
    var linksArvore = [];
    ifrVisualizacao.find('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('objAjaxVerificacaoAssinatura') !== -1) { 
            var text = $(this).html();
            var link = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
            });
            if ( link.length > 0 ) {
                $.each(link,function(index, value){
                        var name = '';
                        //var icon = '';
                        //var alt = '';
                        if ( value.indexOf('?acao=procedimento_concluir') !== -1 && ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0 ) { 
                            name = 'Concluir Processo';
                        } else if ( value.indexOf('?acao=procedimento_ciencia') !== -1 && ifrVisualizacao.find('img[title="Ci\u00EAncia"]').length > 0 ) { 
                            name = 'Ci\u00EAncia'; 
                        } else if ( value.indexOf('?acao=procedimento_enviar_email') !== -1 && ifrVisualizacao.find('img[title="Enviar Correspond\u00EAncia Eletr\u00F4nica"]').length > 0 ) { 
                            name = 'Enviar Correspond\u00EAncia Eletr\u00F4nica';
                        } else if ( value.indexOf('?acao=bloco_selecionar_processo') !== -1 && ifrVisualizacao.find('img[title="Incluir em Bloco"]').length > 0 ) { 
                            name = 'Incluir em Bloco';
                        } else if ( value.indexOf('?acao=procedimento_reabrir') !== -1 && ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0 ) { 
                            name = 'Reabrir Processo';
                        } else if ( value.indexOf('?acao=procedimento_atualizar_andamento') !== -1 && ifrVisualizacao.find('img[title="Atualizar Andamento"]').length > 0 ) { 
                            name = 'Atualizar Andamento';
                        } 
                        var data = jmespath.search(parent.iconsFlashMenu, "[?name=='"+name+"'] | [0]");
                        if ( name != '' ) { linksArvore.push({ url: value, name: data.name, icon: data.icon, alt: data.alt}); }
                });
            }
        }
    });
    dadosProcessoPro.listLinks = linksArvore;
    if ( $('#ifrArvore').length > 0 ) { $('#ifrArvore')[0].contentWindow.initSeiProArvore(); }
}
function ajaxDadosDocumentosPro(href, mode, callback = false) {
    var documentos = [];
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        $html.find('#tblDocumentos tbody tr.infraTrClara').each(function () { 
            var a = $(this).find('td').eq(1).find('a');
            if ( a.attr('href') ) {
                documentos.push({
                    id_documento: getParamsUrlPro(a.attr('href')).id_documento,
                    id_protocolo: getParamsUrlPro(a.attr('href')).id_protocolo,
                    nr_sei: a.text(),
                    nome_documento: $(this).find('td').eq(2).text(),
                    documento: $(this).find('td').eq(2).text(),
                    data_assinatura: $(this).find('td').eq(3).text(),
                    assinatura: undefined,
                    sigilo: undefined,
                    nativo: undefined
                });
            }
        });
        dadosProcessoPro.listDocumentosAssinados = documentos;
        if (typeof callback === 'function') callback(documentos);
    });
}
function ajaxDadosProcessoPro(href, mode) {
    var processo = {};
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        processo.action = $html.find("#frmProcedimentoCadastro").attr('action');
        processo.selAssuntos_select = $html.find("#selAssuntos option").map(function () { return $(this).text(); }).get();
        processo.selTipoProcedimento_select = $html.find("#selTipoProcedimento option").map(function () { return {id: $(this).val(), name: $(this).text() }; }).get();
        processo.selHipoteseLegal_select = $html.find("#selHipoteseLegal option").map(function () { return {id: $(this).val(), name: $(this).text() }; }).get();
        $html.find('form input[type=hidden]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('hdn') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        $html.find('form input[type=text]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        $html.find('form select').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        processo.selInteressadosProcedimento = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();
        processo.selInteressadosProcedimento_list = $html.find("#selInteressadosProcedimento option").map(function () { return {name: $(this).text(), value: $(this).attr('value')} }).get();
        processo.selAssuntos = $html.find("#selAssuntos option").map(function () { return $(this).text(); }).get();
        processo.rdoNivelAcesso = $html.find('input[name=rdoNivelAcesso]:checked').val();
        processo.urlHipoteseLegal = getUrlHipoteseLegal(html);
        
        /*
        var arrayObs = [{unidade: unidade, observacao: $html.find('#txaObservacoes').val()}];
        if ($html.find('#divObservacoesOutras').length > 0) { 
            var arrayObs1 = $html.find('#divObservacoesOutras').find('tbody tr').map(function () { if ($(this).find('td').eq(0).text() != '') { return {unidade: $(this).find('td').eq(0).text(), observacao: $(this).find('td').eq(1).text()} } }).get();
            Array.prototype.push.apply(arrayObs,arrayObs1);
        }
        processo.txaObservacoes = arrayObs;
        */        

        var txtObs = $html.find('#txaObservacoes').val();
            txtObs = (txtObs.indexOf('\n') !== -1) 
                    ? $.map(txtObs.split('\n'), function(substr, i) { if (substr.charAt(0) != '#') { return substr.trim() } }).join(' ') 
                    : (txtObs.charAt(0) != '#') ? txtObs : '';
        var arrayObs = [{unidade: unidade, observacao: txtObs}];
        if ($html.find('#divObservacoesOutras').length > 0) { 
            var arrayObsList = $html.find('#divObservacoesOutras').find('tbody tr').map(function () { 
                                    if ($(this).find('td').eq(0).text() != '') { 
                                        var txtObsTd = $(this).find('td').eq(1).text();
                                            txtObsTd = (txtObsTd.indexOf('\n') !== -1) 
                                                    ? $.map(txtObsTd.split('\n'), function(substr, i) { if (substr.charAt(0) != '#') { return substr.trim() } }).join(' ') 
                                                    : (txtObsTd.charAt(0) != '#') ? txtObsTd : '';
                                        return {unidade: $(this).find('td').eq(0).text(), observacao: txtObsTd} 
                                    } 
                                }).get();
                if (arrayObsList.length > 0) { Array.prototype.push.apply(arrayObs,arrayObsList) }
        }
        processo.txaObservacoes = arrayObs;
        
        var tagsObs = $html.find('#txaObservacoes').val();
            tagsObs = (tagsObs.indexOf('\n') !== -1) 
                    ?   $.map(tagsObs.split('\n'), function(substr, i) { if (substr.charAt(0) == '#') { 
                            return (substr.indexOf(':') !== -1) ? [{name: removeAcentos(substr.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: substr.split(':')[1].trim()}] : null;
                        } })
                    : (tagsObs.charAt(0) == '#') 
                           ? (tagsObs.indexOf(':') !== -1) ? [{name: removeAcentos(tagsObs.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: tagsObs.split(':')[1].trim()}] : null
                           : null;
        var arrayTags = (tagsObs !== null) ? [{unidade: unidade, tags: tagsObs}] : null; 
        if ($html.find('#divObservacoesOutras').length > 0) { 
            var arrayTagsList = $html.find('#divObservacoesOutras').find('tbody tr').map(function () { 
                                    if ($(this).find('td').eq(0).text() != '') { 
                                        var tagsObsTd = $(this).find('td').eq(1).text();
                                            tagsObsTd = (tagsObsTd.indexOf('\n') !== -1) 
                                                    ? $.map(tagsObsTd.split('\n'), function(substr, i) { 
                                                        if (substr.charAt(0) == '#') { 
                                                            return (substr.indexOf(':') !== -1) ? [{name: removeAcentos(substr.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: substr.split(':')[1].trim()}] : null;
                                                        } })
                                                    : (tagsObsTd.charAt(0) == '#') 
                                                        ? (tagsObsTd.indexOf(':') !== -1) ? [{name: removeAcentos(tagsObsTd.split(':')[0].replace('#','')).replace(/\ /g, '').toLowerCase().trim(), value: tagsObsTd.split(':')[1].trim()}] : null
                                                        : null;
                                        return (tagsObsTd !== null) ? {unidade: $(this).find('td').eq(0).text(), tags: tagsObsTd} : null
                                    } 
                                }).get();
                if (typeof arrayTags !== 'undefined' && arrayTags !== null && typeof arrayTagsList !== 'undefined' && arrayTagsList !== null && arrayTagsList.length > 0) { Array.prototype.push.apply(arrayTags,arrayTagsList) }
        }
        processo.txaTagsObservacoes = arrayTags;
        
        dadosProcessoPro.propProcesso = processo;

        if (checkConfigValue('historicoproc')) {
            setHistoryProcessosPro(dadosProcessoPro);
        }
        // console.log(processo);
        setTimeout(function(){ 
            updateTitlePage(mode);
        }, 500);
        if (mode == 'editor' || mode == 'gantt' || mode == 'dados' || mode == 'processo') { 
            checkDadosIframeDocumentosPro(mode);
        }
        if (mode == 'processo') { 
            setTimeout(function(){ resizeArvoreMaxWidth() }, 500);
        }
    }).fail(function(data){
        console.log(dadosProcessoPro.propProcesso, 'Erro ao acessar dadosProcessoPro.propProcesso');
    });
}
function getUrlHipoteseLegal(html) {
    var word = 'hipotese_legal_select_nome_base_legal';
    var reg = new RegExp("'(.*?"+word+".*?)'", 'g');
    if (reg.test(html)) { 
        var urlHipotese = html.match(reg);
            urlHipotese = (typeof urlHipotese !== 'undefined' && urlHipotese !== null && urlHipotese.length > 0) ? urlHipotese[0].split("'")[3].trim() : false;
        return urlHipotese;
    } else {
        return false;
    }
}
function getHipoteseLegal(urlHipoteseLegal = dadosProcessoPro.propProcesso.urlHipoteseLegal, nivelAcesso = 1, callback = false) {
    $.ajax({
        type: "POST",
        url: urlHipoteseLegal,
        dataType: 'text',
        data: {
            primeiroItemValor: null,
            primeiroItemDescricao: '',
            valorItemSelecionado: '',
            staNivelAcesso: parseInt(nivelAcesso)
        },
        success: function(result){
            var html_result = $(result.replace('<?xml version="1.0" encoding="iso-8859-1"?>','')).html();
            if (html_result != '' && typeof callback === 'function') {
                callback(html_result);
            }
        }
    });
}
function checkDadosIframeDocumentosPro(mode) {
    var i = 0;
    var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore').contents();
        ifrArvore.find('#topmenu a').each(function(index){
            var href = $(this).attr('href');
            if (typeof href !== 'undefined' && href.indexOf('&abrir_pastas=1') !== -1) {
                i = 1;
                $('#frmCheckerProcessoPro').attr('src', href).unbind().on('load', function(){
                    var ifrArvoreOpen = $('#frmCheckerProcessoPro').contents();
                        $(this).contents().find('head').append("<script data-config='config-seipro-checker'>function atualizarVisualizacao(){ return; }</script>");
                        arrayDadosIframeDocumentosPro(ifrArvoreOpen, mode);
                });
            }
        });
        if ( i == 0 ) { arrayDadosIframeDocumentosPro(ifrArvore, mode) }
}
function arrayDadosIframeDocumentosPro(ifrArvore, mode) {
    getListDocumentosArvore(ifrArvore);
    if (mode == 'editor') { 
        getDialogCitacaoDocumento();
        getDialogDadosEditor();
        insertAutomaticMinutaWatermark();
    } else if (mode == 'gantt') { 
        updateSelectConcluirEtapa();
    } else if (mode == 'favorites') {
        parent.updateSelectFavorites();
        parent.initAppendIconFavorites();
        console.log('updateSelectFavorites');
    } else if (mode == 'dados') {
        //loopIDProcedimentos();
    }
    setSessionProcessosPro(dadosProcessoPro);
    if ($('#actionsTablePro').length) {
        getDocumentosActions();
    }
}
function getListDocumentosArvore(ifrArvore) {
    var processo = [];
    ifrArvore.find('#divArvore a[target=ifrVisualizacao]').each(function(index){
        var txt = $(this).text().trim();
        var text = txt.split(' ');
        var id_protocolo = $(this).attr('id').replace('anchor','');
        var nr_sei = (txt.indexOf(' ') !== -1) ? text[text.length-1] : '';
        var documento = txt.replace(nr_sei, '').trim();
            nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','') : nr_sei;
        var assinatura = (ifrArvore.find('#anchorA'+id_protocolo).length) ? ifrArvore.find('#anchorA'+id_protocolo+' img').attr('title').replace('Assinado por:','').trim() : '';
        var sigilo = (ifrArvore.find('#iconNA'+id_protocolo).length) ? ifrArvore.find('#iconNA'+id_protocolo+'').attr('title').trim() : '';
        var data_assinatura =   (!$.isEmptyObject(dadosProcessoPro.listDocumentosAssinados) && jmespath.search(dadosProcessoPro.listDocumentosAssinados, "[?id_documento=='"+id_protocolo+"'].data_assinatura | length(@)") > 0)
                                ? jmespath.search(dadosProcessoPro.listDocumentosAssinados, "[?id_documento=='"+id_protocolo+"'].data_assinatura | [0]")
                                : '';
        var nativo = (ifrArvore.find('#anchorImg'+id_protocolo+' img[src*="sei_documento_interno.gif"]').length) ? true : false;
        if (id_protocolo.indexOf('CD') === -1) { 
            processo.push({ id_protocolo: id_protocolo, nr_sei: nr_sei, documento: documento, assinatura: assinatura, data_documento: (data_assinatura && data_assinatura != '' ? moment(data_assinatura, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss') : false), data_assinatura: data_assinatura, sigilo: sigilo, nativo: nativo });
        }
    });
    dadosProcessoPro.listDocumentos = processo;
    setSessionProcessosPro(dadosProcessoPro);
}
function getHistoryProcessosPro() {
    $('#divInfraBarraSistemaE.barSuspenso').trigger('click');
    var dadosHistoricoProcessoPro = localStorageRestorePro('dadosHistoricoProcessoPro');
        var htmlBox =       '<div id="boxHistory" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">'+
                            '   <table id="historyTablePro" style="margin-top: 35px; font-size: 8pt !important;width: 100%;" class="seiProForm tableAtividades tableDialog tableInfo tableZebra">'+
                            '        <thead>'+
                            '            <tr class="tableHeader">'+
                            '                <th class="tituloControle" style="text-align: center; width: 180px;">Processo</th>'+
                            '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Tipo / Descri\u00E7\u00E3o</th>'+
                            '                <th class="tituloControle" style="text-align: center;font-weight: bold;">Acesso</th>'+
                            '            </tr>'+
                            '        </thead>'+
                            '        <tbody>';
        if (dadosHistoricoProcessoPro){
            $.each(dadosHistoricoProcessoPro, function(i, v){
                htmlBox +=  '   <tr style="text-align: left;">'+
                            '       <td>'+
                            '           <a style="margin-left: 5px;" href="'+url_host+'?acao=procedimento_trabalhar&id_procedimento='+v.id_procedimento+'" target="_blank">'+
                            '               <span class="bLink">'+
                            '                   '+v.protocolo+
                            '                   <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i>'+
                            '               </span>'+
                            '           </a>'+
                            '       </td>'+
                            '       <td>'+
                            '           <div style="color: #666; padding-top: 5px;">'+v.tipo_processo+'</div>'+
                            '           <div style="font-weight: bold; padding: 5px 0;">'+v.descricao+'</div>'+
                            '       <td data-time-sorter="'+v.datetime+'">'+
                            '           <div onmouseover="return infraTooltipMostrar(\'Acessado em '+moment(v.datetime,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm')+'\');" onmouseout="return infraTooltipOcultar();">'+
                            '               '+getDatesPreview({date: v.datetime})+
                            '           </div>'+
                            '       <td>'+
                            '   </tr>';
            });
        }
        htmlBox +=          '   </table>'+
                            '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Hist\u00F3rio de Processos Visitados',
            width: 980,
            height: 450,
            close: function() { 
                $('#boxHistory').remove();
                resetDialogBoxPro('dialogBoxPro');
            }
    });
    setTimeout(function(){ 
        var historyTable = $('#historyTablePro');
            historyTable.tablesorter({
                sortList: [[2,1]],
                textExtraction: {
                    2: function (elem, table, cellIndex) {
                        var text_date = $(elem).data('time-sorter');
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
                    0: { sorter: true},
                    1: { filter: true },
                    2: { filter: true }
                }
            }).on("filterEnd", function (event, data) {
                checkboxRangerSelectShift();
                var caption = $(this).find("caption").eq(0);
                var tx = caption.text();
                    caption.text(tx.replace(/\d+/g, data.filteredRows));
                    $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                    $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
            });
            initPanelResize('#boxHistory', 'historicoPro');

        var filterHistory = historyTable.find('.tablesorter-filter-row').get(0);
        if (typeof filterHistory !== 'undefined') {
            var observerFilterHistory = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterTableHistory button');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });
            setTimeout(function(){ 
                var htmlFilterHistory =    '<div class="btn-group filterTableHistory" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">'+
                                            '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Baixar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Copiar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="cleanHistoryPro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Apagar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-trash-alt" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                            '       Apagar'+
                                            '   </button>'+
                                            '   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(historyTable.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                            '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                            '       Pesquisar'+
                                            '   </button>'+
                                            '</div>';
                    historyTable.find('thead .filterTableHistory').remove();
                    historyTable.find('thead').prepend(htmlFilterHistory);
                    observerFilterHistory.observe(filterHistory, {
                        attributes: true
                    });
                    historyTable.find('.tablesorter-filter-row input.tablesorter-filter').eq(2).attr('type','date');
            }, 500);
        }
    }, 500);
}
function getAllLinksFolder() {
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
        ifrArvore.find('a[id*="ancjoin"]').each(function(){
            if ($(this).find('img').attr('src').indexOf('plus.gif') !== -1) {
                var idPasta = $(this).attr('id').replace('ancjoin','');
                _ifrArvore[0].contentWindow.getLinksArvorePasta(idPasta); 
            } 
        });
        _ifrArvore[0].contentWindow.getLinksArvore();
}
function mergeAllAndamentosProcesso(callback = false) {
    // if (typeof dadosProcessoPro.listAndamento !== 'undefined' && typeof dadosProcessoPro.listAndamento.historico_completo !== 'undefined' && dadosProcessoPro.listAndamento.historico_completo) {
        // if (typeof callback === 'function') callback();
    // } else {
        var _ifrArvore = $('#ifrArvore');
        var ifrArvore = _ifrArvore.contents();
        var arrayLinksArvoreAll = _ifrArvore[0].contentWindow.arrayLinksArvoreAll;
        var id_procedimento = getParamsUrlPro(_ifrArvore.attr('src')).id_procedimento;
        var processo = ifrArvore.find("a[target='ifrVisualizacao']").eq(0).text().trim();
        var linkHistorico = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('procedimento_consultar_historico') !== -1) });
        if (linkHistorico.length > 0) {
            var listProc = {processo: processo, id_procedimento: id_procedimento};
            getDadosHistoricoUrlPro(linkHistorico[0], listProc, true, function(andamento){
                dadosProcessoPro.listAndamento = andamento;
                $.each(dadosProcessoPro.listDocumentos, function(index, value){
                    var data_documento = jmespath.search(dadosProcessoPro.listAndamento.andamento, "[?id_documento=='"+value.id_protocolo+"'] | [?contains(descricao, 'Gerado documento')] | [0].datahora");
                        data_documento = (data_documento !== null) ? data_documento : false;
                    var assinatura = jmespath.search(dadosProcessoPro.listAndamento.andamento, "[?id_documento=='"+value.id_protocolo+"'] | [?contains(descricao, 'Assinado')||contains(descricao, 'assinatura')]");
                    var data_assinatura = (assinatura !== null) ? assinatura : false;
                        data_assinatura = (data_assinatura && data_assinatura.length > 0 && typeof data_assinatura[0].descricao !== 'undefined' && data_assinatura[0].descricao.indexOf('Assinado Documento') !== -1) 
                            ? data_assinatura[0].datahora 
                            : dadosProcessoPro.listDocumentos[index]['data_assinatura'];
                        data_assinatura = (data_assinatura && data_assinatura.length > 0 && typeof data_assinatura[0].descricao !== 'undefined' && data_assinatura[0].descricao.indexOf('Cancelamento de assinatura') !== -1) 
                            ? false 
                            : data_assinatura;
                    var assinado = (assinatura && assinatura !== null && assinatura.length > 0 && typeof assinatura[0].descricao !== 'undefined' && assinatura[0].descricao.indexOf('Assinado Documento') !== -1) ? true : false;
                    var unidade = jmespath.search(dadosProcessoPro.listAndamento.andamento, "[?id_documento=='"+value.id_protocolo+"'] | [?contains(descricao, 'Gerado documento')] | [0].unidade");
                        unidade = (unidade !== null) ? unidade : false;
                        
                    dadosProcessoPro.listDocumentos[index]['unidade'] = unidade;
                    dadosProcessoPro.listDocumentos[index]['data_assinatura'] = data_assinatura;
                    dadosProcessoPro.listDocumentos[index]['data_documento'] = data_documento;
                    dadosProcessoPro.listDocumentos[index]['assinado'] = assinado;
                    // console.log(index, value.id_protocolo, unidade, dadosProcessoPro.listDocumentos);
                });
                dadosProcessoPro.listAndamento.historico_completo = true;
                setSessionProcessosPro(dadosProcessoPro);
                if (typeof callback === 'function') callback();
            });
        }
    // }
}
function batchActionsPro(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var _table = _parent.find('.tableDialog');
    var btnData = _this.data();
    var checkboxList = _table.find('tr.'+btnData.action).find('input[type="checkbox"]:checked').map(function(){ return $(this).val() }).get();

    window.loopActionsPro = {list: checkboxList, index: 0, sigilo: {}, assinatura: {}};
    $('#frmCheckerProcessoPro').remove();

    if (btnData.action !== 'documento_alterar' && btnData.action !== 'documento_assinar' && checkboxList.length > 0 && _parent.find('#iconsActions i.fa-spin').length == 0) {
        if (btnData.action == 'documento_excluir') {
            confirmaBoxPro('Tem certeza que deseja excluir '+(checkboxList.length > 1 ? 'os documentos selecionados' : 'o documento selecionado')+'?', function() { 
                getBatchActionsPro(this_);
                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
            }, 'Excluir');
        } else if (btnData.action == 'editor_montar') {
            confirmaBoxPro('Tem certeza que deseja cancelar a assinatura '+(checkboxList.length > 1 ? 'dos documentos selecionados' : 'do documento selecionado')+'?', function() { 
                getBatchActionsPro(this_);
                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
            }, 'Cancelar Assinatura');
        } else {   
            getBatchActionsPro(this_);
            _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
        }
    } else if (btnData.action == 'documento_assinar' && checkboxList.length > 0 && _parent.find('#iconsActions i.fa-spin').length == 0) {
        var arrayLinksArvoreAll = $('#ifrArvore')[0].contentWindow.arrayLinksArvoreAll;
        var linkDoc = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('acao=arvore_visualizar') !== -1 && v.indexOf('id_documento='+checkboxList[0]) !== -1) });
        if (linkDoc.length > 0) {
                $.ajax({ url: linkDoc[0] }).done(function (htmlDoc) {
                    var $htmlDoc = $(htmlDoc);
                    var textLink = $htmlDoc.filter('script').not('[src*="js"]').text();
                    var arrayLinksArvoreDoc = getLinksInText(textLink);
                    var linkAssinar = arrayLinksArvoreDoc.filter(function(v){ return v.indexOf('documento_assinar') !== -1 });
                    if (linkAssinar.length > 0) {
                        $.ajax({ url: linkAssinar[0] }).done(function (htmlAssinar) {
                            var $htmlAssinar = $(htmlAssinar);
                            var selOrgao = $htmlAssinar.find('#selOrgao option').map(function(){ if ($(this).val() !== 'null') { return {value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr('selected') } } }).get();
                            var selContexto = $htmlAssinar.find('#selContexto option').map(function(){ if ($(this).val() !== 'null') { return {value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr('selected') } } }).get();
                            var selCargoFuncao = $htmlAssinar.find('#selCargoFuncao option').map(function(){ if ($(this).val() !== 'null') { return {value: $(this).val(), txt: $(this).text().trim(), selected: $(this).attr('selected') } } }).get();
                            // console.log(selOrgao, selContexto, selCargoFuncao);
                            var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                                            '   <div class="configBoxPro_selOrgao">'+
                                            '       <label style="margin-bottom: 10px;display: block;">\u00D3rg\u00E3o do Assinante</label>'+
                                            '       <select id="configBoxPro_selOrgao" style="font-size: 10pt; width: 100%;">'+
                                            ($.map(selOrgao, function(v){ return '<option value="'+v.value+'" '+(v.selected ? v.selected : '')+'>'+v.txt+'</option>' }).join(''))+
                                            '       </select>'+
                                            '   </div>'+
                                            '   <div class="configBoxPro_selContexto" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Contexto do Assinante</label>'+
                                            '       <select id="configBoxPro_selContexto" style="font-size: 10pt; width: 100%;">'+
                                            ($.map(selContexto, function(v){ return '<option value="'+v.value+'" '+(v.selected ? v.selected : '')+'>'+v.txt+'</option>' }).join(''))+
                                            '       </select>'+
                                            '   </div>'+
                                            '   <div class="configBoxPro_selCargoFuncao" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Cargo / Fun\u00E7\u00E3o</label>'+
                                            '       <select id="configBoxPro_selCargoFuncao" style="font-size: 10pt; width: 100%;">'+
                                            ($.map(selCargoFuncao, function(v){ return '<option value="'+v.value+'" '+(v.selected ? v.selected : '')+'>'+v.txt+'</option>' }).join(''))+
                                            '       </select>'+
                                            '   </div>'+
                                            '   <div class="configBoxPro_pwdSenha" style="margin-top:20px">'+
                                            '       <label style="margin-bottom: 10px;display: block;">Senha</label>'+
                                            '       <input id="configBoxPro_pwdSenha" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" autocomplete="off" type="password" style="font-size: 10pt; width: 96%;">'+
                                            '   </div>'+
                                            '</div>';
                                resetDialogBoxPro('configBoxPro');
                                configBoxPro = $('#configBoxPro')
                                    .html('<div class="configBoxProDiv"> '+textBox+'</span>')
                                    .dialog({
                                        width: 450,
                                        title: 'Assinatura em lote',
                                        open: function(){
                                            $('#configBoxPro_selOrgao').chosen({ placeholder_text_single: ' ', no_results_text: 'Nenhum resultado encontrado' });
                                            if (selContexto.length > 0) {
                                                $('#configBoxPro_selContexto').chosen({ placeholder_text_single: ' ', no_results_text: 'Nenhum resultado encontrado' });
                                            } else {
                                                $('.configBoxPro_selContexto').hide();
                                            }
                                            $('#configBoxPro_selCargoFuncao').chosen({ placeholder_text_single: ' ', disable_search: true, no_results_text: 'Nenhum resultado encontrado' });
                                            $('.ui-dialog[aria-describedby="configBoxPro"], #configBoxPro').css('overflow','visible');
                                            $('#configBoxPro_pwdSenha').focus();
                                        },
                                        buttons: [{
                                            text: "Assinar",
                                            class: 'confirm ui-state-active',
                                            click: function() {
                                                loadingButtonConfirm(true);
                                                var selOrgaoForm = $('#configBoxPro_selOrgao').val();
                                                var selContextoForm = $('#configBoxPro_selContexto').val();
                                                var selCargoFuncaoForm = $('#configBoxPro_selCargoFuncao').val();
                                                var pwdSenhaForm = $('#configBoxPro_pwdSenha').val();

                                                loopActionsPro.assinatura = {orgao: selOrgaoForm, contexto: selContextoForm, cargo: selCargoFuncaoForm, senha: pwdSenhaForm };
                                                getBatchActionsPro(this_);
                                                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
                                                resetDialogBoxPro('configBoxPro');
                                            }
                                        }]
                                });
                        });
                    }
                });
        }
    } else if (btnData.action == 'documento_alterar' && checkboxList.length > 0 && _parent.find('#iconsActions i.fa-spin').length == 0) {
        var textBox =   '<div class="dialogBoxDiv seiProForm">'+
                        '   <select id="configBoxProSigiloBatch" onchange="changeSelectHipoteseLegal(this)" style="font-size: 10pt; width: 100%;">'+
                        '       <option value="0" selected>P\u00FAblico</option>'+
                        '       <option value="1">Restrito</option>'+
                        '       <option value="2">Sigiloso</option>'+
                        '   </select>'+
                        '   <div style="margin-top:20px">'+
                        '       <select id="configBoxProSigiloBatch_hipoteses" class="select_hipoteses" style="font-size: 10pt; width: 100%; margin-top:20px;display:none;">'+
                        '       </select>'+
                        '   </div>'+
                        '</div>';
            resetDialogBoxPro('configBoxPro');
            configBoxPro = $('#configBoxPro')
                .html('<div class="configBoxProDiv"> '+textBox+'</span>')
                .dialog({
                    width: 450,
                    title: 'N\u00EDvel de acesso',
                    open: function(){
                        $('#configBoxProSigiloBatch').chosen({
                            placeholder_text_single: ' ',
                            no_results_text: 'Nenhum resultado encontrado'
                        });
                        $('.ui-dialog[aria-describedby="configBoxPro"], #configBoxPro').css('overflow','visible');
                    },
                    buttons: [{
                        text: "Editar",
                        class: 'confirm ui-state-active',
                        click: function() {
                            loadingButtonConfirm(true);
                            var value = $('#configBoxProSigiloBatch').val().trim();
                            var hipotese = $('#configBoxProSigiloBatch_hipoteses').val() !== null ? $('#configBoxProSigiloBatch_hipoteses').val().trim() : false;
                            var text = (value == '0') ? '' : 'Acesso '+$('#configBoxProSigiloBatch').find('option:selected').text()+' '+$('#configBoxProSigiloBatch_hipoteses').find('option:selected').text();
                            var elementOption = (value == '0') ? 'optPublico' : false;
                                elementOption = (value == '2') ? 'optSigiloso' : elementOption;
                                elementOption = (value == '1') ? 'optRestrito' : elementOption;

                                loopActionsPro.sigilo = {value: value, hipotese: hipotese, element: elementOption, text: text };
                                getBatchActionsPro(this_);
                                _this.data('lastclass',_this.find('i').attr('class')).find('i').attr('class', 'fas fa-sync fa-spin cinzaColor');
                                resetDialogBoxPro('configBoxPro');
                        }
                    }]
            });
    }
}
function getBatchActionsPro(this_) {
    var id_documento = loopActionsPro.list[loopActionsPro.index];
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var _table = _parent.find('.tableDialog');
    var _ifrArvore = $('#ifrArvore');
    var ifrArvore = _ifrArvore.contents();
    var arrayLinksArvoreAll = _ifrArvore[0].contentWindow.arrayLinksArvoreAll;
    var arrayIconsView = _ifrArvore[0].contentWindow.arrayIconsView;
    var doc = arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('acao=arvore_visualizar') !== -1 && v.indexOf('id_documento='+id_documento) !== -1) });
    if (doc.length > 0) {
            var tr = _table.find('tr[data-index="'+id_documento+'"]');
                td_doc = tr.find('td.documento');
                tr.find('td.documento').prepend('<i class="fas fa-sync fa-spin azulColor batchLoading"></i> ');
                $.ajax({ url: doc[0] }).done(function (html) {
                    var id_documento = loopActionsPro.list[loopActionsPro.index];
                    var $html = $(html);
                    var textLink = $html.filter('script').not('[src*="js"]').text();
                    var arrayLinksArvoreDoc = getLinksInText(textLink);
                    var btnData = _this.data();
                    var linkAction = arrayLinksArvoreDoc.filter(function(v){ return (v.indexOf('acao='+btnData.action) !== -1) });
                        linkAction = (linkAction.length == 0) ? arrayLinksArvoreAll.filter(function(v){ return (v.indexOf('id_documento='+id_documento) !== -1 && v.indexOf(btnData.action) !== -1) }) : linkAction;
                    var listIconsView = (arrayIconsView.length > 0) ? jmespath.search(arrayIconsView, "[?id_documento==`"+id_documento+"`] | [0].icones") : null;
                        listIconsView = (listIconsView === null) ? [] : listIconsView;
                    var checkIconView = listIconsView.filter(function(v){ return v.indexOf(btnData.icon) !== -1 });
                    
                    // console.log(btnData.action, arrayLinksArvoreDoc, linkAction, linkAction.length, checkIconView.length);

                    if (btnData.action !== 'documento_alterar' && btnData.action !== 'documento_assinar' && btnData.action !== 'documento_duplicar' && linkAction.length > 0 && checkIconView.length > 0) {
                        $.ajax({ url: linkAction }).done(function (htmlArvore) {
                            var id_documento = loopActionsPro.list[loopActionsPro.index];
                            tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                            tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                            tr.find('input').prop('checked',false);
                            if (btnData.action == 'documento_excluir') {
                                dadosProcessoPro.listDocumentos
                                tr.removeClass('documento_excluir').find('input').prop('disabled', true);
                                tr.find('td.icons').html('');
                                ifrArvore.find('#anchorImg'+id_documento).prev().remove().end().prev().remove();
                                ifrArvore.find('#anchorImg'+id_documento+', #anchor'+id_documento+', .action-doc[data-id="'+id_documento+'"], #anchorCD'+id_documento).remove();
                            } else if (btnData.action == 'editor_montar') {
                                ifrArvore.find('#anchorA'+id_documento).remove();
                                tr.find('td.icons').find('a[data-action="editor_montar"]').remove();
                                tr.find('td.assinatura').html('');
                                tr.find('td.data_assinatura').html('');
                            }
                            var objIndexDoc = (typeof dadosProcessoPro.listDocumentos === 'undefined' || dadosProcessoPro.listDocumentos.length == 0) ? -1 : dadosProcessoPro.listDocumentos.findIndex((obj => obj.id_protocolo == id_documento));
                            if (objIndexDoc !== -1) {
                                if (btnData.action == 'documento_excluir') {
                                    dadosProcessoPro.listDocumentos.splice(objIndexDoc, 1);
                                } else if (btnData.action == 'editor_montar') {
                                    dadosProcessoPro.listDocumentos[objIndexDoc].assinatura = '';
                                    dadosProcessoPro.listDocumentos[objIndexDoc].data_assinatura = '';
                                }
                            }
                            setSessionProcessosPro(dadosProcessoPro);

                            loopActionsPro.index = loopActionsPro.index+1;
                            if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                getBatchActionsPro(this_);
                            } else {
                                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                document.getElementById('ifrArvore').contentWindow.location.reload();
                                initAppendIconsDocumentosActions();
                            }
                        });
                    } else if (btnData.action === 'documento_duplicar' && checkIconView.length > 0) {
                        var id_documento = loopActionsPro.list[loopActionsPro.index];

                        function resetDocsActions(){
                            window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                            $(this_).find('i').attr('class', $(this_).data('lastclass'));
                            setTimeout(function(){ 
                                document.getElementById('ifrArvore').contentWindow.location.reload();
                                initAppendIconsDocumentosActions();
                            }, 1000);
                        }
                        
                        if (typeof id_documento !== 'undefined') {
                            console.log(id_documento, tr[0], loopActionsPro, loopActionsPro, loopActionsPro.index, loopActionsPro.list[loopActionsPro.index]);
                            $('#ifrArvore')[0].contentWindow.getDadosDoc($('#ifrArvore').contents().find('#anchor'+id_documento), false, false, 
                            function(){
                                tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                                tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                                tr.find('input').prop('checked',false);
                                loopActionsPro.index = loopActionsPro.index+1;
                                console.log(loopActionsPro.list[loopActionsPro.index]);
                                getBatchActionsPro(this_);
                                if (typeof loopActionsPro.list[loopActionsPro.index] === 'undefined') {
                                    resetDocsActions();
                                }
                            }, function(){
                                tr.find('i.batchLoading').remove();
                                tr.find('td.documento').prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
                                loopActionsPro.index = loopActionsPro.index+1;
                                console.log(loopActionsPro.list[loopActionsPro.index]);
                                getBatchActionsPro(this_);
                                if (typeof loopActionsPro.list[loopActionsPro.index] === 'undefined') {
                                    resetDocsActions();
                                }
                            });
                        } else if (typeof id_documento === 'undefined' || typeof loopActionsPro.list[loopActionsPro.index+1] === 'undefined') {
                            resetDocsActions();
                        }
                    } else if (btnData.action === 'documento_assinar' && linkAction.length > 0 && checkIconView.length > 0) {
                        var orgao = loopActionsPro.assinatura.orgao;
                        var contexto = loopActionsPro.assinatura.contexto;
                        var cargo = loopActionsPro.assinatura.cargo;
                        var senha = loopActionsPro.assinatura.senha;

                        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
                        $('#frmCheckerProcessoPro').attr('src', linkAction[0]).unbind().on('load', function(){
                            var iframe = $(this).contents();
                            var usuario = iframe.find('#txtUsuario').val();
                                iframe.find('#selOrgao').val(orgao);
                                iframe.find('#selContexto').val(contexto);
                                iframe.find('#selCargoFuncao').val(cargo);
                                iframe.find('#pwdSenha').val(senha);
                            var assinatura = usuario+' / '+cargo;
                            var data_assinatura = moment().format('DD/MM/YYYY HH:mm');
                            
                            $(this).unbind();
                            iframe.find('#btnAssinar').trigger('click');

                            $('#frmCheckerProcessoPro').on('load', function(){
                                $(this).unbind();
                                var _validacao = $(this).contents().find('#txaInfraValidacao');

                                if (_validacao.length > 0 && _validacao.val() != '') {
                                    tr.find('i.batchLoading').remove();
                                    tr.find('td.documento').prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');
            
                                    loopActionsPro.index = loopActionsPro.index+1;
                                    if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                        getBatchActionsPro(this_);
                                    } else {
                                        window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                        $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                        document.getElementById('ifrArvore').contentWindow.location.reload();
                                        initAppendIconsDocumentosActions();
                                    }
                                } else {
                                    tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                                    tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                                    tr.find('td.assinatura').html(assinatura);
                                    tr.find('td.data_assinatura').html(data_assinatura);
                                    tr.find('input').prop('checked',false);

                                    var objIndexDoc = (typeof dadosProcessoPro.listDocumentos === 'undefined' || dadosProcessoPro.listDocumentos.length == 0) ? -1 : dadosProcessoPro.listDocumentos.findIndex((obj => obj.id_protocolo == id_documento));
                                    if (objIndexDoc !== -1) {
                                        dadosProcessoPro.listDocumentos[objIndexDoc].assinatura = assinatura;
                                        dadosProcessoPro.listDocumentos[objIndexDoc].data_assinatura = data_assinatura;
                                    }
                                    setSessionProcessosPro(dadosProcessoPro);

                                    loopActionsPro.index = loopActionsPro.index+1;
                                    if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                            getBatchActionsPro(this_);
                                    } else {
                                        window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                        $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                        setTimeout(function(){ 
                                            document.getElementById('ifrArvore').contentWindow.location.reload();
                                            initAppendIconsDocumentosActions();
                                        }, 1000);
                                    }
                                }
                            });
                        });
                    } else if (btnData.action === 'documento_alterar' && linkAction.length > 0 && checkIconView.length > 0) {
                        var idElement = loopActionsPro.sigilo.element;
                        var hipotese = loopActionsPro.sigilo.hipotese;
                        var text_hipotese = loopActionsPro.sigilo.text;

                        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
                        $('#frmCheckerProcessoPro').attr('src', linkAction[0]).unbind().on('load', function(){
                            var iframe = $(this).contents();
                            var element = iframe.find('#'+idElement);
                                element.prop('checked',true).trigger('change');
                            if (idElement == 'optRestrito' || idElement == 'optSigiloso') {
                                iframe.find('#selHipoteseLegal').after('<input id="selHipoteseLegal" value="'+hipotese+'" name="selHipoteseLegal"></input>').remove();
                            }
                            
                            $(this).unbind();
                            if (iframe.find('button[type="submit"]').length > 0) {
                                iframe.find('button[type="submit"]').trigger('click');
                            } else {
                                iframe.find('button[name="btnSalvar"]').trigger('click');
                            }
                            tr.removeClass('infraTrMarcada').find('i.batchLoading').remove();
                            tr.find('td.documento').prepend('<i class="fas fa-check-circle verdeColor batchLoading"></i> ');
                            tr.find('td.sigilo').html(text_hipotese);
                            tr.find('input').prop('checked',false);

                            var objIndexDoc = (typeof dadosProcessoPro.listDocumentos === 'undefined' || dadosProcessoPro.listDocumentos.length == 0) ? -1 : dadosProcessoPro.listDocumentos.findIndex((obj => obj.id_protocolo == id_documento));
                            if (objIndexDoc !== -1) {
                                dadosProcessoPro.listDocumentos[objIndexDoc].sigilo = text_hipotese;
                            }
                            setSessionProcessosPro(dadosProcessoPro);

                            loopActionsPro.index = loopActionsPro.index+1;
                            if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                                getBatchActionsPro(this_);
                            } else {
                                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                                $(this_).find('i').attr('class', $(this_).data('lastclass'));
                                initAppendIconsDocumentosActions();
                            }
                        });
                    } else {
                        tr.find('i.batchLoading').remove();
                        tr.find('td.documento').prepend('<i class="fas fa-times-circle vermelhoColor batchLoading"></i> ');

                        loopActionsPro.index = loopActionsPro.index+1;
                        if (typeof loopActionsPro.list[loopActionsPro.index] !== 'undefined') {
                            getBatchActionsPro(this_);
                        } else {
                            window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
                            $(this_).find('i').attr('class', $(this_).data('lastclass'));
                            document.getElementById('ifrArvore').contentWindow.location.reload();
                            initAppendIconsDocumentosActions();
                        }
                    }
                });
    }
}
function getDocumentosActions() {
    var dadosProcesso = getDadosProcessoSession();
    var listDocumentos = (dadosProcesso) ? dadosProcesso.listDocumentos : dadosProcessoPro.listDocumentos;
        var htmlBox =   '<div id="iconsActions">'+
                        '   <a class="newLink documento_ciencia" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Ci\u00EAncia\')" data-action="documento_ciencia" data-icon="sei_ciencia">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-thumbs-up azulColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_excluir" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Excluir\')" data-action="documento_excluir" data-icon="sei_lixeira">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-trash-alt vermelhoColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_alterar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar Sigilo\')" data-action="documento_alterar" data-icon="sei_consultar_alterar_protocolo">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-key laranjaColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_assinar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Assinar\')" data-action="documento_assinar" data-icon="sei_assinar">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-pen-alt laranjaColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink editor_montar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar Assinatura\')" data-action="editor_montar" data-icon="sei_editar_conteudo">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-ban vermelhoColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '   <a class="newLink documento_duplicar" onclick="batchActionsPro(this)" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Duplicar Documento\')" data-action="documento_duplicar" data-icon="sei_consultar_alterar_protocolo">'+
                        '       <span class="fa-layers fa-fw">'+
                        '           <i class="fas fa-copy azulColor"></i>'+
                        '           <span class="fa-layers-counter" style="display:none">1</span>'+
                        '       </span>'+
                        '   </a>'+
                        '</div>'+
                        '<div id="boxActions" class="tabelaPanelScroll" style="margin-top: 10px;height: 550px;">'+
                        '   <table id="actionsTablePro" style="font-size: 8pt !important;width: 100%;" class="seiProForm tabelaControle tableDialog tableInfo tableZebra">'+
                        '        <thead>'+
                        '            <tr class="tableHeader" onmouseout="infraTooltipOcultar();">'+
                        '                <th class="tituloControle" style="text-align: center;width: 50px;"><label class="lblInfraCheck" for="lnkInfraCheck" accesskey=";"></label><a style="text-align: center; display: block;" id="lnkInfraCheck" onclick="setSelectAllTr(this, \'SemGrupo\');"><img src="/infra_css/'+(isNewSEI ? 'svg/check.svg': 'imagens/check.gif')+'" id="imgRecebidosCheck" title="Selecionar Tudo" alt="Selecionar Tudo" class="infraImg"></a></th>'+
                        '                <th class="tituloControle" style="text-align: center;">N\u00BA SEI</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Documento</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Assinatura</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Data da Assinatura</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Data do Documento</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Unidade</th>'+
                        '                <th class="tituloControle" style="text-align: center;">Sigilo</th>'+
                        '                <th class="tituloControle" style="text-align: center; width: 140px;">A\u00E7\u00F5es</th>'+
                        '            </tr>'+
                        '        </thead>'+
                        '        <tbody>';
        if (listDocumentos){
            $.each(listDocumentos, function(i, v){
                htmlBox +=  '   <tr style="text-align: left;" data-tagname="SemGrupo" data-index="'+v.id_protocolo+'">'+
                            '       <td style="text-align: center;">'+
                            '           <input type="checkbox" onclick="followSelecionarItens(this)" name="actionsPro" value="'+v.id_protocolo+'">'+
                            '       </td>'+
                            '       <td>'+v.nr_sei+'</td>'+
                            '       <td class="documento"><a class="newLink" onclick="getDocOnArvore('+v.id_protocolo+')" style="font-size: 10pt;text-decoration: underline;"><i class="far fa-file azulColor" style="margin-right: 5px;"></i>'+v.documento+'</a></td>'+
                            '       <td class="assinatura">'+v.assinatura+'</td>'+
                            '       <td class="data_assinatura"></td>'+
                            '       <td class="data_documento">'+(v.data_documento ? moment(v.data_documento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : '')+'</td>'+
                            '       <td class="unidade"></td>'+
                            '       <td class="sigilo">'+v.sigilo+'</td>'+
                            '       <td class="icons"></td>'+
                            '   </tr>';

            });
        }
        htmlBox +=          '   </table>'+
                            '</div>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'A\u00E7\u00F5es em lote',
            width: 1100,
            height: 650,
            open: function() { 
                if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
                alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Pesquisando links de documentos');
                var urlAllPasta = $('#ifrArvore').contents().find('#topmenu a[id*="anchorAP"]').attr('href');
                if (typeof urlAllPasta !== 'undefined' && urlAllPasta !== '') {
                    $('#ifrArvore').attr('src', urlAllPasta).unbind().on('load', function(){
                        $(this).unbind();
                        getListDocumentosArvore($('#ifrArvore').contents());
                        resetDialogBoxPro('alertBoxPro');
                    })
                } else {
                    getAllLinksFolder();
                }
                initAppendIconsDocumentosActions();
                mergeAllAndamentosProcesso(function(){
                    var actionsTable = $('#actionsTablePro');
                    if (typeof dadosProcessoPro.listDocumentos !== 'undefined' && dadosProcessoPro.listDocumentos.length > 0) {
                        actionsTable.find('tbody tr').each(function(){
                            var id_protocolo = $(this).data('index');
                            var values = jmespath.search(dadosProcessoPro.listDocumentos, "[?id_protocolo=='"+id_protocolo+"'] | [0]");
                            if (values !== null) {
                                $(this).find('td.unidade').text((values.unidade ? values.unidade : ''));
                                $(this).find('td.data_assinatura').text((values.assinado && values.data_assinatura ? moment(values.data_assinatura, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm') : ''));
                                if (values.data_documento) {
                                    $(this).find('td.data_documento').text(moment(values.data_documento, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm'));
                                }
                            }
                        }).trigger('update');
                    }
                    resetDialogBoxPro('alertBoxPro');
                });
                window.loopActionsPro = {list: [], index: 0, sigilo: {}, assinatura: {}};
            },
            close: function() { 
                $('#boxActions').remove();
                resetDialogBoxPro('dialogBoxPro');
                resetDialogBoxPro('alertBoxPro');
            }
    });
    setTimeout(function(){ 
        var actionsTable = $('#actionsTablePro');
            actionsTable.tablesorter({
                textExtraction: {
                    4: function (elem, table, cellIndex) {
                        var text_date = $(elem).text() != '' ? moment($(elem).text(), 'DD/MM/YYYY').format('YYYY-MM-DD') : false;
                        return text_date;
                    },
                    5: function (elem, table, cellIndex) {
                        var text_date = $(elem).text() != '' ? moment($(elem).text(), 'DD/MM/YYYY').format('YYYY-MM-DD') : false;
                        return text_date;
                    },
                    8: function (elem, table, cellIndex) {
                        var sort = $(elem).find('a').map(function(){ return $(this).data('action') }).get().join(' ');
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
            }).on("filterEnd", function (event, data) {
                checkboxRangerSelectShift();
                var caption = $(this).find("caption").eq(0);
                var tx = caption.text();
                    caption.text(tx.replace(/\d+/g, data.filteredRows));
                    $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                    $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
            });
            initPanelResize('#boxActions', 'actionsPro');

        var filterAction = actionsTable.find('.tablesorter-filter-row').get(0);
        if (typeof filterAction !== 'undefined') {
            var observerFilterAction = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterTableActions button');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });

            var observerTableActions = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                function updateCountIcon(_parent, class_icon) {
                    var counter = _parent.find('tr.infraTrMarcada.'+class_icon).length;
                    if (counter > 0) {
                        $('#iconsActions').find('.'+class_icon).find('.fa-layers-counter').text(counter).show();
                    } else {
                        $('#iconsActions').find('.'+class_icon).find('.fa-layers-counter').hide();
                    }
                }
                updateCountIcon(_parent, 'documento_ciencia');
                updateCountIcon(_parent, 'documento_excluir');
                updateCountIcon(_parent, 'documento_alterar');
                updateCountIcon(_parent, 'documento_assinar');
                updateCountIcon(_parent, 'editor_montar');
                updateCountIcon(_parent, 'documento_duplicar');
            });
            setTimeout(function(){ 
                var htmlFilterActions =    '<div class="btn-group filterTableActions" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">'+
                                            '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Baixar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                            '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       <span class="text">Copiar</span>'+
                                            '   </button>'+
                                            '   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(actionsTable.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                            '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                            '       Pesquisar'+
                                            '   </button>'+
                                            '</div>';
                    actionsTable.find('thead .filterTableActions').remove();
                    actionsTable.find('thead').prepend(htmlFilterActions);
                    observerFilterAction.observe(filterAction, {
                        attributes: true
                    });
                    actionsTable.find('tbody tr').each(function(){
                        observerTableActions.observe(this, {
                                attributes: true
                        });
                    });
                    checkboxRangerSelectShift();
            }, 1000);
        }
    }, 500);
}
function initAppendIconsDocumentosActions(TimeOut = 3000) {
    if (TimeOut <= 0) { 
        setAppendIconsDocumentosActions();
        return; 
    }
    var arrayIconsView = $('#ifrArvore')[0].contentWindow.arrayIconsView;
    if (typeof arrayIconsView !== 'undefined' && $('#ifrArvore')[0].contentWindow.arrayIconsView.length >= $('#actionsTablePro').find('tbody tr').length) { 
        setAppendIconsDocumentosActions();
    } else {
        setTimeout(function(){ 
            initAppendIconsDocumentosActions(TimeOut - 100); 
            console.log('Reload initAppendIconsDocumentosActions', TimeOut); 
        }, 500);
    }
}
function setAppendIconsDocumentosActions() {
    var actionsTable = $('#actionsTablePro');
    var _ifrArvore = $('#ifrArvore');
    var arrayIconsView = _ifrArvore[0].contentWindow.arrayIconsView;
    var dadosProcesso = getDadosProcessoSession();
    var listDocumentos = (dadosProcesso) 
        ? dadosProcesso.listDocumentos 
        : (typeof dadosProcessoPro.listDocumentos !== 'undefined') ? dadosProcessoPro.listDocumentos : false;


    actionsTable.find('tbody tr').each(function(){
        var id_documento = $(this).data('index');
        var td_icon = $(this).find('td.icons');
        var iconList = jmespath.search(arrayIconsView, "[?id_documento==`"+id_documento+"`] | [0].icones");
        var dataDocumento = (listDocumentos) ? jmespath.search(listDocumentos, "[?id_protocolo=='"+id_documento+"'] | [0]") : null;
        var htmlIcon = '';
        var classIcon = '';
        if (iconList !== null) {

            if (iconList.filter(function(v){ return v.indexOf('sei_lixeira') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_excluir" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Excluir\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-trash-alt vermelhoColor"></i></a>';
                classIcon += 'documento_excluir ';
            }
            if (iconList.filter(function(v){ return v.indexOf('sei_ciencia') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_ciencia" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Ci\u00EAncia\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-thumbs-up azulColor"></i></a>';
                classIcon += 'documento_ciencia ';
            }
            if (iconList.filter(function(v){ return v.indexOf('sei_consultar_alterar_protocolo') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_alterar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Alterar sigilo\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-key laranjaColor"></i></a>';
                classIcon += 'documento_alterar ';
            }
            if (iconList.filter(function(v){ return v.indexOf('sei_assinar') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_assinar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Assinar\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-pen-alt laranjaColor"></i></a>';
                classIcon += 'documento_assinar ';
            }
            if (iconList.filter(function(v){ return (v.indexOf('sei_editar_conteudo') !== -1 || v.indexOf('sei_assinar') !== -1) }).length > 1 && dataDocumento !== null && typeof dataDocumento.assinatura !== 'undefined' && dataDocumento.assinatura != '' ) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="editor_montar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar Assinatura\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-ban vermelhoColor"></i></a>';
                classIcon += 'editor_montar ';
            }
            if (iconList.filter(function(v){ return v.indexOf('sei_consultar_alterar_protocolo') !== -1 }).length > 0) {
                htmlIcon += ' <a class="newLink" onclick="batchActionsSinglePro(this)" data-action="documento_duplicar" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Duplicar Documento\')" style="margin: 0;padding: 5px 0;"><i class="fas fa-copy azulColor"></i></a>';
                classIcon += 'documento_duplicar ';
            }
        }
        td_icon.html(htmlIcon);
        $(this).addClass(classIcon);
    }).trigger('update');
}
function batchActionsSinglePro(this_) {
    var _this = $(this_);
    var _table = _this.closest('table');
    var action = _this.data('action');
        _table.find('thead th a[onclick*="setSelectAllTr"]').data('index',1).trigger('click');
        _this.closest('tr').find('input[type=checkbox]').trigger('click');
        $('#iconsActions').find('a.'+action).trigger('click');
}
function copyLinkProcesso(this_) {
    var _this = $(this_);
    var id_procedimento = _this.data('id_procedimento');
    var linkProc = parent.url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
    copyToClipboard(linkProc);
    _this.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
function verifyMenuSistemaView() {
    var prefixoCookie = $('#hdnInfraPrefixoCookie').val();
    if (infraLerCookie(prefixoCookie+'_menu_mostrar') == 'N' && $(mainMenu).is(':visible')) {
        $('#lnkInfraMenuSistema').trigger('click');
    }
    checkMenuSistemaView();
}
function setCapaProcesso(loop = true) {
    var ifrArvore = $('#ifrArvore').contents();
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var prop = (getDadosProcessoSession()) ? getDadosProcessoSession().propProcesso : dadosProcessoPro.propProcesso;
    var id_procedimento = (typeof prop !== 'undefined' && typeof prop.hdnIdProcedimento !== 'undefined') ? prop.hdnIdProcedimento : getParamsUrlPro(window.location.href).id_protocolo;
    var hipoteseLegal = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '1') ? jmespath.search(prop.selHipoteseLegal_select, "[?id=='"+prop.selHipoteseLegal+"'] | [0].name") : null;
        hipoteseLegal = (hipoteseLegal == null) ? '' :  hipoteseLegal;
    var dataNivelAcesso = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '0') ? {name: 'P\u00FAblico', icon: 'fas fa-globe-americas'} : false;
        dataNivelAcesso = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '1') ? {name: 'Restrito: '+hipoteseLegal, icon: 'fas fa-lock'} : dataNivelAcesso;
        dataNivelAcesso = (typeof prop !== 'undefined' && typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == '2') ? {name: 'Sigiloso', icon: 'fas fa-user-slash'} : dataNivelAcesso;
    var htmlInfoProc = ifrVisualizacao.find(divInformacao).html();

    var htmlMarcador = getHtmlMarcador(id_procedimento, false);
    var iconMarcador = htmlMarcador.icon;
    var linkPrazo = htmlMarcador.prazo;
    var dataMarcador = htmlMarcador.data;

    var html =  '<div id="capaProcessoPro" '+(isNewSEI ? 'class="newSEI_capaProcessoPro"': '')+'>'+
                '      <div style="float: right;max-width: 40%;">'+
                '           <div class="qrcapa" onmouseover="return infraTooltipMostrar(\'Aponte a c\u00E2mera para abrir o processo em seu celular\');" onmouseout="return infraTooltipOcultar();"></div>'+
                '           <div class="infocapa">'+
                '               '+htmlInfoProc+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-scroll azulColor iconDadosProcesso"></i>Processo:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.hdnProtocoloFormatado !== 'undefined' ? 
                '               <a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+prop.hdnProtocoloFormatado+'</a> '+
                '               <a onclick="copyLinkProcesso(this)" data-id_procedimento="'+id_procedimento+'" onmouseover="return infraTooltipMostrar(\'Clique para copiar o link do processo\');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-link iconDadosProcesso" style="color:#777"></i></a>' : 
                '')+
                '         </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-calendar-check azulColor iconDadosProcesso"></i>Data de Autua\u00E7\u00E3o:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.hdnDtaGeracao !== 'undefined' ? 
                '               <a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+prop.hdnDtaGeracao+'</a>' : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-inbox azulColor iconDadosProcesso"></i>Tipo do Processo:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.hdnNomeTipoProcedimento !== 'undefined' ? 
                '               <a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+prop.hdnNomeTipoProcedimento+'</a>' : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-comment-dots azulColor iconDadosProcesso"></i>Especifica\u00E7\u00E3o:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.txtDescricao !== 'undefined' ? 
                '               <a class="newLink '+(prop.txtDescricao && prop.txtDescricao.toLowerCase().indexOf('(urgente)') !== -1 ? 'urgentePro' : '')+'" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+(prop.txtDescricao && prop.txtDescricao.toLowerCase().indexOf('(urgente)') !== -1 ? '<div class="urgentePro"></div>' : '')+prop.txtDescricao+'</a>' : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-bookmark azulColor iconDadosProcesso"></i>Assuntos:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.selAssuntos !== 'undefined' ? 
                $.map(prop.selAssuntos,function(v){ return '<a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+v+'</a>'; }).join('') : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-users azulColor iconDadosProcesso"></i>Interessados:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.selInteressadosProcedimento !== 'undefined' ? 
                $.map(prop.selInteressadosProcedimento,function(v){ return '<a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+v+'</a>'; }).join('') : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="'+(dataNivelAcesso ? dataNivelAcesso.icon : 'fas fa-globe-americas')+' azulColor iconDadosProcesso"></i>N\u00EDvel de Acesso:</div>'+
                '         <div class="data">'+
                (dataNivelAcesso ? 
                '               <a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+dataNivelAcesso.name+'</a>' : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-tag azulColor iconDadosProcesso"></i>Marcador:</div>'+
                '         <div class="data">'+
                (dataMarcador ? 
                '               <a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+iconMarcador+linkPrazo+'</a>' : 
                '')+
                '           </div>'+
                '      </div>'+
                '      <div class="field">'+
                '         <div class="label txt_cinza"><i class="fas fa-comment-dots azulColor iconDadosProcesso"></i>Observa\u00E7\u00F5es:</div>'+
                '         <div class="data">'+
                (typeof prop !== 'undefined' && typeof prop.txaObservacoes !== 'undefined' ? 
                $.map(prop.txaObservacoes, function(v){ return '<div><a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+v.unidade+': '+v.observacao+'</a></div>' }).join('') :
                // '               <a class="newLink" style="cursor:pointer;" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+prop.txtDescricao+'</a>' : 
                '')+
                '           </div>'+
                '      </div>'+
                '</div>';

    ifrVisualizacao.find('#capaProcessoPro').remove();

    if (typeof prop !== 'undefined' && typeof id_procedimento !== 'undefined' && ifrArvore.find('#span'+id_procedimento).hasClass('infraArvoreNoSelecionado')) {
        ifrVisualizacao.find('#divArvoreHtml').append(html);
        ifrVisualizacao.find(divInformacao).hide();
        replaceColorsIcons(ifrVisualizacao.find('.tagUserColorPro'));
        if (typeof $().qrcode === 'function') {
            ifrVisualizacao.find('.qrcapa').html('').qrcode({
                render: 'image',
                size: '150',
                text: parent.url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento
            });
        }
        if (loop) {
            setTimeout(function () {
                setCapaProcesso(false);
            },1500);
        }
    }
}
function getHtmlMarcador(id_procedimento, processoAberto) {
    var listMarcadores = sessionStorageRestorePro('dadosMarcadoresProcessoPro');
    var dataMarcador = (id_procedimento && listMarcadores) ? jmespath.search(listMarcadores, "[?id_procedimento=='"+id_procedimento+"'] | [0]") : null;
        dataMarcador = (dataMarcador !== null) ? dataMarcador : false;
    var iconMarcador = (processoAberto) ? '<i class="fas fa-spinner fa-spin"></i>' : '';
    var linkPrazo = '';
    if (dataMarcador) {
        var tagNameClean = (dataMarcador.tag && dataMarcador.tag != '' && dataMarcador.tag.indexOf('#') !== -1) ? dataMarcador.tag.replace(extractHexColor(dataMarcador.tag),'') : dataMarcador.tag;
            tagNameClean = (typeof tagNameClean !== 'undefined' && tagNameClean !=  '') ? tagNameClean.trim() : tagNameClean;
        var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
        var time = (typeof dataMarcador.name !== 'undefined' && dataMarcador.name !== null) ? String(dataMarcador.name).match(/(\d{1,2}:\d{2})/img) : null;
            time = (time !== null) ? ' '+time[0] : '';
        var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
        var checkDateDue = (typeof dataMarcador.name !== 'undefined' && dataMarcador.name !== null && typeof dataMarcador.name === 'string') ? regexDue.exec(removeAcentos(String(dataMarcador.name).trim()).toLowerCase().replaceAll('  ',' ')) : null;
            datePrazoDue = (checkDateDue !== null) ? moment(checkDateDue[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
        var checkDate = (typeof dataMarcador.name !== 'undefined' && dataMarcador.name !== null && typeof dataMarcador.name === 'string') ? regex.exec(removeAcentos(dataMarcador.name.trim())) : null;
            datePrazo = (checkDateDue === null && checkDate !== null) ? moment(checkDate[0]+time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss') : false;
            iconPrazo = (datePrazo) ? parent.getDatesPreview({date: datePrazo}) : false;
            iconPrazo = (datePrazoDue) ? parent.getDatesPreview({date: datePrazoDue}) : iconPrazo;
            linkPrazo = (iconPrazo) ? '<a class="newLink" style="cursor:pointer;max-width: calc(100% - 70px);" onclick="parent.copyTextThis(this)" onmouseover="return infraTooltipMostrar(\'Clique para copiar\');" onmouseout="return infraTooltipOcultar();">'+iconPrazo+'</a>' : '';
            iconMarcador = (typeof dataMarcador.icon !== 'undefined') ? (checkConfigValue('coresmarcadores') ? '<span data-color="true" class="tagUserColorPro">' : '')+'<img src="'+dataMarcador.icon+'" class="imagemStatus" title="'+dataMarcador.tag+'">'+(checkConfigValue('coresmarcadores') ? '</span>' : '')+' '+tagNameClean+(dataMarcador.name ? ': '+dataMarcador.name.replace(/\\r\\n/g, "<br>") : '') : 'Nenhum marcador';
    }
    return {icon: iconMarcador, prazo: linkPrazo, data: dataMarcador};
}
function getDocCertidao(this_) {
    var _this = $(this_);
    var itemSelected = false;
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var ifrArvoreHtml = ifrVisualizacao.find('#ifrArvoreHtml').contents();
    var contentBody = ifrArvoreHtml.find('body').clone(true);
        contentBody.find('img[alt="QRCode Assinatura"]').closest('table').remove();
        contentBody.find('a[onclick*="alert"]').remove();
    var contentHtml = contentBody[0].outerHTML;
    var ifrArvore = $('#ifrArvore');
    var arrayLinksArvore = ifrArvore[0].contentWindow.arrayLinksArvore;
        arrayLinksArvore = (typeof arrayLinksArvore === 'undefined') ? parent.linksArvore : arrayLinksArvore;
    var href = jmespath.search(arrayLinksArvore, "[?name=='Incluir Documento'].url");
    var nameDoc = (checkConfigValue('certidaosigilo_nomedoc')) ? getConfigValue('certidaosigilo_nomedoc') : 'Certid\u00E3o';

    if (href !== null) {
        alertaBoxPro('Sucess', 'sync fa-spin', 'Aguarde... Gerando Certid\u00E3o de Documento Oficial com Sigilo');
        $.ajax({ url: href }).done(function (htmlInitDoc) {
            var $htmlInitDoc = $(htmlInitDoc);
            var form = $htmlInitDoc.find('#frmDocumentoEscolherTipo');
            var hrefForm = form.attr('action');
            var param = {};
                form.find("input[type=hidden]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                param.hdnFiltroSerie = 'T';
            
                $.ajax({
                    method: 'POST',
                    data: param,
                    url: hrefForm
                }).done(function (htmlFullList) {
                    var $htmlFullList = $(htmlFullList);
                    $htmlFullList.find('#tblSeries tbody tr').each(function (v) {
                        var text = $(this).data('desc').trim();
                        var value = $(this).find('input').val();
                        var urlDoc = $(this).find('a.ancoraOpcao').attr('href');
                        if (text != '') {
                            var nameOption = escapeRegExp(text.replace(/_|:/g, ' '));
                                nameDoc = nameDoc.replace(/_|:/g, ' ');
                            var reg = new RegExp('^\\b'+nameOption, "igm");
                            if (reg.test(parent.removeAcentos(nameDoc.trim().toLowerCase()))) {
                                if (typeof urlDoc !== 'undefined' && text != 'externo') {
                                    itemSelected = true;
                                    $.ajax({ url: urlDoc }).done(function (htmlDoc) {
                                        var $htmlDoc = $(htmlDoc);
                                        var form = $htmlDoc.find('#frmDocumentoCadastro');
                                        var hrefForm = form.attr('action');
                                        var param = {};
                                            form.find("input[type=hidden]").each(function () {
                                                if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                                                    param[$(this).attr('name')] = $(this).val(); 
                                                }
                                            });
                                            form.find('input[type=text]').each(function () { 
                                                if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                                                    param[$(this).attr('id')] = $(this).val();
                                                }
                                            });
                                            form.find('select').each(function () { 
                                                if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                                                    param[$(this).attr('id')] = $(this).val();
                                                }
                                            });
                                            form.find('input[type=radio]').each(function () { 
                                                if ( $(this).attr('name') && $(this).attr('name').indexOf('rdo') !== -1) {
                                                    param[$(this).attr('name')] = $(this).val();
                                                }
                                            });
                                            param.rdoNivelAcesso = '0';
                                            param.hdnFlagDocumentoCadastro = '2';
                                            param.txaObservacoes = '';
                                            param.txtDescricao = 'de Documento Oficial com Sigilo';

                                            var postData = '';
                                            for (var k in param) {
                                                if (postData !== '') postData = postData + '&';
                                                var valor = (k=='hdnAssuntos') ? param[k] : escapeComponent(param[k]);
                                                    valor = (k=='txtDataElaboracao') ? param[k] : escapeComponent(param[k]);
                                                    valor = (k=='hdnInteressados') ? param[k] : valor;
                                                    valor = (k=='txtDescricao') ? parent.encodeURI_toHex(param[k].normalize('NFC')) : valor;
                                                    valor = (k=='txtNumero') ? escapeComponent(param[k]) : valor;
                                                    postData = postData + k + '=' + valor;
                                            }

                                            var xhr = new XMLHttpRequest();
                                            $.ajax({
                                                method: 'POST',
                                                // data: param,
                                                data: postData,
                                                url: hrefForm,
                                                contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                                                xhr: function() {
                                                    return xhr;
                                                },
                                            }).done(function (htmlResult) {
                                                var status = (xhr.responseURL.indexOf('controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar') !== -1) ? true : false;
                                                var class_icon = '';
                                                var text_icon = '';
                                                if (status) {
                                                    alertaBoxPro('Sucess', 'check-circle', 'Certid\u00E3o gerada com sucesso');
                                                    var $htmlResult = $(htmlResult);
                                                    var urlEditor = [];
                                                    var idUser = false;
                                                    $.each($htmlResult.text().split('\n'), function(i, v){
                                                        if (v.indexOf("atualizarArvore('") !== -1) {
                                                            urlReload = v.split("'")[1];
                                                        }
                                                        if (v.indexOf("acao=editor_montar") !== -1) {
                                                            urlEditor.push(v.split("'")[1]);
                                                        }
                                                        if (v.indexOf("janelaEditor_") !== -1) {
                                                            idUser = v.split("_")[1];
                                                        }
                                                    });
                                                    if (urlEditor.length > 0 && idUser) {
                                                        sessionStorageStorePro('dadosDocCertidao',contentHtml);
                                                        sessionStorageStorePro('nomeDocCertidao',ifrArvore.contents().find('.infraArvoreNoSelecionado').eq(0).text());
                                                        openWindowEditor(urlEditor[0]+'#&acao_pro=set_certidao', idUser);
                                                    }
                                                    if (urlReload) {
                                                        ifrArvore.attr('src', urlReload);
                                                    } else {
                                                        ifrArvore[0].contentWindow.location.reload(true);
                                                    }
                                                } else {
                                                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao gerar o documento do tipo "'+nameDoc+'".');
                                                }
                                            });
                                    });
                                }
                                return false;
                            }
                        }
                });
                if (!itemSelected) { 
                    alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de documento "'+nameDoc+'". Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
                }
            });
        });
    } else {
        if (!itemSelected) { 
            console.log('Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
        }
    }
}
function openWindowEditor(urlEditor, idUser) {
    var id_documento = getParamsUrlPro(urlEditor).id_documento
    var janelaEditor = infraAbrirJanela('', 'janelaEditor_'+idUser+'_'+id_documento, parent.infraClientWidth(), parent.infraClientHeight(), 'location=0,status=0,resizable=1,scrollbars=1', false);
    if (janelaEditor.location=='about:blank') {
        janelaEditor.location.href = urlEditor;
    }
    janelaEditor.focus();
}
function setResizeIfrArvore() {
    var ifrArvore = $('#ifrArvore');
    var ifrVisualizacao = $('#ifrVisualizacao');
    if (ifrArvore.length > 0) { 
        console.log(ifrArvore.width(), ifrVisualizacao.width());
    }
}
function setResizeAreaTelaD() {
    if ($('.panelHomePro').is(':visible')) {
        var width = $('.panelHomePro:visible').width() - ( $('.panelHomePro:visible').width()*0.02 );
        $('.resizeObserve:visible').css('width', width);
    }
    if ($('#atividadesProActions').length > 0 && $('#atividadesProActions').is(':visible')) {
        $('.atividadesBtnPanel .text').show();
        if ($('#atividadesProActions').height() > 40) {
            $('.atividadesBtnPanel .text').hide();
        }
    }
}
function cleanHistoryPro(this_) {
    confirmaBoxPro('Tem certeza que deseja apagar o hist\u00F3rico de processos?', function(){
        localStorageRemovePro('dadosHistoricoProcessoPro');
        resetDialogBoxPro('dialogBoxPro');
        alertaBoxPro('Sucess', 'check-circle', 'Hist\u00F3rico apagado com sucesso!');
    }, 'Apagar');
}
function downloadTablePro(this_) {
    var _this = $(this_);
    var table = _this.closest('table');
    var data_table = table.data();
    var data = _this.data();
    var nameTable = (typeof data_table.nameTable !== 'undefined') 
                    ? data_table.nameTable 
                    : ($(".infraBarraLocalizacao").length > 0) ? removeAcentos($(".infraBarraLocalizacao").eq(0).text().trim()).toLowerCase().replace(/ /g,"_") : 'tabela';
    downloadTableCSV(table, nameTable+'_SEIPro');
    _this.find('.text').text('Baixado...');
    _this.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function(){ 
        _this.find('.text').text(data.value);
        _this.find('i').attr('class',data.icon);
    }, 1500);
}
function copyTablePro(this_) {
    var _this = $(this_);
    var table = _this.closest('table');
    var data = _this.data();
    var htmlTable = table.clone(true).find('.notCopy').remove().end()[0].outerHTML;
    copyToClipboardHTML(htmlTable);
    _this.find('.text').text('Copiado...');
    _this.find('i').attr('class','fas fa-thumbs-up');
    setTimeout(function(){ 
        _this.find('.text').text(data.value);
        _this.find('i').attr('class',data.icon);
    }, 1500);
}
function changeInputDateTime(this_) {
    var _this = $(this_);
    var _parent = (_this.closest('.ui-dialog').length > 0) ? _this.closest('.ui-dialog') : _this.closest('.seiProForm');
        _parent.find('.cloneDateTime').remove();
        _parent.find('input[type="datetime-local"]').each(function(){
            var id = (typeof $(this).attr('id') !== 'undefined') ? $(this).attr('id') : randomString(4);
            var partValue = $(this).val().split('T');
            var dateValue = partValue[0];
            var timeValue = partValue[1];
            var dateInput = $(this).clone()
                                .prop('id', id+'_clone_date')
                                .removeAttr('onchange')
                                .removeAttr('data-key')
                                .removeAttr('data-type')
                                .removeAttr('data-name')
                                .removeData()
                                .attr('max', (typeof $(this).attr('max') !== 'undefined' && $(this).attr('max') != '') ? $(this).attr('max').split('T')[0] : '' )
                                .attr('min', (typeof $(this).attr('min') !== 'undefined' && $(this).attr('min') != '') ? $(this).attr('min').split('T')[0] : '' )
                                .attr('data-refid', id)
                                .attr('value',dateValue)
                                .prop('type', 'date')
                                .attr('style','width: 50% !important;float: left;')
                                .attr('onchange', 'updateInputDateTime(this)')
                                .val(dateValue)
                                .addClass('cloneDateTime');
            var timeInput = $(this).clone()
                                .prop('id', id+'_clone_time')
                                .removeAttr('onchange')
                                .removeAttr('data-key')
                                .removeAttr('data-type')
                                .removeAttr('data-name')
                                .removeData()
                                .removeAttr('max')
                                .removeAttr('min')
                                .attr('data-refid', id)
                                .attr('value',timeValue)
                                .prop('type', 'time')
                                .attr('style','width: 30% !important;float: right;')
                                .attr('onchange', 'updateInputDateTime(this)')
                                .val(timeValue)
                                .addClass('cloneDateTime');
            $(this).after(timeInput).after(dateInput).hide();
            $(this).closest('td').addClass('dateonly');
        });
}
function updateInputDateTime(this_) {
    var _this = $(this_);
    var _parent = _this.closest('td');
    var data = _this.data();
    var _date = _parent.find("#"+data.refid+'_clone_date');
    var _time = _parent.find("#"+data.refid+'_clone_time');
        _parent.find("#"+data.refid).val(_date.val()+'T'+_time.val()).trigger('change');
        console.log(_date.val(), _time.val());

    changeInputDateTime(this_);
}
function checkBrowser(){
    let browser = "";
    let c = navigator.userAgent.search("Chrome");
    let f = navigator.userAgent.search("Firefox");
    let m8 = navigator.userAgent.search("MSIE 8.0");
    let m9 = navigator.userAgent.search("MSIE 9.0");
    if (c > -1) {
        browser = "Chrome";
    } else if (f > -1) {
        browser = "Firefox";
    } else if (m9 > -1) {
        browser ="MSIE 9.0";
    } else if (m8 > -1) {
        browser ="MSIE 8.0";
    }
    return browser;
}
function setSortLocaleCompare() {
    $.tablesorter.characterEquivalents = {
        'a' : '\u00e1\u00e0\u00e2\u00e3\u00e4\u0105\u00e5', // áàâãäąå
        'A' : '\u00c1\u00c0\u00c2\u00c3\u00c4\u0104\u00c5', // ÁÀÂÃÄĄÅ
        'c' : '\u00e7\u0107\u010d', // çćč
        'C' : '\u00c7\u0106\u010c', // ÇĆČ
        'e' : '\u00e9\u00e8\u00ea\u00eb\u011b\u0119', // éèêëěę
        'E' : '\u00c9\u00c8\u00ca\u00cb\u011a\u0118', // ÉÈÊËĚĘ
        'i' : '\u00ed\u00ec\u0130\u00ee\u00ef\u0131', // íìİîïı
        'I' : '\u00cd\u00cc\u0130\u00ce\u00cf', // ÍÌİÎÏ
        'o' : '\u00f3\u00f2\u00f4\u00f5\u00f6\u014d', // óòôõöō
        'O' : '\u00d3\u00d2\u00d4\u00d5\u00d6\u014c', // ÓÒÔÕÖŌ
        'ss': '\u00df', // ß (s sharp)
        'SS': '\u1e9e', // ẞ (Capital sharp s)
        'u' : '\u00fa\u00f9\u00fb\u00fc\u016f', // úùûüů
        'U' : '\u00da\u00d9\u00db\u00dc\u016e' // ÚÙÛÜŮ
    };
}
function filterTablePro(this_) {
    var _this = $(this_);
    var _parent = _this.closest('thead');
    var table = _this.closest('table');
    var filter = _parent.find('.tablesorter-filter-row');
    if (_this.hasClass('active')) {
        filter.addClass('hideme');
        _this.removeClass('active');
        table.trigger('filterReset');
    } else {
        filter.removeClass('hideme');
        _this.addClass('active');
        setTimeout(function(){ 
            filter.find('input:visible').eq(0).focus();
        },500);
    }
}
function setHistoryProcessosPro(dadosProcessoPro) {
    var prop = dadosProcessoPro.propProcesso;
    var dadosProcessoPro_push = {
            datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            data_geracao: prop.hdnDtaGeracao,
            id_procedimento: prop.hdnIdProcedimento,
            tipo_processo: prop.hdnNomeTipoProcedimento,
            protocolo: ((typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir),
            nivel_acesso: prop.rdoNivelAcesso,
            assuntos: prop.selAssuntos_select,
            observacoes: prop.txaObservacoes,
            descricao: prop.txtDescricao
        };
    var dadosHistoricoProcessoPro = localStorageRestorePro('dadosHistoricoProcessoPro');

    if (dadosHistoricoProcessoPro !== null) {
        dadosHistoricoProcessoPro = reverseArray(dadosHistoricoProcessoPro);
        dadosHistoricoProcessoPro = dadosHistoricoProcessoPro.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.id_procedimento === thing.id_procedimento
          ))
        );
        dadosHistoricoProcessoPro = reverseArray(dadosHistoricoProcessoPro);
    }
    if (dadosHistoricoProcessoPro !== null) {
        for (i = 0; i < dadosHistoricoProcessoPro.length; i++) {
            if( i > 500 || dadosHistoricoProcessoPro[i].id_procedimento == dadosProcessoPro_push.id_procedimento) {
                dadosHistoricoProcessoPro.splice(i,1);
                i--;
            }
        }
    }

    if (dadosHistoricoProcessoPro) {
        dadosHistoricoProcessoPro.push(dadosProcessoPro_push);
    } else {
        dadosHistoricoProcessoPro = [dadosProcessoPro_push];
    }

    localStorageStorePro('dadosHistoricoProcessoPro', dadosHistoricoProcessoPro);
}
function getDadosProcessoSession() {
    var id_procedimento = getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento;
    var dadosSessionProcessoPro = sessionStorageRestorePro('dadosSessionProcessoPro');
    var dadosProcesso = (dadosSessionProcessoPro) ? jmespath.search(dadosSessionProcessoPro, "[?propProcesso.hdnIdProcedimento=='"+id_procedimento+"'] | [0]") : null;
    return (dadosProcesso && dadosProcesso !== null) ? dadosProcesso : false;
}
function setSessionProcessosPro(dadosProcessoPro) {
    var dadosProcessoPro_push = dadosProcessoPro;
    var dadosSessionProcessoPro = sessionStorageRestorePro('dadosSessionProcessoPro');

    var id_procedimento = (typeof dadosProcessoPro_push.propProcesso !== 'undefined' && typeof dadosProcessoPro_push.propProcesso.hdnIdProcedimento !== 'undefined') ? dadosProcessoPro_push.propProcesso.hdnIdProcedimento : getParamsUrlPro(window.location.href).id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
        id_procedimento = (typeof id_procedimento === 'undefined') ? getParamsUrlPro($('#ifrArvore').attr('src')).id_procedimento : id_procedimento;
    /*
    if (dadosSessionProcessoPro !== null) {
        dadosSessionProcessoPro = reverseArray(dadosSessionProcessoPro);
        dadosSessionProcessoPro = dadosSessionProcessoPro.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.propProcesso.hdnIdProcedimento === thing.propProcesso.hdnIdProcedimento
          ))
        );
        dadosSessionProcessoPro = reverseArray(dadosSessionProcessoPro);
    }
    */
    if (dadosSessionProcessoPro !== null) {
        for (i = 0; i < dadosSessionProcessoPro.length; i++) {
            if( i > 500 || 
                    (
                        typeof dadosSessionProcessoPro[i].propProcesso !== 'undefined' && 
                        typeof dadosSessionProcessoPro[i].propProcesso.hdnIdProcedimento !== 'undefined' && 
                        dadosSessionProcessoPro[i].propProcesso.hdnIdProcedimento == id_procedimento
                    )
            ) {
                dadosSessionProcessoPro.splice(i,1);
                i--;
            }
        }
    }

    if (dadosSessionProcessoPro) {
        dadosSessionProcessoPro.push(dadosProcessoPro_push);
    } else {
        dadosSessionProcessoPro = [dadosProcessoPro_push];
    }

    sessionStorageStorePro('dadosSessionProcessoPro', dadosSessionProcessoPro);
}
function updateTitlePage(mode, dadosProcesso = false) {
    var processo = (dadosProcesso) ? dadosProcesso.propProcesso : dadosProcessoPro.propProcesso;
    if ( typeof processo.txtDescricao !== 'undefined'  ) {
        var protocolo = (typeof processo !== 'undefined' && typeof processo.txtProtocoloExibir === 'undefined') ? processo.hdnProtocoloFormatado : processo.txtProtocoloExibir;
        if (mode == 'processo') {
            $('head title').text(processo.txtDescricao+' | SEI - Processo '+protocolo);
            if (parent.verifyConfigValue('urlamigavel')) {
                updateUrlPage(true, dadosProcesso);
            }
        } else if (mode == 'editor') {
            var title = $('head title').text();
                title = (title.indexOf('-') !== -1) ? title.split('-')[2]+' '+title.split('-')[1] : title; 
            $('head title').text('Editor: '+title+' - '+processo.txtDescricao+' | SEI - Processo '+protocolo);
        }
    }
}
function updateUrlPage(update = true, dadosProcesso = false) {
    var processo = (dadosProcesso) ? dadosProcesso.propProcesso : dadosProcessoPro.propProcesso;
    var protocolo = (typeof processo !== 'undefined' && typeof processo.txtProtocoloExibir === 'undefined') 
            ? processo.hdnProtocoloFormatado 
            : (typeof processo !== 'undefined') ? processo.txtProtocoloExibir : null;
    if (typeof protocolo !== 'undefined' && protocolo !== null && $('#ifrArvore').length > 0) {
        var ifrArvore = $('#ifrArvore').contents();
        var nrSEI = ifrArvore.find('.infraArvoreNoSelecionado').eq(0);
            nrSEI = (typeof nrSEI !== 'undefined' && nrSEI !== null) ? getNrSei(nrSEI.text().trim()) : '';
            nrSEI = (nrSEI != '') ? '@'+nrSEI : '';
            
        if (update) {
            window.history.replaceState({sei: nrSEI}, document.title, "/sei/#"+protocolo+nrSEI);
        } else {
            window.history.pushState({sei: nrSEI}, document.title, "/sei/#"+protocolo+nrSEI);
            iHistoryArray.push({id: iHistory, sei: nrSEI});
        }
        iHistory++;
    }
}
function getNrSei(nameDoc) {
    var nr_sei = nameDoc.split(' ');
        nr_sei = (nameDoc.indexOf(' ') !== -1) ? nr_sei[nr_sei.length-1] : '';
        nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','').trim() : nr_sei;
    return nr_sei;
}
function getIfrArvoreDadosProcesso() {
    if ($('#ifrArvore').length > 0) {
        var ifrArvore = $('#ifrArvore').contents();
        var ifrVisualizacao = $('#ifrVisualizacao').contents();
        var ifrArvoreHtml = ifrVisualizacao.find('#ifrArvoreHtml').contents();

        var assunto = (ifrVisualizacao.find('#ifrArvoreHtml').length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                                    var reg = new RegExp('assunto:', "igm");
                                                    if (reg.test($(this).text())) { return $(this).text().replace(reg, '').trim().replace(/[\u200B]/g, '') }
                                                }).get(0) 
                        : '';

        var usuarios = uniqPro(jmespath.search(arrayConfigAtividades.planos, "[*].apelido"));
            usuarios = usuarios.sort((a,b) => b.length - a.length);

        var usuario = (ifrVisualizacao.find('#ifrArvoreHtml').length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                    var txt = removeAcentos($(this).text());
                                    var reg = new RegExp('\\b'+removeAcentos(usuarios.join('|'))+'\\b', 'im');
                                    if (reg.test(txt)) {
                                        var u = false; 
                                        var textMatch = txt.replace(reg, function(match) {
                                            u = match;
                                            return false;
                                        });
                                        return u;
                                    };
                                }).get(0)
                        : false;

        var prazo = (ifrVisualizacao.find('#ifrArvoreHtml').length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                                    var txt = $(this).text();
                                                    var reg = new RegExp('prazo', "i");
                                                    var p = false;
                                                    if (reg.test(txt)) { 
                                                        p = txt.substr(txt.indexOf('prazo')+5).trim();
                                                        p = p.match(/^\d+|\d+\b|\d+(?=\w)/g);
                                                        return (p !== null) ? parseInt(p[0]) : false; 
                                                    }
                                                }).get(0) 
                        : false;

        var assinatura = (ifrVisualizacao.find('#ifrArvoreHtml').length > 0) 
                        ? ifrArvoreHtml.find('p').map(function() {
                                                    var txt = $(this).text();
                                                    var reg = new RegExp('documento assinado eletronicamente', "i");
                                                    var p = false;
                                                    if (reg.test(txt)) { 
                                                        var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
                                                        var time = txt.match(/(\d{1,2}:\d{2})/img);
                                                        return (date !== null && time !== null) ? date[0]+' '+time[0] : false; 
                                                    }
                                                }).get(0) 
                        : false;

        var versao = false;
        if (ifrVisualizacao.find('#ifrArvoreHtml').length > 0) {
            var txt = ifrArvoreHtml.find('body').text().trim();
                txt = txt.substr(txt.lastIndexOf("\n")+1);
            var date = txt.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img);
            var time = txt.match(/(\d{1,2}:\d{2})/img);
                versao = (date !== null && time !== null) ? date[0]+' '+time[0] : false; 
        }
        var data_documento = (assinatura) ? assinatura : versao;
        
        var processoLnk = ifrArvore.find("a[target='ifrVisualizacao']").eq(0);
        var processo_sei = processoLnk.text().trim();
        var tipo = processoLnk.find('span').attr('title').trim();
        var id_procedimento = processoLnk.attr('href');
            id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento.length > 0) ? getParamsUrlPro(id_procedimento).id_procedimento : false;
        var requisicaoLnk = ifrArvore.find('#container .infraArvoreNoSelecionado');
        var id_documento = requisicaoLnk.closest('a').attr('href');
            id_documento = (typeof id_documento !== 'undefined' && id_documento.length > 0) ? getParamsUrlPro(id_documento).id_documento : false;
        var nome_documento = requisicaoLnk.text().replace(/[0-9]/g, '').replace(/\(\)/g, '').trim();
        var nr_sei = requisicaoLnk.text().trim().split(' ');
            nr_sei = (requisicaoLnk.text().indexOf(' ') !== -1) ? nr_sei[nr_sei.length-1] : '';
            nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','').trim() : nr_sei;
            nr_sei = (typeof requisicaoLnk.attr('id') !== 'undefined' && requisicaoLnk.attr('id').length > 0 && requisicaoLnk.attr('id').indexOf('PASTA') === -1) ? nr_sei : '';
        var numero_documento = (ifrVisualizacao.find('#ifrArvoreHtml').length > 0) 
                                ? ifrArvoreHtml.find('p').map(function() {
                                                            var reg = new RegExp(removeAcentos(nome_documento), "igm");
                                                            if (reg.test(removeAcentos($(this).text()))) { return removeAcentos($(this).text()).replace(reg, '').replace(/[\u200B]/g, '').replace(/n[\u00BA]/g, '').trim() }
                                                        }).get(0) 
                                : '';


        var processos = ifrArvoreHtml.find('a.ancoraSei')
                            .map(function(){
                                var processo_sei = $(this).text().trim();
                                var param = getParamsUrlPro($(this).attr('href'));
                                var id_proced = (param && typeof param.id_protocolo !== 'undefined') 
                                                        ? param.id_protocolo 
                                                        : (param && typeof param.id_procedimento !== 'undefined') 
                                                            ? param.id_procedimento
                                                            : false;
                                if (id_proced && id_proced != id_procedimento && processo_sei !== '' && processo_sei.match( /(-|\/|\.)/ )) { 
                                    return {processo_sei: processo_sei, id_procedimento: id_proced} 
                                }
                            }).get();
        return {
                    processo_sei: (typeof processo_sei !== 'undefined') ? processo_sei : false,
                    id_procedimento: (typeof id_procedimento !== 'undefined') ? id_procedimento : false,
                    tipo: (typeof tipo !== 'undefined') ? tipo : false,
                    nome_documento: (typeof nome_documento !== 'undefined') ? nome_documento : false,
                    id_documento: (typeof id_documento !== 'undefined') ? id_documento : false,
                    nr_sei: (typeof nr_sei !== 'undefined') ? nr_sei : false,
                    numero_documento: (typeof numero_documento !== 'undefined') ? numero_documento : false,
                    assunto: (typeof assunto !== 'undefined') ? assunto : false,
                    usuario: (typeof usuario !== 'undefined') ? usuario : false,
                    prazo: (typeof prazo !== 'undefined') ? (parseInt(prazo) > 100 ? 100 : parseInt(prazo)) : false,
                    assinatura: (typeof assinatura !== 'undefined') ? assinatura : false,
                    versao: (typeof versao !== 'undefined') ? versao : false,
                    processos: (typeof processos !== 'undefined' && processos.length > 0) ? processos : false,
                    data_documento: (typeof data_documento !== 'undefined') ? data_documento : false
                };
    } else { return false; }
}
// resize img
function loadCSSResize(iframe) {	
	var cssScript = 'img::selection{color:transparent}img.ckimgrsz{outline:1px dashed #000}#ckimgrsz{position:absolute;margin:-8px -8px;width:0;height:0;cursor:default;z-index:10001}#ckimgrsz span{display:none;position:absolute;top:0;left:0;width:0;height:0;background-size:100% 100%;opacity:.65;outline:1px dashed #000}#ckimgrsz i{position:absolute;display:block;width:5px;height:5px;background:#fff;border:1px solid #000}#ckimgrsz i.active,#ckimgrsz i:hover{background:#000}#ckimgrsz i.br,#ckimgrsz i.tl{cursor:nwse-resize}#ckimgrsz i.bm,#ckimgrsz i.tm{cursor:ns-resize}#ckimgrsz i.bl,#ckimgrsz i.tr{cursor:nesw-resize}#ckimgrsz i.lm,#ckimgrsz i.rm{cursor:ew-resize}body.dragging-br,body.dragging-br *,body.dragging-tl,body.dragging-tl *{cursor:nwse-resize!important}body.dragging-bm,body.dragging-bm *,body.dragging-tm,body.dragging-tm *{cursor:ns-resize!important}body.dragging-bl,body.dragging-bl *,body.dragging-tr,body.dragging-tr *{cursor:nesw-resize!important}body.dragging-lm,body.dragging-lm *,body.dragging-rm,body.dragging-rm *{cursor:ew-resize!important}';
	
	if ( iframe.find('head').find('style[data-style="seipro-resizeimg"]').length == 0 ) {
		iframe.find('head').append("<style type='text/css' data-style='seipro-resizeimg'> "
								   +cssScript
								   +"</style>");
	
	}
}
function initResizeImg(editor) {
	var window = editor.window.$, document = editor.document.$;
	var snapToSize = (typeof IMAGE_SNAP_TO_SIZE === 'undefined') ? null : IMAGE_SNAP_TO_SIZE;

	var resizer = new Resizer(editor, {snapToSize: snapToSize});

	document.addEventListener('mousedown', function(e) {
	  if (resizer.isHandle(e.target)) {
		resizer.initDrag(e);
	  }
	}, false);

	function selectionChange() {
	  var selection = editor.getSelection();
	  if (!selection) return;
	  // If an element is selected and that element is an IMG
	  if (selection.getType() !== CKEDITOR.SELECTION_NONE && selection.getStartElement().is('img')) {
		// And we're not right or middle clicking on the image
		if (!window.event || !window.event.button || window.event.button === 0) {
		  resizer.show(selection.getStartElement().$);
		}
	  } else {
		resizer.hide();
	  }
	}

	editor.on('selectionChange', selectionChange);

	editor.on('getData', function(e) {
	  var html = e.data.dataValue || '';
	  html = html.replace(/<div id="ckimgrsz"([\s\S]*?)<\/div>/i, '');
	  html = html.replace(/\b(ckimgrsz)\b/g, '');
	  e.data.dataValue = html;
	});

	editor.on('beforeUndoImage', function() {
	  // Remove the handles before undo images are saved
	  resizer.hide();
	});

	editor.on('afterUndoImage', function() {
	  // Restore the handles after undo images are saved
	  selectionChange();
	});

	editor.on('blur', function() {
	  // Remove the handles when editor loses focus
	  resizer.hide();
	});

	editor.on('beforeModeUnload', function self() {
	  editor.removeListener('beforeModeUnload', self);
	  resizer.hide();
	});

	// Update the selection when the browser window is resized
	var resizeTimeout;
	editor.window.on('resize', function() {
	  // Cancel any resize waiting to happen
	  clearTimeout(resizeTimeout);
	  // Delay resize to "debounce"
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
  var container = this.container = this.document.createElement('div');
  container.id = 'ckimgrsz';
  this.preview = this.document.createElement('span');
  container.appendChild(this.preview);
  var handles = this.handles = {
	tl: this.createHandle('tl'),
	tm: this.createHandle('tm'),
	tr: this.createHandle('tr'),
	lm: this.createHandle('lm'),
	rm: this.createHandle('rm'),
	bl: this.createHandle('bl'),
	bm: this.createHandle('bm'),
	br: this.createHandle('br')
  };
  for (var n in handles) {
	container.appendChild(handles[n]);
  }
},
createHandle: function(name) {
  var el = this.document.createElement('i');
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
	this.otherImages = toArray(this.document.getElementsByTagName('img'));
	this.otherImages.splice(this.otherImages.indexOf(el), 1);
  }
  var box = this.box = getBoundingBox(this.window, el);
  positionElement(this.container, box.left, box.top);
  this.document.body.appendChild(this.container);
  this.el.classList.add('ckimgrsz');
  this.showHandles();
},
hide: function() {
  // Remove class from all img.ckimgrsz
  var elements = this.document.getElementsByClassName('ckimgrsz');
  for (var i = 0; i < elements.length; ++i) {
	elements[i].classList.remove('ckimgrsz');
  }
  this.hideHandles();
  if (this.container.parentNode) {
	this.container.parentNode.removeChild(this.container);
  }
},
initDrag: function(e) {
	  if (e.button !== 0) {
		//right-click or middle-click
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
		// Save an undo snapshot before the image is permanently changed
		resizer.editor.fire('saveSnapshot');
	  };
	  drag.onComplete = function() {
		resizer.resizeComplete();
		// Save another snapshot after the image is changed
		resizer.editor.fire('saveSnapshot');
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
		handles[n].style.display = 'block';
	  }
	},
	hideHandles: function() {
	  var handles = this.handles;
	  for (var n in handles) {
		handles[n].style.display = 'none';
	  }
	},
	showPreview: function() {
	  this.preview.style.backgroundImage = 'url("' + this.el.src + '")';
	  this.calculateSize();
	  this.updatePreview();
	  this.preview.style.display = 'block';
	},
	updatePreview: function() {
	  var box = this.previewBox;
	  positionElement(this.preview, box.left, box.top);
	  resizeElement(this.preview, box.width, box.height);
	},
	hidePreview: function() {
	  var box = getBoundingBox(this.window, this.preview);
	  this.result = {width: box.width, height: box.height};
	  this.preview.style.display = 'none';
	},
	calculateSize: function(data) {
	  var box = this.previewBox = {top: 0, left: 0, width: this.box.width, height: this.box.height};
	  if (!data) return;
	  var attr = data.target.className;
	  if (~attr.indexOf('r')) {
		box.width = Math.max(32, this.box.width + data.delta.x);
	  }
	  if (~attr.indexOf('b')) {
		box.height = Math.max(32, this.box.height + data.delta.y);
	  }
	  if (~attr.indexOf('l')) {
		box.width = Math.max(32, this.box.width - data.delta.x);
	  }
	  if (~attr.indexOf('t')) {
		box.height = Math.max(32, this.box.height - data.delta.y);
	  }
	  //if dragging corner, enforce aspect ratio (unless shift key is being held)
	  if (attr.indexOf('m') < 0 && !data.keys.shift) {
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
		for (var i = 0; i < others.length; i++) {
		  var other = getBoundingBox(this.window, others[i]);
		  if (Math.abs(box.width - other.width) <= snapToSize && Math.abs(box.height - other.height) <= snapToSize) {
			box.width = other.width;
			box.height = other.height;
			break;
		  }
		}
	  }
	  //recalculate left or top position
	  if (~attr.indexOf('l')) {
		box.left = this.box.width - box.width;
	  }
	  if (~attr.indexOf('t')) {
		box.top = this.box.height - box.height;
	  }
	},
	resizeComplete: function() {
	  resizeElement(this.el, this.result.width, this.result.height);
	}
};

function DragEvent(window, document) {
	this.window = window;
	this.document = document;
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
	  this.startPos = {x: e.clientX, y: e.clientY};
	  this.update(e);
	  var events = this.events;
	  this.document.addEventListener('mousemove', events.mousemove, false);
	  this.document.addEventListener('keydown', events.keydown, false);
	  this.document.addEventListener('mouseup', events.mouseup, false);
	  this.document.body.classList.add('dragging-' + this.attr);
	  this.onStart && this.onStart();
	},
	update: function(e) {
	  this.currentPos = {x: e.clientX, y: e.clientY};
	  this.delta = {x: e.clientX - this.startPos.x, y: e.clientY - this.startPos.y};
	  this.keys = {shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey};
	},
	mousemove: function(e) {
	  this.update(e);
	  this.onDrag && this.onDrag();
	  if (e.which === 0) {
		//mouse button released outside window; mouseup wasn't fired (Chrome)
		this.mouseup(e);
	  }
	},
	keydown: function(e) {
	  //escape key cancels dragging
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
	  this.document.body.classList.remove('dragging-' + this.attr);
	  var events = this.events;
	  this.document.removeEventListener('mousemove', events.mousemove, false);
	  this.document.removeEventListener('keydown', events.keydown, false);
	  this.document.removeEventListener('mouseup', events.mouseup, false);
	  this.onRelease && this.onRelease();
	}
};

//helper functions
function toArray(obj) {
	var len = obj.length, arr = new Array(len);
	for (var i = 0; i < len; i++) {
	  arr[i] = obj[i];
	}
	return arr;
}

function bind(fn, ctx) {
	if (fn.bind) {
	  return fn.bind(ctx);
	}
	return function() {
	  fn.apply(ctx, arguments);
	};
}

function positionElement(el, left, top) {
	el.style.left = String(left) + 'px';
	el.style.top = String(top) + 'px';
}

function resizeElement(el, width, height) {
	el.style.width = String(width) + 'px';
	el.style.height = String(height) + 'px';
}

function getBoundingBox(window, el) {
	var rect = el.getBoundingClientRect();
	return {
	  left: rect.left + window.pageXOffset,
	  top: rect.top + window.pageYOffset,
	  width: rect.width,
	  height: rect.height
	};
}
function setMomentPtBr() {
    moment.defineLocale('pt-br', {
            months : 'janeiro_fevereiro_mar\u00E7o_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays : 'domingo_segunda-feira_ter\u00E7a-feira_quarta-feira_quinta-feira_sexta-feira_s\u00E1bado'.split('_'),
            weekdaysShort : 'dom_seg_ter_qua_qui_sex_s\u00E1b'.split('_'),
            weekdaysMin : 'dom_2\u00AA_3\u00AA_4\u00AA_5\u00AA_6\u00AA_s\u00E1b'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY [\u00E1s] LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY [\u00E1s] LT'
            },
            calendar : {
                sameDay: '[Hoje \u00E0s] LT',
                nextDay: '[Amanh\u00E3 \u00E0s] LT',
                nextWeek: 'dddd [\u00E0s] LT',
                lastDay: '[Ontem \u00E0s] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[\u00DAltimo] dddd [\u00E1s] LT' : // Saturday + Sunday
                        '[\u00DAltima] dddd [\u00E1s] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'em %s',
                past : '%s atr\u00E1s',
                s : 'segundos',
                m : 'um minuto',
                mm : '%d minutos',
                h : 'uma hora',
                hh : '%d horas',
                d : 'um dia',
                dd : '%d dias',
                M : 'um m\u00EAs',
                MM : '%d meses',
                y : 'um ano',
                yy : '%d anos'
            },
            ordinal : '%dº'
        });
    moment.locale('pt-br');
}

// SINCRONIZA COM GOOGLE DOCS
var CSSJSON=new function(){var e=this;e.init=function(){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")},String.prototype.repeat=function(e){return new Array(1+e).join(this)}},e.init();var t=/\/\*[\s\S]*?\*\//g,r=/([^\:]+):([^\;]*);/,n=/(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gim,o=function(e){return void 0===e||0==e.length||null==e};e.toJSON=function(i,a){var s={children:{},attributes:{}},u=null,l=0;if(void 0===a)a={ordered:!1,comments:!1,stripComments:!1,split:!1};for(a.stripComments&&(a.comments=!1,i=i.replace(t,""));null!=(u=n.exec(i));)if(!o(u[1])&&a.comments){var f=u[1].trim();s[l++]=f}else if(o(u[2])){if(!o(u[3]))return s;if(!o(u[4])){var c=u[4].trim(),d=r.exec(c);if(d){p=d[1].trim();var m=d[2].trim();if(a.ordered)(S={}).name=p,S.value=m,S.type="attr",s[l++]=S;else if(p in s.attributes){var v=s.attributes[p];v instanceof Array||(s.attributes[p]=[v]),s.attributes[p].push(m)}else s.attributes[p]=m}else s[l++]=c}}else{var p=u[2].trim(),h=e.toJSON(i,a);if(a.ordered){var S;(S={}).name=p,S.value=h,S.type="rule",s[l++]=S}else{if(a.split)var y=p.split(",");else y=[p];for(var b=0;b<y.length;b++){var g=y[b].trim();if(g in s.children)for(var C in h.attributes)s.children[g].attributes[C]=h.attributes[C];else s.children[g]=h}}}return s},e.toCSS=function(e,t,r){var n="";if(void 0===t&&(t=0),void 0===r&&(r=!1),e.attributes)for(i in e.attributes){var o=e.attributes[i];if(o instanceof Array)for(var a=0;a<o.length;a++)n+=u(i,o[a],t);else n+=u(i,o,t)}if(e.children){var s=!0;for(i in e.children)r&&!s?n+="\n":s=!1,n+=l(i,e.children[i],t)}return n},e.toHEAD=function(t,r,i){var n=document.getElementsByTagName("head")[0],u=document.getElementById(r),l=null!==u&&u instanceof HTMLStyleElement;if(!o(t)&&n instanceof HTMLHeadElement){if(l){if(!0!==i&&!o(i))return;u.removeAttribute("id")}(function(e){return!o(e)&&e.attributes&&e.children})(t)&&(t=e.toCSS(t));var f=document.createElement("style");if(f.type="text/css",o(r)?f.id="cssjson_"+s():f.id=r,f.styleSheet?f.styleSheet.cssText=t:f.appendChild(document.createTextNode(t)),n.appendChild(f),a(f))l&&u.parentNode.removeChild(u);else{if(f.parentNode.removeChild(f),!l)return;u.setAttribute("id",r),f=u}return f}},"undefined"!=typeof window&&(window.createCSS=e.toHEAD);var a=function(e){return e instanceof HTMLStyleElement&&e.sheet.cssRules.length>0},s=function(){return Date.now()||+new Date},u=function(e,t,r){return"\t".repeat(r)+e+": "+t+";\n"},l=function(t,r,i){var n="\t".repeat(i)+t+" {\n";return n+=e.toCSS(r,i+1),n+="\t".repeat(i)+"}\n"}};"object"==typeof module&&(module.exports=CSSJSON);

function loadGoogleDocs(url, iframeDoc, mode) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){ 
            if ( data ) { console.log(data);
                var r = confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
                if (r == true) { 
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    if ( CKEDITOR.dialog.getCurrent().getContentElement((mode == 'sheets' ? 'tab3' : 'tab2'), (mode == 'sheets' ? 'replaceTextSheets' : 'replaceTextDocs')).getValue() == true ) {
                        iframeDoc.find('body').html(data);
                        oEditor.fire('saveSnapshot');
                        enableButtonSavePro();
                        DocsToSEI(iframeDoc, mode);
                    } else {
                        var select = oEditor.getSelection().getStartElement();
                        var pElement = $(select.$).closest('p');
                        if ( pElement.length > 0 ) {
                            iframeDoc.find(pElement).before(data);
                            oEditor.fire('saveSnapshot');
                            enableButtonSavePro();
                            DocsToSEI(iframeDoc, mode);
                        }
                    }
                    if (CKEDITOR.dialog.getCurrent() !== null) CKEDITOR.dialog.getCurrent().hide();
                }
            }
        },
        error: function(data) {
            alert('Nenhum documento encontrado! \nConfira se o documento est\u00E1 acess\u00EDvel por qualquer pessoa na internet e tente novamente.')
        }
    });
}
function getBase64Image(imgObj) {
    var imgUrl = imgObj.attr('src');
    var img = new Image();

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

    // onload fires when the image is fully loadded, and has width and height
    img.onload = function(){

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
          imgObj.attr('src', dataURL).css({'overflow': '', 'display': '', 'transform': '', 'margin-top': '', 'margin-left': ''}).addClass('img-base64');
          imgObj.closest('span').replaceWith(function() {
             return $('img', this);
          });
    };
}
function validarTagsPro() {
  for (inst in CKEDITOR.instances) {
    var editor = CKEDITOR.instances[inst];
    if (!editor.readOnly) {
      var tags = ['img', 'button', 'input', 'select', 'iframe', 'frame', 'embed', 'object', 'param', 'video', 'audio', 'form'];
      for (var i = 0; i < tags.length; i++) {
        var elements = editor.document.getElementsByTag(tags[i]);
        if (elements.count() > 0) {
          switch (tags[i]) {
            case 'img':
                var erro=false;
              if (arrImgPermitida.length == 0) {
                console.log('Nao sao permitidas imagens no conteudo.');
                erro=true;
                break;
              } else {
                var posIni = null;
                var posFim = null;
                var n = elements.count();
                for (var j = 0; j < n; j++) {
                  ImgSrc = elements.getItem(j).getAttribute('src');
                  posIni = ImgSrc.indexOf('/');
                  if (posIni != -1) {
                    posFim = ImgSrc.indexOf(';', posIni);
                    if (posFim != -1) {
                      posIni = posIni + 1;
                      if (arrImgPermitida.indexOf(ImgSrc.substr(posIni, (posFim - posIni))) == -1) {
                        console.log('Imagem formato "' + ImgSrc.substr(posIni, (posFim - posIni)) + '" nao permitida.');
                        erro=true;
                        break;
                      }
                    } else {
                      console.log('Nao sao permitidas imagens referenciadas.'); 
                      console.log(ImgSrc, posIni, posFim);
                      erro=true;
                      break;
                    }
                  }
                }
              }
              if (erro) break;
              continue;
            case 'button':
            case 'input':
            case 'select':
              console.log('Nao sao permitidos componentes de formulario HTML no conteudo.');
              break;

            case 'iframe':
              console.log('Nao sao permitidos formularios ocultos no conteúdo.');
              break;

            case 'frame':
            case 'form':
              console.log('Nao sao permitidos formularios no conteúdo.');
              break;

            case 'embed':
            case 'object':
            case 'param':
              console.log('Nao sao permitidos objetos no conteudo.');
              break;

            case 'video':
              console.log('Nao sao permitidos videos no conteudo.');
              break;

            case 'audio':
              console.log('Nao e permitido audio no conteúdo.');
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
    if ($('#frmEditor').length > 0) {
        var idEditor = $('#idEditor').val();
        $('div#cke_'+idEditor).find('.cke_button__save').removeClass('cke_button_disabled').addClass('cke_button_off').removeAttr('aria-disabled').css('background-color','');
        CKEDITOR.instances[idEditor].commands.save.state = undefined;
        if (CKEDITOR.dialog.getCurrent() != null ) {
            CKEDITOR.dialog.getCurrent().hide();
        }
        console.log('enableButtonSavePro')
    }
}
function DocsToSEI(iframeDoc, mode) {
    if (mode == 'sheets') {
        iframeDoc.find('body #sheets-viewport div').each(function(){
            var _this = $(this);
            var idTab = _this.attr('id');
            var titleTab = iframeDoc.find('#sheet-button-'+idTab);
                titleTab = (titleTab.length > 0) ? titleTab.text() : false;
                _this.show();
            if (titleTab) {
                _this.prepend(   '<p class="Texto_Alinhado_Esquerda"><br></p>'+
                                '<p class="Texto_Alinhado_Esquerda"><strong>'+titleTab+'</strong></p>'+
                                '<p class="Texto_Alinhado_Esquerda"><br></p>'
                            );
            }
        });
        iframeDoc.find('body #top-bar').remove();
        iframeDoc.find('body #footer').remove();
        iframeDoc.find('body table tbody th.row-headers-background.row-header-shim').remove();
    }
    iframeDoc.find('body link').remove();
    iframeDoc.find('body style').data('style','seipro-import');
    iframeDoc.find('body meta').remove();
    iframeDoc.find('body title').remove();
    iframeDoc.find('body script').remove();
    iframeDoc.find('a').each(function(){
        var urlLink = ( typeof $(this).attr('href') !== 'undefined' && $(this).attr('href') != '' ) ? $(this).attr('href') : '';
            urlLink = ( urlLink != '' && urlLink.indexOf('https://www.google.com/url?q=') !== -1 ) 
                        ? getParamsUrlPro(urlLink).q
                        : urlLink;
        $(this).attr('href', urlLink).attr('target', '_blank').attr('rel', 'noreferrer');
    });
    ImgToBase64(iframeDoc);
    convertCSSToStyle(iframeDoc);
    enableButtonSavePro();
    //setAllLinkTips();
}
function convertCSSToStyle(iframeDoc) {
    var seiproImport = iframeDoc.find('style[data-style="seipro-import"]');
    if (typeof seiproImport !== 'undefined' && seiproImport.length > 0) {

        seiproImport.each(function(){
            var css = $.map($(this).text().split(';'), function(substr, i) {
                return (substr.indexOf('@import') === -1) ? substr : null;
            }).join(';');
            $(this).text(css);
        });
        var CSSString = seiproImport.html().toString();
        var arrayCSS = CSSJSON.toJSON(CSSString).children;
        for (var key in arrayCSS) {
            if (arrayCSS.hasOwnProperty(key)) {
                var style = arrayCSS[key].attributes;
                var className = key.toString().replace('.','');
                if ( !$.isEmptyObject(style) ) {
                    iframeDoc.find(key).each(function(){
                        if ( (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'P') || (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'SPAN') ) {
                            for (var key in style) {
                                if (style.hasOwnProperty(key)) {
                                    if ( key == 'font-style' && style[key] == 'italic' ) {
                                        $(this).wrapInner('<em></em>');
                                    } else if ( key == 'font-weight' && ( style[key] == 'bold' || style[key] == 'bolder' || parseFloat(style[key]) >= 600 ) ) {
                                        $(this).wrapInner('<strong></strong>');
                                    } else if ( key == 'text-decoration' && style[key] == 'underline' ) {
                                        $(this).wrapInner('<u></u>');
                                    } else if ( key == 'text-decoration' && style[key] == 'line-through' ) {
                                        $(this).wrapInner('<s></s>');
                                    } else if ( key == 'vertical-align' && style[key] == 'sub' ) {
                                        $(this).wrapInner('<sub></sub>');
                                    } else if ( key == 'vertical-align' && style[key] == 'super' ) {
                                        $(this).wrapInner('<sup></sup>');
                                    }
                                }
                            }
                        }
                        if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'P' ) {
                            var styleP = ( style['text-align'] == 'center' ) ? 'Texto_Centralizado': 'Texto_Alinhado_Esquerda';
                                styleP = ( $(this).hasClass('Texto_Centralizado') ) ? 'Texto_Centralizado' : styleP;
                                styleP = ( $(this).hasClass('Tabela_Texto_Alinhado_Esquerda') ) ? 'Tabela_Texto_Alinhado_Esquerda' : styleP;
                            var allowed = ['background-color'];
                            var filteredStyle = Object.keys(style)
                                          .filter(key => allowed.includes(key))
                                          .reduce((obj, key) => {
                                            obj[key] = style[key];
                                            return obj;
                                          }, {});
                            $(this).addClass(styleP).removeClass(className);
                        } else if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'TABLE' ) {
                            $(this).css('margin','auto');
                        } else if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'SPAN' ) {
                            var allowed = ['color', 'background-color'];
                            var filteredStyle = Object.keys(style)
                                          .filter(key => allowed.includes(key))
                                          .reduce((obj, key) => {
                                            obj[key] = style[key];
                                            return obj;
                                          }, {});
                            $(this).css(filteredStyle).removeClass(className);
                            if ($.isEmptyObject(filteredStyle)) {
                                $(this).after($(this).html()).remove();
                            }
                        } else if ( (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'LI') || (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'UL') ) {
                            var allowed = ['margin', 'margin-left', 'margin-top', 'margin-rigth', 'margin-left', 'padding', 'padding-left', 'padding-top', 'padding-rigth', 'padding-left', 'color', 'background-color'];
                            var filteredStyle = Object.keys(style)
                                          .filter(key => allowed.includes(key))
                                          .reduce((obj, key) => {
                                            obj[key] = style[key];
                                            return obj;
                                          }, {});
                            if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'LI' && $(this).find('p.Tabela_Texto_Alinhado_Esquerda').length == 0 ) {
                                $(this).wrapInner('<p></p>').find('p').eq(0).addClass('Tabela_Texto_Alinhado_Esquerda').css('display','contents');
                            }
                            $(this).css(filteredStyle).removeClass(className);
                        } else {
                            $(this).css(style).removeClass(className);
                        }
                    });
                } else {
                    iframeDoc.find(key).each(function(){
                        if (typeof $(this)[0] !== 'undefined' && ( $(this)[0].tagName == 'P' || $(this)[0].tagName == 'SPAN')) {
                            $(this).removeClass(className);
                        }
                    });
                }
            }
        }
    }
    //iframeDoc.find('style[data-style="seipro-import"]').remove();
}
function isBase64(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}
function ImgToBase64(iframeDoc, TimeOut = 1000) {
    if (TimeOut <= 0) { 
        iframeDoc.find('img').not('.img-base64').each(function(){
            if (!isBase64($(this).attr('src'))) { 
                $(this).after('<span style="color:#FF0000;"><span style="background-color:#FFFF00;">[!Erro ao converter a imagem!]</span></span>');
                $(this).remove();
            }
        });
        return; 
    }
    iframeDoc.find('img').not('.img-base64').each(function(){
        if (!isBase64($(this).attr('src'))) { 
            getBase64Image($(this));
        }
    });
    setTimeout(function(){ 
        if (!validarTagsPro()) { 
            console.log('RELOAD', TimeOut);
            ImgToBase64(iframeDoc, TimeOut - 200); 
        }
    }, 1000);
}
function openLinkNewTab(url) {
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
function openLinkSEIPro(id_procedimento) {
    //var url_host = window.location.href.split('?')[0];
    var url = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
function openSEINrPro(this_, nrSEI){
    // $('#txtPesquisaRapida').val(nrSEI);
    // $('#frmProtocoloPesquisaRapida').submit();
    var _this = $(this_);
    var title = _this.text();
    var iconLoad = _this.find('i').attr('class');
        _this.data('icon-load', iconLoad);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');
    getIDProtocoloSEI(nrSEI,  
        function(html){
            let $html = $(html);
            var param = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                param.title = title;
            console.log(param);
            openDialogDoc(param);
            _this.find('i').attr('class', _this.data('icon-load'));
        }, 
        function(){
            alertBoxPro();
        }
    );
}
function openEditorDoc(paramData) {
    var htmlEditorBox =  '<div class="editorBoxProDiv" style="width: 100%; margin: 0; text-align: center;">'+
                         '  <input type="hidden" id="editor_id" value="'+paramData.id+'" tabindex="0">'+
                         '  <textarea id="editor_doc" class="setClassEditor" name="editor_doc" style="min-height: 200px;">'+paramData.text+'</textarea>'+
                         '</div>';
    resetDialogBoxPro('editorBoxPro');
    // console.log(paramData);
    editorBoxPro = $('#editorBoxPro')
        .html(htmlEditorBox)
        .dialog({
            width: 980,
            height: 820,
            title: (paramData.title_page ? paramData.title_page : ''),
            open: function() { 
                updateButtonConfirm(this, true);
                getEditorConfigOptions();
                // initClassicEditor();
            },
            buttons: [{
                text: 'Salvar documento',
                icon: 'ui-icon-disk',
                click: function(event) {
                    var dataEditor = configClassicEditor['editor_doc'].getData();

                    var action = 'edit_documento';
                    var param = {
                        action: action,
                        id_documento: paramData.id_documento,
                        title: paramData.title,
                        mode: paramData.mode,
                        id_reference: paramData.id_reference,
                        reference: paramData.reference,
                        type: paramData.type,
                        text: dataEditor
                    };
                    getConfigServer(action, param);
                    // console.log(action, param);
                }
            }]
        });
}
function openEditorViewDoc(paramData, paramTarget, dataResult) {
    // console.log(paramData, paramTarget, dataResult);
    if (!paramTarget.return_sign || paramTarget.return_sign && (dataResult.status_assinatura || !dataResult.status_assinatura && (paramTarget.return_user == arrayConfigAtividades.perfil.id_user))) {
        var htmlEditorBox =  '<div class="editorBoxProDiv ck ck-reset ck-editor ck-rounded-corners" style="width: 100%; margin: 0; text-align: center;">'+
                            '  <div class="ck ck-editor__main">'+
                            '      <div id="view_doc" class="readOnly ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline" name="view_doc">'+
                            '      </div>'+
                            '  </div>'+
                            (dataResult.status_assinatura ? 
                            '  <div class="signed">'+
                            '      <span>'+
                            '          <i class="fas fa-key laranjaColor" style="margin-right: 10px;"></i>'+
                            '          Documento assinado eletronicamente por <strong style="font-weight: bold;">'+dataResult.config.assinatura[0].nome_completo+'</strong>, em '+moment(dataResult.config.assinatura[0].datetime, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [\u00E0s] HH:mm')+', conforme hor\u00E1rio oficial de Bras\u00EDlia'+
                            '      </span>'+
                            '  </div>'+
                            '' : '')+
                            '</div>';
        resetDialogBoxPro('editorBoxPro');
        // console.log(paramData, paramTarget);

        var btnDialogBoxPro = [{
            text: 'Imprimir Documento',
            icon: 'ui-icon-print',
            click: function(event) {
                printDocumento();
            }
        }];
        
        if (paramTarget.return_sign && dataResult.status_assinatura) {
            if (checkCapacidade('sign_cancel_documento')) {
                btnDialogBoxPro = [{
                    text: 'Imprimir Documento',
                    icon: 'ui-icon-print',
                    click: function(event) {
                        printDocumento();
                    }
                },{
                    text: 'Cancelar Assinatura',
                    icon: 'ui-icon-close',
                    click: function(event) {
                        signCancelDocumento(paramData);
                    }
                }];
            }
        } else if (paramTarget.return_sign && !dataResult.status_assinatura && (paramTarget.return_user == arrayConfigAtividades.perfil.id_user)) {
            btnDialogBoxPro = [{
                text: 'Assinar documento',
                class: 'confirm ui-state-active',
                click: function(event) {
                    if (!checkDocAssinatura(this)) {
                        scrollToElement($(this).closest('.ui-dialog').find('#view_doc'), $(this).closest('.ui-dialog').find('.requiredNull').eq(0));
                        alertaBoxPro('Error', 'exclamation-triangle', 'Preencha os campos sinalizados no documento!');
                    } else {
                        var _this = this;
                        confirmaFraseBoxPro('Voc\u00EA est\u00E1 de acordo com os termos do documento proposto?', 'DE ACORDO', function() { 
                            var keys = extractDataDocument(_this);
                                closeEditorViewBeforeSign(_this);
                            var dataEditor = $('#view_doc').html();
                            var action = 'sign_documento';
                            var param = {
                                action: action,
                                id_documento: paramData.id_documento,
                                title: paramData.title,
                                mode: paramData.mode,
                                id_reference: paramData.id_reference,
                                reference: paramData.reference,
                                text: fixedEncodeURIComponent(dataEditor),
                                keys: keys,
                                type: paramData.type
                            };
                            // getConfigServer(action, param);
                            getConfigServerDoc(action, param);
                        });
                    }
                }
            }];
        }
        
        editorBoxPro = $('#editorBoxPro')
            .html(htmlEditorBox)
            .dialog({
                width: 980,
                height: (dataResult.status_assinatura ? 790 : 750),
                title: (paramData.title_page ? paramData.title_page : ''),
                open: function() { 
                    updateButtonConfirm(this, true);
                    var textEncode = (is_html(paramData.text)) ? paramData.text : $("<div/>").html(paramData.text).text();
                    if (paramData.reference == 'modelo' && paramTarget.return_sign) {
                        var user = (typeof paramTarget.return_user !== 'undefined' && paramTarget.return_user) ? paramTarget.return_user : false
                        textEncode = setParamEditorAtiv(paramData.mode, textEncode, user);
                    }
                    $('#view_doc').html(textEncode);
                    if (paramTarget.return_sign) {
                        loadFunctionEditorView(this);
                    }
                },
                buttons: btnDialogBoxPro
            });
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Assinatura dispon\u00EDvel apenas para o usu\u00E1rio!');
    }
}
function printDocumento() {
    var htmlPrint = $('#view_doc').html()+$('.signed')[0].outerHTML;

        $('#printBoxPro').addClass('hidePrint').html(htmlPrint);
        $('.infraAreaGlobal').addClass('hidePrint');
        $('.ui-dialog').addClass('hidePrint');
        window.print();

        setTimeout(function(){ 
            $('#printBoxPro').removeClass('hidePrint').html('');
            $('.infraAreaGlobal').removeClass('hidePrint');
            $('.ui-dialog').removeClass('hidePrint');
        }, 500);
}
function checkDocAssinatura(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var count_list = 0;
    var check_list = false;
    var check_required = false;
    _parent.find('.todo-list input[type="checkbox"]').each(function(){
        count_list = ($(this).attr('checked') == 'checked') ? count_list+1 : count_list;
    });
    if (count_list != 1) {
        _parent.find('.todo-list').addClass('requiredNull');
        check_list = true;
    } else {
        _parent.find('.todo-list').removeClass('requiredNull');
    }

    _parent.find('input').each(function(){
        if ($(this).prop('required') && $(this).val() == '' ) { 
            $(this).addClass('requiredNull');
            check_required = true;
        } else {
            $(this).removeClass('requiredNull');
        }
    });
    return (!check_list && !check_required) ? true : false;
}
function closeEditorViewBeforeSign(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var style_field = 'font-weight: bold;padding: 5px 8px;margin: 5px 0px;display: inline-block;background: #f5f5f5;border-radius: 5px;';
    _parent.find('input[type="time"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+$(this).val()+'</span>').remove();
    });
    _parent.find('select').each(function(){
        $(this).after('<span style="'+style_field+'">'+$(this).find('option:selected').val()+'</span>').remove();
    });
    _parent.find('input[type="text"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+$(this).val()+'</span>').remove();
    });
    _parent.find('input[type="number"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+parseInt($(this).val())+'</span>').remove();
    });
    _parent.find('input[type="date"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+moment($(this).val(),'YYYY-MM-DD').format('DD/MM/YYYY')+'</span>').remove();
    });
    _parent.find('input[type="datetime-local"]').each(function(){
        $(this).after('<span style="'+style_field+'">'+moment($(this).val(),'YYYY-MM-DDTHH:mm').format('DD/MM/YYYY HH:mm')+'</span>').remove();
    });
    _parent.find('input[type="checkbox"]').each(function(){
        if ($(this).attr('checked') == 'checked') {
            var icone = '[X]';
            $(this).closest('label').css({'background': '#f5f5f5', 'border-radius': '5px', 'text-decoration': 'underline'});
            $(this).closest('label').find('.todo-list__label__description').css({'font-weight': 'bold'});
        } else {
            var icone = '[_]';
        }
        $(this).after('<span style="'+style_field+'">'+icone+'</span>').remove();
    });
}
function loadFunctionEditorView(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    _parent.find('.todo-list__label').find('input[type="checkbox"]').prop('disabled',false);
    _parent.find('.todo-list__label').unbind().on('click', function(e){
        e.preventDefault();
        $('.todo-list__label input[type="checkbox"]').not(this).attr('checked', false);
       var checkbox = $(this).find('input[type="checkbox"]');
        if (checkbox.attr('checked') == 'checked') {
           checkbox.removeProp('checked');
           checkbox.removeAttr('checked');
        } else {
           checkbox.prop('checked','checked');
           checkbox.attr('checked','checked');
        }
    });
    if (typeof $.mask !== 'undefined') {
        if (_parent.find("input[data-key='tel_celular']").length > 0) {
            _parent.find("input[data-key='tel_celular']").mask("(99) 99999-999?9", {completed: function () { 
                this.removeClass('requiredNull');
             }});
        }
        if (_parent.find("input[data-key='tel_residencial']").length > 0) {
            _parent.find("input[data-key='tel_residencial']").mask("(99) 9999-9999");
        }
    }
}
function getEditorConfigOptions(readonly = false) {
    if ($('.setClassEditor').length > 0) {
        $('.setClassEditor').each(function(){
            ClassicEditor.create( this, {
                toolbar: (readonly ? null : {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'link',
                        'bulletedList',
                        'numberedList',
                        'alignment',
                        '|',
                        'fontColor',
                        'fontBackgroundColor',
                        'fontFamily',
                        'fontSize',
                        '|',
                        'highlight',
                        'strikethrough',
                        'subscript',
                        'superscript',
                        'horizontalLine',
                        '|',
                        'undo',
                        'redo',
                        '-',
                        'todoList',
                        'insertTable',
                        '|',
                        'blockQuote',
                        'outdent',
                        'indent',
                        '|',
                        'htmlEmbed',
                        'mediaEmbed',
                        'sourceEditing'
                    ],
                    shouldNotGroupWhenFull: true
                }),
                language: 'pt-br',
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side'
                    ]
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableCellProperties',
                        'tableProperties'
                    ]
                }
            }).then( editor => {
                console.log( 'Editor was initialized', editor );
                configClassicEditor[$(this).attr('id')] = editor;
                if (readonly) {
                    configClassicEditor[$(this).attr('id')].isReadOnly = true;
                }
            })
            .catch( error => {
                console.error( error );
            });
        })
    }
}
function openDialogAnexo(this_) {
    var _this = $(this_);
    var data = _this.data();
    var iconLoad = _this.find('i').attr('class');
        _this.data('icon-load', iconLoad);
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');

    var btnDialogBoxPro = [{
        text: 'Baixar',
        icon: 'ui-icon-disk',
        click: function(event) {
            var link = document.createElement('a');
            link.href = data.url;
            link.download = data.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },{
        text: 'Abrir',
        icon: 'ui-icon-extlink',
        click: function(event) {
            var win = window.open(data.url, '_blank');
            if (win) {
                win.focus();
            } else {
                alert('Por favor, permita popups para essa p\u00E1gina');
            }
            resetDialogBoxPro('iframeBoxPro');
        }
    }];
    resetDialogBoxPro('iframeBoxPro');
    iframeBoxPro = $('#iframeBoxPro')
        .html('<div class="iframeBoxDiv" style="width: 100%; height: 100%; margin: 0;"><iframe src="'+data.url+'" frameborder="0" height="100%" width="100%"></iframe></div>')
        .dialog({
            width: 950,
            height: $(window).height(),
            title: data.title,
            open: function(){
                _this.find('i').attr('class', _this.data('icon-load'));
            },
            buttons: btnDialogBoxPro
        });
}
function openDialogDoc(param, forceDownload = false, _this = false) {
    var href = url_host+'?acao=procedimento_trabalhar&id_procedimento='+param.id_procedimento+'&id_documento='+param.id_documento;

    if (forceDownload) {
        _this.find('i').attr('class', 'fas fa-spinner fa-spin');
    } else {
        var btnDialogBoxPro = [{
                text: 'Imprimir',
                icon: 'ui-icon-print',
                click: function(event) {
                    var htmlPrint = $('.iframeBoxDiv iframe').contents().find('html');
                    $('#printBoxPro').addClass('hidePrint').html(htmlPrint);
                    $('.infraAreaGlobal').addClass('hidePrint');
                    $('.ui-dialog').addClass('hidePrint');
                    window.print();

                    setTimeout(function(){ 
                        $('#printBoxPro').removeClass('hidePrint').html('');
                        $('.infraAreaGlobal').removeClass('hidePrint');
                        $('.ui-dialog').removeClass('hidePrint');
                        resetDialogBoxPro('iframeBoxPro');
                    }, 500);
                }
            },{
                text: 'Baixar',
                icon: 'ui-icon-disk',
                click: function(event) {
                    var iframeBoxDiv = $('.iframeBoxDiv iframe').contents();
                    var nameFile = iframeBoxDiv.find('title').text();
                    var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
                        contentDocument += iframeBoxDiv.find('html')[0].outerHTML;
                    var downloadLink = document.createElement("a");
                    var blob = new Blob(["\ufeff", contentDocument]);
                    var url = URL.createObjectURL(blob);
                    downloadLink.href = url;
                    downloadLink.download = nameFile+'.html';
                    
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            },{
                text: 'Abrir',
                icon: 'ui-icon-extlink',
                click: function(event) {
                    var win = window.open(href, '_blank');
                    if (win) {
                        win.focus();
                    } else {
                        alert('Por favor, permita popups para essa p\u00E1gina');
                    }
                    resetDialogBoxPro('iframeBoxPro');
                }
            }];
        resetDialogBoxPro('iframeBoxPro');
        iframeBoxPro = $('#iframeBoxPro')
            .html('<div class="iframeBoxDiv" style="width: 100%; margin: 10% 0; text-align: center;"><i class="fas fa-spinner fa-spin azulColor" style="font-size: 22pt;"></i></div>')
            .dialog({
                width: 500,
                height: 200,
                title: (param.title ? param.title : ''),
                buttons: btnDialogBoxPro
            });
    }

    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr('src');
        $.ajax({ url: urlArvore }).done(function (htmlArvore) {
            var urlVisualizacao = $.map(htmlArvore.split('\n'), function(substr, i) {
                    return (substr.indexOf("'controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento="+param.id_documento+"&") !== -1) ? substr : null;
                }).join('');
                urlVisualizacao = (urlVisualizacao != '') ? urlVisualizacao.split("'")[1] : false;
                urlVisualizacao = (urlVisualizacao) ? url_host+urlVisualizacao.replace('controlador.php', '') : false;
            
            var procVisualizacao = $.map(htmlArvore.split('\n'), function(substr, i) {
                    return (substr.indexOf('new infraArvoreNo("PROCESSO"') !== -1) ? substr : null;
                }).join('');
                procVisualizacao = (procVisualizacao != '') ? procVisualizacao.split(",") : false;
                procVisualizacao = (procVisualizacao) ? procVisualizacao[procVisualizacao.length - 1] : false;
                procVisualizacao = (procVisualizacao) ? procVisualizacao.split('"')[1] : false;
                
            if (urlVisualizacao) {
                if (forceDownload) {
                    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
                    $('#frmCheckerProcessoPro').attr('src', urlVisualizacao).unbind().on('load', function(){
                        var nameFile = $(this).contents().find('title').text();
                        var contentDocument = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
                            contentDocument += $(this).contents().find('html')[0].outerHTML;
                        var downloadLink = document.createElement("a");
                        var blob = new Blob(["\ufeff", contentDocument]);
                        var url = URL.createObjectURL(blob);
                        downloadLink.href = url;
                        downloadLink.download = nameFile+'.html';
                        
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);

                        _this.attr('onmouseover','return infraTooltipMostrar(\'Documento baixado\')').find('i').attr('class', 'fas fa-download verdeColor');
                        _this.closest('tr').addClass('infraTrAcessada').addClass('infraDocBaixado');
                        //scrollToElement($('html'),_this.closest('tr'), 50);
                    });

                } else {
                    resetDialogBoxPro('iframeBoxPro');
                    iframeBoxPro = $('#iframeBoxPro')
                        .html('<div class="iframeBoxDiv" style="width: 100%; height: 100%; margin: 0;"><iframe src="'+urlVisualizacao+'" frameborder="0" height="100%" width="100%"></iframe></div>')
                        .dialog({
                            width: 950,
                            height: $(window).height(),
                            title: (param.title ? param.title : ''),
                            close: function() { 
                                iframeBoxPro = false;
                                $('.iframeBoxPro').html('');
                            },
                            buttons: btnDialogBoxPro
                        });
                }
            } else {
                if (forceDownload) {
                    _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
                } else {
                    resetDialogBoxPro('iframeBoxPro');
                    alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel acessar o documento. <br> Verifique se o processo <a href="'+href+'" target="_blank" class="bLink" style="text-decoration: underline; font-size: 10pt;">'+procVisualizacao+'<i class="fas fa-external-link-alt bLink"" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i></a> est\u00E1 acess\u00EDvel para sua unidade');    
                }
            }
        }).fail(function(data){
            if (forceDownload) {
                _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
            } else {
                resetDialogBoxPro('iframeBoxPro');
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
            }
        });
    }).fail(function(data){
        if (forceDownload) {
            _this.attr('onmouseover','return infraTooltipMostrar(\'Erro ao baixar documento\')').find('i').attr('class', 'fas fa-exclamation-circle vermelhoColor');
        } else {
            resetDialogBoxPro('iframeBoxPro');
            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao acessar o documento.');
        }
    });
}
function updateDialogDefinitionPro() {
    CKEDITOR.on('dialogDefinition', function (ev) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;
            var dialog = dialogDefinition.dialog;
            if (dialogName == 'linkseiDialog') {
                dialogDefinition.onShow = function () {
                    var idEditor = this.getParentEditor().name;
                    $('#idEditor').val(idEditor);
                    insertProtocoloOnBox(idEditor);
                };
            }
            if (dialogName == 'simpleLinkDialog') {
                dialogDefinition.onShow = function () {
                    var idEditor = this.getParentEditor().name;
                    $('#idEditor').val(idEditor);
                    insertTextTotLink(idEditor);
                };
                dialogDefinition.onOk = function () {
                    var a = this.getParentEditor(),
                        b = {},
                        c = a.document.createElement("a");
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
                        c.setStyle("font-style", "italic")
                    }
                    c.setHtml(b.contents);
                    a.insertElement(c);
                    //console.log('setAllLinkTipsPro');
                    setTimeout(function(){ initDropImages() }, 1000);
                };
            }
    });
}
function centralizeDialogBox(el) {
    $(document).ready(function() {
        if (el) {
            el.dialog({ position: { my: "center", at: "center", of: window } });
        }
    });
}
function selectTextPro(el) {
    var sel, range;
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
         window.setTimeout(function(){
            range = document.createRange(); //range object
            range.selectNodeContents(el); //sets Range
            sel.removeAllRanges(); //remove all ranges from selection
            sel.addRange(range);//add Range to a Selection.
        },1);
      }
    }
}
function hashCompareDocToggle(this_) {
    if ($(this_).find('i').hasClass('fa-chevron-circle-down')) {
        $(this_).closest('#hashIntegrityPro').find('.hashCompareDoc').show();
        $(this_).find('i').addClass('fa-chevron-circle-up').removeClass('fa-chevron-circle-down');
    } else {
        $(this_).closest('#hashIntegrityPro').find('.hashCompareDoc').hide();
        $(this_).find('i').addClass('fa-chevron-circle-down').removeClass('fa-chevron-circle-up');
    }
}
function updateChecksumPro(hash) {
    var nameDoc = $('#ifrArvore').contents().find('.infraArvoreNoSelecionado').text();
    var droppableDoc =   '  <div class="input">'+
                         '      <div id="droppable-zone">'+
                         '          <div id="droppable-zone-wrapper">'+
                         '              <div id="droppable-zone-text"><i class="fa fa-upload cinzaColor" style="font-size: 16pt;"></i> Clique ou arraste para carregar um documento</div>'+
                         '          </div>'+
                         '          <input id="inputCompareDoc" type="file" placeholder="Clique ou arraste para carregar um documento" class="droppable-file">'+
                         '      </div>'+
                         '  </div>';
    var tableIntegrity = '<table>'+
                         '  <tr>'+
                         '    <td colspan="2"><h3><i class="iconPopup fa fa-file azulColor" style="margin: 3px 3px 0 0;"></i>'+nameDoc+'</h3></td>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td><label>MD5:</label></td>'+
                         '    <td><label class="hash hashMD5">'+hash.hashMD5+'</label></td>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td><label>SHA256:</label></td>'+
                         '    <td><label class="hash hashSHA256">'+hash.hashSHA256+'</label></td>'+
                         '  </tr>'+
                         '</table>'+
                         '<div><a onclick="hashCompareDocToggle(this)" class="newLink link_line" style="cursor:pointer"><i class="fa fa-chevron-circle-down cinzaColor" style="margin: 3px 3px 0 0;"></i> Comparar documento</a></div>'+
                         '<div class="hashCompareDoc" style="display:none;">'+
                         '          <input id="inputCompareDoc" style="font-size: 10pt; padding: 15px 10px;" type="file" placeholder="Clique ou arraste para carregar um documento">'+
                         '  <div id="outputompareDoc" style="border-radius: 10px; padding: 0 10px;"></div>'+
                         '</div>';
    $('#hashIntegrityPro').html(tableIntegrity).find('label.hash').on('mouseup', function() { 
        selectTextPro($(this)[0]);
    });
    $('#inputCompareDoc').on('change', function() {
        var input = $('#inputCompareDoc')[0];
        if (input.files && input.files[0]) {
            centralizeDialogBox(dialogBoxPro);
            $('#outputompareDoc').html('<i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...').css('background', '#fff');
            var global = global || window;
            const reader = new global.FileReader();
            reader.onload = event => {
                var result = event.target.result;
                var wordArray = CryptoJS.lib.WordArray.create(result),
                    hashMD5 = CryptoJS.MD5(wordArray).toString(),
                    hashSHA256 = CryptoJS.SHA256(wordArray).toString();
                    compareChecksumPro({hashMD5: hashMD5, hashSHA256: hashSHA256});
            };
            reader.readAsArrayBuffer(input.files[0]);
        }
    });
}
function compareChecksumPro(hash) {
    var hashMD5 = $('#hashIntegrityPro').find('.hashMD5').text();
    var hashSHA256 = $('#hashIntegrityPro').find('.hashSHA256').text();
    var statusCompare = (hashMD5 == hash.hashMD5 && hashSHA256 == hash.hashSHA256) ? {background: '#f8fdf7', icon: 'check-circle', color: 'verdeColor', text: 'Os c\u00F3digos de integridade s\u00E3o id\u00EAnticos'} : {background: '#fdf7f7', icon: 'times-circle', color: 'vermelhoColor', text: 'Os c\u00F3digos de integridade N\u00C3O s\u00E3o id\u00EAnticos'};
    var tableIntegrityCompare =  '<table>'+
                                 '  <tr>'+
                                 '    <td colspan="2"><h3><i class="iconPopup fa fa-'+statusCompare.icon+' '+statusCompare.color+'" style="font-size: 18pt;"></i>'+statusCompare.text+'</h3></td>'+
                                 '  </tr>'+
                                 '  <tr>'+
                                 '    <td><label>MD5:</label></td>'+
                                 '    <td><label class="hash hashMD5_compare">'+hash.hashMD5+'</label></td>'+
                                 '  </tr>'+
                                 '  <tr>'+
                                 '    <td><label>SHA256:</label></td>'+
                                 '    <td><label class="hash hashSHA256_compare">'+hash.hashSHA256+'</label></td>'+
                                 '  </tr>'+
                                 '</table>';
    $('#outputompareDoc')
        .html(tableIntegrityCompare)
        .css('background',statusCompare.background)
        .find('label.hash').on('mouseup', function() { 
            selectTextPro($(this)[0]);
    });
    centralizeDialogBox(dialogBoxPro);
}
function openChecksumPro() {
    var htmlBox = '<div id="hashIntegrityPro"><i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...</div>';
    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
            .dialog({
                title: "Visualizar C\u00F3digo de Integridade",
                width: 650
        });
}
function calculateHashPro(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function () {
      var wordArray = CryptoJS.lib.WordArray.create(reader.result),
          hashMD5 = CryptoJS.MD5(wordArray).toString(),
          hashSHA256 = CryptoJS.SHA256(wordArray).toString();
          updateChecksumPro({hashMD5: hashMD5, hashSHA256: hashSHA256});
          centralizeDialogBox(dialogBoxPro);
    };
}
function sendChecksumPro(url) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';

  xhr.onreadystatechange = function (event) {
    if (event.target.readyState == 4) {
      if (event.target.status == 200 || event.target.status == 0) {
        //Status 0 is setup when protocol is "file:///" or "ftp://"
        var blob = this.response;
        calculateHashPro(blob);
      } else {
      }
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
function getChecksumPro() {
    var linkAnexo = $('#ifrVisualizacao').contents().find(divInformacao+' a');
    var url = (linkAnexo.length > 0 && linkAnexo.attr('href').indexOf('acao=documento_download_anexo') !== -1) ? linkAnexo.attr('href') : false;
    if (url) { 
        openChecksumPro();
        sendChecksumPro(url);
    }
}

// GERA LISTA DE FERIADOS NACIONAIS
function easterDay(y) {
    var c = Math.floor(y / 100);
    var n = y - 19 * Math.floor(y / 19);
    var k = Math.floor((c - 17) / 25);
    var i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor((i / 30));
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    var j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    var l = i - j;
    var m = 3 + Math.floor((l + 40) / 44);
    var d = l + 28 - 31 * Math.floor(m / 4);
    return moment([y, (m - 1), d]);
};

function getHolidaysBr(y) {
    var anoNovo = moment('01/01/'+y,'DD/MM/YYYY');
    var carnaval1 = easterDay(y).add(-48, 'd');
    var carnaval2 = easterDay(y).add(-47, 'd');
    var paixaoCristo = easterDay(y).add(-2, 'd');
    var pascoa = easterDay(y);
    var tiradentes = moment('21/04/'+y,'DD/MM/YYYY');
    var corpusChristi =  easterDay(y).add(60, 'd');
    var diaTrabalho = moment('01/05/'+y,'DD/MM/YYYY');
    var diaIndependencia = moment('07/09/'+y,'DD/MM/YYYY');
    var nossaSenhora = moment('12/10/'+y,'DD/MM/YYYY');
    var finados = moment('02/11/'+y,'DD/MM/YYYY');
    var proclamaRepublica = moment('15/11/'+y,'DD/MM/YYYY');
    var natal = moment('25/12/'+y,'DD/MM/YYYY');
    return [
        {m: anoNovo, dia: 'Ano Novo', d: anoNovo.format('DD/MM/YYYY'), d_: anoNovo.format('YYYY-MM-DD') },
        {m: carnaval1, dia: 'Carnaval', d: carnaval1.format('DD/MM/YYYY'), d_: carnaval1.format('YYYY-MM-DD') },
        {m: carnaval2, dia: 'Carnaval', d: carnaval2.format('DD/MM/YYYY'), d_: carnaval2.format('YYYY-MM-DD') },
        {m: paixaoCristo, dia: 'Paix\u00E3o de Cristo', d: paixaoCristo.format('DD/MM/YYYY'), d_: paixaoCristo.format('YYYY-MM-DD') },
        {m: pascoa, dia: 'P\u00E1scoa', d: pascoa.format('DD/MM/YYYY'), d_: pascoa.format('YYYY-MM-DD') },
        {m: tiradentes, dia: 'Tiradentes', d: tiradentes.format('DD/MM/YYYY'), d_: tiradentes.format('YYYY-MM-DD') },
        {m: corpusChristi, dia: 'Corpus Christi', d: corpusChristi.format('DD/MM/YYYY'), d_: corpusChristi.format('YYYY-MM-DD') },
        {m: diaTrabalho, dia: 'Dia do Trabalho', d: diaTrabalho.format('DD/MM/YYYY'), d_: diaTrabalho.format('YYYY-MM-DD') },
        {m: diaIndependencia, dia: 'Dia da Independ\u00EAncia do Brasil', d: diaIndependencia.format('DD/MM/YYYY'), d_: diaIndependencia.format('YYYY-MM-DD') },
        {m: nossaSenhora, dia: 'Nossa Senhora Aparecida', d: nossaSenhora.format('DD/MM/YYYY'), d_: nossaSenhora.format('YYYY-MM-DD') },
        {m: finados, dia: 'Finados', d: finados.format('DD/MM/YYYY'), d_: finados.format('YYYY-MM-DD') },
        {m: proclamaRepublica, dia: 'Proclama\u00E7\u00E3o da Rep\u00FAblica', d: proclamaRepublica.format('DD/MM/YYYY'), d_: proclamaRepublica.format('YYYY-MM-DD') },
        {m: natal, dia: 'Natal', d: natal.format('DD/MM/YYYY'), d_: natal.format('YYYY-MM-DD') }
    ];
}
function getHolidayBetweenDates(date, dateTo, addHolidays = false){
    var dateStart = moment(date,'YYYY-MM-DD');
    var dateEnd = moment(dateTo,'YYYY-MM-DD');
    var datesHoliday = [];

    while (dateEnd > dateStart || dateStart.format('Y') === dateEnd.format('Y')) {
       $.merge(datesHoliday,getHolidaysBr(parseInt(dateStart.format('YYYY'))));
        if (addHolidays) {
            var addHoliday = $.map(addHolidays, function(v){
                if (v.recorrente) {
                    var feriado_data = moment(v.feriado_data+'/'+dateStart.format('YYYY'), 'DD/MM/YYYY');
                    return {m: feriado_data, dia: v.nome_feriado, d: feriado_data.format('DD/MM/YYYY'), d_: feriado_data.format('YYYY-MM-DD')};
                } else if (!v.recorrente && dateStart.format('Y') == moment(v.feriado_data, 'DD/MM/YYYY').format('Y')) {
                    var feriado_data = moment(v.feriado_data, 'DD/MM/YYYY');
                    return {m: feriado_data, dia: v.nome_feriado, d: feriado_data.format('DD/MM/YYYY'), d_: feriado_data.format('YYYY-MM-DD')};
                }
            });
            $.merge(datesHoliday,addHoliday);
        }
       dateStart.add(1,'year');
    }
    return datesHoliday;
}

function noNotifyPro(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.no_notifyPro');
    var data = _parent.data();
    if (_this.is(':checked')) {
        setOptionsPro('noNotify_'+data.notify, true);
    } else {
        removeOptionsPro('noNotify_'+data.notify);
    }
}
function checkPageVisualizacao() {
    waitLoadPro($('#ifrVisualizacao').contents(), '#frmDocumentoCadastro', "label#lblPublico", setNewDocDefault);
    waitLoadPro($('#ifrVisualizacao').contents(), '#frmProcedimentoCadastro', "#divInfraBarraComandosSuperior", setHtmlProtocoloAlterar);
    waitLoadPro($('#ifrVisualizacao').contents(), '#frmAtividadeListar[action*="acao=procedimento_enviar"]', ".infraBarraComandos", getActionsOnSendProcess);
    waitLoadPro($('#ifrVisualizacao').contents(), '#frmProcedimentoHistorico[action*="acao=procedimento_consultar_historico"]', ".infraAreaTabela", initTablePaginacaoHistorico);
    waitLoadPro($('#ifrVisualizacao').contents(), 'form', "select", replaceSelectAllVisualizacao);
    waitLoadPro($('#ifrVisualizacao').contents(), 'form', "#optRestrito", insertActionHipoteseLegal);
    waitLoadPro($('#ifrVisualizacao').contents(), 'form', ".infraImg, .InfraImg", function() { setInfraImg($('#ifrVisualizacao').contents()) });
}
function addUrgentPro(this_) {
    var _this = $(this_);
    var text = _this.closest('.infraAreaDados').find('input[type="text"]');
    if (text.length && text.val().toLowerCase().indexOf('(urgente)') !== -1) {
        text.val(text.val().replace(/\(urgente\)/ig,'').trim() );
    } else if (text.length && typeof text.val() !== 'undefined') {
        text.val(text.val().trim()+' (URGENTE)');
    }
}
function setNewDocDefault() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
        ifrVisualizacao.find('#txtProtocoloDocumentoTextoBase').removeAttr('maxlength'); // remove atributo de largura do campo de modelo de documento

    var form = ifrVisualizacao.find('#frmDocumentoCadastro');
    var now = moment().format('DD/MM/YYYY');
    if (form.length > 0 && ifrVisualizacao.find('#txtNumero').length ) {
        ifrVisualizacao.find('div.urgentePro').remove();
        ifrVisualizacao.find('#txtNumero').css('width','46%').attr('data-oldtext',ifrVisualizacao.find('#txtNumero').val()).after('<div class="urgentePro" onclick="parent.addUrgentPro(this)" onmouseover="return infraTooltipMostrar(\'Adicionar/remover marca de Urg\u00EAncia\');" onmouseout="return infraTooltipOcultar();"></div>');
        formControlerAlterarDocumento(ifrVisualizacao);
    }
    if (form.length > 0 && typeof checkConfigValue !== 'undefined' && checkConfigValue('newdocdefault') ) {
        if (form.attr('action').indexOf('controlador.php?acao=documento_gerar&acao_origem=documento_gerar&arvore=1') !== -1) {
            if (checkConfigValue('newdocnivel')) { ifrVisualizacao.find('#optPublico').trigger('click') }
            if (getConfigValue('newdocname') && ifrVisualizacao.find('#txtNumero').is(':visible')) { ifrVisualizacao.find('#txtNumero').val(getConfigValue('newdocname')) }
            if (getConfigValue('newdocobs')) { ifrVisualizacao.find('#txaObservacoes').val(getConfigValue('newdocobs')) }
            if (checkConfigValue('newdocsigilo')) { 
                var valueNewDocSigilo = getConfigValue('newdocsigilo');
                    valueNewDocSigilo = (valueNewDocSigilo != '' && valueNewDocSigilo.indexOf('|') !== -1) ? valueNewDocSigilo.split('|') : false;
                    if (valueNewDocSigilo) {
                        ifrVisualizacao.find('input[name="rdoNivelAcesso"][value="'+valueNewDocSigilo[1]+'"]').trigger('click');
                        waitLoadPro(ifrVisualizacao, '#selHipoteseLegal', 'option[value="'+valueNewDocSigilo[0]+'"]', function(){
                            ifrVisualizacao.find('#selHipoteseLegal').val(valueNewDocSigilo[0]).trigger('chosen:updated');
                        });
                    }
            }
        } else if (form.attr('action').indexOf('controlador.php?acao=documento_receber&acao_origem=documento_receber&arvore=1') !== -1) {
            // ifrVisualizacao.find('#optNato').trigger('click'); 
            if (checkConfigValue('newdocformat') && getConfigValue('newdocformat').indexOf('digitalizado') !== -1) { 
                ifrVisualizacao.find('#optDigitalizado').trigger('click');
                var tipoConferencia = parseInt(getConfigValue('newdocformat').split('_')[1]);
                ifrVisualizacao.find('#selTipoConferencia').val(tipoConferencia);
            } else { 
                ifrVisualizacao.find('#optNato').trigger('click') 
            }
            if (checkConfigValue('newdocnivel')) { ifrVisualizacao.find('#optPublico').trigger('click') }
            if (checkConfigValue('newdoctoday')) { ifrVisualizacao.find('#txtDataElaboracao').val(now) }
            if (getConfigValue('newdocname') && ifrVisualizacao.find('#txtNumero').is(':visible')) { ifrVisualizacao.find('#txtNumero').val(getConfigValue('newdocname')) }
            if (getConfigValue('newdocobs')) { ifrVisualizacao.find('#txaObservacoes').val(getConfigValue('newdocobs')) }
            if (checkConfigValue('newdocsigilo')) { 
                var valueNewDocSigilo = getConfigValue('newdocsigilo');
                    valueNewDocSigilo = (valueNewDocSigilo != '' && valueNewDocSigilo.indexOf('|') !== -1) ? valueNewDocSigilo.split('|') : false;
                    if (valueNewDocSigilo) {
                        ifrVisualizacao.find('input[name="rdoNivelAcesso"][value="'+valueNewDocSigilo[1]+'"]').trigger('click');
                        waitLoadPro(ifrVisualizacao, '#selHipoteseLegal', 'option[value="'+valueNewDocSigilo[0]+'"]', function(){
                            ifrVisualizacao.find('#selHipoteseLegal').val(valueNewDocSigilo[0]).trigger('chosen:updated');
                        });
                    }
            }
        }
    }
}
function formControlerAlterarDocumento(ifrVisualizacao) {
    ifrVisualizacao.find('button[name="btnSalvar"]').unbind().removeAttr('onclick').on('click', function() {
        var _this = $(this);
        var contentW = $('#ifrVisualizacao')[0].contentWindow;
        var _parent = _this.closest('body');
        var oldText = _parent.find('#txtNumero').attr('data-oldtext');
        var newText = _parent.find('#txtNumero').val();
        var checkAddUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') === -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') !== -1 ) ? true : false;
        var checkRemoveUrgencia = (typeof oldText !== 'undefined' && oldText.toLowerCase().indexOf('(urgente)') !== -1 && typeof newText !== 'undefined' && newText.toLowerCase().indexOf('(urgente)') === -1 ) ? true : false;
        var methodSend = checkAddUrgencia ? 'add' : false;
            methodSend = checkRemoveUrgencia ? 'remove' : methodSend;
        var checkSend = (checkAddUrgencia || checkRemoveUrgencia) ? true : false;
        var nrSEI = $('#ifrArvore').contents().find('.infraArvoreNoSelecionado').eq(0);
            nrSEI = (typeof nrSEI !== 'undefined' && nrSEI !== null) ? getNrSei(nrSEI.text().trim()) : '';

        if (contentW.OnSubmitForm()) { 
            contentW.submeter();
            var sendAutomaticActions = [];
            sendAutomaticActions[0] = {name: 'urgencia_documento', method: methodSend, send: checkSend, value: nrSEI, run: false, index: 0};
            parent.window.sendAutomaticActions = sendAutomaticActions;
            getAutomaticActions();
        }
    });
}
function insertIconBatchActions() {
    waitLoadPro($('#ifrVisualizacao').contents(), '#divArvoreAcoes', "a.botaoSEI", appendIconBatchActions);
}
function appendIconBatchActions(loop = true) {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var base64IconDynamicField = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkM1NkJDN0U4QzVFMTFFQ0I3RDVDMzJGODUxRkVDMjIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkM1NkJDN0Q4QzVFMTFFQ0I3RDVDMzJGODUxRkVDMjIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIwMjAgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjRBN0U0QzkwQUYxMTc5OTFEMUYyMDNCNDExOTFGRTQwIiBzdFJlZjpkb2N1bWVudElEPSI0QTdFNEM5MEFGMTE3OTkxRDFGMjAzQjQxMTkxRkU0MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjYH0WAAAApDSURBVHjazFl7jFRXHf7Ofcx7Z2efsMDugrwX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';
    var htmlIconbatchActions =  '<a href="#" id="iconBatchActions" onclick="parent.getDocumentosActions();" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Iniciar a\u00E7\u00F5es em lote\')"  tabindex="452" class="botaoSEI">'+
                                '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconDynamicField+'" alt="Iniciar a\u00E7\u00F5es em lote" title="Iniciar a\u00E7\u00F5es em lote">'+
                                '</a>';
    if (ifrVisualizacao.find('#iconBatchActions').length == 0) {
        ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconbatchActions);
    }
    if (loop) {
        setTimeout(function () {
            appendIconBatchActions();
        },1500);
    }
}
function insertIconDocCertidao() {
    waitLoadPro($('#ifrVisualizacao').contents(), '#divArvoreAcoes', "a.botaoSEI", appendIconDocCertidao);
}
function appendIconDocCertidao(loop = true) {
    if (checkConfigValue('certidaosigilo')) {
        var _ifrVisualizacao = $('#ifrVisualizacao');
        var ifrVisualizacao = _ifrVisualizacao.contents();
        var ifrArvore = $('#ifrArvore').contents();
        var id_documento = getParamsUrlPro(ifrArvore.find('.infraArvoreNoSelecionado').eq(0).closest('a').attr('href')).id_documento;
            id_documento = (typeof id_documento !== 'undefined') ? id_documento : getParamsUrlPro(_ifrVisualizacao.attr('src')).id_documento;
            id_documento = (typeof id_documento !== 'undefined') ? id_documento : false;

        var newDocLink = jmespath.search(linksArvore, "[?name=='Incluir Documento'] | [0].url");
        var base64IconDocCertidao = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUQ3ODhDOEI5OUQyMTFFQzhDNkZBNEM3ODE5MUQ3RkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUQ3ODhDOEE5OUQyMTFFQzhDNkZBNEM3ODE5MUQ3RkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIwMjAgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9IjVEODg1QzYyOTVGOENCN0Y5QzcxMzg0RUE0NzVCNTVEIiBzdFJlZjpkb2N1bWVudElEPSI1RDg4NUM2Mjk1RjhDQjdGOUM3MTM4NEVBNDc1QjU1RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr+rRM0AAAs8SURBVHjatFh7cFTVHf7OvXd37z6S7CaY94uHiYRARCt2BIuKrdTqTLUWxz6oOjq1jlalHerYh9ZxRs1Ua6ctRfCFf0hpqdjpUChUnTIqihIMBTSUBELAYJLdTbLv++zvnN1sdrNJCEx7Zs7evXfPnvOd3+P7fecy27Yx1swDf2V0yT4IQk7f0BjDVwrDG4CkJ2BLingGSNQtTNcsy4YsM9RVNqXHW/pkowC1BIc69oDJcvbpgralYoXclgU3MAZuvC2i3mEzR4oWitJMI2As0+WpeoT+E6cNJen6gyl3YU+9QWWy0TJZh9ksfZuxqeX0dgoLMPHcOT5emtaC2bWdnnXQErQ5vIRzaAUAJQLXU9FCIK3xJWw08g9maGMAz6mxsbmc7heRjJAP2cZpzTYdQEYAZYozyc6bwLBl5bzAFTSXdwNScb7TTTMBKU203olZ8yaAYwI2bPu8Mdk2y5/P5X2FLnek5z4HgNwVWXfkRhGbamG7oJ/d3yzdnR4ei98/G8g8F/eWzZno2vFIZ7nUYcHhUOB2u8V3PkCSGEzTQiql5YDHNDQkLLkeqSgZyf7DjF08kybL9DdJgmEY6QAABzfGeTIZiCFLAvy7bU5tSbVoHQ24fUYA39p9CD2d3ahUJMRCySrG/M+EB+JvD/b235Hr1rq6euzb+xFqq1tw5Zeux7LlX0NLy+X4xk3fQ/fR49j/QQdCAyF4PCrtwwFd15CIhqfesSfwMn3eYZ3NxbpuCrdYkvJoStMeCx89ZGuQYkUu5apw7xmoFWVQVQc0LYGS4mJcveJLqKmuFIYYHhlBZVUVPF43UkYRFKcC3TTFhmSqPGcGe6AOB5AybXg9HvEfK4OIhwf55SVFkUcZk/4ygVXG3br11VdRV1+zutijbErFoj8/FTOe+LA/hruubamJDoRPmZoOd9UFIqkDgWKUltbwApnpXuEQTRsUrtNpLLccLQhFURCPRzEcGUbvsV709w/A63MXxLnH6d4Gid089mjlDbflW7CqeS4u8KqbTvSe2qwx5YkkAog6SsRv3soyDB7vhx4cRVlVKaLRBGKJbjCLQXHIBCxF3YBCfMk4t2dikF8N8ozL5USgqBTll1fh+PET6D1+kkLALWI2G2+WdcKezsVxU3WPDIephGJTDLNwkfQuFjs76Jcfp7OX3OsyDcpeFwYHQzhy+BM4nS7Mm9uIZ579HV56eTPqa6sL6KbvdD+efvJRrFy5AqdOnSaXy2JTvGmaRuBdgg0mI7Q8gH2DMUdRkY2QUhe60HgTreZayjJ6ngEoqaWIxUcFnfCdB/x+4T6JrLagdQFuvPE6VFaW5wG0yN1Dnw+hobEWLocDXq+Psl/H7IbZAtihjzuRpPGqSguZ5vRJ0qx0MUNeiGZ9j69VJ3DSHBWsFr7RY66IvwleMwjN1AXX+XwetC1uTScV7f6ee27HmjX35VEKB8pphjEXEokR6nFU1FRQUlCs0hwcfOvFi3D430cQiyVR5HEWFKw8gEvZK68gSqa3Tv4drNkE8xKJaQh0/Z4FpAQBJg8kLQyNrkCy7VsiS3m8cedEIlGMxkiFWfmRz/Wd2+UWmep0qhnATHBobDRKyeLB4kvbcOjgEYxGYuK33MqQLxZYUTXMbvpSosJy0K+0mocAjxoQ94xfNZQ6dHTRZF2f/geqyzmppqM6Qlb2CuBrH/4lWS9F7vUI8XrkyFGsXr0KGzf+Fr296WSZv2g+eug5myBI8gHaXAkVpReTeCpStQhrUFSiEC61wEFaMGkcj8FSikHJIU8pcniMcQsuW/ZFERpuSigOoLGxHs0tzUgmE+I+Hk+IsRfNv5Cynp1NsGasUe3Flo1deGzDAF77RTMWX1lHbJzK1mIvEfKCxS2wLbtArvFFJYUUOY2TKYnWL1ufKVpjxwSZXDxE1uujmu4Q4zXiTQZzJoo64/64gdk1bnxhHsNFdcV0rxcoGT2ZzEgpO/MsMymB8pC1JCqZfFw0Opg3uZZKIBpLCHB5QTGJFlCmrI8EqKrei6o5xXA3BYhr6HjhUjJiQUYkGsOxo90Ug66czLNRXFyEgcEhPP54OxyyQxC0ldkAz95j3Sfw3e98E/fdf5fYSCqln5uiznXzLAfDyjYCFybXKvlnD4lKGAfndDpyrApxr7pUVFReQPEnEfc5s4KVZ3KCrM7ruETVYCb6cUKS5ASoZsJdpuKa68qAM2beSIPY3+/3oWH5FYK0xxUUE1zXOKcR27dvHT9xZVOciRhMJmMIh0NIpkwCeg6CFY7U69AQopWGxFyc2WMa12we+NtuFjyYGETYvxA2AQuHh6lsSWkXM2TFK9eFp/s/yyTNRBlIPGglUTa8n46GQaTUagQd82HAJX6vL4mRBWI4GSufpNRd2P40XZ6eJGtqbEm6GUJ82mhoaMAb2/6GVavuRHPT3LRVLQNDQ2G0P/UYFi6cj4GBQSFkJza3ZGKR8j6B+xDwFcNlF6EaYZyRL4XGvJhYjvMAkg4k+jNxtgMSr6UekvutC5sJbL2Q9dx45eUjKC7xwUHB73KrBafAYrcDl408xBciT5NKcnmA4BAJ0RdQ6d+ChP/euVTBaH1zcj1o7WhHX8tXSfYYEzHV2pLcN7agSa7nPOgnoh47e/Cf+PdILAZTNwoqAm8Vh++l2CbXu6q4BgMCFN/8+DDQlwbrJwtW3D0Pvpbuk6EE6hsuzpf8FqkSAoJJVI+daw1OF1wwBINBcmuQriG6hhAKhZEgfuOky2VUbg+E9lL8HiQgteQ3ynw3gTm0gwBSqWxZQjU+DoSO0LX7QTj9U7y3IOqoP/EBeYC/l2GZLgl0uZZOH4TSRwSexdyivBuGmUc5ud2ZOk6m94kEQLAX6NoNRCkBP/oTcOBfVP5JqccIuN5zNQZ2NI4ZRJlYQvhkDQ1zspSQsa1zKHwGocGgqJnn1bjM0ZO0osYPSUB/hp4itGBjgJcf2glZ0wh5Sba7y2oqpyBqjvzwHtzyk2cpEVRBqJah9bW/uB5NTZfgszNHaS7HuQOMUbwxkmz8xYC/IlOVyOIaASylezoyiBiUyrvhCJzcu2UTrl29Nj9JjN2/AXP7IfMJmI7tz7dDoVLFXyS91q2++Pzrf/62lky4UnqigN/O1txaP9SOGwgoze3xprm7nA5dWkKcsaFSvbe66GB050OoXPXcNWUVeCto51uQ1LBIRoMAKbqOGNVJlYLY5XTi0zd3vjDXV2JccUlrRNdJpJ/Hu5pf//SmlQ3l21oxQEnAE4EkGEpmASQe4KXsTi5+G+atz6Gf4a29uwpdLC/4MrO694lXRRTxWHXfI9i67ilysxsP3/2VfeveeM/V/clBUlDMoEQ5Z4TFu74+B7WNrbieOFIj/vORWwMxnm3AO0QzB2f34yoCGumH2RiHXMCDJzs4P0l2ZNBmyahtE0fJJJu2bfgVnR+c2LB9H8KkpAngpDw3VXu3l5Kjp7scd//wcxjkyjaKvdY4j8EgysrK0EVn5A6K6+hp4MlHlmPJ0j3Gh1uhXHbLBJoRnGBZTC3i6SwRdzAzlcJN96ylr/pM3pZN3vZ/BGze/DOYZK06mqSHHPcyrzR33YYtgc/RSTDKCXQxgdz5z3vx8YGscpEmU6tkVkuqbhqLS17bhHI+79eXBw4sx86d94NLMyJxKAS0XtqORdW7Mb/kH2Bhii+FazXg/b238s3IRbMKS93/rf1xSxs6P76camMce/a0k5KowgMPXIcVK3aRPqvBj9acIoKNYMmSNVTUGcVQJx58aN/0gvV/2WSpEwsXdYILiHnz9uO99x7H0qW7CCglSeA0li9/He++8wKd/ncgOkpUFM/+9b8CDABPKOOfpzxXBAAAAABJRU5ErkJggg==';
        var htmlIconNewDoc =    '<a href="#" onclick="parent.getDocCertidao();" id="iconDocCertidao" class="botaoSEI">'+
                                '   <img class="infraCorBarraSistema" src="'+base64IconDocCertidao+'" alt="Gerar Certid\u00E3o de Documento Oficial com Sigilo" title="Gerar Certid\u00E3o de Documento Oficial com Sigilo">'+
                                '</a>';
        var nativo = (id_documento && ifrArvore.find('#anchorImg'+id_documento+' img[src*="sei_documento_interno.gif"]').length) ? true : false;
        var assinado = (id_documento && ifrArvore.find('#iconA'+id_documento).length) ? true : false;
        if (newDocLink !== null && newDocLink != '' && ifrVisualizacao.find('#iconDocCertidao').length == 0 && nativo && assinado) {
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconNewDoc);
        }

        if (loop) {
            setTimeout(function () {
                appendIconDocCertidao(false);
            },1500);
        }
    }
}
function insertTooltipOnButtons() {
    waitLoadPro($('#ifrVisualizacao').contents(), '#divArvoreAcoes', "a.botaoSEI", appendTooltipOnButtons);
}
function appendTooltipOnButtons() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    ifrVisualizacao.find('#divArvoreAcoes a img[title]').each(function(){
        var _this = $(this);
        var title = _this.attr('title');
        var link = _this.closest('a');
        if (typeof title !== 'undefined' && typeof link !== 'undefined') {
            _this.removeAttr('title');
            link.attr('onmouseover','return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()');
            
        }
    });
}
function insertIconNewDoc() {
    waitLoadPro($('#ifrVisualizacao').contents(), '#divArvoreAcoes', "a.botaoSEI", appendIconNewDoc);
}
function appendIconNewDoc(loop = true) {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var newDocLink = jmespath.search(linksArvore, "[?name=='Incluir Documento'] | [0].url");
    var htmlIconNewDoc =    '<a href="'+newDocLink+'" tabindex="451" class="botaoSEI">'+
                            '   <img class="infraCorBarraSistema" src="imagens/sei_incluir_documento.gif" alt="Incluir Documento" title="Incluir Documento">'+
                            '</a>';
    if (newDocLink !== null && newDocLink != '' && ifrVisualizacao.find('a.botaoSEI[href*="acao=documento_escolher_tipo"]').length == 0) {
        ifrVisualizacao.find('#divArvoreAcoes').prepend(htmlIconNewDoc);
    }
    if (loop) {
        setTimeout(function () {
            appendIconNewDoc();
        },1500);
    }
}
function insertIconDynamicField() {
    // waitLoadPro($('#ifrVisualizacao').contents(), '#divArvoreAcoes', 'a[onclick*="alterarFormulario"]', appendIconDynamicField);
    waitLoadPro($('#ifrArvore').contents(), '#divArvore', 'img[src*="formulario1.gif"]', appendIconDynamicField);
}
function appendIconDynamicField(loop = true) {
    var ifrArvore = $('#ifrArvore').contents();
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    if (ifrVisualizacao.find('#iconDynamicField').length == 0 && ifrArvore.find('span.infraArvoreNoSelecionado').closest('a').prev().find('img[src*="formulario1.gif"]').length > 0 ) {
        var base64IconDynamicField = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTcwNzVBRjk4MkE3MTFFQ0EwQzJFQkVGNzNCNzNCQzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTcwNzVBRkE4MkE3MTFFQ0EwQzJFQkVGNzNCNzNCQzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ODVFRkVBMjgyOTExMUVDQTBDMkVCRUY3M0I3M0JDNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NzA3NUFGODgyQTcxMUVDQTBDMkVCRUY3M0I3M0JDNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjLf6nQAAAXeSURBVHja7FhbaFxFGP7nnJNN01yaS3OtlSCtRhEEL4giQiOkNohCESnRRi0xQiH0QXyytAg+iKLgS7CoVGMJwYdqqUXagkUqbUUJ1aY2SW9W64O0TUxN0yS7Z8bvn5nds5ezm90lQsFMmMw5c/7zzzf/5fvnrFBK0a3cHLrF2xLAJYBLABdoXrYHrV+cVJfOXiOSybMCPZ2WhB2VeSRyrBZ/VSS9AxOtWbuSzj53nygI4KXRa/TWMw+SLw0IVyi9ON97joBqZeHFr0UCpBDpzwN0wb3RxXq37/+pcAvyLmuXubT16z+NVBRqPZG0e7SYndMj31MgW+KkzVs511owKvXY/9SqTKfkBdBXVB/B45URuMFNdWHClUkuV5keD9wt0gTstZTUyGsUBRCtKgJwleUAqBaIw1AXUOqO0kDb2K7gNYpJElKCOppnSXUut8EsjFIGK0XAAfG5VNNmyY404Pxu5GagrzALGkXDp8bIARAfaARcouLujkvpOUfLBIhTW83sMLWe7gke3Q0N2LeYNcuo9RiPJZROo1fm5WLemfAAzPG0IANhQOmbEAA9cuqkCV3fz1DzqLMv2BP2p5bhTT8rJb2fpwWVdp3D4DzTfZjAtdzO14zVlTFcCaqpa6IN69vDVe3uNmDm0ZstwOuhAHej78wzBo0FS2FBF5nW19dH69Y9AXaIpbh348ZnATZG1dXl4Xp+32toRljrNWDfN0PB/Y2+pSAe5ETxoZWt9vGuj7SLpZS689w8bOfPz5Mbc2hFdW24np/fMGMUvc7GXrj1agqsxVwSJFwLKADW8+orNDQ0RIODg8ThMzC0B/eD+hkDr6uuzlRxfZzor9Egd1rCrSdO9BfHg3FNDKh/1y69H7Yeu3bTpi6zjVhMg2yoCzHAeL8JFbYeIiCGPXhTaQAbthJN3VUkQMkWNKBUTBMedEsNOEEZsE4J/o2fv4iM9xIsDOPT2pEPAvfeiRCcSwUn8a6z+m1c/VjMcUsYcuYrz9GiynKdqzvZ7uhNRFARkufqpw6YrGULlmGAgUU0CRwEL9afg7Cb8wiUm2bYXrw478MxAA0NSg3Et8El8OzY0aMpPPi8v82g5Zi7nfS7ydw3B2u2TG0mGjlHZx67wlO/JvsOfQX6bQtWkjLsgZPA81JFYziZeOBJaYk7hQdvXCIaTPJRPYY095axutnj+rqtPF5fMlpvXjGoQNa9vT3U0dEBYIYHu7peoIGBTzFu1rZM4cHh7QYMl7KVUAMXO7M5SnN4490eyUHUxsXsPhcgP/t8CBbz4UKFpJA0B8Nt2dIDwPPEmBM8eOMC0Zk9ZmHujQAXs1TArQS9NBGskGd/ZwDl6nxkAaK2HrI89/KLXdTe3k7d3S/RJwMDCTGmGyG8gAd/26cphcoeAhCfVNM0MpoPsFDolZGKVJG4PAJqmTSgS80mKEigTvRDCRjZfvoQO75VasfDdGVyBmGEPx2DkuJnBcfmv0QszskoNdfVJdHMAu3NR4gmzqO4oaxsQLy2YW4mYblDeZY6Xl3ZlJKcFXpksPpeGoQx1GsXaq5OTiaeJY9xGQ48x5G0/J8xKm85ocsex6dCaoibWqwD/XCBPOgg20wW+w6ljGSvDQfmL1M+ts0kCZvmDhPqlT/oE9bhAj+a9OcbVZSVUEUIP6aUXKeCauR0fjKXhw03roYT+HOn9QBNf1VaBFE3uSR2Hs/+/aExcEpGbADlkPNwAPTn6J2G3fR6vLLgY672+/do6kvctGR3ZNYkGT19Wl2ZmNC8xzJChBPWzKykqorIgnLc1l1oNwf6NTiFrXiXJqIP6AJQX1tLbVP3ioIAFt0+xDpNlqST2zJ6nP6g7/hrQ91PnWKOvtEFTVLxn51FtSa7aCQtFScAiIGsoieRtQfz/VVo8QH6oWemRrh2OcA9japxcFF+PCq6uSFEdpV+AbjX4Pb9nCBsXT5usaX5hCNyuHjxY3BvRqw3AuQ98dqqLRzNU9f8fwHw//YD5r8CDAC8bShVAQ+VhAAAAABJRU5ErkJggg==';
        var htmlIconDynamicField =  '<a href="#" id="iconDynamicField" onclick="parent.openCamposDinamicosForm();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconDynamicField+'" alt="Adicionar campos din\u00E2micos do formul\u00E1rio" title="Adicionar campos din\u00E2micos do formul\u00E1rio">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconDynamicField);
    }
    if (loop) {
        setTimeout(function () {
            appendIconDynamicField();
        },1500);
    }
}
function insertIconFormSheet() {
    waitLoadPro($('#ifrArvore').contents(), '#divArvore', 'img[src*="formulario1.gif"]', appendIconFormSheet);
}
function appendIconFormSheet(loop = true) {
    var ifrArvore = $('#ifrArvore').contents();
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    if (ifrVisualizacao.find('#iconFormSheet').length == 0 && ifrArvore.find('span.infraArvoreNoSelecionado').closest('a').prev().find('img[src*="formulario1.gif"]').length > 0 ) {
        var base64IconFormSheet = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkNDkxZTA3Ni04ZjNkLTQ0MzctOTAxMS02MDAwOTNlYTQ0OGEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUY1NEE2MzM4N0QwMTFFQzkxMzY4RjBERUI1MTJBOEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUY1NEE2MzI4N0QwMTFFQzkxMzY4RjBERUI1MTJBOEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpiMjRmYmE0Mi1iN2UyLTQ0NmEtYWMzMS04MjAzNjhiNTg3YzkiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiNDkyMWRjZi1kZDNhLTI4NGYtOWEyMC1h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';
        var htmlIconFormSheet =  '<a href="#" id="iconFormSheet" onclick="parent.openFormSheet();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconFormSheet+'" alt="Salvar dados na planilha" title="Salvar dados na planilha">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconFormSheet);
    }
    if (loop) {
        setTimeout(function () {
            appendIconFormSheet();
        },1500);
    }
}
function insertIconIntegrity() {
    waitLoadPro($('#ifrVisualizacao').contents(), divInformacao, "a.ancoraArvoreDownload", appendIconIntegrity);
}
function appendIconIntegrity(loop = true) {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var linkAnexo = ifrVisualizacao.find(divInformacao).find('a').eq(0).attr('href');
    if (ifrVisualizacao.find('#iconIntegrityPro').length == 0 ) {
        var base64IconIntegrity = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDgxQ0NGRjUyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDgxQ0NGRjYyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODFDQ0ZGMzI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowODFDQ0ZGNDI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm2LucYAAAbsSURBVHja7FhZ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';
        var htmlIconIntegrity =  '<a href="#" id="iconIntegrityPro" onclick="parent.getChecksumPro();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base64IconIntegrity+'" alt="Visualizar C\u00F3digo de Integridade (Hashcode)" title="Visualizar C\u00F3digo de Integridade (Hashcode)">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconIntegrity);
    }
    if (loop) {
        setTimeout(function () {
            appendIconIntegrity();
        },1500);
    }
}
function setReplaceSelectAllVisualizacao() {
    if (verifyConfigValue('substituiselecao')) {
        var target = $('#ifrVisualizacao').contents();
        if (typeof $().chosen !== 'undefined') {
            target.find('select').chosen('destroy');
            target.find('select').not('[multiple]').not('[size]').filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') 
                }).chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado'
                });
            chosenReparePosition(target);
            target.find('.infraAreaDados').css('overflow','initial');
            target.find('select').not('[multiple]').eq(0).trigger('chosen:activate');
        }
    }
}
function replaceSelectAllVisualizacao(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') {
        setReplaceSelectAllVisualizacao();
    } else {
        if (typeof $().chosen === 'undefined' && typeof URL_SPRO !== 'undefined') { 
            $.getScript(URL_SPRO+"js/lib/chosen.jquery.min.js");
            console.log('@load chosen');
        }
        setTimeout(function(){ 
            replaceSelectAllVisualizacao(TimeOut - 100); 
            console.log('Reload replaceSelectAllVisualizacao'); 
        }, 500);
    }
}
function insertActionHipoteseLegal() {
    var target = $('#ifrVisualizacao').contents();
        target.find('input[name="rdoNivelAcesso"], input[name="rdoTextoInicial"]').on('change',function(){
            parent.replaceSelectAllVisualizacao();
            if ($(this).attr('id') == 'optPublico') {
                target.find('#selHipoteseLegal').chosen('destroy').hide();
            }
            setTimeout(function(){ 
                parent.replaceSelectAllVisualizacao();
            }, 1000);
        });
        target.find('#selHipoteseLegal').on('change',function(){
            target.find('#newdocsigilo').remove();
            if ($(this).val() != 'null') {
                target.find('#lblHipoteseLegal').append('<span id="newdocsigilo" style="float: right;font-size: 0.8em;"><a onclick="parent.setNewDocSigilo(this)">Definir como padr\u00E3o para novos documentos</a></span>');
            }
        });
        target.find('#fldNivelAcesso').css('height','110%');
        target.find('#divInfraBarraComandosInferior').css('margin-top','20px');
}
function setNewDocSigilo(this_) {
    var _this = $(this_);
    var _parent = _this.closest('form');
    var selectHipoteseLegal = _parent.find('#selHipoteseLegal');
    var valueNivelAcesso = _parent.find('input[name="rdoNivelAcesso"]:checked');
    var valueNewDocSigilo = (selectHipoteseLegal.length) ? selectHipoteseLegal.val()+'|'+valueNivelAcesso.val()+'|'+selectHipoteseLegal.find('option:selected').text() : '';

    var urlConfigSigilo = url_host.replace('controlador.php','')+'?#&acao_pro=set_option&option_key=newdocsigilo&option_value='+encodeURIComponent(valueNewDocSigilo);
    var urlConfigPublico = url_host.replace('controlador.php','')+'?#&acao_pro=set_option&option_key=newdocnivel&option_value=false';
    if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
    $('#frmCheckerProcessoPro').attr('src', urlConfigSigilo).unbind().on('load', function(){
        setTimeout(function(){ 
            $('#frmCheckerProcessoPro').remove();
            if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
            $('#frmCheckerProcessoPro').attr('src', urlConfigPublico).unbind().on('load', function(){
                alertaBoxPro('Sucess', 'check-circle', 'Padr\u00E3o de sigilo definido com sucesso!');
                $('#frmCheckerProcessoPro').remove();
            });
        }, 500);
    });
}
function openStyleBoxSlimPro() {
    if (localStorage.getItem('seiSlim')) {
        sessionStorageRemovePro('seiSlim_openBox');
        var oldColorPage = getOptionsPro('oldColorPage');
        var colorSlim = (getOptionsPro('colorSlimPro')) 
                        ? getOptionsPro('colorSlimPro') 
                        : (oldColorPage) ? oldColorPage : '#0494c7';

            if (!getOptionsPro('colorSlimPro') && oldColorPage) {
                setColorSlimPro(oldColorPage);
            }

        var htmlBox =   '<table style="font-size: 10pt;width: 100%;" class="seiProForm tableInfo">'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="colorPalette"><i class="iconPopup iconSwitch fas fa-palette azulColor"></i>Cor personalizada:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '               <input type="color" id="colorPalette" value="'+colorSlim+'" onchange="_setColorSlimPro(this)">'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="iconLabel"><i class="iconPopup iconSwitch fas fa-text-width azulColor"></i>\u00CDcones com legenda:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="setIconLabel(this)" name="onoffswitch" class="onoffswitch-checkbox" id="iconLabel" '+(localStorage.getItem('iconLabel') ? 'checked' : '')+'>'+
                        '                  <label class="onoffswitch-label" for="iconLabel"></label>'+
                        '              </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="darkModePro"><i class="iconPopup iconSwitch fas fa-moon azulColor"></i>Modo noturno:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="setDarkModePro(this)" name="onoffswitch" class="onoffswitch-checkbox" id="darkModePro" '+(localStorage.getItem('darkModePro') ? 'checked' : '')+'>'+
                        '                  <label class="onoffswitch-label" for="darkModePro"></label>'+
                        '              </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                        '               <label for="seiBtnRight"><i class="iconPopup iconSwitch fas fa-grip-vertical azulColor"></i>Barra de Bot\u00F5es na Vertical:</label>'+
                        '           </td>'+
                        '           <td style="text-align: right;">'+
                        '              <div class="onoffswitch" style="float: right;">'+
                        '                  <input type="checkbox" onchange="setBtnRight(this)" name="onoffswitch" class="onoffswitch-checkbox" id="seiBtnRight" '+(localStorage.getItem('seiBtnRight') ? 'checked' : '')+'>'+
                        '                  <label class="onoffswitch-label" for="seiBtnRight"></label>'+
                        '              </div>'+
                        '           </td>'+
                        '      </tr>'+
                        '</table>'+ 
                        '</div>';

        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
            .dialog({
                title: "Cor Principal do Layout",
                width: 300
            });
    } else {
        $('#changeSlimPro').trigger('click');
    }
}
function changeSlimPro(this_) {
    if ($(this_).is(':checked')) {
        localStorageStorePro('seiSlim', true);
        sessionStorageStorePro('seiSlim_openBox', true);
        setOptionsPro('oldColorPage',rgbToHexString($('.infraAreaGlobal').css('border-left-color')));
    } else {
        localStorageRemovePro('seiSlim');
        sessionStorageRemovePro('seiSlim_openBox');
        removeOptionsPro('oldColorPage');
        removeOptionsPro('colorSlimPro');
        localStorage.removeItem('iconLabel');
        localStorage.removeItem('darkModePro');
        localStorage.removeItem('seiBtnRight');
    }
    window.location.reload();
}
function _setColorSlimPro(this_) {
    var _this = $(this_)
    var backgroundColor = _this.val();
    setColorSlimPro(backgroundColor);
}
function setColorSlimPro(backgroundColor) {
    var color = (getBrightnessColor(backgroundColor) > 125) ? '#515151' : '#ffffff';
    $('head').find('style[data-style="seipro-colorpage"]').remove();
    $('head').prepend(  "<style type='text/css' data-style='seipro-colorpage'> "
                        +"  .seiSlim .infraAcaoBarraSistema a.iconBoxSlim i.fas {\n"
                        +"      background: -webkit-gradient(linear, left top, left bottom, from("+color+"), to("+color+"));\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"  .seiSlim.dark-mode .panelHome .iconBoxSlim:hover .newIconTitle, \n"
                        +"  .seiSlim #divInfraAreaTelaE #main-menu li a:hover:before { \n"
                        +"      color: "+color+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim #divInfraAreaTelaE #main-menu li a:before { \n"
                        +"      color: "+backgroundColor+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSistema { \n"
                        +"      box-shadow: "+addAlpha(color,0.5)+" 0px -5px 6px -3px inset;\n"
                        +"  }\n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSistema, \n"
                        +"  .seiSlim.seiSlim_parent div#divInfraBarraSuperior,\n"
                        +"  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover, \n"
                        +"  .seiSlim.dark-mode .infraAreaDados a.ancoraPadraoPreta:hover, \n"
                        +"  .seiSlim.dark-mode a.newLink:hover, \n"
                        +"  .seiSlim.dark-mode .panelHome .iconBoxSlim:hover, \n"
                        +"  .seiSlim.dark-mode .iconBoxSlim.botaoSEI:hover, \n"
                        +"  .seiSlim .iconBoxSlim.botaoSEI:hover {\n"
                        +"      background: "+backgroundColor+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim.dark-mode #divInfraAreaTelaE #main-menu li a:hover,\n"
                        +"  .seiSlim #divComandos a.botaoSEI:hover,\n"
                        +"  .seiSlim #divInfraAreaTelaE #main-menu li a:hover {\n"
                        +"      background: "+backgroundColor+" !important;\n"
                        +"      color: "+color+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim .infraAcaoBarraSistema a::before,\n"
                        +"  .seiSlim #divComandos a.botaoSEI:hover:before,\n"
                        +"  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover,\n"
                        +"  .seiSlim .infraAreaDados a.ancoraPadraoPreta:hover:before,\n"
                        +"  div#divInfraBarraSistemaE.barSuspenso::before {\n"
                        +"      color: "+color+" !important;\n"
                        +"      border-color: "+backgroundColor+" !important;\n"
                        +"  }\n"
                        +"  .seiSlim .iconBoxSlim:not(.newLink) .fas {\n"
                        +"      color: "+backgroundColor+" !important;\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"  .seiSlim .iconBoxSlim.botaoSEI:hover i.fas, \n"
                        +"  .seiSlim #divInfraAreaTelaE #main-menu li a:hover i.fas, \n"
                        +"  .seiSlim.dark-mode #divInfraAreaTelaE #main-menu li a:hover i.fas, \n"
                        +"  .seiSlim.dark-mode .iconBoxSlim.botaoSEI:hover .newIconTitle, \n"
                        +"  .seiSlim .iconBoxSlim.botaoSEI:hover .newIconTitle {\n"
                        +"      color: "+color+" !important;\n"
                        +"      background: -webkit-gradient(linear, left top, left bottom, from("+color+"), to("+color+"));\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"  .seiSlim #divInfraAreaTelaE #main-menu li a i.fas {\n"
                        +"      background: -webkit-gradient(linear, left top, left bottom, from("+backgroundColor+"), to("+backgroundColor+"));\n"
                        +"      -webkit-background-clip: text;\n"
                        +"  }\n"
                        +"</style>");
    if (getBrightnessColor(backgroundColor) > 125) {
        $('#divInfraBarraSistemaE').addClass('dark');
    } else {
        $('#divInfraBarraSistemaE').removeClass('dark');
    }
    setOptionsPro('colorSlimPro',backgroundColor);
}
function setIconLabel(this_) {
    if ($(this_).is(':checked')) {
        localStorage.setItem('iconLabel',true);
    } else {
        localStorage.removeItem('iconLabel');
    }
    window.location.reload();
}
function setBtnRight(this_) {
    if ($(this_).is(':checked')) {
        localStorage.setItem('seiBtnRight',true);
    } else {
        localStorage.removeItem('seiBtnRight');
    }
    window.location.reload();
}
function initToolbarOnTop() {
    var toolbar = $('#divComandos');
    if (toolbar.length) {
        var topElement = toolbar.offset().top;
        $(window).scroll(function(){
            if ($(this).scrollTop() > topElement) {
                delayCrash = true;
                setTimeout(function(){ delayCrash = false }, 300);
                $('#divComandos').addClass('fixed');
            } else {
                if (!delayCrash || $(this).scrollTop() == 0) $('#divComandos').removeClass('fixed');
            }
        });
    }
}
function setDarkModePro(this_) {
    var _ifrVisualizacao = $('#ifrVisualizacao');
    var _ifrArvore = $('#ifrArvore');
    var _ifrArvoreHtml = _ifrVisualizacao.contents().find('#ifrArvoreHtml');

    if ($(this_).is(':checked')) {
        $('body').addClass('dark-mode');
        localStorage.setItem('darkModePro',true);
        if (_ifrVisualizacao.length > 0) _ifrVisualizacao.contents().find('body').addClass('dark-mode');
        if (_ifrArvore.length > 0) _ifrArvore.contents().find('body').addClass('dark-mode');
        if (_ifrArvoreHtml.length > 0) _ifrArvoreHtml.contents().find('body').addClass('dark-mode');
    } else {
        $('body').removeClass('dark-mode');
        localStorage.removeItem('darkModePro');
        
        if (_ifrVisualizacao.length > 0) _ifrVisualizacao.contents().find('body').removeClass('dark-mode');
        if (_ifrArvore.length > 0) _ifrArvore.contents().find('body').removeClass('dark-mode');
        if (_ifrArvoreHtml.length > 0) _ifrArvoreHtml.contents().find('body').removeClass('dark-mode');
    }
}
function insertNewIcons() {
    if (localStorage.getItem('seiSlim')) {
        waitLoadPro($('#ifrVisualizacao').contents(), '#divArvoreAcoes', "a.botaoSEI", appendNewIcons);
    }
}
function appendStyleNewIcons(ifrVisualizacao, backgroundColor) {
    if (ifrVisualizacao.find('style[data-style="seipro-styleicon"]').length == 0) {
        var color = (backgroundColor && getBrightnessColor(backgroundColor) > 125) ? '#515151' : '#ffffff';
        ifrVisualizacao.find('head').prepend("<style type='text/css' data-style='seipro-styleicon'>"
                        +"   body.seiSlim .iconBoxSlim.botaoSEI:hover {\n"
                        +"      background: "+backgroundColor+" !important;\n"
                        +"   }\n"
                        +"   .seiSlim .iconBoxSlim.botaoSEI:hover .newIconTitle, \n"
                        +"   .seiSlim .iconBoxSlim.botaoSEI:hover::before {\n"
                        +"      color: "+color+" !important;\n"
                        +"   }\n"
                        +"</style>");
        ifrVisualizacao.find('body').addClass('seiSlim').addClass('seiSlim_view');
        if (localStorage.getItem('darkModePro')) {
            ifrVisualizacao.find('body').addClass('dark-mode');
        }
        if (localStorage.getItem('seiBtnRight')) {
            ifrVisualizacao.find('body').addClass('seiBtnRight');
        }
        if (localStorage.getItem('iconLabel')) {
            ifrVisualizacao.find('body').addClass('seiIconLabel');
        }
    }
}
function appendNewIcons(loop = true) {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var colorSlim = (getOptionsPro('colorSlimPro')) ? getOptionsPro('colorSlimPro') : rgbToHexString(ifrVisualizacao.find('.infraCorBarraSistema').css('background-color'));
    
    appendStyleNewIcons(ifrVisualizacao, colorSlim);
    replaceNewIcons(ifrVisualizacao.find('.infraBarraComandos a.botaoSEI'));
    if (loop) {
        setTimeout(function () {
            appendNewIcons(false);
        },1500);
    }
}
function replaceNewIcons(element) {
        element.find('.newIconTitle').remove();
        element.each(function(){
            var title = $(this).find('img').attr('title');
            $(this).addClass('iconBoxSlim');
            if (localStorage.getItem('iconLabel') && typeof title !== 'undefined' && title != '') { 
                $(this).addClass('iconLabel').append('<span class="newIconTitle">'+title+'</span>'); 
            } else {
                $(this).attr('onmouseover', 'return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()');
            }
        });
}
function replaceColorsIcons(element) {
    element.each(function(){
        var img = $(this).find('img').attr('src');
        if(typeof img !== 'undefined' && img != '') {
            var arrayTip = (typeof $(this).attr('onmouseover') !== 'undefined') ? extractTooltipToArray($(this).attr('onmouseover')) : ['',$(this).find('img').attr('title')];
            var colorTag = (typeof arrayTip !== 'undefined' && typeof arrayTip[1] !== 'undefined' && extractHexColor(arrayTip[1]) !== null) ? extractHexColor(arrayTip[1])[0] : false;
                colorTag = ($('#frmMarcadorLista').length) 
                            ? (extractHexColor($(this).closest('td').next().text())) ? extractHexColor($(this).closest('td').next().text())[0] : false
                            : colorTag;
                colorTag = ($(this).hasClass('dd-option')) 
                            ? (extractHexColor($(this).find('.dd-option-text').text())) ? extractHexColor($(this).find('.dd-option-text').text())[0] : false
                            : colorTag;
                colorTag = ($(this).hasClass('dd-selected')) 
                            ? (extractHexColor($(this).find('.dd-selected-text').text())) ? extractHexColor($(this).find('.dd-selected-text').text())[0] : false
                            : colorTag;
            var color = false;
                color = (img.indexOf('preto') !== -1) ? '#000000' : color;
                color = (img.indexOf('branco') !== -1) ? '#fbfbfe' : color;
                color = (img.indexOf('cinza') !== -1) ? '#c0c0c0' : color;
                color = (img.indexOf('vermelho') !== -1) ? '#ed1c24' : color;
                color = (img.indexOf('amarelo') !== -1) ? '#fff201' : color;
                color = (img.indexOf('verde') !== -1) ? '#0aff00' : color;
                color = (img.indexOf('azul') !== -1) ? '#4285f4' : color;
                color = (img.indexOf('rosa') !== -1) ? '#ff1cae' : color;
                color = (img.indexOf('roxo') !== -1) ? '#68329b' : color;
                color = (img.indexOf('ciano') !== -1) ? '#09ffff' : color;
                color = (colorTag) ? colorTag : color;
            var shadow = false;
                shadow = (img.indexOf('branco') !== -1) ? true : shadow;
                shadow = (img.indexOf('amarelo') !== -1) ? true : shadow;
            if (color) $(this).attr('data-color', true).css('color', color);
            if (shadow) $(this).attr('data-shadow', shadow);
        }
    })
}

// PESQUISA PROCESSOS POR LISTA
var arrayProtocoloSEI = [];
function loopIDProtocoloSEI(protocoloSEI, index, TimeOut = 200) {
    if (TimeOut <= 0) { 
        var next = index+1;
        var htmlTr =    '<tr>'+
                        '    <td style="font-size: 9pt; text-align: center;">'+arrayProtocoloSEI[index]+'</td>'+
                        '    <td style="font-size: 9pt; text-align: center;">ERROR</td>'+
                        '    <td style="font-size: 9pt; word-break: break-all;">-</td>'+
                        '</tr>';
        $('.tableResultProtocoloSEI').find('tbody').append(htmlTr);
        loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
        return;
    }
    if (index < arrayProtocoloSEI.length) { 
        getIDProtocoloSEI(protocoloSEI,  
            function(html){
                let $html = $(html);
                var params = getParamsUrlPro($html.find('#ifrArvore').attr('src'));
                var next = index+1;
                loopIDProtocoloSEI(arrayProtocoloSEI[next], next);
                appendSearchProtocoloSEI(params, index);
            }, 
            function(){
                setTimeout(function(){ 
                    loopIDProtocoloSEI(arrayProtocoloSEI[index], index, TimeOut - 100); 
                    console.log('ERROR', 'Reload loopIDProtocoloSEI', TimeOut); 
                }, 500);
            });
    } else {
        setTimeout(function(){ 
            alertaBoxPro('Sucess', 'check-circle', 'Protocolos pesquisados com sucesso!');
            loadingButtonConfirm(false);
            $('.ui-dialog .ui-dialog-buttonset .confirm.ui-button').addClass('ui-state-active');
        }, 500);
    }

}
function initBoxSearchProtocoloSEI() {
    resetDialogBoxPro();
    var htmlBox =   '<div class="searchProtocoloSEI" style="width: 100%; float: left;"><textarea placeholder="Insira os n\u00FAmeros de processo ou n\u00FAmeros SEI, um em cada linha..." id="searchProtocoloSEI" style="width: 90%; border: 2px solid #c5c5c5; height: 330px; border-radius: 5px;"></textarea></div>'+
                    '<div id="resultProtocoloSEI" class="resultProtocoloSEI" style="float: right; display: none;">'+
                    '    <div id="divResulProtocoloSEI" style="overflow-y: scroll; height: 300px;">'+
                    '       <table style="font-size: 9pt !important; width: 100%;" class="tableInfo tableZebra tableFollow seiProForm tableResultProtocoloSEI resultProtocoloSEI">'+
                    '           <thead>'+
                    '               <tr>'+
                    '                   <th class="tituloControle" style="width: 140px; padding: 5px 0px;">Protocolo</th>'+
                    '                   <th class="tituloControle" style="width: 90px; padding: 5px 0px;">Tipo</th>'+
                    '                   <th class="tituloControle" style="padding: 5px 0px;">Link Permanente</th>'+
                    '               </tr>'+
                    '           </thead>'+
                    '           <tbody>'+
                    '           </thead>'+
                    '       </table>'+
                    '    </div>'+
                    '    <div class="ui-dialog-buttonpane actionsResultProtocoloSEI">'+
                    '        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="copyTableResultProtocoloSEI()">Copiar Tabela</button>'+
                    '        <button type="button" class="ui-button ui-corner-all ui-widget" onclick="downloadTableResultProtocoloSEI()">Baixar CSV</button>'+
                    '    </div>'+
                    '</div>';
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: "Pesquisar Link Permanente",
            width: 300,
            open: function( event, ui ) {
                var processosTela = getProcessoUnidadePro();
                    processosTela = (processosTela.length > 0) ? processosTela.join('\n') : '';
                if (processosTela != '') { 
                    $('#searchProtocoloSEI').val(processosTela);
                }
            },
            close: function() { $('#configDatesBox').remove() },
            buttons: [{
                text: 'Limpar',
                click: function() {
                        cleanSearchProtocoloSEI();
                    }
                },{
                text: 'Pesquisar',
                class: 'confirm ui-state-active',
                click: function() {
                        initSearchProtocoloSEI();
                    }
                }]
        });
}
function initSearchProtocoloSEI() {
    var lines = $('#searchProtocoloSEI').val().split(/\n/);
        arrayProtocoloSEI = [];
    for (var i=0; i < lines.length; i++) {
      if (/\S/.test(lines[i])) {
        arrayProtocoloSEI.push($.trim(lines[i]));
      }
    }
    if(arrayProtocoloSEI !== null && arrayProtocoloSEI.length > 0 && !checkLoadingButtonConfirm()) {
        loopIDProtocoloSEI(arrayProtocoloSEI[0], 0);
        $('.resultProtocoloSEI').show();
        $('.searchProtocoloSEI').css('width', '30%');
        $('#resultProtocoloSEI').css('width', '70%');
        dialogBoxPro.dialog( "option", "width", 900 );
        loadingButtonConfirm(true);
    }
}
function cleanSearchProtocoloSEI() {
    $('.tableResultProtocoloSEI').find('tbody').html('');
    $('.resultProtocoloSEI').hide();
    $('.searchProtocoloSEI').css('width', '100%');
    $('#resultProtocoloSEI').css('width', '');
    dialogBoxPro.dialog( "option", "width", 300 );
    $('#searchProtocoloSEI').val('');
    loadingButtonConfirm(false);
    $('.ui-dialog .ui-dialog-buttonset .confirm.ui-button').addClass('ui-state-active');
}
function appendSearchProtocoloSEI(params, index) {
    var url_host = window.location.href.split('?')[0];
    var documento = (params.id_documento != '') ? '&id_documento='+String(params.id_documento) : '';
    var tipo = (params.id_documento != '') ? '<i class="far fa-file"></i> Documento' : '<i class="far fa-folder-open"></i> Protocolo';
    var href = url_host+'?acao=procedimento_trabalhar&id_procedimento='+String(params.id_procedimento)+documento;
    var htmlTr =    '<tr>'+
                    '    <td style="font-size: 9pt; text-align: center;">'+arrayProtocoloSEI[index]+'</td>'+
                    '    <td style="font-size: 9pt; text-align: center;">'+tipo+'</td>'+
                    '    <td style="font-size: 9pt; word-break: break-all;"><a style="text-decoration: underline; font-size: 9pt;" class="bLink" target="_blank" href="'+href+'">'+href+'</a></td>'+
                    '</tr>';
    $('.tableResultProtocoloSEI').find('tbody').append(htmlTr);
    var d = $('#divResulProtocoloSEI');
        d.scrollTop(d.prop("scrollHeight"));
}

function setNewDoc(id_procedimento, id_tipo_documento) {
    var href = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(id_procedimento);
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        var urlArvore = $html.find("#ifrArvore").attr('src');
        $.ajax({ url: urlArvore }).done(function (htmlArvore) {
            var $htmlArvore = $(htmlArvore);
            var textLink = $htmlArvore.filter('script').not('[src*="js"]').text();
            var arrayLinksArvoreDoc = getLinksInText(textLink);
            var urlNewDoc = arrayLinksArvoreDoc.filter(function(v){ return v.indexOf('acao=documento_escolher_tipo') !== -1 });
            if (urlNewDoc) {
                $.ajax({ url: urlNewDoc }).done(function (htmlNewDoc) {
                    let $htmlNewDoc = $(htmlNewDoc);
                    var urlDoc = $htmlNewDoc.find('a[href*="&id_serie='+id_tipo_documento+'"]').attr('href');
                    console.log(urlDoc, id_tipo_documento);
                        if (typeof urlDoc !== 'undefined') {
                            $.ajax({ url: urlDoc }).done(function (htmlDoc) {
                                var $htmlDoc = $(htmlDoc);
                                var form = $htmlDoc.find('#frmDocumentoCadastro');
                                var hrefForm = form.attr('action');
                                var param = {};
                                    form.find("input[type=hidden]").each(function () {
                                        if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                                            param[$(this).attr('name')] = $(this).val(); 
                                        }
                                    });
                                    form.find('input[type=text]').each(function () { 
                                        if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                                            param[$(this).attr('id')] = $(this).val();
                                        }
                                    });
                                    form.find('select').each(function () { 
                                        if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                                            param[$(this).attr('id')] = $(this).val();
                                        }
                                    });
                                    form.find('input[type=radio]').each(function () { 
                                        if ( $(this).attr('name') && $(this).attr('name').indexOf('rdo') !== -1) {
                                            param[$(this).attr('name')] = $(this).val();
                                        }
                                    });
                                    param.rdoNivelAcesso = '0';
                                    param.hdnFlagDocumentoCadastro = '2';
                                    param.txaObservacoes = '';
                                    param.txtDescricao = '';

                                    var postData = '';
                                    for (var k in param) {
                                        if (postData !== '') postData = postData + '&';
                                        var valor = (k=='hdnAssuntos') ? param[k] : escapeComponent(param[k]);
                                            valor = (k=='txtDataElaboracao') ? param[k] : escapeComponent(param[k]);
                                            valor = (k=='hdnInteressados') ? param[k] : valor;
                                            valor = (k=='txtDescricao') ? parent.encodeURI_toHex(param[k].normalize('NFC')) : valor;
                                            valor = (k=='txtNumero') ? escapeComponent(param[k]) : valor;
                                            postData = postData + k + '=' + valor;
                                    }

                                    var xhr = new XMLHttpRequest();
                                    $.ajax({
                                        method: 'POST',
                                        // data: param,
                                        data: postData,
                                        url: hrefForm,
                                        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                                        xhr: function() {
                                            return xhr;
                                        },
                                    }).done(function (htmlResult) {
                                        var status = (xhr.responseURL.indexOf('controlador.php?acao=arvore_visualizar&acao_origem=documento_gerar') !== -1) ? true : false;
                                        var ifrArvore = $('#ifrArvore');
                                        if (status) {
                                            console.log('Documento gerado com sucesso');
                                            var $htmlResult = $(htmlResult);
                                            var urlEditor = [];
                                            var idUser = false;
                                            $.each($htmlResult.text().split('\n'), function(i, v){
                                                if (v.indexOf("atualizarArvore('") !== -1) {
                                                    urlReload = v.split("'")[1];
                                                }
                                                if (v.indexOf("acao=editor_montar") !== -1) {
                                                    urlEditor.push(v.split("'")[1]);
                                                }
                                                if (v.indexOf("janelaEditor_") !== -1) {
                                                    idUser = v.split("_")[1];
                                                }
                                            });
                                            if (urlEditor.length > 0 && idUser) {
                                                openLinkNewTab(href);
                                                openWindowEditor(urlEditor[0]+'#&acao_pro=set_new_doc', idUser);
                                            }
                                            if (ifrArvore.length) {
                                                if (urlReload) {
                                                    ifrArvore.attr('src', urlReload);
                                                } else {
                                                    ifrArvore[0].contentWindow.location.reload(true);
                                                }
                                            }
                                        } else {
                                            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao gerar o documento.');
                                        }
                                    });
                            });
                        } else {
                            alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de documento. Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
                        }
                });
            } else {
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!')
            }
        });
    });
}
function setNewProc(id_tipo_procedimento, id_tipo_documento) {
var urlInitProc = $(mainMenu+' a[href*="acao=procedimento_escolher_tipo"]').attr('href');
    if (urlInitProc !== null) {
        $.ajax({ url: urlInitProc }).done(function (htmlInitProc) {
            var $htmlInitProc = $(htmlInitProc);
            var form = $htmlInitProc.find('#frmIniciarProcessoEscolhaTipo');
            var hrefForm = form.attr('action');
            var param = {};
                form.find("input[type=hidden]").each(function () {
                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                        param[$(this).attr('name')] = $(this).val(); 
                    }
                });
                param.hdnFiltroTipoProcedimento = 'T';
            
                $.ajax({
                    method: 'POST',
                    data: param,
                    url: hrefForm
                }).done(function (htmlFullList) {
                    let $htmlFullList = $(htmlFullList);
                    var urlProc = $htmlFullList.find('a[href*="procedimento_escolher_tipo&id_tipo_procedimento='+id_tipo_procedimento+'"]').attr('href');
                    if (urlProc !== null) {
                        $.ajax({ url: urlProc }).done(function (htmlFormProc) {
                            var $htmlFormProc = $(htmlFormProc);
                            var form = $htmlFormProc.find('#frmProcedimentoCadastro');
                            var hrefForm = form.attr('action');
                            var param = {};
                                form.find("input[type=hidden]").each(function () {
                                    if ( $(this).attr('name') && $(this).attr('id').indexOf('hdn') !== -1) {
                                        param[$(this).attr('name')] = $(this).val(); 
                                    }
                                });
                                form.find('input[type=text]').each(function () { 
                                    if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                                        param[$(this).attr('id')] = $(this).val();
                                    }
                                });
                                form.find('select').each(function () { 
                                    if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                                        param[$(this).attr('id')] = $(this).val();
                                    }
                                });
                                form.find('input[type=radio]').each(function () { 
                                    if ( $(this).attr('name') && $(this).attr('name').indexOf('rdo') !== -1) {
                                        param[$(this).attr('name')] = $(this).val();
                                    }
                                });
                                param.rdoNivelAcesso = '0';
                                param.hdnFlagProcedimentoCadastro = '2';
                                param.rdoProtocolo = 'M';
                                param.txaObservacoes = '';
                                param.hdnAssuntos = ($htmlFormProc.find('#selAssuntos option').length == 0) ? [] : $htmlFormProc.find('#selAssuntos option').map(function(){ return $(this).val()+'\u00B1'+$(this).text() }).get().join('\u00A5').replaceAll(' ','+');
                                param.hdnInteressados = $htmlFormProc.find('#selInteressados option').map(function(){ return $(this).val()+'\u00B1'+$(this).text() }).get().join('\u00A5').replaceAll(' ','+');

                                var postData = '';
                                for (var k in param) {
                                    if (postData !== '') postData = postData + '&';
                                    var valor = (k=='hdnNomeTipoProcedimento') ? escapeComponent(param[k]) : param[k];
                                        valor = (k=='hdnAssuntos') ? escapeComponent(param[k])  : valor;
                                        postData = postData + k + '=' + valor;
                                }
                                console.log(param, postData);

                                var xhr = new XMLHttpRequest();
                                $.ajax({
                                    method: 'POST',
                                    // data: param,
                                    data: postData,
                                    url: hrefForm,
                                    contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
                                    xhr: function() {
                                        return xhr;
                                    },
                                }).done(function (htmlResult) {
                                    var status = (xhr.responseURL.indexOf('controlador.php?acao=procedimento_trabalhar&acao_origem=procedimento_gerar') !== -1) ? true : false;
                                    if (status) {
                                        var $htmlResult = $(htmlResult);
                                        var linkProc = $htmlResult.find('#ifrArvore').attr('src');
                                        var id_procedimento = (linkProc !== null) ? getParamsUrlPro(linkProc).id_procedimento : false;
                                            id_procedimento = (typeof id_procedimento !== 'undefined') ? id_procedimento : false;
                                        var href = url_host.replace('controlador.php','')+'controlador.php?acao=procedimento_trabalhar&id_procedimento='+String(id_procedimento);
                                        if (id_procedimento && href) {
                                            setNewDoc(id_procedimento, id_tipo_documento);
                                        } else {
                                            alertaBoxPro('Error', 'exclamation-triangle', 'N\u00E3o foi poss\u00EDvel abrir o processo gerado. Verifique na caixa de entrada de sua unidade');
                                        }
                                    }
                                });
                        });
                    } else { 
                        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao selecionar o tipo de processo. Verifique se o tipo est\u00E1 dispon\u00EDvel no sistema e tente novamente');
                    }
                });
            
        });
    } else {
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao iniciar a cria\u00E7\u00E3o do processo');
    }
}
if (localStorage.getItem('seiSlim')) {
    function movemouse(e) { // Subscreve funcao nativa do SEI
        if (e == null) { e = window.event } 
        if (e.button <= 1 && isdrag){
        var tamanhoRedimensionamento = null;
        tamanhoRedimensionamento = nn6 ? tx + e.clientX - x : tx + event.clientX - x;
        var tamanhoLeft = 0;
        var tamanhoRight = 0;
        if (tamanhoRedimensionamento > 0){
            tamanhoLeft = (divLeftTamanhoInicial + tamanhoRedimensionamento);
            tamanhoRight = (divRightTamanhoInicial - tamanhoRedimensionamento);
        } else{
            tamanhoLeft = (divLeftTamanhoInicial - Math.abs(tamanhoRedimensionamento));
            tamanhoRight = (divRightTamanhoInicial + Math.abs(tamanhoRedimensionamento));
        }
        if (tamanhoLeft < 0 || tamanhoRight < 0){
            if (tamanhoRedimensionamento > 0){
            tamanhoLeft = 0;
            tamanhoRight = (divLeftTamanhoInicial - divRightTamanhoInicial) ;
            }else{
            tamanhoLeft = (divLeftTamanhoInicial - divRightTamanhoInicial);
            tamanhoRight = 0;
            }
        }   
        if(tamanhoLeft > 50 && tamanhoRight > 100){
            //document.getElementById("ifrArvore").style.width = tamanhoLeft + 'px';	
            //document.getElementById("ifrVisualizacao").style.width = tamanhoRight + 'px';
            setSizeIframePro(tamanhoLeft);
        }
        }
        return false;
    }
  }
  function setSizeIframePro(tLeft, saveSize = true) {
      $('head').find('style[data-style="seipro-sizeiframe"]').remove();
      $('head').prepend(  "<style type='text/css' data-style='seipro-sizeiframe'> "
                          +"  .seiSlim iframe#ifrArvore {\n"
                          +"      width: "+(tLeft-6)+"px !important;\n"
                          +"  }\n"
                          +"  .seiSlim.seiSlim_hidemenu iframe#ifrVisualizacao {\n"
                          +"      width: calc(97vw - "+(tLeft-6)+"px) !important;\n"
                          +"  }\n"
                          +"  .seiSlim iframe#ifrVisualizacao {\n"
                          +"      width: calc(78vw - "+(tLeft-6)+"px) !important;\n"
                          +"  }\n"
                          +"</style>");
    if (saveSize) setOptionsPro('iframeSizeSlimPro',tLeft);
}
if (verifyConfigValue('menususpenso')) {
    function infraMenuSistemaEsquema(bolInicializar, tipo){
        var mostrarMenu = null;
        var tamanhoDados = null;
        var title = '';

        if (bolInicializar == undefined) bolInicializar = false; 

        var lnkMenu = document.getElementById('lnkInfraMenuSistema');
        if (lnkMenu == null) return;

        var hdnCookie = document.getElementById('hdnInfraPrefixoCookie');
        if (hdnCookie == null) return;

        var prefixoCookie = hdnCookie.value;
        infraTooltipOcultar();

        if (bolInicializar){
        //le do cookie
        if (infraLerCookie(prefixoCookie+'_menu_mostrar')!='N'){
            tamanhoDados = document.getElementById("divInfraAreaTelaD").offsetWidth/document.getElementById("divInfraAreaTela").offsetWidth;
            tamanhoDados = Math.floor(tamanhoDados*Math.pow(10,2));
            infraCriarCookie(prefixoCookie+'_menu_tamanho_dados',tamanhoDados,1);
            title = 'Ocultar';
        } else {
            title = 'Exibir';
        }
        } else {
        if (tipo == undefined || tipo == null) {
            if (document.getElementById('divInfraAreaTelaE').style.display == ''){
            tipo = 'Ocultar';
            } else {
            tipo = 'Exibir';
            }
        }
        if (tipo == 'Ocultar' || (getOptionsPro('panelMenuSistemaView') !== false && !$('#divInfraBarraSistemaE').hasClass('barSuspenso'))) {
            document.getElementById('divInfraAreaTelaE').style.display='none';
            document.getElementById('divInfraAreaTelaD').style.width = '99%';
            infraCriarCookie(prefixoCookie+'_menu_mostrar','N',1);
            title = 'Exibir';
            if ($('#divInfraBarraSistemaE').hasClass('barSuspenso')) removeOptionsPro('panelMenuSistemaView');
            if (getOptionsPro('panelMenuSistemaView')) setMenuSistemaView();
        } else {
            setMenuSistemaView(true);
            removeOptionsPro('panelMenuSistemaView');

            tamanhoDados = infraLerCookie(prefixoCookie+'_menu_tamanho_dados');
            document.getElementById('divInfraAreaTelaE').style.display='';

            if (tamanhoDados == null) tamanhoDados = infraClientWidth() * 0.80;

            document.getElementById('divInfraAreaTelaD').style.width = tamanhoDados+'%';
            infraCriarCookie(prefixoCookie+'_menu_mostrar','S',1);
            title = 'Ocultar';
        }
        if (tipo == 'Ocultar') setOptionsPro('panelMenuSistemaView', 'active');
            infraResize();
            checkMenuSistemaView();
        }
    }
}
function setInfraImg(target = $('html')) {
    target.find('img[src*="/infra_css/"], img.infraImg, img.InfraImg').wrap(function(){
        return ($(this).closest('.infraImgPro').length == 0 && $(this).closest('#tblAnexos').length == 0) ? '<span class="infraImgPro" data-img="'+$(this).attr('src')+'"></span>' : false;
    });
}
function fnJqueryPro() {
    $.fn.wrapInTag = function (opts) {
        function getText(obj) {
            return obj.textContent ? obj.textContent : obj.innerText;
        }

        var tag = opts.tag || 'span',
            words = opts.words || [],
            tagclass = opts.class || '',
            regex = RegExp('\\b'+words.join('|')+'\\b', 'igm'),
            replacement = '<'+tag+' class="'+tagclass+'">$&</'+tag+'>';

        $(this).contents().each(function () {
            if (this.nodeType === 3) //Node.TEXT_NODE
            {
                $(this).replaceWith(getText(this).replace(regex, replacement));
            }
            else if (!opts.ignoreChildNodes) {
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
            } else if (this.selectionStart || this.selectionStart == '0') {
            var startPos = this.selectionStart;
            var endPos = this.selectionEnd;
            var scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) +
                myValue + this.value.substring(endPos,this.value.length);
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
    $.fn.moveTo = function(selector){
        return this.each(function(){
            var cl = $(this).clone();
            $(cl).prependTo(selector);
            $(this).remove();
        });
    };
    $.extend({
        replaceTag: function (element, tagName, withDataAndEvents, deepWithDataAndEvents) {
            var newTag = $("<" + tagName + ">")[0];
            $.each(element.attributes, function() {
                newTag.setAttribute(this.name, this.value);
            });
            $(element).children().clone(withDataAndEvents, deepWithDataAndEvents).appendTo(newTag);
            return newTag;
        }
    })
    $.fn.extend({
        replaceTag: function (tagName, withDataAndEvents, deepWithDataAndEvents) {
            // Use map to reconstruct the selector with newly created elements
            return this.map(function() {
                return jQuery.replaceTag(this, tagName, withDataAndEvents, deepWithDataAndEvents);
            })
        }
    });
    if (isNewSEI) $('body').addClass('newSEI');
}
$(document).ready(function () { fnJqueryPro() });