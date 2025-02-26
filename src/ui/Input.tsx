import { Input as AntdInput, InputProps } from "antd";

export default function Input({ type, value, onChange, ...rest }: InputProps) {
  return <AntdInput type={type} value={value} onChange={onChange} {...rest} />;
}
