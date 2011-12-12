(function ($) {
  // Namespace
  Peach = {
    /**
     * Generates the accordion and initializes the map and its functionality.
     * @constructor
     */
    initialize: function() {
      $('.loading-notification').fadeOut();
      $('.action-list').accordion({
          header: "h3",
          clearStyle: true,
          active: false,
          icons: { 'header': 'ui-icon-plus', 'headerSelected': 'ui-icon-minus' } 
      });
      $('.steps-accordion').accordion({
        header: "h2",
        clearStyle: true
      }).fadeIn();
    }
  }
})(jQuery);
