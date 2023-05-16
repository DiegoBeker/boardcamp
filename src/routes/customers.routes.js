import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.controller.js";
import { customerSchema } from "../schemas/customer.schema.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { validateCpf, validateCustomerId, validateUpdateCustomer } from "../middlewares/customers.middleware.js";

const customerRouter = Router();

customerRouter.post("/customers", validateSchema(customerSchema), validateCpf, postCustomer);
customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", validateCustomerId, getCustomerById);
customerRouter.put("/customers/:id", validateSchema(customerSchema), validateUpdateCustomer, updateCustomer);

export default customerRouter;