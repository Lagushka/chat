/* eslint-disable react/prop-types */
import React from 'react';

import classes from './DialogueCard.module.scss';

export const DialogueCard = ({ name, message }) => (
  <div className={classes.card}>
    <div className={classes.chatInfo}>
      <span className={classes.chatName}>{name}</span>
      <span className={classes.time}>{`${message.period.time.hour}:${message.period.time.minute}`}</span>
    </div>
    {
      message
        ? (
          <div className={classes.lastMessage}>
            <span className={classes.sender}>{`${message.sender.name}:`}</span>
            <span className={classes.text}>{message.text}</span>
          </div>
        )
        : <span>No messages</span>
    }
  </div>
);
