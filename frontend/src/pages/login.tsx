import { useState } from "react";
import { Link } from "react-router-dom";

import { Form, Button, Container } from "react-bootstrap";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Form onSubmit={handleSubmit} className="col-8 d-flex flex-column gap-2">
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="position-relative">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* eye icon */}
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye-slash"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 4.5a5.5 5.5 0 0 0-5.497
                5.975L2.707 9.707a1 1 0 0 0 0 1.414l.586.586a1 1 0 0 0 1.414 0l.586-.586A5.5 5.5 0 0 0 8 11.5c.992 0 1.922-.269 2.732-.738l.586.586a1 1 0 0 0 1.414 0l.586-.586a1 1 0 0 0 0-1.414l-.586-.586A5.5 5.5 0 0 0 8 4.5zM1.646 2.354a1 1 0 0 0 0 1.414l11 11a1 1 0 0 0 1.414-1.414l-11-11a1 1 0 0 0-1.414 1.414z"
                />
                <path
                  fillRule="evenodd"
                  d="M8 6.5a2 2 0 0 1 1.732 3.018l-1.732-1.732A2 2 0 0 1 8 6.5z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4.5a5.5 5.5 0 0 0-5.497
                    5.975L2.707 9.707a1 1 0 0 0 0 1.414l.586.586a1 1 0 0 0 1.414 0l.586-.586A5.5 5.5 0 0 0 8 11.5c.992 0 1.922-.269 2.732-.738l.586.586a1 1 0 0 0 1.414 0l.586-.586a1 1 0 0 0 0-1.414l-.586-.586A5.5 5.5 0 0 0 8 4.5zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                />
              </svg>
            )}
          </Button>
        </Form.Group>
        <Form.Group controlId="rememberMe">
          <Form.Check type="checkbox" label="Remember me" />
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
              Sign Up
            </Link>
          </span>
        </Form.Group>
      </Form>
    </Container>
  );
};
