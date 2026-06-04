import React, { useEffect, useState } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "./editProfile.module.css";
import { clientServer } from "@/config";
import { useRouter } from "next/router";
import Image from "next/image";
import { Plus, Trash2, Camera, Save, GraduationCap, Briefcase, User, FileText } from "lucide-react";
import toast from "react-hot-toast";

function EditProfile() {
  const router = useRouter();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    profilePicture: "",
    coverPicture: "",
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
          coverPicture: res.data.userId.coverPicture || "",
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

  const handleCoverChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const uploadProfilePicture = async () => {
    if (!profileImage) return;

    setIsUploadingProfile(true);
    const formData = new FormData();
    formData.append("profile_picture", profileImage);
    formData.append("token", token);

    try {
      const res = await clientServer.post(
        `/update_profile_picture?token=${token}`,
        formData
      );
      setUserData((prev) => ({
        ...prev,
        profilePicture: res.data.profilePicture,
      }));
      setProfileImage(null);
      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Profile picture upload failed");
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const uploadCoverPicture = async () => {
    if (!coverImage) return;

    setIsUploadingCover(true);
    const formData = new FormData();
    formData.append("cover_picture", coverImage);
    formData.append("token", token);

    try {
      const res = await clientServer.post(
        `/update_cover_picture?token=${token}`,
        formData
      );
      setUserData((prev) => ({
        ...prev,
        coverPicture: res.data.coverPicture,
      }));
      setCoverImage(null);
      toast.success("Cover picture updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Cover image upload failed");
    } finally {
      setIsUploadingCover(false);
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
    setIsSavingProfile(true);
    try {
      await clientServer.post("/update_profile", {
        token,
        ...userData,
      });

      await clientServer.post(
        `/update_profile_data?token=${token}`,
        profileData
      );

      toast.success("Profile updated successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.cardWrapper}>
            <h2>Edit Profile</h2>

            <div className={styles.mediaUploadGrid}>
              <div className={styles.uploadCard}>
                <h4><User size={16} /> Profile Photo</h4>
                <div className={styles.previewContainer}>
                  <Image
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : userData.profilePicture && userData.profilePicture !== ""
                          ? userData.profilePicture
                          : "/default.jpg"
                    }
                    alt="Profile Picture"
                    className={styles.previewImage}
                    width={130}
                    height={130}
                    unoptimized
                  />
                </div>
                <div className={styles.uploadActions}>
                  <input
                    type="file"
                    id="profileInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className={styles.fileSelectBtn}
                    onClick={() => document.getElementById("profileInput").click()}
                  >
                    <Camera size={14} /> Choose Photo
                  </button>
                  <span className={styles.fileName}>
                    {profileImage ? profileImage.name : "No file chosen"}
                  </span>
                  <button
                    type="button"
                    className={styles.uploadSubmitBtn}
                    onClick={uploadProfilePicture}
                    disabled={!profileImage || isUploadingProfile}
                  >
                    {isUploadingProfile ? "Uploading..." : <><Save size={14} /> Upload Photo</>}
                  </button>
                </div>
              </div>

              <div className={styles.uploadCard}>
                <h4><Camera size={16} /> Cover Photo</h4>
                <div className={styles.previewContainerSquare}>
                  <Image
                    src={
                      coverImage
                        ? URL.createObjectURL(coverImage)
                        : userData.coverPicture && userData.coverPicture !== ""
                          ? userData.coverPicture
                          : "/default.jpg"
                    }
                    alt="Cover Picture"
                    className={styles.previewImage}
                    width={260}
                    height={130}
                    unoptimized
                  />
                </div>
                <div className={styles.uploadActions}>
                  <input
                    type="file"
                    id="coverInput"
                    accept="image/*"
                    onChange={handleCoverChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className={styles.fileSelectBtn}
                    onClick={() => document.getElementById("coverInput").click()}
                  >
                    <Camera size={14} /> Choose Cover
                  </button>
                  <span className={styles.fileName}>
                    {coverImage ? coverImage.name : "No file chosen"}
                  </span>
                  <button
                    type="button"
                    className={styles.uploadSubmitBtn}
                    onClick={uploadCoverPicture}
                    disabled={!coverImage || isUploadingCover}
                  >
                    {isUploadingCover ? "Uploading..." : <><Save size={14} /> Upload Cover</>}
                  </button>
                </div>
              </div>
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

            <button className={styles.saveBtn} onClick={handleSubmit} disabled={isSavingProfile}>
              {isSavingProfile ? "Saving..." : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default EditProfile;
