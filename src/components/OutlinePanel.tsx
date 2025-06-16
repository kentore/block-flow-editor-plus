
import React from 'react';
import { Hash, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextElement {
  id: string;
  text: string;
  isTitle: boolean;
  number?: number;
  titleNumber?: number;
  visible: boolean;
  applied?: boolean;
  appliedColor?: string;
}

interface OutlinePanelProps {
  textBlocks: TextElement[];
  onScrollToBlock: (blockId: string) => void;
  collapsedTitles: Set<string>;
  selectedParagraphs: Set<string>;
  onToggleParagraphSelection: (paragraphId: string) => void;
}

// Array de colores para las aplicaciones con soporte para modo oscuro
const APPLIED_COLORS = [
  { bg: 'bg-green-50 dark:bg-green-900/20', ring: 'ring-green-300 dark:ring-green-700', text: 'text-green-700 dark:text-green-300', icon: 'text-green-600 dark:text-green-400' },
  { bg: 'bg-blue-50 dark:bg-blue-900/20', ring: 'ring-blue-300 dark:ring-blue-700', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600 dark:text-blue-400' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', ring: 'ring-purple-300 dark:ring-purple-700', text: 'text-purple-700 dark:text-purple-300', icon: 'text-purple-600 dark:text-purple-400' },
  { bg: 'bg-orange-50 dark:bg-orange-900/20', ring: 'ring-orange-300 dark:ring-orange-700', text: 'text-orange-700 dark:text-orange-300', icon: 'text-orange-600 dark:text-orange-400' },
  { bg: 'bg-pink-50 dark:bg-pink-900/20', ring: 'ring-pink-300 dark:ring-pink-700', text: 'text-pink-700 dark:text-pink-300', icon: 'text-pink-600 dark:text-pink-400' },
  { bg: 'bg-indigo-50 dark:bg-indigo-900/20', ring: 'ring-indigo-300 dark:ring-indigo-700', text: 'text-indigo-700 dark:text-indigo-300', icon: 'text-indigo-600 dark:text-indigo-400' },
  { bg: 'bg-red-50 dark:bg-red-900/20', ring: 'ring-red-300 dark:ring-red-700', text: 'text-red-700 dark:text-red-300', icon: 'text-red-600 dark:text-red-400' },
  { bg: 'bg-yellow-50 dark:bg-yellow-900/20', ring: 'ring-yellow-300 dark:ring-yellow-700', text: 'text-yellow-700 dark:text-yellow-300', icon: 'text-yellow-600 dark:text-yellow-400' },
  { bg: 'bg-teal-50 dark:bg-teal-900/20', ring: 'ring-teal-300 dark:ring-teal-700', text: 'text-teal-700 dark:text-teal-300', icon: 'text-teal-600 dark:text-teal-400' },
  { bg: 'bg-cyan-50 dark:bg-cyan-900/20', ring: 'ring-cyan-300 dark:ring-cyan-700', text: 'text-cyan-700 dark:text-cyan-300', icon: 'text-cyan-600 dark:text-cyan-400' }
];

// Opciones de idiomas
const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'Inglés: "Julius Caesar?" – Multilingual v1' },
  { value: 'spanish', label: 'Español: "Julius Caesar?" – Multilingual v1' },
  { value: 'french', label: 'Francés: "Julius Caesar?" – Multilingual v1' },
  { value: 'german', label: 'Alemán: "Julius Caesar?" – Multilingual v1' },
  { value: 'italian', label: 'Italiano: "Julius Caesar?" – Multilingual v1' },
  { value: 'polish', label: 'Polaco: "Julius Caesar?" – Multilingual v1' },
  { value: 'portuguese', label: 'Portugués: "Julius Caesar?" – Multilingual v1' },
  { value: 'arabic', label: 'Árabe: "Julius Caesar?" – Multilingual v1' },
  { value: 'hindi', label: 'Hindi: "Julius Caesar?" – Multilingual v1' },
  { value: 'japanese', label: 'Japonés: "Julius Caesar?" – Multilingual v2' },
  { value: 'korean', label: 'Coreano: "Julius Caesar?" – Multilingual v2' },
  { value: 'chinese', label: 'Chino: "Julius Caesar?" – Multilingual v2' },
  { value: 'turkish', label: 'Turco: "Julius Caesar?" – Multilingual v2' },
  { value: 'romanian', label: 'Rumano: "Julius Caesar?" – Multilingual v2' },
  { value: 'dutch', label: 'Holandés: "Julius Caesar?" – Multilingual v2' },
  { value: 'greek', label: 'Griego: "Julius Caesar?" – Multilingual v2' },
  { value: 'vietnamese', label: 'Vietnamita: "Julius Caesar?" – Multilingual v2' },
  { value: 'bulgarian', label: 'Búlgaro: "Julius Caesar?" – Multilingual v2' },
  { value: 'finnish', label: 'Finlandés: "Julius Caesar?" – Multilingual v2' },
  { value: 'croatian', label: 'Croata: "Julius Caesar?" – Multilingual v2' },
  { value: 'swedish', label: 'Sueco: "Julius Caesar?" – Multilingual v2' },
  { value: 'norwegian', label: 'Noruego: "Julius Caesar?" – Multilingual v2' },
  { value: 'danish', label: 'Danés: "Julius Caesar?" – Multilingual v2' }
];

const OutlinePanel: React.FC<OutlinePanelProps> = ({ 
  textBlocks, 
  onScrollToBlock, 
  collapsedTitles,
  selectedParagraphs,
  onToggleParagraphSelection
}) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('spanish');

  // Función para obtener el color de un párrafo aplicado
  const getAppliedColor = (paragraph: TextElement) => {
    if (!paragraph.applied || !paragraph.appliedColor) {
      return APPLIED_COLORS[0];
    }
    
    const colorIndex = parseInt(paragraph.appliedColor);
    return APPLIED_COLORS[colorIndex] || APPLIED_COLORS[0];
  };

  // Función para determinar si un párrafo está antes del primer título
  const isParagraphBeforeFirstTitle = (paragraphIndex: number) => {
    // Buscar el primer título en textBlocks
    const firstTitleIndex = textBlocks.findIndex(block => block.isTitle);
    // Si no hay títulos, ningún párrafo está "antes del primer título"
    if (firstTitleIndex === -1) return false;
    // Si el párrafo está antes del primer título, devolver true
    return paragraphIndex < firstTitleIndex;
  };

  // Función para obtener el número de intro de un párrafo antes del primer título
  const getIntroNumber = (paragraphIndex: number) => {
    let introCount = 1;
    for (let i = 0; i < paragraphIndex; i++) {
      if (!textBlocks[i].isTitle) {
        if (isParagraphBeforeFirstTitle(i)) {
          if (i === paragraphIndex) return introCount;
          introCount++;
        }
      }
    }
    return introCount;
  };

  const getAssociatedParagraphs = (titleIndex: number) => {
    const paragraphs = [];
    for (let i = titleIndex + 1; i < textBlocks.length; i++) {
      if (textBlocks[i].isTitle) break;
      paragraphs.push(textBlocks[i]);
    }
    return paragraphs;
  };

  const renderOutlineItems = () => {
    const items = [];
    let currentTitleIndex = -1;

    textBlocks.forEach((block, index) => {
      if (block.isTitle) {
        currentTitleIndex = index;
        const isCollapsed = collapsedTitles.has(block.id);
        const associatedParagraphs = getAssociatedParagraphs(index);
        const appliedColor = getAppliedColor(block);
        
        items.push(
          <div key={block.id} className="mb-2">
            {/* Title Item */}
            <div
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors ${
                selectedParagraphs.has(block.id) ? 'bg-muted ring-1 ring-border' : ''
              } ${
                block.applied ? `${appliedColor.bg} ring-1 ${appliedColor.ring}` : ''
              }`}
              onClick={() => onScrollToBlock(block.id)}
            >
              <Checkbox 
                className="flex-shrink-0" 
                checked={selectedParagraphs.has(block.id)}
                onCheckedChange={(checked) => {
                  onToggleParagraphSelection(block.id);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                )}
                <Hash className={`w-4 h-4 ${block.applied ? appliedColor.icon : 'text-amber-600 dark:text-amber-400'}`} />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className={`font-semibold text-sm truncate ${block.applied ? appliedColor.text : 'text-amber-800 dark:text-amber-300'}`}>
                  Título {block.titleNumber}
                  {block.applied && <span className="ml-1">✓</span>}
                </div>
                <div className={`text-xs truncate ${block.applied ? appliedColor.text : 'text-amber-600 dark:text-amber-400'}`}>
                  {block.text.slice(0, 40)}{block.text.length > 40 ? '...' : ''}
                </div>
              </div>
            </div>

            {/* Associated Paragraphs (only show if not collapsed) */}
            {!isCollapsed && associatedParagraphs.map((paragraph) => {
              const appliedColor = getAppliedColor(paragraph);
              return (
                <div
                  key={paragraph.id}
                  className={`ml-6 flex items-center gap-2 p-1 rounded-md hover:bg-muted/30 cursor-pointer transition-colors ${
                    selectedParagraphs.has(paragraph.id) ? 'bg-muted ring-1 ring-border' : ''
                  } ${
                    paragraph.applied ? `${appliedColor.bg} ring-1 ${appliedColor.ring}` : ''
                  }`}
                  onClick={() => onScrollToBlock(paragraph.id)}
                >
                  <Checkbox 
                    className="flex-shrink-0" 
                    checked={selectedParagraphs.has(paragraph.id)}
                    onCheckedChange={(checked) => {
                      onToggleParagraphSelection(paragraph.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FileText className={`w-3 h-3 flex-shrink-0 ${paragraph.applied ? appliedColor.icon : 'text-blue-600 dark:text-blue-400'}`} />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className={`text-xs truncate ${paragraph.applied ? appliedColor.text : 'text-blue-700 dark:text-blue-300'}`}>
                      Párrafo {paragraph.number} ({paragraph.text.length} caracteres)
                      {paragraph.applied && <span className="ml-1">✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      } else if (currentTitleIndex === -1) {
        // Standalone paragraph (not under any title)
        const appliedColor = getAppliedColor(block);
        const isBeforeFirstTitle = isParagraphBeforeFirstTitle(index);
        const introNumber = isBeforeFirstTitle ? getIntroNumber(index) : null;
        
        items.push(
          <div
            key={block.id}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/30 cursor-pointer transition-colors mb-1 ${
              selectedParagraphs.has(block.id) ? 'bg-muted ring-1 ring-border' : ''
            } ${
              block.applied ? `${appliedColor.bg} ring-1 ${appliedColor.ring}` : ''
            } ${
              isBeforeFirstTitle ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => onScrollToBlock(block.id)}
          >
            <Checkbox 
              className="flex-shrink-0" 
              checked={selectedParagraphs.has(block.id)}
              onCheckedChange={(checked) => {
                onToggleParagraphSelection(block.id);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <FileText className={`w-4 h-4 flex-shrink-0 ${
              block.applied ? appliedColor.icon : 
              isBeforeFirstTitle ? 'text-gray-500 dark:text-gray-400' : 'text-blue-600 dark:text-blue-400'
            }`} />
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className={`text-sm truncate ${
                block.applied ? appliedColor.text : 
                isBeforeFirstTitle ? 'text-gray-600 dark:text-gray-400' : 'text-blue-700 dark:text-blue-300'
              }`}>
                {isBeforeFirstTitle ? `Intro ${introNumber}` : `Párrafo ${block.number}`}
                {block.applied && <span className="ml-1">✓</span>}
              </div>
              <div className={`text-xs truncate ${
                isBeforeFirstTitle ? 'text-gray-500 dark:text-gray-500' : 'text-muted-foreground'
              }`}>
                {block.text.length} caracteres
              </div>
            </div>
          </div>
        );
      }
    });

    return items;
  };

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Language Selector - Outside of the card */}
      <div className="space-y-2 px-1">
        <label className="text-sm font-medium text-foreground">Idioma:</label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full min-w-[400px]">
            <SelectValue placeholder="Selecciona un idioma" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] min-w-[400px]">
            {LANGUAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="min-w-[380px]">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vista General Card */}
      <Card className="flex-1 flex flex-col shadow-lg bg-card text-card-foreground backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2 p-4 pb-2 flex-shrink-0">
          <Hash className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Vista General</h2>
          {selectedParagraphs.size > 0 && (
            <div className="ml-auto bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
              {selectedParagraphs.size} seleccionados
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 pb-4">
            <div className="space-y-1">
              {textBlocks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Sin contenido</p>
                </div>
              ) : (
                renderOutlineItems()
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OutlinePanel;
