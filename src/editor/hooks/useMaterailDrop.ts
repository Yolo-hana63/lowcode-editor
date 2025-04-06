import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponentsStore } from "../stores/components";

export interface ItemType {
  type: string;
  dragType?: "move" | "add";
  id: number;
}

export function useMaterailDrop(accept: string[], id: number) {
  const { addComponent, components, deleteComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: ItemType, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      // 区分新增还是移动
      if (item.dragType === "move") {
        const component = getComponentById(item.id, components)!;

        deleteComponent(item.id);
        addComponent(component, id);
      } else {
        const config = componentConfig[item.type];

        addComponent(
          {
            id: new Date().getTime(),
            name: item.type,
            desc: config.desc,
            props: config.defaultProps,
            styles: {},
          },
          id
        );
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop };
}
