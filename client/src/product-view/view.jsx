import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';

const View = () => {
  const { product_id } = useParams(); // Get the product_id from the URL
  const navigate = useNavigate(); // For navigation
  const [outputMessage, setOutputMessage] = useState({});
  const [uploading, setUploading] = useState(false);

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
        setOutputMessage(docSnap.data().ProductData || {});
      } else {
        console.log('No such Document');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setUploading(false);
    }
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const handleEditClick = () => {
    navigate(`/edit_Product/${product_id}`);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 p-6">
      {uploading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Left Side: Information Display with scroll */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md relative overflow-y-auto max-h-screen">
            {/* Edit Button */}
            <button
              onClick={handleEditClick}
              className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
            >
              Edit
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Information</h2>

            <div className="space-y-6">
              {/* Display Title */}
              {outputMessage.title && (
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">Title:</label>
                  <p className="text-gray-800 text-xl">{outputMessage.title}</p>
                </div>
              )}

              {/* Display Feature */}
              {outputMessage.feature && (
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">Feature:</label>
                  <p className="text-gray-800">{outputMessage.feature}</p>
                </div>
              )}

              {/* Display Other Data */}
              {Object.keys(outputMessage)
                .filter(
                  (key) => key !== 'title' && key !== 'feature' && key !== 'description' && key !== 'images'
                )
                .map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {capitalizeFirstLetter(key)}:
                    </label>
                    {Array.isArray(outputMessage[key]) ? (
                      <ul className="list-disc ml-6 text-gray-800">
                        {outputMessage[key].map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-800">{outputMessage[key]}</p>
                    )}
                  </div>
                ))}

              {/* Display Description */}
              {outputMessage.description && (
                <div>
                  <label className="block text-lg font-bold text-gray-900 mt-4">Description:</label>
                  <p className="text-gray-800">{outputMessage.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Image Display with scroll */}
          <div className="flex-1 overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {outputMessage.images && outputMessage.images.length > 0 ? (
                outputMessage.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl || '/default-image.jpg'}
                    alt={`Product ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                ))
              ) : (
                <img
                  src={outputMessage.imageUrl || '/default-image.jpg'}
                  alt="Product"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default View;
