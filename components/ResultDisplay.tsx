import React, { useState } from 'react';
import type { ProcessedResult, ComplianceStatus } from '../types';

interface ResultDisplayProps {
  data: ProcessedResult;
}

const WorkflowStatus: React.FC = () => (
    <div className="flex items-center p-4 bg-green-50 border-b border-green-200 rounded-t-2xl">
      <svg className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div>
        <h4 className="font-semibold text-green-800">Workflow Complete</h4>
        <p className="text-sm text-green-700">All processing steps finished successfully.</p>
      </div>
    </div>
  );

const ResultItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start py-4">
    <div className="flex-shrink-0 w-8 h-8 mr-4 text-[#0050A0]">
        {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-md font-semibold text-gray-900 break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

const ComplianceStatusIndicator: React.FC<{ status: ComplianceStatus }> = ({ status }) => {
    if (status === 'Checking') {
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">Checking...</span>;
    }
    if (!status) {
        return <span className="text-gray-500">N/A</span>;
    }

    const isApproved = status === 'Approved';
    const baseClasses = "inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full gap-x-2";
    const colorClasses = isApproved 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    
    const Icon = () => isApproved ? (
      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ) : (
      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
    );

    return (
        <span className={`${baseClasses} ${colorClasses}`}>
            <Icon />
            {status}
        </span>
    );
};

const NotificationDisplay: React.FC<{ email: string | null; status: ComplianceStatus }> = ({ email, status }) => {
    const [copied, setCopied] = useState(false);
  
    if (!email) {
      return null;
    }
  
    const handleCopy = () => {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    const title = status === 'Approved' ? 'Welcome Email Draft' : 'Internal Alert Draft';
  
    return (
      <div className="pt-5">
        <h3 className="text-md font-semibold text-gray-900">{title}</h3>
        <div className="mt-2 relative bg-gray-50 p-4 rounded-lg border border-gray-200">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            aria-label="Copy notification text to clipboard"
            className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0050A0]"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {email}
          </pre>
        </div>
      </div>
    );
  };


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const isFullyComplete = !!data.notificationEmail;
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in overflow-hidden">
        {isFullyComplete && <WorkflowStatus />}
        <div className="p-6 sm:p-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Extracted Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">AI-powered data extraction results.</p>
            </div>
            <div className="mt-4 divide-y divide-gray-200">
                <ResultItem 
                    label="Name" 
                    value={data.name} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                />
                <ResultItem 
                    label="Investment Amount" 
                    value={data.investment_amount} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a9 9 0 011.13-4.135a9 9 0 011.13-4.135m0 0a9 9 0 011.13-4.135m0 0a9 9 0 011.13-4.135M12 21v-3.75A1.5 1.5 0 0113.5 15h3a1.5 1.5 0 011.5 1.5V21m-4.5 0H12m0 0h-1.5m-1.5 0H9m-1.5 0H6.75m0 0H5.25m0 0H3.75M3 15h18" /></svg>}
                />
                 <ResultItem 
                    label="Address" 
                    value={data.address} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                 />
            </div>
        </div>

        <div className="bg-gray-50 px-6 sm:px-8 py-5 border-t border-gray-200">
             <h3 className="text-md font-semibold text-gray-900">Compliance Check</h3>
             <div className="mt-3">
                <ComplianceStatusIndicator status={data.complianceStatus} />
             </div>
        </div>

        {data.notificationEmail && (
            <div className="border-t border-gray-200 px-6 sm:px-8 py-5">
                <NotificationDisplay email={data.notificationEmail} status={data.complianceStatus} />
            </div>
        )}
    </div>
  );
};

// Add keyframes for the fade-in animation in a style tag for simplicity
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);