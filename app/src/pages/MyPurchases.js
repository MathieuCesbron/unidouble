import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { struct, u8, u16, u64, f32, publicKey as publicKeyBorsh, str, vec } from "@project-serum/borsh"

import { connection, programID, storeCreatorPubKey } from "../utils/solana"


export default function MyPurchases() {
    const { publicKey, connected } = useWallet()

    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)

    const getPurchases = async () => {
        // get purchases from the store creator, there is no way to filter
        // through the reviewers array yet, we do it manually later.
        const filters = {
            filters: [
                {
                    dataSize: 10000
                },
                {
                    memcmp: {
                        offset: 8 + 32,
                        bytes: storeCreatorPubKey
                    }
                },
            ]
        }

        const encodedPurchases = await connection.getProgramAccounts(
            programID,
            filters
        )

        let decodedPurchases = encodedPurchases.map(encodedPurchase => ({
            articlePubKey: encodedPurchase.pubkey.toString(),
            data: struct([
                publicKeyBorsh("seller_account_public_key"),
                publicKeyBorsh("store_creator_public_key"),
                str("uuid"),
                u8("country"),
                u8("category"),
                u64("price"),
                u16("quantity"),
                str("title"),
                str("description"),
                str("image_url"),
                u16("buyer_count"),
                u16("rating_count"),
                f32("rating"),
                vec(str(), "delivery_address_ciphertexts"),
                vec(publicKeyBorsh(), "reviewers"),
                vec(u16(), "quantity_bought"),
                vec(str(), "buyer_diffie_public_keys"),
                vec(str(), "buyers_salts"),
                vec(str(), "buyer_ivs")
            ]).decode(encodedPurchase.account.data, 8)
        }))

        return decodedPurchases.filter(({ data }) => {
            return data.reviewers.some(reviewer => reviewer == publicKey.toBase58())
        })
    }

    useEffect(() => {
        if (!connected) {
            return
        }

        const getDecodedPurchases = async () => {
            const purchases = await getPurchases()
            setPurchases(purchases)
            console.log(purchases)
            setLoading(false)
        }
        getDecodedPurchases()
    }, [publicKey])

    return (
        <div>
            PLACEHOLDER
        </div>
    )
}