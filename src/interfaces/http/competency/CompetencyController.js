'use strict';

const { Router } = require('express');
const { inject } = require('awilix-express');
const Status = require('http-status');

const CompetencyController = {
  
  get router() {
    const router = Router();

    router.use(inject('CompetencySerializer'));

    router.get('/', inject('GetCompetencies'), this.index);
    router.get('/:id', inject('GetCompetency'), this.show);
    router.put('/:id', inject('UpdateCompetency'), this.update);

    return router;
  },

  index(req, res, next) {
    const {
      GetCompetencies,
      CompetencySerializer
    } = req;

    const {
      SUCCESS,
      ERROR
    } = GetCompetencies.outputs;

    GetCompetencies
      .on(SUCCESS, competencies => {
        res
          .status(Status.OK)
          .json(competencies.map(CompetencySerializer.serialize));
      })
      .on(ERROR, next);

    GetCompetencies.execute();
  },

  show(req, res, next) {
    const {
      GetCompetency,
      CompetencySerializer
    } = req;

    const {
      SUCCESS,
      ERROR,
      NOT_FOUND
    } = GetCompetency.outputs;

    GetCompetency
      .on(SUCCESS, competency => {
        res
          .status(Status.OK)
          .json(CompetencySerializer.serialize(competency));
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

    GetCompetency.execute(Number(req.params.id));
  },

  update(req, res, next) {
    const {
      UpdateCompetency,
      CompetencySerializer
    } = req;

    const {
      SUCCESS,
      ERROR,
      NOT_FOUND,
      VALIDATION_ERROR
    } = UpdateCompetency.outputs;

    UpdateCompetency
      .on(SUCCESS, competency => {
        res
          .status(Status.OK)
          .json(CompetencySerializer.serialize(competency));
      })
      .on(NOT_FOUND, error => {
        res
          .status(Status.NOT_FOUND)
          .json({
            type: error.type,
            details: error.details
          });
      })
      .on(VALIDATION_ERROR, error => {
        res
          .status(Status.BAD_REQUEST)
          .json({
            type: error.type,
            details: error.details
          });
      })
      .on(ERROR, next);
    
    UpdateCompetency.execute(Number(req.params.id), req.body);
  }

};

module.exports = CompetencyController;