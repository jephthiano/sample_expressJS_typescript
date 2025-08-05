import User from '#model/User.schema.js';
import OtpToken from '#model/OtpToken.schema.js';
import Token from '#model/Token.schema.js';
import { triggerError} from '#core_util/handler.util.js';

const findSingleValue = async (coll, field, param, select) => {
    const model = getModel(coll); // Get model dynamically
    if (!model) triggerError(`Model ${coll} not found`,[], 500);

    const result = await model.findOne({ [field]: param }, select);
    const response = result ? result[select] : null;

    return response;
};

const updateSingleField = async (collectionName, whereField, whereValue, updateField, newValue) => {
    const model = getModel(collectionName); // dynamically resolve the Mongoose model
    if (!model) triggerError(`Model ${coll} not found`,[], 500);

    const result = await model.updateOne(
    { [whereField]: whereValue },
    { $set: { [updateField]: newValue } }
    );

    return result.modifiedCount > 0;
};

const getModel = (modelName) => {
    const models = { User, OtpToken, Token }; // Add other models here
    return models[modelName] || null;
};

export { findSingleValue, updateSingleField };