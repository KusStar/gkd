# gkd

> A templates and dependency manager.

## Features

- Provide templates for starting project.
- Inject dependency or configuration to working project.

## Installation

- Install `@kuss/gkd-cli` globally.
```sh
$ npm i -g @kuss/gkd-cli
```

- Use `npx` to execute `@kuss/gkd-cli`.

## Usage

```shell
$ gkd help
gkd <command>

Commands:
  gkd init <name>                     Initial with template    [aliases: create]
  gkd generate <to> <from>            Generate template from source
                                                                  [aliases: gen]
  gkd config <operate> [key] [value]  Get or set config

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -v, --verbose  Run with verbose logging                              [boolean]
```

## Example

```sh
# gkd init, select template and wait for fetching
$ gkd init hello-gkd
# CD into it
$ cd hello-gkd
```
## Thanks

- [create-snowpack-app](https://github.com/pikapkg/create-snowpack-app)
- [create-ink-app](https://github.com/vadimdemedes/create-ink-app)

## License

- [MIT](LICENSE)
