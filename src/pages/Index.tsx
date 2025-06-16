import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import TextBlock from "@/components/TextBlock";
import OutlinePanel from "@/components/OutlinePanel";
import StatsPanel from "@/components/StatsPanel";
import ApiPanel from "@/components/ApiPanel";
import ThemeToggle from "@/components/ThemeToggle";

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

const Index = () => {
  const [textBlocks, setTextBlocks] = useState<TextElement[]>([]);
  const [collapsedTitles, setCollapsedTitles] = useState<Set<string>>(new Set());
  const [selectedParagraphs, setSelectedParagraphs] = useState<Set<string>>(new Set());
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['textData'],
    queryFn: async () => {
      const response = await fetch('/api/text');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (data) {
      setTextBlocks(data);
    }
  }, [data]);

  const scrollToBlock = (blockId: string) => {
    const element = blockRefs.current.get(blockId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const toggleCollapseTitle = (titleId: string) => {
    setCollapsedTitles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(titleId)) {
        newSet.delete(titleId);
      } else {
        newSet.add(titleId);
      }
      return newSet;
    });
  };

  const toggleParagraphSelection = (paragraphId: string) => {
    setSelectedParagraphs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paragraphId)) {
        newSet.delete(paragraphId);
      } else {
        newSet.add(paragraphId);
      }
      return newSet;
    });
  };

  const handleApplyBlock = (id: string, colorIndex: number) => {
    setTextBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, applied: true, appliedColor: colorIndex.toString() } : block
      )
    );
  };

  const handleRemoveBlock = (id: string) => {
    setTextBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, applied: false, appliedColor: undefined } : block
      )
    );
  };
  const [selectedLanguage, setSelectedLanguage] = useState<string>('spanish');

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Text Analyzer
              </h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Outline */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full p-4">
              <OutlinePanel 
                textBlocks={textBlocks}
                onScrollToBlock={scrollToBlock}
                collapsedTitles={collapsedTitles}
                selectedParagraphs={selectedParagraphs}
                onToggleParagraphSelection={toggleParagraphSelection}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 space-y-4">
                  {textBlocks.map((block) => (
                    <TextBlock
                      key={block.id}
                      text={block.text}
                      isTitle={block.isTitle}
                      number={block.number}
                      titleNumber={block.titleNumber}
                      visible={block.visible}
                      applied={block.applied}
                      appliedColor={block.appliedColor}
                      onApply={handleApplyBlock}
                      onRemove={handleRemoveBlock}
                      ref={(el) => {
                        if (el) blockRefs.current.set(block.id, el);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Stats and API */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <div className="h-full p-4 space-y-4 overflow-y-auto">
              <StatsPanel textBlocks={textBlocks} />
              <ApiPanel 
                textBlocks={textBlocks} 
                selectedLanguage={selectedLanguage}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
