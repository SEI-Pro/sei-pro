/**
 * Skills do usuário: slug, endereço do GitHub, download e a mensagem que sai
 * para o modelo quando o usuário chama `/slug`.
 */

import { baixarSkill, comSkills, descricaoDoTexto, skillsCitadas, slugificar, slugLivre, urlCrua, type SkillUsuario } from "../src/painel/skills";
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
