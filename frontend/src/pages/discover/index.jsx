import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/AuthAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { Router, useRouter } from "next/router";

function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profile_fetched, dispatch]);

  const filteredUsers = authState.allUsers?.filter((profile) => {
  const username = profile.userId?.username?.toLowerCase() || "";
  const name = profile.userId?.name?.toLowerCase() || "";
  return (
    username.includes(search.toLowerCase()) ||
    name.includes(search.toLowerCase())
  );
});

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h2 className={styles.heading}>Discover People</h2>
        <input
  type="text"
  placeholder="Search by name or username"
  className={styles.search}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

          <div className={styles.grid}>
            {authState.allUsers?.length > 0 ? (
              filteredUsers.map((profile) => (
                <div key={profile._id} className={styles.card}>
                  <img
                    src={`${BASE_URL}/${profile.userId.profilePicture || ""}`}
                    alt="profile"
                    className={styles.avatar}
                  />

                  <h3 className={styles.username}>
                    @{profile.userId?.username}
                  </h3>

                  <p className={styles.name}>
                    {profile.userId?.name}
                  </p>
                  <button onClick={()=>{
                    router.push('/view_profile/' + profile.userId?.username)
                  }} className={styles.btn}>View Profile</button>
                </div>
              ))
            ) : (
              <p className={styles.empty}>No users found</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Discover;
