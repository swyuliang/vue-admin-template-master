// 平台属性管理模块
import requestadmin from '@/utils/requestadmin'

// 获取一级分类数据接口
// 'get' /admin/product/getCategory1
export const reqCategory1List = () => requestadmin({
  url: '/admin/product/getCategory1',
  method: 'GET'
})

// 获取二级分类数据接口
// 'get' /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => requestadmin({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'GET'
})

// 获取三级分类数据接口
// 'get' /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => requestadmin({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'GET'
})

// 获取平台属性的接口
// 'get' /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => requestadmin({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'GET'
})

// 添加属性与修改属性值
// 'post' /admin/product/saveAttrInfo
/**
 * {
  "attrName": "string", 属性名
  "attrValueList": [    属性名中的属性，因为属性值可以是多个，因此需要的是数组
    {
      "attrId": 0,      属性值的id
      "valueName": "string"  属性值
    }
  ],
  "categoryId": 0,      category3Id
  "categoryLevel": 0,
  "id": 0
}
 */
export const reqAddOrUpdateAttr = data => requestadmin({
  url: '/admin/product/saveAttrInfo',
  method: 'POST',
  data
})

// 删除属性值
// 'delete' /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = attrId => requestadmin({
  url: `/admin/product/deleteAttr/${attrId}`,
  method: 'DELETE'
})
