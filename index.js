/**
 * Create a list of all paths and their minimum access level
 * @param {Array<Object>} Registry array of routes
 * @returns {Array<Object>} modified registry
 */
const getAllPaths = (registry) => {
  const newRegistry = [];
  registry.forEach(absolut => {
    if (!absolut.parent || absolut.parent === '/'){ // PATH AS ABSOLUTE
      newRegistry.push({...absolut, absolutePath: absolut.path})
    } else if (newRegistry.some(aux => aux.absolutePath === absolut.parent)) { // PARENT ALREADY DEFINED AS ABSOLUTE
      newRegistry.push({...absolut, absolutePath: absolut.parent+absolut.path})
    } else {
      const pathAsParent = newRegistry.filter(aux => aux.path === absolut.parent)[0] // PARENT IS NOT ABSOLUTE
      if (pathAsParent) {
        newRegistry.push({...absolut, level: pathAsParent.level, absolutePath: pathAsParent.absolutePath+absolut.path});
      }
    }
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
  return paths.filter(regis =>regis.absolutePath === path)[0].level <= user.level; 
}

/**
 * Get all paths a user has access too
 * @param {Object} User { name: string, level: number }
 * @param {Array<Object>} ModifiedRegistry getAllPaths() result
 * @returns {Array<Object>} filtered array of routes
 */
const getUserPaths = (user, paths) => {
  return (paths.filter(registry => registry.level <= user.level)).map(filtered => ({absolutePath: filtered.absolutePath}));
}

module.exports = {
  getAllPaths,
  hasAccess,
  getUserPaths
}

