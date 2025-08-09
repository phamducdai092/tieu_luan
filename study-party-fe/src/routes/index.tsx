
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";

export const routes = [...userRoutes, ...adminRoutes];