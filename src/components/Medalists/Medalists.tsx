"use client";

import React from "react";
import useWindowWidth from "@/hooks/useWindowWidth";
import "./Medalists.css";
import SportIcon from "../SportIcon/SportIcon";
import { EnhancedTooltip } from "@/components/ui/tooltip";
import { CardContent, CardHeader } from "../ui/card";

interface MedalistsProps {
    medalData: MedalEntry[];
}

export interface MedalEntry {
    country_id: number;
    sport: string;
    event: string;
    medal: string;
    athlete_names: string[];
    date: Date; // Assuming date is stored as a string in 'YYYY-MM-DD' format
}
function TextLimiter( text: string ) {
    const displayText = text.length > 30 ? `${text.substring(0, 30)}...` : text;
  
    return <span>{displayText}</span>;
  };
const Medalists: React.FC<MedalistsProps> = ({ medalData }) => {
    const windowWidth = useWindowWidth();
    const formatDate = (dateString) => {
        if (dateString && dateString !== "") {
            const dateObj = new Date(dateString);
            return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        }
        return "";
    };
    return (
        <div className="medalists-container">
            <CardHeader >
            <div className="font-bold">Medals</div>
            <div className="grid grid-cols-4 font-bold  pt-4 pb-2">
                <div>Sport</div>
                <div>Medal</div>
                <div>Name</div>
                <div className="justify-self-end">Date</div>
                </div>
            </CardHeader>
            <CardContent>
                {medalData.map((medal, index) => (
                    <div key={index} className="grid grid-cols-4 pt-4 pb-2 items-center border-b">
                        <div className="flex  ">
                            <EnhancedTooltip content={
                                <div className="flex  flex-col text-center">
                                    <div>{medal.sport}</div>
                                    <div>{medal.event}</div>
                                </div>
                            }>
                                    <SportIcon
                                        sport={medal.sport}
                                        primaryColor="#fff"
                                    />
                            </EnhancedTooltip>
                        </div>
                        <div>{medal.medal}</div>
                        <EnhancedTooltip content={
                                <div className="flex  flex-col text-center">
                                    <div>{medal.athlete_names.join(", ")}</div>
                                </div>
                            }>
                        <div>{TextLimiter(medal.athlete_names.join(", "))}</div>
                        </EnhancedTooltip>

                        {medal && medal.date ? <div className="justify-self-end">{formatDate(medal.date)}</div> : ""}
                    </div>
                ))}
            </CardContent>
        </div>
    );
};

export default Medalists;