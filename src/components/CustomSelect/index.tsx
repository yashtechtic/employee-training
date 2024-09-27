import React, { useState } from 'react';
import { Typography, Select, Image } from 'antd';
import { Field } from 'formik';
import CustomDropdownIcon from '../Icons/CustomDropdownIcon';

interface CustomSelectProps {
  label?: string;
  id?: string;
  name: string;
  placeholder?: string;
  selectLabel?: boolean;
  mode?: string;
  error?: string | JSX.Element;
  options?: Array<{value: string | boolean | any; label: string}>;
  onSelect?: (value: string) => void;
  defaultValue?: any;
  className?: string;
  filterOption?: (
    input: string,
    option: {
      children: any;
      label: string;
    }
  ) => boolean;
  onClick?: any;
  onDeselect?: any;
  required?: boolean;
  onInputKeyDown?: any;
  size?: "large" | "middle" | "small";
  disabled?: boolean;
  labelClass?: string;
}
const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  error,
  options,
  onSelect,
  id,
  placeholder,
  defaultValue,
  className,
  mode,
  selectLabel = true,
  onClick,
  onDeselect,
  required = false,
  onInputKeyDown,
  size = "large",
  disabled = false,labelClass
}) => {
  const {Text} = Typography;
  const [isInputFocused, setInputFocused] = useState(false);

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    // If the input has a value or default value, keep the label visible
    if (e.target.value) {
      setInputFocused(true);
    }
  };
  const isGrouped = options?.some((option: any) => option.options);
  return (
    <div className="relative w-full">
      {/* {label&& ((isInputFocused || defaultValue || defaultValue != 0) && ( */}
      <div
        className={`${labelClass} ${ 
          (isInputFocused || defaultValue || defaultValue != 0) &&
          "custom-input"
        } text-[#000] text-[14px] leading-[22px]`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </div>
      {/* ))} */}
      <Field name={name}>
        {({field, form}: {field: any; form: any}) => (
          <Select
            mode={mode}
            {...field}
            rootClassName="custom-select-dropdown selected-data"
            showSearch
            id={id}
            size={size}
            className={`  ${className} mt-[5px] !h-[40px]`}
            optionFilterProp="children"
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // options={options}
            onChange={(value) => {
              form.setFieldValue(name, value);
              if (onSelect) {
                onSelect(value); // Call the onSelect callback
              }
            }}
            defaultValue={defaultValue === 0 ? "" : defaultValue}
            value={defaultValue === 0 ? "" : defaultValue}
            onClick={onClick}
            onDeselect={onDeselect}
            onInputKeyDown={onInputKeyDown}
            suffixIcon={<CustomDropdownIcon />}
            disabled={disabled}
          >
            {selectLabel && (
              <Select.Option value={""}>
                {" "}
                {`Please ${placeholder ?? label}`}
              </Select.Option>
            )}
            {isGrouped
              ? options?.map((group: any, groupIndex: number) => (
                  <Select.OptGroup key={groupIndex} label={group.label}>
                    {group.options?.map((option: any, index: number) => (
                      <Select.Option
                        className="space-x-3 flex items-center"
                        key={index}
                        value={option.value}
                      >
                        {option.image && (
                          <Image
                            src={option.image}
                            alt={option.label as string}
                            height={20}
                          />
                        )}
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))
              : options?.map((i: any, index: number) => (
                  <Select.Option
                    className="space-x-3 flex items-center"
                    key={index}
                    value={i.value}
                  >
                    {i.image && (
                      <Image src={i.image} alt={i.label} height={20} />
                    )}{" "}
                    {i.label}
                  </Select.Option>
                ))}
          </Select>
        )}
      </Field>

      <Text type="danger" className="flex text-left">
        {error}
      </Text>
    </div>
  );
};

export default CustomSelect;
