import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useComponentsStore } from "../../../../stores/components";

export interface ShowMessageConfig {
  type: "showMessage";
  config: {
    type: "success" | "error";
    text: string;
  };
}

export interface ShowMessageProps {
  value?: ShowMessageConfig["config"];
  defaultValue?: ShowMessageConfig["config"];
  onChange?: (config: ShowMessageConfig) => void;
}

export function ShowMessage(props: ShowMessageProps) {
  const { value: val, defaultValue, onChange } = props;

  const { curComponentId } = useComponentsStore();

  const [type, setType] = useState<"success" | "error">(
    defaultValue?.type || "success"
  );
  const [text, setText] = useState<string>(defaultValue?.text || "");

  useEffect(() => {
    if (val) {
      setType(val.type);
      setText(val.text);
    }
  });

  function messageTypeChange(defaultValue: "success" | "error") {
    if (!curComponentId) return;

    setType(defaultValue);

    onChange?.({
      type: "showMessage",
      config: {
        type: defaultValue,
        text,
      },
    });
  }

  function messageTextChange(defaultValue: string) {
    if (!curComponentId) return;

    setText(defaultValue);

    onChange?.({
      type: "showMessage",
      config: {
        type,
        text: defaultValue,
      },
    });
  }

  return (
    <div className="mt-[30px]">
      <div className="flex items-center gap-[20px]">
        <div>类型：</div>
        <div>
          <Select
            style={{ width: 500, height: 50 }}
            options={[
              { label: "成功", defaultValue: "success" },
              { label: "失败", defaultValue: "error" },
            ]}
            onChange={(defaultValue) => {
              messageTypeChange(defaultValue);
            }}
            defaultValue={type}
          />
        </div>
      </div>
      <div className="flex items-center gap-[20px] mt-[50px]">
        <div>文本：</div>
        <div>
          <Input
            style={{ width: 500, height: 50 }}
            onChange={(e) => {
              messageTextChange(e.target.defaultValue);
            }}
            defaultValue={text}
          />
        </div>
      </div>
    </div>
  );
}
