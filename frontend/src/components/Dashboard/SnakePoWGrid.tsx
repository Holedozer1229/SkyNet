import React from "react";
import { SentinelOverlay } from "./SentinelOverlay";
import { useOracle } from "../../hooks/useOracle";

interface GridCell {
  color: string;
  type: "empty" | "snake" | "target";
}

interface SnakePoWGridProps {
  grid: GridCell[][];
}

export const SnakePoWGrid: React.FC<SnakePoWGridProps> = ({ grid }) => {
  const { oracleVectors } = useOracle();

  return (
    <div className="relative">
      <div className="grid grid-cols-16 gap-1">
        {grid.flat().map((c, i) => (
          <div 
            key={i} 
            className="w-4 h-4" 
            style={{ background: c.color }} 
          />
        ))}
      </div>

      <SentinelOverlay vectors={oracleVectors} />
    </div>
  );
};
