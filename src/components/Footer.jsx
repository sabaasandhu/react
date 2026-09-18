import React from 'react';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#190019] via-[#2B124C] to-[#522B5B] text-white">
      
      {/* Trust badges — horizontal scroll on mobile, grid on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="text-3xl sm:text-4xl">🚚</div>
            <h3 className="font-semibold text-base sm:text-lg">Free Shipping</h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-[200px]">
              Fast delivery all over Pakistan.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <div className="text-3xl sm:text-4xl">💳</div>
            <h3 className="font-semibold text-base sm:text-lg">Secure Payment</h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-[200px]">
              Safe and trusted checkout.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <div className="text-3xl sm:text-4xl">⭐</div>
            <h3 className="font-semibold text-base sm:text-lg">Premium Quality</h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-[200px]">
              High quality fabrics &amp; stitching.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter — stacked on mobile, inline on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
          <span className="text-white/80 text-sm sm:text-base">
            Register for free and get updates on new arrivals
          </span>
          <a
            href="/signup"
            className="inline-block rounded-full border border-white px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-[#2B124C] transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>

      {/* Social icons */}
      <div className="flex justify-center gap-4 pb-6 sm:pb-8">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#E4405F] text-white text-lg sm:text-xl hover:opacity-80 transition-opacity"
        >
          <FaInstagram />
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1877F2] text-white text-lg sm:text-xl hover:opacity-80 transition-opacity"
        >
          <FaFacebookF />
        </a>

        <a
          href="https://www.tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black text-white text-lg sm:text-xl hover:opacity-80 transition-opacity"
        >
          <FaTiktok />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs sm:text-sm text-white/70 py-3 sm:py-4 bg-black/20">
        © {new Date().getFullYear()} YourWebsite
      </div>
    </footer>
  );
};

export default Footer;