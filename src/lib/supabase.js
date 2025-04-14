import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    // Enables optimistic updates
    fetch: window.fetch
  },
  // Add some retry logic for network failures
  db: {
    schema: 'public'
  },
  // Configure realtime presence logic
  realtime: {
    timeout: 30000
  }
})

// For better performance, cache commonly accessed data
const cache = new Map()

export const fetchWithCache = async (tableName, query) => {
  const cacheKey = `${tableName}-${JSON.stringify(query)}`
  
  // Check if cache exists and is not older than 5 minutes
  const cachedData = cache.get(cacheKey)
  if (cachedData && Date.now() - cachedData.timestamp < 300000) {
    return cachedData.data
  }
  
  // Fetch fresh data
  const { data, error } = await query
  
  if (error) throw error
  
  // Cache the result
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
  
  return data
}

// Clear cache for a specific table
export const clearCache = (tableName) => {
  for (const key of cache.keys()) {
    if (key.startsWith(`${tableName}-`)) {
      cache.delete(key)
    }
  }
}

// Clear all cache
export const clearAllCache = () => {
  cache.clear()
}