import styled from "styled-components";
import { HiOutlineX } from "react-icons/hi";

function ModalComponent({ onFechar, children }) {
    return (
        <ModalOverlay onClick={onFechar}>
            <ModalPainel onClick={(e) => e.stopPropagation()}>
                <ModalFecharButton type="button" onClick={onFechar} title="Fechar" aria-label="Fechar">
                    <HiOutlineX size={26} />
                </ModalFecharButton>
                {children}
            </ModalPainel>
        </ModalOverlay>
    )
}

export default ModalComponent;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(8, 20, 48, 0.55);
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    padding: 160px 16px 40px;
    z-index: 1000;
`

const ModalPainel = styled.div`
    position: relative;
    width: 100%;
    max-width: 1080px;
    flex-direction: column;
    align-items: center;
    background: #f4f6f9;
    border-radius: 20px;
    padding: 40px 24px 50px;
    margin-bottom: 80px;
    box-sizing: border-box;
`

const ModalFecharButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: white;
    color: #0B2049;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);

    &:hover {
        background: #828ca6;
    }
`
