import AgentsInTheRoom from "@/components/agentsInTheRoom";
import VirtualRoom from "@/components/virtualRoom";
import './room.css';

export default function Room() {
  return (
    <div className="app-container">
      <AgentsInTheRoom />
      <VirtualRoom />
    </div>
  );
}