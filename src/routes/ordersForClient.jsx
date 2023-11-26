import ListObjects from "../listObjects";


const OrdersForClientList = ({customer_id}) => {


    return (<>
        <ListObjects dataType={7} customerId={customer_id} ></ListObjects>
    </>);
}

export default OrdersForClientList;