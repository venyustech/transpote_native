import { cloudFunctionServerUrl } from '../../common/serverUrl'
import axios from 'axios'

export const updateUser = async (idFirebase, params) => {
  try {
    const user = await getUser(idFirebase)

    if (!user && params.type) {
      return await createUser(params)
    } else if (!user) {
      return null
    }

    const { data: response } = await axios.put(
      `${cloudFunctionServerUrl}/api/v1/user/${idFirebase}`,
      params
    )

    return response
  } catch (err) {
    let error = err
    let messageError = 'Não fo possível processar solicitação'

    if (err.response && err.response.data) {
      error = err.response.data
      if (error.message) {
        messageError = error.message
      }
    }

    return {
      status: false,
      message: messageError
    }
  }
}

const getUser = async idFirebase => {
  try {
    const { data: user } = await axios.get(
      `${cloudFunctionServerUrl}/api/v1/user/one?idFirebase=${idFirebase}`
    )
    return user
  } catch (err) {
    return null
  }
}

const createUser = async user => {
  try {
    const { data: response } = await axios.post(
      `${cloudFunctionServerUrl}/api/v1/user`,
      user
    )

    return response
  } catch (err) {
    return null
  }
}
