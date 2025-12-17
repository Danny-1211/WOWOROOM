const API_PATH = 'danny'; // API 使用者路徑
const API_HEADER = 'https://livejs-api.hexschool.io'; // 前段網域
const ADMIN_UID = 'A1xV6ebWohR1wJIgZ2gaePUVZWf2'; // token 先寫死
const API_ORDERS = `${API_HEADER}/api/livejs/v1/admin/${API_PATH}/orders`; // 後台訂單列表

const PATH = {
    ORDERS: API_ORDERS
}

export {
    PATH,
    ADMIN_UID
}