import type { Plugin } from "@elizaos/core";
import { TwitterClientInterface } from "@elizaos/client-twitter";
import { rewardAction } from "./actions/reward.ts";

export * as actions from "./actions/index.ts";

export const rewardsPlugin: Plugin = {
    name: "rewards",
    description: "Agent reward user for insightful paper, blog post, article, or simply a social network post",
    actions: [
        rewardAction
    ],
    clients: [TwitterClientInterface],
    evaluators: [],
    providers: [],
};
export default rewardsPlugin;
