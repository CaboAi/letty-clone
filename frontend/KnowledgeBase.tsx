import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  RefreshCw, 
  Trash2, 
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { mockDocuments } from '../data/mockData';
import { Document } from '../types';

const KnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newDoc: Document = {
        id: Date.now().toString() + i,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date(),
        status: 'processing',
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'Word' : 'Other'
      };

      setDocuments(prev => [newDoc, ...prev]);
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === newDoc.id ? { ...doc, status: 'ready' } : doc
          )
        );
      }, 3000);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const handleReindex = async () => {
    setUploadProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }
    setUploadProgress(null);
    alert('Knowledge base reindexed successfully!');
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'processing': return 'Processing...';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Manage documents that power your AI's knowledge</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            onClick={handleReindex}
            disabled={uploadProgress !== null}
          >
            {uploadProgress !== null ? `Reindexing... ${uploadProgress}%` : 'Reindex All'}
          </Button>
          <label className="cursor-pointer">
            <Button icon={Upload}>Upload Documents</Button>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Search and Upload */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Search */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents or ask a question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {searchQuery && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Vector Search Preview:</strong> Found {filteredDocuments.length} documents 
                    matching "{searchQuery}". AI can answer questions using content from these sources.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Upload Stats */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Knowledge Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="text-sm font-medium text-gray-900">{documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ready</span>
                <span className="text-sm font-medium text-green-600">
                  {documents.filter(d => d.status === 'ready').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Processing</span>
                <span className="text-sm font-medium text-yellow-600">
                  {documents.filter(d => d.status === 'processing').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="text-sm font-medium text-gray-900">127 MB</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{document.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {document.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(document.status)}
                      <span className="ml-2 text-sm text-gray-600">{getStatusText(document.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {document.uploadDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeBase;