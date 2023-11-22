import { FulfillOrder } from "../logic/fulfillOrder";


const CloseOrder = ({orderId}) => {

    const CloseSelectedOrder = () => {
        FulfillOrder(Number(orderId));
    }

    return <>
    
        <button onClick={CloseSelectedOrder}>Close</button>
    </>
}

export default CloseOrder;