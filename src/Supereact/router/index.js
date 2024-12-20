import Supereact from '../core/index.js';

let currentPath = window.location.pathname;
let routeChangeListeners = [];

const RouterCore = {
  navigate(to) {
    window.history.pushState({}, '', to);
    currentPath = to;
    routeChangeListeners.forEach((listener) => listener(to));
  },

  subscribe(listener) {
    routeChangeListeners.push(listener);
    return () => {
      routeChangeListeners = routeChangeListeners.filter((l) => l != listener);
    };
  },
};

function Route({ path, component }) {
  const match = currentPath === path;
  if (!match) return null;

  return Supereact.createElement(component, {});
}

function Router({ children }) {
  const [update, setUpdate] = Supereact.useState({});

  Supereact.useEffect(() => {
    const handlePopstate = () => {
      currentPath = window.location.pathname;
      setUpdate({});
    };

    const unsubscribe = RouterCore.subscribe(() => {
      setUpdate({});
    });

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
      unsubscribe();
    };
  }, [update]);

  const result = Supereact.createElement(
    'div',
    { style: { width: '100%', height: '100%' } },
    ...children
  );
  return result;
}

function Link({ to, children }) {
  return Supereact.createElement(
    'a',
    {
      href: to,
      onClick: (e) => {
        e.preventDefault();
        RouterCore.navigate(to);
      },
    },
    children
  );
}
const SupereactRouter = {
  Route,
  Router,
  Link,
  navigate: RouterCore.navigate,
};

export default SupereactRouter;
