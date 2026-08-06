import React from 'react'
import { useEffect } from 'react';
import { fetchProducts } from "../../redux/actions/productActions";
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import MetaData from '../../components/MetaData';
import Carasol from '../../components/Carasol'
import { Link } from "react-router-dom";
import v from "../../image/v.jpg";

const Home = () => {
  const dispatch = useDispatch()
  const { loading, products } = useSelector(state => state.prodSlice)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const isAdmin = user && user.is_staff === true
  const productList = Array.isArray(products) ? products : []

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950'>
    <>
  <MetaData title={"Main Page"} />

  <Carasol />

  {/* HERO SECTION */}
  <section className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 text-white">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6 py-20">

      <div>
        <span className="bg-white/20 px-4 py-2 rounded-full uppercase text-sm tracking-widest">
          New Collection 2026
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight">
          Discover Your
          <br />
          Perfect Outfit
        </h1>

        <p className="mt-6 text-lg text-white/90 leading-8">
          Premium quality dresses designed for every occasion.
          Shop Two Piece, Three Piece & Cotton Collections.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            to="/product/two-piece"
            className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>

          <Link
            to="/product/three-piece"
            className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-purple-700 transition"
          >
            Explore
          </Link>
        </div>
      </div>

      <div className="hidden md:flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800"
          alt=""
          className="rounded-3xl shadow-2xl h-[520px] object-cover"
        />
      </div>

    </div>
  </section>

  {/* FEATURES */}

  <section className="py-16 bg-gray-100 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">🚚</div>
        <h2 className="font-bold text-2xl mb-2">
          Free Shipping
        </h2>

        <p className="text-gray-500">
          Fast delivery all over Pakistan.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">💳</div>

        <h2 className="font-bold text-2xl mb-2">
          Secure Payment
        </h2>

        <p className="text-gray-500">
          Safe and trusted checkout.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">⭐</div>

        <h2 className="font-bold text-2xl mb-2">
          Premium Quality
        </h2>

        <p className="text-gray-500">
          High quality fabrics & stitching.
        </p>
      </div>

    </div>
  </section>

  {/* SHOP BY CATEGORY */}

  <section className="py-20">

    <div className="text-center mb-14">
      <h2 className="text-4xl font-bold">
        Shop By Category
      </h2>

      <p className="text-gray-500 mt-3">
        Choose your favorite collection
      </p>
    </div>

    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6">

      <Link
        to="/product/two-piece"
        className="group relative overflow-hidden rounded-3xl shadow-xl"
      >
        <img
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57f?w=800"
          className="h-80 w-full object-cover group-hover:scale-110 duration-500"
          alt=""
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

          <div className="text-center">

            <h3 className="text-white text-3xl font-bold">
              Two Piece
            </h3>

            <p className="text-white mt-2">
              Elegant Collection
            </p>

          </div>

        </div>

      </Link>
            <Link
        to="/product/three-piece"
        className="group relative overflow-hidden rounded-3xl shadow-xl"
      >
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
          className="h-80 w-full object-cover group-hover:scale-110 duration-500"
          alt=""
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-white text-3xl font-bold">
              Three Piece
            </h3>

            <p className="text-white mt-2">
              Premium Collection
            </p>
          </div>
        </div>
      </Link>

      <Link
        to="/product/cotton"
        className="group relative overflow-hidden rounded-3xl shadow-xl"
      >
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
          className="h-80 w-full object-cover group-hover:scale-110 duration-500"
          alt=""
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-white text-3xl font-bold">
              Cotton
            </h3>

            <p className="text-white mt-2">
              Soft & Comfortable
            </p>
          </div>
        </div>
      </Link>

    </div>
  </section>

  {/* SALE BANNER */}

  <section className="max-w-7xl mx-auto px-6 mb-16">
    <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 rounded-3xl overflow-hidden grid md:grid-cols-2 items-center">

      <div className="p-10 md:p-16 text-white">
        <p className="uppercase tracking-[6px]">
          Summer Collection
        </p>

        <h2 className="text-5xl font-extrabold mt-5">
          Up To
          <span className="block text-yellow-300">
            50% OFF
          </span>
        </h2>

        <p className="mt-6 text-lg">
          Discover beautiful dresses specially selected
          for every occasion.
        </p>

        <Link
          to="/product/two-piece"
          className="inline-block mt-8 bg-white text-pink-700 px-8 py-3 rounded-full font-bold hover:scale-105 duration-300"
        >
          Shop Collection
        </Link>
      </div>

      <div className="hidden md:block">
        <img
          src={v}
          alt=""
          className="w-full h-[500px] object-cover"
        />
      </div>

    </div>
  </section>

  {/* PRODUCTS */}

  <section className="max-w-7xl mx-auto px-6 pb-20">

    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold">
        New Arrivals
      </h2>

      <p className="text-gray-500 mt-3">
        Latest fashion collection
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    ) : productList.length > 0 ? (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productList.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>

    ) : (

      <div className="text-center py-20">

        <h2 className="text-2xl font-bold">
          No Products Found
        </h2>

        <p className="text-gray-500 mt-3">
          Products will appear here soon.
        </p>

        {isAdmin && (
          <a
            href="https://web-production-10987.up.railway.app/admin/"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Add Product
          </a>
        )}

      </div>

    )}

  </section>
  <Footer />
  <div/>
    </>
    </div>
  )
}

export default Home