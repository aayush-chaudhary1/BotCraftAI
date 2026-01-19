import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Bot, User, Search, Calendar } from 'lucide-react';

interface Conversation {
  id: string;
  user: string;
  messages: { sender: 'user' | 'bot'; text: string; time: string }[];
  date: string;
  duration: string;
  status: 'resolved' | 'ongoing';
}

const mockConversations: Conversation[] = [];

export default function ConversationHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    null
  );

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some((msg) =>
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Conversation History</h1>
        <p className="text-gray-600">
          View and analyze past chatbot interactions.
        </p>
      </div>

      {mockConversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-1">No conversations found.</p>
            <p className="text-sm text-gray-500">
              Conversations will appear here once users start chatting with your bot
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                {filteredConversations.length} conversation(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Conversation List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedConversation?.id === conv.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{conv.user}</span>
                        </div>
                        <Badge
                          variant={conv.status === 'resolved' ? 'default' : 'secondary'}
                        >
                          {conv.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conv.messages[0].text}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{conv.date}</span>
                        <span>•</span>
                        <span>{conv.duration}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversation Detail */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conversation Details</CardTitle>
                  {selectedConversation && (
                    <CardDescription>
                      {selectedConversation.user} • {selectedConversation.date}
                    </CardDescription>
                  )}
                </div>
                {selectedConversation && (
                  <Badge variant={selectedConversation.status === 'resolved' ? 'default' : 'secondary'}>
                    {selectedConversation.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedConversation ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {selectedConversation.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.sender === 'user'
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
                      <div className="flex-1 max-w-[80%]">
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>Select a conversation to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
