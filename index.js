/**
 * Create a list of all paths and their minimum access level
 * @param {Array<Object>} Registry array of routes
 * @returns {Array<Object>} modified registry
 */
const getAllPaths = (registry) => {
  const newRegistry = [];
  registry.forEach(() => {
    registry.forEach(path => {
      if ((!path.parent || path.parent === '/') && !newRegistry.find(aux => aux.absolutePath === path.path)){ // PATH AS ABSOLUTE
        newRegistry.push({...path ,absolutePath: path.path})
      } else {
        newRegistry.forEach(added => {
          if (path.parent === added.path && added.absolutePath != '/' && !newRegistry.find(aux => aux.absolutePath === added.absolutePath+path.path)) {
            newRegistry.push({...path, level: Math.max(added.level, path.level), absolutePath: added.absolutePath+path.path})
          }
        });
      }
    });
  });
  return newRegistry;
}

/**
 * Check accessibilty for a user
 * @param {Object} User { name: string, level: number }
 * @param {String} Path path to check
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Boolean} if the user has acces
 */
const hasAccess = (user, path, paths) => {
  if (user && user.level && path && paths.length) {
  const aux = paths.find(regis => regis.absolutePath && regis.absolutePath === path);
  return aux ? (aux.level && aux.level <= user.level) : false;
 } 
}

/**
 * Get all paths a user has access too
 * @param {Object} User { name: string, level: number }
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Array<Object>} filtered array of routes
 */
const getUserPaths = (user, paths) => (user && paths.length) ? 
  paths.filter(registry => hasAccess(user, registry.absolutePath, paths)).map(filtered => ({absolutePath: filtered.absolutePath})) : [];

module.exports = {
  getAllPaths,
  hasAccess,
  getUserPaths
}