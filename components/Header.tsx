import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
        AI Document Workflow Orchestrator
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
        An end-to-end agentic workflow: from data extraction and compliance checks to automated notifications.
      </p>
    </header>
  );
};