import { Button as AntdButton } from "antd";
import { CommonComponentProps } from "../../interface";

const ButtonProd = ({
  id,
  type,
  text,
  styles,
  ...props
}: CommonComponentProps) => {
  console.log(props, 111);
  return (
    <AntdButton type={type} style={styles} {...props}>
      {text}
    </AntdButton>
  );
};

export default ButtonProd;
