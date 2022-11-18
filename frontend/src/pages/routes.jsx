/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useRoutes } from 'react-router-dom';

import { StartPage } from './StartPage/StartPage';
import { Dialogues } from './Dialogues/Dialogues';

const routes = [
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/dialogues',
    element: <Dialogues />,
  },
];

export const AppRouter = () => {
  const router = useRoutes(routes);

  return router;
};
