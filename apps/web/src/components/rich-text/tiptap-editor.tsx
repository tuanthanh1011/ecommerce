"use client";

import { useEffect } from "react";
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Bắt đầu viết nội dung...",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-content min-h-[260px] max-w-none px-5 py-4 focus:outline-none",
      },
    },
  });

  // Data often arrives after mount (or is reset by the form) — pull it into the
  // editor, but never while the user is typing in it.
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    if (!value && editor.isEmpty) return;
    if (value !== editor.getHTML()) {
      // Programmatic sync shouldn't become an undo step.
      editor
        .chain()
        .setMeta("addToHistory", false)
        .setContent(value || "", { emitUpdate: false })
        .run();
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="h-[310px] animate-pulse rounded-xl border bg-muted/40" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-card shadow-xs transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <WordCount editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1.5">
      <ToolButton icon={Bold} label="In đậm" active={state.bold} onClick={() => chain().toggleBold().run()} />
      <ToolButton icon={Italic} label="In nghiêng" active={state.italic} onClick={() => chain().toggleItalic().run()} />
      <ToolButton icon={Strikethrough} label="Gạch ngang" active={state.strike} onClick={() => chain().toggleStrike().run()} />
      <Divider />
      <ToolButton icon={Heading2} label="Tiêu đề lớn" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolButton icon={Heading3} label="Tiêu đề nhỏ" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <Divider />
      <ToolButton icon={List} label="Danh sách" active={state.bullet} onClick={() => chain().toggleBulletList().run()} />
      <ToolButton icon={ListOrdered} label="Danh sách số" active={state.ordered} onClick={() => chain().toggleOrderedList().run()} />
      <ToolButton icon={Quote} label="Trích dẫn" active={state.quote} onClick={() => chain().toggleBlockquote().run()} />
      <ToolButton icon={Minus} label="Đường kẻ" onClick={() => chain().setHorizontalRule().run()} />
      <ToolButton
        icon={Link2}
        label="Liên kết"
        active={state.link}
        onClick={() => {
          if (state.link) {
            chain().unsetLink().run();
            return;
          }
          const url = window.prompt("Nhập URL liên kết");
          if (url) chain().setLink({ href: url }).run();
        }}
      />
      <div className="ml-auto flex items-center gap-0.5">
        <ToolButton icon={Undo2} label="Hoàn tác" disabled={!state.canUndo} onClick={() => chain().undo().run()} />
        <ToolButton icon={Redo2} label="Làm lại" disabled={!state.canRedo} onClick={() => chain().redo().run()} />
      </div>
    </div>
  );
}

function WordCount({ editor }: { editor: Editor }) {
  const words = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const text = e.getText().trim();
      return text ? text.split(/\s+/).length : 0;
    },
  });
  return (
    <div className="flex justify-end border-t bg-muted/20 px-4 py-1.5 text-[11px] text-muted-foreground tabular-nums">
      {words} từ
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}

function ToolButton({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-35",
        active && "bg-card text-amber-700 shadow-xs ring-1 ring-border dark:text-amber-300",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
