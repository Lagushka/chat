import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { CurrentChat } from '../../components/CurrentChat/CurrentChat';
import { socket, IPADDRESS, PORT } from '../../socket';
import classes from './Dialogues.module.scss';
import Header from '../../components/Header/Header';
import { DialogueCard } from '../../components/DialogueCard/DialogueCard';
import { NewChatForm } from '../../components/NewChatForm/NewChatForm';
import { List } from '../../containers/List/List';

export const Dialogues = () => {
  const [data, setData] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);

  const selectedChat = useParams().id;

  useEffect(() => {
    axios.get(`http://${IPADDRESS}:${PORT}`)
      .then((response) => {
        setData(response.data);
        console.log(localStorage.getItem('user'));
      }).catch((error) => {
        console.log(error);
      });

    socket.emit('user', JSON.parse(localStorage.getItem('user')));

    const newMessageHandler = ({ message, chatId }) => {
      setData((prevState) => {
        const dataToSort = [...prevState];
        const chatToPushIndex = dataToSort.findIndex((chat) => (chat.id === chatId));
        dataToSort[chatToPushIndex].lastMessage = { ...message };
        for (let i = chatToPushIndex; i > 0; i -= 1) {
          const buffer = dataToSort[i];
          dataToSort[i] = dataToSort[i - 1];
          dataToSort[i - 1] = buffer;
        }

        return dataToSort;
      });
    };

    socket.on('message', newMessageHandler);

    const newChatHandler = (newChat) => {
      setData((prevState) => (
        [...prevState, newChat]
      ));
    };

    socket.on('newChat', newChatHandler);

    const userInfoHandler = (newUser) => {
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log(newUser);
    };

    socket.on('userInfo', userInfoHandler);

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
          <List>
            {data.map((chat) => (
              <DialogueCard
                key={chat.id}
                name={chat.name}
                message={chat.lastMessage}
                chatId={chat.id}
              />
            ))}
          </List>
        </div>
        {
          selectedChat >= 0
            ? <CurrentChat chatId={selectedChat} />
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
