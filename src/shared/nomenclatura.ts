// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Shared nomenclature helpers (atividades + consumers such as sei-functions).
 * Depends on globalThis.arrayNomenclaturas and capitalizeFirstLetter (core util).
 */
export function getName(ref_nomenclatura, name_default, singular = true, with_article = false, capitalize = false) {
    const arrayNomenclaturas = globalThis.arrayNomenclaturas;
    const capitalizeFirstLetter = globalThis.capitalizeFirstLetter;
    if (typeof arrayNomenclaturas !== 'undefined' && arrayNomenclaturas.length > 0) {
        var name = jmespath.search(arrayNomenclaturas, "[?ref_nomenclatura=='" + ref_nomenclatura + "'] | [0]");
        name = (name !== null) ? name : false;
        var article = (name)
            ? name.config.masculino
                ? (singular ? 'o' : 'os')
                : (singular ? 'a' : 'as')
            : '';
        var nomenclatura = name ? (singular ? name.config.singular : name.config.plural) : name_default;
        nomenclatura = (capitalize && typeof capitalizeFirstLetter === 'function')
            ? capitalizeFirstLetter(nomenclatura)
            : nomenclatura;
        var preposicao = (name && typeof name.config.preposicao !== 'undefined' && name.config.preposicao)
            ? name.config.masculino
                ? (singular ? 'do ' : 'dos ')
                : (singular ? 'da ' : 'das ')
            : '';
        var phase = (with_article) ? article + ' ' + nomenclatura : preposicao + nomenclatura;
        return phase;
    }
    return name_default;
}

export function getNameGenre(ref_nomenclatura, string_male, string_female) {
    const arrayNomenclaturas = globalThis.arrayNomenclaturas || [];
    var masc = jmespath.search(arrayNomenclaturas, "[?ref_nomenclatura=='" + ref_nomenclatura + "'] | [0].config.masculino");
    masc = (masc !== null) ? masc : false;
    return (masc ? string_male : string_female);
}
