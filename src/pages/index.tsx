import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ShieldHalf } from "lucide-react"

import { useState } from "react"
import { Else, If, Then } from "react-if"
import axios, { AxiosResponse } from "axios"
import OpenAI from "openai"
import { BlockchainAddress, BlockTransaction } from "@/types/blockchain"
import { BlockTransactionCard } from "@/components/BlockTransactionCard"
import { NotFound } from "@/components/NotFound"

const blockchainInfo = axios.create({ baseURL: "https://blockchain.info" })
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const getOpenAIResponse = async (prompt: string): Promise<OpenAI.Chat.ChatCompletion> => {
  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })
}

const getBlockchainData = async (address: string): Promise<BlockchainAddress | Error> => {
  try {
    const response: AxiosResponse<BlockchainAddress> = await blockchainInfo.get(
      `/rawaddr/${address}`,
    )
    return response.data
  } catch (error) {
    const typedError = error as Error
    console.error(typedError.message)
    return typedError
  }
}

export default function Home() {
  const [blockchainAddress, setBlockchainAddress] = useState<string>("")
  const [displayAddress, setDisplayAddress] = useState<string>("")
  const [blockchainAddressData, setBlockchainAddressData] = useState<BlockchainAddress>()
  const [analysis, setAnalysis] = useState<string>("")

  const [isLoading, setIsLoading] = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)

  const resetForm = () => {
    setBlockchainAddress("")
    setIsLoading(false)
  }

  const makeAnalysis = async () => {
    setBlockchainAddressData(undefined)
    setIsLoading(true)

    const blockchainData = await getBlockchainData(blockchainAddress)
    if (blockchainData instanceof Error) {
      setIsNotFound(true)
      resetForm()
    } else {
      setIsNotFound(false)
      setBlockchainAddressData(blockchainData)

      const prompt = `give a list of possible fraud patterns detected in the following blockchain transaction data: ${JSON.stringify(blockchainData)}`
      const aiResponse = await getOpenAIResponse(prompt)
      setAnalysis(aiResponse.choices[0].message.content || "")

      setDisplayAddress(blockchainAddress)
      resetForm()
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <div className="flex items-center justify-center">
          <ShieldHalf className="h-6 w-6 mr-2" />
          <span className="font-bold">CryptoGuard.ai</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Input
            className="w-64 md:w-96"
            placeholder="Enter a blockchain address"
            type="text"
            value={blockchainAddress}
            onChange={(e) => setBlockchainAddress(e.target.value)}
          />
          <Button onClick={() => makeAnalysis()}>
            <If condition={isLoading}>
              <Then>
                <LoadingSpinner />
              </Then>
              <Else>Analyze</Else>
            </If>
          </Button>
        </div>
      </header>
      <If condition={isNotFound}>
        <Then>
          <NotFound />
        </Then>
        <Else>
          {displayAddress.length > 0 && (
            <div className="flex-1 p-6">
              <h1 className="font-bold text-muted-foreground">Blockchain Address </h1>
              <h1 className="font-extrabold tracking-tight text-3xl">{displayAddress}</h1>
            </div>
          )}
          <main className="flex-1 p-4 md:p-6 grid gap-6 md:grid-cols-2">
            {blockchainAddressData && analysis.length > 0 && (
              <>
                <section>
                  <h3 className="text-2xl font-semibold tracking-tight mb-4">Fraud Analysis</h3>
                  <div className="grid gap-4">
                    <div className="rounded-md bg-black p-6">
                      <code className="grid gap-1 text-sm text-white [&_span]:h-4">
                        <pre style={{ whiteSpace: "pre-wrap" }}>{analysis}</pre>
                      </code>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-2xl font-semibold tracking-tight mb-4">Transactions</h3>
                  {blockchainAddressData.txs.map((txn: BlockTransaction) => (
                    <BlockTransactionCard txn={txn} key={txn.block_height} />
                  ))}
                </section>
              </>
            )}
          </main>
        </Else>
      </If>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 AOK Solutions. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
