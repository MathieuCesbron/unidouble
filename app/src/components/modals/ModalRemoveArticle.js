import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import { getProgram, storePubKey } from "../../utils/solana"
import solanaLogoBlue from "../../images/solana-icon-blue.png"
import useStore from "../../store"
import "./Modals.css"

export default function ModalRemoveArticle(props) {
    const { publicKey } = useWallet()
    const [isSure, setIsSure] = useState(false)

    const setToastMsg = useStore(state => state.setToastMsg)

    const removeArticleOnChain = async () => {
        try {
            const program = getProgram()
            const tx = await program.methods
                .removeArticle()
                .accounts(
                    {
                        user: publicKey,
                        article: props.articlePubKey,
                        store: storePubKey
                    })
                .rpc()
            console.log(tx)

            props.setMyArticles(prevMyArticles => (
                prevMyArticles.filter(
                    myArticle => myArticle.articlePubKey !== props.articlePubKey
                )
            ))
            props.setShowModalRemoveArticle(false)
            setToastMsg("Success removing article")
        } catch (error) {
            console.log("error: ", error)
            setToastMsg("Failed to remove article")
        }
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalRemoveArticle(false)}>
                        EXIT</button>
                </div>
                <h2>Remove article</h2>
                <hr />
                <p>Remove an article, this action is definitive. 0.07049 SOL will be
                    credited back to your account.</p>
                <input
                    className="checkbox"
                    type="checkbox"
                    id="isSure"
                    checked={isSure}
                    onChange={() => setIsSure(prevIsSure => !prevIsSure)}
                />
                <label htmlFor="isSure">I want to remove this article</label>
                <hr />
                <div className="modal-price-wrapper">
                    <h3>Gain: 0.07049</h3>
                    <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                </div>
                <button disabled={!isSure} className="modal-btn" onClick={removeArticleOnChain}>
                    Validate transaction on wallet
                </button>
            </div>
        </div>
    )
}