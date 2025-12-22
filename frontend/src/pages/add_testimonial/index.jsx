import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@/Components/UserLayout';
import { postTestimonial } from '@/config/redux/action/PostAction';

function Add_Testimonial() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [role, setRole] = useState('');
  const [testimonial, setTestimonial] = useState('');

  const postState = useSelector((state) => state.post);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!testimonial.trim()) {
      alert("Testimonial cannot be empty");
      return;
    }

    dispatch(
      postTestimonial({
        role,
        testimonial,
      })
    );
  };

  // ✅ On success redirect
  useEffect(() => {
    if (postState.isSuccess) {
      router.push('/dashboard');
    }
  }, [postState.isSuccess, router]);

  return (
    <UserLayout>
      <div style={styles.container}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2>Add a Testimonial</h2>

          {postState.isError && (
            <p style={styles.error}>
              {postState.message || "Failed to add testimonial"}
            </p>
          )}

          <label>Role</label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          />

          <label>Testimonial</label>
          <textarea
            placeholder="Write your experience..."
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            style={styles.textarea}
            rows={5}
          />

          <button
            type="submit"
            style={styles.button}
            disabled={postState.isLoading}
          >
            {postState.isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </UserLayout>
  );
}

export default Add_Testimonial;

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    padding: "1rem",
  },
  card: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "480px",
    padding: "2rem",
    borderRadius: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  input: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  textarea: {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  },
  button: {
    marginTop: "1rem",
    padding: "0.75rem",
    borderRadius: "999px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};
