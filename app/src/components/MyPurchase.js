import React, { useState } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import ReactStars from 'react-stars'
import ReactTooltip from "react-tooltip"
import { useWallet } from "@solana/wallet-adapter-react"

import solanaLogoBlue from "../images/solana-icon-blue.png"
import ModalImageFull from "./modals/ModalImageFull"
import ModalReviewArticle from "./modals/ModalReviewArticle"
import ModalInfosArticle from "./modals/ModalInfosArticle"

import "./ArticleSearch.css"
import "./MyPurchase.css"


export default function MyPurchase(props) {
    const [showModalImageFull, setShowModalImageFull] = useState(false)
    const [showModalReviewArticle, setShowModalReviewArticle] = useState(false)
    const [showModalInfosArticle, setShowModalInfosArticle] = useState(false)

    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="article">
            <div className="article-image-wrapper"
                onClick={() => imageLoaded && setShowModalImageFull(true)}
                onLoad={() => setImageLoaded(true)}
            >
                <img className="article-image" src={props.imageURL} />
            </div>
            <div className="article-info">
                <div className="article-header">
                    <div className="article-title-wrapper">
                        <h4 className="article-title">{props.title}</h4>
                        <p className="article-subtitle">#{props.uuid}</p>
                    </div>
                    <div className="article-review">
                        <button
                            className="article-review-btn"
                            onClick={() => setShowModalReviewArticle(true)}>
                            REVIEW
                        </button>
                    </div>
                </div>
                <div className="article-price-stars">
                    <div className="article-price-wrapper">
                        <h3 className="article-price">{String(props.price) / LAMPORTS_PER_SOL}</h3>
                        <img className="article-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
                    <div data-tip={props.rating.toFixed(2)}>
                        <ReactStars
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
                        onClick={() => setShowModalInfosArticle(true)}>
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
            {
                showModalReviewArticle &&
                <ModalReviewArticle
                    setShowModalReviewArticle={setShowModalReviewArticle}
                    price={String(props.price)}
                    articlePubKey={props.articlePubKey}
                    setPurchases={props.setPurchases}
                />
            }
            {
                showModalInfosArticle &&
                <ModalInfosArticle
                    setShowModalInfosArticle={setShowModalInfosArticle}
                    uuid={props.uuid}
                    title={props.title}
                    description={props.description}
                />
            }
        </div>
    )
}