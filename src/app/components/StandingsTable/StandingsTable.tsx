'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize the Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface PlayerStanding {
    player_name: string;
    country: string;
  }
  
  const StandingsTable: React.FC = () => {
    const [standings, setStandings] = useState<PlayerStanding[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      fetchStandings();
    }, []);
  
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc('get_player_standings');
        console.log(data[0])
        if (error) {
          setError(error.message);
          console.error('Error fetching player standings:', error);
        } else {
          setStandings(data as PlayerStanding[]);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching player standings:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div>
        <h1>Player Standings</h1>
        <table>
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr key={index}>
                <td>{standing.player_name}</td>
                <td>{standing.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default StandingsTable;