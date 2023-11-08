import Constants from 'expo-constants'

// export const cloud_function_server_url =
//   Constants.manifest.extra.cloud_function_server_url

let url = ''

if (Constants.manifest.extra.production) {
  url = Constants.manifest.extra.cloud_function_server_url
} else {
  url = Constants.manifest.extra.cloud_function_server_local
}

export const cloud_function_server_url = url
export const cloudFunctionServerUrl = url
