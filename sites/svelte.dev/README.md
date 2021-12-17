## Running locally

Run the site sub-project:

```bash
pnpm install
pnpm dev
```

and navigate to [localhost:3000](http://localhost:3000).

The first time you run the site locally, it will update the list of Contributors and REPL dependencies. After this it won't run again unless you force it by running:

```bash
pnpm update
```

## Running using the local copy of Svelte

By default, the REPL will fetch the most recent version of Svelte from https://unpkg.com/svelte. When running the site locally, you can also use your local copy of Svelte.

To produce the proper browser-compatible UMD build of the compiler, you will need to run `npm run build` (or `npm run dev`) in the root of this repository with the `PUBLISH` environment variable set to any non-empty string:

```bash
git clone https://github.com/sveltejs/svelte.git
cd svelte
npm ci
PUBLISH=1 npm run build
```

You'll then need to update the project to use that version of Svelte. Please update these docs with instructions on how to do that

Then visit the REPL at [localhost:3000/repl?version=local](http://localhost:3000/repl?version=local). Please note that the local REPL only works with `pnpm dev` and not when building the site for production usage.

## REPL GitHub integration

In order for the REPL's GitHub integration to work properly when running locally, you will need to:
- [create a GitHub OAuth app](https://github.com/settings/developers):
   - set `Authorization callback URL` to `http://localhost:3000/auth/callback`;
   - set `Application name` as you like, and `Homepage URL` as `http://localhost:3000/`;
   - create the app and take note of `Client ID` and `Client Secret`
- in this directory, create an `.env` file (see `.env.example`) containing:
   ```
   GITHUB_CLIENT_ID=[your app's Client ID]
   GITHUB_CLIENT_SECRET=[your app's Client Secret]
   BASEURL=http://localhost:3000
   ```

## Building the site

To build the website, run `pnpm build`. The output can be found in `build`.

## Testing

Tests can be run using `pnpm test`.

## Translating the API docs

Anchors are automatically generated using headings in the documentation and by default (for the english language) they are latinised to make sure the URL is always conforming to RFC3986.

If we need to translate the API documentation to a language using unicode chars, we can setup this app to export the correct anchors by setting up `SLUG_PRESERVE_UNICODE` to `true` in `config.js`.
