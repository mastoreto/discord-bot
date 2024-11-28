import type { Format as FormatType } from 'logform';
import { format, transports } from 'winston';

const { combine, timestamp, label } = format;

const isProductionServer = process.env.NODE_ENV === 'production';

export const ERROR_TRARNSPORT = new transports.File({
  filename: 'log_files/error.log',
  level: 'error',
  format: combine(label({ label: 'packages/api' }), timestamp()),
});

export const INFO_TRANSPORT = new transports.File({
  filename: 'log_files/combined.log',
  level: 'info',
});

export const CONSOLE_TRANSPORT = (format: FormatType) => {
  return new transports.Console(
    isProductionServer
      ? {}
      : {
          format: format,
        },
  );
};
