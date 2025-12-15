// 打 api 並回傳該 data
import { PATH } from './constant.js';

// 取得商品資料列表 
async function getProducts() {
    try {
        const res = await axios.get(PATH.products);
        return res.data.products;
    } catch (error) {
        console.error('取得產品資料時發生錯誤:', error);
        throw error;
    }
}

// 取得購物車列表
async function getCarts() {
    try {
        const res = await axios.get(PATH.CARTS);
        return res.data;
    } catch (error) {
        console.error('取得購物車資料時發生錯誤:', error);
        throw error;
    }
}


export {
    getProducts,
    getCarts
}