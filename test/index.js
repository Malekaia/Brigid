import express from "express";
import brigid from "../index.js";

const app = express();

app.get("/", brigid({
  "q": {
    required: true,
    unsafe: true,
    length_max: 12
  },
  "category": {
    required: false,
    unsafe: true,
    length_min: 3
  },
  "letters": {
    value: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    length: 52
  },
  "letter": {
    values: ["a", "b", "c"]
  },
  "letter_test": {
    matches: /^[a-z]{1}$/i
  }
}), (_, response) => {
  // Get the error and target from the response locals
  const { error, target, length } = response.locals.brigid;
  // Return a basic error (if found)
  if (error) {
    return response.send(`
      <b>Output:</b><br />
      Brigid: Error yielded: "{ error: '${error}', target: '${target}', length: '${length}' }"<br /><br />
      <b>Where:</b><br />
      "error" = the type of error that occurred<br />
      "target" = the key that caused the error<br />
      "length" = the length of the "request.query" object (counted by key)
    `);
  }
  // Test response if no error was found
  response.send("Hello World!");
});

// Listen on port 8080
app.listen(8080, () => {
  console.log("Listening on port 8080");
});
