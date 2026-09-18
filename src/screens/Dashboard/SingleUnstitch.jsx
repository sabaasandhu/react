import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import salePriceFunc from "../../helpers/Func.jsx";
import { singleUnstitch } from "../../redux/actions/productActions";
import { addToCart, fetchCart } from "../../redux/actions/cartActions";
import MetaData from "../../components/MetaData";
import toast from "react-hot-toast";
import {
  FaWhatsapp, FaFacebook, FaInstagram, FaLink, FaCheck,
  FaRuler, FaTshirt, FaChartBar, FaTimes, FaShoppingCart,
  FaHeart, FaShareAlt, FaTruck, FaShieldAlt, FaUndo,
  FaStar, FaStarHalfAlt, FaRegStar, FaExpand, FaMinus, FaPlus,
} from "react-icons/fa";

const SIZE_CHART = {
  "1 Meter": { length: "36", width: "44", fabric: "1 Meter" },
  "1.5 Meter": { length: "54", width: "44", fabric: "1.5 Meter" },
  "2 Meter": { length: "72", width: "44", fabric: "2 Meter" },
  "2.5 Meter": { length: "90", width: "44", fabric: "2.5 Meter" },
  "3 Meter": { length: "108", width: "44", fabric: "3 Meter" },
};

const SingleUnstitch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.prodSlice);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imgRef = useRef(null);
  const shareMenuRef = useRef(null);
  const sizeChartRef = useRef(null);

  useEffect(() => {
    dispatch(singleUnstitch(id));
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedSize("");
    setSelectedImage(0);
    setQuantity(1);
    setImageLoaded(false);
  }, [id]);

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

  const MAGNIFIER_SIZE = 180;

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - left;
    const relY = e.clientY - top;
    setMagnifierPosition({ x: (relX / width) * 100, y: (relY / height) * 100 });
    const half = MAGNIFIER_SIZE / 2;
    setCursorPosition({
      x: Math.min(Math.max(relX, half), width - half),
      y: Math.min(Math.max(relY, half), height - half),
    });
  };

  const shareOnWhatsApp = () => {
    const text = `Check out ${product.brand} ${product.name} - Rs.${salePriceFunc(product.price, product.discount)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnInstagram = () => {
    copyToClipboard();
    toast.success("Link copied! Paste in Instagram story");
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
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
    if (!product?.stock) {
      toast.error("Out of stock!");
      return;
    }
    try {
      setAddingToCart(true);
      await dispatch(addToCart(product.id, quantity, "unstitch"));
      await dispatch(fetchCart());
      toast.success(`Added ${quantity} item(s) to cart`);
      setShowSizeChart(false);
    } catch (error) {
      toast.error("Failed to add to cart!");
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-amber-800 dark:text-amber-200 font-medium mt-6 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  const { name, brand, price, category, rating, discount, stock, onSale, images, description } = product;
  const inc = () => setQuantity((q) => Math.min(stock, q + 1));
  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const sizes = Object.keys(SIZE_CHART);
  const readyToAdd = stock > 0 && Boolean(selectedSize);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} className="text-amber-500" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" className="text-amber-500" />);
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-300" />);
    return stars;
  };

  const getImageUrl = (img) => (!img || !img.image ? "/placeholder.jpg" : img.image);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-rose-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700">
          <Link to="/" className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium">Home</Link>
          <span className="text-amber-300">▸</span>
          <Link to={`/category/${category?.toLowerCase() || ""}`} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium capitalize">{category}</Link>
          <span className="text-amber-300">▸</span>
          <span className="text-amber-800 dark:text-amber-200 font-semibold truncate max-w-[200px]">{brand} {name}</span>
        </nav>

        <MetaData title={`${brand} ${name}`} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {images && images.length > 1 && (
              <div className="hidden sm:flex sm:flex-col gap-3 w-full sm:w-24 flex-shrink-0">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setSelectedImage(i); setImageLoaded(false); }}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 transition-all overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl ${selectedImage === i ? "border-amber-600 ring-4 ring-amber-100 scale-105" : "border-amber-200/50 hover:border-amber-400 hover:scale-105"}`}>
                    <img src={getImageUrl(img)} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-contain p-2" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-amber-100/30 via-white to-orange-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 dark:border-gray-700 group"
                onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                  </div>
                )}
                <img ref={imgRef} src={getImageUrl(images?.[selectedImage])} alt={name}
                  className={`w-full h-full object-contain p-4 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setImageLoaded(true)} />

                {showMagnifier && images?.[selectedImage] && imageLoaded && (
                  <div className="hidden sm:block absolute pointer-events-none rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      width: `${MAGNIFIER_SIZE}px`, height: `${MAGNIFIER_SIZE}px`,
                      left: `${cursorPosition.x - MAGNIFIER_SIZE / 2}px`, top: `${cursorPosition.y - MAGNIFIER_SIZE / 2}px`,
                      backgroundImage: `url('${getImageUrl(images[selectedImage])}')`,
                      backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                      backgroundSize: `${imgRef.current ? imgRef.current.offsetWidth * 2.5 : 0}px ${imgRef.current ? imgRef.current.offsetHeight * 2.5 : 0}px`,
                      border: "3px solid white", boxShadow: "0 0 0 3px #f59e0b, 0 20px 40px -10px rgba(0,0,0,0.4)", zIndex: 50,
                    }} />
                )}

                {!showMagnifier && (
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaExpand className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                )}

                {onSale && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2">
                    <span className="animate-pulse">⚡</span> Sale {discount}% OFF
                  </div>
                )}

                <button onClick={toggleWishlist}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-all group">
                  <FaHeart className={`w-5 h-5 transition-colors ${isWishlist ? "text-rose-500" : "text-gray-400 group-hover:text-rose-500"}`} />
                </button>

                {stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                    <div className="bg-white/95 dark:bg-gray-800/95 px-8 py-6 rounded-2xl shadow-2xl">
                      <p className="text-red-600 dark:text-red-400 font-bold text-2xl">Out of Stock</p>
                    </div>
                  </div>
                )}
              </div>

              {images && images.length > 1 && (
                <div className="flex sm:hidden gap-3 overflow-x-auto pb-2 px-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => { setSelectedImage(i); setImageLoaded(false); }}
                      className={`flex-shrink-0 w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden bg-white dark:bg-gray-800 shadow-md ${selectedImage === i ? "border-amber-600 ring-2 ring-amber-100" : "border-amber-200/50 hover:border-amber-400"}`}>
                      <img src={getImageUrl(img)} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-contain p-1.5" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-5">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 px-4 py-2 rounded-2xl border border-amber-200 dark:border-gray-600">{brand}</span>
                {stock > 0 && (
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    In Stock
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-amber-900 dark:text-white mt-2 leading-tight">{name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-amber-700 dark:text-amber-300 text-sm bg-amber-50 dark:bg-gray-700 px-4 py-2 rounded-2xl font-medium border border-amber-200 dark:border-gray-600 capitalize flex items-center gap-2">
                  <FaTshirt className="w-3.5 h-3.5" /> {category}
                </span>
                <span className="text-orange-700 dark:text-orange-300 text-sm bg-orange-50 dark:bg-gray-700 px-4 py-2 rounded-2xl font-medium border border-orange-200 dark:border-gray-600 flex items-center gap-2">
                  <FaRuler className="w-3.5 h-3.5" /> Unstitched
                </span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Price</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-3xl font-bold text-amber-700 dark:text-amber-400">Rs.{salePriceFunc(price, discount || 0)}</span>
                    {onSale && <span className="text-gray-400 line-through text-xl">Rs.{price}</span>}
                  </div>
                  {discount > 0 && (
                    <span className="inline-block bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-2xl text-sm font-bold mt-2 border border-emerald-200 dark:border-emerald-700">
                      Save {discount}% 🔥
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-gray-700 px-4 py-2 rounded-2xl border border-amber-200 dark:border-gray-600">
                    <div className="flex gap-0.5">{renderStars(rating)}</div>
                    <span className="text-amber-800 dark:text-amber-200 font-bold ml-1">({rating})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100 dark:border-gray-700">
              <h3 className="font-bold text-amber-900 dark:text-white mb-3 flex items-center gap-3 text-lg">
                <span className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaTshirt className="w-5 h-5 text-white" />
                </span>
                Product Description
              </h3>
              <p className="text-amber-800/80 dark:text-gray-300 leading-relaxed">{description || "No description available."}</p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-amber-900 dark:text-white flex items-center gap-2">
                  <span className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaRuler className="w-5 h-5 text-white" />
                  </span>
                  Select Size
                </h3>
                <button onClick={() => setShowSizeChart(!showSizeChart)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 text-amber-700 dark:text-amber-300 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all font-medium flex items-center gap-2 text-sm border border-amber-200 dark:border-gray-600">
                  <FaChartBar className="w-4 h-4" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold min-w-[80px] ${selectedSize === size ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-600 shadow-lg scale-105" : "bg-white dark:bg-gray-700 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-gray-600 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-gray-600"}`}>
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-gray-700 border border-amber-200 dark:border-gray-600 rounded-2xl">
                  <p className="text-amber-700 dark:text-amber-300 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Please select a size to continue
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-amber-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-amber-900 dark:text-white font-bold">Qty:</span>
                  <div className="flex items-center bg-white dark:bg-gray-700 rounded-2xl border-2 border-amber-200 dark:border-gray-600 overflow-hidden">
                    <button onClick={dec} disabled={quantity <= 1} className="px-4 py-3 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white transition-all disabled:opacity-40"><FaMinus className="w-4 h-4" /></button>
                    <div className="px-6 py-3 font-bold bg-amber-50 dark:bg-gray-800 border-x-2 border-amber-200 dark:border-gray-600 min-w-[60px] text-center text-amber-900 dark:text-white">{quantity}</div>
                    <button onClick={inc} disabled={quantity >= stock} className="px-4 py-3 text-amber-600 dark:text-amber-400 hover:bg-amber-600 hover:text-white transition-all disabled:opacity-40"><FaPlus className="w-4 h-4" /></button>
                  </div>
                </div>
                <button onClick={handleAddToCart} disabled={!readyToAdd || addingToCart}
                  className={`flex-1 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all text-lg ${!readyToAdd ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-[1.02]"}`}>
                  <FaShoppingCart className="w-5 h-5" />
                  {stock === 0 ? "Out of Stock" : addingToCart ? "Adding..." : `Add to Cart • Rs.${salePriceFunc(price, discount || 0)}`}
                </button>
              </div>
            </div>

            {selectedSize && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 border border-amber-200 dark:border-gray-600 rounded-2xl shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-amber-800 dark:text-amber-200">✓ Selected:</span>
                  <span className="px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-gray-600 rounded-2xl text-sm font-bold text-amber-700 dark:text-amber-300">Size: {selectedSize}</span>
                  <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Qty: {quantity}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: FaTruck, title: "Free Shipping", desc: "On orders above Rs.2000", color: "amber" },
                { icon: FaShieldAlt, title: "Secure Payment", desc: "100% secure", color: "emerald" },
                { icon: FaUndo, title: "Easy Returns", desc: "7 days return", color: "blue" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100 dark:border-gray-700 flex items-center gap-3 hover:shadow-xl transition-all hover:scale-105">
                  <div className={`w-12 h-12 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-amber-600/70 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="relative" ref={shareMenuRef}>
                <button onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all flex items-center gap-3 font-bold shadow-lg">
                  <FaShareAlt className="w-5 h-5" /> Share
                </button>
                {showShareMenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-amber-100 dark:border-gray-700 overflow-hidden z-50">
                    <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white">
                      <FaWhatsapp className="text-green-600 text-xl" /> WhatsApp
                    </button>
                    <button onClick={shareOnFacebook} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white">
                      <FaFacebook className="text-blue-600 text-xl" /> Facebook
                    </button>
                    <button onClick={shareOnInstagram} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white">
                      <FaInstagram className="text-pink-600 text-xl" /> Instagram
                    </button>
                    <button onClick={copyToClipboard} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-amber-100 dark:border-gray-700 transition-colors text-gray-800 dark:text-white">
                      {linkCopied ? <FaCheck className="text-emerald-600" /> : <FaLink className="text-gray-600 dark:text-gray-400" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              <Link to="/" className="px-6 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-amber-700 dark:text-amber-300 rounded-2xl hover:bg-amber-50 dark:hover:bg-gray-700 transition-all font-bold flex items-center gap-3 shadow-lg border border-amber-200 dark:border-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div ref={sizeChartRef} className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-100 dark:border-gray-700">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaRuler className="w-6 h-6" /> Fabric Length Guide
              </h3>
              <button onClick={() => setShowSizeChart(false)} className="p-2.5 hover:bg-white/20 rounded-2xl text-white">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-700">
                    <th className="border border-amber-200 dark:border-gray-600 p-4 text-left font-bold text-amber-900 dark:text-white">Size</th>
                    <th className="border border-amber-200 dark:border-gray-600 p-4 text-left font-bold text-amber-900 dark:text-white">Length</th>
                    <th className="border border-amber-200 dark:border-gray-600 p-4 text-left font-bold text-amber-900 dark:text-white">Width</th>
                    <th className="border border-amber-200 dark:border-gray-600 p-4 text-left font-bold text-amber-900 dark:text-white">Fabric</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(SIZE_CHART).map(([size, data]) => (
                    <tr key={size} className={`hover:bg-amber-50 dark:hover:bg-gray-700 cursor-pointer ${selectedSize === size ? "bg-amber-100 dark:bg-gray-600" : ""}`}
                      onClick={() => { setSelectedSize(size); toast.success(`Size ${size} selected`); }}>
                      <td className="border border-amber-200 dark:border-gray-600 p-4 font-bold text-amber-900 dark:text-white">{size}</td>
                      <td className="border border-amber-200 dark:border-gray-600 p-4 text-amber-800 dark:text-gray-300">{data.length}"</td>
                      <td className="border border-amber-200 dark:border-gray-600 p-4 text-amber-800 dark:text-gray-300">{data.width}"</td>
                      <td className="border border-amber-200 dark:border-gray-600 p-4 text-amber-800 dark:text-gray-300">{data.fabric}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleAddToCart} disabled={stock === 0 || addingToCart}
                className={`w-full px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${stock === 0 ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-lg"}`}>
                <FaShoppingCart className="w-6 h-6" />
                {stock === 0 ? "Out of Stock" : !selectedSize ? "Select Size First" : addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleUnstitch;