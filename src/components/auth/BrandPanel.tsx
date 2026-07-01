import Image from "next/image";
import styles from "@/styles/auth.module.css";

type BrandPanelProps = {
  eyebrow?: string;
  heading: React.ReactNode;
  description: string;
};

export function BrandPanel({ eyebrow = "Внутрішній робочий простір", heading, description }: BrandPanelProps) {
  return (
    <aside className={styles.brand}>
      <svg className={styles.compass} viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="1">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="34" />
        <polygon points="50,10 56,50 50,90 44,50" fill="#fff" stroke="none" opacity=".8" />
        <polygon points="10,50 50,44 90,50 50,56" fill="#fff" stroke="none" opacity=".45" />
        <circle cx="50" cy="50" r="3" fill="#fff" stroke="none" />
      </svg>

      <svg className={`${styles.leaf} ${styles.l1}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 6 4 11 4 16c0 3 2 6 6 6 6 0 10-7 10-16 0-1-.5-3-1-4-3 3-5 4-7 4z" />
      </svg>
      <svg className={`${styles.leaf} ${styles.l2}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 6 4 11 4 16c0 3 2 6 6 6 6 0 10-7 10-16 0-1-.5-3-1-4-3 3-5 4-7 4z" />
      </svg>
      <svg className={`${styles.leaf} ${styles.l3}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7 6 4 11 4 16c0 3 2 6 6 6 6 0 10-7 10-16 0-1-.5-3-1-4-3 3-5 4-7 4z" />
      </svg>

      <div className={styles.brandHead}>
        <Image src="/logo.png" alt="Tourism Department" width={66} height={66} priority />
        <div className={styles.titles}>
          <small>Tourism Department</small>
          <b>Система управління задачами</b>
        </div>
      </div>

      <div className={styles.brandBody}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1>{heading}</h1>
        <p>{description}</p>
        <div className={styles.pills}>
          <span className={styles.pill}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M8 4v16M14 4v10" />
            </svg>
            Дошки
          </span>
          <span className={styles.pill}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Задачі
          </span>
          <span className={styles.pill}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <circle cx="9" cy="7" r="4" />
              <path d="M2 21v-2a6 6 0 0 1 6-6M17 11l2 2 4-4" />
            </svg>
            Команда
          </span>
        </div>
      </div>

      <svg className={styles.ridge} viewBox="0 0 800 180" preserveAspectRatio="none" fill="none">
        <path
          d="M0 180 L0 120 L120 60 L220 110 L340 30 L470 120 L600 55 L720 105 L800 70 L800 180 Z"
          fill="#234A1F"
          opacity=".55"
        />
        <path
          d="M0 180 L0 140 L150 95 L300 140 L430 80 L560 135 L690 90 L800 125 L800 180 Z"
          fill="#1C3D18"
          opacity=".8"
        />
        <path d="M330 40 L340 30 L352 44 L346 42 L342 48 L338 41 Z" fill="#DCEBD6" opacity=".9" />
        <path d="M590 66 L600 55 L611 68 L605 65 L601 71 L597 65 Z" fill="#DCEBD6" opacity=".85" />
        <path d="M690 34 l14 3 -4 4 6 1 -1 3 -8 -1 -3 5 -2 -5 z" fill="#A8D5A8" opacity=".9" />
      </svg>
    </aside>
  );
}
