import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import React, { useEffect, useState } from "react"

import solanaLogoBlue from "../../images/solana-icon-blue.png"
import "./ModalCheckoutArticle.css"
import "./Modals.css"


export default function ModalCheckoutArticle(props) {
    const [priceToPay, setPriceToPay] = useState(props.price)
    const [buyArticleFormData, setBuyArticleFormData] = useState(
        {
            quantity: 1,
            deliveryAddress: ""
        }
    )

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
                <h2>Buy article</h2>
                <hr />
                <p>Your delivery address is encrypted on the blockchain, only the seller can decrypt it.
                    You can review the article bought and get 1% cashback.
                </p>
                <form>
                    <div className="modal-price-wrapper">
                        <h3>Price: {props.price / LAMPORTS_PER_SOL}</h3>
                        <img className="modal-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
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
                    <div className="modal-encrypted-delivery-address">
                        {/* TODO: add encrypted delivery address here */}
                    </div>
                    <hr />
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