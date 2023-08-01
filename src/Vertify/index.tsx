import React, { useRef, useState, useEffect, ReactNode, memo } from 'react';
import { getRandomNumberByRange, sum, square } from './tool';
import './index.less';

interface VertifyType {
  spliced: boolean;
  verified: boolean; // Simply verify the drag trajectory, when it is zero, it means that there is no fluctuation up and down the Y axis, which may be non-human operation
  left: number; // Move position of the slider
  destX: number; // The target position of the slider
}

interface IVertifyProp {
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
   * @default       https://picsum.photos/${id}/${width}/${height}, specific referencehttps://picsum.photos/, Just implement a similar interface
   */
  imgUrl?: string;
  /**
   * @description   Callback when dragging the slider, The parameter is the dragging distance of the current slider
   * @default       (l: number):void => {}
   */
  onDraw?: (l: number) => {};
  /**
   * @description   User's custom validation logic
   * @default       (arg: VertifyType) => VertifyType
   */
  onCustomVertify?: (arg: VertifyType) => VertifyType;
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

export default memo(
  ({
    width = 320,
    height = 160,
    l = 42,
    r = 9,
    imgUrl,
    text,
    refreshIcon = 'https://raw.githubusercontent.com/venkatmcajj/react-slider-verify/master/docs/icon12.png',
    visible = true,
    onDraw,
    onCustomVertify,
    onSuccess,
    onFail,
    onRefresh,
  }: IVertifyProp) => {
    const [isLoading, setLoading] = useState(false);
    const [sliderLeft, setSliderLeft] = useState(0);
    const [sliderClass, setSliderClass] = useState('sliderContainer');
    const [textTip, setTextTip] = useState(text);
    const canvasRef = useRef<any>(null);
    const blockRef = useRef<any>(null);
    const imgRef = useRef<any>(null);
    const isMouseDownRef = useRef<boolean>(false);
    const trailRef = useRef<number[]>([]);
    const originXRef = useRef<number>(0);
    const originYRef = useRef<number>(0);
    const xRef = useRef<number>(0);
    const yRef = useRef<number>(0);
    const PI = Math.PI;
    const L = l + r * 2 + 3; // The actual side length of the slider

    const drawPath = (
      ctx: any,
      x: number,
      y: number,
      operation: 'fill' | 'clip',
    ) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
      ctx.lineTo(x + l, y);
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
      ctx.lineTo(x + l, y + l);
      ctx.lineTo(x, y + l);
      ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
      ctx.lineTo(x, y);
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.stroke();
      ctx.globalCompositeOperation = 'destination-over';
      operation === 'fill' ? ctx.fill() : ctx.clip();
    };

    const getRandomImgSrc = () => {
      return (
        imgUrl ||
        `https://picsum.photos/id/${getRandomNumberByRange(
          0,
          1084,
        )}/${width}/${height}`
      );
    };

    const createImg = (onload: VoidFunction) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = onload;
      img.onerror = () => {
        (img as any).setSrc(getRandomImgSrc()); // Reload other images when image loading fails
      };

      (img as any).setSrc = (src: string) => {
        const isIE = window.navigator.userAgent.indexOf('Trident') > -1;
        if (isIE) {
          // IE browser cannot cross domain through img.crossOrigin, use ajax to get image blob and then convert it to dataURL for display
          const xhr = new XMLHttpRequest();
          xhr.onloadend = function (e: any) {
            const file = new FileReader(); // FileReader only supports IE10+
            file.readAsDataURL(e.target.response);
            file.onloadend = function (e) {
              img.src = e?.target?.result as string;
            };
          };
          xhr.open('GET', src);
          xhr.responseType = 'blob';
          xhr.send();
        } else img.src = src;
      };

      (img as any).setSrc(getRandomImgSrc());
      return img;
    };

    const draw = (img: HTMLImageElement) => {
      const canvasCtx = canvasRef.current.getContext('2d');
      const blockCtx = blockRef.current.getContext('2d');
      // Create puzzle shapes at random positions
      xRef.current = getRandomNumberByRange(L + 10, width - (L + 10));
      yRef.current = getRandomNumberByRange(10 + r * 2, height - (L + 10));
      drawPath(canvasCtx, xRef.current, yRef.current, 'fill');
      drawPath(blockCtx, xRef.current, yRef.current, 'clip');

      // draw into picture
      canvasCtx.drawImage(img, 0, 0, width, height);
      blockCtx.drawImage(img, 0, 0, width, height);

      // Extract the slider and bring it to the far left
      const y1 = yRef.current - r * 2 - 1;
      const ImageData = blockCtx.getImageData(xRef.current - 3, y1, L, L);
      blockRef.current.width = L;
      blockCtx.putImageData(ImageData, 0, y1);
    };

    const initImg = () => {
      const img = createImg(() => {
        setLoading(false);
        draw(img);
      });
      imgRef.current = img;
    };

    const reset = () => {
      const canvasCtx = canvasRef.current.getContext('2d');
      const blockCtx = blockRef.current.getContext('2d');
      // reset style
      setSliderLeft(0);
      setSliderClass('sliderContainer');
      blockRef.current.width = width;
      blockRef.current.style.left = 0 + 'px';

      // clear canvas
      canvasCtx.clearRect(0, 0, width, height);
      blockCtx.clearRect(0, 0, width, height);

      // reload image
      setLoading(true);
      imgRef.current.setSrc(getRandomImgSrc());
    };

    const handleRefresh = () => {
      reset();
      typeof onRefresh === 'function' && onRefresh();
    };

    const verify = () => {
      const arr = trailRef.current; // The moving distance of the y-axis when dragging
      const average = arr.reduce(sum) / arr.length;
      const deviations = arr.map((x) => x - average);
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
      const left = parseInt(blockRef.current.style.left);
      return {
        spliced: Math.abs(left - xRef.current) < 10,
        verified: stddev !== 0, // Simply verify the drag trajectory, when it is zero, it means that there is no fluctuation up and down the Y axis, which may be non-human operation
        left,
        destX: xRef.current,
      };
    };

    const handleDragStart = function (e: any) {
      originXRef.current = e.clientX || e.touches[0].clientX;
      originYRef.current = e.clientY || e.touches[0].clientY;
      isMouseDownRef.current = true;
    };

    const handleDragMove = (e: any) => {
      if (!isMouseDownRef.current) return false;
      e.preventDefault();
      const eventX = e.clientX || e.touches[0].clientX;
      const eventY = e.clientY || e.touches[0].clientY;
      const moveX = eventX - originXRef.current;
      const moveY = eventY - originYRef.current;
      if (moveX < 0 || moveX + 38 >= width) return false;
      setSliderLeft(moveX);
      const blockLeft = ((width - 40 - 20) / (width - 40)) * moveX;
      blockRef.current.style.left = blockLeft + 'px';

      setSliderClass('sliderContainer sliderContainer_active');
      trailRef.current.push(moveY);
      onDraw && onDraw(blockLeft);
    };

    const handleDragEnd = (e: any) => {
      if (!isMouseDownRef.current) return false;
      isMouseDownRef.current = false;
      const eventX = e.clientX || e.changedTouches[0].clientX;
      if (eventX === originXRef.current) return false;
      setSliderClass('sliderContainer');
      const { spliced, verified } = onCustomVertify
        ? onCustomVertify(verify())
        : verify();
      if (spliced) {
        if (verified) {
          setSliderClass('sliderContainer sliderContainer_success');
          typeof onSuccess === 'function' && onSuccess();
        } else {
          setSliderClass('sliderContainer sliderContainer_fail');
          setTextTip('请再试一次');
          reset();
        }
      } else {
        setSliderClass('sliderContainer sliderContainer_fail');
        typeof onFail === 'function' && onFail();
        setTimeout(reset.bind(this), 1000);
      }
    };

    useEffect(() => {
      if (visible) {
        imgRef.current ? reset() : initImg();
      }
    }, [visible]);

    return (
      <div
        className="vertifyWrap"
        style={{
          width: width + 'px',
          margin: '0 auto',
          display: visible ? '' : 'none',
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="canvasArea">
          <canvas ref={canvasRef} width={width} height={height}></canvas>
          <canvas
            ref={blockRef}
            className="block"
            width={width}
            height={height}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          ></canvas>
        </div>
        <div
          className={sliderClass}
          style={{
            pointerEvents: isLoading ? 'none' : 'auto',
            width: width + 'px',
          }}
        >
          <div className="sliderMask" style={{ width: sliderLeft + 'px' }}>
            <div
              className="slider"
              style={{ left: sliderLeft + 'px' }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="sliderIcon">&rarr;</div>
            </div>
          </div>
          <div className="sliderText">{textTip}</div>
        </div>
        <div
          className="refreshIcon"
          onClick={handleRefresh}
          style={{ backgroundImage: `url(${refreshIcon})` }}
        ></div>
        <div
          className="loadingContainer"
          style={{
            width: width + 'px',
            height: height + 'px',
            display: isLoading ? '' : 'none',
          }}
        >
          <div className="loadingIcon"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  },
);
