import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
  currentFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, currentFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileSelect(file || null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
        onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-[#0050A0] hover:bg-blue-50'} ${currentFile ? 'border-[#0050A0] bg-blue-50' : 'border-gray-300'}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center text-center">
        <svg className={`w-12 h-12 mb-4 ${currentFile ? 'text-[#0050A0]' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>

        {currentFile ? (
            <>
                <p className="font-semibold text-gray-800">{currentFile.name}</p>
                <p className="text-sm text-gray-500">({(currentFile.size / 1024).toFixed(2)} KB) - Click to change</p>
            </>
        ) : (
            <>
                <p className="mb-2 font-semibold text-gray-700">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF document only</p>
            </>
        )}
      </div>
    </div>
  );
};