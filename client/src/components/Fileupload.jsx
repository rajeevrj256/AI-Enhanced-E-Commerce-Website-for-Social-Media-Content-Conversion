import axios from 'axios';
import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null); // File state
  const [url, setUrl] = useState(''); // URL state
  const [fileSource, setFileSource] = useState('file'); // Default to file upload
  const [uploading, setUploading] = useState(false); // Loading state
  const [message, setMessage] = useState(''); // Success/Error messages

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
    setFile(null); // Clear file if switching to URL option
    setUrl(''); // Clear URL if switching to file option
  };

  const handleUpload = async () => {
    if (fileSource === 'file' && !file) {
      setMessage('Please select a file to upload.');
      return;
    }

    if (fileSource === 'url' && !url) {
      setMessage('Please provide a URL.');
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
      setMessage('');

      const response = await axios.post('http://localhost:5000/upload/aws_operations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded successfully!');
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('File upload failed:', error.response ? error.response.data : error.message);
      setMessage('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload Your File</h2>
      
      <div>
        <label>
          <input
            type="radio"
            name="fileSource"
            value="file"
            checked={fileSource === 'file'}
            onChange={handleFileSourceChange}
          />
          Upload File
        </label>
        <label>
          <input
            type="radio"
            name="fileSource"
            value="url"
            checked={fileSource === 'url'}
            onChange={handleFileSourceChange}
          />
          Provide URL
        </label>
      </div>

      {fileSource === 'file' ? (
        <>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*" // Restrict file types to images and videos
          />
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter file URL"
            value={url}
            onChange={handleUrlChange}
          />
        </>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>} {/* Display message */}
    </div>
  );
};

export default FileUpload;
