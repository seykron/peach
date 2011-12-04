App.route("/render", { method : "post" }, Class.create({

  /** Renders the application on facebook.
   */
  execute : function() {
    var mav = new App.ModelAndView("facebook.html");

    App.domain.Region.findAll().on("success", function(regions) {
      mav.model.regions = regions;
      mav.resume();
    });

    return mav.defer();
  }
}));

