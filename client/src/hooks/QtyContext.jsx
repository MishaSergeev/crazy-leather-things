import { createContext, useContext, useState } from 'react';

import GlobalData from '../context/InitialGlobalData';

const QtyContext = createContext();

export function QtyProvider({ children }) {
  const [cartQty, setCartQty] = useState(0);
  const [favoriteQty, setFavoriteQty] = useState(0);
  const addItemToCart = () => {
    const totalItems = Object.values(GlobalData.cart || {}).length;
    setCartQty(totalItems);
  };
  const addItemToFavorite = () => {
    const totalItems = Object.values(GlobalData.favorite || {}).length;
    setFavoriteQty(totalItems);
  };
  return (
    <QtyContext.Provider value={{ cartQty, addItemToCart, favoriteQty, addItemToFavorite }}>
      {children}
    </QtyContext.Provider>
  );
}
export function useQty() {
  return useContext(QtyContext);
}