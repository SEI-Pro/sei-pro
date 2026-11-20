import { IDS_RECURSOS } from "../src/recursos/ids";
import { RECURSOS } from "../src/recursos/indice";
import { iniciarRecursos, instalarRecursos } from "../src/recursos/instalar";
import type { Contexto, Recurso } from "../src/recursos/tipos";
import { paginaFalsa } from "./falsos";
import { checar, igual, secao } from "./util";

function contexto(win: Window, doc: Document): Contexto {
  return {
    adaptador: {} as Contexto["adaptador"],
    doc,
    win,
    base: "chrome-extension://x/",
    checkOpcao: () => true,
    verifyOpcao: () => false,
  };
}

export function verificarInstalar(): void {
  secao("recursos: instalar e iniciar");
  const { doc, win } = paginaFalsa();
  const c = contexto(win, doc);
  const registrados: string[] = [];
  (win as unknown as Record<string, unknown>).SeiProEditorAdapter = { registerFeature: (d: { id: string }) => registrados.push(d.id) };

  const foo = () => "a";
  const a: Recurso = { id: "a", globais: () => ({ foo }) };
  const b: Recurso = { id: "b", globais: () => ({ foo: () => "b", bar: () => "bar" }) };
  const r = instalarRecursos(win, [a, b], c);
  const w = win as unknown as Record<string, unknown>;
  checar("recurso A instala o global foo", w.foo === foo);
  igual("registerFeature recebe os ids dos dois", registrados, ["a", "b"]);
  checar("B nao sobrescreve o foo de A", w.foo === foo);
  checar(
    "B aparece em falhas com 'global ja definido: foo'",
    r.falhas.length === 1 && r.falhas[0]?.id === "b" && /global ja definido: foo/.test(String(r.falhas[0]?.erro)),
  );
  checar("o outro global de B (bar) ainda e instalado", typeof w.bar === "function");
  igual("so A conta como instalado por completo", r.instalados, ["a"]);

  const { win: w2, doc: d2 } = paginaFalsa();
  (w2 as unknown as Record<string, unknown>).legado = () => "legado";
  const r2 = instalarRecursos(w2, [{ id: "c", globais: () => ({ legado: () => "novo" }) }], contexto(w2, d2));
  checar(
    "nome ja definido pelo legado nao e sobrescrito",
    (w2 as unknown as { legado(): string }).legado() === "legado" && r2.falhas.length === 1,
  );

  const { win: w3, doc: d3 } = paginaFalsa();
  const r3 = instalarRecursos(
    w3,
    [
      {
        id: "d",
        globais: () => {
          throw new Error("boom");
        },
      },
      { id: "e", globais: () => ({ ok: () => 1 }) },
    ],
    contexto(w3, d3),
  );
  checar("globais() que lanca vira falha e nao impede o proximo recurso", r3.falhas.length === 1 && r3.instalados.includes("e"));

  const ordem: string[] = [];
  const f = iniciarRecursos(
    [
      {
        id: "x",
        globais: () => ({}),
        iniciar: () => {
          throw new Error("x falhou");
        },
      },
      { id: "y", globais: () => ({}), iniciar: () => ordem.push("y") },
    ],
    c,
  );
  igual("iniciar de um recurso que lanca nao impede o seguinte", ordem, ["y"]);
  checar("a falha do iniciar e devolvida", f.length === 1 && f[0]?.id === "x");

  igual(
    "indice.ts tem exatamente os ids de ids.ts, na mesma ordem",
    RECURSOS.map((r) => r.id),
    [...IDS_RECURSOS],
  );
}
