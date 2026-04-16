import { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User } from 'lucide-react';
import { ANOX_SYSTEM_PROMPT } from '~/prompt';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Merhaba! Ben ANOX. Size nasıl yardımcı olabilirim?', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = useMemo(() => {
    const apiKey = (import.meta as any).env?.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set');
    }

    const ai = new GoogleGenAI({ apiKey });

    return ai.chats.create({
      model: 'gemini-1.5-flash',
      config: {
        systemInstruction: ANOX_SYSTEM_PROMPT,
      },
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: userMessage });
      const aiText = response.text || 'Bir hata oluştu.';
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: aiText, sender: 'ai' }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: 'Üzgünüm, bir hata oluştu.', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans animate-in fade-in duration-1000 overflow-hidden relative">
      {/* background elements */}
      <div className="absolute top-[100px] left-[200px] w-[150px] h-[2px] bg-gradient-to-r from-white/80 to-transparent -rotate-45 opacity-60 pointer-events-none"></div>
      <div className="absolute top-[400px] left-[700px] w-[150px] h-[2px] bg-gradient-to-r from-white/80 to-transparent -rotate-45 opacity-60 pointer-events-none"></div>
      <div className="absolute top-[200px] left-[850px] w-[150px] h-[2px] bg-gradient-to-r from-white/80 to-transparent -rotate-45 opacity-60 pointer-events-none"></div>
      <div className="absolute top-[50px] left-[120px] w-[2px] h-[2px] bg-white rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute top-[150px] left-[420px] w-[1px] h-[1px] bg-white rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute top-[650px] left-[320px] w-[3px] h-[3px] bg-white rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute top-[350px] left-[920px] w-[2px] h-[2px] bg-white rounded-full opacity-50 pointer-events-none"></div>

      {/* sidebar */}
      <div className="hidden md:flex w-[260px] bg-white/[0.03] backdrop-blur-[20px] border-r border-white/10 flex-col p-6 z-10">
        <div className="mb-12">
          <div className="text-[32px] font-black tracking-[4px] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            ANOX
          </div>
        </div>
        <div className="uppercase text-[10px] tracking-[2px] mb-4 opacity-50">Konuşma Geçmişi</div>
        <div className="p-3 px-4 rounded-lg bg-white/10 mb-3 text-[14px] text-white border border-white/20 cursor-pointer">
          Kuantum Fiziği Üzerine
        </div>
        <div className="p-3 px-4 rounded-lg bg-white/5 mb-3 text-[14px] text-white/70 border border-white/5 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
          Gelecek Teknolojileri
        </div>
        <div className="p-3 px-4 rounded-lg bg-white/5 mb-3 text-[14px] text-white/70 border border-white/5 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
          Kodlama Yardımı
        </div>
        <div className="p-3 px-4 rounded-lg bg-white/5 mb-3 text-[14px] text-white/70 border border-white/5 cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
          Sanat ve Tasarım
        </div>
        <div className="mt-auto text-[12px] opacity-60 flex items-center">
          <span className="w-2 h-2 bg-[#4CAF50] rounded-full inline-block mr-2 shadow-[0_0_10px_rgba(76,175,80,0.5)]"></span>
          ANOX Sistem Aktif
        </div>
      </div>

      {/* main chat */}
      <main className="flex-1 flex flex-col relative p-4 md:p-10 z-[5] overflow-hidden">
        <div className="flex justify-center mb-6 md:mb-10 shrink-0">
          <div className="text-[48px] md:text-[84px] font-black tracking-[8px] md:tracking-[12px] opacity-90">ANOX</div>
        </div>

        <div className="flex-1 flex flex-col gap-6 max-w-[800px] mx-auto w-full overflow-y-auto scroll-smooth pb-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex max-w-[90%] md:max-w-[80%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start flex-row'} items-end gap-3`}
            >
              <div
                className={`p-2 rounded-full flex-shrink-0 ${msg.sender === 'user' ? 'bg-white/15 border border-white/20 text-white' : 'bg-white/[0.07] border border-white/10 text-white'}`}
              >
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`p-4 md:p-5 rounded-2xl leading-[1.6] text-[14px] md:text-[15px] overflow-hidden ${msg.sender === 'user' ? 'bg-white/15 border border-white/20' : 'bg-white/[0.07] backdrop-blur-[10px] border border-white/10'}`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {(() => {
                      const text = msg.text;
                      const artifactRegex = /<boltArtifact[^>]*>([\s\S]*?)(?:<\/boltArtifact>|$)/g;
                      const parts = [];
                      let lastIndex = 0;
                      let match;

                      while ((match = artifactRegex.exec(text)) !== null) {
                        if (match.index > lastIndex) {
                          parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
                        }

                        const attributes = match[0].match(/<boltArtifact([^>]*)>/)?.[1] || '';
                        const titleMatch = attributes.match(/title="([^"]*)"/);
                        const title = titleMatch ? titleMatch[1] : 'Kod İşlemi';

                        parts.push(
                          <div
                            key={`artifact-${match.index}`}
                            className="mt-4 p-4 rounded-lg bg-black/40 border border-white/10 flex flex-col gap-2"
                          >
                            <div className="flex items-center gap-2 text-[#4CAF50]">
                              <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></div>
                              <span className="font-mono text-sm">{title}</span>
                            </div>
                            <div className="text-xs text-white/50">
                              ANOX tarafından kod oluşturuluyor... (Sistem arka planda derliyor)
                            </div>
                          </div>,
                        );
                        lastIndex = artifactRegex.lastIndex;
                      }

                      if (lastIndex < text.length) {
                        parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
                      }

                      return parts;
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex max-w-[80%] self-start flex-row items-end gap-3">
              <div className="p-2 rounded-full flex-shrink-0 bg-white/[0.07] border border-white/10 text-white">
                <Bot size={16} />
              </div>
              <div className="p-5 rounded-2xl leading-[1.6] text-[15px] bg-white/[0.07] backdrop-blur-[10px] border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-auto flex justify-center pt-6 md:pt-10 shrink-0">
          <div className="w-full max-w-[800px] bg-white/5 border border-white/15 backdrop-blur-[15px] rounded-full py-2 md:py-3 px-4 md:px-6 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Mesajınızı buraya yazın..."
              className="flex-1 bg-transparent text-white placeholder-white/40 text-[14px] md:text-[16px] focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shrink-0 ml-2 md:ml-4 disabled:opacity-50 transition-opacity"
            >
              <Send size={16} className="text-black ml-0.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
