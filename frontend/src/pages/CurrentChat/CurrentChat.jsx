import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import Header from '../../components/Header/Header';
import Message from '../../components/Message/Message';
import classes from './CurrentChat.module.scss';
import sendImg from './send.svg';

const IPADDRESS = 'http://192.168.1.79';
const PORT = '4001';

const socket = io(`${IPADDRESS}:${PORT}`);

export const CurrentChat = () => {
  function newMessage(newId, newText, newSender) {
    return {
      id: newId,
      text: newText,
      sender: newSender,
    };
  }

  const [messages, setMessages] = useState([]);

  const [userName, setUserName] = useState('');

  const messagesRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    axios.get(`${IPADDRESS}:${PORT}`)
      .then((response) => {
        setMessages([...response.data]);
      });

    const newMessageHandler = (message) => {
      setMessages((prevState) => ([...prevState, message]));
    };

    socket.on('message', newMessageHandler);

    setUserName(localStorage.getItem('username'));

    return () => socket.off('message', newMessageHandler);
  }, []);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const [fieldValue, setFieldValue] = useState('');

  const handleInput = (event) => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fieldValue) {
      socket.emit('message', newMessage(messages.length, fieldValue, userName));
      setFieldValue('');
    }
  };

  return (
    <div className={classes.currentChat}>
      <Header />
      <main className={classes.main}>
        <div className={classes.messages} ref={messagesRef}>
          {
            messages.map((message) => <Message key={message.id} message={message} />)
          }
        </div>
        <form className={classes.newMessageForm} onSubmit={handleSubmit}>
          <textarea name="text" className={classes.messageInput} placeholder="Write a message..." cols="30" rows="10" value={fieldValue} onChange={handleInput} />
          <input type="image" src={sendImg} alt="submit" width="35" className={classes.button} />
        </form>
      </main>
    </div>
  );
};
