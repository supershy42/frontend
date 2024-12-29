import Supereact from '../Supereact/index.js';
import { store } from './store.js';

export const useStore = () => {
  const [state, setState] = Supereact.useState(store.getState());

  Supereact.useEffect(() => {
    return store.subscribe(setState);
  }, []);

  return state;
};
