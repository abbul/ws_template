export const encodeBasic = function (username: String, password: String) {
  return Buffer.from(`${username}:${password}`).toString('base64')
}

export const generateRandomString = function (length: Number) {
  let randomString = ''
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let index = 0; index < length; index++) {
    randomString += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    )
  }

  return randomString
}

export const responseJSON = function (type: Boolean, result : String, message: String, body: Object, status?: number) {
  return {
    type: type ? 'success' : 'error',
    result: result,
    message: message,
    body: body,
    status: status
  }
}

export const sendMail = function (body: String) {
  if (!body) {
    return false
  }
  return true
}

export const errorsToSnake = async (errores: Array<any>) => {
  const newArray = []

  for await (const rowErr of errores) {
    rowErr.property =

      newArray.push({
        propiedad: rowErr.property.replace(/[A-Z]/g, (letter: any) => `_${letter.toLowerCase()}`),
        errores: Object.values(rowErr.constraints)
      })
  }
  return newArray
}
export interface IResponseJson {
  type: Boolean,
  message: String,
  body?: Object
  status?: Number,
}

export const validAuthorization = (roleRequired: String, roleUser: String): boolean => {
  let roleNumber: Number

  switch (roleRequired) {
    case 'ROLE_VENDEDOR':
      roleNumber = 0
      break
    case 'ROLE_ADMIN':
      roleNumber = 10
      break
    default:
      roleNumber = -1
      break
  }

  switch (roleUser) {
    case 'ROLE_VENDEDOR':
      return roleNumber <= 0
    case 'ROLE_ADMIN':
      return roleNumber <= 10
    default:
      return false
  }
}
