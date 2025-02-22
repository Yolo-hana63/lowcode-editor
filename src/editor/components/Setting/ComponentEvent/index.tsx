import { Collapse, Select, CollapseProps } from "antd";
import { useComponentConfigStore } from "../../../stores/component-config";
import { useComponentsStore } from "../../../stores/components";
import { GoToLink } from "./Actions/GoToLink";
import { ShowMessage } from "./Actions/ShowMessages";

export function ComponentEvent() {
  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

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
      label: event.label,
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
    </div>
  );
}
