import { FileText, Info, Menu, Moon, Sun, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { FontSettings } from './FontSettings'

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  clearContent: () => void;
  setShowInfo: (show: boolean) => void;
  fontSettings: {
    titleSize: number;
    subtitleSize: number;
    subsubtitleSize: number;
    normalTextSize: number;
    selectedFont: string;
    titleColor: string;
    subtitleColor: string;
    subsubtitleColor: string;
    twoColumnLayout: boolean;
  };
  setFontSettings: React.Dispatch<React.SetStateAction<HeaderProps['fontSettings']>>;
}

export function Header({ 
  darkMode, 
  toggleDarkMode, 
  toggleSidebar, 
  clearContent, 
  setShowInfo,
  fontSettings,
  setFontSettings
}: HeaderProps) {
  const [showFontSettings, setShowFontSettings] = useState(false);
  const fontSettingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fontSettingsRef.current && !fontSettingsRef.current.contains(event.target as Node)) {
        setShowFontSettings(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFontSettingChange = (key: keyof HeaderProps['fontSettings'], value: number | string | boolean) => {
    setFontSettings(prev => ({ ...prev, [key]: value }));
  };
  

  return (
    <header className={`relative flex items-center justify-between px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-accent'} text-accent-foreground`}>
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-primary hover:text-primary/80 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-primary">Markdown a PDF</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <button
          onClick={clearContent}
          className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-background/50 rounded-md hover:bg-background/80 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Nuevo
        </button>
        <button
          onClick={() => setShowInfo(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-background/50 rounded-md hover:bg-background/80 transition-colors"
        >
          <Info className="w-4 h-4 mr-2" />
          Información
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-background/50 rounded-md hover:bg-background/80 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
          {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowFontSettings(!showFontSettings)}
            className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-background/50 rounded-md hover:bg-background/80 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración de Fuente
          </button>
          {showFontSettings && (
            <div 
              ref={fontSettingsRef}
              className="absolute right-0 mt-2 w-72 bg-background border border-accent rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out transform origin-top-right"
              style={{
                opacity: showFontSettings ? 1 : 0,
                transform: showFontSettings ? 'scale(1)' : 'scale(0.95)',
              }}
            >
              <FontSettings
                {...fontSettings}
                onTitleSizeChange={(size) => handleFontSettingChange('titleSize', size)}
                onSubtitleSizeChange={(size) => handleFontSettingChange('subtitleSize', size)}
                onSubsubtitleSizeChange={(size) => handleFontSettingChange('subsubtitleSize', size)}
                onNormalTextSizeChange={(size) => handleFontSettingChange('normalTextSize', size)}
                onFontChange={(font) => handleFontSettingChange('selectedFont', font)}
                onTitleColorChange={(color) => handleFontSettingChange('titleColor', color)}
                onSubtitleColorChange={(color) => handleFontSettingChange('subtitleColor', color)}
                onSubsubtitleColorChange={(color) => handleFontSettingChange('subsubtitleColor', color)}
                onTwoColumnLayoutChange={(enabled) => handleFontSettingChange('twoColumnLayout', enabled)}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}