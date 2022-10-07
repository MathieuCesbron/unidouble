import React, { useState } from "react"

import "./MyArticle.css"

export default function MyArticle(props) {
    const [showModalRemoveArticle, setShowModalRemoveArticle] = useState(false)

    return (
        <div className="my-article">
            <div className="my-article-image">
                {/* add src here when it's easier to check that the imageURL exists */}
                <img />
            </div>
            <div className="my-article-info">
                <div className="my-article-header">
                    <h4>{props.title}</h4>
                    <div className="my-article-remove">
                        <button
                            className="my-article-remove-btn"
                            onClick={() => setShowModalRemoveArticle(true)}>
                            REMOVE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
