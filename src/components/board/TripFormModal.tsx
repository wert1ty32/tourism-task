"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrip, updateTrip, type TripInput } from "@/lib/actions/trips";
import type { TripWithResponsibles, Employee } from "@/lib/data/trips";
import styles from "@/styles/app.module.css";

const STATUS_LABELS: Record<TripInput["status"], string> = {
  planned: "Заплановано",
  in_prep: "У підготовці",
  done: "Завершено",
};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function TripFormModal({
  trip,
  initialStatus = "planned",
  employees,
  onClose,
}: {
  trip?: TripWithResponsibles;
  initialStatus?: TripInput["status"];
  employees: Employee[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(trip?.title ?? "");
  const [destination, setDestination] = useState(trip?.destination ?? "");
  const [description, setDescription] = useState(trip?.description ?? "");
  const [date, setDate] = useState(trip ? toDateInputValue(trip.date) : "");
  const [costEur, setCostEur] = useState(trip ? String(trip.costEur) : "");
  const [status, setStatus] = useState<TripInput["status"]>(trip?.status ?? initialStatus);
  const [responsibleIds, setResponsibleIds] = useState<string[]>(
    trip?.responsibles.map((r) => r.id) ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleResponsible(id: string) {
    setResponsibleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const input: TripInput = {
      title,
      destination,
      description,
      date,
      costEur: Number(costEur),
      status,
      responsibleIds,
    };

    try {
      if (trip) {
        await updateTrip(trip.id, input);
      } else {
        await createTrip(input);
      }
      router.refresh();
      onClose();
    } catch {
      setError("Не вдалося зберегти поїздку. Перевірте поля та спробуйте ще раз.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{trip ? "Редагувати поїздку" : "Нова поїздка"}</h2>
        <form className={styles.formGrid} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Назва</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div>
              <label htmlFor="destination">Місце призначення</label>
              <input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="date">Дата</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description">Опис</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div>
              <label htmlFor="costEur">Вартість, €</label>
              <input
                id="costEur"
                type="number"
                min="0"
                step="0.01"
                value={costEur}
                onChange={(e) => setCostEur(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="status">Статус</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TripInput["status"])}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label>Відповідальні</label>
            <div className={styles.checkboxRow}>
              {employees.map((employee) => {
                const checked = responsibleIds.includes(employee.id);
                return (
                  <button
                    type="button"
                    key={employee.id}
                    className={`${styles.checkboxChip} ${checked ? styles.checked : ""}`}
                    onClick={() => toggleResponsible(employee.id)}
                  >
                    {employee.name}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className={styles.formGrid}>{error}</div>}

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
