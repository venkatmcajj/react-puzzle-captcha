[![npm downloads](https://img.shields.io/npm/dm/react-slider-verify.svg?style=flat-square)](http://npm-stat.com/charts.html?package=react-slider-verify) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-slider-verify) ![APM](https://img.shields.io/npm/l/react-slider-verify?style=flat-square)

## Hello react-slider-verify!

It is a sliding verification code component implemented by react.js, through which we can easily control the entire life cycle of verification (when refreshing, when the verification succeeds, and when the verification fails, the callback), and has certain configuration capabilities.

![demo.gif](https://raw.githubusercontent.com/venkatmcajj/react-slider-verify/master/docs/slider.gif)

## Getting Started

Install dependencies,

```bash
$ npm i react-slider-verify
```

## Use

```tsx
import React, { useState } from 'react';
import { verify } from 'react-slider-verify';

export default () => {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const style = {
    display: 'inline-block',
    marginRight: '20px',
    marginBottom: '20px',
    width: '100px',
    padding: '5px 20px',
    color: '#fff',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#1991FA',
  };
  return (
    <>
      <div onClick={show} style={style}>
        Show
      </div>
      <div onClick={hide} style={style}>
        Hide
      </div>
      <verify
        width={320}
        height={160}
        visible={visible}
        onSuccess={() => alert('success')}
        onFail={() => alert('fail')}
        onRefresh={() => alert('refresh')}
      />
    </>
  );
};
```

## More Production

| name                                                                                | Description                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [react-country-state-city](https://github.com/venkatmcajj/react-country-state-city) | React-country-state-city allows you to create a responsive country, state, city dropdown with search options. And also provide the option to create a language select dropdown to list all Languages. |
| [react-sidemenubar](https://github.com/venkatmcajj/react-sidemenubar)               | React-sidemenubar allows you to create a responsive sidebar with easy to customize.                                                                                                                   |
| [react-matrix-tree](https://github.com/venkatmcajj/react-matrix-tree)               | React-matrix-tree allows you to create tree view with different types of matrix.                                                                                                                      |

## Contribute

Show your ❤️ and support by giving a ⭐. Any suggestions are welcome! venkatmcajj@gmail.com

<!-- ## Financial Contributors

Become a financial contributor and help us sustain our community. [Contribute](https://opencollective.com/react-slider-verify) -->

## License

Licensed under MIT
