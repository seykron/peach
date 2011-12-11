/**
 * Represents a combination of a model and a view. A model is an object with
 * information available in the view. The view is the presentation layer
 * proccessed by a rendering engine.
 *
 * @author Matias Mirabelli <lumen.night@gmail.com>
 * @class
 */
App.ModelAndView = Class.create({

  /** Name of the view represented by this object.
   * @type String
   */
  viewName : null,

  /** Model object. Can be null if it's 'not needed.
   * @type Object
   */
  model : null,

  /** Result content type. Can be null. Default is "text/html".
   * @type String
   */
  contentType : null,

  /** Indicates whether the request associated with this object must be deferred
   * until the <code>success()</code> or <code>error()</code> method is
   * invoked. Default is false.
   */
  _deferred : false,

  /** List of callbacks invoked once the request is finished.
   * @type Function[]
   */
  _callbacks : null,

  /** Constructs a new model and view object and sets the related data.
   * @param {String} theViewName The view name. Cannot be null or empty.
   * @param {Object} [theModel] Object available in the view. Can be null.
   * @param {String} [contentType] Content type of the result. Can be null.
   *    Default is <code>text/html</code>.
   * @constructs
   */
  initialize : function(theViewName, theModel, contentType) {
    this.viewName = theViewName;
    this.model = theModel || {};
    this._callbacks = [];
  },

  /** Defers the current request until the <code>success()</code> or
   * <code>error()</code> strategy is invoked by the request handler.
   */
  defer : function() {
    this._deferred = true;
    return this;
  },

  /** Resumes the request processing if this ModelAndView object was previously
   * deferred. It takes no action if the object isn't deferred.
   */
  resume : function() {
    if (this._deferred) {
      this.notify();
    }
  },

  /** Adds a new listener that will be called once the request is already
   * processed by the handler.
   * @param {Function} callback Callback to add. Cannot be null.
   */
  wait : function(callback) {
    this._callbacks.push(callback);

    if (!this._deferred) {
      this.notify();
    }
  },

  /** Triggers all callbacks that are waiting for the request processing.
   */
  notify : function() {
    for (var i = 0; i < this._callbacks.length; i++) {
      var callback = this._callbacks[i];
      callback();
    }
  },

  /** Follows a redirect to the specified url.
   *
   * @param {String} target Url or route name to redirect the response to. If
   *    it's null the existing redirect will be removed.
   * @param {Object} [options] Options for the redirect. If the target is a
   *    named route, the route url patterns will be replaced by the options
   *    properties.
   */
  redirect : function(target, options) {
    this.redirectTarget = target;
    this.redirectOptions = options;

    return this;
  }
});

