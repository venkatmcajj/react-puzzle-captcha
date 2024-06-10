import React, { ReactNode } from 'react';

export interface IverifyProp {
  width?: number;
  height?: number;
  l?: number;
  r?: number;
  visible?: boolean;
  text?: string | ReactNode;
  refreshIcon?: string;
  imgUrl?: string;
  onSuccess?: VoidFunction;
  onFail?: VoidFunction;
  onRefresh?: VoidFunction;
}

declare const Verify: React.FC<IverifyProp>;

export { Verify };
