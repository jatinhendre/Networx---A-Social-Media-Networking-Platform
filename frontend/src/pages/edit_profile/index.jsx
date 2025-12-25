import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "./editProfile.module.css";
import { clientServer } from "@/config";
import { useRouter } from "next/router";
import Image from "next/image";

function EditProfile() {
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [profileImage, setProfileImage] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    profilePicture: "",
  });

  const [profileData, setProfileData] = useState({
    bio: "",
    currentPost: "",
    education: [],
    pastWork: [],
  });

  /* ---------------- FETCH CURRENT DATA ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await clientServer.get(`/get_user_profile?token=${token}`);

        setUserData({
          name: res.data.userId.name,
          username: res.data.userId.username,

          // IMPORTANT — Cloudinary URL direct
          profilePicture: res.data.userId.profilePicture || "",
        });

        setProfileData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* ---------------- HANDLERS ---------------- */

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const uploadProfilePicture = async () => {
    if (!profileImage) return;

    const formData = new FormData();
    formData.append("profile_picture", profileImage);
    formData.append("token", token);

    try {
      const res = await clientServer.post(
        "/update_profile_picture",
        formData
      );

      // EXPECTING: res.data.profilePicture = cloudinary secure_url
      setUserData((prev) => ({
        ...prev,
        profilePicture: res.data.profilePicture,
      }));

      alert("Profile picture updated successfully");
    } catch (err) {
      console.log(err);
      alert("Image upload failed");
    }
  };

  /* ----------- text field handlers ----------- */

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (i, field, value) => {
    const updated = [...profileData.education];
    updated[i][field] = value;
    setProfileData({ ...profileData, education: updated });
  };

  const handleWorkChange = (i, field, value) => {
    const updated = [...profileData.pastWork];
    updated[i][field] = value;
    setProfileData({ ...profileData, pastWork: updated });
  };

  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [
        ...profileData.education,
        { school: "", degree: "", fieldOfStudy: "" },
      ],
    });
  };

  const addWork = () => {
    setProfileData({
      ...profileData,
      pastWork: [
        ...profileData.pastWork,
        { company: "", position: "", years: "" },
      ],
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    try {
      await clientServer.post("/update_profile", {
        token,
        ...userData,
      });

      await clientServer.post(
        `/update_profile_data?token=${token}`,
        profileData
      );

      alert("Profile updated successfully");
      router.push("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.profileHeader}>
          <Image
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : userData.profilePicture ||
                  "/default-avatar.png" // fallback optional
            }
            alt="Profile"
            className={styles.avatar}
            width={70}
            height={70}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={uploadProfilePicture}
          >
            Upload Photo
          </button>
        </div>

        {/* Remaining UI same */}
        {/* ----------------------- */}



        <div className={styles.container}>
            <div className={styles.cardWrapper}>
          <h2>Edit Profile</h2>

          {/* BASIC INFO */}
          <section className={styles.form}>
            <h3>Basic Info</h3>
            <input name="name" value={userData.name} onChange={handleUserChange} placeholder="Name" />
            <input name="username" value={userData.username} onChange={handleUserChange} placeholder="Username" />
            
          </section>

          {/* BIO */}
          <section className={styles.form}>
            <h3>Bio</h3>
            <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} />
          </section>

          {/* CURRENT POST */}
          <section className={styles.form}>
            <h3>Current Position</h3>
            <input name="currentPost" value={profileData.currentPost} onChange={handleProfileChange} />
          </section>

          {/* EDUCATION */}
          <section className={styles.form}>
            <h3>Education</h3>
            {profileData.education.map((edu, i) => (
              <div key={i} className={styles.card}>
                <input placeholder="School" value={edu.school} onChange={(e) => handleEducationChange(i, "school", e.target.value)} />
                <input placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(i, "degree", e.target.value)} />
                <input placeholder="Field" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(i, "fieldOfStudy", e.target.value)} />
              </div>
            ))}
            <button onClick={addEducation}>+ Add Education</button>
          </section>

          {/* WORK */}
          <section className={styles.form}>
            <h3>Work Experience</h3>
            {profileData.pastWork.map((work, i) => (
              <div key={i} className={styles.card}>
                <input placeholder="Company" value={work.company} onChange={(e) => handleWorkChange(i, "company", e.target.value)} />
                <input placeholder="Position" value={work.position} onChange={(e) => handleWorkChange(i, "position", e.target.value)} />
                <input placeholder="Years" value={work.years} onChange={(e) => handleWorkChange(i, "years", e.target.value)} />
              </div>
            ))}
            <button onClick={addWork}>+ Add Work</button>
          </section>

          <button className={styles.saveBtn} onClick={handleSubmit}>
            Save Changes
          </button>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default EditProfile;
