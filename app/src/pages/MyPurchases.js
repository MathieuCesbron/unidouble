import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { struct, u8, u16, u64, f32, publicKey as publicKeyBorsh, str, vec } from "@project-serum/borsh"

import { connection, programID, storeCreatorPubKey } from "../utils/solana"
import EmptyPurchases from "../components/EmptyPurchases"
import MyPurchase from "../components/MyPurchase"


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
            setLoading(false)
        }
        getDecodedPurchases()
    }, [publicKey])

    const PurchasesMode = () => {
        if (loading) {
            return
        }

        if (purchases.length) {
            return (
                <div>
                    {
                        purchases.map(({ articlePubKey, data }) => (
                            <MyPurchase
                                setPurchases={setPurchases}

                                articlePubKey={articlePubKey}
                                sellerAccountPublicKey={data.seller_account_public_key}
                                key={data.uuid}
                                uuid={data.uuid}
                                country={data.country}
                                category={data.category}
                                price={data.price}
                                quantity={data.quantity}
                                title={data.title}
                                description={data.description}
                                imageURL={data.image_url}
                                buyerCount={data.buyer_count}
                                ratingCount={data.rating_count}
                                rating={data.rating}
                                deliveryAddressCiphertexts={data.delivery_address_ciphertexts}
                                reviewers={data.reviewers}
                                quantity_bought={data.quantity_bought}
                                buyer_diffie_public_keys={data.buyer_diffie_public_keys}
                                buyers_salts={data.buyers_salts}
                                buyers_ivs={data.buyers_ivs}
                            />
                        ))
                    }
                </div>
            )
        }
        return <EmptyPurchases />
    }

    return (
        <div>
            <PurchasesMode />
        </div>
    )
}