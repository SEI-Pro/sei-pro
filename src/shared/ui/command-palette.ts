// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Create a vanilla command palette that opens with Ctrl/Cmd+K.
 */
export function createCommandPalette({
    commands = [],
    storage = globalThis.localStorage,
    storageKey = 'seipro-command-palette'
} = {}) {
    const normalizedCommands = commands.filter(function (command) {
        return command && command.id && command.label && typeof command.run === 'function';
    });

    const overlay = document.createElement('div');
    overlay.className = 'seipro-palette-overlay';
    overlay.hidden = true;

    const dialog = document.createElement('div');
    dialog.className = 'seipro-palette-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Paleta de comandos');

    const input = document.createElement('input');
    input.className = 'seipro-palette-input';
    input.type = 'search';
    input.placeholder = 'Digite um comando…';
    input.setAttribute('aria-label', 'Filtrar comandos');

    const list = document.createElement('ul');
    list.className = 'seipro-palette-list';
    list.setAttribute('role', 'listbox');

    dialog.append(input, list);
    overlay.appendChild(dialog);

    let filteredCommands = normalizedCommands.slice();
    let selectedIndex = 0;
    let previouslyFocused = null;
    let preferences = readPreferences();

    function readPreferences() {
        try {
            const parsed = JSON.parse(storage?.getItem?.(storageKey) || '{}');
            return {
                favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
                recent: Array.isArray(parsed.recent) ? parsed.recent : []
            };
        } catch (_) {
            return { favorites: [], recent: [] };
        }
    }

    function savePreferences() {
        try {
            storage?.setItem?.(storageKey, JSON.stringify(preferences));
        } catch (_) {
            // A paleta continua funcional quando o armazenamento não está disponível.
        }
    }

    function commandRank(command) {
        const favorite = preferences.favorites.indexOf(command.id);
        const recent = preferences.recent.indexOf(command.id);
        return {
            favorite: favorite === -1 ? Number.MAX_SAFE_INTEGER : favorite,
            recent: recent === -1 ? Number.MAX_SAFE_INTEGER : recent
        };
    }

    function sortCommands(items) {
        return items.map((command, index) => ({ command, index, rank: commandRank(command) }))
            .sort((left, right) => {
                const leftFavorite = left.rank.favorite !== Number.MAX_SAFE_INTEGER;
                const rightFavorite = right.rank.favorite !== Number.MAX_SAFE_INTEGER;
                if (leftFavorite !== rightFavorite) return leftFavorite ? -1 : 1;
                if (left.rank.favorite !== right.rank.favorite) return left.rank.favorite - right.rank.favorite;
                if (left.rank.recent !== right.rank.recent) return left.rank.recent - right.rank.recent;
                return left.index - right.index;
            })
            .map(({ command }) => command);
    }

    function commandSearchText(command) {
        const keywords = Array.isArray(command.keywords)
            ? command.keywords.join(' ')
            : (command.keywords || '');
        return `${command.label} ${keywords}`.toLocaleLowerCase();
    }

    function runCommand(command) {
        if (!command) return;
        preferences.recent = [
            command.id,
            ...preferences.recent.filter((id) => id !== command.id)
        ].slice(0, 8);
        savePreferences();
        api.close();
        command.run();
    }

    function render() {
        list.replaceChildren();
        let previousCategory = '';
        filteredCommands.forEach(function (command, index) {
            const category = String(command.category || 'Outros');
            if (category !== previousCategory) {
                const heading = document.createElement('li');
                heading.className = 'seipro-palette-category';
                heading.setAttribute('role', 'presentation');
                heading.textContent = category;
                list.appendChild(heading);
                previousCategory = category;
            }
            const item = document.createElement('li');
            item.className = 'seipro-palette-item';
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');
            item.dataset.commandId = command.id;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'seipro-palette-command';
            button.textContent = command.label;
            button.addEventListener('click', function () { runCommand(command); });

            const favorite = document.createElement('button');
            favorite.type = 'button';
            favorite.className = 'seipro-palette-favorite';
            const isFavorite = preferences.favorites.includes(command.id);
            favorite.setAttribute('aria-label', isFavorite
                ? `Remover ${command.label} dos favoritos`
                : `Adicionar ${command.label} aos favoritos`);
            favorite.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
            favorite.textContent = isFavorite ? '★' : '☆';
            favorite.addEventListener('click', function (event) {
                event.stopPropagation();
                preferences.favorites = isFavorite
                    ? preferences.favorites.filter((id) => id !== command.id)
                    : [...preferences.favorites, command.id];
                savePreferences();
                api.filter(input.value);
            });

            item.append(button, favorite);
            list.appendChild(item);
        });

        if (!filteredCommands.length) {
            const empty = document.createElement('li');
            empty.className = 'seipro-palette-empty';
            empty.textContent = 'Nenhum comando encontrado';
            list.appendChild(empty);
        }
    }

    const api = {
        el: overlay,
        open() {
            if (!overlay.isConnected) document.body.appendChild(overlay);
            previouslyFocused = document.activeElement;
            overlay.hidden = false;
            input.value = '';
            api.filter('');
            input.focus();
            return api;
        },
        close() {
            overlay.hidden = true;
            if (previouslyFocused?.isConnected && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
            return api;
        },
        filter(query = '') {
            const terms = String(query).trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
            filteredCommands = sortCommands(normalizedCommands.filter(function (command) {
                const searchText = commandSearchText(command);
                return terms.every(function (term) { return searchText.includes(term); });
            }));
            selectedIndex = 0;
            render();
            return filteredCommands.slice();
        },
        destroy() {
            document.removeEventListener('keydown', onGlobalKeydown, true);
            overlay.remove();
        }
    };

    function moveSelection(direction) {
        if (!filteredCommands.length) return;
        selectedIndex = (selectedIndex + direction + filteredCommands.length) % filteredCommands.length;
        render();
        const selected = list.querySelector('[aria-selected="true"]');
        if (selected && typeof selected.scrollIntoView === 'function') {
            selected.scrollIntoView({ block: 'nearest' });
        }
    }

    function onGlobalKeydown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
            event.preventDefault();
            if (overlay.hidden || !overlay.isConnected) api.open();
            else api.close();
            return;
        }
        if (overlay.hidden || !overlay.isConnected) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            api.close();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveSelection(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveSelection(-1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            runCommand(filteredCommands[selectedIndex]);
        }
    }

    input.addEventListener('input', function () { api.filter(input.value); });
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) api.close();
    });
    document.addEventListener('keydown', onGlobalKeydown, true);
    render();

    return api;
}
