// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'
import * as bcrypt from 'bcrypt'
import { User } from '../entity/User'
import { responseJSON } from '../utils/myUtils'
import { createToken, validToken, tokenInHeader, tokenInCookie } from '../utils/Token'
const SALT = bcrypt.genSaltSync(10)

export class SecurityController {
  async login (req: Request, res: Response) {
    const { username, password } = req.body
    if (!username || !password) {
      return responseJSON(false, 'without_parameters', 'Sin los parametros \'username or passsowrd\'', [], 200)
    }

    const objUser = await getRepository(User).createQueryBuilder('user')
      .where('user.username = :_username AND user.isStatus = true AND user.isDeleted = false', { _username: username })
      .getOne()

    if (!objUser) {
      return responseJSON(false, 'user_not_found', 'Usuario no encontrado', [], 200)
    }

    const isValidPassword = await bcrypt.compareSync(password, objUser.password)

    if (!isValidPassword) {
      return responseJSON(false, 'password_invalid', 'Contraseña Invalida', [], 200)
    }

    const token = await createToken({
      sub: 'login', aud: 'web', id: objUser.id, role: objUser.role, usn: objUser.username
    })
    tokenInCookie(res, token)

    return responseJSON(true, 'user_loged', 'Usuario Logeado', [], 200)
  }

  async valid (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const token = authorization?.split(' ')

    if (!token || token.length < 2 || token[0] !== 'Bearer') {
      return responseJSON(false, 'without_token', 'Acceso Denegado. Sin Token.', [], 401)
    }

    const objToken = await validToken(token[1])

    if (!objToken) {
      return responseJSON(false, 'token_invalid', 'Token Invalido.', [], 401)
    }

    req.body.jwt_usuario_id = objToken.id
    req.body.jwt_usuario_role = objToken.role
    req.body.jwt_usuario_alias = objToken.usn

    const newToken = await createToken({
      sub: 'update', aud: 'web', id: objToken.id, role: objToken.role, usn: objToken.usn
    })
    await tokenInHeader(res, newToken)
    next()
  }

  async validInCookie (req: Request, res: Response, next: NextFunction) {
    const { hr_rch: token } = req.signedCookies
    if (!token) {
      return responseJSON(false, 'without_token', 'Acceso Denegado. Sin Token.', [], 401)
    }

    const objToken = await validToken(token)

    if (!objToken) {
      return responseJSON(false, 'token_invalid', 'Token Invalido.', [], 401)
    }

    req.body.jwt_usuario_id = objToken.id
    req.body.jwt_usuario_role = objToken.role
    req.body.jwt_usuario_alias = objToken.usn

    const newToken = await createToken({
      sub: 'update', aud: 'web', id: objToken.id, role: objToken.role, usn: objToken.usn
    })
    await tokenInCookie(res, newToken)
    next()
  }

  async register (req: Request) {
    const objUser = new User()
    objUser.username = req.body.username
    objUser.firstName = req.body.firstName
    objUser.lastName = req.body.lastName
    objUser.email = req.body.email
    objUser.age = parseInt(req.body.age)
    objUser.password = await bcrypt.hashSync(req.body.password, SALT)
    objUser.role = 'ROLE_USER'
    objUser.isStatus = true
    objUser.isDeleted = false
    objUser.fechaCreacion = new Date(
      new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires'
      })
    )

    const errVendedor = await validate(objUser, { validationError: { target: false, value: false } })
    if (errVendedor.length > 0) {
      return responseJSON(false, 'error_in_parameters', 'Usuario con errores', errVendedor, 200)
    }

    try {
      await getRepository(User).save(objUser)

      return responseJSON(true, 'user_created', 'User Craeted.', objUser, 201)
    } catch (error) {
      return responseJSON(false, 'error_internal', 'Error Interno', [], 500)
    }
  }

  async forget (req : Request) {
    const { id, username, age } = req.body

    if (!id || !username || !age) {
      responseJSON(false, 'without_parameters', 'parameters null', [], 200)
    }

    const objUser = await getRepository(User).createQueryBuilder('user')
      .where('user.username = :_username AND user.isStatus = true AND user.isDeleted = false', { _username: username })
      .getOne()

    if (!objUser) {
      return responseJSON(true, 'user_not_found', 'data invalid', [], 200)
    }
    return responseJSON(true, 'password_update', `password send to eamil: ${objUser.email}`, [], 200)
  }
}
