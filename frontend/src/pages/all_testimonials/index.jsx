import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import UserLayout from "../layouts/UserLayout";
import { useEffect } from "react";
import styles from "./style.module.css";
import { getAllTestimonialsForPage } from "@/config/redux/action/PostAction";

function AllTestimonials() {
  const dispatch = useDispatch();
  const { testimonialsAll, isLoading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllTestimonialsForPage());
  }, [dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <section className={styles.container}>
          <h2 className={styles.heading}>All Testimonials</h2>

          {isLoading && <p>Loading testimonials...</p>}

          <div className={styles.grid}>
            {Array.isArray(testimonialsAll) &&
              testimonialsAll.map((item) => (
                <div key={item._id} className={styles.card}>
                  <p className={styles.text}>“{item.testimonial}”</p>
                  <div className={styles.user}>
                    <img
                      src={item.userId?.profilePicture || "/default.jpg"}
                      alt="user"
                    />
                    <h4>{item.userId?.name || "Anonymous"}</h4>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </DashboardLayout>
    </UserLayout>
  );
}

export default AllTestimonials;
