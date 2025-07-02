import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Filter } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { mockTemplates } from '../data/mockData';
import { Template } from '../types';

const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const industries = [
    { id: 'all', label: 'All Industries' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'tourism', label: 'Tourism' },
    { id: 'hospitality', label: 'Hospitality' }
  ];

  const filteredTemplates = selectedIndustry === 'all' 
    ? templates 
    : templates.filter(t => t.industry === selectedIndustry);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      lastModified: new Date()
    };
    setTemplates(prev => [newTemplate, ...prev]);
  };

  const getIndustryColor = (industry: Template['industry']) => {
    switch (industry) {
      case 'real-estate': return 'bg-blue-100 text-blue-800';
      case 'tourism': return 'bg-green-100 text-green-800';
      case 'hospitality': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIndustryLabel = (industry: Template['industry']) => {
    switch (industry) {
      case 'real-estate': return 'Real Estate';
      case 'tourism': return 'Tourism';
      case 'hospitality': return 'Hospitality';
      default: return industry;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Library</h1>
          <p className="text-gray-600">Manage AI prompt templates for different industries</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedIndustry === industry.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {industry.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} hover>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndustryColor(template.industry)}`}>
                    {getIndustryLabel(template.industry)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{template.description}</p>
              
              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Template Preview:</p>
                <p className="text-sm text-gray-700 line-clamp-3">{template.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Modified {template.lastModified.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={Edit}
                  onClick={() => setEditingTemplate(template)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Copy}
                  onClick={() => handleDuplicate(template)}
                >
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">
            {selectedIndustry === 'all' 
              ? "Get started by creating your first template"
              : `No templates found for ${industries.find(i => i.id === selectedIndustry)?.label}`
            }
          </p>
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Your First Template
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTemplate) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTemplate?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    defaultValue={editingTemplate?.industry || 'real-estate'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="real-estate">Real Estate</option>
                    <option value="tourism">Tourism</option>
                    <option value="hospitality">Hospitality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTemplate?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the template"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Content
                  </label>
                  <textarea
                    rows={8}
                    defaultValue={editingTemplate?.content || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your AI prompt template here..."
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTemplate(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Save logic would go here
                  setShowCreateModal(false);
                  setEditingTemplate(null);
                  alert('Template saved successfully!');
                }}
              >
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;