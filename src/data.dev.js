(function() {

  App.DataTable = Class.create({
    /** List of regions.
     * @type App.domain.Region
     */
    regions : null,

    initialize : function(regions) {
      this.regions = [];

      regions.each(function(region) {
        this.regions.push(region);
      }, this);
    },

    fetch : function(callback) {
      var chainer = new Sequelize.Utils.QueryChainer();

      this.loadSurveyStats(this.loadPopulationStats.bind(this, function() {
        this.regions.each(function(region) {
          chainer.add(App.domain.Region.create(region));
        });
        chainer.run().on("success", callback)
          .on("failure", function(errors) {
            console.log(errors);
          });
      }.bind(this)));
    },

    /** Finds a region by a property value.
     *
     * @param {String} property Field name. Cannot be null or empty.
     * @param {Object} value Property value. Cannot be null or empty.
     * @return {Object} The region object, or <code>null</code> if it doesn't exist.
     */
    findRegion : function(property, value) {
      var region;

      for (var i = 0; i < this.regions.length; i++) {
        region = this.regions[i];

        if (region.hasOwnProperty(property) &&
          region[property] === value) {
          return region;
        }
      }
      return null;
    },

    loadPopulationStats : function(callback) {
      var regions = this.regions;

      console.log("Loading population stats...");

      App.Junar.stream("CENSO-POBLA-RESUL-CENSO-2010", [], function(response) {
        var table = response.result;
        var region;

        for (var i = 3, count = 0; i <= table.rows; i += 3, count++) {
          region = regions[count];

          if (region) {
            Object.extend(region, {
              housing : table.getValue(i, 2).getValue().replace(/[\,\.]/ig, ""),
              households : table.getValue(i + 1, 2).getValue().replace(/[\,\.]/ig, ""),
              population : table.getValue(i + 2, 2).getValue().replace(/[\,\.]/ig, "")
            });
          }
        }
        callback();
      });
    },

    loadSurveyStats : function(callback) {
      var regions = this.regions;

      console.log("Loading household survey stats...");

      App.Junar.stream("TASAS-DE-ENCUE-PERMA-DE", [], function(survey) {
        console.log("Data received. Processing...")

        var surveyTable = survey.result;

        // Maps data from the homehold survey to the province.
        var regionMapping = {
          7 : "AR-C",
          8 : "AR-B",

          10 : "AR-M",
          11 : "AR-J",
          12 : "AR-D",

          14 : "AR-W",
          15 : "AR-P",
          16 : "AR-H",
          17 : "AR-N",

          19 : "AR-K",
          20 : "AR-T",
          21 : "AR-Y",
          22 : "AR-F",
          23 : "AR-A",
          24 : "AR-G",

          26 : "AR-B",
          27 : "AR-E",
          28 : "AR-X",
          29 : "AR-B",
          30 : "AR-S",
          31 : "AR-E",
          32 : "AR-S",
          33 : "AR-B",
          34 : "AR-X",
          35 : "AR-L",
          36 : "AR-B",

          38 : "AR-U",
          39 : "AR-Q",
          40 : "AR-Z",
          41 : "AR-V",
          42 : "AR-U",
          43 : "AR-R"
        };

        for (var i = 1; i <= surveyTable.rows; i++) {
          if (regionMapping.hasOwnProperty(i)) {
            var code = regionMapping[i];
            var region = this.findRegion("code", code);

            if (!region) {
              throw new Error("Region has not a mapping.");
            }

            var indigenceRate = surveyTable.getValue(i, 4).getValue();
            var povertyRate = surveyTable.getValue(i, 5).getValue();

            if (region.hasOwnProperty("povertyRate")) {
              //TODO(matias.mirabelli): proportion isn't real, remember to check
              // the data before going live.
              region.povertyRate += Number(povertyRate);
              region.indigenceRate += Number(indigenceRate);
            } else {
              region.povertyRate = Number(povertyRate);
              region.indigenceRate = Number(indigenceRate);
            }
          }
        }
        callback();
      }.bind(this));
    }
  });

  var dataTable = new App.DataTable([
    {
      name : "Total del país",
      code : "AR"
    },
    {
      name : "Ciudad Autónoma de Buenos Aires",
      code : "AR-C"
    },
    {
      name : "Buenos Aires",
      code : "AR-B"
    },
    {
      name : "24 partidos del Gran Buenos Aires",
      code : "AR-B"
    },
    {
      name : "Interior de la provincia de Buenos Aires",
      code : "AR-B"
    },
    {
      name : "Catamarca",
      code : "AR-K"
    },
    {
      name : "Chaco",
      code : "AR-H"
    },
    {
      name : "Chubut",
      code : "AR-U"
    },
    {
      name : "Córdoba",
      code : "AR-X"
    },
    {
      name : "Corrientes",
      code : "AR-W"
    },
    {
      name : "Entre Ríos",
      code : "AR-E"
    },
    {
      name : "Formosa",
      code : "AR-P"
    },
    {
      name : "Jujuy",
      code : "AR-Y"
    },
    {
      name : "La Pampa",
      code : "AR-L"
    },
    {
      name : "La Rioja",
      code : "AR-F"
    },
    {
      name : "Mendoza",
      code : "AR-M"
    },
    {
      name : "Misiones",
      code : "AR-N"
    },
    {
      name : "Neuquén",
      code : "AR-Q"
    },
    {
      name : "Río Negro",
      code : "AR-R"
    },
    {
      name : "Salta",
      code : "AR-A"
    },
    {
      name : "San Juan",
      code : "AR-J"
    },
    {
      name : "San Luis",
      code : "AR-D"
    },
    {
      name : "Santa Cruz",
      code : "AR-Z"
    },
    {
      name : "Santa Fe",
      code : "AR-S"
    },
    {
      name : "Santiago del Estero",
      code : "AR-G"
    },
    {
      name : "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
      code : "AR-V"
    },
    {
      name : "Tucumán",
      code : "AR-T"
    }
  ]);

  dataTable.fetch(function() {
    console.log("Data successfuly loaded.")
  });
}());

