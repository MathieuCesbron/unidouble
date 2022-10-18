import React from "react"
import { Route, Routes } from "react-router-dom"

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
import "./App.css"

export default function App() {
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
      </WalletContext>
      <Footer />
    </>
  )
}