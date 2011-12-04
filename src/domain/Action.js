/** Represents an action taken by an organization.
 * @class
 */
App.domain.Action = Model(
/** @lends App.domain.Action */
{
  /** Name of the table.
   * @constant
   */
  table : "actions",

  /** Columns definitions for the table.
   */
  definition : {
    /** Unique identifier. It's never null.
     * @type Number
     */
    id : { type: Sequelize.INTEGER, autoIncrement: true },

    /** Action name. Cannot be null.
     * @type String
     */
    name : { type: Sequelize.STRING, allowNull: false },

    /** Description.
     * @type String
     */
    description : { type: Sequelize.TEXT, allowNull: false },

    /** Latitude in the map.
     * @type Number
     */
    lat : { type: Sequelize.STRING, allowNull: false },

    /** Longitude in the map.
     * @type Number
     */
    lng : { type: Sequelize.STRING, allowNull: false },

    /** Organization name. Cannot be null.
     * @type String
     */
    org : { type: Sequelize.STRING, allowNull: false },

    /** Region where the action occurs.
     */
    region : { type: Sequelize.STRING, allowNull: false },
  }
});

