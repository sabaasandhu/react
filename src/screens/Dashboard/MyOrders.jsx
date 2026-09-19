import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const ORDER_API = "https://web-production-d7f28a.up.railway.app/api/orders/my-orders/";

const MyOrders = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get(ORDER_API, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <p className="text-gray-600">No orders yet</p>
            <Link to="/" className="text-teal-600 font-bold mt-4 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-lg">{order.order_number}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.order_status}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-gray-800 font-bold">Total: Rs. {order.total_price}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;