import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../pages/Footer'
import { useCart } from '../context/CartContext'
import ConfirmModal from './ConfirmModal'
import deleteIcon from '../assets/delete.png'

function Checkout() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const cart = useCart()
  const navigate = useNavigate()
  const [orderTotal, setOrderTotal] = useState(0.0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [emptyErrorVisible, setEmptyErrorVisible] = useState(false)
  const [formErrors, setFormErrors] = useState({ fullName: '', phone: '', address: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const fullNameRef = useRef(null)
  const phoneRef = useRef(null)
  const addressRef = useRef(null)

  // smooth scroll helper with controllable duration (ms)
  function smoothScrollTo(element, duration = 700) {
    if (!element || typeof window === 'undefined') return
    const start = window.pageYOffset
    const rect = element.getBoundingClientRect()
    const target = rect.top + window.pageYOffset - (window.innerHeight / 2) + (rect.height / 2)
    const distance = target - start
    let startTime = null

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp
      const time = Math.min(1, (timestamp - startTime) / duration)
      const eased = easeInOutQuad(time)
      window.scrollTo(0, Math.round(start + distance * eased))
      if (time < 1) window.requestAnimationFrame(step)
    }

    window.requestAnimationFrame(step)
  }

  function showToast(msg, duration = 3000) {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), duration)
  }

  useEffect(() => {
    setTimeout(() => setOrderTotal(cart.total || 0), 0)
  }, [cart.total])

  // ensure processing state is cleared when page is restored (back/forward cache)
  useEffect(() => {
    const onPageShow = () => setIsProcessing(false)
    const onVisibility = () => { if (document.visibilityState === 'visible') setIsProcessing(false) }
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  function handlePlaceOrder(e) {
    e.preventDefault()
    if (isProcessing) return
    // if cart is empty, show an inline error below the button
    if (!cart.items || cart.items.length === 0) {
      setEmptyErrorVisible(true)
      setTimeout(() => setEmptyErrorVisible(false), 3000)
      return
    }

    // validate form fields when cart has items
    const errors = { fullName: '', phone: '', address: '' }
    if (!fullName || !fullName.trim()) errors.fullName = 'Full name is required'
    if (!phone || !phone.trim()) errors.phone = 'Phone is required'
    if (!address || !address.trim()) errors.address = 'Delivery address is required'

    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) {
      setFormErrors(errors)
      // on mobile, scroll to and focus the first invalid field
      if (typeof window !== 'undefined' && window.innerWidth <= 768) {
        if (errors.fullName && fullNameRef.current) {
          smoothScrollTo(fullNameRef.current, 700)
          fullNameRef.current.focus()
        } else if (errors.phone && phoneRef.current) {
          smoothScrollTo(phoneRef.current, 700)
          phoneRef.current.focus()
        } else if (errors.address && addressRef.current) {
          smoothScrollTo(addressRef.current, 700)
          addressRef.current.focus()
        }
      }
      setTimeout(() => setFormErrors({ fullName: '', phone: '', address: '' }), 4000)
      return
    }

    setFormErrors({ fullName: '', phone: '', address: '' })
    // show processing state, then open WhatsApp with order details
    const phoneNumber = '2349162919586'
    const lines = []
    lines.push('New Order')
    lines.push('')
    lines.push(`Customer: ${fullName}`)
    lines.push(`Phone: ${phone}`)
    lines.push(`Address: ${address}`)
    lines.push('')
    lines.push('Items:')
    cart.items.forEach((i, idx) => {
      const price = Number(i.price)
      const subtotal = price * i.qty
      lines.push(`${idx + 1}. ${i.title} x${i.qty} - ₦${price.toLocaleString()} each - Subtotal: ₦${subtotal.toLocaleString()}`)
    })
    lines.push('')
    lines.push(`Order Total: ₦${orderTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`)
    lines.push('')
    lines.push('Thank you!')
    lines.push('send account details')

    const message = lines.join('\n')
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    // clear cart and reset form before redirecting
    try {
      if (cart.clear) cart.clear()
    } catch (err) { console.error(err) }
    setFullName('')
    setPhone('')
    setAddress('')
    setOrderTotal(0)
    setEmptyErrorVisible(false)
    setFormErrors({ fullName: '', phone: '', address: '' })
    // redirect to WhatsApp immediately
    window.location.href = waUrl
  }

  function handleClearCart(e) {
    e && e.preventDefault()
    setShowConfirm(true)
  }

  function confirmClearCart() {
    if (cart.clear) cart.clear()
    setShowConfirm(false)
    showToast('Cart cleared')
  }

  return (
    <>
    <main className="max-w-7xl mx-auto px-6 py-12 md:pt-28"  style={{
        backgroundColor: 'hsl(44, 45%, 99%)',
      }}>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <p className="mt-3 text-sm text-gray-500">You're just a few steps away from getting your order — fast, secure and premium delivery.</p>
        <div className="flex flex-rowmd:flex-row items-center justify-center gap-4 mt-6 bg-white/50 rounded-md px-4 py-3">
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 px-3 py-2 rounded-md">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">1</div>
            <div className="text-xs text-gray-600">Order  </div>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 px-3 py-2 rounded-md opacity-70">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">2</div>
            <div className="text-xs text-gray-600">Processing</div>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 px-3 py-2 rounded-md opacity-70">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">3</div>
            <div className="text-xs text-gray-600">Payment</div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        <form className="rounded-xl shadow-md p-8 w-full" style={{
        backgroundColor: 'hsl(51, 23%, 94%)',
      }}>
          <h2 className="font-semibold text-lg mb-6">Shipping Address Details</h2>

          <label className="block text-xs font-medium text-gray-900 mb-2">Full Name</label>
          <div className="relative mb-4">
            <input
              ref={fullNameRef}
              value={fullName}
              onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50))}
              placeholder="Your full name"
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 text-base outline-none"
              style={{ fontSize: 16 }}
            />
            {fullName && fullName.trim().length >= 3 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="12" fill="#16A34A" />
                  <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          {formErrors.fullName && (
            <div className="text-sm text-red-600 mb-2">{formErrors.fullName}</div>
          )}

          <label className="block text-xs font-medium text-gray-900 mb-2">Phone</label>
          <div className="relative mb-4">
            <input
              ref={phoneRef}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="e.g 07031111111"
              inputMode="numeric"
              pattern="[0-9]*"
              type="tel"
              maxLength={11}
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 text-base outline-none"
              style={{ fontSize: 16 }}
            />
            {/* show tick when phone has 11 digits */}
            {phone && phone.length === 11 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="12" fill="#16A34A" />
                  <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          {formErrors.phone && (
            <div className="text-sm text-red-600 mb-2">{formErrors.phone}</div>
          )}

          <label className="block text-xs font-medium text-gray-900 mb-2">Delivery address</label>
          <div className="relative mb-4">
            <input
              ref={addressRef}
              value={address}
              onChange={(e) => setAddress(e.target.value.slice(0, 200))}
              placeholder="Enter your address"
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 text-base outline-none"
              style={{ fontSize: 16 }}
            />
            {address && address.trim().length >= 5 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="12" fill="#16A34A" />
                  <path d="M17 8L10 15L7 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          {formErrors.address && (
            <div className="text-sm text-red-600 mb-2">{formErrors.address}</div>
          )}
        </form>

        <aside className="bg-gray-100 rounded-xl shadow-md p-6 w-full">
          <h3 className="font-semibold text-lg mb-4">Your Order</h3>
          <div className="text-sm text-gray-500 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Product</span>
              <span>Total</span>
            </div>

            <div className="space-y-3 my-4">
              {cart.items && cart.items.length > 0 ? (
                cart.items.map(i => (
                  <div key={i.id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <button type="button" onClick={() => navigate(`/product/${i.id}`, { state: { imgSrc: i.image } })} className="p-0 rounded focus:outline-none">
                      <img src={i.image} alt={i.title} className="w-12 h-12 object-cover rounded cursor-pointer hover:scale-105 transition-transform" />
                    </button>

                    <div className="flex-1 text-sm">
                      <div className="font-medium">{i.title}</div>

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => cart.decrementItem(i.id)}
                          disabled={i.qty <= 1}
                          aria-disabled={i.qty <= 1}
                          className={`w-7 h-7 rounded border border-gray-200 text-sm ${i.qty <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        >−</button>
                        <div className="min-w-[36px] text-center text-sm">{i.qty}</div>
                        <button onClick={() => cart.addItem(i, { qty: 1 })} className="w-7 h-7 rounded border border-gray-200 text-sm hover:bg-gray-100">+</button>
                        <button onClick={() => cart.removeItem(i.id)} className="ml-3 p-1 rounded hover:bg-gray-100">
                          <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="font-medium">₦{(Number(i.price) * i.qty).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-gray-500">Your cart is empty</div>
              )}
            </div>

            <div className="flex justify-between py-4">
              <span className="font-medium">Order Total</span>
              <span className="font-medium">₦{orderTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={handlePlaceOrder} className="w-full py-3 rounded-md font-semibold bg-[#0f1b23] text-white">
              Place Order
            </button>
            <button onClick={handleClearCart} className="w-full bg-white border border-gray-200 text-red-600 py-3 rounded-md font-semibold">Clear Cart</button>
            {emptyErrorVisible && (
              <div role="alert" aria-live="polite" className="text-sm text-red-600 mt-2 text-center">Cart is empty</div>
            )}
          </div>
        </aside>
      </section>

      <ConfirmModal
        open={showConfirm}
        title="Clear cart?"
        message="Do you want to clear your cart? This action cannot be undone."
        onConfirm={confirmClearCart}
        onCancel={() => setShowConfirm(false)}
      />
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-md">{toastMessage}</div>
        </div>
      )}
    </main>
       <Footer />
       </>
  )
}

export default Checkout