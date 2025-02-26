import { InputNumber, InputNumberProps } from "antd";

export default function Number({
  type,
  value,
  onChange,
  ...rest
}: InputNumberProps) {
  return <InputNumber value={value} onChange={onChange} {...rest} />;
}
