import React, {
  ReactElement,
  MouseEvent,
  ReactChildren,
  ReactChild
} from 'react';
import './Modal.less';

interface ModalProps {
  children: ReactChildren | ReactChild;
  callback: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default ({ children, callback }: ModalProps): ReactElement => (
  <div className="modal-wrapper">
    <section className="modal">
      {children}
      <i
        className="fa fa-window-close-o fa-2x close-button"
        onClick={callback}
      />
    </section>
  </div>
);
