import { Document } from 'mongoose';
import type { messageMediumType, sendMessageType } from '#src/types/messaging/types.js';

interface sendMessageInterface {
    first_name: string;
    receiving_medium: string;
    send_medium: messageMediumType;
    type: sendMessageType;
    code?: string;
};

interface htmlEmailInterface {
    first_name: string;
    subject?: string;
    text_content: string;
};

export { 
    sendMessageInterface,
    htmlEmailInterface,
};
