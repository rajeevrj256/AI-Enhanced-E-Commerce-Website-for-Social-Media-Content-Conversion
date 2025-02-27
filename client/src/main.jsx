import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Header from './components/custom/Header';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FileUpload from './create-product/Fileupload';
import Edit from './product-edit/Edit';
import List from './product-list/list';
import View from './product-view/view';
import { Toaster } from './components/sonner';
//import CreateProduct from './create-product';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
   path: '/create-product',
  element: <FileUpload></FileUpload>,
  },
  {
    path: '/edit_Product/:product_id',
    element: <Edit></Edit>
  },
  {
    path:'/product_list',
    element:<List></List>
  },
  {
    path:'/view-product/:product_id',
    element: <View></View>
  }
 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <Toaster></Toaster>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);