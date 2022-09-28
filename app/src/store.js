import create from "zustand"

const useStore = create(set => ({
    country: { value: 0, label: "United States" },
    setCountry: (country) => set(state => ({ country })),

    category: { value: 0, label: "Homemade" },
    setCategory: (category) => set(state => ({ category })),

    isSellerAccount: false,
    setSellerAcount: () => set(state => ({ isSellerAccount: !state.isSellerAccount }))
}))

export default useStore