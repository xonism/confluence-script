`update-confluence-page.js` has functions that parse through all `spec` files & extract test names (values after `describe` & `it`).

The extracted values are formatted & placed in a HTML file.

The contents of the file are sent to Confluence's `Automatic E2E Tests` page via its API.

This script is used in the `Update Confluence Page with Test Names` Github Action.
