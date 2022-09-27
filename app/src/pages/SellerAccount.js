import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@solana/wallet-adapter-react"

import useStore from "../store"
import { getProvider } from "../utils/solana"
import CreateSellerAccount from "../components/CreateSellerAccount"

export default function SellerAccount() {
    const navigate = useNavigate()

    const programID = useStore(state => state.programID)
    const { connected, publicKey } = useWallet()
    const [isSeller, setIsSeller] = useState(undefined)

    useEffect(() => {
        if (!connected) {
            navigate("/")
        }
        if (!publicKey) {
            return
        }

        const provider = getProvider()
        const filters = {
            // might need to pass publicKey as string
            filters: [
                {
                    dataSize: 140
                },
                {
                    memcmp: {
                        offset: 8,
                        bytes: publicKey
                    }
                }
            ]
        }

        const getSellerAccount = async () => {
            const sellerAccount = await provider.connection.getProgramAccounts(programID, filters)

            if (sellerAccount.length == 1) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        }
        getSellerAccount()

    }, [connected])

    const Buttons = () => {
        switch (isSeller) {
            case undefined:
                return (
                    <h1>Loading in progress</h1>
                )
            case false:
                return (
                    <CreateSellerAccount />
                )
            case true:
                return (
                    <h1>I am a seller</h1>
                )
        }
    }

    return (
        <>
            <Buttons />
        </>
    )
}