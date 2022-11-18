import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Message from '../Message/Message';
import classes from './CurrentChat.module.scss';
import sendImg from './send.svg';
import { socket } from '../../socket';

export const CurrentChat = ({ chat }) => {
  const messagesRef = useRef(null);

  const [fieldValue, setFieldValue] = useState('');

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat]);

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
          hour: now.getHours(),
          minute: now.getMinutes(),
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
  );
};

CurrentChat.propTypes = {
  chat: PropTypes.shape({
    messages: PropTypes.arrayOf({
      message: PropTypes.shape({
        sender: PropTypes.shape({
          name: PropTypes.string,
        }),
        text: PropTypes.string,
      }),
    }),
    id: PropTypes.number,
  }),
};

CurrentChat.defaultProps = {
  chat: {
    messages: [],
    id: 0,
  },
};
