import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import useStore from "../store"

export default function SellerAccount() {
    const { } = useWallet()
    const isSellerAccount = useStore(state => state.isSellerAccount)

    return (
        <div>
            {!isSellerAccount && <button>Create seller account</button>}
        </div>
    )
}