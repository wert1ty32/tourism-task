"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { requestPasswordReset } from "@/lib/actions/request-password-reset";
import styles from "@/styles/auth.module.css";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    await requestPasswordReset(email);

    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.shell}>
      <BrandPanel
        eyebrow="Відновлення доступу"
        heading={
          <>
            Забули пароль? <span>Ми допоможемо.</span>
          </>
        }
        description="Вкажіть свій робочий email — ми надішлемо посилання для встановлення нового пароля."
      />

      <main className={styles.panel}>
        <div className={styles.card}>
          <div className={styles.mobileLogo}>
            <Image src="/logo.png" alt="Tourism Department" width={78} height={78} priority />
            <div>
              <small>Tourism Department</small>
              <br />
              <b>Управління задачами</b>
            </div>
          </div>

          <h2>Відновлення пароля</h2>
          <p className={styles.sub}>
            Введіть email, вказаний адміністратором при створенні вашого акаунта.
          </p>

          {submitted ? (
            <div className={styles.formSuccess} style={{ marginTop: 24 }}>
              Якщо такий email зареєстровано в системі, на нього надіслано інструкції для
              відновлення пароля.
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  autoComplete="username"
                  required
                />
                <label htmlFor="email">Логін або Email</label>
                <svg className={styles.ico} viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>

              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? "Надсилання..." : "Надіслати посилання"}
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          )}

          <div className={styles.foot} style={{ marginTop: submitted ? 24 : 0 }}>
            <a href="/login" className={styles.link}>
              ← Повернутися до входу
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
