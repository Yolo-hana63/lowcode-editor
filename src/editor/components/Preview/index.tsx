import React, { useRef } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/ComponentEvent/ActionModal";

export function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const componentRefs = useRef<Record<string, any>>({});

  const EventsMap = {
    showMessage: (action) => {
      if (action.config.type === "success") {
        message.success(action.config.text);
      } else if (action.config.type === "error") {
        message.error(action.config.text);
      }
    },
    goToLink: (action) => {
      window.location.href = action.url;
    },
    customJS: (action, component, ...args) => {
      const func = new Function("context", "args", action.code);
      func(
        {
          name: component.name,
          props: component.props,
          showMessage(content: string) {
            message.success(content);
          },
        },
        args
      );
    },
    componentMethod: (action, ...args) => {
      const component = componentRefs.current[action.config.componentId];
      if (component) {
        component[action.config.method]?.(...args);
      }
    },
  };

  function handleEvent(component: Component) {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];

      if (eventConfig) {
        props[event.name] = (...args: any[]) => {
          eventConfig?.actions?.forEach((action: ActionConfig) => {
            EventsMap[action.type](action, component, args);
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
          ref: (ref: Record<string, any>) => {
            componentRefs.current[component.id] = ref;
          },
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }

  return (
    <div>
      <div>{renderComponents(components)}</div>
    </div>
  );
}
