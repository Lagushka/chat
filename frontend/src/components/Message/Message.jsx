import React from 'react';
import classes from './Message.module.scss';

export default function Message({ message }) {
  return (
    <div className={classes.message}>
      <span className={classes.sender}>{message.sender.name}</span>
      <span className={classes.time}>{`${message.period.time.hour}:${message.period.time.minute}`}</span>
      <span className={classes.text}>{message.text}</span>
    </div>
  );
}
