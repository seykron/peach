(function($) {
  Peach.ActionItem = Backbone.View.extend({
    /** Map to indicate the location of this action.
     * @type Peach.Map
     */
    map : null,

    /** Action represented by this item.
     * @type Object
     */
    action : null,

    /** Indicates whether the view is read-only.
     */
    readOnly : null,

    /** Initializes the action item.
     */
    initialize : function() {
      var self = this;

      this.action = this.options.action;
      this.readOnly = (this.options.readOnly == undefined) ? true :
          this.options.readOnly;

      this.map = new Peach.Map({
        el : $(this.el).find(".action-map")[0],
        markOnClick : !this.readOnly,
        marker : {
          content : "Click para eliminar!"
        },
        position : {
          lat : this.action.lat,
          lng : this.action.lng
        }
      }).click(function(event) {
        if (!self.readOnly) {
          self.action.lat = event.lat;
          self.action.lng = event.lng;
          self.save();
        }
      });

      var donateCheck = $(this.el).find("input[type=checkbox]");

      donateCheck.click(function(event) {
        self.donate = $(event.target).val();
        self.save();
      });
      if (this.readOnly) {
        donateCheck.attr("disabled", "disabled");
      } else {
        donateCheck.removeAttr("disabled");
      }
    },

    /** Saves this action.
     */
    save : function() {
      if (!this.readOnly) {
        $.post("save", this.action, function(result) {
          console.log(result);
        }).error(function(result) {
          alert("No se pudo guardar la acción.")
        });
      }
    }
  });
}(jQuery));

