const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const wordRoute = require('./word.route');
const translateRoute = require('./translate.route');
const projectRoute = require('./project.route');
const translationMemoryRoute = require('./translationmemory.route');
const dictionaryRoute = require('./dictionary.route');
// const translationMachineRoute = require('./translationmachine.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/word',
    route: wordRoute,
  },
  {
    path: '/TranslationMemories',
    route: translationMemoryRoute,
  },
  // {
  //   path: '/translation',
  //   route: translationMachineRoute,
  // },
  {
    path: '/translate',
    route: translateRoute,
  },
  {
    path: '/project',
    route: projectRoute,
  },
  {
    path: '/dictionaries',
    route: dictionaryRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
