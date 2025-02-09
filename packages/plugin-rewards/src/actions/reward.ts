import type {
    ActionExample,
    IAgentRuntime,
    Memory,
    Action,
    State,
    HandlerCallback,
} from "@elizaos/core";

import {
    generateTrueOrFalse,
    booleanFooter,
    ModelClass,
    composeContext,
} from "@elizaos/core";
import { initWalletProvider } from "../providers/wallet";

import * as ethers from "ethers";
import { Address, parseEther } from "viem";

export const shouldRewardTemplate =
    `Based on the content shared:

{{recentMessages}}

Should {{agentName}} reward this content with $WAGMI tokens? Evaluate against these criteria:

1. Cypherpunk Manifesto Alignment:
- Promotes privacy, cryptography, and individual liberty
- Supports decentralization and peer-to-peer systems
- Advocates for technological solutions to social problems

2. Montreal Declaration for Responsible AI Compliance:
- Respects human rights, dignity, and privacy
- Promotes democratic values and collective wellbeing
- Ensures transparency and accountability
- Prevents discrimination and bias

3. Content Quality:
- Contains substantial, original content (not just brief comments)
- Demonstrates thoughtful analysis or insights
- Contributes meaningfully to the AI/crypto ecosystem

4. Additional Framework Alignment:
- Follows ethical AI development principles
- Promotes sustainable and responsible blockchain usage
- Considers environmental and social impact

Respond with YES if:
- The content strongly aligns with at least 2 major criteria above
- Contains the #WagmAI hashtag
- Represents genuine, valuable contribution

Otherwise, respond with NO.
` + booleanFooter;

// Define the contract ABI and address
const wagmiTokenAbi = ["function mint(address to, uint256 amount) external"];
const wagmiTokenAddress = "0xfE3AB163DCE342e3aC727831f688e0Ce2aBe2731";

// Define the reward amount
const rewardAmount = ethers.parseUnits("10", 18); // 10 $WAGMI tokens

export const rewardAction: Action = {
    name: "REWARD",
    similes: ["REWARD_USER", "GIVE_TOKENS", "MINT_TOKENS"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        console.log(">>> reward validating----------------------------------");
        const { content } = _message;
        const { text } = content;
        // Check if the post contains the #wAIgmi hashtag
        return text.includes("#WagmAI");
    },
    description:
        "Reward a user with 10 $WAGMI tokens if their post contains the #WagmAI hashtag.",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const { content } = _message;

        console.log("================================================", _message)

        const { text } = content;
        const tmpRewardAddress = "0x89DAfD27228EfAf547E74BcB7ACAFA4D97437e91" as Address;

        // Check if the post contains the #wAIgmi hashtag
        if (text.includes("#WagmAI")) {
            try {
                const shouldRewardContext = composeContext({
                    state,
                    template: shouldRewardTemplate,
                });

                const shouldReward = await generateTrueOrFalse({
                    runtime: _runtime,
                    context: shouldRewardContext,
                    modelClass: ModelClass.MEDIUM,
                });

                console.log(
                    "shouldReward: -------------------------------------->",
                    shouldReward
                );

                _runtime.cacheManager.set(`${_message.userId}-rewarded-${Date.now()}`, true)

                const walletProvider = await initWalletProvider(_runtime);

                return

                const walletClient = await walletProvider.getWalletClient();


                console.log("walletClient: -------------------------------------->", walletClient);

                //@ts-ignore
                const tx = await walletClient.sendTransaction({
                    to: "0x89DAfD27228EfAf547E74BcB7ACAFA4D97437e91",
                    value: parseEther('0.000001')
                });

                console.log(
                    "receipt: -------------------------------------->",
                    tx
                );

                console.log(
                    `Rewarded ${tmpRewardAddress} with 10 $WAGMI tokens.`
                );
                if (callback) {
                    callback({
                        text: `Here we go, you got rewarded for your publication 🎉 10 $WAGMAI tokens directly on your address ${tmpRewardAddress}, check it out: }`,
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
                content: {
                    text: "You've been rewarded with 10 $WAGMI tokens!",
                    action: "REWARD",
                },
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
