import React, { useEffect, useState } from "react"

import "./CreateSellerAccount.css"
import CreateSellerAccountLogo from "../images/create-seller-account-logo.png"
import ModalCreateSellerAccount from "../components/modals/ModalCreateSellerAccount"

export default function CreateSellerAccount() {
    const [showModalCreateSellerAccount, setShowModalCreateSellerAccount] = useState(false)

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