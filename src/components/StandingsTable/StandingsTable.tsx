'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import Medal from '../Medal/Medal';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface PlayerStanding {
    player_id: string;
    player_name: string;
    country_name: string;
    alpha2: string;
    alpha3: string;
    gold_medals: number;
    silver_medals: number;
    bronze_medals: number;
    total_medals: number;
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
            const { data, error } = await supabase.rpc('get_player_standings_with_medals');
            
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
                        <th>Medals</th>
                        <th>Total Medals</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((standing, index) => (
                        <tr key={standing.player_id.toString()}>
                            <td>{index + 1}</td>
                            <td>{standing.player_name}</td>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Image src={`https://flagcdn.com/w40/${standing.alpha2.toLowerCase()}.png`} alt={standing.country_name} width={28} height={20} />
                                {standing.country_name}
                            </td>
                            <td>
                                <Medal type="gold" size={25} number={standing.gold_medals || 0} />
                                <Medal type="silver" size={25} number={standing.silver_medals || 0} numberColor="white" />
                                <Medal type="bronze" size={25} number={standing.bronze_medals || 0} />
                            </td>
                            <td>{standing.total_medals || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StandingsTable;