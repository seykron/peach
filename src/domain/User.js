App.domain.User = Model({
  /** Table name.
   * @type String
   */
  table : "users",

  definition : {
    id : { type: Sequelize.INTEGER, autoIncrement: true },
    name : { type: Sequelize.STRING, allowNull: false },
    email : { type: Sequelize.STRING, allowNull: false }
  }
});

