# webhooks-methods.js

> Methods to handle GitHub Webhook requests

[![@latest](https://img.shields.io/npm/v/@octokit/webhooks-methods.svg)](https://www.npmjs.com/package/@octokit/webhooks-methods)
[![Build Status](https://github.com/octokit/webhooks-methods.js/workflows/Test/badge.svg)](https://github.com/octokit/webhooks-methods.js/actions?query=workflow%3ATest+branch%3Amain)

<details>
<summary>Table of contents</summary>

<!-- toc -->

- [usage](#usage)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

</details>

## usage

<table>
<tbody valign=top align=left>
<tr><th>

Browsers

</th><td width=100%>

Load `@octokit/webhooks-methods` directly from [cdn.skypack.dev](https://cdn.skypack.dev)

```html
<script type="module">
  import { sign } from "https://cdn.skypack.dev/@octokit/webhooks-methods";
</script>
```

</td></tr>
<tr><th>

Node

</th><td>

Install with `npm install @octokit/core @octokit/webhooks-methods`

```js
const { sign } = require("@octokit/webhooks-methods");
```

</td></tr>
</tbody>
</table>

```js
await sign("mysecret", eventPayload);
// will resolve with a string like "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3"

await sign({ secret: "mysecret", algorithm: "sha1" }, eventPayload);
// will resolve with a string like "sha1=d03207e4b030cf234e3447bac4d93add4c6643d8"
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
