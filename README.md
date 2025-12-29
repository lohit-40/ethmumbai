# 🇮🇳 ETHMumbai Maxi Checker

The official **ETHMumbai Community Hub**.  
A gamified platform to check your "Mumbai Ethereum Maxi" status, verify your on-chain/social activity, and generate a custom "Bus Pass" ticket.

![ETHMumbai Hero](public/assets/bus-layer.png)

## ✨ Features

-   **Parallax Hero Section**: A stunning, interactive landing page with moving clouds, city skyline, and the iconic BEST Bus.
-   **Maxi Checker**: Connect your wallet and verify your X (Twitter) handle to calculate your "Maxi Score".
-   **Leaderboard**: Compete with other community members for the top rank (Giga Maxi, Verified Degen, etc.).
-   **Dynamic Ticket Generation**: Generate a shareable, custom ticket with your rank and score.
-   **3D Visuals**: Floating 3D ETH tokens and high-quality assets.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS
-   **Backend**: Node.js, Express
-   **APIs**: Twitter API v2 (for score calculation)
-   **deployment**: Vercel (Frontend) + Render (Backend)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   X (Twitter) Developer Account (for API Key)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/lohit-40/ethmumbai.git
    cd ethmumbai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    # Backend
    PORT=3000
    X_BEARER_TOKEN=your_twitter_api_bearer_token
    
    # Frontend (Vite)
    VITE_API_URL=http://localhost:3000
    ```

4.  **Run Locally**
    You need two terminals:

    *   **Terminal 1 (Backend)**:
        ```bash
        npm run server
        ```
    *   **Terminal 2 (Frontend)**:
        ```bash
        npm run dev
        ```

    Visit `http://localhost:5173` to ride the bus! 🚌

## 🌐 Deployment

-   **Frontend**: Deployed on [Vercel](https://vercel.com). Set `VITE_API_URL` to your backend URL.
-   **Backend**: Deployed on [Render](https://render.com). Set `X_BEARER_TOKEN` in environment variables.

## 🤝 Contributing

Built with ❤️ for the ETHMumbai community.
Pull requests are welcome!

---
*Code is Law, but Chai is Fuel.* ☕
