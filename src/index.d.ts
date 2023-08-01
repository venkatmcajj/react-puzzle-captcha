import React, { ReactNode } from 'react';

export interface IverifyProp {
  /**
   * @description   canvaswidth
   * @default       320
   */
  width?: number;
  /**
   * @description   canvasheight
   * @default       160
   */
  height?: number;
  /**
   * @description   slider side length
   * @default       42
   */
  l?: number;
  /**
   * @description   slider radius
   * @default       9
   */
  r?: number;
  /**
   * @description   Is it visible
   * @default       true
   */
  visible?: boolean;
  /**
   * @description   slider text
   * @default       Swipe right to fill the puzzle
   */
  text?: string | ReactNode;
  /**
   * @description   refresh button icon, It is the url address of the icon
   * @default       -
   */
  refreshIcon?: string;
  /**
   * @description   The url address used to get random pictures
   * @default       https://picsum.photos/${id}/${width}/${height}, specific reference https://picsum.photos/, Just implement a similar interface
   */
  imgUrl?: string;
  /**
   * @description   Verification successful callback
   * @default       ():void => {}
   */
  onSuccess?: VoidFunction;
  /**
   * @description   Validation failure callback
   * @default       ():void => {}
   */
  onFail?: VoidFunction;
  /**
   * @description   Callback on refresh
   * @default       ():void => {}
   */
  onRefresh?: VoidFunction;
}

declare const verify: React.FC<IverifyProp>;

export { verify };
