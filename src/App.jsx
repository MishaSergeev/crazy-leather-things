import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { NhostProvider } from '@nhost/react';

import { nhost } from './nhost';
import { GlobalDataProvider, useGlobalData } from './context/GlobalDataContext';
import { LanguageProvider } from './context/LanguageContext';
import { FilterProvider } from "./components/hooks/FilterContext";
import { QtyProvider } from "./components/hooks/QtyContext";
import Loader from './components/Loader/Loader';
import Header from './components/Header/Header';
import ItemPage from "./components/ItemPage/ItemPage";
import UpsertItem from "./components/UpsertItem/UpsertItem";
import HomePage from "./components/HomePage";
import Cart from "./components/Cart/Cart";
import Submit from "./components/Submit/Submit";
import Favorites from './components/Favorites/Favorites';
import UserPage from "./components/UserPage/UserPage";
import Orders from "./components/Orders/Orders";
import OrderDetails from './components/OrderDetails/OrderDetails';

function InnerRoutes() {
  const { globalData, loading } = useGlobalData();

  if (loading) return <Loader />;

  const ItemsRoutes = Object.keys(globalData.Items).map((key) =>
    <Route
      key={key + "-item-info"}
      path={globalData.Items[key].link}
      element={<ItemPage data={globalData.Items[key]} id={key} />}
    />
  );

  const ItemsUpsertRoutes = Object.keys(globalData.Items).map((key) =>
    <Route
      key={key + "-item-upsert"}
      path={globalData.Items[key].link + '/Upsert'}
      element={<UpsertItem data={globalData.Items[key]} id={key} />}
    />
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/" element={<HomePage />} />
          {ItemsRoutes}
          {ItemsUpsertRoutes}
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/UserPage" element={<UserPage />} />
          <Route path="/Submit" element={<Submit />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NhostProvider nhost={nhost}>
        <QtyProvider>
          <GlobalDataProvider>
            <FilterProvider>
              <InnerRoutes />
            </FilterProvider>
          </GlobalDataProvider>
        </QtyProvider>
      </NhostProvider>
    </LanguageProvider>
  );
}