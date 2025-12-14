import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import UserLayout from "./layouts/UserLayout";

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
    <div className={styles.heroWrapper}>
      <div className={styles.hero}>
        {/* LEFT */}
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Connect with Friends without <br /> Exaggeration
          </h1>

          <p className={styles.heroSubtitle}>
            A true social media platform, with stories and connections – no bluffs.
          </p>

          <button
            className={styles.heroButton}
            onClick={() => router.push("/login")}
          >
            Join Now
          </button>
        </div>

        {/* RIGHT */}
        <div className={styles.heroRight}>
          {/* apni image lagao yaha */}
          <Image
            src="/images/image.png"
            alt="People connecting illustration"
            className={styles.heroImage}
            width={140}
            height={140}
          />
        </div>
      </div>
    </div>
    </UserLayout>
  );
}
