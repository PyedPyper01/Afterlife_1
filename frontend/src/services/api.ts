/**
 * API Service - Centralized API calls for AfterLife
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'

class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.detail || `API error: ${response.status}`,
      response.status,
      errorData
    )
  }
  return response.json()
}

// ============================================
// Chat API
// ============================================

export interface ChatContext {
  answers?: Record<string, any>
  currentStep?: string
}

export interface ChatResponse {
  response: string
  tool_used?: string | null
  suggested_action?: string | null
}

export async function sendChatMessage(
  message: string,
  context?: ChatContext
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context })
  })
  return handleResponse<ChatResponse>(response)
}

// ============================================
// Suppliers API
// ============================================

export interface Supplier {
  id: string
  name: string
  type: string
  location: string
  postcode: string
  description: string
  priceRange: string
  rating: number
  reviewCount: number
  phone: string
  email: string
  website?: string
  services: string[]
  verified: boolean
}

export interface SuppliersResponse {
  suppliers: Supplier[]
  total: number
}

export interface SupplierFilters {
  type?: string
  location?: string
  postcode?: string
  search?: string
}

export async function getSuppliers(filters?: SupplierFilters): Promise<SuppliersResponse> {
  const params = new URLSearchParams()
  if (filters?.type) params.append('type', filters.type)
  if (filters?.location) params.append('location', filters.location)
  if (filters?.postcode) params.append('postcode', filters.postcode)
  if (filters?.search) params.append('search', filters.search)
  
  const queryString = params.toString()
  const url = `${API_BASE_URL}/api/suppliers${queryString ? `?${queryString}` : ''}`
  
  const response = await fetch(url)
  return handleResponse<SuppliersResponse>(response)
}

export async function getSupplier(id: string): Promise<Supplier> {
  const response = await fetch(`${API_BASE_URL}/api/suppliers/${id}`)
  return handleResponse<Supplier>(response)
}

export interface QuoteRequest {
  supplier_id: string
  message: string
  contact_name: string
  contact_email: string
  contact_phone?: string
}

export async function requestQuote(supplierId: string, quote: QuoteRequest): Promise<{ success: boolean; quote_id: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/suppliers/${supplierId}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  })
  return handleResponse(response)
}

// ============================================
// Memorials API
// ============================================

export interface Condolence {
  id?: string
  author: string
  message: string
  timestamp?: string
}

export interface Memorial {
  id?: string
  name: string
  dateOfBirth: string
  dateOfDeath: string
  biography?: string
  photos: string[]
  condolences: Condolence[]
  created_at?: string
  user_id?: string
  is_public?: boolean
}

export interface MemorialsResponse {
  memorials: Memorial[]
  total: number
}

export async function getMemorials(userId?: string): Promise<MemorialsResponse> {
  const url = userId 
    ? `${API_BASE_URL}/api/memorials?user_id=${userId}`
    : `${API_BASE_URL}/api/memorials`
  
  const response = await fetch(url)
  return handleResponse<MemorialsResponse>(response)
}

export async function getMemorial(id: string): Promise<Memorial> {
  const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`)
  return handleResponse<Memorial>(response)
}

export async function createMemorial(memorial: Omit<Memorial, 'id' | 'condolences' | 'created_at'>): Promise<Memorial> {
  const response = await fetch(`${API_BASE_URL}/api/memorials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memorial)
  })
  return handleResponse<Memorial>(response)
}

export async function updateMemorial(id: string, memorial: Partial<Memorial>): Promise<Memorial> {
  const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memorial)
  })
  return handleResponse<Memorial>(response)
}

export async function deleteMemorial(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/memorials/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}

export async function addCondolence(memorialId: string, condolence: { author: string; message: string }): Promise<Condolence> {
  const response = await fetch(`${API_BASE_URL}/api/memorials/${memorialId}/condolences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(condolence)
  })
  return handleResponse<Condolence>(response)
}

// ============================================
// Documents API
// ============================================

export interface Document {
  id: string
  name: string
  type: string
  category: string
  filename?: string
  content_type?: string
  size?: number
  uploaded_at?: string
  file_data?: string
}

export interface DocumentsResponse {
  documents: Document[]
  total: number
}

export async function getDocuments(filters?: { user_id?: string; category?: string }): Promise<DocumentsResponse> {
  const params = new URLSearchParams()
  if (filters?.user_id) params.append('user_id', filters.user_id)
  if (filters?.category) params.append('category', filters.category)
  
  const queryString = params.toString()
  const url = `${API_BASE_URL}/api/documents${queryString ? `?${queryString}` : ''}`
  
  const response = await fetch(url)
  return handleResponse<DocumentsResponse>(response)
}

export async function getDocument(id: string): Promise<Document> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${id}`)
  return handleResponse<Document>(response)
}

export async function uploadDocument(
  file: File,
  metadata: { name: string; type: string; category: string }
): Promise<Document> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('name', metadata.name)
  formData.append('type', metadata.type)
  formData.append('category', metadata.category)
  
  const response = await fetch(`${API_BASE_URL}/api/documents`, {
    method: 'POST',
    body: formData
  })
  return handleResponse<Document>(response)
}

export async function deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}

// ============================================
// Guidance API
// ============================================

export interface GuidanceData {
  registration_deadline: string
  probate_term: string
  tell_us_once: boolean
  registrar_link: string
  key_steps: string[]
}

export async function getGuidance(jurisdiction: string): Promise<GuidanceData> {
  const response = await fetch(`${API_BASE_URL}/api/triage/guidance?jurisdiction=${jurisdiction}`)
  return handleResponse<GuidanceData>(response)
}

// ============================================
// Health Check
// ============================================

export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/healthz`)
  return handleResponse(response)
}

export { ApiError }
