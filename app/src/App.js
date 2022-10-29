import React, { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'


import { WalletContext } from "./components/WalletContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Search from "./pages/Search"
import SellerAccount from "./pages/SellerAccount"
import Sales from "./pages/Sales"
import MyArticles from "./pages/MyArticles"
import MyPurchases from "./pages/MyPurchases"
import Whitepaper from "./pages/Whitepaper"
import TermsAndConditions from "./pages/TermsAndConditions"
import Footer from "./components/Footer"
import useStore from "./store"
import "./App.css"
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const toastNotify = (msg) => toast(msg)
  const toastMsg = useStore(state => state.toastMsg)
  const setToastMsg = useStore(state => state.setToastMsg)

  useEffect(() => {
    if (toastMsg != "") {
      toastNotify(toastMsg)
    }
    setToastMsg("")
  }, [toastMsg])

  return (
    <>
      <WalletContext>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:country/:category" element={<Search />} />
          <Route path="/seller-account" element={<SellerAccount />} />
          <Route path="/seller-account/sales" element={<Sales />} />
          <Route path="/seller-account/my-articles" element={<MyArticles />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          draggable
          theme="light" />

      </WalletContext>
      <Footer />
    </>
  )
}