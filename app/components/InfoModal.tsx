import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface InfoModalProps {
  onClose: () => void
}

export function InfoModal({ onClose }: InfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-background text-foreground rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Acerca de Markdown a PDF</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Convierte tus documentos Markdown a PDFs con formato hermoso y fácilmente.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Esta aplicación te permite escribir en Markdown y convertirlo a un documento PDF. Puedes personalizar la fuente, colores y diseño de tu PDF usando el panel de configuración.
          </p>
          <h3 className="font-semibold text-foreground">Características principales:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Convierte Markdown a PDF</li>
            <li>Personaliza fuentes y colores</li>
            <li>Opción de diseño a dos columnas</li>
            <li>Guarda y carga documentos</li>
            <li>Soporte para modo oscuro</li>
          </ul>
          <h3 className="font-semibold text-foreground mt-4">Guía rápida de Markdown:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li># Título principal</li>
            <li>## Subtítulo</li>
            <li>### Sub-subtítulo</li>
            <li>**Texto en negrita**</li>
            <li>*Texto en cursiva*</li>
            <li>[Enlace](https://ejemplo.com)</li>
            <li>- Elemento de lista</li>
            <li>1. Elemento de lista numerada</li>
          </ul>
          <p className="text-sm text-muted-foreground">
          Para comenzar, simplemente escribe tu Markdown en el editor, ajusta la configuración según sea necesario y haz clic en &quot;Generar PDF&quot; para crear tu documento.
            </p>

        </div>
      </div>
    </div>
  )
}