"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { changePassword } from "@/lib/actions/change-password";
import styles from "@/styles/auth.module.css";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forced = session?.user?.mustChangePassword ?? false;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setError("Паролі не збігаються.");
      setIsSubmitting(false);
      return;
    }

    const result = await changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    await update({ mustChangePassword: false });
    router.push("/");
    router.refresh();
  }

  return (
    <div className={styles.shell}>
      <BrandPanel
        eyebrow="Безпека акаунта"
        heading={
          <>
            Встановіть <span>новий пароль.</span>
          </>
        }
        description="Ваш пароль було задано адміністратором. Створіть власний, щоб продовжити роботу в системі."
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

          <h2>Зміна пароля</h2>
          <p className={styles.sub}>
            {forced
              ? "Перш ніж продовжити, встановіть власний пароль замість тимчасового."
              : "Введіть поточний пароль і новий, яким хочете його замінити."}
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder=" "
                autoComplete="current-password"
                required
              />
              <label htmlFor="currentPassword">Поточний пароль</label>
              <svg className={styles.ico} viewBox="0 0 24 24">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </div>

            <div className={styles.field}>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder=" "
                autoComplete="new-password"
                minLength={8}
                required
              />
              <label htmlFor="newPassword">Новий пароль</label>
              <svg className={styles.ico} viewBox="0 0 24 24">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </div>

            <div className={styles.field}>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder=" "
                autoComplete="new-password"
                minLength={8}
                required
              />
              <label htmlFor="confirmPassword">Підтвердіть новий пароль</label>
              <svg className={styles.ico} viewBox="0 0 24 24">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </div>

            {error && <div className={styles.formError}>{error}</div>}

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "Збереження..." : "Зберегти пароль"}
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
