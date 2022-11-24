/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { ModalWindow } from '../../containers/ModalWindow/ModalWindow';
import { socket } from '../../socket';
import classes from './NewChatForm.module.scss';

export const NewChatForm = ({ setModalOpened }) => {
  let timeout;
  const [inputData, setInputData] = useState('');
  const [validated, setValidated] = useState(true);

  function inputChangesHandler(event) {
    if (event.target.value.length <= 30) {
      setInputData(event.target.value);
    } else {
      clearTimeout(timeout);
      setValidated(false);
      timeout = setTimeout(setValidated, 4000, true);
    }
  }

  function formSubmit(event) {
    event.preventDefault();
    if (inputData) {
      const newChat = {
        name: inputData,
      };
      socket.emit('newChat', newChat);
      setModalOpened(false);
    }
  }

  return (
    <ModalWindow setModalOpened={setModalOpened}>
      <form action="" className={classes.form} onSubmit={formSubmit}>
        <div className={classes.chatName}>
          <label htmlFor={classes.chatNameInput}>Название чата</label>
          <input type="text" id={classes.chatNameInput} value={inputData} onChange={inputChangesHandler} />
          {
            !validated && (
              <span className={classes.wrongInput}>
                Название чата не должно превышать 30 символов
              </span>
            )
          }
        </div>
        <input type="submit" className={classes.button} />
      </form>
    </ModalWindow>
  );
};
