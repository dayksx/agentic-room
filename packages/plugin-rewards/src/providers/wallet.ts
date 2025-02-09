import {
    createPublicClient,
    createTestClient,
    createWalletClient,
    formatUnits,
    http,
    publicActions,
    walletActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
    type IAgentRuntime,
    type Provider,
    type Memory,
    type State,
    type ICacheManager,
    elizaLogger,
} from "@elizaos/core";
import type {
    Address,
    WalletClient,
    PublicClient,
    Chain,
    HttpTransport,
    Account,
    PrivateKeyAccount,
    TestClient,
} from "viem";
import * as viemChains from "viem/chains";
import NodeCache from "node-cache";
import * as path from "node:path";
import { PrivyClient } from "@privy-io/server-auth";
import { createViemAccount } from "@privy-io/server-auth/viem";

const _SupportedChainList = Object.keys(viemChains) as Array<
    keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

export class WalletProvider {
    chains: Record<string, Chain> = { ...viemChains };
    private privyClient: PrivyClient;
    private walletId: string;
    private address: Address;
    private currentChain: SupportedChain = "arbitrumSepolia";

    constructor(
        walletId: string,
        address: Address,
        privyApiKey: string,
        privyApiSecret: string,
        chains?: Record<string, Chain>
    ) {
        this.privyClient = new PrivyClient(privyApiKey, privyApiSecret);
        this.walletId = walletId;
        this.address = address;
        this.setChains(chains);

        if (chains && Object.keys(chains).length > 0) {
            this.setCurrentChain(Object.keys(chains)[0] as SupportedChain);
        }
    }

    async getAddress(): Promise<Address> {
        const wallet = await this.privyClient.getUserBySmartWalletAddress(
            this.walletId
        );

        return wallet.smartWallet.address[0] as Address;
    }

    getCurrentChain(): Chain {
        return this.chains[this.currentChain];
    }

    private setChains = (chains?: Record<string, Chain>) => {
        if (!chains) {
            return;
        }
        for (const chain of Object.keys(chains)) {
            this.chains[chain] = chains[chain];
        }
    };

    private setCurrentChain = (chain: SupportedChain) => {
        this.currentChain = chain;
    };

    async getWalletClient(): Promise<WalletClient> {
        const account = await createViemAccount({
            walletId: this.walletId,
            address: this.address,
            privy: this.privyClient,
        });

        console.log(
            "account: -------------------------------------->",
            account
        );

        const walletClient = createWalletClient({
            account,
            chain: this.chains[this.currentChain],
            transport: http(),
        });

        return walletClient;
    }

    async sendTransaction(
        to: Address,
        value: bigint
    ): Promise<{ hash: string }> {
        const chain = this.getCurrentChain();

        const { data } = await this.privyClient.walletApi.rpc({
            walletId: this.walletId,
            method: "eth_sendTransaction",
            caip2: `eip155:${chain.id}`,
            params: {
                transaction: {
                    to,
                    value: value.toString(),
                    chainId: chain.id,
                },
            },
        });

        // @ts-ignore
        return data.hash;
    }

    static genChainFromName(
        chainName: string,
        customRpcUrl?: string | null
    ): Chain {
        const baseChain = viemChains[chainName];

        if (!baseChain?.id) {
            throw new Error("Invalid chain name");
        }

        const viemChain: Chain = customRpcUrl
            ? {
                  ...baseChain,
                  rpcUrls: {
                      ...baseChain.rpcUrls,
                      custom: {
                          http: [customRpcUrl],
                      },
                  },
              }
            : baseChain;

        return viemChain;
    }
}

const genChainsFromRuntime = (
    runtime: IAgentRuntime
): Record<string, Chain> => {
    const chainNames =
        (runtime.character.settings.chains?.evm as SupportedChain[]) || [];
    const chains: Record<string, Chain> = {};

    for (const chainName of chainNames) {
        const rpcUrl = runtime.getSetting(
            `ETHEREUM_PROVIDER_${chainName.toUpperCase()}`
        );
        const chain = WalletProvider.genChainFromName(chainName, rpcUrl);
        chains[chainName] = chain;
    }

    const mainnet_rpcurl = runtime.getSetting("EVM_PROVIDER_URL");
    if (mainnet_rpcurl) {
        const chain = WalletProvider.genChainFromName(
            "mainnet",
            mainnet_rpcurl
        );
        chains["mainnet"] = chain;
    }

    return chains;
};

export const initWalletProvider = async (runtime: IAgentRuntime) => {
    const privyApiKey = runtime.getSetting("PRIVY_APP_ID");
    if (!privyApiKey) {
        throw new Error("PRIVY_APP_ID is required");
    }

    const privyApiSecret = runtime.getSetting("PRIVY_API_SECRET");
    if (!privyApiSecret) {
        throw new Error("PRIVY_API_SECRET is required");
    }

    const walletId = runtime.getSetting("PRIVY_WALLET_ID");

    if (!walletId) {
        throw new Error("PRIVY_WALLET_ID is required");
    }

    const address = runtime.getSetting("EVM_WALLET_ADDRESS") as Address;

    const chains = genChainsFromRuntime(runtime);

    return new WalletProvider(
        walletId,
        address,
        privyApiKey,
        privyApiSecret,
        chains
    );
};

export const evmWalletProvider: Provider = {
    async get(
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State
    ): Promise<string | null> {
        try {
            const walletProvider = await initWalletProvider(runtime);
            const address = await walletProvider.getAddress();
            const chain = walletProvider.getCurrentChain();
            const agentName = state?.agentName || "The agent";
            return `${agentName}'s EVM Wallet Address: ${address}\n ${chain.nativeCurrency.symbol}\nChain ID: ${chain.id}, Name: ${chain.name}`;
        } catch (error) {
            console.error("Error in EVM wallet provider:", error);
            return null;
        }
    },
};
