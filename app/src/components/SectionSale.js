import React from "react"

export default function SectionSale(props) {
    return (
        <div>
            <p>
                <b>Buyer:</b> {props.reviewer}
                <br />
                <b>Quantity:</b> {props.quantityBought}
                <br />
                <b>Delivery address:</b> {props.deliveryAddressDecrypted}
            </p>
            <hr />
        </div>
    )
}