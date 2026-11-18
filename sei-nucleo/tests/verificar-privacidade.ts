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

  secao("privacidade: numeros de tabela nao viram telefone");
  {
    // Relato de usuária (2.9): "Março 9,5% 19.000 28.500" virava "9,[TELEFONE_11]" — os dígitos de
    // três células juntos davam DDD 51 + celular começando com 9.
    const n = new Pseudonimos();
    const tabela = "Março\n9,5%\n19.000\n28.500\nDezembro\n4,5%\n9.000\n13.500\nTotal 11.350\n32.000";
    const tt = n.anonimizar(tabela);
    checar("percentual e volumes de tabela intactos", tt === tabela, tt);
    const fones = n.anonimizar("Fones (51) 99000-2850, 61 3411 4000 e +55 61 9 9876-5432.");
    checar("telefones de verdade continuam mascarados", !/99000|3411|9876/.test(fones) && (fones.match(/\[TELEFONE_\d+\]/g) ?? []).length === 3, fones);
  }
  {
    // Relato da 3.9.2: quadro de coordenadas das estações georreferenciadas.
    const n = new Pseudonimos();
    const quadro = "Estação Norte Este Cota\nVT-332 7470118.8000 691715.6230 2.341\nVT-333 7470277.6260 692182.0730 2.892\nVT-334 7470332.8430 692203.3890 1.635\nEste\n691715.6230\n692182.0730\n692203.3890";
    const tq = n.anonimizar(quadro);
    checar("quadro de coordenadas intacto", tq === quadro, tq);
  }

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
