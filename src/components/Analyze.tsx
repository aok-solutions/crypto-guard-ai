import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

const blockchainInfo = axios.create({
  baseURL: "https://blockchain.info",
  headers: {
    "Content-Type": "application/json",
  },
})

const getBlockchainData = async (address: string) => {
  const response = await blockchainInfo.get(`/rawaddr/${address}`)
  console.log(response.data)
  return response.data
}

export const Analyze = () => {
  const [blockchainAddress, setBlockchainAddress] = useState<string>("")

  return (
    <form className="flex space-x-2">
      <Input
        className="flex-1"
        placeholder="Enter a blockchain address"
        type="text"
        value={blockchainAddress}
        onChange={(e) => setBlockchainAddress(e.target.value)}
      />
      <Button type="submit" onClick={() => getBlockchainData(blockchainAddress)}>
        Analyze
      </Button>
    </form>
  )
}
