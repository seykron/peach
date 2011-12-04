/** Represents a non-profit organization.
 * @class
 */
App.domain.Organization = Model(
/** @lends App.domain.Organization */
{
  /** Name of the table.
   * @constant
   */
  table : "organizations",

  /** Columns definitions for the table.
   */
  definition : {
    /** Unique identifier. It's never null.
     * @type Number
     */
    id : { type: Sequelize.INTEGER, autoIncrement: true },

    /** Region name. Cannot be null.
     * @type String
     */
    name : { type: Sequelize.STRING, allowNull: false, unique: true }
  }
});

