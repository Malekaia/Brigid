import { has_own_property, is_plain_object, is_string_array, throw_error } from "./lib.js";

// Standardise query definition shorthands
export default function(allowed, allowed_entries) {
  // Ensure the "allowed" argument is a plain object literal
  if (!is_plain_object(allowed)) {
    throw_error("TypeError", "Expected a value of type \"object\" for the \"allowed\" argument");
  }

  // Iterate the defined (allowed) query parameters
  for (const [query, definition] of allowed_entries) {
    // Ensure the query definition is a plain object literal
    if (!is_plain_object(definition)) {
      throw_error("TypeError", `Expected a value of type "object" for the definition of the "${query}" query`);
    }

    // Determine what properties exist in the "definition" object
    const HAS_REQUIRED = has_own_property(definition, "required");
    const HAS_VALUE = has_own_property(definition, "value");
    const HAS_VALUES = has_own_property(definition, "values");
    const HAS_MATCHES = has_own_property(definition, "matches");
    const HAS_UNSAFE = has_own_property(definition, "unsafe");

    // Default the "required" option to false
    if (!HAS_REQUIRED) {
      allowed[query].required = false;
    }
    // Ensure the "required option is a boolean"
    else if (typeof definition.required !== "boolean") {
      throw_error("TypeError", `Expected a value of type "boolean" for the "required" option in the definition of the "${query}" query.`);
    }

    // Ensure the "values" option is a string
    if (HAS_VALUE && typeof definition.value !== "string") {
      throw_error("TypeError", `Expected a value of type "string" for the "value" option in the definition of the "${query}" query.`);
    }

    // Ensure the "values" option is an array of strings
    if (HAS_VALUES && !is_string_array(definition.values)) {
      throw_error(
        "TypeError",
        `Expected a value of type "string[]" (array of strings) for the "values" option in the definition of the "${query}" query.\n`,
        "Using complex data structures in URL query parameters is bad practice and not user-friendly.",
        "For the transfer of complex data structures, use an alternative method such as POST and JSON.\n",
        "See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data"
      );
    }

    // Ensure the "matches" option is a regular expression
    if (HAS_MATCHES && definition.matches.constructor !== RegExp) {
      throw_error("TypeError", `Expected a value of type "RegExp" for the "test" option in the definition of the "${query}" query.`);
    }

    // Default the "unsafe" option to false
    if (!HAS_UNSAFE) {
      allowed[query].unsafe = false;
    }
    // Ensure the "unsafe" option is a boolean
    else if (typeof definition.unsafe !== "boolean") {
      throw_error("TypeError", `Expected a value of type "boolean" for the "unsafe" option in the definition of the "${query}" query.`);
    }

    // Prevent the "value", "values" and "test" options from being used together
    if ((HAS_VALUE && HAS_VALUES) || (HAS_VALUE && HAS_MATCHES) || (HAS_VALUES && HAS_MATCHES)) {
      throw_error(
        "Error",
        "You cannot simultaneously define a single possible value and test against multiple potential values.\n",
        "Use the \"value\" (string) option to specify a single possible (case-sensitive) value.",
        "OR use the \"values\" (string[]) option to specify multiple potential values.",
        "OR use the \"test\" (RegExp) option to specify a regular expression to test against.\n",
        `This error was caught in the definition of the "${query}" query.`,
      );
    }

    // Warn against unsafe definitions
    if (!HAS_VALUE && !HAS_VALUES && !HAS_MATCHES && definition.unsafe !== true) {
      throw_error(
        "Error",
        "You have not specified one (or more) values, or a check to test against!",
        `Are you sure you want to allow ANY string value for the "${query}" query?`,
        "To disable this warning, set the \"unsafe\" (boolean) option to \"true\".\n",
        "Use the \"value\" (string) option to specify a single possible (case-sensitive) value.",
        "OR use the \"values\" (string[]) option to specify multiple potential values.",
        "OR use the \"test\" (RegExp) option to specify a regular expression to test against.\n",
        `This error was caught in the definition of the "${query}" query.`,
      );
    }
  }

  // Return the standardised query definitions
  return allowed;
}
