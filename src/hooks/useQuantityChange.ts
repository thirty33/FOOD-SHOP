
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
		if (!event.target.value) {
			updateOrderLineItem(id, "", partiallyScheduled || false)
			return
		}
		const newQuantity = parseInt(event.target.value, 10);
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