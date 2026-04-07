import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserRegister } from "../redux/actions/userActions";

const SignupSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onOK = () => {
    navigate("/login");
    dispatch(clearUserRegister());
  };

  return (
    <div className="signup-success-page">
      <img
        className="signup-success-logo"
        src={`${process.env.PUBLIC_URL}/images/talabk.svg`}
      />
      <strong className="align-self-start">
        مرحبا بك نشكرك على التسجيل في برنامج طلبك
      </strong>
      <p className="align-self-start">
        سوف تصلك رسالة على البريد الإلكتروني فور موافقة الإدارة على طلب التسجيل
        الخاص بك بالإضافة إلى اسم و كلمة المرور و رابط التفعيل نرجوا منكم متابعة
        البريد الإلكتروني بصفة دورية و في حالة لم تصلكم الرسالة يرجى مراجعة
        الشركة عبر وسائل التواصل المتاحة
      </p>
      <Button onClick={onOK}>الإنتقال الى تسجيل الدخول؟</Button>
      <div className="w-100 d-flex flex-column flex-wrap gap-3">
        <strong>خدمة العملاء</strong>
        <a className="primary-link " href="tel:+218927716601">
          +218927716601
        </a>
        <a className="primary-link " href="tel:+218943333511">
          +218943333511
        </a>
        <a className="primary-link " href="mailto:info@talabk.ly">
          info@talabk.ly
        </a>
      </div>
    </div>
  );
};

export default SignupSuccess;
