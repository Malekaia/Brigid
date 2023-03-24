import process from "process";

// Check if an object has a specific key
export const has_own_property = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

// Check if a value is a plain object
export const is_plain_object = value => value?.constructor === Object;

// Check if a value is an array
export const is_array = value => value && Object.prototype.toString.call(value) === "[object Array]";

// Check if a value is an array of strings
export function is_string_array(value) {
  // Check if the value is NOT an array
  if (!is_array(value)) {
    return false;
  }
  // Check if each item in the array is NOT a string
  for (const item of value) {
    if (typeof item !== "string") {
      return false;
    }
  }
  // The value is an array of strings
  return true;
}

// Throw more detailed and better structured errors
export function throw_error(name, ...lines) {
  const error = name === "TypeError" ? new TypeError() : new Error();
  const prefix = `${name}: `;
  const spacing = `\n${" ".repeat(prefix.length)}`;
  console.error(`\n${prefix}${lines.join(spacing)}\n\n${error.stack}\n`);
  process.exit(1);
}
