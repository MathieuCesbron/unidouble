import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import newArticleLogo from "../images/new-article-logo.png"
import salesLogo from "../images/sales-logo.png"
import myArticlesLogo from "../images/my-articles-logo.png"
import deleteSellerAccount from "../images/delete-seller-account-logo.png"
import ModalNewArticle from "./modals/ModalNewArticle"
import ModalGetSales from "./modals/ModalGetSales"
import ModalDeleteSellerAccount from "./modals/ModalDeleteSellerAccount"
import "./SellerAccountOptions.css"


export default function SellerAccountOptions(props) {
    const navigate = useNavigate()

    const [showModalNewArticle, setShowModalNewArticle] = useState(false)
    const [showModalGetSales, setShowModalGetSales] = useState(false)
    const [showModalDeleteSellerAccount, setShowModalDeleteSellerAccount] = useState(false)

    const newArticleHandler = () => {
        setShowModalNewArticle(true)
    }

    const salesHandler = () => {
        setShowModalGetSales(true)
    }

    const myArticlesHandler = () => {
        navigate("my-articles")
    }

    const deleteSellerAccountHandler = () => {
        setShowModalDeleteSellerAccount(true)
    }

    return (
        <div className="seller-account-options-grid">
            <button className="grid-btn btn1" onClick={newArticleHandler}>
                <img src={newArticleLogo} className="grid-btn-logo" />
                <b className="grid-btn-text1">New article</b>
            </button>
            <button className="grid-btn btn2" onClick={salesHandler}>
                <img src={salesLogo} className="grid-btn-logo" />
                <b className="grid-btn-text2">Sales</b>
            </button>
            <button className="grid-btn btn3" onClick={myArticlesHandler}>
                <img src={myArticlesLogo} className="grid-btn-logo" />
                <b className="grid-btn-text3">My articles</b>
            </button>
            <button className="grid-btn btn4" onClick={deleteSellerAccountHandler}>
                <img src={deleteSellerAccount} className="grid-btn-logo" />
                <b className="grid-btn-text4">Delete seller account</b>
            </button>

            {showModalNewArticle &&
                <ModalNewArticle
                    setShowModalNewArticle={setShowModalNewArticle}
                />}

            {showModalGetSales &&
                <ModalGetSales
                    setShowModalGetSales={setShowModalGetSales}
                />}

            {showModalDeleteSellerAccount &&
                <ModalDeleteSellerAccount setShowModalDeleteSellerAccount={setShowModalDeleteSellerAccount} />}
        </div>
    )
}