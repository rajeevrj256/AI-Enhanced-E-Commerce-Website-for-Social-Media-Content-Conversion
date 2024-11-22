import { db } from '@/services/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
  const { product_id } = useParams();
  const [outputmessage, setOutputmessage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetProductData();
  }, [product_id]);

  const GetProductData = async () => {
    setUploading(true);
    try {
      const docRef = doc(db, 'Ecommerce_Solution', product_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Doc', docSnap.data());
        const data = docSnap.data().ProductData || {};
        setOutputmessage(data);
        setImages(data.images || []);
      } else {
        console.log('No such Document');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEditChange = (e, key, index) => {
    const value = e.target.value;
    setOutputmessage((prev) => {
      const updatedOutputMessage = { ...prev };
      if (Array.isArray(updatedOutputMessage[key])) {
        updatedOutputMessage[key][index] = value;
      } else if (typeof updatedOutputMessage[key] === 'object') {
        updatedOutputMessage[key][index] = value;
      } else {
        updatedOutputMessage[key] = value;
      }
      return updatedOutputMessage;
    });
  };

  const handleDeleteItem = (key, index) => {
    setOutputmessage((prev) => {
      const updatedOutputMessage = { ...prev };
      updatedOutputMessage[key].splice(index, 1);
      return updatedOutputMessage;
    });
  };

  const handleAddItem = (key) => {
    setOutputmessage((prev) => {
      const updatedOutputMessage = { ...prev };
      if (Array.isArray(updatedOutputMessage[key])) {
        updatedOutputMessage[key].push('');
      }
      return updatedOutputMessage;
    });
  };

  // Cloudinary Photo Upload
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('You can upload up to 10 photos only.');
      return;
    }

    const uploadedPhotos = await Promise.all(
      files.map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Ecommerce_sol");
        data.append("cloud_name", "dliprxpsf");

        try {
          const res = await fetch("https://api.cloudinary.com/v1_1/dliprxpsf/image/upload", { method: "POST", body: data });
          const result = await res.json();
          return result.secure_url; 
        } catch (error) {
          console.error("Photo upload failed:", error);
          alert("Failed to upload a photo. Please try again.");
          return null;
        }
      })
    );

    // Filter out any null URLs in case upload fails
    const validPhotos = uploadedPhotos.filter((url) => url !== null);
    setImages((prevImages) => [...prevImages, ...validPhotos]);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      const docRef = doc(db, 'Ecommerce_Solution', product_id);
      await updateDoc(docRef, {
        ProductData: { ...outputmessage, images },
      });
      navigate('/view-product/' + product_id);
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setUploading(false);
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex space-x-12">
      {/* Left Section: Form with scrollable container */}
      <div className="w-1/2 p-6 bg-white shadow-lg rounded-lg overflow-y-auto" style={{ maxHeight: '80vh' }}>
        {uploading ? (
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4A8 8 0 004 12z"></path>
            </svg>
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generated Data</h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Title:</label>
                <input
                  type="text"
                  value={outputmessage.title || ""}
                  onChange={(e) => handleEditChange(e, "title")}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Feature */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Features:</label>
                <input
                  type="text"
                  value={outputmessage.features || ""}
                  onChange={(e) => handleEditChange(e, "features")}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Other Fields */}
              {Object.keys(outputmessage)
                .filter(
                  (key) => key !== "title" && key !== "features" && key !== "description" && key !== "images"
                )
                .map((key, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">
                      {capitalizeFirstLetter(key)}:
                    </label>
                    <input
                      type="text"
                      value={outputmessage[key] || ""}
                      onChange={(e) => handleEditChange(e, key)}
                      className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  value={outputmessage.description || ""}
                  onChange={(e) => handleEditChange(e, "description")}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add/Delete Buttons */}
              <button onClick={() => handleAddItem("key")} className="mt-2 text-blue-600 hover:text-blue-800">
                Add Item
              </button>
              <button onClick={() => handleDeleteItem("key", 0)} className="mt-2 ml-4 text-red-600 hover:text-red-800">
                Delete
              </button>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Right Section: Images Preview */}
      <div className="w-1/2 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Images</h2>
        <div className="grid grid-cols-2 gap-4">
          {images.length > 0 ? (
            images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt={`Uploaded ${index}`} className="w-full h-32 object-cover rounded-md" />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No images uploaded.</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Upload Photos (Max 10):</label>
          <input
            type="file"
            multiple
            onChange={handlePhotoUpload}
            className="mt-2 px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Edit;
