import { Button as AntdButton, ButtonProps } from "antd";

export default function Button({ onClick, children, ...rest }: ButtonProps) {
  return (
    <AntdButton onClick={onClick} {...rest}>
      {children}
    </AntdButton>
  );
}

export { ButtonProps };
