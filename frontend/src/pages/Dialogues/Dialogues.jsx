import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CurrentChat } from '../../components/CurrentChat/CurrentChat';
import { socket, IPADDRESS, PORT } from '../../socket';
import classes from './Dialogues.module.scss';
import Header from '../../components/Header/Header';
import { DialogueCard } from '../../components/DialogueCard/DialogueCard';

export const Dialogues = () => {
  const [data, setData] = useState([]);
  const [selectedChat, setSelectedChat] = useState();

  useEffect(() => {
    axios.get(`http://${IPADDRESS}:${PORT}`)
      .then((response) => {
        setData([...response.data]);
      }).catch((error) => {
        console.log(error);
      });

    const newMessageHandler = (messageInfo) => {
      setData((prevState) => (
        prevState.map((chat, index) => (
          index === messageInfo.chatId
            ? {
              ...chat,
              messages: chat.messages
                ? [...chat.messages, messageInfo.message] : [messageInfo.message],
            }
            : chat
        ))
      ));
    };

    socket.on('message', newMessageHandler);

    return () => socket.off('message', newMessageHandler);
  }, []);

  return (
    <div className={classes.dialogues}>
      <Header />
      <div className={classes.chats}>
        <div className={classes.chatList}>
          <div className={classes.listHeader}>
            <span className={classes.heading}>Список чатов</span>
          </div>
          <div className={classes.list}>
            {data.map((chat) => (
              <DialogueCard
                key={chat.id}
                name={chat.name ? chat.name : 'Chat'}
                message={chat.messages.length > 0 && chat.messages[chat.messages.length - 1]}
                setSelectedChat={() => setSelectedChat}
              />
            ))}
          </div>
        </div>
        {
          selectedChat
            ? <CurrentChat chat={data[selectedChat]} />
            : (
              <div>
                <span>No Chats</span>
              </div>
            )
        }
      </div>
    </div>
  );
};
