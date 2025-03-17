import React, { useState } from "react";
import { Input, Button, Checkbox, Form, Typography, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Logo from "../../assets/Logo.png"; // Adjust the path based on where your logo is stored
import { useNavigate } from "react-router-dom"; // For navigation
import { jwtDecode } from "jwt-decode"; // For decoding the JWT token
import ArticlePage from "../articles/ArticlePage";
import Cookies from "js-cookie"; // Import js-cookie for cookies handling

const BaseUrl = import.meta.env.VITE_BASE_URL;
const { Title } = Typography;

function LoginPage({ onLogin }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const loginUser = async (username, password) => {
    try {
      const response = await fetch(`${BaseUrl}/api/auth/login-with-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please try again.");
      }

      const data = await response.json();
      console.log("API response:", data); // Log the API response

      return data; // Return the response data to the calling function
    } catch (error) {
      message.error("Login failed. Please try again.");
      throw error; // Throw error to be caught in the calling function
    }
  };

  const handleAddArticleClick = () => {
    navigate("/manage-articles");
  };

  const onFinish = async (values) => {
    setLoading(true); // Start loading
    try {
      const loginApiResponse = await loginUser(
        values.username,
        values.password
      ); // Make the API call

      console.log("Login API response:", loginApiResponse); // Log the login response

      if (loginApiResponse.success) {
        const token = loginApiResponse.token; // Extract token from API response
        console.log(loginApiResponse.token);
        // Log token before decoding
        console.log("Received token:", token);

        // Ensure that the token is a valid string and not null/undefined
        if (typeof token !== "string" || !token) {
          throw new Error("Invalid token received");
        }

        // Decode the token to get the user's role
        try {
          const decoded = jwtDecode(token);
          const { role } = decoded;

          console.log("Decoded JWT:", decoded);
          console.log("Current Role:", role); // Log the decoded token

          Cookies.set("role", role, { expires: 7 });

          message.success("Login successful!");

          // Redirect based on role
          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "moderator") {
            navigate("moderation");
          } else if (role === "content") {
            handleAddArticleClick();
          } else {
            navigate("/"); // Default
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          message.error("Token decoding failed.");
        }
      } else {
        message.error("Invalid username or password.");
      }
    } catch (error) {
      // Handle error during the login process
      console.error("Login error:", error);
      message.error("Login error: " + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "8px",
          width: "400px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={Logo} alt="Logo" style={{ width: "100px" }} />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
          <span style={{ fontWeight: "bold", color: "#1890ff" }}>
            Admin Login
          </span>
        </Title>

        <Form name="login" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter your username or email",
              },
            ]}
          >
            <Input
              placeholder="Username or Email Address"
              style={{ borderRadius: "5px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              style={{ borderRadius: "5px" }}
              suffix={
                passwordVisible ? (
                  <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                ) : (
                  <EyeOutlined onClick={togglePasswordVisibility} />
                )
              }
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading} // Show loading state
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "5px",
              }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
