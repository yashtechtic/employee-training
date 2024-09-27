import { Typography } from "antd";
import { Field, useField } from "formik";
import { useState } from "react";

interface CustomInputProps {
  label?: string;
  type: string;
  name: string;
  as: React.ElementType;
  className?: string;
  size: string | "large";
  placeholder: string | "Enter Value";
  error?: string | JSX.Element;
  suffix?: string | JSX.Element;
  prefix?: string | JSX.Element;
  rows?: number;
  maxInput?: number;
  minInput?: number;
  disabled?: boolean;
  defaultValue?: any;
  readOnly?: boolean;
  onInputChange?: (fieldName: string, value: any) => void;
  status?: string;
  required?: boolean;
  iconRender?: (visible: boolean) => JSX.Element;
  showCount?: boolean;
  pattern?: string | any;
  autoSize?: any;
  labelClass?: string;
  style?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type,
  name,
  as,
  className,
  size,
  placeholder,
  error,
  suffix,
  prefix,
  rows,
  maxInput = 30,
  disabled,
  defaultValue,
  minInput = 0,
  readOnly = false,
  style,
  status,
  autoSize,
  showCount = false,
  onInputChange,
  required = false,
  iconRender,
  pattern,
  labelClass,
}) => {
  const { Text } = Typography;
  const [isInputFocused, setInputFocused] = useState(false);
  const [field, meta, helpers] = useField({ name, type });
  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    // If the input has a value or default value, keep the label visible
    if (e.target.value) {
      setInputFocused(true);
    } else {
      setInputFocused(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<any>) => {
    // Call Formik's onChange
    field.onChange(e);

    // Call additional callback to capture the change
    if (onInputChange) {
      onInputChange(name, e.target.value);
    }
  };
  return (
    <div className="relative w-full">
      {/* {(isInputFocused || defaultValue) && ( */}
      {label && (
        <div
          className={`${labelClass} text-[#828282] text-[14px] leading-[22px] `}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      {/* )} */}
      <Field
        type={type}
        name={name}
        {...(status === "error" ? { status: "error" } : {})}
        iconRender={iconRender}
        as={as}
        className={`custom-input mt-[5px] border border-solid bg-[#FFF] border-[#828282] rounded-[4px] 
        ${
          isInputFocused
            ? "border-blue-500"
            : "border-solid bg-[#FFF] border-[#828282] border-opacity-30"
        }
        ${className}`}
        size={size}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        suffix={suffix}
        prefix={prefix}
        rows={rows}
        maxLength={maxInput}
        disabled={disabled}
        mininput={minInput}
        readOnly={readOnly}
        onChange={handleChange}
        pattern={pattern}
        autoSize={autoSize}
        style={style}
        showCount={showCount}
      />
      {error && (
        <Text type="danger" className="flex text-left">
          {error}
        </Text>
      )}
    </div>
  );
};

export default CustomInput;
