import React from 'react';
import classes from './Card.module.scss';

export const Card = ({ onClickFunction, children }) => (
  <button className={classes.card} type="button" onClick={onClickFunction}>
    {children}
  </button>
);
