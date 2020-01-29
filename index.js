const registry = [
  {
    path: '/',
    parent: null,
    level: 1,
  },
  {
    path: '/rocket',
    parent: '/secret',
    level: 10,
  },
  {
    path: '/secret',
    parent: '/projects',
    level: 999,
  },
  {
    path: '/projects',
    parent: '/',
    level: 100,
  },
  {
    path: '/photos',
    parent: '/',
    level: 200,
  },
  {
    path: '/laboratory',
    parent: '/projects',
    level: 200,
  },
  {
    path: '/john',
    parent: '/projects',
    level: 299,
  },
  // This path in unreachable from / - so it should not be returned in getAllPaths
  {
    path: '/dummy',
    parent: '/path',
    level: 666,
  },
  // we have to go deeper - shuffled on purpose
  {
    path: '/five',
    parent: '/four',
    level: 1,
  },
  {
    path: '/one',
    parent: '/',
    level: 999, // ensure we propagate levels
  },
  {
    path: '/four',
    parent: '/three',
    level: 1,
  },
  {
    path: '/three',
    parent: '/two',
    level: 1,
  },
  {
    path: '/two',
    parent: '/one',
    level: 1,
  },
];
/**
 * Create a list of all paths and their minimum access level
 * @param {Array<Object>} Registry array of routes
 * @returns {Array<Object>} modified registry
 */
const getAllPaths = (registry) => {
  const newRegistry = [];
  // registry.forEach(absolut => {
  //   if (!absolut.parent || absolut.parent === '/'){ // PATH AS ABSOLUTE
  //     newRegistry.push({...absolut, absolutePath: absolut.path})
  //   } else if (newRegistry.some(aux => aux.absolutePath === absolut.parent)) { // PARENT ALREADY DEFINED AS ABSOLUTE
  //     newRegistry.push({...absolut, absolutePath: absolut.parent+absolut.path})
  //   } else {
  //     const pathAsParent = newRegistry.filter(aux => aux.path === absolut.parent)[0] // PARENT IS NOT ABSOLUTE
  //     if (pathAsParent) {
  //       newRegistry.push({...absolut, level: pathAsParent.level, absolutePath: pathAsParent.absolutePath+absolut.path});
  //     }
  //   }
  // });
  registry.forEach(parent => {
    registry.forEach(path => {
      if (!parent.parent || parent.parent === '/' || !newRegistry.find(aux => aux.absolutePath === parent.path || aux.absolutePath === parent.parent)){ // PATH AS ABSOLUTE
        newRegistry.push({...parent, absolutePath: parent.path})
      }
      // if (
      //     parent.parent && 
      //     parent.parent !== '/' && 
      //     path.parent === parent.parent && 
      //     newRegistry.find(aux => aux.parent === path.parent) 
      //   ) {
      //   newRegistry.push({...path,  level: Math.max(parent.level, path.level) , absolutePath: parent.parent+path.path})
         
      // } else if (path.parent && path.parent !== '/' && !newRegistry.find(added => added.absolutePath === path.parent+path.path)) {
      //   console.log('no added', path);
      // }
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

console.log(getAllPaths(registry).map(e => 'added ' + ' path: "' +e.path + '" parent: "'+ e.parent + '" absolutePath: "'+e.absolutePath+'"'));
// console.log(getAllPaths(registry).map(e => e.absolutePath));



