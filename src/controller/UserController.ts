// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { responseJSON } from '../utils/myUtils'
import { User } from '../entity/User'

export class UserController {
  async read (req : Request, res : Response) {
    const { username } = req.params

    if (!username) {
      return responseJSON(false, 'without_username', 'paramerter username is null', [], 200)
    }

    const objUser = await getRepository(User).createQueryBuilder('user')
      .where('user.username = :_username AND user.isStatus = true AND user.isDeleted = false', { _username: username })
      .getOne()
    return responseJSON(true, 'user_send', 'User Send', objUser || [], 200)
  }
}
