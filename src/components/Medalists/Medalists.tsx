"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import useWindowWidth from "@/hooks/useWindowWidth";
import "./Medalists.css";
import SportIcon from "../SportIcon/SportIcon";
import {
    EnhancedTooltip
} from "@/components/ui/tooltip"

interface MedalistsProps {
    medalData: MedalEntry[];
}

interface MedalEntry {
    country_id: number
    sport: string;
    event: string;
    medal: string;
    athlete_names: string[];
    date: string; // Assuming date is stored as a string in 'YYYY-MM-DD' format
}


const Medalists: React.FC<MedalistsProps> = ({ medalData }) => {
    const windowWidth = useWindowWidth();
    return (
        <table className="medalists-table">
            <thead>
                <tr>
                    <th>Sport</th>
                    <th>Name</th>
                    <th>Event</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {medalData.map((medal, index) => (
                    <React.Fragment key={index}>
                        <tr key={index}>
                            <td>
                                <div className="flex justify-center items-center space-x">
                                    <EnhancedTooltip content={
                                        <div>
                                            <div>{medal.sport}</div>
                                            <div>{medal.event}</div>
                                        </div>
                                    }>
                                        <SportIcon
                                            sport={medal.sport}
                                            primaryColor="#fff"
                                        />
                                    </EnhancedTooltip>
                                    <div className="flex flex-col items-center justify-center">

                                    </div>
                                </div>
                            </td>
                            <td>{medal.medal}</td>
                            <td>{medal.athlete_names}</td>
                            <td>{medal.date}</td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default Medalists;
