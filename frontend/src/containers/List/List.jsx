import React from 'react';
import classes from './List.module.scss';

export const List = ({ children }) => (
  <div className={classes.list}>
    {children}
  </div>
);
