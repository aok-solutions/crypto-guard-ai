import { BlockInput, BlockTransaction, Transaction } from "@/types/blockchain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBTC, formatTimestamp } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

type Props = {
  txn: BlockTransaction
}
export const BlockTransactionCard = ({ txn }: Props) => {
  return (
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
            <AccordionTrigger>Transactions ({txn.inputs.length + txn.out.length})</AccordionTrigger>
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
                        <TableCell className="font-mono">{transaction.tx_index}</TableCell>
                        <TableCell className="font-mono">{transaction.addr}</TableCell>
                        <TableCell className="font-mono">{formatBTC(transaction.value)}</TableCell>
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
  )
}
