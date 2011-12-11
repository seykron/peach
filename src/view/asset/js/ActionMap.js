(function($) {
  Peach.Map = Backbone.View.extend({
    /** Current marker.
     * @type google.maps.Marker
     */
    marker : null,

    /** Map to place this action.
     * @type google.maps.Map
     */
    map : null,

    /** Click event handlers.
     * @type Function[]
     */
    clickHandlers : null,

    /** Initializes the action map.
     */
    initialize : function() {
      this.clickHandlers = [];
      this.createMap();
    },

    /** Creates the map for this action.
     */
    createMap : function() {
      var self = this;
      var options = {
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      if (this.options.position) {
        options.center = new google.maps.LatLng(
          this.options.position.lat, this.options.position.lng);
      }

      this.map = new google.maps.Map($(this.el)[0], options);

      google.maps.event.addListener(this.map, 'click', function(event) {
        if (self.options.markOnClick) {
          self.placeMarker(event.latLng);
        }
        _.each(self.clickHandlers, function(handler) {
          handler({
            lat : event.latLng.lat(),
            lng : event.latLng.lng()
          });
        });
      });

      if (options.center) {
        this.placeMarker(options.center);
      }
    },

    /** Registers an event handler for the click event.
     */
    click : function(callback) {
      this.clickHandlers.push(callback);
      return this;
    },

    /** Moves the marker to the specified position.
     */
    placeMarker : function(position) {
      var marker = this.marker;
      var map = this.map;

      if (marker) {
        marker.setMap(null);
      }

      var title = "";

      if (this.options.marker && this.options.marker.content) {
        title = this.options.marker.content;
      }

      marker = new google.maps.Marker({
        position: position,
        map: map,
        title : title
      });

      google.maps.event.addListener(marker, 'click', function(event) {
        marker.setMap(null);
      });

      map.panTo(position);

      this.marker = marker;
    }
  });
}(jQuery));

