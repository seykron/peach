(function() {
  /** Filters executed before the request handler.
   * @type Function[]
   */
  var filters = [];

  /** Executes the filter chain and invokes the request handler after filters
   * execution.
   *
   * @param {Object} request Request object. Cannot be null.
   * @param {Object} response Response object. Cannot be null.
   * @param {Object} options Request handler specific options. Cannot be null.
   * @param {Function} requestHandleCallback Function invoked once all filters
   *    were executed. Cannot be null.
   */
  var doFilter = function(request, response, options, requestHandleCallback) {
    var processNextFilter = function(filterClass) {
      if (!filterClass) {
        requestHandleCallback();
        return;
      }
      var filter = new filterClass();

      filter.execute(request, response, options,
          processNextFilter.bind(this, filters.shift()));
    };
    processNextFilter(filters.shift());
  };

  Object.extend(App, {
    /** Maps a url to a command.
     *
     * <p>Pattern parameters, query parameters and the parsed request body
     * fields will be bound to the command.</p>
     *
     * <p>By convention the command must implement a method named
     * <code>execute</code> and it must return a <code>ModelAndView</code>
     * object.</p>
     *
     * @param {String} url Url pattern for the routing. Cannot be null or empty.
     * @param {Object} options Options to match against the HTTP request. Cannot
     *    be null.
     * @param {String} [options.contentType] Only processes the request if the
     *    <code>Content-Type</code> header matches this value.
     * @param {Function} commandClass Command class that will be instantiated to
     *    handle requests that match the url pattern.
     */
    route : function(url, options, commandClass) {
      var method = options.method || "get";

      Server[method.toLowerCase()](url, function(req, res) {
        // Handles the request after the filters.
        doFilter(req, res, options, function() {
          if (options.contentType && !req.is(options.contentType)) {
            console.log("Request doesn't match required Content-Type: " +
                options.contentType);
            res.send(404);
            return;
          }

          var command = new commandClass(req, res);
          var params = {};

          Object.extend(params, req.params);
          Object.extend(params, req.query);
          Object.extend(params, req.body);

          for (var name in params) {
            if (params.hasOwnProperty(name)) {
              command[name] = params[name];
            }
          }

          var modelAndView = command.execute();
          var viewOptions = {};

          modelAndView.wait(function() {
            if (modelAndView.contentType === "application/json") {
              viewOptions.json = modelAndView.model;
            } else {
              viewOptions.locals = modelAndView.model
            }

            res.render(modelAndView.viewName, viewOptions);
            res.end();
          });
        });
      });
    },

    /** Maps a filter. The filter chain is executed before the request handler.
     * If a filter doesn't delegate to the next filter the request won't be
     * processed.
     *
     * @param {Function} filterClass Filter class to instantiate. Cannot be
     *    null.
     */
    filter : function(filterClass) {
      if (filterClass) {
        filters.push(filterClass);
      }
    }
  });
}());
