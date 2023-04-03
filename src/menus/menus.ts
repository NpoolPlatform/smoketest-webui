import { uid } from 'quasar'
import { MenuItem } from 'src/localstore'

const MainDrawerMenus = [
  {
    menuId: uid(),
    label: '测试用例',
    caption: '管理测试用例',
    icon: 'pending',
    target: '/testcase',
    level: 0,
    sectionBegin: false,
    children: []
  } as MenuItem, {
    menuId: uid(),
    label: '测试计划',
    caption: '管理测试计划',
    icon: 'pending',
    target: '/testplan',
    level: 0,
    sectionBegin: false,
    children: []
  } as MenuItem
] as Array<MenuItem>

export {
  MainDrawerMenus
}
