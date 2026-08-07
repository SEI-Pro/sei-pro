/**
 * Globais de terceiros carregados por `<script>` via manifest — não por import.
 *
 * As libs em `vendor/` são entregues como scripts clássicos (ver
 * `scripts/asset-manifest.mjs`), então não têm tipos de módulo. Estas declarações evitam
 * que todo uso vire `any` implícito em código novo (ADR-0014, condição 4).
 *
 * Deliberadamente MÍNIMAS e frouxas: descrevem apenas o que a extensão usa, sem tentar
 * reproduzir a API completa de cada lib. Tipo frouxo e honesto é melhor que tipo detalhado
 * e errado. Ao migrar uma feature para vanilla (ADR-0003), a entrada correspondente sai
 * daqui — este arquivo deve encolher, nunca crescer.
 *
 * Inventário e licenças: THIRD_PARTY_NOTICES.md
 */

declare global {
    /** jQuery 3.7.1 + plugins. Em remoção: 91 arquivos, 3611 usos (ADR-0003). */
    const $: any;
    const jQuery: any;

    /** Moment.js 2.30.1 + duration-format + weekday-calc. Datas novas usam src/core/datas. */
    const moment: any;

    /** CKEditor 4 — vive no mundo MAIN; pertence à página do SEI. */
    const CKEDITOR: any;

    /** Chart.js 4.4.7 */
    const Chart: any;

    /** DOMPurify 3.2.5 — sanitização obrigatória de HTML de origem externa. */
    const DOMPurify: { sanitize: (dirty: string, config?: object) => string };

    /** JMESPath — consultas na configuração JSON. */
    const jmespath: { search: (data: unknown, expression: string) => unknown };

    /** JSZip 3.10.1 + utils */
    const JSZip: any;
    const JSZipUtils: any;

    /** Papa Parse 5.5.2 — CSV. */
    const Papa: any;

    /** jschardet — detecção de encoding em upload. */
    const jschardet: any;

    /** frappe-gantt 1.2.2 — carregado sob demanda via $.getScript. */
    const Gantt: any;

    /** jKanban */
    const jKanban: any;

    /** diff2html — comparação de documentos. */
    const Diff2Html: any;

    /** CryptoJS */
    const CryptoJS: any;

    /** Favico.js 0.3.10 — contador no favicon. */
    const Favico: any;

    /** mammoth — .docx para HTML. */
    const mammoth: any;

    /** qrcode.js */
    const QRCode: any;

    /** Flags de versão do SEI publicadas por src/bootstrap/init-flags.js (legado). */
    const isNewSEI: boolean | undefined;
    const isSEI_5: boolean | undefined;
    const URL_SPRO: string | undefined;

    /** Polyfill Chrome/Firefox: `browser` é alias de `chrome` quando ausente. */
    const browser: typeof chrome | undefined;
}

export {};
