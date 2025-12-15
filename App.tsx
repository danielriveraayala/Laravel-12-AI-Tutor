import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Image as ImageIcon, Menu, X, BrainCircuit, Loader2 } from 'lucide-react';
import { Message, Role, Topic } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: '¡Hola! Soy tu tutor experto en Laravel 12. Estoy aquí para guiarte desde conceptos básicos hasta arquitectura avanzada. Puedes elegir un tema del menú o hacerme cualquier pregunta. ¿Por dónde te gustaría empezar?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (text: string, image: string | null) => {
    if (!text.trim() && !image) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      image: image || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setSelectedImage(null);
    setIsLoading(true);

    // Placeholder for AI thinking
    const loadingMessageId = 'loading-' + Date.now();
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      role: Role.MODEL,
      text: '',
      isThinking: true
    }]);

    try {
      // Filter out loading message and current message for history
      // Keep only last 10 messages to keep context concise but useful
      const history = messages.slice(-10);
      
      const responseText = await sendMessageToGemini(text, history, image, isThinkingMode);

      setMessages(prev => prev.map(msg => {
        if (msg.id === loadingMessageId) {
          return {
            ...msg,
            text: responseText,
            isThinking: false
          };
        }
        return msg;
      }));
    } catch (error) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === loadingMessageId) {
          return {
            ...msg,
            text: "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.",
            isThinking: false
          };
        }
        return msg;
      }));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isThinkingMode]);

  const onTopicSelect = (topic: Topic) => {
    handleSendMessage(topic.prompt, null);
    setIsSidebarOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSelectTopic={onTopicSelect} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800">Chat de Aprendizaje</h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                <span className="text-xs text-slate-500">{isLoading ? 'AI Escribiendo...' : 'En línea'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* Thinking Mode Toggle */}
            <button
              onClick={() => setIsThinkingMode(!isThinkingMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isThinkingMode 
                  ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-inner' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title="Activar para lógica compleja y razonamiento profundo"
            >
              <BrainCircuit className={`w-4 h-4 ${isThinkingMode ? 'fill-purple-300' : ''}`} />
              <span className="hidden sm:inline">Deep Think</span>
              {isThinkingMode && <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>}
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Image Preview */}
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="h-20 w-auto rounded-lg border border-slate-300 shadow-sm"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Subir imagen (código, diagrama, error)"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue, selectedImage);
                  }
                }}
                placeholder="Pregunta sobre Laravel, rutas, Eloquent..."
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 text-slate-700 placeholder-slate-400 max-h-32"
                rows={1}
                style={{ minHeight: '44px' }}
              />

              <button
                onClick={() => handleSendMessage(inputValue, selectedImage)}
                disabled={isLoading || (!inputValue.trim() && !selectedImage)}
                className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-200 ${
                  isLoading || (!inputValue.trim() && !selectedImage)
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">
                La IA puede cometer errores. Revisa el código antes de usarlo en producción.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
