import { UserController } from '../controller/UserController'

export const routesUser = [
  {
    method: 'get',
    route: '/user/read/:username',
    controller: UserController,
    action: 'read'
  }
]
