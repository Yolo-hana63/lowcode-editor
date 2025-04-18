import { Modal, Segmented } from "antd";
import { useEffect, useState } from "react";
import { GoToLink, GoToLinkConfig } from "../Actions/GoToLink";
import { ShowMessage, ShowMessageConfig } from "../Actions/ShowMessages";
import CustomJS, { CustomJSConfig } from "../Actions/CustomJS";
import ComponentMethod, {
  ComponentMethodConfig,
} from "../Actions/ComponentMethod";

interface ActionModalProps {
  visible: boolean;
  action?: ActionConfig;
  handleOk: (config?: ActionConfig) => void;
  handleCancel: () => void;
}

export type ActionConfig =
  | GoToLinkConfig
  | ShowMessageConfig
  | CustomJSConfig
  | ComponentMethodConfig;

export function ActionModal(props: ActionModalProps) {
  const { visible, handleOk, handleCancel, action } = props;

  const map = {
    goToLink: "访问链接",
    showMessage: "消息提示",
    componentMethod: "组件方法",
    customJS: "自定义JS",
  };

  const [key, setKey] = useState<string>("访问链接");
  const [curConfig, setCurConfig] = useState<ActionConfig>();

  // 回显
  useEffect(() => {
    if (action?.type) {
      setKey(map[action.type]);
    }
  });

  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      okText="确认"
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
    >
      <div className="h-[500px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={["访问链接", "消息提示", "组件方法", "自定义 JS"]}
        />
        {key === "访问链接" && (
          <GoToLink
            key="goToLink"
            value={action?.type === "goToLink" ? action.url : ""}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "消息提示" && (
          <ShowMessage
            key="showMessage"
            value={action?.type === "showMessage" ? action.config : undefined}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "组件方法" && (
          <ComponentMethod
            key="componentMethod"
            value={
              action?.type === "componentMethod" ? action.config : undefined
            }
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "自定义 JS" && (
          <CustomJS
            key="customJS"
            value={action?.type === "customJS" ? action.code : ""}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
      </div>
    </Modal>
  );
}
