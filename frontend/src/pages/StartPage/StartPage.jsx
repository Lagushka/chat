import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './StartPage.module.scss';
import { socket } from '../../socket';

export const StartPage = () => {
  const [fieldValue, setFieldValue] = useState('');
  const navigate = useNavigate();
  const [validated, setValidated] = useState(true);

  let timeout;

  const handleChange = (event) => {
    if (event.target.value.length <= 30) {
      setFieldValue(event.target.value);
    } else {
      clearTimeout(timeout);
      setValidated(false);
      timeout = setTimeout(setValidated, 4000, true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fieldValue) {
      const user = {
        name: fieldValue,
        socket: socket.id,
        online: true,
      };
      localStorage.setItem('user', JSON.stringify(user));
      // socket.emit('user', user);
      navigate('/dialogues');
    }
  };

  return (
    <div className={classes.startPage}>
      <div className={classes.nameWindow}>
        <form action="" onSubmit={handleSubmit} className={classes.usernameForm}>
          <h1 className={classes.header}>Введи пожалуйста свой юзернейм</h1>
          <div className={classes.usernameInputBlock}>
            <input type="text" name="" className={classes.usernameInput} onChange={handleChange} value={fieldValue} />
            {
              !validated && (
                <span className={classes.wrongInput}>
                  Твой юзернейм не должен превышать 30 символов
                </span>
              )
            }
          </div>
          <input type="submit" value="Войти в чат" className={classes.button} />
        </form>
      </div>
    </div>
  );
};
