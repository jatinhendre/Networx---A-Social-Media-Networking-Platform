import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import UserLayout from "./layouts/UserLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <section className={styles.heroWrapper}>
        <div className={styles.hero}>

          {/* LEFT */}
          <div className={styles.heroLeft}>
            <span className={styles.heroBadge}>🚀 New Social Experience</span>

            <h1 className={styles.heroTitle}>
              Connect with Friends <br />
              <span className={styles.gradientText}>Without Exaggeration</span>
            </h1>

            <p className={styles.heroSubtitle}>
              A genuine social media platform focused on real stories,
              real people, and meaningful connections — no bluffs, no noise.
            </p>

            <div className={styles.heroActions}>
              <button
                className={styles.primaryButton}
                onClick={() => router.push("/login")}
              >
                Join Now
              </button>

              <button
                className={styles.secondaryButton}
                onClick={() => router.push("/login")}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.heroRight}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/image.png"
                alt="People connecting illustration"
                fill
                priority
                className={styles.heroImage}
              />
            </div>
          </div>

        </div>
      </section>
    </UserLayout>
  );
}
