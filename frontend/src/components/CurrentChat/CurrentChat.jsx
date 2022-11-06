import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import Message from '../Message/Message';
import classes from './CurrentChat.module.scss';

const IPADDRESS = 'http://172.21.133.22';
const PORT = '4001';

const socket = io(`${IPADDRESS}:${PORT}`);

export default function CurrentChat() {
  function newMessage(newId, newText, newSender) {
    return {
      id: newId,
      text: newText,
      sender: newSender,
    };
  }

  const [messages, setMessages] = useState([]);

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
      console.log(message);
      setMessages((prevState) => ([...prevState, message]));
    };

    socket.on('message', newMessageHandler);

    return () => socket.off('message', newMessageHandler);
  }, []);

  const [fieldValue, setFieldValue] = useState('');

  const handleInput = (event) => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fieldValue) {
      socket.emit('message', newMessage(messages.length, fieldValue, 'Lagushka'));
      setFieldValue('');
    }
  };

  return (
    <div className={classes.currentChat}>
      <div className={classes.messages}>
        {
          messages.map((message) => <Message key={message.id} message={message} />)
        }
      </div>
      <form className={classes.newMessageForm} onSubmit={handleSubmit}>
        <textarea name="text" id="text" cols="30" rows="10" value={fieldValue} onChange={handleInput} />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}
