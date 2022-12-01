import React from 'react';
import classes from './Header.module.scss';

export default function Header() {
  return (
    <header className={classes.header}>
      <span className={classes.projectName}>Чатъ</span>
      <a href="/" className={classes.logOut}>
        <button type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
            viewBox="0 0 48 48"
            fill="white"
          >
            <path
              d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h14.55v3H9v30h14.55v3Zm24.3-9.25-2.15-2.15 5.1-5.1h-17.5v-3h17.4l-5.1-5.1 2.15-2.15 8.8 8.8Z"
            />
          </svg>
        </button>
      </a>
    </header>
  );
}
