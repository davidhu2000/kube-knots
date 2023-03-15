# Local Development

## Kube Knots App

Quickest way to get started is to fork the [repository](https://github.com/davidhu2000/kube-knots) and clone it locally.

```
git clone https://github.com/<your username>/kube-knots.git
```

Follow the [guide](https://tauri.app/v1/guides/getting-started/prerequisites) from the tauri website to install the necessary dependencies.

Install the necessary dependencies

```
yarn install
```

Then run the app

```
yarn dev
```

You may need to install the rust dependencies if the `yarn dev` does not auto install them.

```
cd app/kube-knots/src-tauri
cargo install --path .
```

## Documentation

The documentation is built using [Docusaurus](https://docusaurus.io/).

To run the documentation locally, run the following commands:

```
yarn doc:dev
```

And visit `localhost:3000` in your browser.
