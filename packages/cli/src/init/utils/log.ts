import chalk from 'chalk'

export const logSuccess = (name: string) => {
  console.log(`
  ${chalk.bold.underline.greenBright('Start:')}
> cd ${name}

> GKD: Generated [${name}] done
`)
}
