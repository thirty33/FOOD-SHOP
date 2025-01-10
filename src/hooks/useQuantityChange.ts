
import { useOrder } from './useCurrentOrder';

export function useQuantityChange() {

	const {
		updateOrderLineItem
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

	return {
		handleQuantityChange,
		addOneItem,
		restOneItem
	}
}