import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTestimonials } from "@/config/redux/action/PostAction";
import styles from "./testimonials.module.css";
import { useRouter } from "next/router";

function Testimonials() {
  const dispatch = useDispatch();
  const { testimonials, isLoading } = useSelector((state) => state.post);
  const router = useRouter();
  useEffect(() => {
    dispatch(getAllTestimonials());
  }, [dispatch]);

  return (
      <section className={styles.container}>
        <h2 className={styles.heading}>What People Say About Networx</h2>
        <p className={styles.subheading}>
          Real experiences from real people
        </p>

        {isLoading && <p>Loading testimonials...</p>}

        <div className={styles.grid}>
          {testimonials.map((item) => (
            <div key={item._id} className={styles.card}>
              <p className={styles.text}>“{item.testimonial}”</p>

              <div className={styles.user}>
                <img
                  src={
                    item.userId?.profilePicture || "/default.jpg"
                  }
                  alt="user"
                  className={styles.avatar}
                />
                <div>
                  <h4 className={styles.name}>
                    {item.userId?.name || "Anonymous"}
                  </h4>
                  <p className={styles.role}>{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
        className={styles.viewMore}
        onClick={() => router.push("/all_testimonials")}
      >
        View More →
      </button>
      </section>
  
  );
}

export default Testimonials;
