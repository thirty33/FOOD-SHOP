
import { useOrder } from './useCurrentOrder';
import { PERMISSION_TYPES, ROLES_TYPES } from "../config/constant";
import { useMemo } from 'react';

export function useQuantityChange() {
	
	const {
		updateOrderLineItem,
		currentOrder,
		user,
		showPrices
	} = useOrder()

	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, id: string | number, partiallyScheduled?: boolean) => {
		const value = event.target.value;

		// Allow temporary empty state while typing (user is deleting to type new number)
		if (!value) {
			updateOrderLineItem(id, "", partiallyScheduled || false)
			return;
		}

		// Block pure zero "0"
		if (value === "0") {
			return;
		}

		const newQuantity = parseInt(value, 10);

		// Don't update if parsed value is 0 or NaN
		if (!newQuantity || newQuantity === 0) {
			return;
		}

		updateOrderLineItem(id, newQuantity, partiallyScheduled || false)
	};

	const addOneItem = (id: string | number, quantity: number | string, partiallyScheduled?: boolean) => {
		updateOrderLineItem(id, Number(quantity) + 1, partiallyScheduled || false)
	}

	const handlePartiallyScheduled = (id: string | number, quantity: number | string, partiallyScheduled: boolean) => {
		updateOrderLineItem(id, Number(quantity), partiallyScheduled)
	}

	const restOneItem = (id: string | number, quantity: number | string, partiallyScheduled?: boolean) => {
		updateOrderLineItem(id, Number(quantity) - 1, partiallyScheduled || false)
	}

	const showQuantityInput = useMemo(() => {
		return (user.permission === PERMISSION_TYPES.CONSOLIDADO && user.role === ROLES_TYPES.CONVENIO) ||
			user.role === ROLES_TYPES.ADMIN ||
			user.role === ROLES_TYPES.CAFE
	}, [user])
	
	return {
		handleQuantityChange,
		addOneItem,
		restOneItem,
		currentOrder,
		showQuantityInput,
		showPrices,
		handlePartiallyScheduled
	}
}