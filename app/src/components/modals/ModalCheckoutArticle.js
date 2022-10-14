import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import React, { useEffect, useState } from "react"
import { publicKey as publicKeyBorsh, struct, str } from "@project-serum/borsh"
import { useWallet } from "@solana/wallet-adapter-react"
import { AES, mode } from "crypto-js"

import { curve } from "../../utils/crypto"
import solanaLogoBlue from "../../images/solana-icon-blue.png"
import { connection, getProgram, programID, storeCreatorPubKey } from "../../utils/solana"
import "./ModalCheckoutArticle.css"
import "./Modals.css"


export default function ModalCheckoutArticle(props) {
    const { publicKey } = useWallet()

    const [sellerDiffiePubKey, setSellerDiffiePubKey] = useState(undefined)
    const [encryptedDeliveryAddress, setEncryptedDeliveryAddress] = useState("")
    const [salt, setSalt] = useState("")
    const [iv, setIv] = useState("")
    const [priceToPay, setPriceToPay] = useState(props.price)
    const [buyArticleFormData, setBuyArticleFormData] = useState(
        {
            quantity: 1,
            deliveryAddress: ""
        }
    )

    const buyerDiffieKeyPair = curve.genKeyPair()
    const buyerDiffiePubKey = buyerDiffieKeyPair.getPublic().encode("hex", true)

    const setBuyArticleFormDataHandler = event => {
        setBuyArticleFormData(prevBuyArticleFormData => ({
            ...prevBuyArticleFormData,
            [event.target.name]: event.target.value
        }))
    }

    useEffect(() => {
        setPriceToPay(
            buyArticleFormData.quantity > 0 ?
                props.price * buyArticleFormData.quantity / LAMPORTS_PER_SOL :
                props.price / LAMPORTS_PER_SOL
        )
    }, [buyArticleFormData.quantity])

    useEffect(() => {
        const getDiffieSellerPubKey = async () => {
            const filters = {
                filters: [
                    {
                        dataSize: 140
                    },
                    {
                        memcmp: {
                            offset: 8,
                            bytes: props.sellerAccountPublicKey
                        }
                    }
                ]
            }

            try {
                const sellerAccount = await connection.getProgramAccounts(programID, filters)
                const decodedSellerAccount = {
                    data: struct([
                        publicKeyBorsh("seller_public_key"),
                        publicKeyBorsh("store_creator_public_key"),
                        str("diffie_public_key")
                    ]).decode(sellerAccount[0].account.data, 8)
                }
                const sellerDiffiePubKey = decodedSellerAccount.data.diffie_public_key
                setSellerDiffiePubKey(sellerDiffiePubKey)
            } catch (error) {
                console.log("error: ", error)
            }
        }
        getDiffieSellerPubKey()
    }, [])

    useEffect(() => {
        if (sellerDiffiePubKey != undefined) {
            const sellerDiffieBasepoint = curve.keyFromPublic(Buffer.from(sellerDiffiePubKey, 'hex')).getPublic()

            const sharedSecret = buyerDiffieKeyPair.derive(sellerDiffieBasepoint).toString("hex")
            const cipher = AES.encrypt(
                buyArticleFormData.deliveryAddress,
                sharedSecret,
                { mode: mode.CTR }
            )
            setSalt(cipher.salt.toString())
            setIv(cipher.iv.toString())

            const cipherText = cipher.ciphertext.toString()
            setEncryptedDeliveryAddress(cipherText)
        }
    }, [buyArticleFormData.deliveryAddress])

    const buyArticleOnChain = async event => {
        event.preventDefault()

        try {
            const program = getProgram()
            const tx = await program.methods
                .buyArticle(
                    buyArticleFormData.quantity,
                    encryptedDeliveryAddress,
                    buyerDiffiePubKey,
                    salt,
                    iv)
                .accounts(
                    {
                        user: publicKey,
                        seller: props.sellerAccountPublicKey,
                        article: props.articlePubKey,
                        storeCreator: storeCreatorPubKey,
                        systemProgram: SystemProgram.programId
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
                        onClick={() => props.setShowModalCheckoutArticle(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Buy article #{props.uuid}</h2>
                <hr />
                <p>Your delivery address is encrypted on the blockchain, only the seller can decrypt it.
                    You can review the article bought and get 1% cashback.
                </p>
                <form onSubmit={buyArticleOnChain}>
                    <div className="modal-price-wrapper">
                        <h3>Price: {props.price / LAMPORTS_PER_SOL}</h3>
                        <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
                    <hr />
                    <div className="modal-field-price-quantity">
                        <div className="modal-field-quantity">
                            <label>Quantity</label>
                            <input
                                className="input-quantity"
                                name="quantity"
                                value={buyArticleFormData.quantity}
                                onChange={setBuyArticleFormDataHandler}
                                type="number"
                                min="1"
                                max={props.quantityMax}
                            ></input>
                        </div>
                        <p className="modal-quantity-available">{props.quantityMax} available</p>
                    </div>
                    <div className="modal-field">
                        <label>Delivery address</label>
                        <input
                            className="input-delivery-address"
                            name="deliveryAddress"
                            value={buyArticleFormData.deliveryAddress}
                            onChange={setBuyArticleFormDataHandler}
                            minLength="10"
                            maxLength="75"
                        ></input>
                    </div>
                    <hr />
                    <label>Encrypted delivery address</label>
                    <div className="modal-encrypted-delivery-address-wrapper">
                        <p className="modal-encrypted-delivery-address">{encryptedDeliveryAddress}</p>
                    </div>
                    <div className="modal-price-wrapper">
                        <h3>Amount to pay: {priceToPay}</h3>
                        <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
                    {buyArticleFormData.error && <p className="error">{buyArticleFormData.error}</p>}
                    <button className="modal-btn" type="submit">
                        Validate transaction on wallet
                    </button>
                </form>

            </div>
        </div >
    )
}