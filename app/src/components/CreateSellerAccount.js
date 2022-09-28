import React from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import "./CreateSellerAccount.css"
import CreateSellerAccountLogo from "../images/create-seller-account-logo.png"
import { program, programID, storePubKey } from "../utils/solana"
import { curve } from "../utils/crypto"

export default function CreateSellerAccount() {
    const { publicKey } = useWallet()

    const createSellerAccountOnChain = async () => {
        const sellerDiffieKeyPair = curve.genKeyPair()
        const sellerDiffiePubKey = sellerDiffieKeyPair.getPublic().encode("hex", true)
        const sellerAccount = await PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            programID
        )

        // debug this tx. There is an error message in the log.
        const tx = await program.methods
            .createSellerAccount(sellerDiffiePubKey)
            .accounts(
                {
                    user: publicKey,
                    sellerAccount: sellerAccount,
                    store: storePubKey,
                    systemProgram: SystemProgram.programID
                })
            // may be signers is not necessary and sign automatically
            .signers([publicKey])
            .rpc()

        console.log(tx)
    }

    return (
        <div className="create-seller-account">
            <h2 className="create-seller-account-h2">Become a Unidouble seller</h2>
            <p className="create-seller-account-p">It costs less than 0.002 SOL (~ 0.07 USD) that you get back when you delete your seller account</p>
            <button className="create-seller-account-btn" onClick={createSellerAccountOnChain}>
                <img src={CreateSellerAccountLogo} className="create-seller-account-logo" />
                Create seller account
            </button>
        </div>
    )
}