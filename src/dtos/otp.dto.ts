import { UpdateOtpInterface } from "#src/types/interface.js";

function createOtpDTO(data: UpdateOtpInterface) {

    return {
        receiving_medium: data.receiving_medium?.trim().toLowerCase(),
        use_case: data.use_case?.trim(),
        code: data.code?.trim(),
    };
}

export { createOtpDTO };