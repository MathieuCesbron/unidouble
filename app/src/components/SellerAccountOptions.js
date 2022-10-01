import React, { useState } from "react"

import ModalDeleteSellerAccount from "./modals/ModalDeleteSellerAccount"
import "./SellerAccountOptions.css"

export default function SellerAccountOptions() {
    const [showDeleteSellerAccount, setShowModalDeleteSellerAccount] = useState(false)

    const deleteSellerAccountHandler = () => {
        setShowModalDeleteSellerAccount(true)
    }
    return (
        <div className="seller-account-options-grid">
            <button className="grid-btn btn1">New article</button>
            <button className="grid-btn btn2">Sales</button>
            <button className="grid-btn btn3">My articles</button>
            <button className="grid-btn btn4" onClick={deleteSellerAccountHandler}>Delete seller account</button>

            {showDeleteSellerAccount &&
                <ModalDeleteSellerAccount setShowModalDeleteSellerAccount={setShowModalDeleteSellerAccount} />}
        </div>
    )
}