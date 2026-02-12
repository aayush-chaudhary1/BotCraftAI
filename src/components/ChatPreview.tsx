import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bot, Send, RotateCcw, User, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatPreview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatbot, setChatbot] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadChatbot();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatbot = async () => {
    try {
      const { data, ok } = await api<any>(`/api/chatbots/${id}`);
      if (ok && data) {
        setChatbot(data);
        // Add greeting
        if (data.config?.greeting) {
          setMessages([{
            id: 'init',
            sender: 'bot',
            text: data.config.greeting,
            timestamp: new Date(),
          }]);
        }
      }
    } catch (err) {
      toast.error('Failed to load chatbot');
    }
  };

  useEffect(() => {
    if (id) {
      const storedSession = localStorage.getItem(`previewSession:${id}`);
      if (storedSession) setSessionId(storedSession);
    }
  }, [id]);

  useEffect(() => {
    if (id && sessionId) {
      localStorage.setItem(`previewSession:${id}`, sessionId);
    }
  }, [id, sessionId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !id) return;

    const userText = input.trim();
    if (!userText) return;
    setInput('');

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const payload: { message: string; sessionId?: string } = { message: userText };
      if (sessionId && sessionId.trim().length > 0) {
        payload.sessionId = sessionId;
      }

      const { data, ok } = await api<{ message: string; sessionId?: string; answer?: string }>(`/api/chatbots/${id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (ok && data) {
        if (data.sessionId && data.sessionId.trim().length > 0) {
          setSessionId(data.sessionId);
          // Persist immediately to ensure it survives refresh if useEffect is slow
          localStorage.setItem(`previewSession:${id}`, data.sessionId);
        }

        // Backend might return 'answer' or 'message'
        const botText = data.answer || data.message || "I didn't get a response.";

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botText,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (err) {
      toast.error('Failed to send message');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Sorry, I'm having trouble connecting right now.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    if (id) localStorage.removeItem(`previewSession:${id}`);
    setSessionId(null);
    setMessages([]);
    if (chatbot?.config?.greeting) {
      setMessages([{
        id: 'init',
        sender: 'bot',
        text: chatbot.config.greeting,
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Chat Preview</h1>
          <p className="text-gray-600">
            Test your chatbot responses before deployment.
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Conversation
        </Button>
      </div>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>{chatbot?.name || 'Loading...'}</CardTitle>
              <CardDescription>
                {chatbot ? 'Online' : 'Connecting...'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
            >
              <div
                className={`p-2 rounded-full ${message.sender === 'user'
                  ? 'bg-blue-600'
                  : 'bg-blue-100'
                  }`}
              >
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[70%] ${message.sender === 'user' ? 'items-end' : ''
                  }`}
              >
                <div
                  className={`rounded-lg p-3 ${message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  <p>{message.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Try asking: "How do I request a refund?" or "What are your support hours?"
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => navigate(`/config/${id}`)}>
          Back to Configuration
        </Button>
        <Button onClick={() => navigate(`/deploy/${id}`)}>
          Continue to Deployment
        </Button>
      </div>
    </div >
  );
}