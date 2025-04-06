import { useDrag } from "react-dnd";
import { useMaterailDrop } from "../../hooks/useMaterailDrop";
import { CommonComponentProps } from "../../interface";
import { useEffect, useRef } from "react";

const Container = ({ id, name, children, styles }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterailDrop(
    ["Button", "Container", "Table"],
    id
  );

  // 因为要同时给div绑定drag和drop，所以拿到ref之后再绑定
  const divRef = useRef<HTMLDivElement>(null);

  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      dragType: "move",
      id: id,
    },
  });

  useEffect(() => {
    drop(divRef);
    drag(divRef);
  }, []);

  return (
    <div
      data-component-id={id}
      ref={divRef}
      style={styles}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? "border-[2px] border-[blue]" : "border-[1px] border-[#000]"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
