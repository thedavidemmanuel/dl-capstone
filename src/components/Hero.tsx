"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faLock } from '@fortawesome/free-solid-svg-icons';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="relative pt-20 pb-8 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              {/* Main Heading */}
              <h1 className="font-inter font-semibold text-4xl leading-tight text-black mb-4 max-w-xl">
                Digital Driver&apos;s License <span className="bg-gradient-to-r from-[#2C8E5D] to-[#144CBB] bg-clip-text text-transparent">Verification System</span> for Burundi
              </h1>
              
              {/* Description */}
              <p className="font-inter font-normal text-lg leading-7 text-black text-justify mb-6 max-w-lg">
                A secure, digital platform for applying, managing, and verifying driver&apos;s licenses in Burundi. 
                Built with modern technology for transparency and efficiency.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                {/* Apply Now Button */}
                <Link 
                  href="/apply"
                  className="inline-flex items-center justify-center w-40 h-12 bg-gradient-to-b from-[#2C8E5D] to-[#144CBB] rounded-lg font-inter font-normal text-xl leading-snug text-white hover:opacity-90 transition-opacity duration-200"
                >
                  Apply Now
                </Link>
                
                {/* Learn More Button */}
                <Link 
                  href="/about"
                  className="inline-flex items-center justify-center w-44 h-12 border border-black rounded-lg font-inter font-normal text-xl leading-snug text-black hover:bg-gray-50 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
              
              {/* Features */}
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                {/* Government Approved */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={faShield} 
                    className="w-5 h-5 text-[#2C8E5D]" 
                  />
                  <span className="font-inter font-normal text-base leading-4 text-black">
                    Government Approved
                  </span>
                </div>
                
                {/* Secure & Fast */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="w-5 h-5 text-[#144CBB]" 
                  />
                  <span className="font-inter font-normal text-base leading-4 text-black">
                    Secure & Fast
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <div className="relative">
                <div className="mx-auto w-[424px] h-[424px] relative">
                  <Image
                    src="/dlv-hero.png"
                    alt="Digital License Verification Hero"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent opacity-50 -z-10"></div>
    </section>
  );
};

export default Hero;