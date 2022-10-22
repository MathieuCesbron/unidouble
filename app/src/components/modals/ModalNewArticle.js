import React, { useState } from "react"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"
import { utils, BN } from "@project-serum/anchor"
import Select from 'react-select'

import { countries } from "../../config/countries"
import { categories } from "../../config/categories"
import solanaIconBlue from "../../images/solana-icon-blue.png"
import { programID, storePubKey, connection, getProgram } from "../../utils/solana"
import { curve } from "../../utils/crypto"
import useStore from "../../store"
import "./Modals.css"
import "./ModalNewArticle.css"


export default function ModalNewArticle(props) {
    const { publicKey, signAllTransactions } = useAnchorWallet()
    const sellerDiffiePubKey = useStore(state => state.sellerDiffiePubKey)

    const [newArticleFormData, setNewArticleFormData] = useState(
        {
            country: "",
            category: "",
            privateKey: "",
            price: "",
            quantity: "",
            title: "",
            imageURL: "",
            description: "",
            error: ""
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

    const checkPrivateKey = () => {
        const keyPair = curve.keyFromPrivate(newArticleFormData.privateKey)
        const diffePubKey = keyPair.getPublic().encode("hex")

        if (diffePubKey !== sellerDiffiePubKey) {
            return "The Private key is incorrect"
        }
        return ""
    }

    const submitNewArticle = async event => {
        event.preventDefault()
        if (newArticleFormData.country === "") {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "Select a country"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.category === "") {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "Select a category"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.privateKey.length != 63) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "The Private key should be exactly 63 characters"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.price < 0.01 ||
            newArticleFormData.price > 1000000) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "The Price should be between 0.01 and 1000000 SOL"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.quantity < 1 ||
            newArticleFormData.quantity > 255) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "The Quantity should be between 1 and 255"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.title.length < 10 ||
            newArticleFormData.title > 75) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "The Title should be between 10 and 75 characters"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.imageURL.length < 10 ||
            newArticleFormData.imageURL > 50) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "The Image URL should be between 10 and 50 characters"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        if (newArticleFormData.description.length < 50 ||
            newArticleFormData.description > 750) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: "The description should be between 50 and 750 characters"
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        const errorPrivateKeyIncorrect = checkPrivateKey()
        if (errorPrivateKeyIncorrect) {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: errorPrivateKeyIncorrect
            }))
            return
        } else {
            setNewArticleFormData(prevNewArticleFormData => ({
                ...prevNewArticleFormData,
                error: ""
            }))
        }

        const uuid = Math.random().toString(36).slice(-6)
        const [article] = await PublicKey.findProgramAddress(
            [utils.bytes.utf8.encode(uuid)],
            programID
        )

        const [sellerAccount] = await PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            programID
        )

        try {
            const program = getProgram()
            const instructionInitializeArticle = program.instruction.initializeArticle(
                uuid,
                newArticleFormData.country,
                newArticleFormData.category,
                {
                    accounts: {
                        user: publicKey,
                        article: article,
                        sellerAccount: sellerAccount,
                        store: storePubKey,
                        systemProgram: SystemProgram.programId
                    }
                }
            )

            const price = new BN(parseFloat(newArticleFormData.price) * LAMPORTS_PER_SOL)
            const instructionPostArticle = program.instruction.postArticle(
                price,
                newArticleFormData.quantity,
                newArticleFormData.title,
                newArticleFormData.description,
                newArticleFormData.imageURL,
                {
                    accounts: {
                        user: publicKey,
                        article: article
                    }
                }
            )


            const txInitializeArticle = new Transaction().add(instructionInitializeArticle)
            const txPostArticle = new Transaction().add(instructionPostArticle)

            const block = await connection.getLatestBlockhash()

            const txs = [txInitializeArticle, txPostArticle]
            txs.forEach(tx => {
                tx.recentBlockhash = block.blockhash
                tx.feePayer = publicKey
            })

            const signedTxs = await signAllTransactions(txs)

            for (let signedTx of signedTxs) {
                const tx = await connection.sendRawTransaction(
                    signedTx.serialize()
                )

                await connection.confirmTransaction(tx)
                console.log(tx)
            }
            props.setShowModalNewArticle(false)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalNewArticle(false)}>
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
                            minLength={63}
                            maxLength={63}>
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
                    <hr />
                    <div className="modal-price-wrapper">
                        <h3>Rent reserve: 0.07049</h3>
                        <img className="modal-solana-logo-blue" src={solanaIconBlue} />
                    </div>
                    {newArticleFormData.error && <p className="error">{newArticleFormData.error}</p>}
                    <button className="modal-btn" type="submit">
                        Validate transaction on wallet
                    </button>
                </form >
            </div >
        </div >
    )
}