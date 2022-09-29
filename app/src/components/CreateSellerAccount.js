import React, { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"

import "./CreateSellerAccount.css"
import CreateSellerAccountLogo from "../images/create-seller-account-logo.png"
import { program, programID, storePubKey } from "../utils/solana"
import { curve } from "../utils/crypto"
import ModalCreateSellerAccount from "../components/modals/ModalCreateSellerAccount"

export default function CreateSellerAccount() {
    const { publicKey } = useWallet()
    const [showModalCreateSellerAccount, setShowModalCreateSellerAccount] = useState(false)

    // const createSellerAccountOnChain = async () => {
    //     const sellerDiffieKeyPair = curve.genKeyPair()
    //     const sellerDiffiePubKey = sellerDiffieKeyPair.getPublic().encode("hex", true)
    //     const [sellerAccount] = await PublicKey.findProgramAddress(
    //         [publicKey.toBuffer()],
    //         programID
    //     )

    //     try {
    //         const tx = await program.methods
    //             .createSellerAccount(sellerDiffiePubKey)
    //             .accounts(
    //                 {
    //                     user: publicKey,
    //                     sellerAccount: sellerAccount,
    //                     store: storePubKey,
    //                     systemProgram: SystemProgram.programID
    //                 })
    //             .rpc()
    //         console.log(tx)
    //     } catch (error) {
    //         console.log("error: ", error)
    //     }
    // }

    return (
        <div className="create-seller-account">
            <h2 className="create-seller-account-h2">Become a Unidouble seller</h2>
            <p className="create-seller-account-p">It costs less than 0.002 SOL (~ 0.07 USD) that you get back when you delete your seller account</p>
            <button className="create-seller-account-btn" onClick={() => setShowModalCreateSellerAccount(true)}>
                <img src={CreateSellerAccountLogo} className="create-seller-account-logo" />
                Create seller account
            </button>
            {
                showModalCreateSellerAccount &&
                <ModalCreateSellerAccount
                    setShowModalCreateSellerAccount={setShowModalCreateSellerAccount}
                />
            }
        </div>
    )
}