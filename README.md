# WagmAI 🤖

<div align="left">
  <img src="https://ethglobal.b-cdn.net/events/agents/square-logo/default.png" alt="ETH Global Agentic Ethereum" width="2%" /> <i>ETH Global Hackathon, Agentic Ethereum</i>
</div>
<br />

[Slide deck](https://docs.google.com/presentation/d/1ie7Ich5n-07MyQ34C2079NY4CSs2BqNUWEeND5sSo3o/edit?usp=sharing) |
[Twitter](https://x.com/WagmAIgent) | [Telegram](https://t.me/WagmAIgent_Bot) |
[RAG sources](https://docs.google.com/spreadsheets/d/13naho9-WAerpNbLWfSC0k5sHZWU8G6tZFfvQ8xt4mKA/edit)
## 🚩 Overview

In the context of the ETHGlobal Agentic Ethereum hackathon, we are developing an AI Agent designed to help users navigate the complexities of our information era, which has evolved from whispered secrets in ancient forums to viral waves in digital feeds. Our AI Agent strives to serve as a neutral and reliable guide, leveraging the collective knowledge of humanity to assist users in discerning valuable information from the vast amounts of data on social networks.

## Mission

Our AI Agent's mission is to highlight credible and insightful contributions, whether they are essays, research papers, blog posts, or other publications. At the same time, it will identify and flag misleading or false information, providing evidence and context to help users make informed decisions.

## ✨ Features
![image](https://github.com/user-attachments/assets/025e364d-160f-4890-90b1-d9a2a06b5e04)

## Impact

Our AI Agent aims to improve the quality of information dissemination and foster a community of informed users. By rewarding credible contributions and highlighting falsehoods, we hope to create a more trustworthy and insightful digital environment.

Join us in enhancing the way we navigate information in the digital age.
## Architecture
![image](https://github.com/user-attachments/assets/d74bea01-1109-47c1-b584-934fb8d5edb4)


- **Agent's Account:** 0x01F8e269CADCD36C945F012d2EeAe814c42D1159
- **Wagmi Token Contract address:** https://sepolia.arbiscan.io/address/0xfE3AB163DCE342e3aC727831f688e0Ce2aBe2731
- **Builder BadgeToken Contract address:** https://sepolia.arbiscan.io/address/0xb9404c265861a97aee20c42e0abb8caa2cd8fc71

### Prerequisites

- [Python 2.7+](https://www.python.org/downloads/)
- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [pnpm](https://pnpm.io/installation)

> **Note for Windows Users:** [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install-manual) is required.

### Use the Starter (Recommended)

```bash
git clone https://github.com/dayksx/agentic-wagmAI
cd agentic-wagmAI
cp .env.example .env
pnpm i && pnpm build && pnpm start
```

### Software components

- Agentic Platform (ElizaOS) `/agent/` + `/characters/` + `/packages/`
- Front-end (React App): `/clients/`
- Smart contracts (Hardhat) `/smartcontracts/`

#### Guidelines



#### Edit the .env file

Copy .env.example to .env and fill in the appropriate values, i.e.:
- OPENAI_API_KEY
- EVM_PRIVATE_KEY

```
cp .env.example .env
```

#### Start Eliza

```bash
pnpm i
pnpm build
pnpm start

# The project iterates fast, sometimes you need to clean the project if you are coming back to the project
pnpm clean
```

### Interact via Browser

Once the agent is running, you should see the message to run "pnpm start:client" at the end.

Open another terminal, move to the same directory, run the command below, then follow the URL to chat with your agent.

```bash
pnpm start:client
```

Then read the [Documentation](https://elizaos.github.io/eliza/) to learn how to customize your Eliza.

---


### Community & contact

- dayksx | dayan.fc | dayan.lens
- chin-flags 
