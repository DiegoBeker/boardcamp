import joi from "joi";

export const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
    cpf: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    ).required()
});