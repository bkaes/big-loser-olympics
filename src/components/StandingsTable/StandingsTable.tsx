"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Medal from "../Medal/Medal";
import useWindowWidth from "@/hooks/useWindowWidth";
import Medalists from "@/components/Medalists/Medalists";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Card } from "@components/ui/card";
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
    date: Date; // Assuming date is stored as a string in 'YYYY-MM-DD' format
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
        <div className="w-full">

            <Accordion type="single" collapsible className="w-full">
                {standings.map((standing, index) => (
                    <AccordionItem key={standing.player_id} value={standing.player_id}>
                        <AccordionTrigger className="w-full">
                            <div className="grid grid-cols-4 gap-4 w-full items-center">
                                <div className="flex items-center">
                                    <span className="mr-2">{index + 1}</span>
                                    <span>{formatName(standing.player_name)}</span>
                                </div>
                                <div className="flex items-center">
                                    <Image
                                        src={`https://flagcdn.com/w40/${standing.alpha2.toLowerCase()}.png`}
                                        alt={standing.country_name}
                                        width={28}
                                        height={20}
                                    />
                                    <span className="ml-2">
                                        {windowWidth > 600 ? standing.country_name : standing.alpha3}
                                    </span>
                                </div>
                                <div className="flex justify-center">
                                    <Medal type="gold" size={25} number={standing.gold_medals || 0} />
                                    <Medal type="silver" size={25} number={standing.silver_medals || 0} numberColor="white" />
                                    <Medal type="bronze" size={25} number={standing.bronze_medals || 0} />
                                </div>
                                <div className="text-center">Total: {standing.total_medals || 0}</div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Card className="bg-gray-600 text-zinc-300 border-none">
                            <Medalists medalData={getMedalDataForCountry(standing.country_id)} />
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default StandingsTable;