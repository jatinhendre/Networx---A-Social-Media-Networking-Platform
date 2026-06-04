import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "./editProfile.module.css";
import { clientServer } from "@/config";
import { useRouter } from "next/router";
import Image from "next/image";
import { Plus, Trash2, Camera, Save, GraduationCap, Briefcase, User, FileText } from "lucide-react";

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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await clientServer.get(`/get_user_profile?token=${token}`);

        setUserData({
          name: res.data.userId.name,
          username: res.data.userId.username,

          profilePicture: res.data.userId.profilePicture || "",
        });

        setProfileData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchProfile();
  }, [token]);


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

  const removeEducation = (index) => {
    const updated = profileData.education.filter((_, i) => i !== index);
    setProfileData({ ...profileData, education: updated });
  };

  const removeWork = (index) => {
    const updated = profileData.pastWork.filter((_, i) => i !== index);
    setProfileData({ ...profileData, pastWork: updated });
  };

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
        <div className={styles.container}>
          <div className={styles.cardWrapper}>
            <h2>Edit Profile</h2>

            <div className={styles.profileHeader}>
              <Image
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : userData.profilePicture && userData.profilePicture !== ""
                      ? userData.profilePicture
                      : "/default.jpg"
                }
                alt="Profile Picture"
                className={styles.avatar}
                width={130}
                height={130}
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
                <Camera size={16} /> Upload Photo
              </button>
            </div>

            <section className={styles.form}>
              <h3><User size={18} /> Basic Info</h3>
              <input name="name" value={userData.name} onChange={handleUserChange} placeholder="Name" />
              <input name="username" value={userData.username} onChange={handleUserChange} placeholder="Username" />
            </section>

            <section className={styles.form}>
              <h3><FileText size={18} /> Bio</h3>
              <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} placeholder="Tell people about yourself..." />
            </section>

            <section className={styles.form}>
              <h3><Briefcase size={18} /> Current Position</h3>
              <input name="currentPost" value={profileData.currentPost} onChange={handleProfileChange} placeholder="Job Title (e.g. Software Engineer at Google)" />
            </section>

            <section className={styles.form}>
              <h3><GraduationCap size={18} /> Education</h3>
              {profileData.education.map((edu, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4>Entry #{i + 1}</h4>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeEducation(i)}
                      title="Remove entry"
                      aria-label="Remove education entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input placeholder="School" value={edu.school} onChange={(e) => handleEducationChange(i, "school", e.target.value)} />
                  <input placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(i, "degree", e.target.value)} />
                  <input placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(i, "fieldOfStudy", e.target.value)} />
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addEducation}>
                <Plus size={16} /> Add Education
              </button>
            </section>

            <section className={styles.form}>
              <h3><Briefcase size={18} /> Work Experience</h3>
              {profileData.pastWork.map((work, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4>Entry #{i + 1}</h4>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeWork(i)}
                      title="Remove entry"
                      aria-label="Remove work entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input placeholder="Company" value={work.company} onChange={(e) => handleWorkChange(i, "company", e.target.value)} />
                  <input placeholder="Position" value={work.position} onChange={(e) => handleWorkChange(i, "position", e.target.value)} />
                  <input placeholder="Years (e.g. 2021-2024)" value={work.years} onChange={(e) => handleWorkChange(i, "years", e.target.value)} />
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addWork}>
                <Plus size={16} /> Add Work Experience
              </button>
            </section>

            <button className={styles.saveBtn} onClick={handleSubmit}>
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default EditProfile;
