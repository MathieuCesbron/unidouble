import React from "react"
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "./Navbar.css"
import useStore from "../store"
import UnidoubleLogo from "../images/unidouble-logo.png"
import { countries } from "../config/countries"
import { categories } from "../config/categories"
import { useWallet } from "@solana/wallet-adapter-react";


export default function Navbar() {
    const { connected } = useWallet()

    const navigate = useNavigate()

    const country = useStore(state => state.country)
    const setCountry = useStore(state => state.setCountry)

    const category = useStore(state => state.category)
    const setCategory = useStore(state => state.setCategory)

    const setHomePage = () => {
        navigate("/")
    }

    const setSellerAccountPage = () => {
        navigate("/seller-account")
    }

    const setMyPurchasesPage = () => {
        navigate("/my-purchases")
    }

    return (
        <div className="navbar">
            <img className="unidouble-logo" src={UnidoubleLogo} onClick={setHomePage} />
            <>
                <Select
                    className="select select-country"
                    placeholder="Select country"
                    options={countries}
                    value={countries.find(c => c.value === country)}
                    onChange={setCountry}
                />
                <Select
                    className="select select-category"
                    placeholder="Select category"
                    options={categories}
                    value={categories.find(c => c.value === category)}
                    onChange={setCategory}
                />
            </>
            <button disabled={!connected} className="navbar-btn navbar-btn-my-seller-account" onClick={setSellerAccountPage}>My seller account</button>
            <button disabled={!connected} className="navbar-btn" onClick={setMyPurchasesPage}>My purchases</button>
            <WalletMultiButton />
        </div >
    )
}