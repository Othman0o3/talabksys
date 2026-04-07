import React from "react";
import MainContainer from "../containers/MainContainer"; 
import MarketerPage from "../pages/MarketerPage";
import MarketerFinancePage from '../pages/MarketerSettlementsPage';
import AddOrderDialog from "../pages/MarketerOrders";

export const marketerRoutes = [
    {
        path: "/",
        element: (
            <MainContainer>
                <MarketerPage />
            </MainContainer>
            ),
            isPrivate: true,
            mustLogout: false,
        },
        {
            path: "/اضافة طلب",
            element: (
            <MainContainer>
                <AddOrderDialog />
            </MainContainer>
            ),
            isPrivate: true,
            mustLogout: false,
        },
        {
            path: "/التسويات",
            element: (
            <MainContainer>
                <MarketerFinancePage />
            </MainContainer>
            ),
            isPrivate: true,
            mustLogout: false,
        },
];