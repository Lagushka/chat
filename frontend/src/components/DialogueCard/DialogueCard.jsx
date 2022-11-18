import React from 'react';
import PropTypes from 'prop-types';

import classes from './DialogueCard.module.scss';

export const DialogueCard = ({ name, lastMessage }) => (
  <div className={classes.card}>
    <span className={classes.chatName}>{name}</span>
    <span className={classes.lastMessage}>{lastMessage}</span>
  </div>
);

DialogueCard.propTypes = {
  name: PropTypes.string.isRequired,
  lastMessage: PropTypes.string.isRequired,
};
