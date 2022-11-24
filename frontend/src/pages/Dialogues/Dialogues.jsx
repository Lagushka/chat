import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CurrentChat } from '../../components/CurrentChat/CurrentChat';
import { socket, IPADDRESS, PORT } from '../../socket';
import classes from './Dialogues.module.scss';
import Header from '../../components/Header/Header';
import { DialogueCard } from '../../components/DialogueCard/DialogueCard';
import { NewChatForm } from '../../components/NewChatForm/NewChatForm';

export const Dialogues = () => {
  const [data, setData] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [modalOpened, setModalOpened] = useState(false);

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

    function newChatHandler(newChat) {
      setData((prevState) => (
        [...prevState, newChat]
      ));
    }

    socket.on('newChat', newChatHandler);

    return () => {
      socket.off('message', newMessageHandler);
      socket.off('newChat', newChatHandler);
    };
  }, []);

  return (
    <div className={classes.dialogues}>
      <Header />
      <div className={classes.chats}>
        <div className={classes.chatList}>
          <div className={classes.listHeader}>
            <span className={classes.heading}>Список чатов</span>
            <button type="button" className={classes.createChat} onClick={() => setModalOpened(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#66B3D3" viewBox="0 0 48 48" width="30">
                <path d="M21.65 38.85v-12.5H9.15v-4.7h12.5V9.15h4.7v12.5h12.5v4.7h-12.5v12.5Z" />
              </svg>
            </button>
          </div>
          <div className={classes.list}>
            {data.map((chat) => (
              <DialogueCard
                key={chat.id}
                name={chat.name}
                message={chat.messages.length > 0 && chat.messages[chat.messages.length - 1]}
                setSelectedChat={() => {
                  setSelectedChat(chat.id);
                }}
              />
            ))}
          </div>
        </div>
        {
          selectedChat >= 0
            ? <CurrentChat chat={data[selectedChat]} />
            : (
              <div className={classes.noChats}>
                <span>Ты еще не открывал чаты</span>
              </div>
            )
        }
      </div>
      {
        modalOpened && <NewChatForm setModalOpened={setModalOpened} />
      }
    </div>
  );
};
