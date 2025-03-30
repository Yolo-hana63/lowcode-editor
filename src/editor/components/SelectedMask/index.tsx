import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { getComponentById, useComponentsStore } from "../../stores/components";
import { Dropdown, Popconfirm, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useResizeObserver } from "../../hooks/useResizeObserver";

interface SelectedMaskProps {
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
}

function SelectedMask({
  containerClassName,
  portalWrapperClassName,
  componentId,
}: SelectedMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  const { components, curComponentId, deleteComponent, setCurComponentId } =
    useComponentsStore();

  const updatePosition = useCallback(() => {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }, [componentId, containerClassName]);

  // 监听容器大小变化
  const containerObserverRef = useResizeObserver(() => {
    updatePosition();
  });

  // 监听组件大小变化
  const componentObserverRef = useResizeObserver(() => {
    updatePosition();
  });

  // 初始化时更新位置
  useEffect(() => {
    updatePosition();
  }, [componentId, components]);

  // 设置观察者
  useEffect(() => {
    const container = document.querySelector(`.${containerClassName}`);
    const component = document.querySelector(
      `[data-component-id="${componentId}"]`
    );

    if (container) {
      containerObserverRef(container);
    }

    if (component) {
      componentObserverRef(component);
    }
  }, [containerClassName, componentId]);

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!;
  }, [portalWrapperClassName]);

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId, components]);

  function handleDelete() {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  }

  const parentComponents = useMemo(() => {
    const parentComponents = [];
    let component = curComponent;

    while (component?.parentId) {
      component = getComponentById(component.parentId, components);
      parentComponents.push(component);
    }

    return parentComponents;
  }, [components, curComponent]);

  return createPortal(
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: "14px",
          zIndex: 13,
          display: !position.width || position.width < 10 ? "none" : "inline",
          transform: "translate(-100%, -100%)",
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((item) => ({
                key: item?.id,
                label: item?.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key);
              },
            }}
          >
            <div
              style={{
                padding: "0 8px",
                backgroundColor: "blue",
                borderRadius: 4,
                color: "#fff",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {curComponent?.desc}
            </div>
          </Dropdown>
          {curComponentId !== 1 && (
            <div style={{ padding: "0 8px", backgroundColor: "blue" }}>
              <Popconfirm
                title="确认删除？"
                okText={"确认"}
                cancelText={"取消"}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: "#fff" }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el
  );
}

export default SelectedMask;
