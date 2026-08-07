/** Pure date-conflict rules shared by configuration use cases. */

export function checkDatesBetweenArray(array, dateTarget, idUser, idTarget, labels, {
    includes = false,
    searchTarget = false,
    addLoop = 'days',
    moment,
    search
} = {}) {
    if (typeof moment !== 'function') throw new Error('checkDatesBetweenArray requires moment');
    const format = String(dateTarget).includes('T') ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD';
    const userDates = searchTarget ? (array || [])
        : (typeof search === 'function' ? search(array || [], `[?${labels.id}==\`${idUser}\`]`) : (array || []).filter((v) => v[labels.id] == idUser));
    const target = moment(dateTarget, format);
    const boundary = includes ? '[]' : '()';
    return (userDates || []).reduce((out, value) => {
        const start = moment(value[labels.inicio], 'YYYY-MM-DD HH:mm:ss');
        const finish = moment(value[labels.fim], 'YYYY-MM-DD HH:mm:ss');
        const between = target.isBetween(start, finish, addLoop, boundary);
        const sameTarget = searchTarget ? idTarget != value[labels.idreftype] : idTarget != value[labels.id];
        if (between && sameTarget) out.push(value[labels.idreftype]);
        return out;
    }, []);
}

export function checkDatesLoopArray(array, inicio, fim, idUser, idTarget, labels, options = {}) {
    const { moment, addLoop = 'days' } = options;
    if (typeof moment !== 'function') throw new Error('checkDatesLoopArray requires moment');
    const format = 'YYYY-MM-DDTHH:mm';
    const start = moment(inicio, format);
    const end = moment(fim, format);
    const check = (date) => checkDatesBetweenArray(array, date, idUser, idTarget, labels, options);
    let result = check(start.format(format));
    if (!result || !result.length) result = check(end.format(format));
    while ((!result || !result.length) && start.add(1, addLoop).diff(end) < 0) {
        result = check(start.clone().format(format));
    }
    return result && result.length ? result : false;
}

