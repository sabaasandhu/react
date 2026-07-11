import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import salePriceFunc from "../../helpers/Func.jsx";
import { singleProduct } from "../../redux/actions/productActions";
import { addToCart, fetchCart } from "../../redux/actions/cartActions";
import MetaData from "../../components/MetaData";
import toast from "react-hot-toast";
import {
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaCheck,
  FaRuler,
  FaTshirt,
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
} from "react-icons/fa";

// ProductCard builds image URLs the same way — hardcoded here instead of
// via config/apis.js. Ideally both files should import one shared
// IMAGE_BASE_URL from apis.js so there's a single place to change it, but
// matching ProductCard exactly for now so images resolve consistently.
const IMAGE_BASE_URL = "https://django-production-126c.up.railway.app";

// Stitched garment sizes with measurements (inches)
const SIZE_CHART = {
  Small: { bust: "34", waist: "28", hips: "36", length: "42" },
  Medium: { bust: "36", waist: "30", hips: "38", length: "43" },
  Large: { bust: "38", waist: "32", hips: "40", length: "44" },
  XL: { bust: "40", waist: "34", hips: "42", length: "45" },
};

// Unstitched fabric length options
const UNSTITCH_SIZE_CHART = {
  "1 Meter": { length: "36", width: "44", fabric: "1 Meter" },
  "1.5 Meter": { length: "54", width: "44", fabric: "1.5 Meter" },
  "2 Meter": { length: "72", width: "44", fabric: "2 Meter" },
  "2.5 Meter": { length: "90", width: "44", fabric: "2.5 Meter" },
  "3 Meter": { length: "108", width: "44", fabric: "3 Meter" },
};

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.prodSlice);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const imgRef = useRef(null);
  const shareMenuRef = useRef(null);
  const sizeChartRef = useRef(null);

  useEffect(() => {
    dispatch(singleProduct(id));
  }, [dispatch, id]);

  // Reset selections whenever the product changes so a size chosen on one
  // product doesn't carry over to the next
  useEffect(() => {
    setSelectedSize("");
    setSelectedImage(0);
    setQuantity(1);
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

  const MAGNIFIER_SIZE = 160;

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - left;
    const relY = e.clientY - top;

    const x = (relX / width) * 100;
    const y = (relY / height) * 100;
    setMagnifierPosition({ x, y });

    // Clamp so the lens stays fully inside the image box instead of
    // spilling past the edges (that spillover was making it look like a
    // second, oversized image sliding in from below)
    const half = MAGNIFIER_SIZE / 2;
    const clampedX = Math.min(Math.max(relX, half), width - half);
    const clampedY = Math.min(Math.max(relY, half), height - half);
    setCursorPosition({ x: clampedX, y: clampedY });
  };

  const shareOnWhatsApp = () => {
    const productName = product?.name || "";
    const productBrand = product?.brand || "";
    const productPrice = product?.price || 0;
    const productDiscount = product?.discount || 0;
    const text = `Check out ${productBrand} ${productName} - Rs.${salePriceFunc(
      productPrice,
      productDiscount
    )}`;
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

    if (!product?.stock) {
      toast.error("Out of stock!");
      return;
    }

    if (!product?.id) {
      toast.error("Product not found!");
      return;
    }

    try {
      setAddingToCart(true);
      // addToCart (as used in ProductCard too) only takes (id, qty) — it has
      // no size parameter today, so the size chosen on this page isn't
      // persisted against the cart line item yet. If size needs to be
      // tracked per cart item, addToCart's action + reducer + backend
      // serializer all need to accept and store it first.
      await dispatch(addToCart(product.id, quantity));
      await dispatch(fetchCart());
      toast.success(`Added to cart: ${selectedSize}`);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full mb-6 animate-spin" />
          <p className="text-gray-600 font-medium">Loading product...</p>
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
    gender = "unisex",
  } = product;

  const inc = () => setQuantity((q) => Math.min(stock, q + 1));
  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  const isUnstitch = category ? category.toLowerCase().includes("unstitch") : false;
  const sizeChart = isUnstitch ? UNSTITCH_SIZE_CHART : SIZE_CHART;
  const sizes = Object.keys(sizeChart);
  const GenderIcon = gender === "women" ? FaFemale : gender === "men" ? FaMale : null;
  const readyToAdd = stock > 0 && Boolean(selectedSize);

  const getImageUrl = (img) => (img ? `${IMAGE_BASE_URL}${img.image}` : "/placeholder.jpg");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 bg-white p-3 rounded-xl shadow-sm">
          <Link to="/" className="text-gray-600 hover:text-orange-600 transition-colors">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to={`/category/${category ? category.toLowerCase() : ""}`}
            className="text-gray-600 hover:text-orange-600 transition-colors capitalize"
          >
            {category}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-semibold">
            {brand} {name}
          </span>
        </nav>

        <MetaData title={product ? `${product.brand} ${product.name}` : ""} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-square bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex items-center justify-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imgRef}
                src={getImageUrl(images?.[selectedImage])}
                alt={name}
                className="w-full h-full object-contain p-4 sm:p-8"
              />

              {showMagnifier && images?.[selectedImage] && (
                <div
                  className="hidden sm:block absolute pointer-events-none rounded-full border-2 border-white shadow-xl overflow-hidden"
                  style={{
                    width: `${MAGNIFIER_SIZE}px`,
                    height: `${MAGNIFIER_SIZE}px`,
                    left: `${cursorPosition.x - MAGNIFIER_SIZE / 2}px`,
                    top: `${cursorPosition.y - MAGNIFIER_SIZE / 2}px`,
                    backgroundImage: `url('${getImageUrl(images[selectedImage])}')`,
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                    backgroundSize: `${imgRef.current ? imgRef.current.offsetWidth * 2 : 0}px ${
                      imgRef.current ? imgRef.current.offsetHeight * 2 : 0
                    }px`,
                    zIndex: 50,
                  }}
                />
              )}

              {onSale && (
                <span className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Sale {discount}% OFF
                </span>
              )}

              {gender && gender !== "unisex" && (
                <span className="absolute top-6 right-6 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <GenderIcon className="w-4 h-4" />
                  {gender === "women" ? "Women" : "Men"}
                </span>
              )}

              <button
                onClick={toggleWishlist}
                className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Toggle wishlist"
              >
                <FaHeart className={`w-6 h-6 ${isWishlist ? "text-red-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images && images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 transition-all overflow-hidden ${
                      selectedImage === i
                        ? "border-orange-600 shadow-md ring-2 ring-orange-100"
                        : "border-gray-200 hover:border-orange-400"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${name} thumbnail ${i + 1}`}
                      className="w-full h-full object-contain p-2 bg-white"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-4">
            {/* Brand & Category */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
                {brand}
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-3">{name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-gray-700 text-sm bg-gray-100 px-4 py-1.5 rounded-full font-medium capitalize">
                  {category}
                </span>
                {isUnstitch && (
                  <span className="text-orange-700 text-sm bg-orange-50 px-4 py-1.5 rounded-full font-medium flex items-center gap-2">
                    <FaRuler /> Unstitched
                  </span>
                )}
              </div>
            </div>

            {/* Price & Rating */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-sm text-gray-600 font-medium">Price</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl text-red-600 font-semibold">
                      Rs.{salePriceFunc(price, discount || 0)}
                    </span>
                    {onSale && <span className="text-gray-400 line-through text-lg">Rs.{price}</span>}
                  </div>
                  {discount > 0 && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                      Save {discount}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
                  <Rating rating={rating} />
                  <span className="text-gray-600 text-sm font-semibold">({rating})</span>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {stock > 0 ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                    <div>
                      <p className="text-green-700 font-semibold">In Stock</p>
                      <p className="text-sm text-gray-600">{stock} items available</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <p className="text-red-600 font-medium">Out of stock</p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-3 text-lg">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <FaTshirt className="w-4 h-4 text-white" />
                </span>
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{description || "No description available."}</p>
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <FaRuler className="w-3.5 h-3.5 text-white" />
                  </span>
                  Select Size
                </h3>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors font-medium flex items-center gap-2 text-sm"
                >
                  <FaChartBar /> Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl border-2 transition-all font-semibold min-w-[80px] ${
                      selectedSize === size
                        ? "bg-orange-600 text-white border-orange-600 shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {!selectedSize && <p className="text-red-500 text-sm mt-4">Please select a size</p>}
            </div>

            {/* SIZE CHART MODAL */}
            {showSizeChart && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4">
                <div ref={sizeChartRef} className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="sticky top-0 bg-orange-600 p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <FaRuler className="w-6 h-6" />
                      {isUnstitch ? "Fabric Length Guide" : "Size Guide"}
                    </h3>
                    <button
                      onClick={() => setShowSizeChart(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                      aria-label="Close size chart"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8">
                    <table className="w-full border-collapse mb-6">
                      <thead>
                        <tr className="bg-orange-50">
                          <th className="border p-4 text-left">Size</th>
                          {isUnstitch ? (
                            <>
                              <th className="border p-4 text-left">Length</th>
                              <th className="border p-4 text-left">Width</th>
                              <th className="border p-4 text-left">Fabric</th>
                            </>
                          ) : (
                            <>
                              <th className="border p-4 text-left">Bust</th>
                              <th className="border p-4 text-left">Waist</th>
                              <th className="border p-4 text-left">Hips</th>
                              <th className="border p-4 text-left">Length</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(sizeChart).map(([size, data]) => (
                          <tr
                            key={size}
                            className={`hover:bg-orange-50 cursor-pointer ${
                              selectedSize === size ? "bg-orange-100" : ""
                            }`}
                            onClick={() => {
                              setSelectedSize(size);
                              toast.success(`Size ${size} selected`);
                            }}
                          >
                            <td className="border p-4 font-semibold">{size}</td>
                            {isUnstitch ? (
                              <>
                                <td className="border p-4">{data.length}"</td>
                                <td className="border p-4">{data.width}"</td>
                                <td className="border p-4">{data.fabric}</td>
                              </>
                            ) : (
                              <>
                                <td className="border p-4">{data.bust}"</td>
                                <td className="border p-4">{data.waist}"</td>
                                <td className="border p-4">{data.hips}"</td>
                                <td className="border p-4">{data.length}"</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="sticky bottom-0 bg-white pt-6 mt-4 border-t">
                      <button
                        onClick={handleAddToCart}
                        disabled={stock === 0 || addingToCart}
                        className={`w-full px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                          stock === 0
                            ? "bg-gray-300 cursor-not-allowed opacity-60"
                            : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg"
                        }`}
                      >
                        <FaShoppingCart className="w-6 h-6" />
                        {stock === 0
                          ? "Out of Stock"
                          : !selectedSize
                          ? "Select Size First"
                          : addingToCart
                          ? "Adding..."
                          : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN ADD TO CART */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity Counter */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-semibold">Qty:</span>
                  <div className="flex items-center bg-white rounded-xl border-2 border-orange-200 overflow-hidden">
                    <button
                      onClick={dec}
                      className="px-4 py-2 text-xl font-semibold text-gray-600 hover:bg-orange-600 hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <div className="px-5 py-2 font-semibold bg-white border-x-2 border-orange-100 min-w-[60px] text-center">
                      {quantity}
                    </div>
                    <button
                      onClick={inc}
                      className="px-4 py-2 text-xl font-semibold text-gray-600 hover:bg-orange-600 hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!readyToAdd || addingToCart}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                    !readyToAdd
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg"
                  }`}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  {stock === 0
                    ? "Out of Stock"
                    : addingToCart
                    ? "Adding..."
                    : `Add to Cart • Rs.${salePriceFunc(price, discount || 0)}`}
                </button>
              </div>

              {stock > 0 && !selectedSize && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
                  <p className="text-yellow-700 text-sm font-medium">Please select a size</p>
                </div>
              )}
            </div>

            {/* Selected Size Summary */}
            {selectedSize && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-orange-800">Selected:</span>
                  <span className="px-4 py-2 bg-white border border-orange-300 rounded-full text-sm font-bold text-orange-700">
                    Size: {selectedSize}
                  </span>
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <FaTruck className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Free Shipping</h4>
                  <p className="text-xs text-gray-600">On orders above Rs.2000</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <FaShieldAlt className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Secure Payment</h4>
                  <p className="text-xs text-gray-600">100% secure</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <FaUndo className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-600">7 days return</p>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex items-center gap-4 pt-2">
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-2xl hover:bg-gray-900 transition-colors flex items-center gap-3 font-semibold shadow-sm"
                >
                  <FaShareAlt /> Share
                </button>

                {showShareMenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50">
                    <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-green-50">
                      <FaWhatsapp className="text-green-600 text-xl" /> WhatsApp
                    </button>
                    <button onClick={shareOnFacebook} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50">
                      <FaFacebook className="text-blue-600 text-xl" /> Facebook
                    </button>
                    <button onClick={shareOnInstagram} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50">
                      <FaInstagram className="text-pink-600 text-xl" /> Instagram
                    </button>
                    <button onClick={copyToClipboard} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 border-t">
                      {linkCopied ? <FaCheck className="text-green-600" /> : <FaLink className="text-gray-600" />}
                      {linkCopied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/"
                className="px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-colors font-semibold flex items-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
