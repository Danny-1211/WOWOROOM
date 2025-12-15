// 打 api 並回傳該 data
import { path } from './constant.js';

// 取得商品資料列表
async function getProducts() {
    try {
        const res = await axios.get(path.products);
        return res.data.products;
    } catch (error) {
        console.error('取得產品資料時發生錯誤:', error);
        throw error;
    }
}
export {
    getProducts,
}