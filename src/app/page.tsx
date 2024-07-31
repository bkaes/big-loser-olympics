"use client"
import Image from "next/image";
import styles from "./page.module.css";
import StandingsTable from '../components/StandingsTable/StandingsTable'
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div title="Standings">
      <div className="grid grid-cols-2 gap-2">
      <h1>Standings</h1>
      <Button className="justify-self-end" size="sm"  onClick={() =>  window.open("https://olympics.com/en/paris-2024/schedule", '_blank', 'noopener,noreferrer')}>Olympics.com Schedule</Button>
      </div>
      <StandingsTable />
    </div>
  )
}
