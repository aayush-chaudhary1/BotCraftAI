import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Upload, FileText, X, CheckCircle, File, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'complete' | 'error';
  ingestionStatus?: 'processing' | 'ready' | 'failed';
}

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // chatbotId
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error('Please select a chatbot first');
      navigate('/dashboard');
      return;
    }
    loadDocuments();
  }, [id, navigate]);

  // Polling for processing status
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const hasProcessing = files.some(f => f.ingestionStatus === 'processing');

    if (hasProcessing) {
      timeoutId = setTimeout(() => {
        loadDocuments(true);
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [files]);

  const loadDocuments = async (silent = false) => {
    if (!id) return;
    if (!silent) setIsLoading(true);
    try {
      // api() now unwraps response.data if success=true, so getting <any> allows checking if it's an array directly
      const { data, ok } = await api<any>(`/api/chatbots/${id}/documents`);

      // Robust check: it might be the array, or still wrapped if something changed
      const docs = Array.isArray(data) ? data : data?.data;

      if (ok && Array.isArray(docs)) {
        setFiles(docs.map((doc: any) => ({
          id: doc.id,
          name: doc.title || doc.filename || 'Untitled',
          size: doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
          type: doc.mimeType ? doc.mimeType.split('/').pop()?.toUpperCase() : 'FILE',
          status: 'complete',
          ingestionStatus: doc.metadata?.ingestionStatus || 'processing',
        })));
      }
    } catch (err) {
      console.error('Failed to load documents', err);
      if (!silent) toast.error('Failed to load documents');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // ... (loadDocuments)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!id) return;

    // Optimistic UI update
    const tempId = Date.now().toString();
    const newFile: UploadedFile = {
      id: tempId,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      status: 'uploading',
      ingestionStatus: 'processing',
    };

    setFiles(prev => [...prev, newFile]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'to chatbot:', id);

      const { ok, status, data } = await api(`/api/chatbots/${id}/documents`, {
        method: 'POST',
        body: formData,
        // Important: Do NOT set Content-Type header for FormData, browser does it with boundary
      });

      console.log('Upload response:', status, data);

      if (ok) {
        toast.success('File uploaded successfully');
        loadDocuments(true); // Refresh list to get real ID and status
      } else {
        throw new Error((data as any)?.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      toast.error('Failed to upload file');
      setFiles(prev => prev.filter(f => f.id !== tempId)); // Remove temp file on error
    }
  };

  const removeFile = async (documentId: string) => {
    // If it's a temp file (still uploading), don't try to delete from backend
    if (!documentId.includes('-') && documentId.length < 20) { // Simple check for temp numeric ID
      setFiles(prev => prev.filter(f => f.id !== documentId));
      return;
    }

    try {
      const prevFiles = files;
      setFiles(files.filter(f => f.id !== documentId));

      const { ok } = await api(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (ok) {
        toast.success('Document deleted');
      } else {
        setFiles(prevFiles); // Revert
        toast.error('Failed to delete document');
      }
    } catch (err) {
      toast.error('Error deleting document');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Knowledge Base</h1>
        <p className="text-gray-600">
          Upload documents your chatbot should learn from.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Supported formats: PDF, TXT, DOCX, Markdown, CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
              }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg mb-2">
              Drag and drop your files here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse from your computer
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.txt,.docx,.doc,.md,.csv"
            />
            <label htmlFor="file-upload">
              <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                <FileText className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents ({files.length})</CardTitle>
            <CardDescription>
              These documents will be used to train your chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded">
                      <File className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{file.size}</span>
                        <span>•</span>
                        <Badge variant="secondary">{file.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.ingestionStatus === 'processing' ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : file.ingestionStatus === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'uploading'}
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {files.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No documents uploaded yet.</p>
            <p className="text-sm text-gray-500">Upload documents to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate(`/config/${id}`)} disabled={files.length === 0}>
          Continue to Configuration
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}