import React, { useEffect, useState } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { useComponentsStore } from "../../../../stores/components";

export interface CustomJSConfig {
  type: "customJS";
  code: string;
}

export interface CustomJSProps {
  value?: string;
  defaultValue?: string;
  onChange?: (config: CustomJSConfig) => void;
}

const CustomJS = (props: CustomJSProps) => {
  const { defaultValue, onChange, value: val } = props;

  const { curComponentId } = useComponentsStore();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(val);
  }, [val]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  };

  function codeChange(value?: string) {
    if (!curComponentId) return;

    setValue(value);

    onChange?.({
      type: "customJS",
      code: value!,
    });
  }
  return (
    <div className="mt-[40px]">
      <div className="flex items-start gap-[20px]">
        <div>自定义 JS</div>
        <div>
          <MonacoEditor
            width={"600px"}
            height={"400px"}
            path="action.js"
            language="javascript"
            onMount={handleEditorMount}
            onChange={codeChange}
            value={value}
            options={{
              fontSize: 14,
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
              scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomJS;
