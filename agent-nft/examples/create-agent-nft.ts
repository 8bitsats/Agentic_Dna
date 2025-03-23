import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { AgentNFTService, AgentMetadata } from '../src';

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log('🧬 Initializing Agent NFT Service...');
    const agentNFTService = new AgentNFTService();

    // Load character.json data
    const characterPath = process.env.CHARACTER_PATH || path.join(__dirname, '../../..', 'characters/character.json');
    console.log(`📄 Loading character data from ${characterPath}`);
    const characterData = JSON.parse(fs.readFileSync(characterPath, 'utf8'));

    // Prepare agent metadata
    const agentMetadata: AgentMetadata = {
      name: characterData.name,
      description: characterData.bio.join(' '),
      agentId: `agent-${Date.now()}`,
      attributes: [
        { trait_type: 'Agent Type', value: 'Eliza' },
        ...characterData.adjectives.slice(0, 5).map(adj => ({
          trait_type: 'Trait',
          value: adj
        })),
        ...characterData.topics.slice(0, 3).map(topic => ({
          trait_type: 'Specialty',
          value: topic
        }))
      ],
      character: characterData
    };

    console.log(`🧪 Creating NFT for agent: ${agentMetadata.name}`);
    console.log('This process includes:');
    console.log('1. Generating unique DNA sequence using NVIDIA API');
    console.log('2. Creating a custom image using Grok/X AI based on the character and DNA');
    console.log('3. Minting an NFT using Metaplex Core');

    // Create the NFT
    const result = await agentNFTService.createAgentNFT(agentMetadata);

    console.log('\n✅ NFT Successfully Created!');
    console.log(`NFT Address: ${result.nftAddress}`);
    console.log(`DNA Hash: ${result.dna.hash}`);
    if (result.imageUrl) {
      console.log(`Image URL: ${result.imageUrl}`);
    }
    console.log('\nComplete Agent Data:');
    console.log(JSON.stringify(result.metadata, null, 2));

  } catch (error) {
    console.error('Error creating Agent NFT:', error);
  }
}

main();
