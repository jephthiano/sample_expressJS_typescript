import User from '#model/User.schema.js';
import OtpToken from '#model/OtpToken.schema.js';
import Token from '#model/Token.schema.js';
import { triggerError} from '#core_util/handler.util.js';
import type { modelName } from '#src/types/types.js';


const findSingleValue = async (collectionName: modelName, whereField: string, whereValue: string, selectValue: string):Promise<string | null> => {
    const model = getModel(collectionName); // Get model dynamically
    if (!model) triggerError(`Error occured on the server`,[], 500);    

    const result = await model?.findOne({ [whereField]: whereValue }, selectValue);
    const response = result ? result[selectValue] : null;

    return response;
};

const updateSingleField = async (collectionName: modelName, whereField: string, whereValue: string, updateField: string, newValue: string): Promise<boolean> => {
    const model = getModel(collectionName); // dynamically resolve the Mongoose model
    if (!model) triggerError(`Error occured on the server`,[], 500);

    const result = await model?.updateOne(
    { [whereField]: whereValue },
    { $set: { [updateField]: newValue } }
    );

    return result ? result.modifiedCount > 0 : false; 
};

import type { Model } from 'mongoose';

const getModel = (modelName: modelName): Model<any> | null => {
    const models: Record<modelName, Model<any>> = { User, OtpToken, Token };
    return models[modelName] || null;
};


export { findSingleValue, updateSingleField };