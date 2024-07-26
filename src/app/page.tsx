import Image from "next/image";
import styles from "./page.module.css";
import StandingsTable from './components/StandingsTable/StandingsTable'

export default function Home() {
  return (
    <div>
      <h1>Standings</h1>
      <StandingsTable />
    </div>
  )
}
