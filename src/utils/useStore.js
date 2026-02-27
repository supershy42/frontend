import { useState, useEffect } from 'react';
import { store } from './store.js';

export const useStore = () => {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(setState);
  }, []);

  return state;
};
