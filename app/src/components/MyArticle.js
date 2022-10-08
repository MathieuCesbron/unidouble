import React, { useState } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import ReactStars from 'react-stars'

import ModalRemoveArticle from "./modals/ModalRemoveArticle"
import solanaLogoBlue from "../images/solana-icon-blue.png"
import { countries } from "../config/countries"
import { categories } from "../config/categories"
import "./MyArticle.css"


export default function MyArticle(props) {
    const [showModalRemoveArticle, setShowModalRemoveArticle] = useState(false)

    const country = countries.find(country => country.value === props.country).label
    const category = categories.find(category => category.value === props.category).label


    return (
        <div className="my-article">
            <div className="my-article-image">
                {/* add src here when it's easier to check that the imageURL exists */}
                <img />
            </div>
            <div className="my-article-info">
                <div className="my-article-header">
                    <div className="my-article-title-wrapper">
                        <h4 className="my-article-title">{props.title}</h4>
                        <p className="my-article-subtitle">{country} / {category}</p>
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
                    <ReactStars
                        count={5}
                        value={props.rating}
                        size={24}
                        edit={false}
                        color2={'#ffd700'} />
                </div>
                <h5 className="my-article-quantity">
                    {props.quantity} available / {props.buyerCount} {props.buyerCount > 1 ? <>buyers</> : <>buyer</>}
                </h5>
            </div>

            {
                showModalRemoveArticle &&
                <ModalRemoveArticle
                    setShowModalRemoveArticle={setShowModalRemoveArticle}
                    articlePubKey={props.articlePubKey}
                    setMyArticles={props.setMyArticles}
                />
            }
        </div>
    )
}
