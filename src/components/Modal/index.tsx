import React, {
  ReactElement,
  MouseEvent,
  ReactChildren,
  ReactChild
} from "react";
import "./Modal.less";

interface ModalProps {
  children: ReactChildren | ReactChild;
  callback: (event: MouseEvent<HTMLButtonElement>) => void;
  modalWrapperCssClass: string;
  modalCssClass: string;
}

export default ({
  children,
  callback,
  modalWrapperCssClass,
  modalCssClass
}: ModalProps): ReactElement => (
  <div className={modalWrapperCssClass}>
    <section className={modalCssClass}>
      {children}
      <i
        className="fa fa-window-close-o fa-2x close-button"
        onClick={callback}
      />
    </section>
  </div>
);
