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
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.prodSlice);
  const user = useSelector((state) => state.auth.user);  
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);
  const shareMenuRef = useRef(null);
  const sizeChartRef = useRef(null);
  const magnifierRef = useRef(null);

  // Product sizes with measurements
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
    { name: "Red", hex: "#FF0000" },
    { name: "Green", hex: "#008000" },
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

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => {
    setShowMagnifier(false);
    setImageLoaded(false);
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
    const text = `✨ Check out ${productBrand} ${productName} - Rs.${salePriceFunc(productPrice, productDiscount)}`;
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
    toast.success("📋 Link copied! Paste in Instagram story");
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setLinkCopied(true);
    toast.success("📋 Link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 3000);
    setShowShareMenu(false);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("🔒 Please login first!");
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("📏 Please select a size!");
      return;
    }

    if (!selectedColor) {
      toast.error("🎨 Please select a color!");
      return;
    }

    if (stock === 0) {
      toast.error("❌ Out of stock!");
      return;
    }

    if (!product || !product.id) {
      toast.error("❌ Product not found!");
      return;
    }

    try {
      toast.loading("🛒 Adding to cart...");
      await dispatch(addToCart(product.id, quantity));
      await dispatch(fetchCart());
      toast.dismiss();
      toast.success(`✅ Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.dismiss();
      toast.error("❌ Failed to add to cart!");
      console.error("Error:", error);
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "💔 Removed from wishlist" : "❤️ Added to wishlist");
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-4 border-teal-500 animate-spin border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaTshirt className="w-12 h-12 text-teal-600" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading product...</p>
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

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <MetaData title={product ? product.brand + " " + product.name : ""} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100">
          <Link to="/" className="text-gray-600 hover:text-teal-600 transition-colors flex items-center gap-1">
            <FaArrowLeft className="w-3 h-3" /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to={`/category/${category}`} className="text-gray-600 hover:text-teal-600 transition-colors">
            {category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-semibold truncate">{brand} {name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
              <div 
                className="relative aspect-square overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  ref={imgRef}
                  src={images && images[selectedImage] ? `${apis[2]}${images[selectedImage].image}` : "/placeholder.jpg"}
                  alt={`${name} - view ${selectedImage + 1}`}
                  className={`w-full h-full object-contain p-6 transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Skeleton Loader */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>
                  </div>
                )}

                {/* Magnifier */}
                {showMagnifier && images && images[selectedImage] && imgRef.current && (
                  <div
                    ref={magnifierRef}
                    className="absolute pointer-events-none w-64 h-64 border-4 border-white rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{
                      left: `calc(50% - 128px)`,
                      top: `calc(50% - 128px)`,
                      backgroundImage: `url('${apis[2]}${images[selectedImage].image}')`,
                      backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                      backgroundSize: `${imgRef.current.offsetWidth * 2.5}px ${imgRef.current.offsetHeight * 2.5}px`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}

                {/* Badges */}
                {onSale && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
                    <span className="animate-pulse">🔥</span> {discount}% OFF
                  </span>
                )}

                {gender && gender !== "unisex" && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
                    <GenderIcon className="w-4 h-4" />
                    {gender === "women" ? "Women" : "Men"}
                  </span>
                )}

                {stock === 0 && (
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-3xl font-bold text-white backdrop-blur-sm">
                    <span className="px-8 py-4 bg-red-500/80 rounded-2xl">Out of Stock</span>
                  </span>
                )}

                <button
                  onClick={toggleWishlist}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group"
                >
                  <FaHeart className={`w-6 h-6 transition-colors ${
                    isWishlist ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-400'
                  }`} />
                </button>
              </div>
            </div>

            {/* Thumbnails - Horizontal Scroll with Side Arrows */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-100">
                {images && images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl border-3 transition-all duration-300 overflow-hidden group ${
                      selectedImage === i
                        ? "border-teal-600 shadow-xl ring-4 ring-teal-100 scale-105"
                        : "border-gray-200 hover:border-teal-400 hover:shadow-lg"
                    }`}
                  >
                    <img
                      src={`${apis[2]}${img.image}`}
                      alt={`${name} thumbnail ${i + 1}`}
                      className="w-full h-full object-contain p-2 bg-white transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col gap-4">
            {/* Brand & Title */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
                  {brand}
                </span>
                {isUnstitch && (
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <FaRuler className="w-3 h-3" /> Unstitched
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="text-purple-700 text-sm bg-purple-50 px-3 py-1 rounded-full font-medium">
                  {category}
                </span>
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                  <span className="text-gray-600 text-sm ml-1">({rating})</span>
                </div>
              </div>
            </div>

            {/* Price & Rating */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-gray-600 font-medium">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      Rs.{salePriceFunc(price, discount || 0)}
                    </span>
                    {onSale && (
                      <span className="text-gray-400 line-through text-xl">
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
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                  <Rating rating={rating} />
                  <span className="text-gray-600 text-sm font-semibold">({rating})</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                {stock > 0 ? (
                  <>
                    <div className="relative">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></span>
                      <span className="w-3 h-3 bg-green-500 rounded-full relative"></span>
                    </div>
                    <div>
                      <p className="text-green-700 font-semibold">In Stock</p>
                      <p className="text-sm text-gray-600">{stock} items available</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <p className="text-red-600 font-medium">Out of stock</p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-3 text-lg">
                <span className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FaTshirt className="w-4 h-4 text-white" />
                </span>
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {description || "No description available."}
              </p>
            </div>

            {/* Color Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-3 text-lg">
                <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <FaPalette className="w-4 h-4 text-white" />
                </span>
                Select Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className="relative group"
                    title={color.name}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl transition-all duration-300 shadow-md ${
                        selectedColor === color.name 
                          ? "ring-4 ring-teal-600 ring-offset-2 scale-110" 
                          : "hover:scale-110 hover:shadow-lg"
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        border: color.hex === "#FFFFFF" ? "2px solid #e5e7eb" : "none"
                      }}
                    />
                    {selectedColor === color.name && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full p-1.5 shadow-lg">
                        <FaCheck className="w-3 h-3" />
                      </span>
                    )}
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 pointer-events-none">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
              {!selectedColor && (
                <p className="text-red-500 text-sm mt-3">⚠️ Please select a color</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-3 text-lg">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FaRuler className="w-4 h-4 text-white" />
                  </span>
                  Select Size
                </h3>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 rounded-xl hover:from-teal-100 hover:to-teal-200 transition-all font-medium flex items-center gap-2 text-sm"
                >
                  <FaChartBar /> Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-6 py-3 rounded-xl border-2 transition-all duration-300 font-semibold min-w-[80px]
                      ${selectedSize === size 
                        ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white border-teal-600 shadow-xl scale-105" 
                        : "bg-white text-gray-700 border-gray-300 hover:border-teal-500 hover:bg-teal-50"
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {!selectedSize && (
                <p className="text-red-500 text-sm mt-3">⚠️ Please select a size</p>
              )}
            </div>

            {/* Add to Cart Section */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl p-6 shadow-xl border-2 border-teal-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Counter */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-semibold">Qty:</span>
                  <div className="flex items-center bg-white rounded-xl border-2 border-teal-300 overflow-hidden shadow-md">
                    <button
                      onClick={dec}
                      className="px-4 py-3 text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-teal-500 hover:to-teal-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <div className="px-6 py-3 font-semibold bg-white border-x-2 border-teal-200 min-w-[80px] text-center text-lg">
                      {quantity}
                    </div>
                    <button
                      onClick={inc}
                      className="px-4 py-3 text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-200 hover:from-teal-500 hover:to-teal-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`
                    flex-1 px-8 py-4 rounded-xl font-bold text-lg
                    flex items-center justify-center gap-3
                    transition-all duration-300 transform
                    ${stock === 0
                      ? "bg-gray-300 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-teal-600 to-purple-700 text-white hover:from-teal-700 hover:to-purple-800 hover:scale-105 hover:shadow-2xl"
                    }
                  `}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  Add to Cart • Rs.{salePriceFunc(price, discount || 0)}
                </button>
              </div>
              
              {/* Selection Warnings */}
              {(!selectedSize || !selectedColor) && stock > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-xl text-center">
                  <p className="text-yellow-700 text-sm font-medium">
                    ⚠️ Please select {!selectedSize && !selectedColor ? 'size and color' : !selectedSize ? 'size' : 'color'} first
                  </p>
                </div>
              )}

              {/* Selected Options Summary */}
              {(selectedSize || selectedColor) && (
                <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-300 rounded-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-teal-800">✅ Selected:</span>
                    {selectedSize && (
                      <span className="px-3 py-1.5 bg-white border border-teal-400 rounded-full text-sm font-bold text-teal-700">
                        Size: {selectedSize}
                      </span>
                    )}
                    {selectedColor && (
                      <span className="px-3 py-1.5 bg-white border border-purple-400 rounded-full text-sm font-bold text-purple-700 flex items-center gap-2">
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
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 flex items-center gap-3 transition-all hover:shadow-lg">
                <FaTruck className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Free Shipping</h4>
                  <p className="text-xs text-gray-600">On orders above Rs.2000</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 flex items-center gap-3 transition-all hover:shadow-lg">
                <FaShieldAlt className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Secure Payment</h4>
                  <p className="text-xs text-gray-600">100% secure</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-100 flex items-center gap-3 transition-all hover:shadow-lg">
                <FaUndo className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-600">7 days return</p>
                </div>
              </div>
            </div>

            {/* Share & Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl"
                >
                  <FaShareAlt /> Share
                </button>

                {showShareMenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50 animate-slideDown">
                    <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-green-50 transition-colors">
                      <FaWhatsapp className="text-green-600 text-xl" /> WhatsApp
                    </button>
                    <button onClick={shareOnFacebook} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50 transition-colors">
                      <FaFacebook className="text-blue-600 text-xl" /> Facebook
                    </button>
                    <button onClick={shareOnInstagram} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50 transition-colors">
                      <FaInstagram className="text-pink-600 text-xl" /> Instagram
                    </button>
                    <button onClick={copyToClipboard} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-t transition-colors">
                      {linkCopied ? <FaCheck className="text-green-600" /> : <FaLink className="text-gray-600" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl flex-1 sm:flex-none justify-center"
              >
                <FaArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn">
          <div 
            ref={sizeChartRef}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
          >
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-purple-600 p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaRuler className="w-6 h-6" />
                {isUnstitch ? "📏 Fabric Length Guide" : "📊 Size Guide"}
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-all text-white"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {isUnstitch ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-50 to-purple-50">
                      <th className="border p-4 text-left font-bold text-gray-700">Size</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Length</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Width</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Fabric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(unstitchSizeChart).map(([size, data]) => (
                      <tr 
                        key={size} 
                        className={`hover:bg-gradient-to-r hover:from-teal-50 hover:to-purple-50 cursor-pointer transition-colors ${
                          selectedSize === size ? "bg-gradient-to-r from-teal-100 to-purple-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          toast.success(`Size ${size} selected`);
                        }}
                      >
                        <td className="border p-4 font-semibold">{size}</td>
                        <td className="border p-4">{data.length}"</td>
                        <td className="border p-4">{data.width}"</td>
                        <td className="border p-4">{data.fabric}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-50 to-purple-50">
                      <th className="border p-4 text-left font-bold text-gray-700">Size</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Bust</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Waist</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Hips</th>
                      <th className="border p-4 text-left font-bold text-gray-700">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sizeChartData).map(([size, data]) => (
                      <tr 
                        key={size} 
                        className={`hover:bg-gradient-to-r hover:from-teal-50 hover:to-purple-50 cursor-pointer transition-colors ${
                          selectedSize === size ? "bg-gradient-to-r from-teal-100 to-purple-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          toast.success(`Size ${size} selected`);
                        }}
                      >
                        <td className="border p-4 font-semibold">{size}</td>
                        <td className="border p-4">{data.bust}"</td>
                        <td className="border p-4">{data.waist}"</td>
                        <td className="border p-4">{data.hips}"</td>
                        <td className="border p-4">{data.length}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Quick Add to Cart in Modal */}
              <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t">
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={`
                    w-full px-8 py-4 rounded-2xl font-bold text-lg 
                    flex items-center justify-center gap-3
                    transition-all duration-300
                    ${stock === 0
                      ? "bg-gray-300 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-teal-600 to-purple-600 text-white hover:from-teal-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl"
                    }
                  `}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  {stock === 0 
                    ? "Out of Stock" 
                    : !selectedSize
                    ? "Select Size First" 
                    : !selectedColor
                    ? "Select Color First"
                    : `Add to Cart • Rs.${salePriceFunc(price, discount || 0)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default SingleProduct;