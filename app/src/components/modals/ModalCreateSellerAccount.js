import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import { program, programID, storePubKey } from "../../utils/solana"
import { curve } from "../../utils/crypto"
import "./Modals.css"
import "./ModalCreateSellerAccount.css"


const sellerDiffieKeyPair = curve.genKeyPair()
const sellerDiffiePubKey = sellerDiffieKeyPair.getPublic().encode("hex", true)

export default function ModalCreateSellerAccount({ setShowModalCreateSellerAccount }) {
    const { publicKey } = useWallet()
    const [isCopied, setIsCopied] = useState(false)


    const createSellerAccountOnChain = async () => {
        const [sellerAccount] = await PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            programID
        )

        try {
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
                <h3>Create seller account</h3>
                <hr />
                <p>This is your private key, save this somewhere safe, we won't show this to you ever again.
                    It will be needed to decode the sales you make.
                </p>
                <div className="modal-seller-diffie-pubkey">
                    <h4>{sellerDiffiePubKey}</h4>
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
                <p>Price: 0.002 SOL</p>
                <button disabled={!isCopied} className="modal-btn">Validate transaction on wallet</button>
            </div>
        </div>
    )
}