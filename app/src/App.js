import React from "react"
import { Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Search from "./pages/Search"
import SellerAccount from "./pages/SellerAccount"
import MyPurchases from "./pages/MyPurchases"
import { WalletContext } from "./components/WalletContext"
import "./App.css"

export default function App() {
  return (
    <>
      <WalletContext>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/seller-account" element={<SellerAccount />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
        </Routes>
      </WalletContext>
    </>
  )
}