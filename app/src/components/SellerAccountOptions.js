import React, { useState } from "react"

import ModalDeleteSellerAccount from "./modals/ModalDeleteSellerAccount"
import newArticleLogo from "../images/new-article-logo.png"
import salesLogo from "../images/sales-logo.png"
import myArticlesLogo from "../images/my-articles-logo.png"
import deleteSellerAccount from "../images/delete-seller-account-logo.png"
import "./SellerAccountOptions.css"

export default function SellerAccountOptions() {
    const [showDeleteSellerAccount, setShowModalDeleteSellerAccount] = useState(false)

    const deleteSellerAccountHandler = () => {
        setShowModalDeleteSellerAccount(true)
    }

    return (
        <div className="seller-account-options-grid">
            <button className="grid-btn btn1">
                <img src={newArticleLogo} className="grid-btn-logo" />
                <b className="grid-btn-text1">New article</b>
            </button>
            <button className="grid-btn btn2">
                <img src={salesLogo} className="grid-btn-logo" />
                <b className="grid-btn-text2">Sales</b>
            </button>
            <button className="grid-btn btn3">
                <img src={myArticlesLogo} className="grid-btn-logo" />
                <b className="grid-btn-text3">My articles</b>
            </button>
            <button className="grid-btn btn4" onClick={deleteSellerAccountHandler}>
                <img src={deleteSellerAccount} className="grid-btn-logo" />
                <b className="grid-btn-text4">Delete seller account</b>
            </button>

            {showDeleteSellerAccount &&
                <ModalDeleteSellerAccount setShowModalDeleteSellerAccount={setShowModalDeleteSellerAccount} />}
        </div>
    )
}