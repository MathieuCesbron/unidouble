import React from "react"

import "./ModalImageFull.css"


export default function ModalImageFull(props) {
    return (
        <div className="modal-image-background">
            <img
                className="image-full"
                src={props.imageURL}
                onClick={() => props.setShowModalImageFull(false)} />
        </div>
    )
}