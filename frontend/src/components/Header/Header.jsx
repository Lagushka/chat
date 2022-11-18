import React from 'react';
import classes from './Header.module.scss';

export default function Header() {
  return (
    <header className={classes.header}>
      <span className={classes.projectName}>Чатъ</span>
    </header>
  );
}
