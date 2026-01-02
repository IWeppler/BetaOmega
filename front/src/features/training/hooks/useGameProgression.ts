import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface ILevelConfig {
  value: string;
  label: string;
  min_xp: number;
  xp_reward: number;
  color: string;
}

export const useGameProgression = (currentXp: number) => {
  const [currentLevel, setCurrentLevel] = useState<ILevelConfig | null>(null);
  const [nextLevel, setNextLevel] = useState<ILevelConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("difficulty_levels")
        .select("*")
        .order("min_xp", { ascending: true });

      if (data) {
        let foundLevelIndex = -1;

        data.forEach((lvl, index) => {
          if (currentXp >= lvl.min_xp) {
            foundLevelIndex = index;
          }
        });

        if (foundLevelIndex !== -1) {
          setCurrentLevel(data[foundLevelIndex]);
          setNextLevel(data[foundLevelIndex + 1] || null);
        }
      }
      setLoading(false);
    };

    fetchConfig();
  }, [currentXp]);

  return { currentLevel, nextLevel, loading };
};
