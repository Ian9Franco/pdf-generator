'use client'

import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { InfoModal } from './components/InfoModal'
import { MainContent } from './components/MainContent'
import { PDFDocument } from './types'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [title, setTitle] = useState('Untitled Document')
  const [documents, setDocuments] = useState<PDFDocument[]>([])
  const [currentDocument, setCurrentDocument] = useState<PDFDocument | null>(null)
  const [fontSettings, setFontSettings] = useState({
    titleSize: 24,
    subtitleSize: 20,
    subsubtitleSize: 16,
    normalTextSize: 12,
    selectedFont: 'Roboto',
    titleColor: '#000000',
    subtitleColor: '#000000',
    subsubtitleColor: '#000000',
    twoColumnLayout: false,
  })

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }

    const savedDocuments = localStorage.getItem('documents')
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments))
    }

    const savedFontSettings = localStorage.getItem('fontSettings')
    if (savedFontSettings) {
      setFontSettings(JSON.parse(savedFontSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents))
  }, [documents])

  useEffect(() => {
    localStorage.setItem('fontSettings', JSON.stringify(fontSettings))
  }, [fontSettings])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const clearContent = () => {
    setMarkdown('')
    setTitle('Untitled Document')
    setCurrentDocument(null)
  }

  const loadDocument = (doc: PDFDocument) => {
    setTitle(doc.title)
    setMarkdown(doc.content)
    setCurrentDocument(doc)
    setShowSidebar(false)
  }

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
    if (currentDocument && currentDocument.id === id) {
      clearContent()
    }
  }

return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={toggleSidebar}
          clearContent={clearContent}
          setShowInfo={setShowInfo}
          fontSettings={fontSettings}
          setFontSettings={setFontSettings}
        />
        <div className="flex-1 flex">
          <Sidebar
            show={showSidebar}
            documents={documents}
            onLoadDocument={loadDocument}
            onDeleteDocument={deleteDocument}
          />
          <MainContent
            markdown={markdown}
            setMarkdown={setMarkdown}
            title={title}
            setTitle={setTitle}
            documents={documents}
            setDocuments={setDocuments}
            setCurrentDocument={setCurrentDocument}
            darkMode={darkMode}
            fontSettings={fontSettings}
            setFontSettings={setFontSettings}
          />
        </div>
        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
      </div>
    </div>
  )
}