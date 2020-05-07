import { routesIndex } from './routes/routesIndex'
import { routesSecurity } from './routes/routesSecurity'
import { routesUser } from './routes/routesUser'

export const Routes = [
  ...routesIndex,
  ...routesSecurity,
  ...routesUser
]
