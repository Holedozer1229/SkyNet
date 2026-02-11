import React from "react";
import { OpenSeaLink } from "./OpenSeaLink";

interface NFT {
  tokenId: string;
  name: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export const NFTCard: React.FC<{ nft: NFT }> = ({ nft }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <img 
        src={nft.image} 
        alt={nft.name} 
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      
      <h3 className="text-white text-lg font-semibold mb-2">{nft.name}</h3>
      
      <div className="space-y-1 mb-3">
        {nft.attributes.map((attr, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-400">{attr.trait_type}:</span>
            <span className="text-white">{attr.value}</span>
          </div>
        ))}
      </div>

      <OpenSeaLink tokenId={nft.tokenId} />
    </div>
  );
};
