"use client";

import { useMemo, useState } from "react";
import { TripFormModal } from "@/components/board/TripFormModal";
import { TripDetailsModal } from "@/components/trips/TripDetailsModal";
import { Money } from "@/components/currency/Money";
import { getMonthGridWeeks, getTripsInMonth, isSameDay, layoutWeekEvents } from "@/lib/calendar-layout";
import { MONTHS_UK_FULL, WEEKDAYS_UK_SHORT, formatDateRangeUk } from "@/lib/date";
import type { TripWithResponsibles, Employee } from "@/lib/data/trips";
import styles from "@/styles/app.module.css";

const STATUS_EVENT_CLASS = {
  planned: "evPlan",
  in_prep: "evPrep",
  done: "evDone",
} as const;

export function CalendarView({
  trips,
  employees,
}: {
  trips: TripWithResponsibles[];
  employees: Employee[];
}) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewingTrip, setViewingTrip] = useState<TripWithResponsibles | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripWithResponsibles | null>(null);

  const weeks = useMemo(() => getMonthGridWeeks(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthTrips = useMemo(
    () => getTripsInMonth(trips, viewYear, viewMonth),
    [trips, viewYear, viewMonth],
  );

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  function goPrevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function goNextMonth() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1>Календар поїздок</h1>
          <p>Заплановані поїздки команди на місяць</p>
        </div>
        <div className={styles.calNav}>
          <button type="button" className={styles.todayBtn} onClick={goToToday}>
            Сьогодні
          </button>
          <button type="button" className={styles.nbtn} aria-label="Попередній місяць" onClick={goPrevMonth}>
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className={styles.navMonth}>
            {MONTHS_UK_FULL[viewMonth]} {viewYear}
          </div>
          <button type="button" className={styles.nbtn} aria-label="Наступний місяць" onClick={goNextMonth}>
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.legend}>
        <span>
          <i className={styles.lgPlan} />
          Заплановані
        </span>
        <span>
          <i className={styles.lgPrep} />
          У підготовці
        </span>
        <span>
          <i className={styles.lgDone} />
          Завершені
        </span>
      </div>

      <div className={styles.calScroll}>
        <div className={styles.cal}>
          <div className={styles.weekdays}>
            {WEEKDAYS_UK_SHORT.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>

          {weeks.map((weekDays) => {
            const segments = layoutWeekEvents(weekDays, trips);
            const rowCount = segments.reduce((max, seg) => Math.max(max, seg.row), 0);

            return (
              <div className={styles.week} key={weekDays[0].toISOString()}>
                <div className={styles.weekDays}>
                  {weekDays.map((day) => {
                    const isOther = day.getMonth() !== viewMonth;
                    const isToday = isSameDay(day, today);
                    const dayClass = [
                      styles.day,
                      isOther ? styles.dayOther : "",
                      isToday ? styles.dayToday : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <div className={dayClass} key={day.toISOString()}>
                        <span className={styles.dayNum}>{day.getDate()}</span>
                      </div>
                    );
                  })}
                </div>

                {rowCount > 0 && (
                  <div
                    className={styles.weekEvents}
                    style={{ gridTemplateRows: `repeat(${rowCount}, 26px)` }}
                  >
                    {segments.map((seg) => (
                      <button
                        type="button"
                        key={seg.trip.id + seg.colStart}
                        className={`${styles.event} ${styles[STATUS_EVENT_CLASS[seg.trip.status]]}`}
                        style={{ gridColumn: `${seg.colStart} / ${seg.colEnd}`, gridRow: seg.row }}
                        onClick={() => setViewingTrip(seg.trip)}
                      >
                        <span className={styles.edot} />
                        {seg.trip.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <section className={styles.agenda}>
        <h3>Поїздки цього місяця</h3>
        {monthTrips.map((trip) => (
          <button
            type="button"
            key={trip.id}
            className={styles.agRow}
            onClick={() => setViewingTrip(trip)}
          >
            <span className={`${styles.agStrip} ${styles[STATUS_EVENT_CLASS[trip.status]]}`} />
            <span className={styles.agInfo}>
              <b>{trip.title}</b>
              <span>
                {formatDateRangeUk(trip.startDate, trip.endDate)} · {trip.destination}
              </span>
            </span>
            <span className={styles.agCost}>
              <Money amountEur={trip.costEur} />
            </span>
          </button>
        ))}
      </section>

      {viewingTrip && (
        <TripDetailsModal
          trip={viewingTrip}
          onClose={() => setViewingTrip(null)}
          onEdit={() => {
            setEditingTrip(viewingTrip);
            setViewingTrip(null);
          }}
        />
      )}

      {editingTrip && (
        <TripFormModal trip={editingTrip} employees={employees} onClose={() => setEditingTrip(null)} />
      )}
    </>
  );
}
