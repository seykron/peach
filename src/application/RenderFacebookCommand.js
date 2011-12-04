App.route("/render", { method : "post" }, Class.create({

  /** Renders the application on facebook.
   */
  execute : function() {
    var mav = new App.ModelAndView("facebook.html");

    App.domain.Region.findAll().on("success", function(regions) {
      mav.model.regions = regions;
      App.domain.Organization.find({
        where: { name: "UTPMP" }
      }).on("success", function(organization) {
        mav.model.organization = organization;
        App.domain.Action.findAll({
          where : { org : "UTPMP" }
        }).on("success", function(actions) {
          mav.model.actions = actions;
          mav.resume();
        });
      }).on("failure", function(errors) {
        console.log(errors);
      });
    });

    return mav.defer();
  }
}));

