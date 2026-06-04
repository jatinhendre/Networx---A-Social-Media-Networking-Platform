import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import UserLayout from "./layouts/UserLayout";
import Testimonials from "@/Components/Testimonials";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout hideFooter={false}>
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>
          <div className={styles.heroLeft}>

            <h1 className={styles.heroTitle}>
              Connect with Friends <br />
              <span className={styles.gradientText}>Without Exaggeration</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Make Your Own Network and Get Connected with Your Friends and Family.
            </p>

            <div className={styles.heroActions}>
              <button
                className={styles.primaryButton}
                onClick={() => router.push("/login")}
              >
                Join Now
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.imageWrapper}>
              <Image
                src='/images/hero_image.png'
                alt="People connecting illustration"
                fill
                priority
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </section>
      <Testimonials>
      </Testimonials>
    </UserLayout>
  );
}