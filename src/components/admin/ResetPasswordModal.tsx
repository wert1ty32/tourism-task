"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetUserPassword } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/data/admin-users";
import styles from "@/styles/app.module.css";

export function ResetPasswordModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await resetUserPassword(user.id, newPassword);
      router.refresh();
      onClose();
    } catch {
      setError("Не вдалося скинути пароль. Спробуйте ще раз.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Скинути пароль</h2>
        <p className={styles.sub}>
          Новий тимчасовий пароль для <b>{user.name}</b>. Співробітник має змінити його при
          наступному вході.
        </p>
        <form className={styles.formGrid} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword">Новий пароль</label>
            <input
              id="newPassword"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? "Збереження..." : "Скинути пароль"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
