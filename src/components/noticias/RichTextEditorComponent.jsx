import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
    HiOutlineBold,
    HiOutlineItalic,
    HiOutlineUnderline,
    HiOutlineLink,
    HiOutlineListBullet,
    HiOutlineQueueList,
    HiOutlineArrowUturnLeft,
    HiOutlineArrowUturnRight,
} from "react-icons/hi2";
import { BsTypeStrikethrough } from "react-icons/bs";

// via paste do Word/Google Docs o ProseMirror já interpreta o HTML da área de
// transferência e mapeia negrito/itálico/listas/links pro schema abaixo
function RichTextEditorComponent({ value, onChange, placeholder }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const definirLink = () => {
        const urlAtual = editor.getAttributes("link").href || "";
        const url = window.prompt("URL do link:", urlAtual);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <Wrapper>
            <Toolbar>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleBold().run()} $ativo={editor.isActive("bold")} title="Negrito (ctrl+b)">
                    <HiOutlineBold size={19} />
                </BotaoFormato>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleItalic().run()} $ativo={editor.isActive("italic")} title="Itálico (ctrl+i)">
                    <HiOutlineItalic size={19} />
                </BotaoFormato>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} $ativo={editor.isActive("underline")} title="Sublinhado (ctrl+u)">
                    <HiOutlineUnderline size={19} />
                </BotaoFormato>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleStrike().run()} $ativo={editor.isActive("strike")} title="Tachado">
                    <BsTypeStrikethrough size={18} />
                </BotaoFormato>

                <Separador />

                <BotaoTexto type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} $ativo={editor.isActive("heading", { level: 2 })} title="Título">
                    H2
                </BotaoTexto>
                <BotaoTexto type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} $ativo={editor.isActive("heading", { level: 3 })} title="Subtítulo">
                    H3
                </BotaoTexto>

                <Separador />

                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} $ativo={editor.isActive("bulletList")} title="Lista com marcadores">
                    <HiOutlineListBullet size={19} />
                </BotaoFormato>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} $ativo={editor.isActive("orderedList")} title="Lista numerada">
                    <HiOutlineQueueList size={19} />
                </BotaoFormato>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} $ativo={editor.isActive("blockquote")} title="Citação">
                    &quot;
                </BotaoFormato>
                <BotaoFormato type="button" onClick={definirLink} $ativo={editor.isActive("link")} title="Link">
                    <HiOutlineLink size={19} />
                </BotaoFormato>

                <Separador />

                <BotaoFormato type="button" onClick={() => editor.chain().focus().undo().run()} title="Desfazer (ctrl+z)">
                    <HiOutlineArrowUturnLeft size={19} />
                </BotaoFormato>
                <BotaoFormato type="button" onClick={() => editor.chain().focus().redo().run()} title="Refazer (ctrl+shift+z)">
                    <HiOutlineArrowUturnRight size={19} />
                </BotaoFormato>
            </Toolbar>
            <EditorArea>
                <EditorContent editor={editor} />
                {editor.isEmpty && placeholder &&
                    <Placeholder>{placeholder}</Placeholder>
                }
            </EditorArea>
        </Wrapper>
    );
}

export default RichTextEditorComponent;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #dfe3e8;
    background: white;
`

const Toolbar = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    border-bottom: 1px solid #dfe3e8;
    background: #fafbfc;
`

const Separador = styled.div`
    width: 1px;
    height: 22px;
    background: #dfe3e8;
    margin: 0 4px;
`

const BotaoFormato = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: ${(props) => props.$ativo ? "#e8eefc" : "transparent"};
    color: ${(props) => props.$ativo ? "#205fdd" : "#555"};
    cursor: pointer;
    font-weight: 700;
    font-size: 14px;

    svg {
        width: 19px;
        height: 19px;
        flex-shrink: 0;
    }

    &:hover {
        background: #eef2fb;
    }
`

const BotaoTexto = styled(BotaoFormato)`
    width: auto;
    padding: 0 8px;
    font-size: 13px;
`

const EditorArea = styled.div`
    display: block;
    position: relative;
    padding: 14px;
    min-height: 300px;
    max-height: 1200px;
    overflow-y: auto;

    .ProseMirror {
        display: block;
        outline: none;
        min-height: 270px;
        font-size: 15px;
        line-height: 1.6;
        color: #333;
        text-align: left;
    }

    .ProseMirror p {
        margin: 0 0 1em;
        text-align: left;
        font-size: inherit;
        font-weight: inherit;
    }

    .ProseMirror ul,
    .ProseMirror ol {
        padding-left: 1.4em;
        margin: 0 0 1em;
    }

    .ProseMirror ul {
        list-style: disc;
    }

    .ProseMirror ol {
        list-style: decimal;
    }

    .ProseMirror ul ul {
        list-style: circle;
    }

    .ProseMirror li {
        text-align: left;
    }

    .ProseMirror h2,
    .ProseMirror h3 {
        color: #0B2049;
        margin: 0.6em 0 0.4em;
        text-align: left;
    }

    .ProseMirror blockquote {
        border-left: 3px solid #dfe3e8;
        padding-left: 14px;
        margin: 0 0 1em;
        color: #666;
    }

    .ProseMirror a {
        color: #205fdd;
    }
`

const Placeholder = styled.span`
    position: absolute;
    top: 14px;
    left: 14px;
    color: #a7acb3;
    font-size: 15px;
    pointer-events: none;
`
