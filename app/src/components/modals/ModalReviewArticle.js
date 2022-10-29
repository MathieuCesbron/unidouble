import React, { useState } from "react"
import ReactStars from 'react-stars'
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"

import solanaLogoBlue from "../../images/solana-icon-blue.png"
import { getProgram } from "../../utils/solana"
import useStore from "../../store"
import "./ModalReviewArticle.css"
import "./Modals.css"

export default function ModalReviewArticle(props) {
    const { publicKey } = useWallet()

    const setToastMsg = useStore(state => state.setToastMsg)

    const [rating, setRating] = useState(0)
    const [isSure, setIsSure] = useState(false)

    const reviewArticlOnChain = async () => {
        try {
            const program = getProgram()
            const tx = await program.methods
                .reviewArticle(rating)
                .accounts(
                    {
                        user: publicKey,
                        article: props.articlePubKey,
                        systemProgram: SystemProgram.programId
                    })
                .rpc()
            console.log(tx)

            props.setPurchases(prevPurchases => (
                prevPurchases.filter(
                    purchase => purchase.articlePubKey != props.articlePubKey
                )
            ))
            props.setShowModalReviewArticle(false)
            setToastMsg("Success to review article")
        } catch (error) {
            console.log(error)
            setToastMsg("Failed to review article")
        }
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalReviewArticle(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Review article</h2>
                <hr />
                <p>Your delivery address will be deleted from the Solana blockchain,
                    review only after receiving the article.
                    You get a 1% cashback for reviewing this article.
                </p>
                <div className="article-stars-wrapper">
                    <ReactStars
                        className="article-stars"
                        count={5}
                        value={rating}
                        half={false}
                        onChange={newRating => setRating(newRating)}
                        size={35}
                        color2={'#ffd700'}
                    />
                </div>
                <input
                    className="checkbox"
                    type="checkbox"
                    id="isSure"
                    checked={isSure}
                    onChange={() => setIsSure(prevIsSure => !prevIsSure)}
                />
                <label htmlFor="isSure">I want to rate this article a {rating}</label>
                <hr />
                <div className="modal-price-wrapper">
                    <h3>Gain: {props.price / LAMPORTS_PER_SOL / 100}</h3>
                    <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                </div>
                <button disabled={!isSure} className="modal-btn" onClick={reviewArticlOnChain} >
                    Validate transaction on wallet
                </button>
            </div>
        </div>
    )
}
