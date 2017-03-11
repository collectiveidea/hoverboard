import chalk from 'chalk';
import fs from 'fs';

class Logger {
  logLine(label, input, output) {
    let line = chalk.dim(`[${Date.now()}]`) + `  ${chalk.blue(label)}`; // eslint-disable-line prefer-template

    if (typeof input !== 'undefined') {
      if (typeof input === 'string') {
        line = line.concat(`: \n${input}`);
      } else {
        line = line.concat(`: ${JSON.stringify(input)}`);
      }
    }

    if (typeof output !== 'undefined') {
      if (typeof output === 'string') {
        line = line.concat(`\n${chalk.green(output)}`);
      } else {
        line = line.concat(` => ${chalk.green(JSON.stringify(output))}`);
      }
    }

    return line;
  }

  log(label, input, output) {
    const line = this.logLine(label, input, output);
    fs.appendFileSync('logs/test.log', `${line}\n`);
  }

  print(label, input, output) {
    console.log(this.logLine(label, input, output)); // eslint-disable-line no-console
    this.log(label, input, output);
  }
}

export default new Logger;