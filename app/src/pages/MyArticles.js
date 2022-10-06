import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { struct, u8, u16, u64, f32, publicKey as publicKeyBorsh, str, vec } from "@project-serum/borsh"

import { connection, programID, storeCreatorPubKey } from "../utils/solana"
import MyArticle from "../components/MyArticle"
import { useNavigate } from "react-router-dom"


export default function MyArticles() {
    const navigate = useNavigate()
    const { publicKey, connected } = useWallet()
    const [myArticles, setMyArticles] = useState([])

    const getMyArticles = async () => {
        const filters = {
            filters: [
                {
                    dataSize: 10000
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

        const encodedArticles = await connection.getProgramAccounts(
            programID,
            filters
        )

        const decodedArticles = encodedArticles.map(encodedArticle => ({
            pubKey: encodedArticle.pubkey.toString(),
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
            ]).decode(encodedArticle.account.data, 8)
        }))

        return decodedArticles
    }

    useEffect(() => {
        if (!connected) {
            navigate("/")
        }
        if (!publicKey) {
            return
        }

        const getMyDecodedArticles = async () => {
            const myArticles = await getMyArticles()
            setMyArticles(myArticles)
        }
        getMyDecodedArticles()
    }, [])

    return (
        <div className="my-articles">
            {
                myArticles.length ?
                    <div>
                        {
                            myArticles.map(({ pubKey, data }) => (
                                < MyArticle
                                    key={data.uuid}
                                />
                            ))
                        }
                    </div>
                    : console.log("no articles to show")
            }
        </div>
    )
}