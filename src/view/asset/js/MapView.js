(function ($) {
  // Namespace
  MapView = {
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
      $('button#selectRegion').button().click(MapView.useRegionHandler);
      $('a#backToMap').click(MapView.closeDataShowroomDialog);
    },
    closeDataShowroomDialog: function () {
      $('#data-showroom').dialog('close');
    },
    
    useRegionHandler: function (event) {
      MapView.closeDataShowroomDialog();
      $('.application-flow').accordion('activate', 1);
    }
  }
})(jQuery);
