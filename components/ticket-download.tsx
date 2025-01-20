'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { VideoBackground } from './video-background'

interface TicketProps {
  ticket: {
    bookingCode: string
    orderId: string
    package: 'BASIC' | 'PREMIUM'
    drinks: number
    addOns: {
      dayPass: boolean
      iceBath: boolean
    }
    totalPrice: number
    instructions: string
    validUntil: string
    qrCode: string
  }
}

export function TicketDownload({ ticket }: TicketProps) {
  const qrRef = useRef<HTMLCanvasElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, ticket.qrCode, {
        width: 128,
        margin: 2,
        color: {
          dark: '#000',
          light: '#FFF'
        }
      })
    }
  }, [ticket.qrCode])

  const downloadPDF = async () => {
    if (!ticketRef.current) return

    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      backgroundColor: '#1a1a1a'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`Morning-Wellness-Ticket-${ticket.bookingCode}.pdf`)
  }

  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Ticket Preview */}
          <div
            ref={ticketRef}
            className="group bg-black/40 rounded-xl p-8 backdrop-blur-2xl border border-white/10 
              hover:border-white/20 transition-all duration-300 hover:shadow-2xl 
              hover:shadow-rose-500/20"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
                Morning Wellness
              </h2>
              <p className="text-xl text-gray-300">Dubai Creek</p>
            </div>

            <div className="space-y-6">
              {/* Booking Code */}
              <div className="text-center bg-black/20 rounded-lg p-4 border border-white/5">
                <div className="text-4xl font-mono font-bold text-rose-300 tracking-wider drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                  {ticket.bookingCode}
                </div>
                <p className="text-sm text-white/60 mt-1">Booking Reference</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center bg-white rounded-lg p-4">
                <canvas ref={qrRef} />
              </div>

              {/* Package Details */}
              <div className="space-y-3 bg-white/5 rounded-lg p-4">
                <h3 className="font-medium text-xl text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-rose-200">
                  Package Details
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <span className="text-rose-400 mr-2">✓</span>
                    {ticket.package} Package ({ticket.drinks} drinks)
                  </li>
                  {ticket.addOns.dayPass && (
                    <li className="flex items-center">
                      <span className="text-rose-400 mr-2">✓</span>
                      Morning Yacht Session
                    </li>
                  )}
                  {ticket.addOns.iceBath && (
                    <li className="flex items-center">
                      <span className="text-rose-400 mr-2">✓</span>
                      Ice Bath Experience
                    </li>
                  )}
                </ul>
              </div>

              {/* Instructions */}
              <div className="text-sm text-white/80 bg-white/5 rounded-lg p-4">
                <p>{ticket.instructions}</p>
                <p className="mt-2 text-rose-300">Valid until: {ticket.validUntil}</p>
              </div>

              {/* Total */}
              <div className="text-right">
                <p className="text-sm text-white/60">Total Paid</p>
                <p className="text-3xl font-bold text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                  {ticket.totalPrice} AED
                </p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadPDF}
            className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white text-lg py-6
              shadow-lg shadow-rose-500/20 transition-all duration-300 
              hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100"
          >
            Download Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}
