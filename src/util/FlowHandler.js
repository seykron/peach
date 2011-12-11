(function() {
  /** Filters executed before the request handler.
   * @type Function[]
   */
  var filters = [];

  /** Mapping of named routes. A named route can be referenced by any command.
   * @type Object[String => Object]
   */
  var namedRoutes = {};

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

      if (!Array.isArray(method)) {
        method = [method];
      }

      // Checks whether this is a named route.
      if (options.name) {
        namedRoutes[options.name] = {
          url : url,
          options : options,
          commandClass : commandClass
        };
      }

      method.each(function(verb) {
        var methodName = verb.toLowerCase();

        if (typeof Server[methodName] === "function") {
          Server[methodName](url, function(req, res) {
            req.method = methodName;

            // Handles the request after the filters.
            doFilter(req, res, options, function() {
              this.handleRequest(req, res, options, commandClass);
            }.bind(this));
          }.bind(this));
        }
      }, this);
    },

    /** Handles a single request.
     *
     * @param {Object} res HTTP request. Cannot be null.
     * @param {Object} res HTTP response. Cannot be null.
     * @param {Object} options Command options. Cannot be null.
     * @param {Function} commandClass Command to instantiate. Cannot be null.
     */
    handleRequest : function(req, res, options, commandClass) {
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

      var modelAndView = command.execute({
        isSubmit : (req.method === "post")
      });

      var viewOptions = {};

      modelAndView.wait(function() {
        if (modelAndView.redirectTarget) {
          var target = modelAndView.redirectTarget;
          var route = namedRoutes[target];

          if (namedRoutes.hasOwnProperty(target)) {
            Object.extend(params, modelAndView.redirectOptions || {});

            target = route.url;

            for (var property in params) {
              if (params.hasOwnProperty(property)) {
                target = target.replace(":" + property, params[property]);
              }
            }
          }

          res.redirect(target);
        } else {
          if (modelAndView.contentType === "application/json" ||
            req.accepts("json")) {
            res.send(JSON.stringify(modelAndView.model));
          } else {
            viewOptions.locals = modelAndView.model;
            res.render(modelAndView.viewName, viewOptions);
          }
        }

        res.end();
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
