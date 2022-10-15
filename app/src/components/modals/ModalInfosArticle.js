import React from "react"

import "./ModalInfosArticle.css"
import "./Modals.css"


export default function ModalInfosArticle(props) {
    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalInfosArticle(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Article #{props.uuid}</h2>
                <hr />
                <h3>{props.title}</h3>
                <p className="modal-infos-description">{props.description}</p>
            </div>
        </div>
    )
}