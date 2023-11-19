import ListObjects from "../listObjects";


const OrderElementsList = ({order_id}) => {


    return (<>
        <ListObjects dataType={8} id={order_id}></ListObjects>
    </>);
}

export default OrderElementsList;