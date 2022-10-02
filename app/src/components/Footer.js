import React from "react"
import { useNavigate } from "react-router-dom"
import "./Footer.css"

export default function Footer() {
    const navigate = useNavigate()

    return (
        <div className="footer">
            <p
                className="footer-link"
                onClick={() => navigate("/whitepaper")}>
                Whitepaper
            </p>
            <p
                className="footer-link"
                onClick={() => navigate("/terms-and-conditions")}>
                Terms and Conditions</p>
        </div>
    )
}