/** SEI Pro Lab: tom do fundo, escolha de ícones e o conjunto Pastilhas. */
import { CONFIG_PADRAO, normalizarConfig } from "@comum/tema/config";
import { contraste, FUNDOS } from "@comum/tema/paleta";
import { gerarFolha, gerarTokens, superficiesDoFundo } from "@comum/tema/tokens";
import { cssDosIcones } from "../src/icones/css";
import { iconesSemCor } from "../src/icones/pastilhas";
import { checar, secao } from "./util";

export function verificarLab(): void {
  secao("SEI Pro Lab: tom do fundo e icones");

  const antiga = normalizarConfig({
    versao: 1,
    ativo: true,
    modo: "escuro",
    paleta: "sei-pro",
    corBarra: "#1f5fbf",
    escurecerDocumentos: true,
  });
  checar(
    "config antiga ganha os padroes novos",
    antiga.tomClaro === "padrao" && antiga.tomEscuro === "padrao" && antiga.icones === "moderno",
  );
  const comTom = normalizarConfig({ ...CONFIG_PADRAO, tomEscuro: "sepia", fundoEscuro: "#000000", icones: "pastilhas" });
  checar(
    "tom pronto ignora cor gravada diferente",
    comTom.tomEscuro === "sepia" && comTom.fundoEscuro === FUNDOS.escuro.find((f) => f.id === "sepia")!.cor,
  );
  checar("conjunto de icones valido e mantido", comTom.icones === "pastilhas");
  const livre = normalizarConfig({ ...CONFIG_PADRAO, tomClaro: "livre", fundoClaro: "#ABCDEF" });
  checar("cor livre valida e mantida", livre.tomClaro === "livre" && livre.fundoClaro === "#abcdef");
  const lixo = normalizarConfig({ ...CONFIG_PADRAO, tomClaro: "livre", fundoClaro: "red", icones: "xyz" });
  checar("valores invalidos voltam ao padrao", lixo.tomClaro === "padrao" && lixo.icones === "moderno");

  for (const e of ["claro", "escuro"] as const) {
    const padrao = superficiesDoFundo(e, FUNDOS[e][0]!.cor);
    checar(`${e}: tom padrao devolve as cores originais`, padrao["--spro-fundo"] === gerarTokens(CONFIG_PADRAO, e)["--spro-fundo"]);
    for (const cor of [...FUNDOS[e].map((f) => f.cor), "#ff0000", "#00ff88", "#ffffff", "#000000"]) {
      const s = superficiesDoFundo(e, cor);
      const ok =
        contraste(s["--spro-texto"]!, s["--spro-fundo-3"]!) >= 10.5 &&
        contraste(s["--spro-suave"]!, s["--spro-fundo-3"]!) >= 4.8 &&
        contraste(s["--spro-texto"]!, s["--spro-pagina"]!) >= 10.5;
      checar(`${e}: texto legivel sobre o tom ${cor}`, ok);
    }
  }
  const cfgSepia = normalizarConfig({ ...CONFIG_PADRAO, tomClaro: "sepia" });
  const t = gerarTokens(cfgSepia, "claro");
  checar("destaque com contraste sobre o fundo sepia", contraste(t["--spro-destaque"]!, t["--spro-fundo"]!) >= 4.5);

  checar("todos os icones das pastilhas tem desenho e cor", iconesSemCor().length === 0);
  checar("originais: nenhum CSS de icone", cssDosIcones("originais") === "");
  const p = cssDosIcones("pastilhas");
  checar(
    "pastilhas: troca menu, topo, tabela, barra e menu do SEI Pro",
    ["#infraMenu img", "#divInfraBarraSistemaPadrao img", "table img", "barraBotoesSEI", "seiProAgenteMenu"].every((x) => p.includes(x)),
  );
  checar(
    "pastilhas: so age com o tema ativo",
    p.split("{").length - 1 === (p.match(/\{\n/g) ?? []).length &&
      !/^[^:@\n][^{]*\{/m.test(p.replace(/:root\[data-spro-tema-ativo\][^{]*\{/g, "")),
  );
  checar("moderno continua igual ao original", cssDosIcones("moderno").includes("-webkit-mask-image"));
  const duo = cssDosIcones("duotom");
  checar("duotom: traco fino e preenchimento suave", duo.includes("stroke-width%3D%221.5%22") && duo.includes("fill-opacity%3D%220.3%22"));
  checar("duotom: mesmos alvos do moderno", (duo.match(/\{/g) ?? []).length === (cssDosIcones("moderno").match(/\{/g) ?? []).length);
  checar("config aceita duotom", normalizarConfig({ ...CONFIG_PADRAO, icones: "duotom" }).icones === "duotom");

  const folhaPadrao = gerarFolha(normalizarConfig({ ...CONFIG_PADRAO, ativo: true }), "escuro");
  checar("tom padrao: nada nos hospedeiros (Controle novo, janelas)", !folhaPadrao.includes("#spro-grade"));
  const folhaSepia = gerarFolha(normalizarConfig({ ...CONFIG_PADRAO, ativo: true, tomEscuro: "sepia" }), "escuro");
  checar("tom escolhido: chega aos hospedeiros com o fundo do tom", /#spro-grade[^{]*\{[^}]*--spro-fundo: #262017/.test(folhaSepia));
}
