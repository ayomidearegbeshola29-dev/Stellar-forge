import React, { useState, useEffect, useMemo } from 'react'
import { Input } from './UI/Input'
import { useDebounce } from '../hooks/useDebounce'
import { stellarService } from '../services/stellar'
import type { TokenInfo } from '../types'

type SortOption = 'newest' | 'oldest' | 'name-az'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest First',
  oldest: 'Oldest First',
  'name-az': 'Name A–Z',
}

export const Dashboard: React.FC = () => {
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [loading, setLoading] = useState(true)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    stellarService.getAllTokens()
      .then(setTokens)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase()

    const result = query
      ? tokens.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.symbol.toLowerCase().includes(query)
        )
      : [...tokens]

    result.sort((a, b) => {
      if (sort === 'name-az') return a.name.localeCompare(b.name)
      if (sort === 'oldest') return (a.createdAt ?? 0) - (b.createdAt ?? 0)
      return (b.createdAt ?? 0) - (a.createdAt ?? 0) // newest
    })

    return result
  }, [tokens, debouncedSearch, sort])

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            label="Search tokens"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or symbol..."
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading tokens...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">
          {debouncedSearch
            ? 'No tokens match your search.'
            : 'No tokens have been deployed yet.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((token) => (
            <li key={`${token.symbol}-${token.creator}`} className="p-3 border rounded-md text-sm space-y-1">
              <div className="font-medium">
                {token.name}{' '}
                <span className="text-gray-500">({token.symbol})</span>
              </div>
              <div className="text-gray-600 text-xs">
                Supply: {token.totalSupply} · Decimals: {token.decimals}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
