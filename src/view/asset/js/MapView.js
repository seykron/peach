(function ($) {
  // Namespace
  MapView = {

    /**
     * Map's mocked data.
     */
    data: [{
      name: 'Buenos Aires', //Province name
      code: 'AR-B', //Province code
      population: 11000000, //Population total
      housing: 50000000, //Number of houses in that provinces
      households: 400000, //Amount of households
      poorHouses: 30000, //Amount of poor houses
      poorPopulationRate: 2.1, //Poor population rate
      indigentPopulationRate: 0.2 //Indigent population rate
    }],

    /**
     * Invokes the Google's geochart API and calls the drawRegionsMap when it's
     * loaded.
     * @constructor
     */
    initialize: function () {
      google.load('visualization', '1', {'packages': ['geochart']});
      google.setOnLoadCallback(this.initializeMap);
    },

    /**
     * Setups and shows the map's data. Also assigns the map's events.
     */
    initializeMap: function () {
      var data = new google.visualization.DataTable();

      data.addRows(2);
      data.addColumn('string', 'City');
      data.addColumn('number', 'Popularity');

      data.setValue(0, 0, 'AR-Q');
      data.setValue(0, 1, 100 * Math.random());
      data.setValue(1, 0, 'AR-B');
      data.setValue(1, 1, 100 * Math.random());

      var options = {
        width: 500,
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
     * @param {Object} region An object containing the province ISO code.
     */
    provinceClickHandler: function (region) {
      $('#data-showroom').dialog({
        height: 200,
        width: 400,
        modal: true,
        position: [50, 100],
        show: 'drop',
        hide: 'drop'
      });

      $('button#selectRegion').button();
    }
  }
})(jQuery);
