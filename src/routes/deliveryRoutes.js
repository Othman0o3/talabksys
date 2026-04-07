import MainContainer from "../containers/MainContainer";
import DeliveryMainPage from "../pages/DeliveryMainPage";
import DeliveryOrdersPage from "../pages/DeliveryOrdersPage";
import DeliverySettlementsPage from "../pages/DeliverySettlementsPage";
import LoginPage from "../pages/LoginPage";
import QRCodeScannerPage from "../pages/QRCodeScannerPage";
import SignupPage from "../pages/SignupPage";

const deliveryRoutes = [
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
        <DeliveryMainPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/orders",
    element: (
      <MainContainer>
        <DeliveryOrdersPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/settlements",
    element: (
      <MainContainer>
        <DeliverySettlementsPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
  {
    path: "/qr-code-scanner",
    element: (
      <MainContainer>
        <QRCodeScannerPage />
      </MainContainer>
    ),
    isPrivate: true,
    mustLogout: false,
  },
];

export default deliveryRoutes;
