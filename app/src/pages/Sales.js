import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { struct, u8, u16, u64, f32, publicKey as publicKeyBorsh, str, vec } from "@project-serum/borsh"
import { useNavigate } from "react-router-dom"

import { connection, programID, storeCreatorPubKey } from "../utils/solana"
import PaginationSearch from "../components/PaginationSearch"
import ArticleSales from "../components/ArticleSales"
import NoArticles from "../components/NoArticles"
import useStore from "../store"
import "./Sales.css"


export default function Sales(props) {
    const navigate = useNavigate()
    const { publicKey, connected } = useWallet()

    const publicKeyStore = useStore(state => state.publicKey)
    const setPublicKeyStore = useStore(state => state.setPublicKey)
    const setPrivateKey = useStore(state => state.setPrivateKey)

    const [currentPage, setCurrentPage] = useState(1)
    const [myArticles, setMyArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalBuyers, setTotalBuyers] = useState(0)

    const articlesPerPage = 5
    const lastPostIndex = currentPage * articlesPerPage
    const firstPostIndex = lastPostIndex - articlesPerPage
    const currentMyArticles = myArticles.slice(firstPostIndex, lastPostIndex)

    const paginate = pageNumber => setCurrentPage(pageNumber)

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
            articlePubKey: encodedArticle.pubkey.toString(),
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
                vec(str(), "buyer_salts"),
                vec(str(), "buyer_ivs")
            ]).decode(encodedArticle.account.data, 8)
        }))

        return decodedArticles
    }

    useEffect(() => {
        if (!connected) {
            navigate("/")
        }
        if (publicKeyStore != publicKey) {
            setPublicKeyStore(publicKey)
            setPrivateKey("")
            navigate("/seller-account")
        }
        if (!publicKey) {
            return
        }

        const getMyDecodedArticles = async () => {
            const myArticles = await getMyArticles()
            setMyArticles(myArticles)

            let total = 0
            myArticles.forEach(myArticle => {
                total += myArticle.data.buyer_count
            })
            setTotalBuyers(total)
            setLoading(false)
        }
        getMyDecodedArticles()
    }, [publicKey])

    const SalesMode = () => {
        if (loading) {
            return
        }

        if (myArticles.length) {
            return (
                <>
                    <h2 className="sales-total">Total number of buyers: {totalBuyers}</h2>
                    {
                        currentMyArticles.map(({ articlePubKey, data }) => (
                            <ArticleSales
                                articlePubKey={articlePubKey}
                                setMyArticles={setMyArticles}

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
                                quantityBought={data.quantity_bought}
                                buyerDiffiePublicKeys={data.buyer_diffie_public_keys}
                                buyerSalts={data.buyer_salts}
                                buyerIvs={data.buyer_ivs}
                            />
                        ))
                    }
                    {
                        myArticles.length > articlesPerPage && <PaginationSearch
                            articlesPerPage={articlesPerPage}
                            totalArticles={myArticles.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    }
                </>
            )
        }
        return <NoArticles />
    }

    return (
        <div className="sales">
            <SalesMode />
        </div>
    )
}