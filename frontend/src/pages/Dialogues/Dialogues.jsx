import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { CurrentChat } from '../../components/CurrentChat/CurrentChat';
import { socket, IPADDRESS, PORT } from '../../socket';
import classes from './Dialogues.module.scss';
import Header from '../../components/Header/Header';
import { DialogueCard } from '../../components/DialogueCard/DialogueCard';
import { NewChatForm } from '../../components/NewChatForm/NewChatForm';
import { List } from '../../containers/List/List';

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

    const currentUser = JSON.parse(localStorage.getItem('user'));

    socket.emit('user', currentUser);

    const newMessageHandler = ({ message, chatId }) => {
      setData((prevState) => {
        const dataToSort = [...prevState];
        const chatToPushIndex = dataToSort.findIndex((chat) => (chat.id === chatId));
        dataToSort[chatToPushIndex].messages = dataToSort[chatToPushIndex].messages.concat([message]);
        console.log(chatToPushIndex);
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

    const newUserHandler = (newUser) => {
      console.log('someone new here');
      setData((prevState) => (
        prevState.map((chat) => (
          {
            ...chat,
            users: chat.users.concat([newUser]),
          }
        ))
      ));
    };

    socket.on('newUser', newUserHandler);

    const userOnlineHandler = ({ requiredUser, online }) => {
      setData((prevState) => (
        prevState.map((chat) => (
          {
            ...chat,
            users: chat.users.map((user) => (
              user.name === requiredUser.name ? { ...user, online } : { ...user }
            )),
          }
        ))
      ));
    };

    socket.on('userStatusChange', userOnlineHandler);

    return () => {
      socket.off('message', newMessageHandler);
      socket.off('newChat', newChatHandler);
      socket.off('newUser', newUserHandler);
      socket.off('userOnline', userOnlineHandler);
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
                message={chat.messages.length > 0 && chat.messages[chat.messages.length - 1]}
                setSelectedChat={() => {
                  setSelectedChat(chat.id);
                }}
              />
            ))}
          </List>
        </div>
        {
          selectedChat >= 0
            ? <CurrentChat chat={data.find((chat) => (selectedChat === chat.id))} />
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
