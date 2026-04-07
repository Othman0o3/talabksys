import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Box,
  Typography
} from "@mui/material";
import { login } from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import SocialLinks from "../components/SocialLinks";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loadingLogin, errMsgLogin, loginInfo } = useSelector(
    (state) => state.userLogin
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <>
      <AlertMessage />
      <div className="login-page">
        <form onSubmit={handleSubmit} className="login-container">

          <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/talabk.png`} 
                style={{ width: '150px', marginBottom: '5px' }} 
                alt="Logo"
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'Almarai', 
                  color: 'var(--primary-color)', 
                  fontWeight: 700,
                  letterSpacing: '1px',
                  marginTop: '-10px'
                }}
              >
                ديما قراب
              </Typography>
            </Box>          
            <TextField
            required
            autoComplete="off"
            className="login-input"
            type="text"
            label="اسم المستخدم أو رقم الهاتف"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            required
            className="login-input"
            type="password"
            label="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            style={{ alignSelf: "flex-start", marginRight: "30px" }}
            control={<Checkbox defaultChecked />}
            label="تذكرني"
          />

          <Button
            variant="contained"
            type="submit"
            className="login-button"
            endIcon={loadingLogin && <CircularProgress />}
          >
            تسجيل الدخول
          </Button>
          <p className="create-account-link">
            ليس لديك حساب؟
            <Link to={"/signup"}>
              <span> إنشاء حساب</span>
            </Link>
          </p>
        </form>
        <br />
        <br />
        <SocialLinks />
        <a
          style={{
            fontSize: "0.72rem",
            margin: "auto auto 15px auto",
            color: "var(--primary-color)",
          }}
          href="https://fvtion.com/"
          target="_blank"
        >
          © جميع الحقوق محفوظة لشركة طلبك - تصميم شركة رؤية المستقبل 2023 ©
        </a>
        <a href=""></a>
      </div>
    </>
  );
};

export default LoginPage;
