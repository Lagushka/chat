import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import axios from 'axios';

import Message from '../Message/Message';
import classes from './CurrentChat.module.scss';
import sendImg from './send.svg';
import { IPADDRESS, PORT, socket } from '../../socket';
import { List } from '../../containers/List/List';
import { Card } from '../../containers/Card/Card';

export const CurrentChat = ({ chatId }) => {
  const messagesRef = useRef(null);

  const [fieldValue, setFieldValue] = useState('');

  const [chat, setChat] = useState({});

  useEffect(() => {
    const newMessageHandler = ({ message }) => {
      setChat((prevState) => (
        {
          ...prevState,
          messages: [...prevState.messages, message],
        }
      ));
    };

    socket.on('message', newMessageHandler);

    const newUserHandler = (newUser) => {
      setChat((prevState) => (
        {
          ...prevState,
          users: prevState.users.concat([newUser]),
        }
      ));
    };

    socket.on('newUser', newUserHandler);

    const userOnlineHandler = ({ requiredUser, online }) => {
      setChat((prevState) => (
        {
          ...prevState,
          users: prevState.users.map((user) => (
            user.name === requiredUser.name ? { ...user, online } : { ...user }
          )),
        }
      ));
    };

    socket.on('userStatusChange', userOnlineHandler);

    return () => {
      socket.off('message', newMessageHandler);
      socket.off('newUser', newUserHandler);
      socket.off('userStatusChange', userOnlineHandler);
    };
  }, []);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat.messages]);

  useEffect(() => {
    axios.get(`http://${IPADDRESS}:${PORT}/${chatId}`)
      .then((response) => {
        setChat({ ...response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [chatId]);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (fieldValue) {
      for (let i = 0; i < Math.floor(fieldValue.length / 1000) + 1; i += 1) {
        const now = new Date();
        const period = {
          whole: now,
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
        const newMessage = {
          message: {
            sender: user,
            period,
          },
          chatId: chat.id,
        };
        newMessage.message.text = fieldValue.slice(i * 1000, i * 1000 + 1000 < fieldValue.length
          ? i * 1000 + 1000 : fieldValue.length);
        socket.emit('message', newMessage);
      }
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
            chat.messages
              ? chat.messages.map((message, index) => (
                <div className={classes.message} key={message.id}>
                  <div className={classes.imgWrapper}>
                    {
                      (index === chat.messages.length - 1 || chat.messages[index + 1].sender.id !== chat.messages[index].sender.id)
                      && <img className={classes.avatar} src={message.sender.img} alt="" width="40" height="40" />
                    }
                  </div>
                  <Message message={message} />
                </div>
              ))
              : <span>Here are no messages yet</span>
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
            chat.users && chat.users.map((usersElement) => (
              <Card key={usersElement.name}>
                <div className={classes.theOnlyRow}>
                  <div className={classes.imgWrapper}>
                    <img className={classes.avatar} src={usersElement.img} alt="" width="40" height="40" />
                  </div>
                  <span className={classes.name}>{usersElement.name}</span>
                  <span
                    className={classNames(classes.status, {
                      [classes.online]: usersElement.online,
                      [classes.offline]: !usersElement.online,
                    })}
                  >
                    {usersElement.online ? 'онлайн' : 'вышел'}
                  </span>
                </div>
              </Card>
            ))
          }
        </List>
      </div>
    </div>
  );
};
