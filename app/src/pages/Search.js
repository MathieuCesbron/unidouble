import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { struct, u8, u16, u64, f32, publicKey as publicKeyBorsh, str, vec, publicKey } from "@project-serum/borsh"
import bs58 from "bs58"


import EmptySearch from "../components/EmptySearch"
import { connection, programID, storeCreatorPubKey } from "../utils/solana"

export default function Search() {
    const { country, category } = useParams()
    const [articles, setArticles] = useState(undefined)

    const getArticles = async () => {
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
                {
                    memcmp: {
                        offset: 8 + 32 + 32 + 10,
                        bytes: bs58.encode(Buffer.from([country]))
                    }
                },
                {
                    memcmp: {
                        offset: 8 + 32 + 32 + 10 + 1,
                        bytes: bs58.encode(Buffer.from([category]))
                    }
                },
            ]
        }

        const encodedArticles = await connection.getProgramAccounts(
            programID,
            filters
        )

        const decodedArticles = encodedArticles.map(encodedArticles => ({
            articlePubKey: encodedArticles.pubkey.toString(),
            data: struct([
                publicKey("seller_account_public_key"),
                publicKey("store_creator_public_key"),
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
                vec(publicKey(), "reviewers"),
                vec(u16(), "quantity_bought"),
                vec(str(), "buyer_diffie_public_keys"),
                vec(str(), "buyers_salts"),
                vec(str(), "buyer_ivs")
            ]).decode(encodedArticles.account.data, 8)
        }))

        return decodedArticles

    }

    useEffect(() => {
        const getDecodedArticles = async () => {
            const articles = await getArticles()
            setArticles(articles)
        }
        getDecodedArticles()
    }, [])

    const ArticlesMode = () => {
        if (articles === undefined) {
            return
        }

        if (articles.length) {
            return (
                <div>
                    PLACEHOLDER
                </div>
            )
        }
        return <EmptySearch />
    }

    return (
        <div className="articles">
            <ArticlesMode />
        </div>
    )
}