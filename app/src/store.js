import create from "zustand"

const useStore = create(set => ({
    programID: "C4TX181DDiFWoshCY3S8yMu6agRnz3cov2tQ87XsdimJ",
    storeCreatorPubKey: "2a8V8LjEajNuJMoTK6Z1jbjBJLgJMr75VB8HYF1sUJZd",

    country: { value: 0, label: "United States" },
    setCountry: (country) => set(state => ({ country })),

    category: { value: 0, label: "Homemade" },
    setCategory: (category) => set(state => ({ category })),

    isSellerAccount: false,
    setSellerAcount: () => set(state => ({ isSellerAccount: !state.isSellerAccount }))
}))

export default useStore