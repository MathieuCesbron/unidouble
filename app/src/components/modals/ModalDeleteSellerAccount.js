import { PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import React, { useState } from "react"

import { program, programID } from "../../utils/solana"
import solanaLogoBlue from "../../images/solana-icon-blue.png"
import "./Modals.css"

export default function ModalDeleteSellerAccount({ setShowModalDeleteSellerAccount }) {
    const { publicKey } = useWallet()
    const [isSure, setIsSure] = useState(false)

    const deleteSellerAccountOnchain = async () => {
        const [sellerAccount] = await PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            programID
        )
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
                    onChange={() => setIsSure(previsSure => !previsSure)}
                />
                <label htmlFor="isSure">I want to delete my seller account</label>
                <hr />
                <div className="modal-price-wrapper">
                    <h3>Gain: 0.00187</h3>
                    <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                </div>
                <button disabled={!isSure} className="modal-btn" onClick={deleteSellerAccountOnchain}>
                    Validate transaction on wallet
                </button>
            </div>
        </div>
    )
}