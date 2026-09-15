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
import b3 from "../../image/b3.webp";
import uns from "../../image/uns.jpeg";
import t from '../../image/t.jpg'
import e1 from '../../image/e1.jpg'
import j2 from '../../image/j2.jpg'

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

  {/* SHOP BY CATEGORY */}

  <section className="py-10">

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
        to="/product/to-piece"
        className="group relative overflow-hidden rounded-3xl shadow-xl"
      >
        <img
          src={j2}
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
          src={t}
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
        to="/unstitchs"
        className="group relative overflow-hidden rounded-3xl shadow-xl"
      >
        <img
          src={uns}
          className="h-80 w-full object-cover group-hover:scale-110 duration-500"
          alt=""
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-white text-3xl font-bold">
              Unstitch
            </h3>

            <p className="text-white mt-2">
              Soft & Comfortable
            </p>
          </div>
        </div>
      </Link>

    </div>
  </section>

  {/* PRODUCTS */}

  <section className="max-w-7xl mx-auto px-6 pb-20">

    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold">
        New Arrivals
      </h2>

      <p className="text-gray-500 mt-3">
        Latest fashion collection
        Ready to wear
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center py-16">
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
            href="https://web-production-d7f28a.up.railway.app/admin/"
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
  <div/>
    </>
    </div>
  )
}

export default Home