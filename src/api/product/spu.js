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
