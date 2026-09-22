/**
 * Anonimização na fonte. O critério é o do Tarjar: sobrar marcação é aceitável
 * (o modelo lida com um rótulo a mais), faltar marcação não é.
 */

import { Pseudonimos } from "../src/privacidade/anonimizar";
import { checar, secao } from "./util";

export async function verificarPrivacidade(): Promise<void> {
  secao("privacidade: detectores validados");
  const p = new Pseudonimos();
  const t1 = p.anonimizar("CPF 529.982.247-25, e-mail joao.silva@exemplo.com.br, fone (61) 99876-5432.");
  checar("cpf valido mascarado", t1.includes("[CPF_1]") && !t1.includes("529.982"), t1);
  checar("email mascarado", t1.includes("[EMAIL_1]") && !t1.includes("exemplo.com"), t1);
  checar("telefone mascarado", t1.includes("[TELEFONE_1]") && !t1.includes("99876"), t1);
  const t2 = p.anonimizar("CPF 123.456.789-00 (inv\u00E1lido) e matr\u00EDcula 0012345.");
  checar("cpf formatado invalido mascarado, matricula fica", t2.includes("[CPF_2]") && t2.includes("0012345"), t2);
  const prot = "Processos 50300.018905/2018-67, 99906.713-630.000032/2025-82 e 00400.001234/2024-51; documento SEI 0103947.";
  checar("protocolos do SEI intactos", p.anonimizar(prot) === prot, p.anonimizar(prot));
  const t3 = p.anonimizar("De novo o CPF 52998224725.");
  checar("mesmo cpf, mesmo rotulo (com ou sem pontuacao)", t3.includes("[CPF_1]"), t3);
  checar("cnpj preservado por padrao", new Pseudonimos().anonimizar("CNPJ 11.222.333/0001-81").includes("11.222.333/0001-81"));
  checar("cnpj mascarado quando pedido", new Pseudonimos({ cnpj: true }).anonimizar("CNPJ 11.222.333/0001-81").includes("[CNPJ_1]"));

  secao("privacidade: rotulos de contexto");
  const q = new Pseudonimos();
  const e = q.anonimizar("Maria Souza, residente e domiciliada na Rua das Flores, 123, apto 45, CEP 70000-000, filha de José Souza e Ana Lima.");
  checar("endereco apos residente", e.includes("[ENDERECO_1]") && !e.includes("Flores"), e);
  checar("filiacao", e.includes("[PESSOA_") && !e.includes("Ana Lima"), e);
  checar("cep com rotulo", !e.includes("70000-000"), e);
  const r = q.anonimizar("O requerente Carlos Alberto de Oliveira apresentou laudo com CID F32.1 e conta corrente 12345-6.");
  checar("nome apos requerente", !r.includes("Carlos Alberto"), r);
  checar("cid de saude", r.includes("[SAUDE_1]"), r);
  checar("conta bancaria", r.includes("[CONTA_1]"), r);
  const end = q.anonimizar("Entregar na Avenida Paulista, 1000, sala 12.");
  checar("endereco sem rotulo", end.includes("[ENDERECO_") && !end.includes("Paulista"), end);

  secao("privacidade: dicionario de pessoas");
  const d = new Pseudonimos();
  d.registrarPessoas(["João da Silva Pereira", "CGE-CAUD", "Cliente"]);
  const td = d.anonimizar("Despacho sobre JOAO DA SILVA PEREIRA e João da  Silva Pereira; unidade CGE-CAUD.");
  checar("nome conhecido com e sem acento, qualquer caixa", !/silva/i.test(td) && (td.match(/\[PESSOA_1\]/g) ?? []).length === 2, td);
  checar("sigla de unidade nao e pessoa", td.includes("CGE-CAUD"));

  secao("privacidade: reidratacao e assinaturas");
  const texto = "Notifique [PESSOA_1] no endereço informado.";
  checar("reidrata rotulos", d.reidratar(texto).includes("João da Silva Pereira") || d.reidratar(texto).includes("JOAO DA SILVA PEREIRA"), d.reidratar(texto));
  checar("rotulo desconhecido fica", d.reidratar("[CPF_99]") === "[CPF_99]");
  const args = d.reidratarValor({ html: "<p>[PESSOA_1]</p>", lista: ["[PESSOA_1]"], n: 3 });
  checar("reidrata argumentos aninhados", !JSON.stringify(args).includes("[PESSOA_1]") && args.n === 3, args);
  const link = d.anonimizar("veja controlador.php?acao=x&infra_hash=" + "a".repeat(64));
  checar("links assinados nunca saem", !link.includes("aaaa") && !link.includes("acao=x"), link);
  const volta = Pseudonimos.importar(d.exportar());
  checar("exporta e importa o mapa", volta.reidratar("[PESSOA_1]") === d.reidratar("[PESSOA_1]"));
  checar("contagem por categoria", (d.contagem().PESSOA ?? 0) >= 1, d.contagem());
}
