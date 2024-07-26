import Image from "next/image";
import styles from "./page.module.css";
import StandingsTable from './components/StandingsTable/StandingsTable'
import Layout from "./components/Layout/Layout";

export default function Home() {
  return (
    <Layout title="Standings">
      <h1>Standings</h1>
      <StandingsTable />
    </Layout>
  )
}
