import { Trash2 } from 'lucide-react'

interface SidebarProps {
  show: boolean
  documents: { id: string; title: string; content: string }[]
  onLoadDocument: (doc: { id: string; title: string; content: string })
 => void
  onDeleteDocument: (id: string) => void
}

export function Sidebar({ show, documents, onLoadDocument, onDeleteDocument }: SidebarProps) {
  if (!show) return null

  return (
    <div className="w-64 h-full bg-background border-r border-input p-4">
      <h2 className="text-lg font-semibold mb-4">Saved Documents</h2>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between">
            <button
              onClick={() => onLoadDocument(doc)}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {doc.title}
            </button>
            <button
              onClick={() => onDeleteDocument(doc.id)}
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}