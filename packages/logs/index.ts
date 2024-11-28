import { consoleFormat } from './configs/colors';
import { CONSOLE_TRANSPORT, ERROR_TRARNSPORT, INFO_TRANSPORT } from './configs/transporters';
import { createLogger, format } from 'winston';

const { combine, timestamp, label } = format;

const FORMAT = combine(label({ label: 'packages/api' }), timestamp(), consoleFormat);

export const Logger = createLogger({
  format: FORMAT,
  transports: [CONSOLE_TRANSPORT(FORMAT), INFO_TRANSPORT, ERROR_TRARNSPORT],
});
