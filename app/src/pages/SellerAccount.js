import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@solana/wallet-adapter-react"

import useStore from "../store"
import { getProvider } from "../utils/solana"

export default function SellerAccount() {
    const navigate = useNavigate()

    const programID = useStore(state => state.programID)
    const { connected } = useWallet()
    const [isSeller, setIsSeller] = useState(false)

    useEffect(() => {
        if (!connected) {
            navigate("/")
        }
        // check if I am seller or not
        // If I am not a seller, than show the create seller button
        // Else show articles and all
        // It is async so in the meantime I should render nothing
        // so isSeller should have 3 possibilites: yes, no and undefined ( u got it)
        const provider = getProvider()
        const filters = []

        const sellerAccount = async () => {
            const seller = await provider.connection.getProgramAccounts(programID, filters)
            console.log(seller)
        }
        sellerAccount()

    }, [connected])

    const Buttons = () => {
        if (isSeller) {
            return (
                <h1>I am a seller</h1>
            )
        }

        return <h1>I am not a seller</h1>
    }

    return (
        <div>
            <Buttons />
        </div>
    )
}