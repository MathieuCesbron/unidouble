import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@solana/wallet-adapter-react"

import { provider, programID } from "../utils/solana"
import CreateSellerAccount from "../components/CreateSellerAccount"
import SellerAccountOptions from "../components/SellerAccountOptions"
import useStore from "../store";


export default function SellerAccount() {
    const setIsSeller = useStore(state => state.setIsSeller)
    const isSeller = useStore(state => state.isSeller)
    const navigate = useNavigate()

    const { connected, publicKey } = useWallet()
    // const [isSeller, setIsSeller] = useState(undefined)

    useEffect(() => {
        if (!connected) {
            navigate("/")
        }
        if (!publicKey) {
            return
        }

        const filters = {
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

    const SellerAccountMode = () => {
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
                    <SellerAccountOptions />
                )
        }
    }

    return (
        <>
            <SellerAccountMode />
        </>
    )
}