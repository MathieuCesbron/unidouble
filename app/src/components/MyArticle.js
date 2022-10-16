import React, { useState } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import ReactStars from 'react-stars'
import ReactTooltip from "react-tooltip"

import ModalImageFull from "./modals/ModalImageFull"
import ModalRemoveArticle from "./modals/ModalRemoveArticle"
import ModalUpdateArticle from "./modals/ModalUpdateArticle"
import solanaLogoBlue from "../images/solana-icon-blue.png"
import { countries } from "../config/countries"
import { categories } from "../config/categories"
import "./MyArticle.css"


export default function MyArticle(props) {
    const [showModalImageFull, setShowModalImageFull] = useState(false)
    const [showModalRemoveArticle, setShowModalRemoveArticle] = useState(false)
    const [showModalUpdateArticle, setShowModalUpdateArticle] = useState(false)

    const country = countries.find(country => country.value === props.country).label
    const category = categories.find(category => category.value === props.category).label

    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="my-article">
            <div className="my-article-image-wrapper"
                onClick={() => imageLoaded && setShowModalImageFull(true)}
                onLoad={() => setImageLoaded(true)}
            >
                <img className="my-article-image" src={props.imageURL} />
            </div>
            <div className="my-article-info">
                <div className="my-article-header">
                    <div className="my-article-title-wrapper">
                        <h4 className="my-article-title">{props.title}</h4>
                        <p className="my-article-subtitle">{country} / {category} / #{props.uuid}</p>
                    </div>
                    <div className="my-article-remove">
                        <button
                            className="my-article-remove-btn"
                            onClick={() => setShowModalRemoveArticle(true)}>
                            REMOVE
                        </button>
                    </div>
                </div>
                <div className="my-article-price-stars">
                    <div className="my-article-price-wrapper">
                        <h3 className="my-article-price">{String(props.price) / LAMPORTS_PER_SOL}</h3>
                        <img className="my-article-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
                    <div data-tip={props.rating}>
                        <ReactStars
                            data-tip="hello world"
                            className="my-article-stars"
                            count={5}
                            value={props.rating}
                            size={24}
                            edit={false}
                            color2={'#ffd700'} />
                    </div>
                    <ReactTooltip />
                </div>
                <h5 className="my-article-quantity">
                    {props.quantity} available / {props.buyerCount} {props.buyerCount > 1 ? <>buyers</> : <>buyer</>}
                </h5>
                <div className="my-article-bottom">
                    <p className="my-article-description">{props.description}</p>
                    <button
                        className="my-article-update-btn"
                        onClick={() => setShowModalUpdateArticle(true)}>
                        UPDATE
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
                showModalRemoveArticle &&
                <ModalRemoveArticle
                    setShowModalRemoveArticle={setShowModalRemoveArticle}
                    articlePubKey={props.articlePubKey}
                    setMyArticles={props.setMyArticles}
                />
            }
            {
                showModalUpdateArticle &&
                <ModalUpdateArticle
                    setShowModalUpdateArticle={setShowModalUpdateArticle}
                    articlePubKey={props.articlePubKey}
                    quantity={props.quantity}
                    title={props.title}
                    imageURL={props.imageURL}
                    description={props.description}
                    setMyArticles={props.setMyArticles}
                />
            }
        </div >
    )
}
