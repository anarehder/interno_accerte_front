import styled from "styled-components";
import { HiOutlineX } from "react-icons/hi";
import NoticiaPreviewComponent from "./NoticiaPreviewComponent";

function NoticiaPreviewModalComponent({ onFechar, ...previewProps }) {
    return (
        <PreviewOverlay onClick={onFechar}>
            <PreviewPainel onClick={(e) => e.stopPropagation()}>
                <PreviewFecharButton type="button" onClick={onFechar} title="Fechar" aria-label="Fechar">
                    <HiOutlineX size={26} />
                </PreviewFecharButton>
                <NoticiaPreviewComponent {...previewProps} />
            </PreviewPainel>
        </PreviewOverlay>
    )
}

export default NoticiaPreviewModalComponent;

const PreviewOverlay = styled.div`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(8, 20, 48, 0.55);
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    padding: 40px 16px;
    z-index: 100;
`

const PreviewPainel = styled.div`
    position: relative;
    width: 100%;
    max-width: 900px;
    flex-direction: column;
    align-items: center;
    background: #f4f6f9;
    border-radius: 20px;
    padding: 40px 0 60px;
    margin-bottom: 80px;
    box-sizing: border-box;
`

const PreviewFecharButton = styled.button`
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
