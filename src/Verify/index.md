### Basic use:

```tsx
import React from 'react';
import { Verify } from 'react-puzzle-captcha';

export default () => {
  return <Verify />;
};
```

### set width and height:

```tsx
import React from 'react';
import { Verify } from 'react-puzzle-captcha';

export default () => {
  return <Verify width={330} height={80} />;
};
```

### Set slider side length and radius:

```tsx
import React from 'react';
import { Verify } from 'react-puzzle-captcha';

export default () => {
  return <Verify width={320} height={160} l={28} r={5} />;
};
```

### Set success, failure, callback when refreshing:

```tsx
import React from 'react';
import { Verify } from 'react-puzzle-captcha';

export default () => {
  return (
    <Verify
      width={320}
      height={160}
      onSuccess={() => alert('success')}
      onFail={() => alert('fail')}
      onRefresh={() => alert('refresh')}
    />
  );
};
```

### User-Defined Validation Logic:

The component exposes `onCustomverify` method, and accepts `verify` object as input parameter, we can control `spliced` and `verified` attributes to control whether the verification is successful, that is, the return value of the function must contain `spliced` and `verified` two Boolean property object

```tsx
import React from 'react';
import { Verify } from 'react-puzzle-captcha';

export default () => {
  const handleCustomverify = (verify) => {
    console.log(verify, Math.abs(left - destX) < 5);
    const { destX, left, spliced, verified } = verify;
    return {
      spliced: Math.abs(left - destX) < 5,
      verified,
    };
  };
  return (
    <Verify
      width={320}
      height={160}
      onCustomverify={handleCustomverify}
      onSuccess={() => alert('success')}
      onFail={() => alert('fail')}
      onRefresh={() => alert('refresh')}
    />
  );
};
```

### Dynamically set show/hide:

```tsx
import React, { useState } from 'react';
import { Verify } from 'react-puzzle-captcha';

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
      <Verify
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

<API></API>
