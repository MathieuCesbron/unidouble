import React from "react"
import { useNavigate } from "react-router-dom"

import backBtn from "../images/back-btn.png"
import "./EmptySearch.css"

export default function EmptySearch() {
    const navigate = useNavigate()

    return (
        <div className="no-articles">
            <h2>No articles listed yet in this category</h2>
            <img
                className="no-articles-back-btn"
                src={backBtn}
                onClick={() => navigate("/")}
            />
        </div>
    )
}