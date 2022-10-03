import React from "react"

import whitepaperPDF from "../PDFs/whitepaper.pdf"

export default function Whitepaper() {
    return (
        <iframe width="99.7%" height="100%" src={whitepaperPDF}>
        </iframe>
    )
}