const initialResponse = (type = 'invalid_request') => ({
    status: false,
    message: type === 'invalid_input' ? 'invalid inputs' : 'invalid request',
    message_detail: '',
    response_data: {},
    error_data: {},
});

const isEmptyObject = (obj) => Object.keys(obj).length === 0;

const isEmptyArray = (array) => Array.isArray(array) && array.length === 0;

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const isKeyInObject = (key, object) => Object.prototype.hasOwnProperty.call(object, key);

const isEmptyString = (variable) => typeof variable === 'string' && variable.trim().length === 0;

const inArray = (value, array) => array.includes(value);

const isValidData = (data) => !(data === undefined || data === null || data === '');

const isPhoneSample = (value) => /^0?\d*$/.test(value.trim());

const detectInputType = (value) => {
    // Looks like a phone number if it starts with digits (even with leading zero)
    if (/^0?\d*$/.test(value.trim())) {
      return 'phone';
    }
  
    return 'unknown';
  };
  
const replaceValues = (data, value, replace) => {
    const regex = new RegExp(value, 'g');
    return data.replace(regex, replace);
};
  

const isNumber = (value) => !isNaN(value) && typeof Number(value) === "number" && Number.isFinite(value);

const ucFirst = (data) => data.charAt(0).toUpperCase() + data.slice(1);

const isDateLapsed = (givenDate, duration = 0, checkDate = new Date()) => {
    const milliDuration = 1000 * duration;
    return new Date(givenDate).getTime() + milliDuration < checkDate.getTime();
};

const parseMessageToObject = (error) => {
    const errors = error.details.reduce((acc, err) => {
        acc[err.path[0]] = err.message; // Assign each field's error message
        return acc;
    }, {});
    
    return errors; // Return the structured errors as an object
};

export {
    initialResponse,
    isEmptyObject,
    isEmptyArray,
    isObject,
    isKeyInObject,
    isEmptyString,
    inArray,
    isValidData,
    isPhoneSample,
    replaceValues,
    isNumber,
    ucFirst,
    isDateLapsed,
    parseMessageToObject,
    detectInputType,
};
