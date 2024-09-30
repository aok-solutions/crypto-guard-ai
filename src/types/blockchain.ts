export type BlockchainAddress = {
  hash160: string
  address: string
  total_sent: number
  total_received: number
  final_balance: number
  txs: BlockTransaction[]
}

export type BlockTransaction = {
  tx_index: number
  hash: string
  size: number
  weight: number
  fee: number
  double_spend: boolean
  time: number
  block_index: number
  block_height: number
  inputs: BlockInput[]
  out: Transaction[]
}

export type BlockInput = {
  sequence: number
  index: number
  prev_out: Transaction
}

export type Transaction = {
  type: number
  spent: boolean
  value: number
  tx_index: number
  addr: string
}
