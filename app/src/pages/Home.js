import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import SearchImage from "../images/search-image.png"
import ConnectWalletImage from "../images/connect-wallet-image.png"
import "./Home.css"

export default function Home() {
    const { connected } = useWallet()

    return (
        <div className="home">
            <img className="home-search-image" src={SearchImage} />
            {!connected && <img className="connect-wallet-image" src={ConnectWalletImage} />}
        </div>
    )
}