import { useNavigate } from "react-router-dom"
import React from "react"

import backBtn from "../images/back-btn.png"
import "./NoArticles.css"

export default function NoArticles() {
    const navigate = useNavigate()

    return (
        <div className="no-articles">
            <h2>You have no articles listed yet</h2>
            <img
                className="no-articles-back-btn"
                src={backBtn}
                onClick={() => navigate("/seller-account")} />
        </div>
    )
}