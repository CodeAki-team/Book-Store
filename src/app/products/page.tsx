

import Filters from '@/components/ProductFilter'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabaseClient'
import React from 'react'

async function  Productpage ({ searchParams }: { searchParams: any }) {

let query = supabase.from('books').select('*')

const categories = searchParams.category
  ? Array.isArray(searchParams.category)
    ? searchParams.category
    : [searchParams.category]
  : []

const minPrice = searchParams.minPrice
const maxPrice = searchParams.maxPrice
const rating = searchParams.rating

if (categories.length > 0) query = query.in('category', categories)
if (minPrice) query = query.gte('price', Number(minPrice))
if (maxPrice) query = query.lte('price', Number(maxPrice))
if (rating) query = query.gte('rating', Number(rating))

const { data: products } = await query

 return (
  <div className="min-h-screen flex flex-col">
   

    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {/* <Filters /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {products?.map((product) => (
          <Card key={product.id} className="shadow-md">
            <CardContent className="space-y-2">
              <img src={product.image} alt="" />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-muted-foreground">${product.price}</p>
              <p>Rating: {product.rating}</p>
              <p>Category: {product.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>

  </div>
)
}

export default Productpage