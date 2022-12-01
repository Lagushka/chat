import React from 'react';
import classes from './Card.module.scss';

export const Card = ({ link, children, onClickFunction }) => (
  <a href={link} className={classes.card} type="button" onClick={onClickFunction}>
    {children}
  </a>
);
