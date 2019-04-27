import React, { ReactElement, ReactChildren } from 'react';
import './Modal.less';

interface ModalProps {
  children: ReactChildren;
  callback: Function;
}

export default ({ children, callback }: ModalProps): ReactElement => (
  <div className="modal-wrapper">
    <section className="modal">
      {children}
      <button onClick={() => callback()} className="modal-close-button">
        X
      </button>
    </section>
  </div>
);
