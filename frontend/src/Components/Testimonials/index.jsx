import React from "react";
import styles from "./testimonials.module.css";

function Testimonials() {
  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>What People Say About Networx</h2>
      <p className={styles.subheading}>
        Real experiences from real people using Networx
      </p>

      <div className={styles.grid}>
        {/* Testimonial 1 */}
        <div className={styles.card}>
          <p className={styles.text}>
            “Networx feels very professional and genuine.  
            I connected with seniors who actually guided me.”
          </p>

          <div className={styles.user}>
            <img
              src="https://i.pravatar.cc/100?img=1"
              alt="user"
              className={styles.avatar}
            />
            <div>
              <h4 className={styles.name}>Rahul Sharma</h4>
              <p className={styles.role}>Software Engineer</p>
            </div>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className={styles.card}>
          <p className={styles.text}>
            “Finally a platform without fake stories.  
            Networx is clean, calm, and actually useful.”
          </p>

          <div className={styles.user}>
            <img
              src="https://i.pravatar.cc/100?img=2"
              alt="user"
              className={styles.avatar}
            />
            <div>
              <h4 className={styles.name}>Anjali Patil</h4>
              <p className={styles.role}>UI/UX Designer</p>
            </div>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className={styles.card}>
          <p className={styles.text}>
            “Networx helped me build meaningful connections,  
            not just followers.”
          </p>

          <div className={styles.user}>
            <img
              src="https://i.pravatar.cc/100?img=3"
              alt="user"
              className={styles.avatar}
            />
            <div>
              <h4 className={styles.name}>Amit Kulkarni</h4>
              <p className={styles.role}>Final Year Student</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
