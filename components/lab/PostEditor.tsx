"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

const btn: React.CSSProperties = {
  padding: "0.3rem 0.6rem", border: "1px solid var(--border)",
  background: "none", cursor: "pointer", fontSize: "0.78rem",
  color: "var(--ink)", fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
};

export default function PostEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt,
      LinkExt.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your post here..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  return (
    <div style={{ border: "1px solid var(--border)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", padding: "0.5rem", borderBottom: "1px solid var(--border)", backgroundColor: "#faf9f6" }}>
        {(["H1", "H2", "H3"] as const).map((h, i) => (
          <button key={h} type="button" style={btn}
            onClick={() => editor.chain().focus().toggleHeading({ level: (i + 1) as 1|2|3 }).run()}>
            {h}
          </button>
        ))}
        <span style={{ width: 1, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
        <button type="button" style={{ ...btn, fontWeight: 700 }} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" style={{ ...btn, fontStyle: "italic" }} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" style={btn} onClick={() => editor.chain().focus().toggleStrike().run()}>S̶</button>
        <span style={{ width: 1, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
        <button type="button" style={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" style={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" style={btn} onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</button>
        <button type="button" style={btn} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"<>"} Code</button>
        <span style={{ width: 1, backgroundColor: "var(--border)", margin: "0 0.25rem" }} />
        <button type="button" style={btn} onClick={setLink}>Link</button>
        <button type="button" style={btn} onClick={addImage}>Image</button>
        <button type="button" style={btn} onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</button>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{ minHeight: 320, padding: "1rem", fontSize: "0.95rem", lineHeight: 1.8 }}
      />

      <style>{`
        .tiptap { outline: none; }
        .tiptap p { margin: 0 0 1em; }
        .tiptap h1 { font-family: var(--font-playfair), Georgia, serif; font-size: 1.8rem; font-weight: 600; margin: 1.2em 0 0.4em; }
        .tiptap h2 { font-family: var(--font-playfair), Georgia, serif; font-size: 1.4rem; font-weight: 500; margin: 1em 0 0.4em; }
        .tiptap h3 { font-size: 1.1rem; font-weight: 600; margin: 0.8em 0 0.3em; }
        .tiptap blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--muted); font-style: italic; margin: 1em 0; }
        .tiptap code { background: rgba(17,17,17,0.06); padding: 0.1em 0.35em; font-size: 0.88em; border-radius: 2px; }
        .tiptap pre { background: #111; color: #f5f4f0; padding: 1rem; border-radius: 2px; overflow-x: auto; }
        .tiptap pre code { background: none; }
        .tiptap img { max-width: 100%; }
        .tiptap a { color: var(--accent); }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin: 0.5em 0; }
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--muted); pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}
