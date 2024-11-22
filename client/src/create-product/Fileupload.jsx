import axios from 'axios';
import React, { useState } from 'react';
import { Button } from '../components/button';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';

const FileUpload = () => {
  const [file, setFile] = useState(null); // File state
  const [url, setUrl] = useState(''); // URL state
  const [fileSource, setFileSource] = useState('file'); // Default to file upload
  const [uploading, setUploading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/Error messages
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setMessage(''); // Clear any previous messages
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
        setMessage('Please select a valid image or video file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setMessage('');
  };

  const handleFileSourceChange = (e) => {
    setFileSource(e.target.value);
    setFile(null);
    setUrl('');
  };

  const handleUpload = async () => {
    if (fileSource === 'file' && !file) {
      setMessage('Please select a file to upload.');
      return;
    }
  
    if (fileSource === 'url' && (!url || !isValidUrl(url))) {
      setMessage('Please provide a valid URL.');
      return;
    }
  
    const formData = new FormData();
  
    if (fileSource === 'file') {
      formData.append('file', file);
    } else if (fileSource === 'url') {
      formData.append('url', url);
    }
    formData.append('fileSource', fileSource);
  
    try {
      setUploading(true);
      setMessage(''); // Clear previous messages
  
      if (user) {
        const response = await axios.post('http://localhost:5000/upload/aws_operations', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const parsedData = JSON.parse(response.data.generatedProductInfo);
        SaveData(parsedData, formData);
        setMessage('File uploaded successfully!');
      } else {
        alert('Please login first');
      }
    } catch (error) {
      console.error('File upload failed:', error.response ? error.response.data : error.message);
      setMessage('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  

  const SaveData = async (outputmessage,formData) => {
    try {
      console.log("savadataresoonsw",outputmessage);
      
      const docId = Date.now().toString();
      const outputmessagedata = typeof outputmessage === 'string' ? JSON.parse(outputmessage) : outputmessage;

      await setDoc(doc(db, "Ecommerce_Solution", docId), {
        userSelection: outputmessagedata,
        ProductData: outputmessagedata,
        userEmail: user?.id,
        id: docId,
      });
      console.log("save doc");

      navigate('/edit_Product/' + docId);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const isValidUrl = (string) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(string);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Upload Your File</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Upload Method:</label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="fileSource"
                value="file"
                checked={fileSource === 'file'}
                onChange={handleFileSourceChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Upload File</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="fileSource"
                value="url"
                checked={fileSource === 'url'}
                onChange={handleFileSourceChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Provide URL</span>
            </label>
          </div>
        </div>

        {fileSource === 'file' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select File:</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter File URL:</label>
            <input
              type="text"
              placeholder="https://example.com/file.jpg"
              value={url}
              onChange={handleUrlChange}
              className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {uploading ? 'Uploading...' : 'Generate'}
        </Button>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
