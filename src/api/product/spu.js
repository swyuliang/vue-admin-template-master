// SPU管理模块
import requestadmin from '@/utils/requestadmin'

// 获取SPU列表
// 'get' /admin/product/{page}/{limit}

export const reqSpuList = (page, limit, category3Id) => requestadmin({
  url: `/admin/product/${page}/${limit}`,
  method: 'GET',
  params: {
    category3Id
  }
})
// 获取SPU信息
// 'get' /admin/product/getSpuById/{spuId}
export const reqSpu = spuId => requestadmin({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'GET'
})

// 获取品牌的信息
// 'get' /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => requestadmin({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'GET'
})

// 获取SPU图片
// 'get' /admin/product/spuImageList/{spuId}
export const reqSpuImageList = spuId => requestadmin({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'GET'
})

// 获取平台全部的销售属性---整个平台销售属性一共三个
// 'get' /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => requestadmin({
  url: '/admin/product/baseSaleAttrList',
  method: 'GET'
})

// 修改SPU:带id属性 'post' /admin/product/updateSpuInfo || 添加SPU: 不带id属性 'post' /admin/product/saveSpuInfo
export const reqAddOrUpdateSpu = spuInfo => {
  // 修改SPU:带id属性
  if (spuInfo.id) {
    return requestadmin({
      url: '/admin/product/updateSpuInfo',
      method: 'POST',
      data: spuInfo
    })
  } else {
    return requestadmin({
      url: '/admin/product/saveSpuInfo',
      method: 'POST',
      data: spuInfo
    })
  }
}

// 删除SPU
// 'delete' /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = spuId => requestadmin({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'DELETE'
})