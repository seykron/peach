(function ($) {
  // Namespace
  MapView = {
    /**
     * Invokes the Google's geochart API and calls the drawRegionsMap when it's
     * loaded. Also sets an event handler to .backToMap links.
     * @constructor
     */
    initialize: function () {
      google.load('visualization', '1', {'packages': ['geochart']});
      google.setOnLoadCallback(this.initializeMap);
      $('a.backToMap').click(MapView.backToMap);
    },

    /**
     * Setups and shows the map's data. Also assigns the map's events.
     */
    initializeMap: function () {
      var data = new google.visualization.DataTable();
      
      // Before set the values into the chart, we have to tell how many will be
      var totalRows = 0;
      $.each(MapView.regions, function(index, value) {
        totalRows++;
      });
      data.addRows(totalRows);
      data.addColumn('string', 'Provincia');
      data.addColumn('number', 'Indice de pobreza');

      var i = 0;
      $.each(MapView.regions, function (code, item) {
        // The first element is the country, so let's skip it
        if (i > 0) { 
          data.setValue(i, 0, item.name);
          data.setValue(i, 1, Number(item.povertyRate));
        }
        i++;
      });

      var options = {
        width: 475,
        resolution: 'provinces',
        region: 'AR'
      };

      var container = document.getElementById('map_canvas');
      var geochart = new google.visualization.GeoChart(container);
      google.visualization.events.addListener(geochart, 'regionClick',
          MapView.provinceClickHandler);
      geochart.draw(data, options);
    },

    /**
     * Populates and shows a fancy dialog when the user click into a province.
     * @param {Object} event An object containing the property region, which
     *     contains the province ISO code.
     */
    provinceClickHandler: function (event) {
      var currentRegion = MapView.regions[event.region];
      $('#data-showroom').dialog({
        title: currentRegion.name,
        height: 200,
        width: 400,
        modal: true,
        position: [50, 100],
        show: 'drop'
      });

      $('td.population').text(currentRegion.population);
      var povertyIndigenceRate = Math.round((Number(currentRegion.povertyRate) 
          + Number(currentRegion.indigenceRate)) * 100) / 100;
      $('td.povertyIndigenceRate').text(povertyIndigenceRate + '%');
      $('td.povertyHousing').text(currentRegion.povertyHousing);
      $('button#selectRegion').button().bind('click', 
        { region: event.region }, MapView.useRegionHandler);
    },

    /**
     * Closes the dialog showed after click in a province and shows the first
     * step.
     */
    backToMap: function () {
      $('#data-showroom').dialog('close');
      $('.steps-accordion').accordion('activate', 0);
    },

    /**
     * Closes the province info dialog, shows the second step and assigns an
     * event to the .selectAction button.
     *
     * @param {Event} event The .selectRegion's button event.
     */
    useRegionHandler: function (event) {
      MapView.backToMap();
      $('.steps-accordion').accordion('activate', 1);
      var actionMaps = [];
      $(".action-item").each(function() {
        if ($(this).data("region") == event.data.region) {
          var className = $(this).attr("class");
          var actionId =
            parseInt(className.substr(className.lastIndexOf("-") + 1), 10);

          actionMaps.push(new Peach.ActionItem({
            el : this,
            action : MapView.actions[actionId],
            view : "fb"
          }));
          $(this).show();
        } else {
          $(this).hide();
        }
      });
      
      if ($(".action-list .action-item:visible").size() === 0) {
        $(".pickAnAction").addClass("hidden");
        $(".noAction").removeClass("hidden");
      } else {
        $(".pickAnAction").removeClass("hidden");
        $(".noAction").addClass("hidden");
      }

      $(".actions").accordion({ header : "h2" });

      $('button.selectAction').button().click(MapView.goAction);
    },

    /**
     * Shows the third step and assigns an event to the .actionLink link.
     *
     * @param {Event} event The .selectAction's button event.
     */
    goAction: function (event) {
      $('.steps-accordion').accordion('activate', 2);
      $('a.actionLink').button().click(MapView.dispatchLink);
    },

    /**
     * Shows a thank you dialog.
     *
     * @param {Event} event The .actionLink's link event.
     */
    dispatchLink: function (event) {
      $('.thanksDialog').dialog().show();
    }
  }
})(jQuery);
