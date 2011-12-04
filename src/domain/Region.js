/** Represents a region in a country.
 * @class
 */
App.domain.Region = Model(
/** @lends App.domain.Region */
{
  /** Name of the table.
   * @constant
   */
  table : "regions",

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
    name : { type: Sequelize.STRING, allowNull: false },

    /** ISO 3166-2 code of the region. Cannot be null.
     * @type String
     */
    code : { type: Sequelize.STRING, allowNull: false },

    /** Amount of people in the region.
     */
    population : { type: Sequelize.INTEGER, allowNull: false },

    /** Amount of physical housing in this region. */
    housing : { type: Sequelize.INTEGER, allowNull: false },

    /** Amount of families in this region. */
    households : { type: Sequelize.INTEGER, allowNull: false },

    /** Poverty rate in the region. */
    povertyRate : { type: Sequelize.STRING, allowNull: true },

    /** Indigence rate in the region. */
    indigenceRate : { type: Sequelize.STRING, allowNull: true },

    /** Poor houses in the region. */
    povertyHousing : { type: Sequelize.INTEGER, allowNull: false },

    /** Poor households in the region. */
    povertyHouseholds : { type: Sequelize.INTEGER, allowNull: false },

    /** Poverty population in the region. */
    povertyPopulation : { type: Sequelize.INTEGER, allowNull: false }
  }
});

