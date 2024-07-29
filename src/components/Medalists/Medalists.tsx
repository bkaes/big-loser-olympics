"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Medal from "../Medal/Medal";
import { ChevronDown, ChevronUp } from "lucide-react";
import useWindowWidth from "@/hooks/useWindowWidth";
import "./Medalists.css";
import SportIcon from "../SportIcon/SportIcon";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

interface MedalInfo {
  Sport: string;
  SubSport: string;
  Event: string;
  Gold: number;
  Silver: number;
  Bronze: number;
  Total: number;
}

const medalInfoData: MedalInfo[] = [
  {
    Sport: "Archery",
    SubSport: "Pool",
    Event: "100m Freestyle",
    Gold: 1,
    Silver: 1,
    Bronze: 1,
    Total: 3,
  },
  {
    Sport: "Water-Polo",
    SubSport: "waterPolo",
    Event: "200m Sprint",
    Gold: 1,
    Silver: 0,
    Bronze: 2,
    Total: 3,
  },
  {
    Sport: "badminton",
    SubSport: "Artistic",
    Event: "Balance Beam",
    Gold: 0,
    Silver: 1,
    Bronze: 1,
    Total: 2,
  },
  {
    Sport: "basketball3x3",
    SubSport: "Road",
    Event: "Individual Time Trial",
    Gold: 1,
    Silver: 1,
    Bronze: 0,
    Total: 2,
  },
  {
    Sport: "Judo",
    SubSport: "Heavyweight",
    Event: "Men's +100 kg",
    Gold: 0,
    Silver: 1,
    Bronze: 2,
    Total: 3,
  },
  {
    Sport: "Tennis",
    SubSport: "Singles",
    Event: "Women's Singles",
    Gold: 1,
    Silver: 1,
    Bronze: 1,
    Total: 3,
  },
  {
    Sport: "Volleyball",
    SubSport: "Beach",
    Event: "Men's Tournament",
    Gold: 1,
    Silver: 0,
    Bronze: 1,
    Total: 2,
  },
];

const Medalists: React.FC = () => {
  const [standings, setStandings] = useState<MedalInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState({});
  const windowWidth = useWindowWidth(); // Use the custom hook

  const toggleRow = (playerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  /*     useEffect(() => {
        fetchStandings();
    }, []); */

  const widthThreshold = 600;
  const flexDirection = windowWidth > widthThreshold ? "flex-row" : "flex-col";
  /*     const fetchStandings = async () => {
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
    }; */

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table className="medalists-table">
      <thead>Results</thead>
      <tbody>
        {medalInfoData.map((medalInfo, index) => (
          <React.Fragment key={index}>
            <tr>
              <td>
                <div className="flex">
                  <SportIcon
                    sport={medalInfo.Sport}
                    subsport={medalInfo.SubSport}
                    primaryColor="#fff"
                  />
                  {medalInfo.Sport}({medalInfo.SubSport})
                </div>
              </td>
              <td>{medalInfo.Event}</td>
              <td>{medalInfo.Gold}</td>
              <td>{medalInfo.Silver}</td>
              <td>{medalInfo.Bronze}</td>
              <td>{medalInfo.Total}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Medalists;
