import styled, { css } from 'styled-components';
import { HiOutlineX } from 'react-icons/hi';

function CloseIconButton({ onClick, variant = 'light', size = 40, title = 'Fechar', className }) {
    return (
        <StyledButton
            type="button"
            onClick={onClick}
            title={title}
            aria-label={title}
            $variant={variant}
            $size={size}
            className={className}
        >
            <HiOutlineX size={Math.round(size * 0.65)} />
        </StyledButton>
    );
}

export default CloseIconButton;

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${p => p.$size}px;
    height: ${p => p.$size}px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.25s ease;

    &:hover {
        transform: rotate(90deg);
    }

    ${p => p.$variant === 'dark' ? css`
        background-color: rgba(255, 255, 255, 0.15);
        color: white;

        &:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
    ` : css`
        background-color: #f1f3f8;
        color: #556;

        &:hover {
            background-color: #e2e6f0;
            color: #001143;
        }
    `}
`;
