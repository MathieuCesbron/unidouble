import React from "react"
import Select from 'react-select'

import "./Navbar.css"
import useStore from "../store"
import UnidoubleLogo from "../images/unidouble-logo.png"
import Connect from "./Connect"
import { countries } from "../config/countries"
import { categories } from "../config/categories"


export default function Navbar() {
    const country = useStore(state => state.country)
    const setCountry = useStore(state => state.setCountry)

    const category = useStore(state => state.category)
    const setCategory = useStore(state => state.setCategory)

    return (
        <div className="navbar">
            <img className="unidouble-logo" src={UnidoubleLogo} />
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
            <button className="navbar-btn navbar-btn-my-seller-account">My seller account</button>
            <button className="navbar-btn">My purchases</button>
            <Connect className="connect-btn" />
        </div >
    )
}