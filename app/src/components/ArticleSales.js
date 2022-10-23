import React, { useState } from "react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import ReactStars from 'react-stars'
import ReactTooltip from "react-tooltip"

import ModalImageFull from "./modals/ModalImageFull"
import ModalSales from "./modals/ModalSales"
import solanaLogoBlue from "../images/solana-icon-blue.png"
import { countries } from "../config/countries"
import { categories } from "../config/categories"
import "./ArticleSales.css"

export default function ArticleSales(props) {
    const [showModalImageFull, setShowModalImageFull] = useState(false)
    const [showModalSales, setShowModalSales] = useState(false)

    const country = countries.find(country => country.value === props.country).label
    const category = categories.find(category => category.value === props.category).label

    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="article-sales">
            <div className="article-sales-image-wrapper"
                onClick={() => imageLoaded && setShowModalImageFull(true)}
                onLoad={() => setImageLoaded(true)}
            >
                <img className="article-sales-image" src={props.imageURL} />
            </div>
            <div className="article-sales-info">
                <div className="article-sales-header">
                    <div className="article-sales-title-wrapper">
                        <h4 className="article-sales-title">{props.title}</h4>
                        <p className="article-sales-subtitle">{country} / {category} / #{props.uuid}</p>
                    </div>
                    <div className="article-sales-sales">
                        <button disabled={!props.deliveryAddressCiphertexts.length}
                            onClick={() => setShowModalSales(true)}
                            className="article-sales-sales-btn">
                            SALES
                        </button>
                    </div>
                </div>
                <div className="article-sales-price-stars">
                    <div className="article-sales-price-wrapper">
                        <h3 className="article-sales-price">{String(props.price) / LAMPORTS_PER_SOL}</h3>
                        <img className="article-sales-solana-logo-blue" src={solanaLogoBlue} />
                    </div>
                    <div data-tip={props.rating.toFixed(2)}>
                        <ReactStars
                            data-tip="hello world"
                            className="article-sales-stars"
                            count={5}
                            value={props.rating}
                            size={24}
                            edit={false}
                            color2={'#ffd700'} />
                    </div>
                    <ReactTooltip />
                </div>
                <h5 className="article-sales-quantity">
                    {props.quantity} available
                </h5>
                <h3>Sales: {props.buyerCount}</h3>
            </div>

            {
                showModalImageFull &&
                <ModalImageFull
                    setShowModalImageFull={setShowModalImageFull}
                    imageURL={props.imageURL}
                />
            }
            {
                showModalSales &&
                <ModalSales
                    setShowModalSales={setShowModalSales}
                    uuid={props.uuid}

                    deliveryAddressCiphertexts={props.deliveryAddressCiphertexts}
                    reviewers={props.reviewers}
                    quantityBought={props.quantityBought}
                    buyerDiffiePublicKeys={props.buyerDiffiePublicKeys}
                    buyerSalts={props.buyerSalts}
                    buyerIvs={props.buyerIvs}
                />
            }
        </div>
    )
}