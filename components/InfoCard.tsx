import React from 'react';

const InfoListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <svg className="h-6 w-6 text-[#0050A0] flex-shrink-0 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-gray-700">{children}</span>
  </li>
);

export const InfoCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 animate-fade-in relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0050A0]"></div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
      <ul className="space-y-4">
        <InfoListItem>
          <strong>Upload a PDF:</strong> Click the upload area to select a document from your device, or simply drag and drop it.
        </InfoListItem>
        <InfoListItem>
          <strong>Process with AI:</strong> Our AI agents will read the document, check compliance, and draft a response in seconds.
        </InfoListItem>
        <InfoListItem>
          <strong>Get Results:</strong> Instantly view the extracted information, compliance status, and a ready-to-use notification draft.
        </InfoListItem>
      </ul>
    </div>
  );
};