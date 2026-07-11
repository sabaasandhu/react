import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Rating from "../../components/Rating";
import salePriceFunc from "../../helpers/Func.jsx";
import apis from "../../config/apis";
import { singleProduct } from "../../redux/actions/productActions";
import { addToCart, fetchCart } from "../../redux/actions/cartActions";
import MetaData from "../../components/MetaData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  FaWhatsapp, 
  FaFacebook, 
  FaInstagram, 
  FaLink, 
  FaCheck,
  FaRuler, 
  FaTshirt,
  FaPalette,
  FaChartBar,
  FaTimes,
  FaFemale,
  FaMale,
  FaShoppingCart,
  FaHeart,
  FaShareAlt,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaArrowLeft,
  FaMinus,
  FaPlus
} from "react-icons/fa";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.prodSlice);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const imgRef = useRef(null);
  const shareMenuRef = useRef(null);
  const sizeChartRef = useRef(null);

  const sizeChartData = {
    "Small": { bust: "34", waist: "28", hips: "36", length: "42" },
    "Medium": { bust: "36", waist: "30", hips: "38", length: "43" },
    "Large": { bust: "38", waist: "32", hips: "40", length: "44" },
    "XL": { bust: "40", waist: "34", hips: "42", length: "45" },
  };

  const unstitchSizeChart = {
    "1 Meter": { length: "36", width: "44", fabric: "1 Meter" },
    "1.5 Meter": { length: "54", width: "44", fabric: "1.5 Meter" },
    "2 Meter": { length: "72", width: "44", fabric: "2 Meter" },
    "2.5 Meter": { length: "90", width: "44", fabric: "2.5 Meter" },
    "3 Meter": { length: "108", width: "44", fabric: "3 Meter" }
  };

  const availableColors = [
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Yellow", hex: "#FFD700" },
  ];

  useEffect(() => {
    dispatch(singleProduct(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShowShareMenu(false);
      }
      if (sizeChartRef.current && !sizeChartRef.current.contains(e.target)) {
        setShowSizeChart(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    setShowMagnifier(true);
    setIsHover(true);
  };
  
  const handleMouseLeave = () => {
    setShowMagnifier(false);
    setIsHover(false);
  };
  
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMagnifierPosition({ x, y });
  };

  const shareOnWhatsApp = () => {
    const productName = product ? product.name : '';
    const productBrand = product ? product.brand : '';
    const productPrice = product ? product.price : 0;
    const productDiscount = product && product.discount ? product.discount : 0;
    const text = `Check out ${productBrand} ${productName} - Rs.${salePriceFunc(productPrice, productDiscount)}`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnInstagram = () => {
    copyToClipboard();
    toast.success("Link copied! Paste in Instagram story");
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setLinkCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 3000);
    setShowShareMenu(false);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color!");
      return;
    }

    if (stock === 0) {
      toast.error("Out of stock!");
      return;
    }

    try {
      toast.loading("Adding to cart...");
      await dispatch(addToCart(product.id, quantity));
      await dispatch(fetchCart());
      toast.dismiss();
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to add to cart!");
      console.error("Error:", error);
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const {
    name,
    brand,
    price,
    category,
    rating,
    discount,
    stock,
    onSale,
    images,
    description,
    gender = "unisex"
  } = product;

  function inc() {
    setQuantity((q) => Math.min(stock, q + 1));
  }

  function dec() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  const isUnstitch = category ? category.toLowerCase().includes("unstitch") : false;
  const sizes = isUnstitch ? Object.keys(unstitchSizeChart) : Object.keys(sizeChartData);
  const GenderIcon = gender === "women" ? FaFemale : gender === "men" ? FaMale : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaData title={product ? product.brand + " " + product.name : ""} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 bg-white p-3 rounded-lg shadow-sm">
          <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to={`/category/${category}`} className="text-gray-600 hover:text-teal-600 transition-colors">
            {category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-semibold truncate">{brand} {name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div 
                className="relative aspect-square"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  ref={imgRef}
                  src={images && images[selectedImage] ? `${apis[2]}${images[selectedImage].image}` : '/placeholder.jpg'}
                  alt={name}
                  className={`w-full h-full object-contain p-4 transition-transform duration-300 ${
                    isHover ? "scale-105" : "scale-100"
                  }`}
                />

                {/* Magnifier */}
                {showMagnifier && images && images[selectedImage] && imgRef.current && (
                  <div
                    className="absolute pointer-events-none w-48 h-48 border-2 border-white rounded-lg overflow-hidden shadow-xl"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundImage: `url('${apis[2]}${images[selectedImage].image}')`,
                      backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                      backgroundSize: `${imgRef.current.offsetWidth * 2}px ${imgRef.current.offsetHeight * 2}px`,
                      backgroundRepeat: 'no-repeat',
                      zIndex: 50,
                    }}
                  />
                )}

                {/* Badges */}
                {onSale && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md z-10">
                    -{discount}% Off
                  </div>
                )}

                {stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}

                <button
                  onClick={toggleWishlist}
                  className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaHeart className={`w-5 h-5 ${isWishlist ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images && images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                    selectedImage === i
                      ? "border-teal-600 shadow-md"
                      : "border-gray-200 hover:border-teal-400"
                  }`}
                >
                  <img
                    src={`${apis[2]}${img.image}`}
                    alt={`${name} thumbnail ${i + 1}`}
                    className="w-full h-full object-contain p-1 bg-white"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-4">
            {/* Brand & Title */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  {brand}
                </span>
                {isUnstitch && (
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <FaRuler className="w-3 h-3" /> Unstitched
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  {category}
                </span>
                <div className="flex items-center gap-1">
                  <Rating rating={rating} />
                  <span className="text-gray-600 text-sm">({rating})</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">
                  Rs.{salePriceFunc(price, discount || 0)}
                </span>
                {onSale && (
                  <span className="text-gray-400 line-through text-lg">
                    Rs.{price}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {stock > 0 ? (
                  <>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-700 font-semibold">In Stock</span>
                    <span className="text-gray-600 text-sm">({stock} items available)</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-medium">Out of stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaTshirt className="text-teal-600" /> Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {description || "No description available."}
              </p>
            </div>

            {/* Color Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaPalette className="text-pink-600" /> Select Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className="relative group"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg transition-all duration-300 shadow-sm ${
                        selectedColor === color.name 
                          ? "ring-2 ring-teal-600 ring-offset-2 scale-110" 
                          : "hover:scale-110"
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        border: color.hex === "#FFFFFF" ? "2px solid #e5e7eb" : "none"
                      }}
                    />
                    {selectedColor === color.name && (
                      <span className="absolute -top-1 -right-1 bg-teal-600 text-white rounded-full p-1">
                        <FaCheck className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              {!selectedColor && (
                <p className="text-red-500 text-sm mt-3">Please select a color</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaRuler className="text-blue-600" /> Select Size
                </h3>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                  <FaChartBar /> Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-5 py-2.5 rounded-lg border-2 transition-all duration-300 font-semibold text-sm
                      ${selectedSize === size 
                        ? "bg-teal-600 text-white border-teal-600 shadow-md" 
                        : "bg-white text-gray-700 border-gray-300 hover:border-teal-500 hover:bg-teal-50"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {!selectedSize && (
                <p className="text-red-500 text-sm mt-3">Please select a size</p>
              )}
            </div>

            {/* Add to Cart */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-teal-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-semibold">Qty:</span>
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-300">
                    <button
                      onClick={dec}
                      className="px-3 py-2 text-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <div className="px-4 py-2 font-semibold min-w-[50px] text-center">
                      {quantity}
                    </div>
                    <button
                      onClick={inc}
                      className="px-3 py-2 text-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={quantity >= stock}
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`
                    flex-1 px-6 py-3 rounded-lg font-semibold
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${stock === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                    }
                  `}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Add to Cart • Rs.{salePriceFunc(price, discount || 0)}
                </button>
              </div>
              
              {/* Warnings */}
              {(!selectedSize || !selectedColor) && stock > 0 && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
                  <p className="text-yellow-700 text-sm font-medium">
                    Please select {!selectedSize && !selectedColor ? 'size and color' : !selectedSize ? 'size' : 'color'}
                  </p>
                </div>
              )}
            </div>

            {/* Selected Options */}
            {(selectedSize || selectedColor) && (
              <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-teal-800">Selected:</span>
                  {selectedSize && (
                    <span className="px-3 py-1 bg-white border border-teal-300 rounded-full text-sm font-bold text-teal-700">
                      Size: {selectedSize}
                    </span>
                  )}
                  {selectedColor && (
                    <span className="px-3 py-1 bg-white border border-purple-300 rounded-full text-sm font-bold text-purple-700 flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: availableColors.find(c => c.name === selectedColor)?.hex || '#000' 
                        }}
                      />
                      Color: {selectedColor}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <FaTruck className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-800">Free Shipping</p>
                <p className="text-xs text-gray-600">Above Rs.2000</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <FaShieldAlt className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-800">Secure Payment</p>
                <p className="text-xs text-gray-600">100% secure</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                <FaUndo className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-800">Easy Returns</p>
                <p className="text-xs text-gray-600">7 days</p>
              </div>
            </div>

            {/* Share & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-semibold text-sm"
                >
                  <FaShareAlt /> Share
                </button>

                {showShareMenu && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border overflow-hidden z-50">
                    <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors">
                      <FaWhatsapp className="text-green-600" /> WhatsApp
                    </button>
                    <button onClick={shareOnFacebook} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                      <FaFacebook className="text-blue-600" /> Facebook
                    </button>
                    <button onClick={shareOnInstagram} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors">
                      <FaInstagram className="text-pink-600" /> Instagram
                    </button>
                    <button onClick={copyToClipboard} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-t transition-colors">
                      {linkCopied ? <FaCheck className="text-green-600" /> : <FaLink className="text-gray-600" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold text-sm flex items-center gap-2"
              >
                <FaArrowLeft className="w-3 h-3" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={sizeChartRef}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-teal-600 p-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaRuler /> {isUnstitch ? "Fabric Length Guide" : "Size Guide"}
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isUnstitch ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="border p-3 text-left text-sm font-bold">Size</th>
                      <th className="border p-3 text-left text-sm font-bold">Length</th>
                      <th className="border p-3 text-left text-sm font-bold">Width</th>
                      <th className="border p-3 text-left text-sm font-bold">Fabric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(unstitchSizeChart).map(([size, data]) => (
                      <tr 
                        key={size} 
                        className={`hover:bg-teal-50 cursor-pointer transition-colors ${
                          selectedSize === size ? "bg-teal-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          toast.success(`Size ${size} selected`);
                        }}
                      >
                        <td className="border p-3 font-semibold text-sm">{size}</td>
                        <td className="border p-3 text-sm">{data.length}"</td>
                        <td className="border p-3 text-sm">{data.width}"</td>
                        <td className="border p-3 text-sm">{data.fabric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="border p-3 text-left text-sm font-bold">Size</th>
                      <th className="border p-3 text-left text-sm font-bold">Bust</th>
                      <th className="border p-3 text-left text-sm font-bold">Waist</th>
                      <th className="border p-3 text-left text-sm font-bold">Hips</th>
                      <th className="border p-3 text-left text-sm font-bold">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sizeChartData).map(([size, data]) => (
                      <tr 
                        key={size} 
                        className={`hover:bg-teal-50 cursor-pointer transition-colors ${
                          selectedSize === size ? "bg-teal-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          toast.success(`Size ${size} selected`);
                        }}
                      >
                        <td className="border p-3 font-semibold text-sm">{size}</td>
                        <td className="border p-3 text-sm">{data.bust}"</td>
                        <td className="border p-3 text-sm">{data.waist}"</td>
                        <td className="border p-3 text-sm">{data.hips}"</td>
                        <td className="border p-3 text-sm">{data.length}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;