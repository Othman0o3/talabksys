import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { 
  Button, TextField, Box, Typography, 
  FormControlLabel, Checkbox 
} from "@mui/material";
import { clearUserRegister, userRegister } from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import SignupSuccess from "../components/SignupSuccess";
import SocialLinks from "../components/SocialLinks";
import { addAlertMessage } from "../redux/actions/systemActions";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { statusUserRegister } = useSelector((state) => state.userRegister);

  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  
  const [agreed, setAgreed] = useState(false);

  const handlePhone1Change = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/[^0-9+]/g, ""); 
    const maxLengthValue = formattedValue.slice(0, 10); 
    setPhone1(maxLengthValue);
  };

  const handlePhone2Change = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/[^0-9+]/g, "");
    const maxLengthValue = formattedValue.slice(0, 10);
    setPhone2(maxLengthValue);
  };

  const handlePhone3Change = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/[^0-9+]/g, "");
    const maxLengthValue = formattedValue.slice(0, 10);
    setPhone3(maxLengthValue);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
    
      if (!agreed) {
        dispatch(addAlertMessage("يرجى الموافقة على شروط وسياسات العمل قبل إنشاء الحساب.", "error")); 
      return;
      }

      dispatch(
        userRegister(email, storeName, scopeOfWork, phone1, phone2, phone3, address)
      );
    
    

    dispatch(
      userRegister(
        email,
        storeName,
        scopeOfWork,
        phone1,
        phone2,
        phone3,
        address
      )
    );
  };

  useEffect(() => {
    return () => {
      dispatch(clearUserRegister());
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
        direction: "rtl", 
      }}
    >
      <AlertMessage />

      {statusUserRegister === 200 ? (
        <SignupSuccess />
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            px: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/talabk.png`}
              style={{ width: "160px", marginBottom: "8px" }}
              alt="Logo"
            />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Almarai",
                color: "var(--primary-color)",
                fontWeight: 800,
                fontSize: "1.1rem",
                marginTop: "-12px",
              }}
            >
              ديما قراب
            </Typography>
          </Box>

          <div className="signup-container" style={{ width: "100%" }}>
            <TextField
              required
              fullWidth
              type="email"
              label="البريد الإلكتروني"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="اسم المتجر"
              margin="normal"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="مجال العمل"
              margin="normal"
              value={scopeOfWork}
              onChange={(e) => setScopeOfWork(e.target.value)}
            />
            <TextField
              required
              fullWidth
              type="text" 
              label="رقم الهاتف 1"
              margin="normal"
              value={phone1}
              onChange={handlePhone1Change}
            />
            <TextField
              fullWidth
              type="text"
              label="رقم الهاتف 2"
              margin="normal"
              value={phone2}
              onChange={handlePhone2Change}
            />
            <TextField
              fullWidth
              type="text"
              label="رقم الهاتف 3"
              margin="normal"
              value={phone3}
              onChange={handlePhone3Change}
            />
            <TextField
              required
              fullWidth
              label="العنوان"
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  sx={{
                    color: "var(--primary-color)",
                    "&.Mui-checked": {
                      color: "var(--primary-color)",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontFamily: "Almarai" }}>
                  أوافق على{" "}
                  <a
                    href="https://talabk.ly/سياسات الشحن"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    شروط وسياسات العمل
                  </a>
                </Typography>
              }
              sx={{ mt: 1, mb: 1, width: "100%" }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                mb: 2,
                bgcolor: "var(--primary-color) !important",
                fontFamily: "Almarai",
                fontWeight: "bold",
                height: "50px",
                borderRadius: "12px",
              }}
            >
              إنشاء حساب
            </Button>

            <Typography
              align="center"
              sx={{ fontFamily: "Almarai", fontSize: "0.9rem", mt: 2 }}
            >
              لديك حساب بالفعل؟{" "}
              <Link
                to={"/login"}
                style={{
                  textDecoration: "none",
                  color: "var(--primary-color)",
                  fontWeight: "bold",
                }}
              >
                <span> تسجيل الدخول</span>
              </Link>
            </Typography>
          </div>
        </Box>
      )}

      <Box sx={{ mt: "auto", textAlign: "center", pt: 5, pb: 2 }}>
        <SocialLinks />
        <br />
        <a
          style={{
            fontSize: "0.75rem",
            color: "#666",
            textDecoration: "none",
            fontFamily: "Almarai",
          }}
          href="https://talabk.ly"
        >
          © جميع الحقوق محفوظة لشركة طلبك 2026 ©
        </a>
      </Box>
    </Box>
  );
};

export default SignupPage;