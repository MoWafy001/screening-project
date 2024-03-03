import { useNavigate } from "react-router-dom";
import { store } from "../store/store";
import { useEffect } from "react";

export const WelcomePage = () => {
  const isLoggedIn = store.get("loggedIn") === "true";
  const user = JSON.parse(store.get("user") || "{}");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login");
    }
  }, []);

  return (
    (isLoggedIn && (
      <div>
        <h1>
          Welcome {user.firstName} {user.lastName}
        </h1>
      </div>
    )) || <></>
  );
};
