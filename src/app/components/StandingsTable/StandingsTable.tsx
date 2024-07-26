'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MedalData {
  [country: string]: {
    gold: number
    silver: number
    bronze: number
  }
}

interface Team {
  name: string
  team: string
  flagURL: string
}

export default function StandingsTable() {
  const [medalData, setMedalData] = useState<MedalData | null>(null)
  const [teamsData, setTeamsData] = useState<Team[] | null>(null)
  const [sortColumn, setSortColumn] = useState<number>(5)
  const [sortAscending, setSortAscending] = useState<boolean>(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [medalsResponse, teamsResponse] = await Promise.all([
          fetch('/data/olympic_medals.json'),
          fetch('/data/countries.json')
        ])
        const medals = await medalsResponse.json()
        const teams = await teamsResponse.json()
        setMedalData(medals)
        setTeamsData(teams)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  function sortTableData(column: number) {
    if (!teamsData || !medalData) return

    const newTeamsData = [...teamsData].sort((a, b) => {
      const aValue = column === 0 ? a.name : 
                     column === 1 ? a.team :
                     column === 2 ? medalData[a.team].gold :
                     column === 3 ? medalData[a.team].silver :
                     column === 4 ? medalData[a.team].bronze :
                     medalData[a.team].gold + medalData[a.team].silver + medalData[a.team].bronze
      const bValue = column === 0 ? b.name :
                     column === 1 ? b.team :
                     column === 2 ? medalData[b.team].gold :
                     column === 3 ? medalData[b.team].silver :
                     column === 4 ? medalData[b.team].bronze :
                     medalData[b.team].gold + medalData[b.team].silver + medalData[b.team].bronze

      return sortAscending ? aValue - bValue : bValue - aValue
    })

    setTeamsData(newTeamsData)
    setSortColumn(column)
    setSortAscending(!sortAscending)
  }

  return (
    <table id="standingsTable">
      <thead>
        <tr>
          <th onClick={() => sortTableData(0)}>Name</th>
          <th onClick={() => sortTableData(1)}>Country</th>
          <th onClick={() => sortTableData(2)}>Gold</th>
          <th onClick={() => sortTableData(3)}>Silver</th>
          <th onClick={() => sortTableData(4)}>Bronze</th>
          <th onClick={() => sortTableData(5)}>Total Medals</th>
        </tr>
      </thead>
      <tbody>
        {teamsData && medalData && teamsData.map((team) => {
          const medals = medalData[team.team]
          const totalMedals = medals.gold + medals.silver + medals.bronze
          return (
            <tr key={team.team}>
              <td>{team.name}</td>
              <td>
                <Image src={team.flagURL} alt={team.name} width={20} height={20} />
                {team.team}
              </td>
              <td>{medals.gold}</td>
              <td>{medals.silver}</td>
              <td>{medals.bronze}</td>
              <td>{totalMedals}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}