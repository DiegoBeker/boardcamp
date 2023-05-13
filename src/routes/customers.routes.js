import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customers.controller.js";
import { customerSchema } from "../schemas/customer.schema.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";

const customerRouter = Router();

customerRouter.post("/customers",validateSchema(customerSchema), postCustomer);
customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomerById);
customerRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer);

export default customerRouter;