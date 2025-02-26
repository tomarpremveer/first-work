import { Checkbox as AntdCheckbox, CheckboxProps } from "antd";

export default function Checkbox({
  onChange,
  checked,
  children,
  ...rest
}: CheckboxProps) {
  return (
    <AntdCheckbox checked={checked} onChange={onChange} {...rest}>
      {children}
    </AntdCheckbox>
  );
}
