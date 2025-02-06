import type {
  ActionExample,
  IAgentRuntime,
  Memory,
  Action,
  State,
  HandlerCallback,
} from "@elizaos/core";

import * as ethers from "ethers";

// Define the contract ABI and address
const wagmiTokenAbi = [
  "function mint(address to, uint256 amount) external",
];
const wagmiTokenAddress = "0xfE3AB163DCE342e3aC727831f688e0Ce2aBe2731";

// Define the reward amount
const rewardAmount = ethers.parseUnits("10", 18); // 10 $WAGMI tokens

export const rewardAction: Action = {
  name: "REWARD",
  similes: ["REWARD_USER", "GIVE_TOKENS", "MINT_TOKENS"],
  validate: async (_runtime: IAgentRuntime, _message: Memory) => {
    console.log(">>> reward validating");
    const { content } = _message;
    const { text } = content;
    // Check if the post contains the #wAIgmi hashtag
    return text.includes("#WagmAI");
  },
  description: "Reward a user with 10 $WAGMI tokens if their post contains the #WagmAI hashtag.",
  handler: async (
      _runtime: IAgentRuntime,
      _message: Memory,
      state: State,
      _options: { [key: string]: unknown },
      callback?: HandlerCallback
  ): Promise<boolean> => {
        console.log(">>> reward handling");
      const { content } = _message;
      const { text } = content;
      const tmpRewardAddress = '0x224b11F0747c7688a10aCC15F785354aA6493ED6';

      // Check if the post contains the #wAIgmi hashtag
      if (text.includes("#WagmAI")) {
          try {
              // Initialize the provider and signer
              console.log('evm provider url: ', process.env.EVM_PROVIDER_URL);
              const provider = new ethers.JsonRpcProvider(process.env.EVM_PROVIDER_URL, {
                name: 'arbitrumSepolia',
                chainId: 421614, // Sepolia testnet chain ID
              });
              console.log('provider: ', provider);
              const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider);
              console.log('signer: ', signer);
              
              // Initialize the contract
              const wagmiTokenContract = new ethers.Contract(wagmiTokenAddress, wagmiTokenAbi, signer);
              console.log('wagmiTokenContract: ', wagmiTokenContract);
              
              // Mint the tokens to the user
              const tx = await wagmiTokenContract.mint(tmpRewardAddress, rewardAmount);
              console.log('tx: ', tx);
              await tx.wait();

              console.log(`Rewarded ${tmpRewardAddress} with 10 $WAGMI tokens.`);
              if (callback) {
                callback({
                    text: `Here we go, you got rewarded for your publication 🎉 10 $WAGMAI tokens directly on your address ${tmpRewardAddress}, check it out: https://sepolia.arbiscan.io/tx/${tx.hash}`,
                    content: {
                        success: true,
                        recipient: tmpRewardAddress,
                    },
                });
            }
              return true;
          } catch (error) {
              console.error("Error rewarding user:", error);
              return false;
          }
      }

      return false;
  },
  examples: [
      [
          {
              user: "{{user1}}",
              content: { text: "Check out my new post! #wAIgmi" },
          },
          {
              user: "{{user2}}",
              content: { text: "You've been rewarded with 10 $WAGMI tokens!", action: "REWARD" },
          },
      ],
      [
          {
              user: "{{user1}}",
              content: { text: "Another post without the hashtag." },
          },
          {
              user: "{{user2}}",
              content: { text: "No reward for this post.", action: "NONE" },
          },
      ],
  ] as ActionExample[][],
} as Action;