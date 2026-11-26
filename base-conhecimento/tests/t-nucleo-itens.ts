import { ErroSei } from "@nucleo/sessao/erros";
import { itensDaPagina, lerItensDaUnidade, MAX_PAGINAS_ITENS } from "../src/nucleo/itens";
import { checar, httpRoteado, lanca, paginaFixture, teste } from "./util";

await teste("itensDaPagina le os tres procedimentos da tela real", () => {
  const itens = itensDaPagina(paginaFixture("base_conhecimento_listar.html"));
  checar("tres itens", itens.length === 3);
  checar("agrupador do primeiro", itens[0]?.agrupador === "40");
  checar("id do primeiro", itens[0]?.id === "42");
  checar("titulo do primeiro", itens[0]?.titulo === "PROCEDIMENTO DE EXEMPLO A");
  checar("gerador do primeiro", itens[0]?.gerador === "usuario.teste");
  checar("liberado do primeiro", itens[0]?.liberado === true);
  checar("agrupador do segundo", itens[1]?.agrupador === "46");
  checar("terceiro sem liberacao", itens[2]?.liberado === false);
  checar("terceiro usa o id como agrupador quando nao ha link de versoes", itens[2]?.agrupador === "43");
  checar("link de visualizar preenchido", (itens[0]?.visualizar ?? "").includes("base_conhecimento_visualizar"));
});

await teste("entidades HTML do titulo sao decodificadas", () => {
  const itens = itensDaPagina(paginaFixture("base_conhecimento_listar_p0.html"));
  checar("decodifica &amp;", itens[1]?.titulo === "PROCEDIMENTO DE EXEMPLO P2 & TESTE");
});

await teste("lerItensDaUnidade percorre a paginacao", async () => {
  const http = httpRoteado({
    obter: () => paginaFixture("base_conhecimento_listar_p0.html"),
    enviar: () => paginaFixture("base_conhecimento_listar_p1.html"),
  });
  const sei = { http, linkMenu: () => "controlador.php?acao=base_conhecimento_listar" };
  const itens = await lerItensDaUnidade(sei);
  checar("cinco itens", itens.length === 5);
  checar("um GET e um POST de paginacao", http.pedidos.length === 1 && http.envios.length === 1);
  checar("pagina 2 pedida", http.envios[0]?.campos.some(([k, v]) => k === "hdnInfraPaginaAtual" && v === "1") === true);
});

await teste("lerItensDaUnidade propaga acao indisponivel do menu", async () => {
  const http = httpRoteado({});
  const sei = {
    http,
    linkMenu: (): string => {
      throw new ErroSei("SEI_ACAO_INDISPONIVEL", "sem o menu");
    },
  };
  const erro = await lanca(() => lerItensDaUnidade(sei));
  checar("erro tipado", erro instanceof ErroSei && (erro as ErroSei).codigo === "SEI_ACAO_INDISPONIVEL");
});

checar("MAX_PAGINAS_ITENS e um teto positivo", MAX_PAGINAS_ITENS > 1);
