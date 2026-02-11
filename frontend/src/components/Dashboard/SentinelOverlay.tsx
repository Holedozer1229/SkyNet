import React from "react";

interface OracleVector {
  x: number;
  y: number;
  strength: number; // 0..1
  type: "danger" | "reward";
}

export const SentinelOverlay: React.FC<{ vectors: OracleVector[] }> = ({ vectors }) => {
  return (
    <>
      {vectors.map((v, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 rounded-full opacity-80"
          style={{
            left: v.x * 18,
            top: v.y * 18,
            background:
              v.type === "reward"
                ? `rgba(34,197,94,${v.strength})`
                : `rgba(239,68,68,${v.strength})`
          }}
        />
      ))}
    </>
  );
};
