import { Collapse, Select, CollapseProps, Button } from "antd";
import {
  ComponentEvent as ComponentEventType,
  useComponentConfigStore,
} from "../../../stores/component-config";
import { useComponentsStore } from "../../../stores/components";
import { useState } from "react";
import { ActionModal } from "../ActionModal";
import { GoToLink } from "./Actions/GoToLink";
import { ShowMessage } from "./Actions/ShowMessages";

export function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEventType>();

  if (!curComponent) return null;

  function selectAction(eventName: string, value: string) {
    if (!curComponentId) return;

    updateComponentProps(curComponentId, { [eventName]: { type: value } });
  }

  const items: CollapseProps["items"] = (
    componentConfig[curComponent.name].events || []
  ).map((event) => {
    return {
      key: event.name,
      label: (
        <div className="flex justify-between leading-[30px]">
          {event.label}
          <Button
            type="primary"
            onClick={() => {
              setCurEvent(event);
              setActionModalOpen(true);
            }}
          >
            添加动作
          </Button>
        </div>
      ),
      children: (
        <div>
          <div className="flex items-center">
            <div>动作：</div>
            <Select
              className="w-[160px]"
              options={[
                { label: "显示提示", value: "showMessage" },
                { label: "跳转链接", value: "goToLink" },
              ]}
              onChange={(value) => {
                selectAction(event.name, value);
              }}
              value={curComponent?.props?.[event.name]?.type}
            />
          </div>
          {curComponent?.props?.[event.name]?.type === "goToLink" && (
            <GoToLink event={event} />
          )}
          {curComponent?.props?.[event.name]?.type === "showMessage" && (
            <ShowMessage event={event} />
          )}
        </div>
      ),
    };
  });

  return (
    <div className="px-[10px]">
      <Collapse className="mb-[10px]" items={items} />
      <ActionModal
        visible={actionModalOpen}
        eventConfig={curEvent!}
        handleOk={() => {
          setActionModalOpen(false);
        }}
        handleCancel={() => {
          setActionModalOpen(false);
        }}
      />
    </div>
  );
}
