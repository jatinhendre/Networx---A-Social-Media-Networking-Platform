import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { getMyConnections } from "@/config/redux/action/AuthAction";
import styles from "./style.module.css";
function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    if (authState.user?.token) {
      dispatch(getMyConnections({ token: authState.user.token }));
    }
  }, [dispatch, authState.user]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{ padding: "1rem" }}>
          <h2>My Connections</h2>

          {authState.connections.length === 0 ? (
            <p>No connections yet</p>
          ) : (
            authState.connections.map((conn) => (
              <div key={conn._id} style={{ marginBottom: "10px" }}>
                <img
                  src={conn.connectionId.profilePicture}
                  width="40"
                  height="40"
                  style={{ borderRadius: "50%" }}
                />
                <span style={{ marginLeft: "10px" }}>
                  {conn.connectionId.name} (@{conn.connectionId.username})
                </span>
              </div>
            ))
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnections;
