import React from "react";

export const OpenSeaLink: React.FC<{ tokenId: string }> = ({ tokenId }) => {
  const collection = import.meta.env.VITE_OPENSEA_COLLECTION;
  const chain = import.meta.env.VITE_EVM_CHAIN; // ethereum | base

  return (
    <a
      href={`https://opensea.io/assets/${chain}/${collection}/${tokenId}`}
      target="_blank"
      rel="noreferrer"
      className="text-indigo-400 underline text-sm"
    >
      View on OpenSea
    </a>
  );
};
