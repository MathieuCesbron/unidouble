import React, { useState } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import ReactStars from 'react-stars'
import ReactTooltip from "react-tooltip"

import solanaLogoBlue from "../images/solana-icon-blue.png"
import ModalImageFull from "./modals/ModalImageFull"
import "./ArticleSearch.css"


export default function ArticleSearch(props) {
    const [showModalImageFull, setShowModalImageFull] = useState(false)
    const [showModalBuyArticle, setShowModalBuyArticle] = useState(false)
    const [showModalInfosArticle, setShowModalInfosArticle] = useState(false)

    return (
        <div className="article">
            <div className="article-image-wrapper" onClick={() => setShowModalImageFull(true)}>
                <img className="article-image" src={props.imageURL} />
            </div>
            <div className="article-info">
                <div className="article-header">
                    <div className="article-title-wrapper">
                        <h4 className="article-title">{props.title}</h4>
                        <p className="article-subtitle">#{props.uuid}</p>
                    </div>
                    <div className="article-buy">
                        <button
                            className="article-buy-btn"
                            onClick={() => setShowModalBuyArticle(true)}>
                            CHECKOUT
                        </button>
                    </div>
                </div>
                <div className="article-price-stars">
                    <div className="article-price-wrapper">
                        <h3 className="article-price">{String(props.price) / LAMPORTS_PER_SOL}</h3>
                        <img className="article-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
                    <div data-tip={props.rating}>
                        <ReactStars
                            data-tip="hello world"
                            className="article-stars"
                            count={5}
                            value={props.rating}
                            size={24}
                            edit={false}
                            color2={'#ffd700'} />
                    </div>
                    <ReactTooltip />
                </div>
                <h5 className="article-quantity">
                    {props.quantity} available / {props.buyerCount} {props.buyerCount > 1 ? <>buyers</> : <>buyer</>}
                </h5>
                <div className="article-bottom">
                    <p className="article-description">{props.description}</p>
                    <button
                        className="article-infos-btn"
                        onClick={() => setShowModalInfosArticle}>
                        INFOS
                    </button>
                </div>
            </div>

            {
                showModalImageFull &&
                <ModalImageFull
                    setShowModalImageFull={setShowModalImageFull}
                    imageURL={props.imageURL}
                />
            }
        </div >
    )
}