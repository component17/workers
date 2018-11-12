import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index'
import workTable from '@/pages/workTable'
import formMaker from '@/pages/formMaker'
import newWorker from '@/pages/newWorker'
import editPermission from '@/pages/editPermission'
import personCard from '@/pages/personCard'
import settings from '@/pages/settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },{
      path: '/workTable',
      name: 'workTable',
      component: workTable
    },{
      path: '/formMaker',
      name: 'formMaker',
      component: formMaker
    },{
      path: '/newWorker',
      name: 'newWorker',
      component: newWorker
    },{
      path: '/editPermission',
      name: 'editPermission',
      component: editPermission
    },{
      path: '/personCard',
      name: 'personCard',
      component: personCard
    },{
      path: '/settings',
      name: 'settings',
      component: settings
    }
  ]
})
