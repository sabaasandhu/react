import React from 'react'
import { useEffect } from 'react';
import { fetchProducts } from "../../redux/actions/productActions";
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import ProductCard from '../../components/ProductCard';
import MetaData from '../../components/MetaData';
import Carasol from '../../components/Carasol'

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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      <MetaData title={'Main page'} />

      <Carasol />

      <div className='flex flex-col items-center justify-center mt-10 mb-8 px-4'>
        <span className='px-4 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3'>
          Fresh Picks
        </span>
        <h1 className='text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white'>
          New Arrivals
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm md:text-base mt-2 text-center max-w-md'>
          Handpicked products just for you — updated daily, curated with care.
        </p>
        <div className='h-1 w-16 bg-indigo-500 rounded-full mt-4' />
      </div>

      {loading ? (
        <div className='flex justify-center py-20'>
          <Loader />
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-4 pb-16'>
          {productList.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {productList.map((product, index) => (
                <div
                  key={product?.id ?? index}
                  className='transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl'
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/40 rounded-2xl shadow-sm max-w-md mx-auto py-12 px-6'>
              <h3 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-1'>
                No Products Found
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Products will show up here as soon as they're added.
              </p>
              {isAdmin && (
                <a
                  href="https://web-production-10987.up.railway.app/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors'
                >
                  Add New Product
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home