# gkd

> A templates and dependency manager.

[![asciicast](https://asciinema.org/a/8hmdgPjfOZMo9Pv7hpBRVM6wz.svg)](https://asciinema.org/a/8hmdgPjfOZMo9Pv7hpBRVM6wz)

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
  gkd init <name>                 Initial with template
                                            [aliases: create]
  gkd generate <from> <to>        Generate template from
                                  source       [aliases: gen]
  gkd config <operate> [key]      Get or set config
  [value]

Options:
  --help     Show help                              [boolean]
  --version  Show version number                    [boolean]
```

## Thanks

- [create-snowpack-app](https://github.com/pikapkg/create-snowpack-app)
- [create-ink-app](https://github.com/vadimdemedes/create-ink-app)

## License

- [MIT](LICENSE)
