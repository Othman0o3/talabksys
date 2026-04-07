import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

// Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PolicyIcon from "@mui/icons-material/Policy";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MarginIcon from "@mui/icons-material/Margin";
import StoreIcon from "@mui/icons-material/Store";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import {
  changeOrderSearchType,
  changeStoreOrderSearchType,
} from "../redux/actions/orderActions";

const NavDrawer = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginInfo } = useSelector((state) => state.userLogin);

  const navigeToPage = (path) => {
    setOpen(false);
    navigate(path);
  };

  const renderItem = (title, path, icon, activePath = null, onClickAction = null) => {
    const isSelected = location.pathname === (activePath || path);
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={onClickAction ? onClickAction : () => navigeToPage(path)}>
          <ListItemIcon style={{ color: isSelected ? "var(--primary-color)" : "var(--primary-text-color)" }}>
            {icon}
          </ListItemIcon>
          <ListItemText 
            primary={title} 
            sx={{ textAlign: 'right', '& span': { fontFamily: 'Almarai', fontWeight: isSelected ? 'bold' : 'normal' } }} 
          />
        </ListItemButton>
      </ListItem>
    );
  };

  if (!loginInfo) return null;

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {loginInfo.stats === 1 && (
          <>
            {renderItem("الرئيسية", "/", <HomeIcon />)}
            {renderItem("إضافة طلبية", "/order-details", <AddCircleIcon />)}
            {renderItem("عرض الطلبيات", "/orders", <LocalShippingIcon />, "/orders", () => {
              dispatch(changeOrderSearchType("all"));
              navigeToPage("/orders");
            })}
            {renderItem("التسويات", "/settlements", <PointOfSaleIcon />)}

            {loginInfo.TyepContr && (
              <>
                <Divider sx={{ my: 1, bgcolor: "var(--primary-color)", opacity: 0.2 }} />
                {renderItem("إدارة المساحة", "/company-store", <MarginIcon />)}
                {renderItem("إضافة طلبية مخزن", "/store-order-details", <AddCircleIcon />, "/store-order-details", () => {
                  dispatch(changeStoreOrderSearchType("all"));
                  navigeToPage("/store-order-details");
                })}
                {renderItem("حركة صنف", "/item-movement", <TimelineOutlinedIcon/>)}
                {renderItem("عرض طلبيات المخزن", "/store-order", <StoreIcon />)}
                {renderItem("جرد المخزن", "/inventory", <AssessmentIcon />)}
              </>
            )}
          </>
        )}

        {loginInfo.stats === 4 && (
          <>
            {renderItem("الرئيسية", "/", <HomeIcon />)}
            {renderItem("إضافة طلب", "/اضافة طلب", <AddCircleIcon />)}
            {renderItem("التسويات", "/التسويات" ,<AccountBalanceWalletIcon/>)}
          </>
        )}

        <Divider sx={{ my: 1, bgcolor: "var(--primary-color)", opacity: 0.2 }} />

        {renderItem("سياسة الشحن", "/policy.html", <PolicyIcon />, null, () => window.open("/policy.html", "_blank"))}
        {renderItem("إتفاقية المستخدم", "/agreement.html", <HandshakeIcon />, null, () => window.open("/agreement.html", "_blank"))}

        <ListItem disablePadding>
          <ListItemButton onClick={() => window.open("https://wa.me/+218927716601", "_blank")}>
            <ListItemIcon style={{ color: "#25D366" }}><WhatsAppIcon /></ListItemIcon>
            <ListItemText primary={"خدمة العملاء"} sx={{ textAlign: 'right', '& span': { fontFamily: 'Almarai' } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      {list()}
    </Drawer>
  );
};

export default NavDrawer;