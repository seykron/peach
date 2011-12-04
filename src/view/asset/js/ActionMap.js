(function($) {
  Peach.ActionMap = Backbone.View.extend({
    /** Current marker.
     * @type google.maps.Marker
     */
    marker : null,

    /** Map to place this action.
     * @type google.maps.Map
     */
    map : null,

    /** Initializes the action map.
     */
    initialize : function() {
      this.createMap();
      this.action = this.options.action;
    },

    /** Creates the map for this action.
     */
    createMap : function() {
      var self = this;
      var options = {
        zoom: 5,
        center: new google.maps.LatLng(-35.42486767334695, -65.03906237499996),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map($(this.el).find(".action-map")[0], options);

      google.maps.event.addListener(map, 'click', function(e) {
        self.placeMarker(e.latLng, map);
      });
    },

    /** Moves the marker to the specified position.
     */
    placeMarker : function(position) {
      var marker = this.marker;
      var map = this.map;

      if (marker) {
        marker.setMap(null);
      }

      marker = new google.maps.Marker({
        position: position,
        map: map,
        title : "Click para eliminar!"
      });

      google.maps.event.addListener(marker, 'click', function(event) {
        marker.setMap(null);
      });

      map.panTo(position);

      this.marker = marker;
      this.action.lat = position.lat();
      this.action.lng = position.lng();
    }
  });
}(jQuery));
