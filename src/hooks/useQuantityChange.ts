
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

	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, id: string | number) => {
		if (!event.target.value) {
			updateOrderLineItem(id, "")
			return
		}
		const newQuantity = parseInt(event.target.value, 10);
		updateOrderLineItem(id, newQuantity)
	};

	const addOneItem = (id: string | number, quantity: number | string) => {
		updateOrderLineItem(id, Number(quantity) + 1)
	}

	const restOneItem = (id: string | number, quantity: number | string) => {
		updateOrderLineItem(id, Number(quantity) - 1)
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
		showPrices
	}
}