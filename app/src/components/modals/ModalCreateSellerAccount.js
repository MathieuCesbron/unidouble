import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import { getProgram, programID, storePubKey } from "../../utils/solana"
import { curve } from "../../utils/crypto"
import solanaLogoBlue from "../../images/solana-icon-blue.png"
import "./Modals.css"
import "./ModalCreateSellerAccount.css"
import useStore from "../../store"


const sellerDiffieKeyPair = curve.genKeyPair()
const sellerDiffiePubKey = sellerDiffieKeyPair.getPublic().encode("hex", true)
const sellerDiffiePrivKey = sellerDiffieKeyPair.getPrivate().toString("hex")

export default function ModalCreateSellerAccount({ setShowModalCreateSellerAccount }) {
    const setIsSeller = useStore(state => state.setIsSeller)
    const { publicKey } = useWallet()
    const [isCopied, setIsCopied] = useState(false)

    const createSellerAccountOnChain = async () => {
        const [sellerAccount] = await PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            programID
        )

        try {
            const program = getProgram()
            const tx = await program.methods
                .createSellerAccount(sellerDiffiePubKey)
                .accounts(
                    {
                        user: publicKey,
                        sellerAccount: sellerAccount,
                        store: storePubKey,
                        systemProgram: SystemProgram.programID
                    })
                .rpc()
            console.log(tx)
            setIsSeller(true)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => setShowModalCreateSellerAccount(false)}
                    >EXIT</button>
                </div>
                <h2>Create seller account</h2>
                <hr />
                <p>This is your private key, save this somewhere safe, we won't show this to you ever again.
                    It will be needed to decode the sales you make.
                </p>
                <div className="modal-seller-diffie-privKey">
                    <h4>{sellerDiffiePrivKey}</h4>
                </div>
                <input
                    className="checkbox"
                    type="checkbox"
                    id="isCopied"
                    checked={isCopied}
                    onChange={() => setIsCopied(previsCopied => !previsCopied)}
                />
                <label htmlFor="isCopied">I have copied my private key</label>
                <hr />
                <div className="modal-price-wrapper">
                    <h3>Price: 0.00187</h3>
                    <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                </div>
                <button disabled={!isCopied} className="modal-btn" onClick={createSellerAccountOnChain}>
                    Validate transaction on wallet
                </button>
            </div>
        </div>
    )
}