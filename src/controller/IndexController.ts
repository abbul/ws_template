import { responseJSON, encodeBasic, generateRandomString } from '../utils/myUtils'
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express'
import axios from 'axios'

export class IndexController {
  async welcome () {
    return responseJSON(true, 'ok', 'Welcome to the WS...', [])
  }

  async loginAPI (req: Request, res: Response) {
    const { code, password } = req.body
    const state = generateRandomString(16)

    if (!code || code.length < 1 || !password || password.length < 1) {
      return responseJSON(false, 'without_code_or_password', "Ingrese 'code' y 'password'.", [])
    }

    return axios({

      method: 'post',
      url: 'http://www.api.com',
      data: {
        state,
        grant_type: 'authentication_use'
      },
      headers: {
        Authorization: `Basic ${await encodeBasic(code, password)}`,
        'Content-Type': 'application/json'
      }
    })
      .then((body) => body.data)
      .catch((error) => {
        console.log(error.data)
        return responseJSON(false, 'error_ws', 'Error Interno. WSA', [], 401)
      }).then(async (objUsuario) => {
        return responseJSON(true, 'User Logeado', objUsuario, 200)
      })
      .catch((error) => {
        console.log(error)
        return responseJSON(false, 'error_internal', 'Error Interno.', [], 401)
      })
  }

  async getAPI (req: Request, res: Response) {
    const { code, token } = req.body
    const state = generateRandomString(16)

    if (!code || code.length < 1 || !token || token.length < 1) {
      return responseJSON(false, 'without_token_or_code', "Ingrese 'code' y 'token'.", [])
    }

    return axios({

      method: 'post',
      url: 'http://www.api.com/get/resource',
      data: {
        state,
        grant_type: 'authentication_use',
        code: code
      },
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((body) => body.data)
      .catch((error) => {
        console.log(error.data)
        return responseJSON(false, 'error_ws', 'Error Interno. WSA', [], 401)
      }).then(async (objUsuario) => {
        return responseJSON(true, 'Recursos', objUsuario, 200)
      })
      .catch((error) => {
        console.log(error)
        return responseJSON(false, 'error_internal', 'Error Interno.', [], 401)
      })
  }
}
