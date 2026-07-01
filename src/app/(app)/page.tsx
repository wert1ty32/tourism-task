import { getTrips, getEmployees } from "@/lib/data/trips";
import { BoardView } from "@/components/board/BoardView";
import styles from "@/styles/app.module.css";

export default async function BoardPage() {
  const [trips, employees] = await Promise.all([getTrips(), getEmployees()]);

  return (
    <main className={styles.wrap}>
      <BoardView trips={trips} employees={employees} />
    </main>
  );
}
