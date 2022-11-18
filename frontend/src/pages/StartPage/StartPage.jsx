import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './StartPage.module.scss';
import { socket } from '../../socket';

export const StartPage = () => {
  const [fieldValue, setFieldValue] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFieldValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fieldValue) {
      const user = {
        name: fieldValue,
      };
      localStorage.setItem('user', JSON.stringify(user));
      socket.emit('user', user);
      navigate('/chat/dialogues');
    }
  };

  return (
    <div className={classes.startPage}>
      <div className={classes.nameWindow}>
        <form action="" onSubmit={handleSubmit} className={classes.usernameForm}>
          <h1 className={classes.header}>Введите ваш юзернейм</h1>
          <input type="text" name="" className={classes.usernameInput} onChange={handleChange} />
          <input type="submit" value="Войти в чат" className={classes.button} />
        </form>
      </div>
    </div>
  );
};
