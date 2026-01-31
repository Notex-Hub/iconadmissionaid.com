"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SimpleEditor({
  value,
  onChange,
  placeholder = "Write here...",
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] p-4 outline-none prose prose-sm max-w-none focus:outline-none",
        placeholder,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const btn = (active?: boolean) =>
    `editor-btn ${active ? "editor-btn-active" : ""}`;

  return (
    <div className="border rounded-2xl bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b p-2 bg-gray-50 rounded-t-2xl">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive("underline"))}
        >
          U
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btn(editor.isActive("strike"))}
        >
          S
        </button>

        <span className="mx-1 text-gray-300">|</span>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btn(editor.isActive("heading", { level: 1 }))}
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>

        <span className="mx-1 text-gray-300">|</span>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          1. List
        </button>

        <span className="mx-1 text-gray-300">|</span>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
        >
          ❝
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btn(editor.isActive("codeBlock"))}
        >
          {"</>"}
        </button>

        <span className="mx-1 text-gray-300">|</span>

        <button
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url)
              editor.chain().focus().setLink({ href: url }).run();
          }}
          className={btn(editor.isActive("link"))}
        >
          🔗
        </button>

        <button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url)
              editor.chain().focus().setImage({ src: url }).run();
          }}
          className="editor-btn"
        >
          🖼
        </button>

        <span className="mx-1 text-gray-300">|</span>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="editor-btn"
        >
          ↺
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="editor-btn"
        >
          ↻
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
