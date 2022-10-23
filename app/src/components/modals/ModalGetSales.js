import React, { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useNavigate } from "react-router-dom"

import { curve } from "../../utils/crypto"
import useStore from "../../store"
import "./Modals.css"

export default function ModalGetSales(props) {
    const { publicKey } = useWallet()

    const sellerDiffiePubKey = useStore(state => state.sellerDiffiePubKey)

    const setPublicKey = useStore(state => state.setPublicKey)
    const privateKey = useStore(state => state.privateKey)
    const setPrivateKey = useStore(state => state.setPrivateKey)

    const navigate = useNavigate()

    const [error, setError] = useState("")

    const submitPrivateKey = async (event) => {
        event.preventDefault()
        if (privateKey.length != 63) {
            setError("The Private key should be exactly 63 characters")
            return
        } else {
            setError("")
        }

        const keyPair = curve.keyFromPrivate(privateKey)
        const diffiePubKey = keyPair.getPublic().encode("hex")

        if (diffiePubKey !== sellerDiffiePubKey) {
            setError("The Private key is incorrect")
            return
        } else {
            setError("")
        }
        navigate("/seller-account/sales")
    }

    const onChangeHandler = (event) => {
        setPublicKey(publicKey)
        setPrivateKey(event.target.value)
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalGetSales(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Get sales</h2>
                <hr />
                <p>You need to give the private key of your seller account to access the sales you make</p>
                <form onSubmit={submitPrivateKey}>
                    <div className="modal-field">
                        <label>Private key</label>
                        <input
                            className="input-private-key"
                            name="privateKey"
                            value={privateKey}
                            onChange={onChangeHandler}
                            minLength={63}
                            maxLength={63}>
                        </input>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button className="modal-btn" type="submit">
                        Access sales
                    </button>
                </form>
            </div>
        </div>
    )
}