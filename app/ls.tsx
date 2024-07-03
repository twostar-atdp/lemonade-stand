'use client'
import { useState } from 'react'
import Image from 'next/image'

interface MenuItem {
  name: string;
  price: number;
  quantity: number;
}

export default function LemonadeStand() {
  const [menu, setMenu] = useState<MenuItem[]>([
    { name: 'Classic Lemonade', price: 1, quantity: 0 },
    { name: 'Airheads', price: 0.25, quantity: 0 },
  ])

  const addToTotal = (index: number) => {
    setMenu(prevMenu => {
      const newMenu = [...prevMenu]
      newMenu[index].quantity += 1
      return newMenu
    })
  }

  const clearAll = () => {
    setMenu(prevMenu => prevMenu.map(item => ({ ...item, quantity: 0 })))
  }

  const total = menu.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const venmoPayment = () => {
    const venmoUsername = 'AmandaCuddy'
    const paymentDescription = "Knox's Lemonade Stand Payment"
    const amount = total.toFixed(2)

    let venmoUrl = `https://venmo.com/${venmoUsername}?txn=pay&amount=${amount}&note=${encodeURIComponent(paymentDescription)}`

    if (typeof window !== 'undefined' && 'navigator' in window) {
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isIOS = /ipad|iphone|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)

      if (isIOS) {
        venmoUrl = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${encodeURIComponent(paymentDescription)}`
      } else if (isAndroid) {
        venmoUrl = `intent://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${encodeURIComponent(paymentDescription)}#Intent;package=com.venmo;scheme=venmo;end`
      }
    }

    window.open(venmoUrl, '_blank')

    setTimeout(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        window.location.href = `https://venmo.com/${venmoUsername}?txn=pay&amount=${amount}&note=${encodeURIComponent(paymentDescription)}`
      }
    }, 500)
  }

  return (
    <div className="bg-palette-background min-h-screen flex flex-col items-center w-full">
      <div className="w-full max-w-4xl mx-auto p-4">
        <Image 
          src="/images/knox-lemonade-logo.png"
          alt="Knox's Lemonade Stand"
          width={400}
          height={133}
          className="mb-2 mx-auto" 
        />
        <div className="w-full max-w-sm mx-auto">
          <div className="border-2 border-palette-text bg-palette-menu p-4 rounded-lg shadow-button"> 
            <h2 className="text-xl font-semibold text-palette-text mb-2 text-center">Menu</h2> 
            {menu.map((item, index) => (
              <div key={index} className="flex flex-col mb-2"> 
                <div className="flex justify-between items-center mb-1"> 
                  <span className="text-base font-medium text-palette-text">{item.name}</span> 
                  <span className="text-sm text-palette-text">${item.price.toFixed(2)} - Qty: {item.quantity}</span>
                </div>
                <button
                  onClick={() => addToTotal(index)}
                  className="w-full px-4 py-1 border-2 border-palette-text bg-palette-button text-base font-medium text-palette-text shadow-button transition-all duration-300 ease-out hover:shadow-buttonHover"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center w-full max-w-sm mx-auto"> 
          <h2 className="text-xl font-bold text-palette-text mb-2">Total: ${total.toFixed(2)}</h2> 
          <div className="flex flex-col sm:flex-row justify-center gap-2"> 
            <button
              onClick={venmoPayment}
              className="w-full sm:w-auto px-4 py-1 border-2 border-palette-text bg-palette-button text-base font-medium text-palette-text shadow-button transition-all duration-300 ease-out hover:shadow-buttonHover"
            >
              Pay with Venmo
            </button>
            <button
              onClick={clearAll}
              className="w-full sm:w-auto px-4 py-1 border-2 border-palette-text bg-palette-button text-base font-medium text-palette-text shadow-button transition-all duration-300 ease-out hover:shadow-buttonHover"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}