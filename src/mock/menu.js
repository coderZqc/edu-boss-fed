import Mock from "mockjs"

const menus = require('@/mock/data/menu.json')

export const getMenus = () => {
  const menuList = JSON.parse(JSON.stringify(menus))
  const forest = treeify(menuList)
  return Mock.mock({
    success: true,
    data: {
      menus: forest
    }
  })

  function treeify(menuList) {
    const dummy = { menuid: -1 }
    fillChildrenFor(dummy, menuList)
    return dummy.children
  }

  function fillChildrenFor(parentNode, menuList) {
    const children = menuList.filter((menu) => menu.pid === parentNode.menuid)
    for (let child of children) {
      fillChildrenFor(child, menuList)
    }
    parentNode.children = children
  }
}

export const getMenuById = (id) => {
  const menuList = JSON.parse(JSON.stringify(menus))
  const menu = menuList.find(m => m.menuid === id)
  return Mock.mock({
    success: true,
    data: {
      menu
    }
  })
}