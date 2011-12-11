App.route("/actions/:organization/save", {
  method : ["get", "post"]
}, Class.create({

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

  /** Region where the action applies to.
   */
  region : null,

  /** Saves an action.
   */
  execute : function(context) {
    var mav;

    if (context.isSubmit) {
      mav = new App.ModelAndView("actions.html");

      // Update
      if (this.id) {
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
      } else {
      // Create
        var action = App.domain.Action.build({
          name : this.name,
          description : this.description,
          org : this.organization,
          donate : this.donate || false,
          lat : this.lat,
          lng : this.lng,
          region : this.region
        });
        action.save().on("success", function() {
          mav.resume();
        });
        return mav.redirect("listActions").defer();
      }
    } else {
      // Create view.
      mav = new App.ModelAndView("saveAction.html");

      App.domain.Region.findAll().on("success", function(regions) {
        mav.model.regions = regions;
        mav.resume();
      });
    }

    return mav.defer();
  }
}));

