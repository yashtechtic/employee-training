import React, {useState} from "react";
import {Select} from "antd";
import type {ConfigProviderProps, SelectProps} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";

interface CustomSelectProps {
  options?: SelectProps["options"];
  defaultValue?: any;
  onChange?: (value: number) => void;
  size?: SizeType;
  className?: any;
  placeholder?: string;
  value?: any;
}

type SizeType = ConfigProviderProps["componentSize"];

const CommonSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultValue = "",
  onChange = (value) => console.log(`Selected: ${value}`),
  size = "middle",
  className,
  placeholder,
  value,
}) => {
  return (
    <Select
      size={size}
      defaultValue={defaultValue}
      onChange={onChange}
      style={{width: 200}}
      options={options}
      suffixIcon={<CaretDownOutlined />}
      rootClassName="custom-select-dropdown"
      className={className}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default CommonSelect;
