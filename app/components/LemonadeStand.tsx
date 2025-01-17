'use client'
import { useState } from 'react'
import Image from 'next/image'
import { MenuItem } from '../types'
import { generateVenmoUrl } from '../utils/venmo'

export default function LemonadeStand({ initialMenuItems }: { initialMenuItems: MenuItem[] }) {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenuItems)

  const addToTotal = (index: number) => {
    setMenu(prevMenu => prevMenu.map((item, i) => 
      i === index ? { ...item, quantity: (item.quantity || 0) + 1 } : item
    ))
  }

  const clearAll = () => {
    setMenu(prevMenu => prevMenu.map(item => ({ ...item, quantity: 0 })))
  }

  const total = menu.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0)
  
  const handleVenmoPayment = () => {
    const venmoUrl = generateVenmoUrl(total)
    window.open(venmoUrl, '_blank')
  }

  const LemonDivider = () => (
    <div className="w-full flex items-center justify-center my-2">
      <div className="flex-grow h-px bg-palette-text"></div>
      <Image
        src="/images/lemon.png"
        alt="Lemon divider"
        width={30}
        height={30}
        className="mx-2"
      />
      <div className="flex-grow h-px bg-palette-text"></div>
    </div>
  )

  return (
    <div className="bg-palette-background min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col justify-center items-center max-w-sm mx-auto w-full px-4 py-4">
        <div className="flex flex-col items-center">
          <Image 
            src="/images/knox-lemonade-logo.png"
            alt="Knox's Lemonade Stand"
            width={300}
            height={100}
            className="mb-2"
            priority
          />
          <LemonDivider />
        </div>
        
        <div className="w-full flex flex-col justify-center">
          <div className="border-2 border-palette-text bg-palette-menu p-4 rounded-lg shadow-button my-4"> 
            <h2 className="text-xl font-semibold text-palette-text mb-2 text-center">Menu</h2> 
            {menu.map((item, index) => (
              <div key={item.name} className="flex flex-col mb-2"> 
                <div className="flex justify-between items-center mb-1"> 
                  <span className="text-base font-medium text-palette-text">{item.name}</span> 
                  <span className="text-sm text-palette-text">${item.price.toFixed(2)} - Qty: {item.quantity || 0}</span>
                </div>
                <button
                  onClick={() => addToTotal(index)}
                  aria-label={`Add ${item.name} to order`}
                  className="w-full px-4 py-1 border-2 border-palette-text bg-palette-button text-base font-medium text-palette-text shadow-button transition-all duration-300 ease-out hover:shadow-buttonHover"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl font-bold text-palette-text mb-2 text-center">Total: ${total.toFixed(2)}</h2> 
          <LemonDivider />
          <div className="flex flex-col gap-2 w-full"> 
            <button
              onClick={handleVenmoPayment}
              aria-label="Pay with Venmo"
              className="w-full px-4 py-2 border-2 border-palette-text bg-palette-button text-base font-medium text-palette-text shadow-button transition-all duration-300 ease-out hover:shadow-buttonHover"
            >
              Pay with Venmo
            </button>
            <button
              onClick={clearAll}
              aria-label="Clear all items"
              className="w-full px-4 py-2 border-2 border-palette-text bg-palette-button text-base font-medium text-palette-text shadow-button transition-all duration-300 ease-out hover:shadow-buttonHover"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
