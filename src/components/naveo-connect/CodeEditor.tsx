"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  readOnly,
}: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="json"
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      options={{
        // Minimal
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: "on",
        minimap: { enabled: false },
        contextmenu: false,
        quickSuggestions: false,
        lineNumbers: "on",
        folding: false,
        glyphMargin: false,
        lineDecorationsWidth: 12,
        lineNumbersMinChars: 3,

        // Remove the right-side scroll "drag" bar
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          alwaysConsumeMouseWheel: true,
        },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        scrollBeyondLastLine: false,
        renderLineHighlight: "none",
        renderWhitespace: "none",
        renderControlCharacters: false,
        guides: { indentation: false },
        cursorBlinking: "solid",
        cursorStyle: "line",
        smoothScrolling: true,
        padding: { top: 10, bottom: 10 },
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 12,
      }}
      onMount={(editor, monaco) => {
        // Soft gray gutter (line numbers area) + minimal borders
        editor.updateOptions({
          // keeps it minimal even if user theme changes
        });

        monaco.editor.defineTheme("minimal-json", {
          base: "vs", // light
          inherit: true,
          rules: [],
          colors: {
            // Gutter (line numbers area)
            "editorGutter.background": "#F5F5F5", // subtle gray
            "editorLineNumber.foreground": "#9CA3AF", // gray-400
            "editorLineNumber.activeForeground": "#6B7280", // gray-500

            // Minimal editor surface
            "editor.background": "#FFFFFF",
            "editor.foreground": "#111827",
            "editorCursor.foreground": "#111827",
            "editor.selectionBackground": "#E5E7EB",
            "editor.inactiveSelectionBackground": "#F3F4F6",

            // Remove extra chrome
            "editorIndentGuide.background": "#00000000",
            "editorIndentGuide.activeBackground": "#00000000",
            "editor.lineHighlightBackground": "#00000000",
            "editorLineNumber.background": "#00000000",
            "editorOverviewRuler.border": "#00000000",
            "scrollbar.shadow": "#00000000",
          },
        });

        monaco.editor.setTheme("minimal-json");
        editor.updateOptions({
          readOnly,
        });
      }}
    />
  );
}
