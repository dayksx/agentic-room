'use client';

import React from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Cog, Twitter } from "lucide-react";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import type { UUID } from "@elizaos/core";
import { formatAgentName } from "@/lib/utils";
import { toast } from "sonner";

export default function ClaimPage() {
    const [isAuthenticated] = React.useState(false);

    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000
    });

    const claimMutation = useMutation({
        mutationFn: async () => {
           // return await apiClient.post(`/api/rewards/claim/${agentId}`);
        },
        onSuccess: () => {
            toast.success("Successfully claimed WAGMI tokens!");
        },
        onError: (error) => {
            toast.error("Failed to claim tokens: " + error.message);
        }
    });

    const agents = query?.data?.agents;

    const handleTwitterLogin = async () => {
        // Here you would implement Twitter OAuth flow
        // For now, we'll just mock it
        window.open(`${import.meta.env.VITE_API_URL}/auth/twitter`, '_blank');
    };

    const handleClaim = async () => {
        if (!isAuthenticated) {
            toast.error("Please login with Twitter first");
            return;
        }
        claimMutation.mutate();
    };

    return (
        <div className="flex flex-col gap-4 h-full p-4">
            <PageTitle title="Claim Rewards" />
            
            {!isAuthenticated && (
                <div className="mb-4">
                    <Button
                        onClick={handleTwitterLogin}
                        className="flex items-center gap-2"
                    >
                        <Twitter className="w-4 h-4" />
                        Login with Twitter
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {agents?.map((agent: { id: UUID; name: string }) => (
                    <Card key={agent.id}>
                        <CardHeader>
                            <CardTitle>{agent?.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-muted aspect-square w-full grid place-items-center">
                                <div className="text-6xl font-bold uppercase">
                                    {formatAgentName(agent?.name)}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex items-center gap-4 w-full">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    onClick={() => handleClaim()}
                                    disabled={!isAuthenticated || claimMutation.isPending}
                                >
                                    {claimMutation.isPending ? "Claiming..." : "Claim WAGMI"}
                                </Button>
                                <Link
                                    to={`/settings/${agent.id}`}
                                >
                                    <Button size="icon" variant="outline">
                                        <Cog />
                                    </Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
