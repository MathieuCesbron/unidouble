import React from "react"
import cryptoJS from 'crypto-js'

import { curve } from "../../utils/crypto"
import useStore from "../../store"
import "./Modals.css"

export default function ModalSales(props) {
    const privateKey = useStore(state => state.privateKey)
    const sellerDiffiePubKey = useStore(state => state.sellerDiffiePubKey)
    console.log(sellerDiffiePubKey)

    const getSales = () => {
        const res = []
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

            res.push({
                reviewer: props.reviewers[i],
                quantityBought: props.quantityBought[i],
                deliveryAddressDecrypted: deliveryAddressDecrypted,
            })
        }

        return res
    }

    getSales()

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
            </div>
        </div>
    )
}