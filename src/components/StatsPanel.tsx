
import React from 'react';
import { BarChart3, FileText, Hash, Type } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TextElement {
  id: string;
  text: string;
  isTitle: boolean;
  number?: number;
  titleNumber?: number;
  visible: boolean;
}

interface StatsPanelProps {
  textBlocks: TextElement[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ textBlocks }) => {
  const totalParagraphs = textBlocks.filter(block => !block.isTitle).length;
  const totalTitles = textBlocks.filter(block => block.isTitle).length;
  
  const totalWords = textBlocks.reduce((sum, block) => {
    const words = block.text.trim() ? block.text.trim().split(/\s+/).length : 0;
    return sum + words;
  }, 0);
  
  const totalCharacters = textBlocks.reduce((sum, block) => sum + block.text.length, 0);

  const stats = [
    {
      label: 'Paragraphs',
      value: totalParagraphs,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Titles',
      value: totalTitles,
      icon: Hash,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      label: 'Total Words',
      value: totalWords,
      icon: Type,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Total Characters',
      value: totalCharacters,
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  return (
    <Card className="p-4 shadow-lg border bg-card text-card-foreground backdrop-blur-sm w-64">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <IconComponent className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StatsPanel;
