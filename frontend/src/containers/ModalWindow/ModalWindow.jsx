import React from 'react';

import classes from './ModalWindow.module.scss';

export const ModalWindow = ({ setModalOpened, children }) => {
  window.onkeydown = (event) => {
    if (event.key === 'Escape') {
      setModalOpened(false);
    }
  };

  return (
    <div className={classes.modalWindow}>
      {children}
    </div>
  );
};
