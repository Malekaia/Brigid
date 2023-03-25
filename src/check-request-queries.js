import { has_own_property } from "./lib.js";

// Check request query parameters against defined (allowed) query parameters
export default function(allowed, allowed_entries, request_queries) {
  // Check to see if any required query parameters are missing
  for (const [query, definition] of allowed_entries) {
    if (definition.required === true && !has_own_property(request_queries, query)) {
      return { error: "missing", target: query };
    }
  }

  // Return no error and no target if there are no query parameters to check and no required query parameters specified
  if (Object.keys(request_queries).length < 1) {
    return { error: undefined, target: undefined };
  }

  // Iterate the user provided request queries
  for (let [query, value] of Object.entries(request_queries)) {
    // Check to see if the current query has a definition
    if (!has_own_property(allowed, query)) {
      return { error: "unknown", target: query };
    }

    // Get the query definition
    const definition = allowed[query];

    // Ensure the query parameter value is a string
    if (typeof request_queries[query] !== "string") {
      return { error: "type", target: query };
    }

    // Check to see if the value matches the provided value/values or passes the test against a provided regular expression
    if (
      (has_own_property(definition, "value") && definition.value !== value) ||
      (has_own_property(definition, "values") && !definition.values.includes(value)) ||
      (has_own_property(definition, "matches") && !definition.matches.test(value))
    ) {
      return { error: "value", target: query };
    }

    // Check to see if the value is of the correct length
    if (
      (has_own_property(definition, "length") && value.length != definition.length) ||
      (has_own_property(definition, "length_min") && value.length < definition.length_min) ||
      (has_own_property(definition, "length_max") && value.length > definition.length_max)
    ) {
      return { error: "length", target: query };
    }
  }

  // Return no error and no target if the checks passed
  return { error: undefined, target: undefined };
}
