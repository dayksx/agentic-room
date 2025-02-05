import type {
  ActionExample,
  IAgentRuntime,
  Memory,
  Action,
} from "@elizaos/core";
import { ethers } from "ethers";

// Define the contract ABI and address
const wagmiTokenAbi = [
  "function mint(address to, uint256 amount) external",
];
const wagmiTokenAddress = "0xfE3AB163DCE342e3aC727831f688e0Ce2aBe2731";

// Define the reward amount
const rewardAmount = ethers.utils.parseUnits("10", 18); // 10 $WAGMI tokens

export const rewardAction: Action = {
  name: "REWARD",
  similes: ["REWARD_USER", "GIVE_TOKENS", "MINT_TOKENS"],
  validate: async (_runtime: IAgentRuntime, _message: Memory) => {
    const { content } = _message;
    const { text } = content;

    // Check if the post contains the #wAIgmi hashtag
    return text.includes("#wAIgmi");
  },
  description: "Reward a user with 10 $WAGMI tokens if their post contains the #wAIgmi hashtag.",
  handler: async (
      _runtime: IAgentRuntime,
      _message: Memory
  ): Promise<boolean> => {
      const { userId, content } = _message;
      const { text } = content;
      const tmpRewardAddress = '0x224b11F0747c7688a10aCC15F785354aA6493ED6';

      // Check if the post contains the #wAIgmi hashtag
      if (text.includes("#wAIgmi")) {
          try {
              // Initialize the provider and signer
              const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_PROJECT_ID);
              const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

              // Initialize the contract
              const wagmiTokenContract = new ethers.Contract(wagmiTokenAddress, wagmiTokenAbi, signer);

              // Mint the tokens to the user
              const tx = await wagmiTokenContract.mint(tmpRewardAddress, rewardAmount);
              await tx.wait();

              console.log(`Rewarded ${tmpRewardAddress} with 10 $WAGMI tokens.`);
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