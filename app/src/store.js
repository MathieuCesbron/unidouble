import create from "zustand"

const useStore = create((set) => ({
    country: 0,
    category: 0,
    setCountry: (country) => set(state => { country }),
    setCategory: (category) => set(state => { category })
}))

export default useStore