/* eslint-disable react/prop-types */
import React from 'react';
import { Card } from '../../containers/Card/Card';

import classes from './DialogueCard.module.scss';

export const DialogueCard = ({ name, message, setSelectedChat }) => (
  <Card onClickFunction={setSelectedChat}>
    <div className={classes.chatInfo}>
      <span className={classes.chatName}>{name}</span>
      { message && <span className={classes.time}>{`${message.period.time.hour}:${message.period.time.minute}`}</span> }
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
  </Card>
);
