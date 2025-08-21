import { triggerError} from '#core_util/handler.util.js';

const getEnvorThrow = (key: string): string => {
    const val = process.env[key];
    if (!val) triggerError(`Environment variable ${key} is not defined.`, [], 500);
    
    return val;
}

const isEmptyObject = (obj: object):boolean => Object.keys(obj).length === 0;

const isEmptyString = (variable: unknown): boolean => typeof variable === 'string' && variable.trim().length === 0;

const inArray = (value: string, array: unknown[]): boolean => array.includes(value);

const isValidData = (data: unknown): boolean => !(data === undefined || data === null || data === '');

const isDateLapsed = ( givenDate: Date, durationSeconds: number = 0, checkDate: Date = new Date() ): boolean => {
  const milliDuration = durationSeconds * 1000;
  return givenDate.getTime() + milliDuration < checkDate.getTime();
};

const replaceValues = (data: string, value: string, replace: string): string => {
    const regex = new RegExp(value, 'g');
    return data.replace(regex, replace);
};
  
const ucFirst = (data: string) => data.charAt(0).toUpperCase() + data.slice(1);

type ErrorLike = {
  path: (string | number)[];
  message: string;
};

const parseMessageToObject = (errorsArray: ErrorLike[]): Record<string, string> => {
  return errorsArray.reduce<Record<string, string>>((acc, err) => {
    if (err.path.length > 0) {
      acc[String(err.path[0])] = err.message;
    }
    return acc;
  }, {});
};

export {
    getEnvorThrow,
    isEmptyObject,
    isEmptyString,
    inArray,
    isValidData,
    replaceValues,
    ucFirst,
    isDateLapsed,
    parseMessageToObject,
};
