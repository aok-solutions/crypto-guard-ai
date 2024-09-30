import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import OpenAI from "openai"
import axios from "axios"
import { ChatCompletion } from "openai/resources"

const blockchainInfo = axios.create({
  baseURL: "https://blockchain.info",
  headers: {
    "Content-Type": "application/json",
  },
})

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const getOpenAIResponse = async (prompt): Promise<ChatCompletion> => {
  return await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })
}

const getBlockchainData = async (address: string) => {
  const response = await blockchainInfo.get(`/rawaddr/${address}`)
  console.log(response.data)
  return response.data
}

export const Analyze = () => {
  const [blockchainAddress, setBlockchainAddress] = useState<string>("")

  const makeAnalysis = async () => {
    const blockchainData = await getBlockchainData(blockchainAddress)
    const prompt = `give a bullet point list of possible fraud patterns detected in the following blockchain transaction data: ${JSON.stringify(blockchainData)}`
    const aiResponse: ChatCompletion = await getOpenAIResponse(prompt)
    console.log(aiResponse.choices[0].message.content)
  }

  return (
    <form className="flex space-x-2">
      <Input
        className="flex-1"
        placeholder="Enter a blockchain address"
        type="text"
        value={blockchainAddress}
        onChange={(e) => setBlockchainAddress(e.target.value)}
      />
      <Button type="submit" onClick={() => makeAnalysis()}>
        Analyze
      </Button>
    </form>
  )
}
