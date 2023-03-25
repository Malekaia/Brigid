import check_arguments from "./src/check-arguments.js";
import check_request_queries from "./src/check-request-queries.js";

// Define query parameters for a specific route
export default function(allowed) {
  // Create the entries array for the "queries" object once (avoids recreating after every request)
  const allowed_entries = Object.entries(allowed);

  // Standardise query definition shorthands, check the request queries and return the result of those checks
  allowed = check_arguments(allowed, allowed_entries);

  // Return the middleware function (without changing the function signature)
  return function(request, response, next) {
    // Add the result to the response "locals"
    response.locals.brigid = check_request_queries(allowed, allowed_entries, request.query);
    response.locals.brigid.length = Object.keys(request.query).length;
    // Continue to the next callback
    next();
  };
}
