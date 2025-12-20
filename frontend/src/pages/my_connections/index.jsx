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
    console.log("Current authState:", authState);
    console.log("User token:", authState.user?.token);
    if (authState.user?.token) {
      console.log("Dispatching getMyConnections with token:", authState.user.token);
      dispatch(getMyConnections({ token: authState.user.token }));
    }
  }, [dispatch, authState.user]);

  useEffect(() => {
    console.log("Connections updated:", authState.connections);
  }, [authState.connections]);

  const getOtherUser = (conn) => {
    console.log("Connection object:", conn);
    if (conn.userId?._id === authState.user?._id) {
      return conn.connectionId;
    }
    return conn.userId;
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div style={{ padding: "1rem" }}>
          <h2>My Connections</h2>

          {authState.connections.length === 0 ? (
            <p>No connections yet</p>
          ) : (
            authState.connections.map((conn) => {
              const otherUser = getOtherUser(conn);
              return (
                <div key={conn._id} style={{ marginBottom: "10px" }}>
                  <img
                    src={otherUser?.profilePicture}
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }}
                  />
                  <span style={{ marginLeft: "10px" }}>
                    {otherUser?.name} (@{otherUser?.username})
                  </span>
                </div>
              );
            })
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnections;