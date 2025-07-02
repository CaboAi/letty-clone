import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AISettings from './pages/AISettings';
import KnowledgeBase from './pages/KnowledgeBase';
import TemplateLibrary from './pages/TemplateLibrary';
import ROITracker from './pages/ROITracker';
import LocalizationSettings from './pages/LocalizationSettings';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai-settings" element={<AISettings />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/templates" element={<TemplateLibrary />} />
          <Route path="/roi-tracker" element={<ROITracker />} />
          <Route path="/localization" element={<LocalizationSettings />} />
          <Route path="/account" element={<AccountSettings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;