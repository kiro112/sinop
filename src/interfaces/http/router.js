const { Router } = require('express');
const statusMonitor = require('express-status-monitor');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');
const controller = require('./utils/createControllerRoutes');

module.exports = ({ config, containerMiddleware, loggerMiddleware, errorHandler, swaggerMiddleware }) => {
  const router = Router();

  /* istanbul ignore if */
  if(config.env === 'development') {
    router.use(statusMonitor());
  }

  /* istanbul ignore if */
  if(config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware)
    .use('/docs', swaggerMiddleware);

  /*
   * Add your API routes here
   *
   * You can use the `controllers` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   */

  apiRouter.use('/job-families', controller('jobfamily/JobFamilyController'));
  apiRouter.use('/job-designations', controller('jobdesignation/JobDesignationController'));
  apiRouter.use('/job-roles', controller('jobrole/JobRoleController'));
  apiRouter.use('/job-levels', controller('joblevel/JobLevelController'));
  apiRouter.use('/job-categories', controller('jobcategory/JobCategoryController'));
  apiRouter.use('/competency-groups', controller('competencygroup/CompetencyGroupController'));
  apiRouter.use('/competencies', controller('competency/CompetencyController'));
  apiRouter.use('/user-groups', controller('usergroup/UserGroupController'));
  apiRouter.use('/projects', controller('project/ProjectController'));
  apiRouter.use('/job-positions', controller('jobposition/JobPositionController'));


  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
