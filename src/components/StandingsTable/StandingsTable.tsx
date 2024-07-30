"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Medal from "../Medal/Medal";
import { ChevronDown, ChevronUp } from "lucide-react";
import useWindowWidth from "@/hooks/useWindowWidth";
import Medalists from "@/components/Medalists/Medalists";
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

interface PlayerStanding {
    player_id: string;
    player_name: string;
    country_id: number
    country_name: string;
    alpha2: string;
    alpha3: string;
    gold_medals: number;
    silver_medals: number;
    bronze_medals: number;
    total_medals: number;
    additional_info?: string; // Add this line
}

interface MedalEntry {
    country_id: number
    sport: string;
    event: string;
    medal: string;
    athlete_names: string[];
    date: string; // Assuming date is stored as a string in 'YYYY-MM-DD' format
}

const StandingsTable: React.FC = () => {
    const [standings, setStandings] = useState<PlayerStanding[]>([]);
    const [medalData, setMedalData] = useState<MedalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState({});
    
    const windowWidth = useWindowWidth(); // Use the custom hook

    const toggleRow = (playerId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [playerId]: !prev[playerId],
        }));
    };

    useEffect(() => {
        fetchStandings();
        fetchMedalData();
    }, []);

    const widthThreshold = 600;
    const flexDirection = windowWidth > widthThreshold ? "flex-row" : "flex-col";
    const fetchStandings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.rpc(
                "get_player_standings_with_medals"
            );

            if (error) {
                setError(error.message);
                console.error("Error fetching player standings:", error);
            } else {
                setStandings(data as PlayerStanding[]);
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching player standings:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMedalData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('medalists')
                .select('*');

            if (error) {
                throw error;
            }

            if (data) {
                setMedalData(data as MedalEntry[]);
            }
        } catch (error) {
            console.error('Error fetching medal data:', error);
            setError('Failed to fetch medal data');
        } finally {
            setLoading(false);
        }
    };
    const formatName = (fullName) => {
        if (windowWidth > widthThreshold) {
            return fullName; // Return full name if above threshold
        } else {
            const names = fullName.split(" ");
            if (names.length > 1) {
                return `${names[0]} ${names[1][0]}.`; // Abbreviate last name
            }
            return names[0]; // Return single name as is
        }
    };



    const getMedalDataForCountry = (countryId: number): MedalEntry[] => {
        return medalData.filter(medal => medal.country_id === countryId);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <table>
                <thead>
                    <tr className="cursor-pointer whitespace-nowrap">
                        <th className="text-left">Name</th>
                        <th
                            className={
                                windowWidth > widthThreshold ? `text-left` : "text-center"
                            }
                        >
                            Country
                        </th>
                        <th>Medals</th>
                        <th>{windowWidth > widthThreshold ? "Total Medals" : "Total"}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((standing, index) => (
                        <React.Fragment key={standing.player_id.toString()}>
                            <tr
                                onClick={() => toggleRow(standing.player_id)}
                                className="cursor-pointer "
                            >
                                <td className="text-left flex whitespace-nowrap">
                                    <div className="pr-2"> {index + 1} </div>
                                    <div> {formatName(standing.player_name)} </div>
                                </td>
                                <td>
                                    <div className={`flex ${flexDirection} items-center`}>
                                        <Image
                                            src={`https://flagcdn.com/w40/${standing.alpha2.toLowerCase()}.png`}
                                            alt={standing.country_name}
                                            width={28}
                                            height={20}
                                        />
                                        <div className={windowWidth > widthThreshold ? `pl-2` : ""}>
                                            {windowWidth > widthThreshold
                                                ? standing.country_name
                                                : standing.alpha3}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex justify-center">
                                        <div className="pr-1">
                                            <Medal
                                                type="gold"
                                                size={windowWidth > widthThreshold ? 25 : 25}
                                                number={standing.gold_medals || 0}
                                            />
                                        </div>
                                        <div className="pr-1">
                                            <Medal
                                                type="silver"
                                                size={25}
                                                number={standing.silver_medals || 0}
                                                numberColor="white"
                                            />
                                        </div>
                                        <div>
                                            <Medal
                                                type="bronze"
                                                size={25}
                                                number={standing.bronze_medals || 0}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>{standing.total_medals || 0}</td>
                                <td>
                                    {expandedRows[standing.player_id] ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </td>
                            </tr>
                            <AnimatePresence>
              {expandedRows[standing.player_id] && (
                <motion.tr
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    height: { 
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98] // Custom easing function
                    },
                    opacity: { duration: 0.3 }
                  }}
                >
                  <td colSpan={5} className="overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1, // Slight delay for content to start after row begins expanding
                      }}
                      className="p-4 bg-gray-50"
                    >
                      <Medalists medalData={getMedalDataForCountry(standing.country_id)} />
                    </motion.div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>

                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StandingsTable;
