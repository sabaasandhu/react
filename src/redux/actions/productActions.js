import apis from "../../config/apis";
import {
  setLoading,
  setProducts,
  setProduct,
  setError,
  setsliders,
  setProductsByCategory,
  setUnstitchs,
  setUnstitchProduct,

} from "../slices/productSlice";

import axios from "axios";

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem("access");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await axios.get(apis[0], config);
    dispatch(setProducts(data));

  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const fetchSliders = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(apis[3]);
    dispatch(setsliders(data));

  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const singleProduct = (id) => async (dispatch) => {
  try {
    dispatch(setLoading())
    const { data } = await axios.get(`${apis[1]}/${id}`)
    dispatch(setProduct(data));

  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const fetchCategory = (category) => async (dispatch) => {
  try {
    dispatch(setLoading());

    console.log("========== FETCH CATEGORY START ==========");
    console.log("1. Category jo aayi:", category);
    console.log("2. apis[0]:", apis[0]);
    console.log("3. apis[5]:", apis[5]);

    const [productsRes, unstitchsRes] = await Promise.all([
       axios.get(apis[0]),
       axios.get(apis[5]),
    ]);

    console.log("4. Products response status:", productsRes.status);
    console.log("5. Unstitchs response status:", unstitchsRes.status);
    console.log("6. Products count:", productsRes.data?.length);
    console.log("7. Unstitchs count:", unstitchsRes.data?.length);

    const allProducts = [
      ...(productsRes.data || []),
      ...(unstitchsRes.data || []),
    ];

    console.log("8. All combined:", allProducts.length);
    console.log("9. Saari categories:", [...new Set(allProducts.map(p => p.category))]);

    const filtered = allProducts.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );

    console.log("10. Filtered count:", filtered.length);
    console.log("11. Filtered products:", filtered);

    dispatch(setProductsByCategory(filtered));
    console.log("========== FETCH CATEGORY END ==========");
  } catch (err) {
    console.error("🔴🔴🔴 ERROR:", err);
    console.error("🔴 Error message:", err.message);
    console.error("🔴 Error response:", err.response);
    dispatch(setError(err.message));
  }
};
export const fetchUnstitchs = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(apis[5]);
    dispatch(setUnstitchs(data));

  } catch (err) {
    dispatch(setError(err.message));
  }
};

export const singleUnstitch = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data } = await axios.get(`${apis[6]}/${id}`);  
     dispatch(setUnstitchProduct(data)); 
  } catch (err) {
    dispatch(setError(err.message));
  }
};