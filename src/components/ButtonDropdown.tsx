import { Dropdown, MenuProps, Button, Space } from "antd";
import { FC, ReactNode } from "react";
import { DownOutlined } from "@ant-design/icons";
import ButtonDownArrow from "./Icons/ButtonDownArrow";

type BtnItem = {
  label: ReactNode;
  onClick?: () => void; // Changed onClick to a function
  key: string | number; // Changed to string | number as it supports string as well
};

type ButtonDropdownProps = {
  label: ReactNode;
  btnItem: BtnItem[];
  className: string;
  loading?: boolean;
  ButtonDownArrowIcon?: boolean;
};

const ButtonDropDown: FC<ButtonDropdownProps> = ({
  className,
  label,
  btnItem,
  loading = false,
  ButtonDownArrowIcon = true,
}) => {
  // Create menu items from btnItem prop
  const menuItems: MenuProps["items"] = btnItem.map((item) => ({
    key: item.key,
    label: <div onClick={item.onClick}>{item.label}</div>, // Use div to trigger onClick
  }));

  return (
    <Dropdown menu={{ items: menuItems }}>
      <Button loading={loading} className={className}>
        <Space>
          {label}
          {ButtonDownArrowIcon && <ButtonDownArrow />}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default ButtonDropDown;
