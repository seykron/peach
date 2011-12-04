App.route("/", {}, Class.create({

  /** Retrieves the list of existing regions.
   */
  execute : function() {
    var mav = new App.ModelAndView("index.html");

    App.domain.Region.findAll().on("success", function(regions) {
      mav.model.regions = regions;
      mav.resume();
    });

    return mav.defer();
  }
}));

