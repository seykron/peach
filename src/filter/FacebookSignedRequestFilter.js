(function() {
  var SignedRequest = require("facebook-signed-request");
  var currentSignedRequest = null;

  SignedRequest.secret = "f0ebc9fc01a11c02608ea2c1f43e1dc3";

  /** Facebook signed request holder. */
  SignedRequestHolder = {
    /** Returns the current signed request.
     * @return The current signed request, or <code>null</code> if the request
     *    is not from Facebook.
     */
    getValue : function() {
      return currentSignedRequest;
    }
  };

  App.filter(Class.create({
    /** Executes this filter.
     */
    execute : function(request, response, options, nextFilterCallback) {
      var rawSignedRequest = request.body["signed_request"];

      if (rawSignedRequest) {
        var signedRequest = new SignedRequest(rawSignedRequest);

        signedRequest.parse(function(errors, signedRequest) {
          if (signedRequest.isValid()) {
            currentSignedRequest = signedRequest;
            nextFilterCallback();
          } else {
            // access errors
            console.log(errors);
          }
        });
      } else {
        nextFilterCallback();
      }
    }
  }));
}());

