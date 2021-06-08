# gkd

> A templates and dependency manager.

## Features

- Provide templates for starting project.
- Inject dependency or configuration to working project.

## Installation

- Install `@kuss/gkd-cli` globally.
```console
$ npm i -g @kuss/gkd-cli
```

- Use `npx` to execute `@kuss/gkd-cli`.

## Usage

```console
$ gkd app-name [options]
$ gkd --help
```

## Example

```console
$ gkd test -t react-ts-webpack

  ✔ Copy files
  ✔ Success

Installation:

> cd test
> npm install

Scripts:

> npm run dev
> npm run build
> npm run prettier
```

## Thanks

- [create-snowpack-app](https://github.com/pikapkg/create-snowpack-app)
- [create-ink-app](https://github.com/vadimdemedes/create-ink-app)

## License

- [MIT](LICENSE)
