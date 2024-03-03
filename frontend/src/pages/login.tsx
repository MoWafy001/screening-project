import { useState } from "react";
import { Link } from "react-router-dom";

import { Form, Button, Container } from "react-bootstrap";
import { PasswordToggle } from "../components/password-toggle";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      toast.success(result.message);
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
      <Form onSubmit={handleSubmit} className="col-4 d-flex flex-column gap-2">
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
        <Form.Group controlId="rememberMe">
          <Form.Check
            type="checkbox"
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </Form.Group>
        <Form.Group controlId="submit">
          <Button type="submit" variant="primary w-100 bg-success border-0">
            Login
          </Button>
        </Form.Group>
        <Form.Group>
          <span className="fw-bold">
            Not a Member?{" "}
            <Link to="/signup" className="text-success text-decoration-none">
              Create an Account
            </Link>
          </span>
        </Form.Group>
      </Form>
    </Container>
  );
};
