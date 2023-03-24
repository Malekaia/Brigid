import express from "express";
import brigid from "../index.js";

const app = express();

app.get("/", brigid({
  "q": {
    required: true,
    unsafe: true
  },
  "category": {
    required: false,
    unsafe: true
  },
  "letters": {
    value: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  },
  "letter": {
    values: ["a", "b", "c"]
  },
  "letter_test": {
    matches: /^[a-z]{1}$/i
  }
}), (_, response) => {
  // Get the error and target from the response locals
  const { error, target } = response.locals.brigid;
  // Return a basic error (if found)
  if (error) {
    return response.send(`Search queries yielded "{ error: '${error}', target: '${target}' }"`);
  }
  // Test response if no error was found
  response.send("Hello World!");
});

// Listen on port 8080
app.listen(8080, () => {
  console.log("Listening on port 8080");
});
