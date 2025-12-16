const API_PATH = 'danny'; // API 使用者路徑
const API_HEADER = 'https://livejs-api.hexschool.io'; // 前段網域
const API_PRODUCTS = `${API_HEADER}/api/livejs/v1/customer/${API_PATH}/products`; // 商品列表 
const API_CARTS = `${API_HEADER}/api/livejs/v1/customer/${API_PATH}/carts`; // 購物車列表 
const API_ORDER = `${API_HEADER}/api/livejs/v1/customer/${API_PATH}/orders`; // 客戶訂單
const PATH = {
    PRODUCTS: API_PRODUCTS,
    CARTS: API_CARTS,
    ORDER: API_ORDER
}

const FILTER_TYPE = {
    ALL: '全部'
}

export {
    PATH,
    FILTER_TYPE
}