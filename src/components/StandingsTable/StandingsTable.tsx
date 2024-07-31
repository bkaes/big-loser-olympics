"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Medal from "../Medal/Medal";
import useWindowWidth from "@/hooks/useWindowWidth";
import Medalists, { MedalEntry as MedalEntry } from "@/components/Medalists/Medalists";
import { motion, AnimatePresence } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import Schedule from "../Schedule/Schedule";
import { EventEntry as EventEntry } from "../Schedule/Schedule";
import { Button } from "../ui/button";
import { EnhancedTooltip } from "../ui/tooltip";
import SportIcon from "../SportIcon/SportIcon";


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


const StandingsTable: React.FC = () => {
    const [standings, setStandings] = useState<PlayerStanding[]>([]);
    const [medalData, setMedalData] = useState<MedalEntry[]>([]);
    const [eventData, setEventData] = useState<EventEntry[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const windowWidth = useWindowWidth(); // Use the custom hook


    useEffect(() => {
        fetchStandings()
        fetchMedalData()
        fetchEventData()

    }, []);
    const getTextClass = () => {
        if (windowWidth < 640) return 'text-[0.6rem]';
        if (windowWidth < 768) return 'text-lg';
        return 'text-sm';
    };
    const getBiggerTextClass = () => {
        if (windowWidth < 640) return 'text-sm';
        if (windowWidth < 768) return 'text-lg';
        return 'text-sm';
    };

    const countryMap = useMemo(() => {
        const map = new Map<number, string>();
        standings.forEach(standing => {
            map.set(standing.country_id, standing.country_name);
        });
        return map;
    }, [standings]);

    // Helper function to get country name from ID
    const getCountryName = (countryId: number) => {
        return countryMap.get(countryId) || `Country ${countryId}`;
    };

    const formatDate = (dateString: string) => {
        if (dateString && dateString !== "") {
            const dateObj = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York'
            };
            return dateObj.toLocaleString('en-US', options);
        }
        return "";
    };

    const formatPhase = (phaseString: string) => {
        if (phaseString == "N/A") {
            return ""
        }
        return phaseString
    }

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    const filteredEventData = eventData.filter(event => {
        const eventDate = new Date(event.start_time);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return isSameDay(eventDate, today) || isSameDay(eventDate, tomorrow);
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

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
    const fetchEventData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*');

            if (error) {
                throw error;
            }

            if (data) {
                setEventData(data as EventEntry[]);
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

    const getEventDataForCountry = (countryId: number): EventEntry[] => {
        return eventData.filter(event => event.country_id === countryId);
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
                            <div className="flex flex-col text-center m-4">
                                <Button className="mb-2" size="sm" onClick={() => window.open(`https://en.wikipedia.org/wiki/${standing.country_name}_at_the_2024_Summer_Olympics`, '_blank', 'noopener,noreferrer')}>View Wikipedia Entry</Button>
                                <div className="text-white text-xs pl-1"> (can see who is competing for a medal)</div>
                            </div>
                            {getMedalDataForCountry(standing.country_id).length > 0 &&
                                <Card className="bg-gray-600 text-zinc-300 border-none pb-2 mb-4">
                                    <Medalists medalData={getMedalDataForCountry(standing.country_id)} />
                                </Card>
                            }
                            <Card className="bg-gray-600 text-zinc-300 border-none">
                                <Schedule eventData={getEventDataForCountry(standing.country_id)} />
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Card className="mt-8 bg-gray-600 text-zinc-300 border-none">
                <CardHeader>
                    <CardTitle className="font-bold p-0">All Countries Schedule (Today and Tomorrow)</CardTitle>
                    <CardDescription className="text-primary-foreground text-xs">
                        Upcoming events for all countries today and tomorrow
                    </CardDescription>
                    <div className="grid grid-cols-5 font-bold pt-4 pb-2">
                        <div className={`${getBiggerTextClass()}`}>Sport</div>
                        <div className={`${getBiggerTextClass()}`}>Country</div>
                        <div className={`${getBiggerTextClass()}`}>Phase</div>
                        <div className={`${getBiggerTextClass()}`}>Athletes</div>
                        <div className={`justify-self-end ${getBiggerTextClass()}`}>Date</div>
                    </div>
                </CardHeader>
                <CardContent className="overflow-scroll max-h-96">
                    {filteredEventData.map((event, index) => (
                        <div key={index} className={`grid grid-cols-5 pt-4 pb-2 items-center border-b text-xs text-wrap `}>
                            <div className="flex">
                                <EnhancedTooltip content={
                                    <div className="flex flex-col text-center">
                                        <div>{event.sport}</div>
                                        <div>{event.event}</div>
                                    </div>
                                }>
                                    <div>
                                        <SportIcon
                                            sport={event.sport}
                                            primaryColor="#fff"
                                        />
                                    </div>
                                </EnhancedTooltip>
                            </div>
                            <div className={`break-words ${getTextClass()}`}>{getCountryName(event.country_id)}</div>
                            <div className={`break-words ${getTextClass()}`}>{formatPhase(event.phase)}</div>
                            <div className={`break-words ${getTextClass()}`}>{event.athletes.join(", ")}</div>
                            <div className={`justify-self-end break-words ${getTextClass()}`}>{formatDate(event.start_time.toString())}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default StandingsTable;