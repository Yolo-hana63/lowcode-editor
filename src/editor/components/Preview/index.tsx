import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components";
import { message } from "antd";
import { GoToLinkConfig } from "../Setting/ComponentEvent/Actions/GoToLink";
import { ShowMessageConfig } from "../Setting/ComponentEvent/Actions/ShowMessages";
import { ActionConfig } from "../Setting/ComponentEvent/ActionModal";

// 维护集合
// const EventsMap = {
//   showMessage: (action) => {
//     if (action.config.type === "success") {
//       message.success(action.config.text);
//     } else if (action.config.type === "error") {
//       message.error(action.config.text);
//     }
//   },
//   goToLink: (action) => {
//     window.location.href = action.url;
//   },
// };

// type EventsMapType = GoToLinkConfig | ShowMessageConfig;

export function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  function handleEvent(component: Component) {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];

      if (eventConfig) {
        props[event.name] = () => {
          eventConfig?.actions?.forEach((action: ActionConfig) => {
            if (action.type === "goToLink") {
              window.location.href = action.url;
            } else if (action.type === "showMessage") {
              if (action.config.type === "success") {
                message.success(action.config.text);
              } else if (action.config.type === "error") {
                message.error(action.config.text);
              }
            } else if (action.type === "customJS") {
              const func = new Function(action.code);
              func();
            }
          });
        };
      }
    });
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
