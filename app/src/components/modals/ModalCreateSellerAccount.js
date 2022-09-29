import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import { program, programID, storePubKey } from "../../utils/solana"
import { curve } from "../../utils/crypto"
import "./Modals.css"


export default function ModalCreateSellerAccount({ setShowModalCreateSellerAccount }) {
    const { publicKey } = useWallet()

    const sellerDiffieKeyPair = curve.genKeyPair()
    const sellerDiffiePubKey = sellerDiffieKeyPair.getPublic().encode("hex", true)

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
                <h4>{sellerDiffiePubKey}</h4>
            </div>
        </div>
    )
}