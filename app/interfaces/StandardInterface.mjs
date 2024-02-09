export default {
  success(object) {
    return {
      ok: true,
      isEmpty: object === null || Object.keys(object).length === 0,
      object: object
    }
  },
  
  error(object) {
    return {
      ok: false,
      error: object
    }
  }
}
