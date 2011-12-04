(function ($) {
  // Namespace
  Peach = {
    /**
     * Generates the accordion and initializes the map and its functionality.
     * @constructor
     */
    initialize: function() {
      $('.loading-notification').fadeOut();
      $('.application-flow').accordion({ header: "h2" }).fadeIn();
    }
  }
})(jQuery);
