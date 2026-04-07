import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Alert, Fade } from "@mui/material";
import { removeAlertMessage } from "../redux/actions/systemActions";
import { motion } from "framer-motion";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const AlertMessage = ({}) => {
  const dispatch = useDispatch();

  const { messages } = useSelector((state) => state.alertMessages);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const { id } = lastMessage;

      const timeoutId = setTimeout(() => {
        dispatch(removeAlertMessage(id));
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [messages, dispatch]);

  return (
    <div className="alert-stack">
      {messages
        .map((msg, index) => {
          return (
            <motion.div
              key={index++}
              animate={{ x: [0, 100, 0] }}
              style={{ position: "relative" }}
            >
              <Alert
                severity={msg.type}
                className="fade-in-out"
                onClose={() => {
                  dispatch(removeAlertMessage(msg.id));
                }}
              >
                {msg.text}
              </Alert>
            </motion.div>
          );
        })
        .reverse()}
    </div>
  );
};

export default AlertMessage;
