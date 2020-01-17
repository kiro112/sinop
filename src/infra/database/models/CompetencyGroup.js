'use strict';

module.exports = function(sequelize, DataTypes) {
  const CompetencyGroup = sequelize.define('competency_group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        CompetencyGroup.hasMany(models.Competency);
      }
    }
  });

  return CompetencyGroup;
};
