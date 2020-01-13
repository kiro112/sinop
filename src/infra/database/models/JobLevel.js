'use strict';

module.exports = function(sequelize, DataTypes) {
  const JobLevel = sequelize.define('job_level', {
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods: {
      associate() {
        // associations can be defined here
      }
    }
  });

  return JobLevel;
};
