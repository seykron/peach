(function ($) {
  // Namespace
  Peach = {
    /**
     * Generates the accordion and initializes the map and its functionality.
     * @constructor
     */
    initialize: function() {
      $('#accordion').accordion({
        header: 'h2',
        autoHeight: false
      });
    }
  }
})(jQuery);
