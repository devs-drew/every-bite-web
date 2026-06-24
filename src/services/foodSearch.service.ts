import type { FoodResult } from '@/stores/foodSearch'
import { WHOLE_FOODS } from '@/data/wholeFoods'

// OpenFoodFacts — free, no API key. Called directly (not via the shared axios `api`
// instance, which injects an auth token and targets the app backend).
// Name search uses the legacy cgi/search.pl: it's the only search endpoint that sends
// CORS headers to a browser (api/v2/search is CORS-blocked; search-a-licious sends no
// CORS header). Barcode uses the product API.
const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl'
const PRODUCT_URL = 'https://world.openfoodfacts.org/api/v2/product'
const FIELDS = 'code,product_name,brands,serving_quantity,nutriments'

const r1 = (v: unknown) => (v == null ? undefined : Math.round(Number(v) * 10) / 10)

function toFoodResult(p: any): FoodResult | null {
  const name = p?.product_name?.trim()
  const n = p?.nutriments ?? {}
  const calories = n['energy-kcal_100g']
  if (!name || calories == null) return null // skip products with no name/energy
  // brands is an array in search-a-licious, a comma-separated string in the product API
  const brand = Array.isArray(p.brands) ? p.brands[0] : p.brands?.split(',')[0]
  return {
    off_product_id: String(p.code ?? p._id ?? name),
    food_name: name,
    brand_name: brand?.trim() || undefined,
    barcode: p.code ? String(p.code) : undefined,
    serving_size_g: Number(p.serving_quantity) || 100,
    nutrients_per_100g: {
      calories: Math.round(Number(calories)),
      protein_g: r1(n.proteins_100g),
      carbs_g: r1(n.carbohydrates_100g),
      fat_g: r1(n.fat_100g),
      fiber_g: r1(n.fiber_100g),
      sugar_g: r1(n.sugars_100g),
      sodium_mg: n.sodium_100g == null ? undefined : Math.round(Number(n.sodium_100g) * 1000),
    },
  }
}

export const foodSearchService = {
  // ponytail: no AbortController — the view debounces 400ms. Add if rapid typing shows out-of-order results.
  async searchByName(q: string, page = 1) {
    const lower = q.toLowerCase()

    // 1. Local whole foods — instant, no network (whole/unpackaged foods not in OFF)
    const localMatches = WHOLE_FOODS.filter(f => f.food_name.toLowerCase().includes(lower))

    // 2. Philippines-scoped OFF search for packaged products
    let offProducts: FoodResult[] = []
    try {
      // ponytail: no PH country filter — adding tag params breaks CORS on cgi/search.pl (CDN stops sending ACAO header). Local WHOLE_FOODS list handles Filipino staples.
      const url = `${SEARCH_URL}?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page=${page}&page_size=20&fields=${FIELDS}`
      const res = await fetch(url)
      if (res.ok) {
        const json = await res.json()
        offProducts = (json.products ?? [])
          .map(toFoodResult)
          .filter((f: FoodResult | null): f is FoodResult => f !== null)
      }
    } catch {}

    // Local results first — they're more specific and always correct
    return { data: { products: [...localMatches, ...offProducts] } }
  },

  async searchByBarcode(barcode: string) {
    try {
      const res = await fetch(`${PRODUCT_URL}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`)
      if (!res.ok) return { data: null }
      const json = await res.json()
      return { data: json.status === 1 ? toFoodResult(json.product) : null }
    } catch {
      return { data: null }
    }
  },
}
