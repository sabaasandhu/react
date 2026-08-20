import React from 'react';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#190019] via-[#2B124C] to-[#522B5B] text-white">

      {/* Trust badges */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6 px-6 pt-14 pb-10 border-b border-white/10">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="text-4xl">🚚</div>
          <h3 className="font-semibold text-lg">Free Shipping</h3>
          <p className="text-white/60 text-sm">Fast delivery all over Pakistan.</p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="text-4xl">💳</div>
          <h3 className="font-semibold text-lg">Secure Payment</h3>
          <p className="text-white/60 text-sm">Safe and trusted checkout.</p>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="text-4xl">⭐</div>
          <h3 className="font-semibold text-lg">Premium Quality</h3>
          <p className="text-white/60 text-sm">High quality fabrics &amp; stitching.</p>
        </div>
      </div>

      {/* Newsletter / signup */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-8">
        <span className="text-white/80">Register for free and get updates on new arrivals</span>
        <a
          href="/signup"
          className="inline-block rounded-full border border-white px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-[#2B124C] transition-colors"
        >
          Sign Up
        </a>
      </div>

      {/* Social icons */}
      <div className="flex justify-center gap-4 pb-8">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E4405F] text-white text-xl hover:opacity-80 transition-opacity"
        >
          <FaInstagram />
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white text-xl hover:opacity-80 transition-opacity"
        >
          <FaFacebookF />
        </a>

        <a
          href="https://www.tiktok.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white text-xl hover:opacity-80 transition-opacity"
        >
          <FaTiktok />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-white/70 py-4 bg-black/20">
        © {new Date().getFullYear()} YourWebsite 
      </div>

    </footer>
  );
};

export default Footer;
