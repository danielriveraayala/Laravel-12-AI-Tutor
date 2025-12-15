import React from 'react';
import { TOPICS } from '../constants';
import { Topic } from '../types';
import { BookOpen, GraduationCap, Trophy, ChevronRight } from 'lucide-react';

interface SidebarProps {
  onSelectTopic: (topic: Topic) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTopic, isOpen, onClose }) => {
  const getIcon = (level: string) => {
    switch (level) {
      case 'beginner': return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'intermediate': return <GraduationCap className="w-4 h-4 text-yellow-500" />;
      case 'expert': return <Trophy className="w-4 h-4 text-red-500" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLevelLabel = (level: string) => {
     switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'expert': return 'Experto';
      default: return '';
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-30 transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static flex flex-col`}>
        
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-red-600 text-3xl">L</span> Laravel<span className="text-red-500">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Tu tutor personal v12</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {['beginner', 'intermediate', 'expert'].map((level) => (
            <div key={level}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                {getIcon(level)} {getLevelLabel(level)}
              </h3>
              <div className="space-y-1">
                {TOPICS.filter(t => t.level === level).map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onSelectTopic(topic);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group flex items-start gap-2"
                  >
                     <div className="mt-1 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity">
                        <ChevronRight className="w-3 h-3" />
                     </div>
                     <div>
                        <div className="text-sm font-medium">{topic.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{topic.description}</div>
                     </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="text-xs text-slate-500 text-center">
            Powered by Gemini 3 Pro
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;
