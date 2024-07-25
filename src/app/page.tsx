import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1>Welcome to Olympic Data</h1>
        <p>Choose Standings or Data Viewer from the navigation menu.</p>
      </div>

    </main>
  );
}
