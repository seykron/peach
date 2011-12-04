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
      var self = this;

      this.action = this.options.action;
      this.view = this.options.view;

      this.createMap();

      var donateCheck = $(this.el).find("input[type=checkbox]");

      donateCheck.click(function(event) {
        self.donate = $(event.target).val();
        self.save();
      });
      if (this.view !== "bo") {
        donateCheck.attr("disabled", "disabled");
      } else {
        donateCheck.removeAttr("disabled");
      }
    },

    /** Saves this action.
     */
    save : function() {
      if (this.view === "bo") {
        $.post("/actions/save", this.action, function(result) {
          console.log(result);
        }).error(function(result) {
          alert("No se pudo guardar la acción.")
        });
      }
    },

    /** Creates the map for this action.
     */
    createMap : function() {
      var self = this;
      var position = new google.maps.LatLng(this.action.lat, this.action.lng);
      var options = {
        zoom: 5,
        center: position,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map($(this.el).find(".action-map")[0], options);

      google.maps.event.addListener(this.map, 'click', function(e) {
        self.placeMarker(e.latLng);
      });
      this.placeMarker(position);
    },

    /** Moves the marker to the specified position.
     */
    placeMarker : function(position) {
      var marker = this.marker;
      var map = this.map;
      var view = this.view;

      if (marker) {
        if (view === "bo") {
          marker.setMap(null);
        } else {
          return;
        }
      }

      marker = new google.maps.Marker({
        position: position,
        map: map,
        title : "Click para eliminar!"
      });

      google.maps.event.addListener(marker, 'click', function(event) {
        if (view === "bo") {
          marker.setMap(null);
        }
      });

      map.panTo(position);

      this.marker = marker;
      this.action.lat = position.lat();
      this.action.lng = position.lng();
      this.save();
    }
  });
}(jQuery));

