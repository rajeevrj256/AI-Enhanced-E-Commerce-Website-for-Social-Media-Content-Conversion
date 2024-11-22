import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/services/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const List = () => {
  const navigation = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    GetUserProduct();
  }, []);

  const GetUserProduct = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigation('/');
      return;
    }

    const q = query(
      collection(db, 'Ecommerce_Solution'),
      where('userEmail', '==', user?.id)
    );
    const querySnapshot = await getDocs(q);
    const fetchedProducts = [];

    querySnapshot.forEach((doc) => {
      fetchedProducts.push({ id: doc.id, ...doc.data() }); // Include the document id
    });

    setProducts(fetchedProducts);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {products.map((prod) => (
          <Link
            key={prod.id}
            to={`/view-product/${prod.id}`} 
            className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <h3 className="text-lg font-semibold mb-4">{prod.ProductData?.title}</h3>
            <img
              src={prod.ProductData?.images?.[0] || '/default-image.jpg'}
              alt={prod.ProductData?.title}
              className="w-full h-48 object-cover mb-4 rounded"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
 
export default List;
