// 这个模块主要获取的是品牌管理的数据
import requestadmin from '@/utils/requestadmin'
// 获取品牌列表接口
// 'get' /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => requestadmin({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})
