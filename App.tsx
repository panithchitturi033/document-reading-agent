import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Spinner } from './components/Spinner';
import { extractTextFromPdf } from './services/pdfService';
import { analyzeDocument, generateNotificationEmail } from './services/geminiService';
import { checkCompliance } from './services/complianceService';
import { ProcessedResult } from './types';
import { InfoCard } from './components/InfoCard';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processedResult, setProcessedResult] = useState<ProcessedResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setProcessedResult(null);
    setError(null);
    setShowWelcome(false);
  };

  const handleReset = () => {
    setFile(null);
    setProcessedResult(null);
    setError(null);
    setIsLoading(false);
    setShowWelcome(true);
  };

  const handleProcessDocument = useCallback(async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedResult(null);

    try {
      setLoadingMessage('Step 1/3: Extracting text from PDF...');
      const text = await extractTextFromPdf(file);

      if (!text || text.trim().length < 20) {
        throw new Error('Could not extract sufficient text from the PDF. The document might be empty, scanned as an image, or corrupted.');
      }

      setLoadingMessage('Step 2/3: AI is analyzing the document...');
      const extractedData = await analyzeDocument(text);
      
      setProcessedResult({ ...extractedData, complianceStatus: 'Checking', notificationEmail: null });
      setLoadingMessage('Step 2/3: Performing compliance check...');

      const complianceStatus = await checkCompliance(extractedData.name);
      
      if (complianceStatus === 'Approved' || complianceStatus === 'Flagged') {
        setLoadingMessage('Step 3/3: Drafting notification email...');
        const notificationEmail = await generateNotificationEmail(extractedData, complianceStatus);
        setProcessedResult({ ...extractedData, complianceStatus, notificationEmail });
      } else {
        // Fallback for unexpected compliance status
        setProcessedResult({ ...extractedData, complianceStatus, notificationEmail: null });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(err);
      setError(`Processing failed: ${errorMessage}`);
      setProcessedResult(null); // Clear partial results on error
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-3xl mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
          <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} currentFile={file} />
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleProcessDocument}
              disabled={!file || isLoading}
              className="group w-full sm:w-auto flex-grow inline-flex justify-center items-center gap-x-2 px-6 py-3 bg-[#0050A0] text-white font-semibold rounded-lg shadow-md hover:bg-[#004080] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0050A0] focus:ring-opacity-75"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.25l-.648-1.688a2.25 2.25 0 01-1.423-1.423L12.5 18.5l1.688-.648a2.25 2.25 0 011.423-1.423L17.5 15.75l.648 1.688a2.25 2.25 0 011.423 1.423L20.5 19.5l-1.688.648a2.25 2.25 0 01-1.423 1.423z" />
              </svg>
              {isLoading ? 'Processing...' : 'Process Document'}
            </button>
            {(file || processedResult || error) && (
                 <button
                 onClick={handleReset}
                 disabled={isLoading}
                 className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-200 border border-gray-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
               >
                 Reset
               </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          {isLoading && <Spinner message={loadingMessage} />}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg relative" role="alert">
              <p className="font-bold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          )}
          {processedResult && <ResultDisplay data={processedResult} />}
          {showWelcome && !processedResult && <InfoCard />}
        </div>
      </main>
    </div>
  );
}