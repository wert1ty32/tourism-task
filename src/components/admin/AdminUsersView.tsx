"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserActive } from "@/lib/actions/admin";
import { getInitials } from "@/lib/avatar";
import type { AdminUser } from "@/lib/data/admin-users";
import { UserFormModal } from "@/components/admin/UserFormModal";
import { ResetPasswordModal } from "@/components/admin/ResetPasswordModal";
import styles from "@/styles/app.module.css";

export function AdminUsersView({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.position ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  function toggleActive(user: AdminUser) {
    startTransition(async () => {
      const result = await setUserActive(user.id, !user.isActive);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Співробітники</h1>
          <p>Керування акаунтами команди департаменту</p>
        </div>
        <div className={styles.headActions}>
          <div className={styles.search}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Пошук співробітників…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className={styles.btnPrimary} onClick={() => setCreating(true)}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.1">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Новий співробітник
          </button>
        </div>
      </div>

      <div className={styles.usersCard}>
        <div className={styles.uheadrow}>
          <span>Співробітник</span>
          <span>Посада</span>
          <span>Роль</span>
          <span>Статус</span>
          <span />
        </div>

        {filteredUsers.length === 0 && <div className={styles.emptyRow}>Нікого не знайдено</div>}

        {filteredUsers.map((user) => (
          <div key={user.id} className={styles.urow}>
            <div className={styles.uwho}>
              <span className={styles.uavatar}>{getInitials(user.name)}</span>
              <div className={styles.uinfo}>
                <b>{user.name}</b>
                <span>{user.email}</span>
              </div>
            </div>

            <div className={styles.uposition}>{user.position ?? "—"}</div>

            <span className={`${styles.badge} ${user.role === "admin" ? styles.badgeAdmin : styles.badgeEmployee}`}>
              {user.role === "admin" ? "Адміністратор" : "Співробітник"}
            </span>

            <span className={`${styles.badge} ${user.isActive ? styles.badgeActive : styles.badgeInactive}`}>
              {user.isActive ? "Активний" : "Деактивований"}
            </span>

            <div className={styles.rowActions}>
              <button
                type="button"
                className={styles.iconBtn}
                title="Редагувати"
                onClick={() => setEditingUser(user)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                title="Скинути пароль"
                onClick={() => setResettingUser(user)}
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="8" cy="14" r="4" />
                  <path d="M10.5 11.5 20 2M17 5l3 3M14 8l2 2" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.iconBtn} ${user.isActive ? styles.iconBtnDanger : ""}`}
                title={user.isActive ? "Деактивувати" : "Активувати"}
                disabled={isPending || user.id === currentUserId}
                onClick={() => toggleActive(user)}
              >
                {user.isActive ? (
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 8l8 8" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {creating && <UserFormModal onClose={() => setCreating(false)} />}
      {editingUser && <UserFormModal user={editingUser} onClose={() => setEditingUser(null)} />}
      {resettingUser && (
        <ResetPasswordModal user={resettingUser} onClose={() => setResettingUser(null)} />
      )}
    </>
  );
}
