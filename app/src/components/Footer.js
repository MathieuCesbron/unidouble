import React from "react"
import { useNavigate } from "react-router-dom"
import "./Footer.css"

export default function Footer() {
    const navigate = useNavigate()

    return (
        <div className="footer">
            <p onClick={() => navigate("/whitepaper")}>Whitepaper</p>
            <p onClick={() => navigate("/terms-and-conditions")}>Terms and Conditions</p>
        </div>
    )
}