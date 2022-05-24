import Mock from "mockjs"

const routes = require('@/mock/data/route.json')

export const getRoutes = () => {
  let routeList = JSON.parse(JSON.stringify(routes))
  const forest = treeify(routeList)
  return Mock.mock({
    success: true,
    data: {
      routes: forest
    }
  })

  function treeify(routeList) {
    const dummy = {routeid: -1}
    fillChildrenFor(dummy, routeList)
    return dummy.children
  }
  
  function fillChildrenFor(parent, routeList) {
  
    const children = routeList.filter((route) => route.pid === parent.routeid)
  
    for (let child of children) {
      fillChildrenFor(child, routeList)
    }
    parent.children = children
    const { isPublic, roles } = parent
    parent.meta = {
      isPublic, roles
    }
  
    delete parent.isPublic
    delete parent.roles
    delete parent.routeid
    delete parent.pid
  }

}



