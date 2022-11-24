import React, { useEffect, useState, useRef } from 'react';

import Message from '../Message/Message';
import classes from './CurrentChat.module.scss';
import sendImg from './send.svg';
import { socket } from '../../socket';
import { List } from '../../containers/List/List';
import { Card } from '../../containers/Card/Card';

export const CurrentChat = ({ chat }) => {
  const messagesRef = useRef(null);

  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat]);

  useEffect(() => {
    console.log(chat.users);
  }, [chat.users]);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (fieldValue) {
      const now = new Date();
      const period = {
        date: {
          year: now.getFullYear(),
          month: now.getMonth(),
          day: now.getDate(),
        },
        time: {
          hour: `${now.getHours()}`.length === 1 ? `0${now.getHours()}` : now.getHours(),
          minute: `${now.getMinutes()}`.length === 1 ? `0${now.getMinutes()}` : now.getMinutes(),
          second: now.getSeconds(),
        },
      };
      socket.emit('message', {
        message: {
          id: chat.messages.length,
          text: fieldValue,
          sender: user,
          period,
        },
        chatId: chat.id,
      });
      setFieldValue('');
    }
  };

  const handleInput = (event) => {
    setFieldValue(event.target.value);
  };

  const handleKeyboardSubmit = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={classes.currentChat}>
      <div className={classes.messaging}>
        <div className={classes.messages} ref={messagesRef}>
          {
            chat.messages.map((message) => <Message key={message.id} message={message} />)
          }
        </div>
        <form className={classes.newMessageForm} onSubmit={handleSubmit}>
          <textarea
            name="text"
            className={classes.messageInput}
            placeholder="Write a message..."
            cols="30"
            rows="10"
            value={fieldValue}
            onChange={handleInput}
            onKeyDown={handleKeyboardSubmit}
          />
          <input type="image" src={sendImg} alt="submit" width="35" className={classes.button} />
        </form>
      </div>
      <div className={classes.usersList}>
        <div className={classes.listHeader}>
          <span className={classes.heading}>
            Пользователи
          </span>
        </div>
        <List>
          {
            chat.users.map((usersElement) => (
              <Card key={usersElement.name}>
                <span>{usersElement.name}</span>
                <span>{usersElement.online ? 'online' : 'offline'}</span>
              </Card>
            ))
          }
        </List>
      </div>
    </div>
  );
};
