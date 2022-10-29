import React, { useState } from "react"
import { useAnchorWallet } from "@solana/wallet-adapter-react"

import { getProgram } from "../../utils/solana"
import { curve } from "../../utils/crypto"
import useStore from "../../store"
import "./Modals.css"
import "./ModalNewArticle.css"

export default function ModalUpdateArticle(props) {
    const { publicKey } = useAnchorWallet()
    const sellerDiffiePubKey = useStore(state => state.sellerDiffiePubKey)
    const setToastMsg = useStore(state => state.setToastMsg)

    const [updateArticleFormData, setUpdateArticleFormData] = useState(
        {
            privateKey: "",
            quantity: props.quantity,
            title: props.title,
            imageURL: props.imageURL,
            description: props.description,
            error: ""
        }
    )

    const setUpdateArticleFormDataHandler = event => {
        setUpdateArticleFormData(prevUpdateArticleFormData => ({
            ...prevUpdateArticleFormData,
            [event.target.name]: event.target.value
        }))
    }

    const checkPrivateKey = () => {
        const keyPair = curve.keyFromPrivate(updateArticleFormData.privateKey)
        const diffePubKey = keyPair.getPublic().encode("hex")

        if (diffePubKey !== sellerDiffiePubKey) {
            return "The Private key is incorrect"
        }
        return ""
    }

    const submitUpdateArticle = async event => {
        event.preventDefault()

        if (updateArticleFormData.privateKey.length != 62 && updateArticleFormData.privateKey.length != 63) {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: "The Private key should be 62 or 63 characters"
            }))
            return
        } else {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: ""
            }))
        }

        if (updateArticleFormData.quantity < 1 ||
            updateArticleFormData.quantity > 255) {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: "The Quantity should be between 1 and 255"
            }))
            return
        } else {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: ""
            }))
        }

        if (updateArticleFormData.title.length < 10 ||
            updateArticleFormData.title > 75) {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: "The Title should be between 10 and 75 characters"
            }))
            return
        } else {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: ""
            }))
        }

        if (updateArticleFormData.imageURL.length < 10 ||
            updateArticleFormData.imageURL > 50) {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: "The Image URL should be between 10 and 50 characters"
            }))
            return
        } else {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: ""
            }))
        }

        if (updateArticleFormData.description.length < 50 ||
            updateArticleFormData.description > 750) {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: "The description should be between 50 and 750 characters"
            }))
            return
        } else {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: ""
            }))
        }

        const errorPrivateKeyIncorrect = checkPrivateKey()
        if (errorPrivateKeyIncorrect) {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: errorPrivateKeyIncorrect
            }))
            return
        } else {
            setUpdateArticleFormData(prevUpdateArticleFormData => ({
                ...prevUpdateArticleFormData,
                error: ""
            }))
        }

        try {
            const program = getProgram()
            const tx = await program.methods
                .updateArticle(
                    updateArticleFormData.quantity,
                    updateArticleFormData.title,
                    updateArticleFormData.description,
                    updateArticleFormData.imageURL
                )
                .accounts(
                    {
                        user: publicKey,
                        article: props.articlePubKey,
                    })
                .rpc()
            console.log(tx)

            props.setMyArticles(prevMyArticles => (
                prevMyArticles.map(
                    myArticle => {
                        if (myArticle.articlePubKey !== props.articlePubKey) {
                            return myArticle
                        }

                        myArticle.data.quantity = updateArticleFormData.quantity
                        myArticle.data.title = updateArticleFormData.title
                        myArticle.data.description = updateArticleFormData.description
                        myArticle.data.imageURL = updateArticleFormData.imageURL
                        return myArticle
                    }
                )
            ))
            setToastMsg("Article successfully updated")
        } catch (error) {
            console.log("error: ", error)
            setToastMsg("Failed to update article")
        }

    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalUpdateArticle(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Update article</h2>
                <hr />
                <p>Update an article, you can update everything except the country, category and price.
                    The only cost is the cost of the transaction which is almost free on SOLANA.</p>
                <form onSubmit={submitUpdateArticle}>
                    <div className="modal-field">
                        <label>Private key</label>
                        <input
                            className="input-private-key"
                            name="privateKey"
                            value={updateArticleFormData.privateKey}
                            onChange={setUpdateArticleFormDataHandler}
                            minLength={62}
                            maxLength={63}>
                        </input>
                    </div>
                    <div className="modal-field-price-quantity">
                        <div className="modal-field-quantity">
                            <label>Quantity</label>
                            <input
                                className="input-quantity"
                                name="quantity"
                                value={updateArticleFormData.quantity}
                                onChange={setUpdateArticleFormDataHandler}
                                type="number"
                                min="1"
                                max="255">
                            </input>
                        </div>
                    </div>
                    <div className="modal-field">
                        <label>Title</label>
                        <input
                            className="input-title"
                            name="title"
                            value={updateArticleFormData.title}
                            onChange={setUpdateArticleFormDataHandler}
                            minLength="10"
                            maxLength="75">
                        </input>
                    </div>
                    <div className="modal-field">
                        <label>Image URL</label>
                        <input
                            className="input-imageURL"
                            name="imageURL"
                            value={updateArticleFormData.imageURL}
                            onChange={setUpdateArticleFormDataHandler}
                            minLength="10"
                            maxLength="50"
                        ></input>
                    </div>
                    <div className="modal-field">
                        <label>Description</label>
                        <textarea
                            className="input-description"
                            name="description"
                            value={updateArticleFormData.description}
                            onChange={setUpdateArticleFormDataHandler}
                            minLength="50"
                            maxLength="750"
                        ></textarea>
                    </div>
                    {updateArticleFormData.error && <p className="error">{updateArticleFormData.error}</p>}
                    <button className="modal-btn" type="submit">
                        Validate transaction on wallet
                    </button>
                </form>
            </div>
        </div>
    )
}