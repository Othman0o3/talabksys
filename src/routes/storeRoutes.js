import MainContainer from "../containers/MainContainer";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import OrdersPage from "../pages/OrdersPage";
import SettlementsPage from "../pages/SettlementsPage";
import SignupPage from "../pages/SignupPage";
import CompanyStorePage from "../pages/CompanyStorePage";
import ItemMovePage from "../pages/ItemMovePage";
import StoreOrderPage from "../pages/StoreOrderPage";
import StoreOrderDetailsPage from "../pages/StoreOrderDetailsPage";
import InventoryPage from "../pages/InventoryPage";
import ShowRoomOrdersPage from "../pages/ShowRoomOrdersPage";
import TrackingView from "../pages/TrackingViewPage"; 

const storeRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
    isPrivate: false,
    mustLogout: true,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    isPrivate: false,
    mustLogout: true,
  },
  {
    path: "/",
    element: (
      <MainContainer>
        <MainPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/orders",
    element: (
      <MainContainer>
        <OrdersPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/order-details/:id?",
    element: (
      <MainContainer>
        <OrderDetailsPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/settlements",
    element: (
      <MainContainer>
        <SettlementsPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/company-store",
    element: (
      <MainContainer>
        <CompanyStorePage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/item-movement",
    element: (
      <MainContainer>
        <ItemMovePage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/store-order",
    element: (
      <MainContainer>
        <StoreOrderPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/store-order-details/:id?",
    element: (
      <MainContainer>
        <StoreOrderDetailsPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/inventory",
    element: (
      <MainContainer>
        <InventoryPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/show-room-orders",
    element: (
      <MainContainer>
        <ShowRoomOrdersPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/tracking/:OrderID",
    element: (
      <MainContainer>
        <TrackingView />
      </MainContainer>
    ),
    isPrivate: false, 
    mustLogout: false,
  }
];

export default storeRoutes;