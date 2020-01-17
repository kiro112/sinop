'use strict';

module.exports = function(sequelize, DataTypes) {
  const FormTemplateText = sequelize.define('form_template_text', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.TEXT,
    group_item_order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
        FormTemplateText.belongsTo(models.FormTemplateCompetencyGroup);
      }
    }
  });

  return FormTemplateText;
};
