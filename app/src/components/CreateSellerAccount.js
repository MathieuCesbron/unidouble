import React from "react"

import "./CreateSellerAccount.css"

import CreateSellerAccountLogo from "../images/create-seller-account-logo.png"

export default function CreateSellerAccount() {
    return (
        <div className="create-seller-account">
            <h2 className="create-seller-account-h2">Become a Unidouble seller</h2>
            <p className="create-seller-account-p">It costs 0.1 SOL (~1 USD) that you get back when you delete your seller account</p>
            <button className="create-seller-account-btn">
                <img src={CreateSellerAccountLogo} className="create-seller-account-logo" />
                Create seller account
            </button>
        </div>
    )
}