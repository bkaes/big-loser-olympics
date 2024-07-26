'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize the Supabase client

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface PlayerStanding {
    player_name: string;
    country: string;
    alpha2: string;
    alpha3: string;
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
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player Name</th>
                        <th>Country</th>
                        <th>Gold</th>
                        <th>Silver</th>
                        <th>Bronze</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((standing, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{standing.player_name}</td>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Image src={"https://flagcdn.com/w40/" + standing.alpha2.toLowerCase() + ".png"} alt={standing.country} width={28} height={20} />
                                {standing.country}
                            </td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>  
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StandingsTable;