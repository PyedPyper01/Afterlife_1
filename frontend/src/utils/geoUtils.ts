import { suppliers } from '../components/MarketplaceScreen'

interface Supplier {
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

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  
  const lat1Rad = (lat1 * Math.PI) / 180
  const lat2Rad = (lat2 * Math.PI) / 180
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

export function postcodeToLatLon(postcode: string): { lat: number; lon: number } | null {
  const postcodeArea = postcode.trim().toUpperCase().match(/^([A-Z]{1,2})/)?.[1]
  
  if (!postcodeArea) return null
  
  const postcodeAreas: Record<string, { lat: number; lon: number }> = {
    'E': { lat: 51.5397, lon: -0.0547 },
    'EC': { lat: 51.5197, lon: -0.0947 },
    'N': { lat: 51.5897, lon: -0.1147 },
    'NW': { lat: 51.5597, lon: -0.1847 },
    'SE': { lat: 51.4697, lon: -0.0547 },
    'SW': { lat: 51.4597, lon: -0.1647 },
    'W': { lat: 51.5097, lon: -0.2047 },
    'WC': { lat: 51.5197, lon: -0.1247 },
    
    'BR': { lat: 51.4097, lon: 0.0147 },
    'CR': { lat: 51.3797, lon: -0.0947 },
    'DA': { lat: 51.4497, lon: 0.2047 },
    'GU': { lat: 51.2397, lon: -0.5747 },
    'KT': { lat: 51.3697, lon: -0.3047 },
    'ME': { lat: 51.3897, lon: 0.5247 },
    'RH': { lat: 51.1197, lon: -0.1647 },
    'SM': { lat: 51.3797, lon: -0.1947 },
    'TN': { lat: 51.1297, lon: 0.2647 },
    'TW': { lat: 51.4497, lon: -0.3347 },
    'BN': { lat: 50.8297, lon: -0.1347 },
    'PO': { lat: 50.8197, lon: -1.0847 },
    'SO': { lat: 50.9097, lon: -1.4047 },
    'RG': { lat: 51.4597, lon: -0.9747 },
    'SL': { lat: 51.5097, lon: -0.5947 },
    'AL': { lat: 51.7520, lon: -0.3360 },
    'HP': { lat: 51.7520, lon: -0.4700 },
    'WD': { lat: 51.6570, lon: -0.3960 },
    'LU': { lat: 51.8787, lon: -0.4200 },
    
    'BA': { lat: 51.3797, lon: -2.3647 },
    'BS': { lat: 51.4597, lon: -2.5947 },
    'DT': { lat: 50.7197, lon: -2.4447 },
    'EX': { lat: 50.7197, lon: -3.5347 },
    'GL': { lat: 51.8697, lon: -2.2447 },
    'PL': { lat: 50.3797, lon: -4.1447 },
    'TA': { lat: 51.0197, lon: -3.1047 },
    'TQ': { lat: 50.4697, lon: -3.5247 },
    'TR': { lat: 50.2697, lon: -5.0547 },
    
    'B': { lat: 52.4797, lon: -1.9047 },
    'CV': { lat: 52.4097, lon: -1.5147 },
    'DE': { lat: 52.9197, lon: -1.4747 },
    'DY': { lat: 52.5097, lon: -2.0847 },
    'LE': { lat: 52.6397, lon: -1.1347 },
    'NG': { lat: 52.9597, lon: -1.1547 },
    'NN': { lat: 52.2397, lon: -0.8947 },
    'ST': { lat: 52.9897, lon: -2.1847 },
    'WS': { lat: 52.5897, lon: -1.9847 },
    'WV': { lat: 52.5897, lon: -2.1247 },
    
    'BB': { lat: 53.7497, lon: -2.4847 },
    'BL': { lat: 53.5797, lon: -2.4347 },
    'CH': { lat: 53.1997, lon: -2.8947 },
    'CW': { lat: 53.0997, lon: -2.5247 },
    'FY': { lat: 53.8197, lon: -3.0547 },
    'L': { lat: 53.4097, lon: -2.9847 },
    'LA': { lat: 54.0497, lon: -2.8047 },
    'M': { lat: 53.4797, lon: -2.2447 },
    'OL': { lat: 53.5497, lon: -2.1147 },
    'PR': { lat: 53.7597, lon: -2.7047 },
    'SK': { lat: 53.4097, lon: -2.1547 },
    'WA': { lat: 53.3897, lon: -2.5947 },
    'WN': { lat: 53.5397, lon: -2.6347 },
    
    'BD': { lat: 53.7997, lon: -1.7547 },
    'DN': { lat: 53.5797, lon: -1.1347 },
    'HD': { lat: 53.6497, lon: -1.7847 },
    'HG': { lat: 54.0097, lon: -1.5447 },
    'HU': { lat: 53.7497, lon: -0.3347 },
    'HX': { lat: 53.7297, lon: -1.8647 },
    'LS': { lat: 53.8097, lon: -1.5547 },
    'S': { lat: 53.3797, lon: -1.4647 },
    'WF': { lat: 53.6797, lon: -1.4947 },
    'YO': { lat: 53.9597, lon: -1.0847 },
    
    'DH': { lat: 54.8597, lon: -1.5647 },
    'DL': { lat: 54.5297, lon: -1.5547 },
    'NE': { lat: 54.9797, lon: -1.6147 },
    'SR': { lat: 54.9097, lon: -1.3847 },
    'TS': { lat: 54.5697, lon: -1.2347 },
    
    'AB': { lat: 57.1497, lon: -2.0947 },
    'DD': { lat: 56.4597, lon: -2.9747 },
    'DG': { lat: 55.0697, lon: -3.6047 },
    'EH': { lat: 55.9497, lon: -3.1847 },
    'FK': { lat: 56.1197, lon: -3.7847 },
    'G': { lat: 55.8597, lon: -4.2547 },
    'IV': { lat: 57.4797, lon: -4.2247 },
    'KA': { lat: 55.6097, lon: -4.6247 },
    'KY': { lat: 56.1197, lon: -3.1647 },
    'ML': { lat: 55.7697, lon: -3.7847 },
    'PA': { lat: 55.9497, lon: -4.8747 },
    'PH': { lat: 56.3997, lon: -3.4347 },
    'TD': { lat: 55.5697, lon: -2.7847 },
    
    'CF': { lat: 51.4797, lon: -3.1847 },
    'LL': { lat: 53.2197, lon: -4.1247 },
    'NP': { lat: 51.5897, lon: -2.9947 },
    'SA': { lat: 51.6197, lon: -3.9447 },
    'SY': { lat: 52.5097, lon: -3.3347 },
    
    'BT': { lat: 54.5977, lon: -5.9301 },
  }
  
  return postcodeAreas[postcodeArea] || null
}

export function findNearestCrematoria(postcode: string, limit: number = 3): Array<Crematorium & { distance: number }> {
  const userLocation = postcodeToLatLon(postcode)
  
  if (!userLocation) {
    return []
  }
  
  const crematoriaWithDistances = crematoria.map(crem => ({
    ...crem,
    distance: haversineDistance(userLocation.lat, userLocation.lon, crem.lat, crem.lon)
  }))
  
  return crematoriaWithDistances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

export function formatCrematoriaResults(postcode: string, results: Array<Crematorium & { distance: number }>): string {
  if (results.length === 0) {
    return `I couldn't find any crematoria for postcode ${postcode}. Please check the postcode is correct.`
  }
  
  let response = `Here are the ${results.length} nearest crematoria to ${postcode}:\n\n`
  
  results.forEach((crem, index) => {
    response += `${index + 1}. **${crem.name}** — ${crem.distance.toFixed(1)} miles away\n`
    response += `   Address: ${crem.address}, ${crem.city}, ${crem.postcode}\n`
    if (crem.phone) {
      response += `   Phone: ${crem.phone}\n`
    }
    if (crem.website) {
      response += `   Website: ${crem.website}\n`
    }
    response += `   [View on Google Maps](https://www.google.com/maps/search/?api=1&query=${crem.lat},${crem.lon})\n\n`
  })
  
  return response
}

export function findNearestFuneralDirectors(postcode: string, limit: number = 3): Array<Supplier & { distance: number }> {
  const userLocation = postcodeToLatLon(postcode)
  
  if (!userLocation) {
    return []
  }
  
  const funeralDirectors = suppliers.filter(s => s.type === 'funeral-director')
  
  const directorsWithDistances = funeralDirectors.map(director => {
    const directorLocation = postcodeToLatLon(director.postcode)
    if (!directorLocation) {
      return { ...director, distance: 999999 }
    }
    return {
      ...director,
      distance: haversineDistance(userLocation.lat, userLocation.lon, directorLocation.lat, directorLocation.lon)
    }
  })
  
  return directorsWithDistances
    .filter(d => d.distance < 999999)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

export function formatFuneralDirectorResults(postcode: string, results: Array<Supplier & { distance: number }>): string {
  if (results.length === 0) {
    return `I couldn't find any funeral directors near postcode ${postcode}. Please check the postcode is correct, or visit our Marketplace to browse all available funeral directors.`
  }
  
  let response = `Here are the ${results.length} nearest funeral directors to ${postcode}:\n\n`
  
  results.forEach((director, index) => {
    response += `${index + 1}. **${director.name}** — ${director.distance.toFixed(1)} miles away\n`
    response += `   Location: ${director.location}, ${director.postcode}\n`
    response += `   Price Range: ${director.priceRange}\n`
    response += `   Rating: ${director.rating}/5 (${director.reviewCount} reviews)\n`
    response += `   Phone: ${director.phone}\n`
    response += `   Email: ${director.email}\n`
    if (director.website) {
      response += `   Website: ${director.website}\n`
    }
    response += `   Services: ${director.services.join(', ')}\n\n`
  })
  
  response += `\nYou can also visit our Marketplace to see more details, compare prices, and request quotes from these funeral directors.`
  
  return response
}

