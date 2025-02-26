import { Select as AntdSelect, SelectProps } from "antd";

export default function Select({ onChange, value, ...rest }: SelectProps) {
  return (
    <AntdSelect
      onChange={onChange}
      value={value}
      {...rest}
      fieldNames={{ label: "label", value: "id" }}
    />
  );
}

export { SelectProps };
