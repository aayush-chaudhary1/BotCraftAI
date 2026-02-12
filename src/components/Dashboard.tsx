import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Bot, FileText, MessageSquare, Clock, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import { api } from '../lib/api';

type Chatbot = {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  documents?: number;
  conversations?: number;
  lastUpdated?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatbotToDelete, setChatbotToDelete] = useState<Chatbot | null>(null);

  // Load chatbots on mount
  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    try {
      const { data, ok } = await api<Chatbot[]>('/api/chatbots');
      if (ok && Array.isArray(data)) {
        setChatbots(data);
      }
    } catch (err) {
      console.error('Failed to load chatbots', err);
      toast.error('Failed to load chatbots');
    }
  };

  const handeChatbotClick = (id: string, path: string) => {
    localStorage.setItem('activeChatbotId', id);
    navigate(path);
  };

  const handleDeleteClick = (chatbot: Chatbot) => {
    setChatbotToDelete(chatbot);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (chatbotToDelete) {
      try {
        const { ok } = await api(`/api/chatbots/${chatbotToDelete.id}`, { method: 'DELETE' });
        if (ok) {
          setChatbots(chatbots.filter(c => c.id !== chatbotToDelete.id));
          toast.success(`Chatbot "${chatbotToDelete.name}" has been deleted`);
        } else {
          toast.error('Failed to delete chatbot');
        }
      } catch (err) {
        toast.error('Error deleting chatbot');
      }
      setDeleteDialogOpen(false);
      setChatbotToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-600">
            Manage your AI chatbots and monitor their performance
          </p>
        </div>
        <Link to="/create">
          <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Chatbot
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 hover:shadow-xl transition-all hover:border-blue-300">
          <CardHeader className="pb-3">
            <CardDescription>Total Chatbots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-1">{chatbots.length}</div>
                <div className="text-xs text-gray-500">All time</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all hover:border-green-300">
          <CardHeader className="pb-3">
            <CardDescription>Active Chatbots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-1">
                  {chatbots.filter(c => c.status === 'active').length}
                </div>
                <div className="text-xs text-gray-500">Currently active</div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all hover:border-purple-300">
          <CardHeader className="pb-3">
            <CardDescription>Total Documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-1">
                  {chatbots.reduce((acc, c) => acc + (c.documents || 0), 0)}
                </div>
                <div className="text-xs text-gray-500">Knowledge base</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all hover:border-orange-300">
          <CardHeader className="pb-3">
            <CardDescription>Conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-1">
                  {chatbots.reduce((acc, c) => acc + (c.conversations || 0), 0)}
                </div>
                <div className="text-xs text-gray-500">Total conversations</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot List */}
      <div>
        <h2 className="text-xl mb-4">Your Chatbots</h2>

        {chatbots.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No chatbots created yet.</p>
              <Link to="/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Chatbot
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {chatbots.map((chatbot) => (
              <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bot className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{chatbot.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {chatbot.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                      {chatbot.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl">{chatbot.documents || 0}</div>
                      <div className="text-xs text-gray-600">Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">{chatbot.conversations || 0}</div>
                      <div className="text-xs text-gray-600">Conversations</div>
                    </div>
                    <div className="text-center flex flex-col items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-400 mb-1" />
                      <div className="text-xs text-gray-600">{chatbot.lastUpdated}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handeChatbotClick(chatbot.id, `/config/${chatbot.id}`)}
                    >
                      Configure
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handeChatbotClick(chatbot.id, `/preview/${chatbot.id}`)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(chatbot)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chatbot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{chatbotToDelete?.name}"? This action cannot be undone.
              All associated data, conversations, and configurations will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}