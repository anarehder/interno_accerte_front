import styled, { css } from 'styled-components';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa6';

/**
 * Botão de campo ordenável: mostra o rótulo e uma setinha indicando a direção
 * da ordenação (para cima = ascendente, para baixo = descendente).
 * Use junto com o hook `useSortableData`.
 *
 * variant="pill" (padrão): botão avulso, estilo chip (ex: filtros acima de uma lista de cards).
 * variant="plain": sem fundo/borda, para uso dentro de cabeçalhos de tabela.
 */
function SortableFieldButtonComponent({ label, direction, onClick, variant = 'pill' }) {
    return (
        <Button type="button" onClick={onClick} $active={!!direction} $variant={variant}>
            {label}
            {direction === 'asc' && <FaSortUp />}
            {direction === 'desc' && <FaSortDown />}
            {!direction && <FaSort />}
        </Button>
    );
}

export default SortableFieldButtonComponent;

const Button = styled.button`
    align-items: center;
    gap: 6px;
    font-weight: 600;

    svg {
        font-size: 12px;
        opacity: ${({ $active }) => ($active ? 1 : 0.5)};
    }

    ${({ $variant, $active }) => $variant === 'plain' ? css`
        padding: 0;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        font-weight: 700;

        &:hover {
            background: transparent;
            opacity: 0.8;
        }
    ` : css`
        padding: 8px 14px;
        font-size: 13px;
        border-radius: 999px;
        border: 1px solid ${$active ? '#205fdd' : '#dfe3e8'};
        background: ${$active ? '#205fdd' : '#fafbfc'};
        color: ${$active ? '#fff' : '#555'};

        &:hover {
            background: ${$active ? '#1a4fba' : '#eef0f3'};
        }
    `}
`
