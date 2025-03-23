import { AgentNFTService } from '../src';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['NVIDIA_API_KEY', 'SOLANA_RPC_ENDPOINT', 'WALLET_PRIVATE_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is required`);
    process.exit(1);
  }
}

// Sample character data (replace with actual character.json content)
const characterData = {
  name: 'Eliza Agent',
  role: 'Virtual Assistant',
  capabilities: [
    'Natural language processing',
    'Task automation',
    'Knowledge retrieval'
  ],
  personality: {
    traits: [
      'helpful',
      'intelligent',
      'creative'
    ],
    communication_style: 'friendly'
  },
  appearance: {
    avatar: 'default_avatar.png'
  }
};

async function mintAgentNFT() {
  console.log('Initializing Agent NFT Service...');
  
  // Initialize the service
  const agentNftService = new AgentNFTService(
    process.env.NVIDIA_API_KEY!,
    process.env.SOLANA_RPC_ENDPOINT!,
    process.env.WALLET_PRIVATE_KEY!
  );
  
  // Check wallet balance
  const balance = await agentNftService.getWalletBalance();
  console.log(`Wallet balance: ${balance} SOL`);
  
  if (balance < 0.05) {
    console.warn('Warning: Low wallet balance. Minting an NFT requires SOL for transaction fees.');
    // Continue anyway for demonstration purposes
  }
  
  console.log('Generating DNA and minting NFT for agent...');
  
  // Generate DNA and mint NFT
  const result = await agentNftService.generateAndMintAgentNFT({
    agentName: characterData.name,
    agentDescription: `A ${characterData.personality.traits.join(', ')} ${characterData.role}`,
    agentTraits: characterData.personality.traits,
    characterData: characterData,
    visualizationStyle: 'helix',
    dnaOptions: {
      temperature: 0.7,
      length: 200,
      topK: 40
    },
    nftOptions: {
      symbol: 'ELIZA',
      externalUrl: 'https://eliza.app',
      royalty: 5, // 5%
      attributes: [
        {
          trait_type: 'Role',
          value: characterData.role
        },
        {
          trait_type: 'Communication Style',
          value: characterData.personality.communication_style
        }
      ]
    }
  });
  
  if (result.success) {
    console.log('✅ Agent NFT created successfully!');
    console.log(`🧬 DNA Length: ${result.dna?.sequence.length} bp`);
    console.log(`🧬 DNA Hash: ${result.dna?.hash}`);
    console.log(`🖼️ Image saved to: ${result.imagePath}`);
    console.log(`🔗 NFT Address: ${result.nftResult?.mintAddress}`);
    console.log(`🔗 Explorer URL: ${result.nftResult?.explorerUrl}`);
    
    // In a real integration, you would update your agent data with the NFT information
    console.log('\nIn a real integration, you would update your agent data with:');
    console.log({
      nftAddress: result.nftResult?.mintAddress,
      dnaSequence: result.dna?.sequence.substring(0, 20) + '...',
      dnaHash: result.dna?.hash
    });
  } else {
    console.error('❌ Failed to create agent NFT:');
    console.error(result.error);
  }
}

// Run the example
mintAgentNFT().catch(err => {
  console.error('Error in mint-agent-nft example:', err);
});
