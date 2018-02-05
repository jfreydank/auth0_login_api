function(user, context, callback) {
  user.app_metadata = user.app_metadata || {};
  // update the app_metadata that will be part of the response
  user.app_metadata.roles = user.app_metadata.roles || [];
  var title = user.app_metadata.title || 'clerk';
  if (user.app_metadata.roles.indexOf(title) === -1) {
    user.app_metadata.roles.push(title);
  }

  addScopeByTitle(title);


  // persist the app_metadata update
  auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
    .then(function () {
      context.accessToken['http://localhost:3001/roles'] = user.app_metadata.roles;
      callback(null, user, context);
    })
    .catch(function (err) {
      callback(err);
    });

  function addScopeByTitle(title) {
    var scopes = [];

    if (title === 'admin') {
      scopes.push('delete:api');
      scopes.push('write:api');
      scopes.push('read:api');
    }
    if (title === 'clerk') {
      scopes.push('read:api');
    }
    if (title === 'manager') {
      scopes.push('write:api');
      scopes.push('read:api');
    }
    // add offline_access scope to allow refresh token for mobile
    scopes.push('offline_access');
    context.accessToken.scope = scopes;
  }

}