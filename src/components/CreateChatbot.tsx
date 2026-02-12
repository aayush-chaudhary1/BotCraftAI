import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bot, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

export default function CreateChatbot() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('english');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, ok, status } = await api<any>('/api/chatbots', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          config: { language },
        }),
      });

      console.log('Create Chatbot Response:', { status, ok, data });

      // Robust ID parsing
      const chatbotId = data?.id || data?.chatbot?.id || data?.data?.id;

      if ((ok || status === 201 || status === 200) && chatbotId) {
        toast.success('Chatbot created successfully');
        localStorage.setItem('activeChatbotId', chatbotId);
        navigate(`/knowledge-base/${chatbotId}`);
      } else {
        throw new Error(data?.message || 'Failed to create chatbot');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create chatbot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Create New Chatbot</h1>
        <p className="text-gray-600">
          Give your chatbot a name and purpose.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Basic Information</CardTitle>
          </div>
          <CardDescription>
            Set up the basic details for your new chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Chatbot Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Customer Support Bot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Choose a descriptive name for your chatbot
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what this chatbot will do..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-gray-500">
                Optional: Explain the purpose and functionality of your chatbot
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Select the primary language for your chatbot
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create & Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}