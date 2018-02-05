module.exports = () => (req, res, next) => {
  const { user, method, path } = req
  const pathSplit = path.split('/')
  const action = pathSplit[pathSplit.length - 1]
  if (user) {
    const { scope } = user
    if (scope) {
      const scopes = scope.split(' ')
      // convention: map write to path ending with 'read' 
      if (action === 'read' && scopes.includes('read:api')) {
        return next()
      }
      // convention: map write to path ending with 'write' 
      if (action === 'write' && scopes.includes('write:api')) {
        return next()
      }
      // convention: map delete to path ending with 'delete' 
      if (action === 'delete' && scopes.includes('delete:api')) {
        return next()
      }
    }
  }
  // unauthorized 
  return res.status(401).send('Unauthorized')
}
