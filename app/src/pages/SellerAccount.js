import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { useWallet } from "@solana/wallet-adapter-react"
import { publicKey as publicKeyBorsh, struct, str } from "@project-serum/borsh"

import { programID, connection, storeCreatorPubKey } from "../utils/solana"
import CreateSellerAccount from "../components/CreateSellerAccount"
import SellerAccountOptions from "../components/SellerAccountOptions"
import useStore from "../store"


export default function SellerAccount() {
    const setIsSeller = useStore(state => state.setIsSeller)
    const isSeller = useStore(state => state.isSeller)

    const navigate = useNavigate()
    const [sellerDiffiePubKey, setSellerDiffiePubKey] = useState("")

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
                const decodedSellerAccount = {
                    data: struct([
                        publicKeyBorsh("seller_public_key"),
                        publicKeyBorsh("store_creator_public_key"),
                        str("diffie_public_key")
                    ]).decode(sellerAccount[0].account.data, 8)
                }
                const sellerDiffiePubKey = decodedSellerAccount.data.diffie_public_key
                setSellerDiffiePubKey(sellerDiffiePubKey)
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
                    <SellerAccountOptions sellerDiffiePubKey={sellerDiffiePubKey} />
                )
        }
    }

    return (
        <>
            <SellerAccountMode />
        </>
    )
}