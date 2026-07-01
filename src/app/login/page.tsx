"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { BrandPanel } from "@/components/auth/BrandPanel";
import styles from "@/styles/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Невірний email або пароль.");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className={styles.shell}>
      <BrandPanel
        heading={
          <>
            Плануйте, розподіляйте, <span>рухайтесь далі.</span>
          </>
        }
        description="Дошки задач, картки та виконавці — усе для злагодженої роботи команди в одному місці. Увійдіть, щоб продовжити."
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

          <h2>Вхід до системи</h2>
          <p className={styles.sub}>
            Введіть облікові дані, надані адміністратором, щоб продовжити роботу.
          </p>

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

            <div className={styles.field}>
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                name="password"
                placeholder=" "
                autoComplete="current-password"
                required
              />
              <label htmlFor="pass">Пароль</label>
              <svg className={styles.ico} viewBox="0 0 24 24">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              <button
                type="button"
                className={styles.toggle}
                aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className={styles.row}>
              <label className={styles.remember}>
                <input type="checkbox" name="remember" />
                <span className={styles.box}>
                  <svg viewBox="0 0 24 24">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                </span>
                Запам&apos;ятати мене
              </label>
              <a href="/forgot-password" className={styles.link}>
                Забули пароль?
              </a>
            </div>

            {error && <div className={styles.formError}>{error}</div>}

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "Вхід..." : "Увійти"}
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className={styles.note}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v4h1" />
            </svg>
            <p>
              <b>Немає доступу?</b> Реєстрація закрита. Облікові записи співробітників створює
              адміністратор департаменту — зверніться до нього за обліковими даними.
            </p>
          </div>

          <div className={styles.foot}>
            <div className={styles.divider}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M12 2C7 6 4 11 4 16c0 3 2 6 6 6 6 0 10-7 10-16 0-1-.5-3-1-4-3 3-5 4-7 4z" />
              </svg>
            </div>
            © 2026 Tourism Department · Внутрішня система
          </div>
        </div>
      </main>
    </div>
  );
}
