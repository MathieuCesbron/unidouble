import React from "react"

import "./SellerAccountOptions.css"

export default function SellerAccountOptions() {
    return (
        <div className="seller-account-options-grid">
            <button className="grid-btn btn1">New article</button>
            <button className="grid-btn btn2">Sales</button>
            <button className="grid-btn btn3">My articles</button>
            <button className="grid-btn btn4">Delete seller account</button>
        </div>
    )
}