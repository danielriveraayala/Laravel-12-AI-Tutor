import React from 'react';
import { Message, Role } from '../types';
import { User, Bot, BrainCircuit } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  // Simple formatter for code blocks
  const formatText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const content = part.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
        const langMatch = part.match(/```([a-z]*)/);
        const lang = langMatch ? langMatch[1] : '';
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shadow-md">
            {lang && (
              <div className="bg-slate-800 px-4 py-1 text-xs text-slate-400 font-mono uppercase border-b border-slate-700">
                {lang}
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
              <code>{content}</code>
            </pre>
          </div>
        );
      }
      
      // Basic formatting for bold and inline code
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((subPart, subIndex) => {
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return <code key={subIndex} className="bg-slate-200 text-red-600 px-1 py-0.5 rounded text-sm font-mono">{subPart.slice(1, -1)}</code>;
            }
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIndex} className="font-bold text-slate-900">{subPart.slice(2, -2)}</strong>;
            }
            return subPart;
          })}
        </span>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-indigo-600' : 'bg-red-600'
        } shadow-md`}>
          {isUser ? <User className="text-white w-5 h-5" /> : <Bot className="text-white w-5 h-5" />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl shadow-sm border ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500' 
              : 'bg-white text-slate-800 rounded-tl-none border-slate-200'
          }`}>
            {message.image && (
              <div className="mb-3">
                <img 
                  src={message.image} 
                  alt="User uploaded content" 
                  className="max-h-64 rounded-lg border border-white/20 shadow-sm" 
                />
              </div>
            )}
            
            {message.isThinking ? (
               <div className="flex items-center gap-2 text-sm italic text-slate-500">
                  <BrainCircuit className="w-4 h-4 animate-pulse text-purple-500" />
                  <span className="thinking-pulse">Analizando profundamente...</span>
               </div>
            ) : (
              <div className={`text-sm md:text-base leading-relaxed ${isUser ? 'text-indigo-50' : 'text-slate-700'}`}>
                {formatText(message.text)}
              </div>
            )}
          </div>
          {!isUser && (
             <span className="text-xs text-slate-400 mt-1 ml-1">AI Tutor • Laravel 12</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
