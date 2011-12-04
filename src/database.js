(function() {
  /** Domain namespace. */
  App.domain = {};

  Sequelize = require("sequelize");

  /** Functions invoked once the domain objects are already created.
   * @type Function[]
   */
  var callbacks = [];

  /** Wrapper function to create Sequelize entities.
   *
   * @param {Object} object Object passed to the Sequelize
   *    <code>instanceMethods</code> option.
   * @param {String} object.table Name of the table. Cannot be null or empty.
   * @param {Object} definition Columns definition. Cannot be null.
   * @param {Function} [callback] Function invoked after all model objects are
   *    created. Can be null.
   *
   * @return {Object} A Sequelize entity.
   */
  Model = function(object, callback) {
    if (callback) {
      callbacks.push(callback);
    }

    return Model.define(object.table, object.definition, {
      instanceMethods : object
    });
  };

  Object.extend(Model, {
    /** Must be executed once all domain objects are already created.
     */
    setupRelationships : function() {
      callbacks.each(function(callback) {
        callback();
      });
    }
  });

  // Configuration for development mode.
  Server.configure("dev", function() {
    // Extends the Model global object with sequelize.
    Object.extend(Model, new Sequelize("peach", "admin", "admin", {
      host: 'localhost',
      logging: true,

      maxConcurrentQueries: 100,

      // specify options, which are used when sequelize.define is called
      // the following example is basically the same as:
      // sequelize.define(name, attributes, { timestamps: false })
      // so defining the timestamps for each model will be not necessary
      define: {
        timestamps: false,
        underscored: true,
        freezeTableNames : true,
        charset : "utf8"
      },

      // similiar for sync: you can define this to always force sync for models
      sync: { force: true }
    }));
  });
}());

