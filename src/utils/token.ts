// eslint-disable-next-line no-unused-vars
import { Response } from 'express'
import * as jwt from 'jsonwebtoken'
import secretKeyJWT from '../resource/secretKeyJWT.json'
// eslint-disable-next-line no-unused-vars
import { IToken, ITokenFull } from '../interface/IToken'

export const createToken = async function (objToken : ITokenFull) {
  const token = await jwt.sign(
    {
      iss: 'authorization_server',
      sub: objToken.sub,
      aud: objToken.aud,
      id: objToken.id,
      usn: objToken.usn,
      rol: objToken.role
    },
    process.env.secretKey || secretKeyJWT.dev,
    { expiresIn: '90min' }
  )
  return token
}

export const validToken = async function (authorization: string) {
  try {
    if (!authorization || authorization.length < 1) {
      return null
    }

    var decoded = await jwt.verify(authorization, process.env.secretKeyJWT || secretKeyJWT.dev)

    if (typeof decoded !== 'object') {
      return null
    }

    return validInterface(decoded)
  } catch (ex) {
    return null
  }
}

export const tokenInCookie = (res : Response, token : String) => {
  res.cookie('hr_rch', token, {
    path: '/',
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 900000
  })
}

export const tokenInHeader = (res : Response, token : String) => {
  res.set({
    Authorization: `${token}`,
    'Accept-Charset': 'utf-8',
    'Access-Control-Expose-Headers': 'Authorization'
  })
}

export const validInterface = function (newObject: any) : IToken {
  return { id: newObject.id, role: newObject.rol, usn: newObject.usn }
}
