"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/lib/actions/admin";
import type { AdminUser } from "@/lib/data/admin-users";
import styles from "@/styles/app.module.css";

export function UserFormModal({
  user,
  onClose,
}: {
  user?: AdminUser;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [position, setPosition] = useState(user?.position ?? "");
  const [role, setRole] = useState<"admin" | "employee">(user?.role ?? "employee");
  const [startPassword, setStartPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = user
        ? await updateUser(user.id, { name, role, position })
        : await createUser({ name, email, role, position, startPassword });

      if (!result.ok) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("Не вдалося зберегти співробітника. Перевірте поля та спробуйте ще раз.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{user ? "Редагувати співробітника" : "Новий співробітник"}</h2>
        <form className={styles.formGrid} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Ім&apos;я</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user}
              required
            />
            {user && <div className={styles.formHint}>Email не можна змінити після створення акаунта.</div>}
          </div>

          <div className={styles.formRow}>
            <div>
              <label htmlFor="position">Посада</label>
              <input id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
            </div>
            <div>
              <label htmlFor="role">Роль</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value as "admin" | "employee")}>
                <option value="employee">Співробітник</option>
                <option value="admin">Адміністратор</option>
              </select>
            </div>
          </div>

          {!user && (
            <div>
              <label htmlFor="startPassword">Стартовий пароль</label>
              <input
                id="startPassword"
                type="text"
                value={startPassword}
                onChange={(e) => setStartPassword(e.target.value)}
                minLength={8}
                required
              />
              <div className={styles.formHint}>
                Співробітник отримає цей пароль і має змінити його при першому вході.
              </div>
            </div>
          )}

          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
              {isSubmitting ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
