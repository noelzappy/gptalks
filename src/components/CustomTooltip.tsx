import React from 'react';
import { Tooltip, TooltipProps } from '@rneui/base';

const ControlledTooltip: React.FC<TooltipProps> = props => {
  return (
    <Tooltip
      //   visible={open}
      //   onOpen={() => {
      //     setOpen(true);
      //   }}
      //   onClose={() => {
      //     setOpen(false);
      //   }}
      {...props}
    />
  );
};

export default ControlledTooltip;
