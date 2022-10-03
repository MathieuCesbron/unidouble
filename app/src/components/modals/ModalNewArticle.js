import React, { useEffect, useState } from "react"
import Select from 'react-select'

import { countries } from "../../config/countries"
import { categories } from "../../config/categories"
import solanaIconBlue from "../../images/solana-icon-blue.png"
import "./Modals.css"
import "./ModalNewArticle.css"


export default function ModalNewArticle({ setShowModalNewArticle }) {
    const uuid = Math.random().toString(36).slice(-6)
    const [newArticleFormData, setNewArticleFormData] = useState(
        {
            country: "",
            category: "",
            privateKey: "",
            price: "",
            quantity: "",
            title: "",
            imageURL: "",
            description: ""
        }
    )

    const setCountryHandler = event => {
        setNewArticleFormData(prevNewArticleFormData => ({
            ...prevNewArticleFormData,
            "country": event.value
        }))
    }

    const setCategoryHandler = event => {
        setNewArticleFormData(prevNewArticleFormData => ({
            ...prevNewArticleFormData,
            "category": event.value
        }))
    }

    const setNewArticleFormDataHandler = (event) => {
        setNewArticleFormData(prevNewArticleFormData => ({
            ...prevNewArticleFormData,
            [event.target.name]: event.target.value
        }))
    }

    const submitNewArticle = event => {
        event.preventDefault()
        // TODO: validate transaction before sending it
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => setShowModalNewArticle(false)}>
                        EXIT</button>
                </div>
                <h2>New article</h2>
                <hr />
                <p>List a new article. Make sure you keep your private key,
                    it is needed to decode the sales you make.
                </p>
                <form onSubmit={submitNewArticle}>
                    <div className="form-selects">
                        <Select
                            className="form-select"
                            placeholder="Select country"
                            options={countries}
                            name="country"
                            value={countries.find(c => c.value === newArticleFormData.country)}
                            onChange={setCountryHandler}
                        />
                        <Select
                            className="form-select"
                            placeholder="Select category"
                            options={categories}
                            name="category"
                            value={categories.find(c => c.value === newArticleFormData.category)}
                            onChange={setCategoryHandler}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Private key</label>
                        <input
                            className="input-private-key"
                            name="privateKey"
                            value={newArticleFormData.privateKey}
                            onChange={setNewArticleFormDataHandler}
                            minLength={76}
                            maxLength={76}>
                        </input>
                    </div>
                    <div className="modal-field-price-quantity">
                        <div className="modal-field-price">
                            <label className="modal-field-label-price">
                                Price
                                <img src={solanaIconBlue} className="solana-icon-blue" />
                            </label>
                            <input
                                className="input-price"
                                name="price"
                                placeholder="1"
                                value={newArticleFormData.price}
                                onChange={setNewArticleFormDataHandler}
                                type="number"
                                step="0.0001"
                                min="0.01"
                                max="1000000"
                            >
                            </input>
                        </div>
                        <div className="modal-field-quantity">
                            <label>Quantity</label>
                            <input
                                className="input-quantity"
                                name="quantity"
                                placeholder="1"
                                value={newArticleFormData.quantity}
                                onChange={setNewArticleFormDataHandler}
                                type="number"
                                min="1"
                                max="255"
                            >
                            </input>
                        </div>
                    </div>
                    <div className="modal-field">
                        <label>Title</label>
                        <input
                            className="input-title"
                            name="title"
                            value={newArticleFormData.title}
                            onChange={setNewArticleFormDataHandler}
                            minLength="10"
                            maxLength="75"
                        ></input>
                    </div>
                    <div className="modal-field">
                        <label>Image URL</label>
                        <input
                            className="input-imageURL"
                            name="imageURL"
                            value={newArticleFormData.imageURL}
                            onChange={setNewArticleFormDataHandler}
                            minLength="10"
                            maxLength="50"
                        ></input>
                    </div>
                    <div className="modal-field">
                        <label>Description</label>
                        <textarea
                            className="input-description"
                            name="description"
                            value={newArticleFormData.description}
                            onChange={setNewArticleFormDataHandler}
                            minLength="50"
                            maxLength="750"
                        ></textarea>
                    </div>
                    <button className="modal-btn" type="submit">
                        Validate transaction on wallet
                    </button>
                </form >
            </div >
        </div >
    )
}