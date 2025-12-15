const API_PATH = 'danny'; // API 使用者路徑
const API_HEADER = 'https://livejs-api.hexschool.io'; // 前段網域
const API_PRODUCTS = `${API_HEADER}/api/livejs/v1/customer/${API_PATH}/products`; // 商品列表 

const PATH = {
    products: API_PRODUCTS
}

const FILTER_TYPE = {
    ALL: '全部'
}

export {
    PATH,
    FILTER_TYPE
}