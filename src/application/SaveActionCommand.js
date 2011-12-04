App.route("/actions/save", { method : "post" }, Class.create({

  /** Organization name; it's never null.
   * @type String
   */
  organization : null,

  /** Action id. It cannot be null.
   * @type Number
   */
  id : null,

  /** Action name. It cannot be null or empty.
   * @type String
   */
  name : null,

  /** Action description. It cannot be null.
   * @type String
   */
  description : null,

  /** Indicates whether the action receives donations or not. Default is false.
   * @type Boolean
   */
  donate : null,

  /** Latitude of the location where the action occurs.
   * @type Number
   */
  lat : null,

  /** Longitude of the location where the action occurs.
   * @type Number
   */
  lng : null,

  /** Saves an action.
   */
  execute : function() {
    var mav = new App.ModelAndView("actions.html");

    App.domain.Action.find({
      where: { id: this.id }
    }).on("success", function(action) {
      action.name = this.name;
      action.description = this.description;
      action.donate = this.donate || false;
      action.lat = this.lat;
      action.lng = this.lng;
      action.save().on("success", function() {
        mav.resume();
      });
    }.bind(this));

    return mav.defer();
  }
}));

