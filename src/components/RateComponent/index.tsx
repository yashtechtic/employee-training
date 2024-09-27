// components/RateComponent.tsx
import React from 'react';
import { Flex, Rate } from 'antd';

const desc = ['not rated', 'bad', 'normal', 'good', 'wonderful'];

type RateComponentProps = {
  value: number | any;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

const RateComponent: React.FC<RateComponentProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div>
      <Rate tooltips={desc} onChange={onChange} value={value} disabled={disabled}
      />
    </div>
  );
};

export default RateComponent;
