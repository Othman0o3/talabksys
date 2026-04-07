import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";

const Nav = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { loginInfo } = useSelector((state) => state.userLogin);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    Cookies.remove("userInfo");
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  const primaryRed = "var(--primary-color)";

  if (!loginInfo) return null;

  return (
    <nav>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#ffffff !important",
          borderBottom: "1px solid #f0f0f0",
          zIndex: 1100,
          height: "64px",
          justifyContent: "center",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            {(loginInfo?.stats === 1 || loginInfo?.stats === 4) ? (
              <IconButton
                size="large"
                edge="start"
                onClick={() => setOpen(!open)}
                sx={{ color: primaryRed }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                edge="start"
                onClick={() => navigate("/qr-code-scanner")}
                sx={{ color: primaryRed }}
              >
                <QrCodeScannerIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "center", flex: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={`${process.env.PUBLIC_URL}/images/talabk.svg`} alt="Logo" height={35} />
              <Box
                sx={{
                  display:"flex", 
                  alignItems:'center',
                    }}
                    >
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily:"almarai",
                        fontWeight:'400',
                        color:'var(--primary-color)',
                        fontSize:'0.8rem',
                        mr:'1.5',
                        letterSpacing:1
                    }}  
                      >
                      ديما قراب
                  </Typography>
              </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flex: 1 }}>
            <Box
              onClick={handleMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: 0.5,
                borderRadius: "12px",
                "&:hover": { bgcolor: "rgba(221, 36, 41, 0.05)" },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "var(--primary-color) !important",
                  color: "var(--primary-color)",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  fontFamily: "Almarai",
                }}
              >
                {loginInfo?.Name ? loginInfo.Name.charAt(0) : <AccountCircle />}
              </Avatar>
              <ExpandMoreIcon sx={{ fontSize: 18, color: primaryRed }} />
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              disableScrollLock={true}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  filter: "drop-shadow(0px 5px 15px rgba(0,0,0,0.08))",
                  border: "1px solid #eee",
                },
              }}
            >
              <MenuItem disabled sx={{ fontSize: "0.8rem", fontFamily: "Almarai", color: "#333" }}>
                {loginInfo?.Name || "المستخدم"} (
                {loginInfo?.stats === 4 ? "مسوق" : loginInfo?.stats === 2 ? "مندوب" : "متجر"})
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: primaryRed, fontFamily: "Almarai", fontWeight: "bold" }}>
                <LogoutIcon sx={{ ml: 1, fontSize: 20 }} /> تسجيل الخروج
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Nav;