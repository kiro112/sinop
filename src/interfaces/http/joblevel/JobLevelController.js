'use strict';

const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const JobLevelController = {
  get router() {
    const router = Router();
    
    router.use(inject('JobLevelSerializer'));

    router.get('/', inject('GetLevels'), this.index);
    router.get('/:id', inject('GetLevel'), this.show);
    router.post('/', inject('CreateLevel'), this.add);
    router.put('/:id', inject('UpdateLevel'), this.update);
    router.delete('/:id', inject('DeleteLevel'), this.remove);

    return router;
  },

  index(req, res, next) {
    const {
      GetLevels,
      JobLevelSerializer
    } = req;

    const {
      SUCCESS,
      ERROR
    } = GetLevels.outputs;

    GetLevels
      .on(SUCCESS, levels => {
        res
          .status(Status.OK)
          .json(levels.map(JobLevelSerializer.serialize));
      })
      .on(ERROR, next);
    
    GetLevels.execute();
  },

  show(req, res, next) {
    const {
      GetLevel,
      JobLevelSerializer
    } = req;

    const {
      SUCCESS,
      ERROR,
      NOT_FOUND
    } = GetLevel.outputs;

    GetLevel
      .on(SUCCESS, level => {
        res
          .status(Status.OK)
          .json(JobLevelSerializer.serialize(level));
      })
      .on(NOT_FOUND, error => {
        res
          .status(Status.NOT_FOUND)
          .json({
            type: error.message,
            details: error.details
          });
      })
      .on(ERROR, next);

    GetLevel.execute(Number(req.params.id));
  },

  add(req, res, next) {
    const {
      CreateLevel,
      JobLevelSerializer
    } = req;

    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR
    } = CreateLevel.outputs;

    CreateLevel
      .on(SUCCESS, level => {
        res
          .status(Status.OK)
          .json(JobLevelSerializer.serialize(level));
      })
      .on(VALIDATION_ERROR, error => {
        res
          .status(Status.BAD_REQUEST)
          .json({
            type: error.message,
            details: error.details
          });
      })
      .on(ERROR, next);
    
    CreateLevel.execute(req.body);
  },

  update(req, res, next) {
    const {
      UpdateLevel,
      JobLevelSerializer
    } = req;

    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR,
      NOT_FOUND
    } = UpdateLevel.outputs;

    UpdateLevel
      .on(SUCCESS, level => {
        res
          .status(Status.OK)
          .json(JobLevelSerializer.serialize(level));
      })
      .on(NOT_FOUND, error => {
        res
          .status(Status.NOT_FOUND)
          .json({
            type: error.message,
            details: error.details
          });
      })
      .on(VALIDATION_ERROR, error => {
        res
          .status(Status.NOT_FOUND)
          .json({
            type: error.message,
            details: error.details
          });
      })
      .on(ERROR, next);
    
    UpdateLevel.execute(Number(req.params.id), req.body);
  },

  remove(req, res, next) {
    const {
      DeleteLevel,
    } = req;

    const {
      SUCCESS,
      NOT_FOUND,
      ERROR
    } = DeleteLevel.outputs;

    DeleteLevel
      .on(SUCCESS, () => {
        res
          .status(Status.OK)
          .end();
      })
      .on(NOT_FOUND, error => {
        res
          .status(Status.OK)
          .json({
            type: error.message,
            details: error.details
          });
      })
      .on(ERROR, next);

    DeleteLevel.execute(Number(req.params.id))
  }
};

module.exports = JobLevelController;