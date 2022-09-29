import React from "react"

import "./Modals.css"

export default function ModalCreateSellerAccount({ setShowModalCreateSellerAccount }) {
    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => setShowModalCreateSellerAccount(false)}
                    >EXIT</button>
                </div>
                PLACEHOLDER
            </div>
        </div>
    )
}