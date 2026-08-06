import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from "../../redux/actions/productActions";
import Loader from '../../components/Loader';
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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950'>
      <MetaData title={'Main page'} />

      <Carasol />

      <div className='flex flex-col items-center justify-center text-center mt-12 mb-10 px-4'>
        <span className='px-4 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3'>
          Just Landed
        </span>
        <h1 className='text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white'>
          New Arrivals
        </h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm md:text-base mt-3 max-w-md'>
          Explore our latest collection, chosen just for you.
        </p>
        <div className='h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-5' />
      </div>

      {loading ? (
        <div className='flex justify-center py-24'>
          <Loader />
        </div>
      ) : (
        <div className='max-w-7xl mx-auto px-4 pb-16'>
          {productList.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
              {productList.map((product, index) => (
                <Link
                  to={`/products/${product?.id ?? index}`}
                  key={product?.id ?? index}
                  className='group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden block'
                >
                  <div className='relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700'>
                    <img
                      src={product?.image || product?.images?.[0] || '/placeholder.png'}
                      alt={product?.name || 'Product'}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>

                  <div className='p-3'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-100 truncate'>
                      {product?.name}
                    </h3>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-indigo-600 dark:text-indigo-400 font-bold text-base'>
                        Rs. {product?.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 border-2 border-dashed border-red-200 dark:border-red-900/40 rounded-2xl shadow-sm max-w-md mx-auto py-14 px-8'>
              <h3 className='text-xl font-bold text-gray-800 dark:text-gray-100 mb-2'>
                No Products Found
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-5'>
                New products will appear here soon.
              </p>
              {isAdmin && (
                <a
                  href="https://web-production-10987.up.railway.app/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-md'
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