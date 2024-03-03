import { useNavigate } from "react-router-dom";
import { store } from "../store/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const WelcomePage = () => {
  const isLoggedIn = store.get("loggedIn") === "true";
  const [user, setUser] = useState({}) as any;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error("You need to be logged in to view this page");
          return navigate("/login");
        }
        if (res.status !== 200) {
          toast.error("An error occurred");
          return navigate("/login");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;

        setUser(data.data.user);
      });
  }, []);

  // bootstrap styed profile page
  return (
    (user && (
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center">Profile</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>First Name:</strong>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>{user.firstName}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Last Name:</strong>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>{user.lastName}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Email:</strong>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Email Verified:</strong>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>{user.emailVerified ? "Yes" : "No"}</p>
                  </div>
                </div>
                {/* logout */}
                <div className="row">
                  <div className="col-md-6">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/logout`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        });
                        store.clear();
                        toast.success("Logged out successfully");
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )) || <>loading...</>
  );
};
