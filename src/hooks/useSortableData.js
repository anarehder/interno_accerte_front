import { useMemo, useState } from 'react';

/**
 * Hook genérico de ordenação de listas, reutilizável em qualquer página.
 *
 * @param {Array<object>} items - array de dados a ordenar
 * @param {{ field: string, direction: 'asc'|'desc' } | null} [initialSort] - ordenação inicial (opcional)
 * @param {Object<string, (a: any, b: any) => number>} [comparators] - comparadores customizados por campo,
 *   para casos que não sejam texto/número simples (ex: datas, campos aninhados)
 *
 * @returns {{
 *   sortedItems: Array<object>,
 *   sortConfig: { field: string, direction: 'asc'|'desc' } | null,
 *   requestSort: (field: string) => void,
 *   getSortDirection: (field: string) => 'asc'|'desc'|null,
 * }}
 *
 * Uso:
 *   const { sortedItems, requestSort, getSortDirection } = useSortableData(funcionarios, { field: 'nome', direction: 'asc' });
 *   <SortableFieldButton label="Nome" active={!!getSortDirection('nome')} direction={getSortDirection('nome')} onClick={() => requestSort('nome')} />
 */
function useSortableData(items, initialSort = null, comparators = {}) {
    const [sortConfig, setSortConfig] = useState(initialSort);

    const sortedItems = useMemo(() => {
        if (!sortConfig || !items) return items;
        const { field, direction } = sortConfig;
        const factor = direction === 'asc' ? 1 : -1;

        return [...items].sort((a, b) => {
            const customCompare = comparators[field];
            if (customCompare) return customCompare(a, b) * factor;

            const valueA = a?.[field];
            const valueB = b?.[field];

            if (valueA == null && valueB == null) return 0;
            if (valueA == null) return 1;
            if (valueB == null) return -1;

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return (valueA - valueB) * factor;
            }

            return String(valueA).localeCompare(String(valueB), 'pt-BR', { sensitivity: 'base' }) * factor;
        });
    }, [items, sortConfig, comparators]);

    const requestSort = (field) => {
        setSortConfig((prev) => {
            if (!prev || prev.field !== field) return { field, direction: 'asc' };
            if (prev.direction === 'asc') return { field, direction: 'desc' };
            return null; // terceiro clique remove a ordenação
        });
    };

    const getSortDirection = (field) => (sortConfig?.field === field ? sortConfig.direction : null);

    return { sortedItems, sortConfig, requestSort, getSortDirection };
}

export default useSortableData;
