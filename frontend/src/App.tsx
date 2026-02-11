import React from 'react';
import { SnakePoWGrid } from './components/Dashboard/SnakePoWGrid';
import { NFTCard } from './components/NFT/NFTCard';

function App() {
  // Example grid data - in production, this would come from your mining API
  const exampleGrid = Array(16).fill(null).map(() => 
    Array(16).fill(null).map(() => ({ 
      color: '#1f2937', 
      type: 'empty' as const 
    }))
  );

  // Example NFT data
  const exampleNFT = {
    tokenId: '1',
    name: 'SKYNT Genesis #1',
    image: 'https://via.placeholder.com/300',
    attributes: [
      { trait_type: 'Power', value: 85 },
      { trait_type: 'Wisdom', value: 72 },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Endurance', value: 95 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SKYNT</h1>
        <p className="text-gray-400">Oracle-Assisted Proof-of-Work Protocol</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Snake-II PoW Grid</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <SnakePoWGrid grid={exampleGrid} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Dynamic NFTs</h2>
          <NFTCard nft={exampleNFT} />
        </section>
      </div>
    </div>
  );
}

export default App;
