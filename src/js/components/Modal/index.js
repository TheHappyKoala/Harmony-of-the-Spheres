import React from 'react';
import './Modal.less';

export default function(props) {
  return (
    <div className="modal-wrapper">
      <section className="modal">
        {props.children}
        <button onClick={props.callback} className="modal-close-button">
          X
        </button>
      </section>
    </div>
  );
}
