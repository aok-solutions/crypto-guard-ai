import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ShieldHalf, ArrowUpRight, ArrowDownRight } from "lucide-react"

import { useState } from "react"
import { Else, If, Then } from "react-if"
import axios, { AxiosResponse } from "axios"
import OpenAI from "openai"
import { BlockchainAddress, BlockInput, BlockTransaction, Transaction } from "@/types/blockchain"
import { formatBTC, formatTimestamp } from "@/lib/utils"

const blockchainInfo = axios.create({
  baseURL: "https://blockchain.info",
})

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

const getBlockchainData = async (address: string): Promise<BlockchainAddress> => {
  const response: AxiosResponse<BlockchainAddress> = await blockchainInfo.get(`/rawaddr/${address}`)
  return response.data
}

export default function Home() {
  const [blockchainAddress, setBlockchainAddress] = useState<string>("")
  const [displayAddress, setDisplayAddress] = useState<string>("")
  const [blockchainAddressData, setBlockchainAddressData] = useState<BlockchainAddress>()
  const [analysis, setAnalysis] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const makeAnalysis = async () => {
    setBlockchainAddressData(undefined)
    setIsLoading(true)

    const blockchainData = await getBlockchainData(blockchainAddress)
    setBlockchainAddressData(blockchainData)
    const prompt = `give a list of possible fraud patterns detected in the following blockchain transaction data: ${JSON.stringify(blockchainData)}`
    const aiResponse = await getOpenAIResponse(prompt)
    setAnalysis(aiResponse.choices[0].message.content || "")

    setDisplayAddress(blockchainAddress)
    setBlockchainAddress("")
    setIsLoading(false)
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
                <Card key={txn.block_height} className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Block {txn.block_height}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Hash: </strong>
                      {txn.hash}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Timestamp: </strong> {formatTimestamp(txn.time)}
                    </p>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="transactions">
                        <AccordionTrigger>
                          Transactions ({txn.inputs.length + txn.out.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {txn.inputs.map((tx: BlockInput) => {
                                const transaction: Transaction = tx.prev_out
                                return (
                                  <TableRow key={transaction.tx_index}>
                                    <TableCell>
                                      <ArrowDownRight className="text-green-500" />
                                    </TableCell>
                                    <TableCell className="font-mono">
                                      {transaction.tx_index}
                                    </TableCell>
                                    <TableCell className="font-mono">{transaction.addr}</TableCell>
                                    <TableCell className="font-mono">
                                      {formatBTC(transaction.value)}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                              {txn.out.map((tx: Transaction) => (
                                <TableRow key={tx.tx_index}>
                                  <TableCell>
                                    <ArrowUpRight className="text-red-500" />
                                  </TableCell>
                                  <TableCell className="font-mono">{tx.tx_index}</TableCell>
                                  <TableCell className="font-mono">{tx.addr}</TableCell>
                                  <TableCell className="font-mono">{formatBTC(tx.value)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </section>
          </>
        )}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 AOK Solutions. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
