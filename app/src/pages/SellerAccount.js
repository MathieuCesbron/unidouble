import React, { useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@solana/wallet-adapter-react"

import { programID, connection, storeCreatorPubKey } from "../utils/solana"
import CreateSellerAccount from "../components/CreateSellerAccount"
import SellerAccountOptions from "../components/SellerAccountOptions"
import useStore from "../store"


export default function SellerAccount() {
    const setIsSeller = useStore(state => state.setIsSeller)
    const isSeller = useStore(state => state.isSeller)
    const navigate = useNavigate()

    const { connected, publicKey } = useWallet()

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
                },
                {
                    memcmp: {
                        offset: 8 + 32,
                        bytes: storeCreatorPubKey
                    }
                }
            ]
        }

        const getSellerAccount = async () => {
            const sellerAccount = await connection.getProgramAccounts(programID, filters)

            if (sellerAccount.length == 1) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        }
        getSellerAccount()

    }, [connected, publicKey])

    const SellerAccountMode = () => {
        switch (isSeller) {
            case undefined:
                return
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