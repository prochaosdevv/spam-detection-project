"use client"

import { useState } from "react"

export default function WalletUI() {
  const [connectedAddress, setConnectedAddress] = useState("")
  const [inputAddress, setInputAddress] = useState("")
  const [amount, setAmount] = useState("0")
  const [value, setValue] = useState("0")

  const handleConnect = () => {
    // Placeholder for connect functionality
    setConnectedAddress("0x1234...5678")
  }

  const handleAddBalance = () => {
    // Placeholder for add balance functionality
    setValue((prevValue) => String(Number(prevValue) + Number(amount)))
  }

  const handleClaim = () => {
    // Placeholder for claim functionality
    console.log("Claim button clicked")
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <button onClick={handleConnect} className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded">
        CONNECT
      </button>

      <div className="mt-16 border border-black p-4 rounded">
        <input
          type="text"
          placeholder="WALLET ADDRESS"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="w-full border border-black p-2 mb-4"
        />
        <div className="flex items-center mb-4">
          <label className="mr-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-black p-2 w-full"
          />
        </div>
        <button onClick={handleAddBalance} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          ADD BAL
        </button>
      </div>

      <div className="mt-4 border border-black p-4 rounded">
        <h2 className="font-bold mb-2">CONNECTED WALLET</h2>
        <p>{connectedAddress || "Not connected"}</p>
      </div>

      <div className="mt-4 flex items-center">
        <span className="font-bold mr-2">AMOUNT-</span>
        <div className="border border-black p-2 flex-grow">
          <span className="font-bold">VALUE 2:</span> {value}
        </div>
      </div>

      <button
        onClick={handleClaim}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded border border-black hover:bg-blue-600"
      >
        CLAIM
      </button>
    </div>
  )
}

