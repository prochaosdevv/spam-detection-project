"use client"

import { useEffect, useState } from "react"
 
const TRON_NODE = "https://nile.trongrid.io"; // Mainnet URL (Use "https://nile.trongrid.io" for testnet)
const CONTRACT_ADDRESS = "TSYinjDEmpVNabieQ2JYHzgDZWCkkLWMnc"; // Replace with your deployed contract address




export default function WalletUI() {
  const [connectedAddress, setConnectedAddress] = useState("")
  const [inputAddress, setInputAddress] = useState("")
  const [amount, setAmount] = useState("0")
  const [value, setValue] = useState("0")
  const [wallet, setWallet] = useState("");
  const [tronWeb, setTronWeb] = useState(null);
  const [rewardBalance, setRewardBalance] = useState("0");
 
  useEffect(() => {
    connectTron()
  }, []);
  useEffect(() => {
    if(wallet){
      getRewardBalance()      
    }
  },[wallet])
  const connectTron = async () => {
    if(window.tronWeb){
      setTronWeb(window.tronWeb);
    }
    if (window.tronWeb && window.tronWeb.ready) {
      setWallet(window.tronWeb.defaultAddress.base58);
     
    } else {
      console.log("TronLink is not connected!");
    }
  };

  const getContract = async () => {
    return await tronWeb.contract().at(CONTRACT_ADDRESS);
  };
  
  const addReward = async (userAddress, amount) => {
    try {
      const contract = await getContract();
      const result = await contract.addReward(userAddress, amount*1e6).send({
        feeLimit: 100_000_000, // Adjust fee limit if needed
      });
  
      console.log("Reward added successfully:", result);
      return result;
    } catch (error) {
      console.error("Error adding reward:", error);
    }
  };

  const handleConnect = () => {
    // Placeholder for connect functionality
    connectTron()
  }

  const getRewardBalance = async () => {
    try {
      const contract = await getContract();
      const balance = await contract.rewards(wallet).call();
      setRewardBalance(balance.toString()/1e6)
    } catch (error) {
      console.error("Error getting reward balance:", error);
      return "0";
    }
  };

  const handleAddBalance = () => {
    // Placeholder for add balance functionality
    // setValue((prevValue) => String(Number(prevValue) + Number(amount)))
    addReward(inputAddress,amount)
  }

  const claimReward = async () => {
    try {
      const contract = await getContract();
      const result = await contract.claimReward().send({
        shouldPollResponse: true,
      });
  
      console.log("Reward claimed successfully:", result);
      return result;
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };

  const handleClaim = async () => {
    // Placeholder for claim functionality
    // alert("Claim button clicked")
    await claimReward()
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {
        wallet ?
        <button   className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded">
        {wallet}
      </button>
      :
      <button onClick={handleConnect} className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded">
      CONNECT
    </button>
      }
     

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
      {
        wallet &&
        <>

      <div className="mt-4 border border-black p-4 rounded">
        <h2 className="font-bold mb-2">CONNECTED WALLET</h2>
        <p>{wallet || "Not connected"}</p>
      </div>

      <div className="mt-4 flex items-center">
        <span className="font-bold mr-2">CLAIMABLE AMOUNT-</span>
        <div className="border border-black p-2 flex-grow">
          <span className="font-bold">{rewardBalance}</span>  
        </div>
      </div>

      <button
        onClick={handleClaim}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded border border-black hover:bg-blue-600"
        disabled={rewardBalance == 0}
      >
        CLAIM
      </button>
              
      </>
      }

    </div>
  )
}

