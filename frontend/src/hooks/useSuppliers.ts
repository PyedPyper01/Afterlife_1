import { useState, useEffect, useCallback } from 'react'
import { getSuppliers, Supplier, SupplierFilters } from '../services/api'

interface UseSupplierOptions {
  initialFilters?: SupplierFilters
  autoFetch?: boolean
}

interface UseSupplierReturn {
  suppliers: Supplier[]
  isLoading: boolean
  error: string | null
  total: number
  filters: SupplierFilters
  setFilters: (filters: SupplierFilters) => void
  refetch: () => Promise<void>
}

export function useSuppliers(options: UseSupplierOptions = {}): UseSupplierReturn {
  const { initialFilters = {}, autoFetch = true } = options
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<SupplierFilters>(initialFilters)

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await getSuppliers(filters)
      setSuppliers(response.suppliers)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to fetch suppliers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load suppliers')
      setSuppliers([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (autoFetch) {
      fetchSuppliers()
    }
  }, [fetchSuppliers, autoFetch])

  return {
    suppliers,
    isLoading,
    error,
    total,
    filters,
    setFilters,
    refetch: fetchSuppliers
  }
}

export default useSuppliers
