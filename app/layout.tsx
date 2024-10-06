import React from 'react'
import './globals.css'
import {
  beauRivage,
  exo,
  glory,
  ibmPlexMono,
  ibmPlexSansCondensed,
  ibmPlexSerif,
  italianno,
  openSans,
  playfairDisplay,
  poppins,
  qwitcherGrypen,
  robotoMono,
  robotoSlab
} from './fonts'

export const metadata = {
  title: 'Markdown to PDF Converter',
  description: 'Convert your Markdown documents to PDF easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`
      ${beauRivage.variable} 
      ${exo.variable} 
      ${glory.variable} 
      ${ibmPlexMono.variable} 
      ${ibmPlexSansCondensed.variable} 
      ${ibmPlexSerif.variable} 
      ${italianno.variable} 
      ${openSans.variable} 
      ${playfairDisplay.variable} 
      ${poppins.variable} 
      ${qwitcherGrypen.variable} 
      ${robotoMono.variable} 
      ${robotoSlab.variable}
    `}>
      <body>{children}</body>
    </html>
  )
}