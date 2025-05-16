import React, { useState } from 'react';
import { Check, X, Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  name: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, name, accept, onChange, required }) => {
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        setFileName('');
        e.target.value = '';
        return;
      }

      setFileName(file.name);
      setError('');
      onChange(e);
    } else {
      setFileName('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
            error ? 'border-red-300' : fileName ? 'border-green-300' : 'border-gray-300'
          } border-dashed rounded-lg hover:border-blue-500 transition-colors`}
        >
          <div className="space-y-1 text-center">
            {fileName ? (
              <div className="flex items-center space-x-2">
                <Check className="h-6 w-6 text-green-500" />
                <span className="text-sm text-gray-600">{fileName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFileName('');
                    const input = document.querySelector(
                      `input[name="${name}"]`
                    ) as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name={name}
                      className="sr-only"
                      onChange={handleFileChange}
                      accept={accept}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{accept.split(',').join(' or ')} up to 10MB</p>
              </>
            )}
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
