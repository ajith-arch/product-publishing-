"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Redo2, Undo2 } from "lucide-react";

import { SafeHtml } from "@/components/editor/safe-html";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Mode = "edit" | "html" | "preview";
const MODES: { id: Mode; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "html", label: "HTML" },
  { id: "preview", label: "Preview" },
];

export function RichTextField({
  id,
  label,
  hint,
  value,
  onChange,
  required,
  invalid,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (html: string) => void;
  required?: boolean;
  invalid?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("edit");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-1">
          <Label id={`${id}-label`} htmlFor={mode === "html" ? `${id}-html` : undefined}>
            {label}
            {required && (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            )}
          </Label>
          {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
        <div
          role="radiogroup"
          aria-label={`${label} view`}
          className="bg-muted inline-flex rounded-md p-0.5"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                mode === m.id
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "bg-card overflow-hidden rounded-md border shadow-xs",
          invalid && "border-destructive",
        )}
      >
        {mode === "edit" && (
          <RichEditor labelledBy={`${id}-label`} value={value} onChange={onChange} />
        )}
        {mode === "html" && (
          <Textarea
            id={`${id}-html`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="min-h-40 rounded-none border-0 font-mono text-xs shadow-none focus-visible:ring-0"
          />
        )}
        {mode === "preview" && (
          <div className="min-h-24 p-4">
            {value.trim() ? (
              <SafeHtml html={value} />
            ) : (
              <p className="text-muted-foreground text-sm italic">Nothing to preview.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RichEditor({
  value,
  onChange,
  labelledBy,
}: {
  value: string;
  onChange: (html: string) => void;
  labelledBy: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: false })],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-content min-h-32 px-4 py-3 outline-none",
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelledBy,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });
  if (!editor || !s) return <div className="bg-muted/40 h-9 border-b" />;

  const chain = () => editor.chain().focus();
  const buttons = [
    { label: "Bold", icon: Bold, active: s.bold, run: () => chain().toggleBold().run() },
    { label: "Italic", icon: Italic, active: s.italic, run: () => chain().toggleItalic().run() },
    {
      label: "Heading",
      icon: Heading2,
      active: s.h2,
      run: () => chain().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Subheading",
      icon: Heading3,
      active: s.h3,
      run: () => chain().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bulleted list",
      icon: List,
      active: s.bullet,
      run: () => chain().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      active: s.ordered,
      run: () => chain().toggleOrderedList().run(),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="bg-muted/40 flex flex-wrap gap-0.5 border-b p-1"
    >
      {buttons.map(({ label, icon: Icon, active, run }) => (
        <ToolbarButton key={label} label={label} active={active} onClick={run}>
          <Icon />
        </ToolbarButton>
      ))}
      <span className="bg-border mx-1 w-px" aria-hidden />
      <ToolbarButton label="Undo" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep focus (and the selection) in the editor so no keystrokes are lost.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-40 [&_svg]:size-4",
        active
          ? "bg-card text-foreground shadow-xs"
          : "text-muted-foreground hover:bg-card hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
