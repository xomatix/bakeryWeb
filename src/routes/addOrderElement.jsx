import AddObject from "../components/addObject";


const AddOrderElement = ({order_id}) => {


    return (<>
        <AddObject dataType={8} id={order_id}></AddObject>
    </>);
}

export default AddOrderElement;