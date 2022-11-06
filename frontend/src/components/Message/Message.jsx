import React from 'react';
import PropTypes from 'prop-types';
import classes from './Message.module.scss';

export default function Message({ message }) {
  return (
    <div className={classes.message}>
      <span className={classes.sender}>{message.sender}</span>
      <span className={classes.text}>{message.text}</span>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
};
