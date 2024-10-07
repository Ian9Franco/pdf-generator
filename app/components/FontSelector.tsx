import React from 'react'
import { Select, SelectItem } from "./ui/select"

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

const fonts = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Raleway',
  'Poppins',
  'Nunito',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro'
];

export function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  return (
    <Select value={selectedFont} onValueChange={onFontChange}>
      {fonts.map((font) => (
        <SelectItem key={font} value={font}>
          <span style={{ fontFamily: font }}>{font}</span>
        </SelectItem>
      ))}
    </Select>
  )
}