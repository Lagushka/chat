/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useRoutes } from 'react-router-dom';

import { StartPage } from './StartPage/StartPage';
import { CurrentChat } from './CurrentChat/CurrentChat';

const routes = [
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/chat',
    element: <CurrentChat />,
  },
];

export const AppRouter = () => {
  const router = useRoutes(routes);

  return router;
};
