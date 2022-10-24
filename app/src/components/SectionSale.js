import React from "react"

export default function SectionSale(props) {
    return (
        <div>
            <p>
                Buyer: {props.reviewer}
                <br />
                Quantity: {props.quantityBought}
                <br />
                Delivery address: {props.deliveryAddressDecrypted}
            </p>
            <hr />
        </div>
    )
}