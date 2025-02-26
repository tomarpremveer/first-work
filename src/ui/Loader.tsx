import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loader() {
  return <Spin indicator={<LoadingOutlined spin />} size="small" />;
}
