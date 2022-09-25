import create from "zustand"
import { PublicKey } from "@solana/web3.js"

import idl from "./utils/idl.json"

const useStore = create(set => ({
    programID: new PublicKey(idl.metadata.address),
    storeCreatorPubKey: "2a8V8LjEajNuJMoTK6Z1jbjBJLgJMr75VB8HYF1sUJZd",

    country: { value: 0, label: "United States" },
    setCountry: (country) => set(state => ({ country })),

    category: { value: 0, label: "Homemade" },
    setCategory: (category) => set(state => ({ category })),

    isSellerAccount: false,
    setSellerAcount: () => set(state => ({ isSellerAccount: !state.isSellerAccount }))
}))

export default useStore