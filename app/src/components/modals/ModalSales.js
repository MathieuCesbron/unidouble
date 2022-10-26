import React, { useEffect, useState } from "react"
import cryptoJS from 'crypto-js'

import { curve } from "../../utils/crypto"
import useStore from "../../store"
import SectionSale from "../SectionSale"
import PaginationSearch from "../PaginationSearch"
import "./Modals.css"

export default function ModalSales(props) {
    const privateKey = useStore(state => state.privateKey)

    const [currentPage, setCurrentPage] = useState(1)
    const [sales, setSales] = useState([])

    const salesPerPage = 5
    const lastPostIndex = currentPage * salesPerPage
    const firstPostIndex = lastPostIndex - salesPerPage
    const currentSales = sales.slice(firstPostIndex, lastPostIndex)

    const paginate = pageNumber => setCurrentPage(pageNumber)

    const getSales = () => {
        const sales = []
        for (let i = 0; i < props.reviewers.length; i++) {
            const basepoint = curve.keyFromPublic(Buffer.from(props.buyerDiffiePublicKeys[i], "hex")).getPublic()
            const keyPair = curve.keyFromPrivate(privateKey)
            const sharedSecret = keyPair.derive(basepoint).toString("hex")

            const text = cryptoJS.AES.decrypt(
                {
                    ciphertext: cryptoJS.enc.Hex.parse(props.deliveryAddressCiphertexts[i]),
                    iv: cryptoJS.enc.Hex.parse(props.buyerIvs[i]),
                    salt: cryptoJS.enc.Hex.parse(props.buyerSalts[i]),
                },
                sharedSecret,
                { mode: cryptoJS.mode.CTR }
            )

            const deliveryAddressDecrypted = text.toString(cryptoJS.enc.Utf8)
            sales.push({
                reviewer: props.reviewers[i].toString(),
                quantityBought: props.quantityBought[i],
                deliveryAddressDecrypted: deliveryAddressDecrypted,
            })
        }

        return sales
    }

    useEffect(() => {
        setSales(getSales())
    }, [])

    return (
        <div className="modal-background">
            <div className="modal">
                <div className="modal-exit">
                    <button
                        className="modal-exit-btn"
                        onClick={() => props.setShowModalSales(false)}>
                        EXIT
                    </button>
                </div>
                <h2>Sales for #{props.uuid}</h2>
                <hr />
                {
                    currentSales.map((
                        {
                            reviewer,
                            quantityBought,
                            deliveryAddressDecrypted
                        }, index) => <SectionSale
                            key={index}
                            reviewer={reviewer}
                            quantityBought={quantityBought}
                            deliveryAddressDecrypted={deliveryAddressDecrypted}
                        />)
                }
                {
                    sales.length > salesPerPage && <PaginationSearch
                        articlesPerPage={salesPerPage}
                        totalArticles={sales.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                }
            </div>
        </div>
    )
}