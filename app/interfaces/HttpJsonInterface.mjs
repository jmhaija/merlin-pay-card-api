export default {
  created(status, message, resources) {
    return {
      success: true,
      status: status || 'RESOURCE_CREATED',
      message: message || 'The resource was successfully created',
      resources: resources || {}
    }
  },

  retrieved(status, message, resources) {
    return {
      success: true,
      status: status || 'RESOURCE_RETRIEVED',
      message: message || 'The resource was successfully retrieved',
      resources: resources || {}
    }
  },

  updated(status, message, resources) {
    return {
      success: true,
      status: status || 'RESOURCE_UPDATED',
      message: message || 'The resource was successfully updated',
      resources: resources || {}
    }
  },

  deleted(status, message) {
    return {
      success: true,
      status: status || 'DELETED'
    }
  },

  notfound(status, message) {
    return {
      success: false,
      status: status || 'RESOURCE_NOT_FOUND',
      message: message || 'The requested resource could not be found'
    }
  },

  malformed(status, message) {
    return {
      success: false,
      status: status || 'MALFORMED_REPRESENTATION',
      message: message || 'The model representation is malformed and cannot be used to create a resource'
    }
  },

  conflict(status, message, resources) {
    return {
      success: false,
      status: status || 'CONFLICT',
      message: message || 'A resource with the specified primary key already exists',
      resources: resources || {}
    }
  },

  unauthorized(status, message) {
    return {
      success: false,
      status: status || 'UNAUTHORIZED',
      message: message || 'You are not authorized to access this resource'
    }
  },

  error(status, message) {
    return {
      success: false,
      status: status || 'ERROR',
      message: message || 'An error occured trying to process request'
    }
  }
}
