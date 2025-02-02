// AgentList.js
import { useQuery } from '@tanstack/react-query';
import './agentsInTheRoom.css';
import { apiClient } from '@/lib/api';

export interface Agent {
  id: string; // Assuming UUID is a string
  name: string;
}

const agents = [
  { name: 'Agent 1', ownership: '13 ETH', avatar: 'https://cryptopotato.com/wp-content/uploads/2022/01/img1_cryptopunks.jpg' },
  { name: 'Agent 2', ownership: '21 ETH', avatar: 'https://cryptopotato.com/wp-content/uploads/2022/01/img6_cryptopunks.jpg' },
  { name: 'Agent 3', ownership: '16 ETH', avatar: 'https://i.gadgets360cdn.com/large/cryptopunk_6046_twitter_1634554177991.jpg' },
  { name: 'Agent 4', ownership: '26 ETH', avatar: 'https://airnfts.s3.amazonaws.com/nft-images/CryptoPunk_11_1620301123369.gif' },
];

const AgentsInTheRoom = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: () => apiClient.getAgents(),
    refetchInterval: 5000,
  });

  if (isLoading) {
    return <div>Loading agents...</div>;
  }
  var i = 0;
  return (
    <div className="agent-list">
      <div className="agent-cards">
        {data?.agents?.map((agent: Agent, index:any) => (
          <div key={agent.id} className="agent-card">
            <img src={agents[index]['avatar']} alt={`${agent.name} avatar`} className="agent-avatar" />
            <div className="agent-info">
              <h3>{agent.name}</h3>
              <p>{agents[index]['ownership']}</p> {/* Static placeholder for ownership */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsInTheRoom;