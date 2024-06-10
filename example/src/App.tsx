import React, { useState } from 'react';
import './app.css';
import { Verify } from 'react-puzzle-captcha';
import 'react-puzzle-captcha/dist/react-puzzle-captcha.css';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  return (
    <div className="col-lg-6 mx-auto">
      <div className="d-flex my-2 justify-content-center">
        {!visible ? (
          <div onClick={show} className="btn btn-success">
            Show
          </div>
        ) : (
          <div onClick={hide} className="btn btn-danger">
            Hide
          </div>
        )}
      </div>
      <Verify
        width={320}
        height={160}
        visible={visible}
        onSuccess={() => {
          alert('success');
          hide();
        }}
        onFail={() => {
          alert('fail');
        }}
        onRefresh={() => {
          alert('refresh');
        }}
      />
    </div>
  );
}
