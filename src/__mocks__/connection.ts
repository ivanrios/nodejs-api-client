import { mocks, requestErrors } from '../__mockData__/connection-mock'

export enum TYPES {
  'json',
  'multipart'
}

export interface Payload {
  [selector: string]: object | string
}

export class Connection {
  static post(path: string, payload: Payload, type?: number): Promise<any> {
    const reqError = requestErrors.post.getModel(path)
    if (reqError.exists()) {
      for (const key in payload) {
        const error = reqError.resp(key)
        if (error && payload[key] === error.key) {
          return Promise.reject({ errors: [error.error] })
        }
      }
    }
    try {
      let response = mocks.get(path)
      response = response instanceof Array ? response[0] : response
      return Promise.resolve(response)
    } catch (err) {
      throw `Debug: Define '${path}' in conntection-mock.ts`
    }
  }

  static put(path: string): Promise<any> {
    let id = null
    if (path.indexOf('/')) {
      id = path.split('/').reverse()[0]
    }
    if (id === requestErrors.get.notFoundId) {
      return Promise.reject({ errors: ['does not exists']  })
    }
    return Promise.resolve({ status: 'success', message: 'Deleted' })
  }

  static delete(path: string): Promise<any> {
    let id = null
    if (path.indexOf('/')) {
      id = path.split('/').reverse()[0]
    }
    if (id === requestErrors.get.notFoundId) {
      return Promise.reject({ errors: ['does not exists']  })
    }
    return Promise.resolve({ status: 'success', message: 'Deleted' })
  }

  static get(path: string, query?: Payload): Promise<any> {
    let id = query && query.id
    if (!id && path.indexOf('/')) {
      id = path.split('/').reverse()[0]
    }
    if (id === requestErrors.get.notFoundId) {
      return Promise.reject({ errors: ['does not exists']  })
    }
    const mocked = mocks.get(path)
    const ret = query ? mocked[0] : mocked
    return Promise.resolve(ret)
  }

  static execute(options: any): Promise<any> {
    let id
    const path = options.url
    if (path.indexOf('/')) {
      if (path.split('/').indexOf(requestErrors.get.notFoundId) !== -1) {
        id = requestErrors.get.notFoundId
      }
    }
    if (id === requestErrors.get.notFoundId) {
      return Promise.reject({ errors: ['does not exists']  })
    }
    const mocked = mocks.get(path)
    try {
      return Promise.resolve(mocked)
    } catch (err) {
      throw `Debug: Define '${path}' in conntection-mock.ts`
    }
  }
}
