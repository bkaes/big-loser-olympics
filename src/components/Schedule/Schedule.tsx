"use client";

import React from "react";
import useWindowWidth from "@/hooks/useWindowWidth";
import "./Schedule.css";
import SportIcon from "../SportIcon/SportIcon";
import { EnhancedTooltip } from "@/components/ui/tooltip";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface ScheduleProps {
    eventData: EventEntry[];
}

export interface EventEntry {
    country_id: number
    sport: string
    event: string
    phase: string
    cannot_win_medal: boolean
    athletes: string[]
    start_time: Date
}

const Schedule: React.FC<ScheduleProps> = ({ eventData }) => {
    const windowWidth = useWindowWidth();
    const formatDate = (dateString) => {
        if (dateString && dateString !== "") {
            const dateObj = new Date(dateString);
            const options = {
                month: 'numeric' as 'numeric',
                day: 'numeric' as 'numeric',
                hour: '2-digit' as '2-digit',
                minute: '2-digit' as '2-digit',
                timeZone: 'America/New_York'
            };
            return dateObj.toLocaleString('en-US', options);
        }
        return "";
    };

    const formatPhase = (phaseString) => {
        if (phaseString == "N/A") {
            return ""
        }
        return phaseString
    }
    const currentDateTime = new Date();
    const filteredAndSortedEvents = eventData
        .filter(event => new Date(event.start_time) >= currentDateTime && event.sport !== "Paris 2024")
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());


    return (
        <div className="medalists-container ">
            <CardHeader>
                <CardTitle className="font-bold p-0 grid grid-cols-2 gap-4">Schedule </CardTitle>
                <CardDescription className="text-primary-foreground text-xs">
                    Some events might not be medal placing. See wikipedia for more info (ex. playing for fourth fifth etc.)
                    
                </CardDescription>
                <div className="grid grid-cols-4 font-bold  pt-4 pb-2">
                    <div>Sport</div>
                    <div>Phase</div>
                    <div>Athletes</div>
                    <div className="justify-self-end">Date</div>
                </div>
            </CardHeader>
            <CardContent className="overflow-scroll max-h-52">
                {filteredAndSortedEvents.map((event, index) => (
                    <div key={index} className="grid grid-cols-4 pt-4 pb-2 items-center border-b">
                        <div className="flex  ">
                            <EnhancedTooltip content={
                                <div className="flex  flex-col text-center">
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
                        <div>{formatPhase(event.phase)}</div>
                        <div>{event.athletes.join(", ")}</div>
                        {event && event.start_time ? <div className="justify-self-end">{formatDate(event.start_time)}</div> : ""}
                    </div>
                ))}
            </CardContent>
        </div>
    );
};

export default Schedule;