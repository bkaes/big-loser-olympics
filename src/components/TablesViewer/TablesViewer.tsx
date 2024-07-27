'use client'

import { useState, useEffect } from 'react'

interface OlympicData {
  [country: string]: Array<{
    sport: string
    sportSubcategory?: string
    name: string
    headerRows: string[][]
    tableData: string[][]
  }>
}

export default function TablesViewer() {
  const [olympicData, setOlympicData] = useState<OlympicData | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/olympic_data.json')
        const data = await response.json()
        setOlympicData(data)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  function displayCountryData() {
    if (!olympicData || !selectedCountry) return null

    return olympicData[selectedCountry].map((table, index) => (
      <div key={index}>
        {table.sport !== olympicData[selectedCountry][index - 1]?.sport && (
          <div className="sport">
            <h2>{table.sport}</h2>
          </div>
        )}
        {table.sportSubcategory && (
          <div className="subcategory">{table.sportSubcategory}</div>
        )}
        <table>
          <caption>{table.name}</caption>
          <thead>
            {table.headerRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <th key={cellIndex}>{cell}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
  }

  return (
    <div>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select a country</option>
        {olympicData &&
          Object.keys(olympicData).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
      </select>
      <div id="dataContainer">{displayCountryData()}</div>
    </div>
  )
}
