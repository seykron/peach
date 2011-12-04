App.route("/actions/:organization/list", {}, Class.create({

  /** Organization name; it's never null.
   * @type String
   */
  organization : null,

  /** Returns the organization with all actions.
   */
  execute : function() {
    var mav = new App.ModelAndView("actions.html");

    App.domain.Organization.find({
      where: { name: this.organization }
    }).on("success", function(organization) {
      mav.model.organization = organization;
      App.domain.Action.findAll({
        where : { org : organization.name }
      }).on("success", function(actions) {
        mav.model.actions = actions;
        mav.resume();
      });
    }).on("failure", function(errors) {
      console.log(errors);
    });

    return mav.defer();
  }
}));

