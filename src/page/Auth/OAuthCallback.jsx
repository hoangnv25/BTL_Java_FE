import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { App } from "antd";
import axios from "axios";
import "./Login.css";
import { base } from "../../service/Base";
import { setToken } from "../../service/LocalStorage";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [provider, setProvider] = useState('Google');

  useEffect(() => {
    console.log("OAuth Callback URL:", window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];
      console.log("Authorization Code:", authCode);

      const oauthProvider = sessionStorage.getItem('oauthProvider') || 'google';
      console.log("OAuth Provider:", oauthProvider);
      
      setProvider('Google');

      const apiEndpoint = `${base}/auth/outbound/authentication?code=${authCode}`;
      const successMessage = "Đăng nhập Google thành công!";
      const errorMessage = "Đăng nhập Google thất bại";

      axios
        .post(apiEndpoint)
        .then((response) => {
          console.log("OAuth Response:", response.data);

          if (response.data.result?.token) {
            // Sử dụng setToken để lưu và trigger event
            setToken(response.data.result.token);
            
            sessionStorage.removeItem('oauthProvider');
            
            message.success(successMessage);
            setIsLoggedin(true);
          } else {
            throw new Error("Không nhận được token từ server");
          }
        })
        .catch((error) => {
          console.error("OAuth Error:", error);
          message.error(
            error?.response?.data?.message || errorMessage
          );
          
          sessionStorage.removeItem('oauthProvider');
          
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        });
    } else {
      message.error("Không tìm thấy mã xác thực");
      navigate("/login");
    }
  }, [navigate, message]);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <div className="login-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            animation: "spin 1s linear infinite",
          }}
        >
          ⏳
        </div>
        <div style={{ fontSize: "18px", color: "#666" }}>
          Đang xác thực với {provider}...
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

