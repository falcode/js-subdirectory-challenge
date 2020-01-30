const { getAllPaths, hasAccess, getUserPaths } = require('./');

// Paths and access levels
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

// Users with their access level
const users = [
  {
    name: 'superadmin',
    level: 1000,
  },
  {
    name: 'guest',
    level: 201,
  },
  {
    name: 'john',
    level: 301,
  },
];

describe('PayFit Onsite Challenge', () => {
  describe('Get all paths', () => {
    const paths = getAllPaths(registry);

    const availablePaths = [
      '/',
      '/projects',
      '/photos',
      '/projects/laboratory',
      '/projects/john',
      '/projects/secret',
      '/projects/secret/rocket',
      '/one',
      '/one/two',
      '/one/two/three',
      '/one/two/three/four',
      '/one/two/three/four/five',
    ];
    it('should have correct length', () => {
      expect(paths).toHaveLength(availablePaths.length);
    });

    availablePaths.forEach(path => {
      it(`should return the path ${path}`, () => {
        expect(paths.find(p => p.absolutePath === path)).toBeTruthy();
      });
    });
  });

  describe('Check user access should return true when we have the right level', () => {
    const paths = getAllPaths(registry);

    describe('superadmin', () => {
      const superadmin = users[0];

      const testCases = [
        { input: '/', expected: true },
        { input: '/photos', expected: true },
        { input: '/projects', expected: true },
        { input: '/projects/laboratory', expected: true },
        { input: '/projects/john', expected: true },
        { input: '/projects/secret', expected: true },
        { input: '/projects/secret/rocket', expected: true },
        { input: '/one', expected: true },
        { input: '/one/two', expected: true },
        { input: '/one/two/three', expected: true },
        { input: '/one/two/three/four', expected: true },
        { input: '/one/two/three/four/five', expected: true },
      ];

      testCases.forEach(({ input, expected }) => {
        it(`hasAccess of "${input}" should be ${expected}`, () => {
          expect(hasAccess(superadmin, input, paths)).toBe(expected);
        });
      });
    });

    describe('guest', () => {
      const testCases = [
        { input: '/', expected: true },
        { input: '/photos', expected: true },
        { input: '/projects', expected: true },
        { input: '/projects/laboratory', expected: true },
        { input: '/projects/john', expected: false },
        { input: '/projects/secret', expected: false },
        { input: '/projects/secret/rocket', expected: false },
        { input: '/one', expected: false },
        { input: '/one/two', expected: false },
        { input: '/one/two/three', expected: false },
        { input: '/one/two/three/four', expected: false },
        { input: '/one/two/three/four/five', expected: false },
      ];

      const guest = users[1];

      testCases.forEach(({ input, expected }) => {
        it(`hasAccess of "${input}" should be ${expected}`, () => {
          expect(hasAccess(guest, input, paths)).toBe(expected);
        });
      });
    });

    describe('john', () => {
      const testCases = [
        { input: '/', expected: true },
        { input: '/photos', expected: true },
        { input: '/projects', expected: true },
        { input: '/projects/laboratory', expected: true },
        { input: '/projects/john', expected: true },
        { input: '/projects/secret', expected: false },
        { input: '/projects/secret/rocket', expected: false },
        { input: '/one', expected: false },
        { input: '/one/two', expected: false },
        { input: '/one/two/three', expected: false },
        { input: '/one/two/three/four', expected: false },
        { input: '/one/two/three/four/five', expected: false },
      ];
      const john = users[2];

      testCases.forEach(({ input, expected }) => {
        it(`hasAccess of "${input}" should be ${expected}`, () => {
          expect(hasAccess(john, input, paths)).toBe(expected);
        });
      });
    });
  });

  describe('Get all the user possibilities', () => {
    it('should return all paths for: superadmin', () => {
      const paths = getAllPaths(registry);

      const superadmin = users[0];

      const availablePaths = getUserPaths(superadmin, paths);

      expect(availablePaths).toHaveLength(12);

      availablePaths.forEach(path => {
        expect(hasAccess(superadmin, path.absolutePath, paths)).toBe(true);
      });
    });

    it('should return all paths for: guest', () => {
      const paths = getAllPaths(registry);

      const guest = users[1];

      const availablePaths = getUserPaths(guest, paths);

      expect(availablePaths).toHaveLength(4);

      availablePaths.forEach(path => {
        expect(hasAccess(guest, path.absolutePath, paths)).toBe(true);
      });
    });

    it('should return all paths for: john', () => {
      const paths = getAllPaths(registry);

      const john = users[2];

      const availablePaths = getUserPaths(john, paths);

      expect(availablePaths).toHaveLength(5);

      availablePaths.forEach(path => {
        expect(hasAccess(john, path.absolutePath, paths)).toBe(true);
      });
    });
  });
});
