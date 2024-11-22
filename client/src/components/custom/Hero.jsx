import React from 'react';
import { Button } from '../button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-col items-center max-w-4xl bg-white shadow-2xl rounded-3xl p-8 sm:p-12 gap-8">
        {/* Heading */}
        <h1 className="font-extrabold text-[28px] sm:text-[36px] lg:text-[48px] text-center leading-snug tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7e5f] to-[#feb47b]">
          Transform Social Media Into Shopping Opportunities:
          </span>
          <br />
          <span className="text-gray-800">Effortless Product Listing Creation for Amazon Sellers</span>
        </h1>
        {/* Subheading */}
        <p className="text-md sm:text-lg lg:text-xl text-center text-[#4a4e69] font-medium">
        Develop a system that seamlessly converts social media content into comprehensive Amazon product listings, empowering buyers to compare and purchase products with ease.
        </p>
        {/* Button */}
        <Link to={'/create-product'}>
          <Button className="px-8 py-3 bg-[#ff7e5f] hover:bg-[#e06755] text-white text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-200">
            Get Started, It's Free
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
