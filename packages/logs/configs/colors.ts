import chalk from 'chalk';
import type { Colorizer, TransformableInfo } from 'logform';
import { format } from 'winston';

const { colorize, printf } = format;

const COLORS = {
  INFO: 'blue',
  WARN: 'orange',
  ERROR: 'red',
  DEBUG: 'green',
};

export const COLORIZER: Colorizer = colorize({ colors: COLORS });

export const consoleFormat = printf((info: TransformableInfo) => {
  const { level, message, timestamp } = info;
  const timestampColor = chalk.bgBlue.white(` ${timestamp as string} `);

  let levelColor = null;

  switch (level) {
    case 'info':
      levelColor = chalk.blue('INFO');
      break;
    case 'warn':
      levelColor = chalk.bgYellow.white('WARN');
      break;
    case 'error':
      levelColor = chalk.red('ERROR');
      break;
    case 'debug':
      levelColor = chalk.green.white('DEBUG');
      break;
    default:
      return level;
      break;
  }

  function hasPath(obj: unknown): obj is { path: unknown } {
    return typeof obj === 'object' && obj !== null && 'path' in obj;
  }

  const pathValue = hasPath(message) && typeof message.path === 'string' ? message.path : 'N/A';

  const baseLog = `
  |--------------------------------------------------------|   
      TYPE: ${levelColor}  
      DATE: ${timestampColor}  
      PATH: ${chalk.bgWhiteBright.black(` ${pathValue} `)}                       
  |--------------------------------------------------------|                        
  `;

  const baseLogError = `
  ${baseLog}  
      MESSAGE: ${chalk.bgRedBright.white(` ${pathValue} `)}
  `;

  return level === 'error' ? baseLogError : baseLog;
});
