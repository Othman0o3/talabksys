import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {
  changeDeliveryOrderSearchType,
  setDeliveryOrdersSearchText,
} from "../redux/actions/orderActions";

const QRCodeScannerPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vibrateSuccess = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleScan = (err, result) => {
    if (result) {
      vibrateSuccess();
      dispatch(setDeliveryOrdersSearchText(result.text));
      dispatch(changeDeliveryOrderSearchType("shipping"));
      navigate("/orders", { replace: true });
    }
  };

  return (
    <div className="qr-code-page">
      <div className="camera-view">
        <BarcodeScannerComponent
          width={"100%"}
          height={"100%"}
          onUpdate={handleScan}
        />
      </div>
    </div>
  );
};

export default QRCodeScannerPage;
