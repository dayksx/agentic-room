import type { Plugin } from "@elizaos/core";
import { rewardAction } from "./actions/reward.ts";

export * as actions from "./actions/index.ts";

export const rewardsPlugin: Plugin = {
    name: "rewards",
    description: "Agent reward user for insightful paper, blog post, article, or simply a social network post",
    actions: [
        rewardAction
    ],
    evaluators: [],
    providers: [],
};
export default rewardsPlugin;
