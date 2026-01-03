import React, { useEffect, useState } from 'react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

function NewArrival({ limit, className = '', hideTitle = false, product = null }) {
  const cart = useCart()
  const handleAdd = (e, p) => {
    const card = e.currentTarget.closest('.rounded-lg') || e.currentTarget.parentElement
    const img = card.querySelector('img')
    const rect = img ? img.getBoundingClientRect() : null
    cart.addItem(p, { sourceEl: img, imgSrc: img?.src, imgRect: rect })
  }

  const [items, setItems] = useState(() => {
    let pool = products
    if (product && product.title) {
      const t = product.title.toLowerCase()
      if (t.includes('trucker')) pool = products.filter(p => p.title.toLowerCase().includes('trucker'))
      else if (t.includes('beanie')) pool = products.filter(p => p.title.toLowerCase().includes('beanie'))
    }
    if (product && product.id) pool = pool.filter(p => p.id !== product.id)

    // Fisher-Yates shuffle
    const shuffled = pool.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return typeof limit === 'number' ? shuffled.slice(0, limit) : shuffled
  })

  useEffect(() => {
    let pool = products
    if (product && product.title) {
      const t = product.title.toLowerCase()
      if (t.includes('trucker')) pool = products.filter(p => p.title.toLowerCase().includes('trucker'))
      else if (t.includes('beanie')) pool = products.filter(p => p.title.toLowerCase().includes('beanie'))
    }
    if (product && product.id) pool = pool.filter(p => p.id !== product.id)

    const shuffled = pool.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setItems(typeof limit === 'number' ? shuffled.slice(0, limit) : shuffled)
  }, [limit, product])

  return (
    <section className={`max-w-7xl mx-auto px-3 py-10 ${className}`}>
      {!hideTitle && <h3 className="text-xs tracking-widest uppercase text-gray-600 mb-6">New Arrivals</h3>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.id} className=" rounded-lg border border-gray-100 shadow-sm overflow-hidden" style={{
        backgroundColor: 'hsl(44, 26%, 94%)',
      }}>
            <div className="h-56 md:h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <Link to={`/product/${p.id}`} className="w-full h-full block">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </Link>
            </div>

            <div className="p-4 text-center">
              <div className="text-[10px] tracking-widest uppercase text-gray-600 -mt-1">{p.title}</div>
              <div className="mt-2 font-semibold text-sm">{p.price}</div>

              <div className="mt-1 text-yellow-400 text-sm ">
                {Array.from({ length: Math.floor(p.rating) }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
                <span className="text-xs text-gray-500 ml-2 ">{p.rating}</span>
              </div>

              <button onClick={(e) => handleAdd(e, p)} className="mt-2 w-full bg-black text-white py-2 rounded-md text-sm hover:opacity-95 hover:cursor-pointer hover:text-orange-400">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrival