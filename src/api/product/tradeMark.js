// 这个模块主要获取的是品牌管理的数据
import requestadmin from '@/utils/requestadmin'
// 获取品牌列表接口
// 'get' /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => requestadmin({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET'
})

// 处理添加品牌
// 新增品牌：'post' /admin/product/baseTrademark/save 携带两个参数：品牌名称，品牌logo
// 切记：对于新增品牌，给服务器传递数据，不需要传递ID，ID由服务器生成

// 修改品牌：put /admin/product/baseTrademark/update  携带三个参数：ID、品牌名称，品牌logo
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 带给服务器数据携带ID---修改
  if (tradeMark.id) {
    return requestadmin({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data: tradeMark
    })
  } else {
    return requestadmin({
      url: '/admin/product/baseTrademark/save',
      method: 'POST',
      data: tradeMark
    })
  }
}

// 删除品牌接口
// 'delete' /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => requestadmin({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'DELETE'
})
