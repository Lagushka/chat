/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../containers/Card/Card';

import classes from './DialogueCard.module.scss';

export const DialogueCard = ({ name, message, chatId }) => {
  const navigate = useNavigate();

  return (
    <Card onClickFunction={() => {
      navigate(`/dialogues/${chatId}`);
    }}
    >
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
};
