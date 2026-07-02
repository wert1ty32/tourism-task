import { getTrips, getEmployees } from "@/lib/data/trips";
import { CalendarView } from "@/components/calendar/CalendarView";
import styles from "@/styles/app.module.css";

export default async function CalendarPage() {
  const [trips, employees] = await Promise.all([getTrips(), getEmployees()]);

  return (
    <main className={styles.wrap}>
      <CalendarView trips={trips} employees={employees} />
    </main>
  );
}
