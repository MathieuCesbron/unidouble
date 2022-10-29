import { PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import React, { useEffect, useState } from "react"

import { getProgram, programID, storeCreatorPubKey, connection } from "../../utils/solana"
import solanaLogoBlue from "../../images/solana-icon-blue.png"
import useStore from "../../store"
import "./Modals.css"

export default function ModalDeleteSellerAccount({ setShowModalDeleteSellerAccount }) {
    const setIsSeller = useStore(state => state.setIsSeller)
    const setToastMsg = useStore(state => state.setToastMsg)
    const { publicKey } = useWallet()

    const [isSure, setIsSure] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [noArticle, setNoArticle] = useState(false)

    const checkNoArticle = async () => {
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

        if (!encodedArticles.length) {
            setNoArticle(true)
        } else {
            setError("You still have articles, remove them before deleting your account")
        }
        setLoading(false)
    }

    useEffect(() => {
        checkNoArticle()
    })

    const deleteSellerAccountOnChain = async () => {
        const [sellerAccount] = await PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            programID
        )

        try {
            const program = getProgram()
            const tx = await program.methods
                .deleteSellerAccount()
                .accounts(
                    {
                        user: publicKey,
                        sellerAccount: sellerAccount,
                    })
                .rpc()
            console.log(tx)
            setIsSeller(false)
            setToastMsg("Success deleting seller account")
        } catch (error) {
            console.log("error: ", error)
            setToastMsg("Failed to delete seller account")
        }
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => setShowModalDeleteSellerAccount(false)}
                    >EXIT</button>
                </div>
                <h2>Delete seller account</h2>
                <hr />
                <p>You can only delete your seller account when you have removed all your articles.
                    0.00187 SOL will be credited back to your account.
                </p>
                <input
                    className="checkbox"
                    type="checkbox"
                    id="isSure"
                    checked={isSure}
                    onChange={() => setIsSure(prevIsSure => !prevIsSure)}
                />
                <label htmlFor="isSure">I want to delete my seller account</label>
                <hr />
                <div className="modal-price-wrapper">
                    <h3>Gain: 0.00187</h3>
                    <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                </div>
                {error && !loading && isSure && <p className="error">{error}</p>}
                <button disabled={!isSure || !noArticle} className="modal-btn" onClick={deleteSellerAccountOnChain}>
                    Validate transaction on wallet
                </button>
            </div>
        </div>
    )
}