Object.extend(App, {
  /** Maps a url to a command.
   *
   * <p>Pattern parameters, query parameters and the parsed request body fields
   *  will be bound to the command.</p>
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
    Server.get(url, function(req, res) {
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
  }
});

