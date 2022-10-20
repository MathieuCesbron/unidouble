import React from "react"

import "./Modals.css"

export default function ModalSales(props) {

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalSales(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Sales for #{props.uuid}</h2>
                <hr />
            </div>
        </div>
    )
}