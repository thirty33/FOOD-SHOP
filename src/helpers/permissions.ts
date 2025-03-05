import { ROLES_TYPES, PERMISSION_TYPES } from "../config/constant";
import { User } from "../types/user";

export const isAdminOrCafe = (user: User) => {
	return user.role === ROLES_TYPES.ADMIN || user.role === ROLES_TYPES.CAFE
}

export const isAgreementIndividual = (user: User) => {
	return user.role === ROLES_TYPES.CONVENIO && user.permission === PERMISSION_TYPES.INDIVIDUAL
}