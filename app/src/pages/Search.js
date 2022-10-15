import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { struct, u8, u16, u64, f32, publicKey as publicKeyBorsh, str, vec, publicKey } from "@project-serum/borsh"
import bs58 from "bs58"


import EmptySearch from "../components/EmptySearch"
import ArticleSearch from "../components/ArticleSearch"
import PaginationSearch from "../components/PaginationSearch"
import { connection, programID, storeCreatorPubKey } from "../utils/solana"


export default function Search() {
    const { country, category } = useParams()
    const [articles, setArticles] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const articlesPerPage = 5
    const lastPostIndex = currentPage * articlesPerPage
    const firstPostIndex = lastPostIndex - articlesPerPage
    const currentArticles = articles.slice(firstPostIndex, lastPostIndex)

    const paginate = pageNumber => setCurrentPage(pageNumber)

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
    }, [country, category])

    const ArticlesMode = () => {
        if (articles === undefined) {
            return
        }

        if (articles.length) {
            return (
                <div>
                    {
                        currentArticles.map(({ articlePubKey, data }) => (
                            <ArticleSearch
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
                    {
                        articles.length > articlesPerPage && <PaginationSearch
                            articlesPerPage={articlesPerPage}
                            totalArticles={articles.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    }
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