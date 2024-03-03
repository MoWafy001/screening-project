import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { Form, Button, Container } from "react-bootstrap";
import { PasswordToggle } from "../components/password-toggle";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { store } from "../store/store";
import * as qrcode from "qrcode";

export const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState("signup");
  const [otp, setOtp] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      toast.success("Signed Up in successfully");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/2fa`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      console.log(result.data.url);

      setQrCodeData(await qrcode.toDataURL(result.data.url));
      setPage("2fa");
      return;
    }

    if (response.status === 422) {
      const errors = result.errors;
      const errorKys = Object.keys(errors);
      errorKys.forEach((key) => {
        errors[key].forEach((msg: string) => {
          toast.error(msg);
        });
      });
      return;
    }

    if (response.status === 401) {
      toast.error(result.message);
      return;
    }

    toast.error("Something went wrong");
  };

  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      otp,
      rememberMe: false,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      toast.success("OTP verified successfully");
      store.set("user", JSON.stringify(result.data.user));
      store.set("loggedIn", true);

      if (result.data.refreshToken) {
        store.set("refreshToken", result.data.refreshToken);
      }

      navigate("/");
      return;
    }

    if (response.status === 422) {
      toast.error("Validation failed");
      return;
    }

    if (response.status === 401) {
      toast.error(result.message);
      return;
    }

    toast.error("Something went wrong");
  };

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <CSSTransition
        in={page === "signup"}
        timeout={500}
        classNames="page"
        unmountOnExit
      >
        <Form
          onSubmit={handleSignUp}
          className="col-4 d-flex flex-column gap-2"
        >
          <Form.Group controlId="first-name">
            <Form.Control
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group controlId="last-name">
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group controlId="password" className="position-relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
            <Button
              type="button"
              className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              <PasswordToggle show={showPassword} />
            </Button>
          </Form.Group>
          <Form.Group controlId="submit">
            <Button type="submit" variant="primary w-100 bg-success border-0">
              Sign Up
            </Button>
          </Form.Group>
          <Form.Group>
            <span className="fw-bold">
              Have an Account?
              <Link to="/login" className="text-success text-decoration-none">
                Login
              </Link>
            </span>
          </Form.Group>
        </Form>
      </CSSTransition>

      <CSSTransition
        in={page === "2fa"}
        timeout={2000}
        classNames="page"
        unmountOnExit
      >
        <Form
          className="col-4 d-flex flex-column gap-4"
          onSubmit={handle2faSubmit}
        >
          <Form.Group controlId="qr-code" className="text-center">
            <img src={qrCodeData} alt="QR Code" />
          </Form.Group>
          <Form.Group controlId="otp">
            <h4 className="text-center">
              Scan the QR code with your authenticator app and enter the OTP to
              verify
            </h4>
          </Form.Group>
          <Form.Group controlId="otp" className="d-flex justify-content-center">
            <OtpInput
              value={otp}
              onChange={(otp) => setOtp(otp)}
              numInputs={6}
              renderSeparator={(index) => (
                <span
                  key={index + 7}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "transparent",
                  }}
                ></span>
              )}
              renderInput={(props, index) => (
                <input
                  {...props}
                  key={index}
                  style={{
                    width: "40px",
                    height: "40px",
                    fontSize: "20px",
                    textAlign: "center",
                    borderRadius: "5px",
                    border: "1px solid green",
                  }}
                />
              )}
              inputStyle={{
                width: "40px",
                height: "40px",
                fontSize: "20px",
                textAlign: "center",
                borderRadius: "10px",
                border: "1px solid black",
              }}
            />
          </Form.Group>
          <Form.Group controlId="submit" className="col-4 mx-auto">
            <Button type="submit" variant="primary w-100 bg-success border-0">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </CSSTransition>
    </Container>
  );
};
