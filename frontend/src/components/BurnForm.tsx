import { useState, useEffect } from 'react'
import { Input, Button, ConfirmModal } from './UI'
import { useDebounce } from '../hooks/useDebounce'
import { stellarService } from '../services/stellar'
import type { TokenInfo } from '../types'

interface BurnFormProps {
  tokenAddress?: string
  onSuccess?: () => void
}

export const BurnForm: React.FC<BurnFormProps> = ({ tokenAddress: initialAddress = '', onSuccess }) => {
  const [tokenAddress, setTokenAddress] = useState(initialAddress)
  const [amount, setAmount] = useState('')
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [pending, setPending] = useState(false)

  const debouncedAddress = useDebounce(tokenAddress, 300)

  useEffect(() => {
    if (!debouncedAddress) return
    stellarService.getTokenInfo(debouncedAddress).then(setTokenInfo).catch(() => setTokenInfo(null))
  }, [debouncedAddress])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
  }

  const handleConfirm = () => {
    setPending(false)
    // burn logic placeholder
    onSuccess?.()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Token Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="G..."
          required
        />
        {tokenInfo && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Token: {tokenInfo.name} ({tokenInfo.symbol})
          </p>
        )}
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          min="0"
          required
        />
        <Button type="submit" variant="secondary">Burn</Button>
      </form>

      <ConfirmModal
        isOpen={pending}
        title="Confirm Burn"
        description="This will permanently destroy the specified token amount."
        details={[
          { label: 'Token', value: tokenInfo ? `${tokenInfo.name} (${tokenInfo.symbol})` : tokenAddress },
          { label: 'Amount to Burn', value: amount },
        ]}
        onConfirm={handleConfirm}
        onCancel={() => setPending(false)}
        confirmLabel="Burn Tokens"
      />
    </>
  )
}
