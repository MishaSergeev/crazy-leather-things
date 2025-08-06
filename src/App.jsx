import { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { NhostProvider } from '@nhost/react';

import { nhost } from './nhost';
import { GlobalDataProvider, useGlobalData } from './context/GlobalDataContext';
import { LanguageProvider } from './context/LanguageContext';
import { FilterProvider } from "./hooks/FilterContext";
import { QtyProvider } from "./hooks/QtyContext";
import Loader from './components/Loader/Loader';
import Header from './components/Header/Header';
import HomePage from "./components/HomePage";
const Cart = lazy(() => import('./components/Cart/Cart'));
const Submit = lazy(() => import('./components/Submit/Submit'));
const Favorites = lazy(() => import('./components/Favorites/Favorites'));
const UserPage = lazy(() => import('./components/UserPage/UserPage'));
const Orders = lazy(() => import('./components/Orders/Orders'));
const OrderDetails = lazy(() => import('./components/OrderDetails/OrderDetails'));
const UpsertItem = lazy(() => import('./components/UpsertItem/UpsertItem'));
const ItemPage = lazy(() => import("./components/ItemPage/ItemPage"));

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
      <Suspense fallback={<Loader />}>
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
      </Suspense>
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