import React from 'react'
import { availableFonts } from '../fonts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface FontSettingsProps {
  titleSize: number;
  subtitleSize: number;
  subsubtitleSize: number;
  normalTextSize: number;
  selectedFont: string;
  titleColor: string;
  subtitleColor: string;
  subsubtitleColor: string;
  twoColumnLayout: boolean;
  onTitleSizeChange: (size: number) => void;
  onSubtitleSizeChange: (size: number) => void;
  onSubsubtitleSizeChange: (size: number) => void;
  onNormalTextSizeChange: (size: number) => void;
  onFontChange: (font: string) => void;
  onTitleColorChange: (color: string) => void;
  onSubtitleColorChange: (color: string) => void;
  onSubsubtitleColorChange: (color: string) => void;
  onTwoColumnLayoutChange: (enabled: boolean) => void;
  onClose: () => void;
}

export function FontSettings({
  titleSize,
  subtitleSize,
  subsubtitleSize,
  normalTextSize,
  selectedFont,
  titleColor,
  subtitleColor,
  subsubtitleColor,
  twoColumnLayout,
  onTitleSizeChange,
  onSubtitleSizeChange,
  onSubsubtitleSizeChange,
  onNormalTextSizeChange,
  onFontChange,
  onTitleColorChange,
  onSubtitleColorChange,
  onSubsubtitleColorChange,
  onTwoColumnLayoutChange,
  onClose,
}: FontSettingsProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary">Configuración de Fuente</h3>
        <button onClick={onClose} className="text-primary hover:text-primary/80 transition-colors">
          Cerrar
        </button>
      </div>
      <div>
        <label htmlFor="titleSize" className="block text-sm font-medium text-primary mb-1">Tamaño de Título (#)</label>
        <input
          type="number"
          id="titleSize"
          value={titleSize}
          onChange={(e) => onTitleSizeChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="titleColor" className="block text-sm font-medium text-primary mb-1">Color de Título</label>
        <input
          type="color"
          id="titleColor"
          value={titleColor}
          onChange={(e) => onTitleColorChange(e.target.value)}
          className="w-full h-10 px-1 py-1 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="subtitleSize" className="block text-sm font-medium text-primary mb-1">Tamaño de Subtítulo (##)</label>
        <input
          type="number"
          id="subtitleSize"
          value={subtitleSize}
          onChange={(e) => onSubtitleSizeChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="subtitleColor" className="block text-sm font-medium text-primary mb-1">Color de Subtítulo</label>
        <input
          type="color"
          id="subtitleColor"
          value={subtitleColor}
          onChange={(e) => onSubtitleColorChange(e.target.value)}
          className="w-full h-10 px-1 py-1 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="subsubtitleSize" className="block text-sm font-medium text-primary mb-1">Tamaño de Sub-subtítulo (###)</label>
        <input
          type="number"
          id="subsubtitleSize"
          value={subsubtitleSize}
          onChange={(e) => onSubsubtitleSizeChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="subsubtitleColor" className="block text-sm font-medium text-primary mb-1">Color de Sub-subtítulo</label>
        <input
          type="color"
          id="subsubtitleColor"
          value={subsubtitleColor}
          onChange={(e) => onSubsubtitleColorChange(e.target.value)}
          className="w-full h-10 px-1 py-1 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="normalTextSize" className="block text-sm font-medium text-primary mb-1">Tamaño de Texto Normal</label>
        <input
          type="number"
          id="normalTextSize"
          value={normalTextSize}
          onChange={(e) => onNormalTextSizeChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-primary bg-background border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="fontSelect" className="block text-sm font-medium text-primary mb-1">Fuente</label>
        <Select value={selectedFont} onValueChange={onFontChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una fuente" />
          </SelectTrigger>
          <SelectContent>
            {availableFonts.map((font) => (
              <SelectItem key={font.name} value={font.name}>
                <span style={{ fontFamily: `var(${font.variable})` }}>{font.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="twoColumnLayout"
          checked={twoColumnLayout}
          onChange={(e) => onTwoColumnLayoutChange(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="twoColumnLayout" className="text-sm font-medium text-primary">
          Diseño de dos columnas
        </label>
      </div>
    </div>
  )
}