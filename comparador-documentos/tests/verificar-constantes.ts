import {
  ATRIBUTO_ATIVO,
  CANAL_COMPARADOR,
  COR_ACRESCENTADO,
  COR_REMOVIDO,
  DOCTYPE_DOWNLOAD,
  EVENTO_ABRIR,
  OPCAO_LEGADA,
} from "@cd/modelo/constantes";
import { igual, secao } from "./util";

export function verificarConstantes(): void {
  secao("constantes");
  igual("evento", EVENTO_ABRIR, "spro-comparador-abrir");
  igual("atributo ativo", ATRIBUTO_ATIVO, "data-seipro-comparador");
  igual("canal", CANAL_COMPARADOR, "seipro-comparador");
  igual("opcao legada", OPCAO_LEGADA, "comparardocumentos");
  igual("cor removido", COR_REMOVIDO, "background-color: #FFF0F5;color: #FF0000;");
  igual("cor acrescentado", COR_ACRESCENTADO, "background-color: #F0F8FF;color: #0000FF;");
  igual("doctype", DOCTYPE_DOWNLOAD, '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');
}
