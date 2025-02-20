import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponetsStore } from '../../stores/components';

interface HoverMaskProps {
  containerClassName: string;
  componentId: number;
  portalWrapperClassName: string;
}

const HoverMask = ({ containerClassName, portalWrapperClassName, componentId }: HoverMaskProps) => {
  const { components } = useComponetsStore();

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  useEffect(() => {
    updatePosition();
  }, [components]);

  const updatePosition = () => {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, height, width } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    // label定位的方法： 
        // 高度是和高亮框一样，宽度是左边的距离加上高亮框的宽度
        // 最后用translate的100%是自身的宽高，正好会移动到高亮框的右上角
    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;

    // 处理边界page
    if(labelTop <= 0){
        labelTop -= -20
    }
    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  };

  // 会创建多个wrapper,直接挂载到某个元素上
//   const el = useMemo(() => {
//     const el = document.createElement('div');
//     el.className = 'wrapper';

//     const container = document.querySelector(`.${containerClassName}`);
//     container!.appendChild(el);
//     return el;
//   }, []);

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!
}, []);

  // createPortal 是 React 提供的一个 API，用于将子组件渲染到 DOM 树中的指定节点（通常是文档中的某个元素）。
  // 它的第一个参数是要渲染的 React 元素，第二个参数是目标 DOM 节点（el）。
  return createPortal((
    <>
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.05)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
          style={{
            position: "absolute",
            left: position.labelLeft,
            top: position.labelTop,
            fontSize: "14px",
            zIndex: 13,
            display: (!position.width || position.width < 10) ? "none" : "inline",
            transform: 'translate(-100%, -100%)',
          }}
        >
          <div
            style={{
              padding: '0 8px',
              backgroundColor: 'blue',
              borderRadius: 4,
              color: '#fff',
              cursor: "pointer",
              whiteSpace: 'nowrap',
            }}
          >
            {curComponent?.desc}
          </div>
        </div>
    </>
  ), el)
};

export default HoverMask;
