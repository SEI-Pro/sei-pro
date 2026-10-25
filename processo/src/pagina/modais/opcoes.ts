/**
 * Das opções cruas do núcleo (`OpcaoLista`: valor + texto como o SEI mostra) para as do seletor com busca
 * (`OpcaoCombo`). Funções puras: o que cada lista mostra de forte, de suave e de marca fica aqui, e é testado sem DOM.
 */
import type { OpcaoCombo } from "@comum/ui/combobox";
import type { OpcaoLista } from "@nucleo/dominio/painelProcesso";
import { tagMarcador } from "../../ui/tagMarcador";

/** O SEI escreve o usuário como `login - Nome Completo`: o login é o rótulo (forte), o nome vai suave ao lado. */
export function separarUsuario(texto: string): { login: string; nome: string } {
  const [login = "", ...resto] = texto.split(" - ");
  return resto.length ? { login: login.trim(), nome: resto.join(" - ").trim() } : { login: texto.trim(), nome: "" };
}

export function opcoesDeUsuarios(opcoes: OpcaoLista[]): OpcaoCombo[] {
  return opcoes.map((o) => {
    const { login, nome } = separarUsuario(o.texto);
    return nome ? { valor: o.valor, rotulo: login, complemento: nome } : { valor: o.valor, rotulo: login };
  });
}

/** Cada marcador com a etiqueta na cor dele (ícone do SEI ausente = cinza). */
export function opcoesDeMarcadores(opcoes: OpcaoLista[], doc: Document = document): OpcaoCombo[] {
  return opcoes.map((o) => ({ valor: o.valor, rotulo: o.texto, marca: () => tagMarcador(o.icone, 16, doc) }));
}

export function opcoesSimples(opcoes: OpcaoLista[]): OpcaoCombo[] {
  return opcoes.map((o) => ({ valor: o.valor, rotulo: o.texto }));
}
