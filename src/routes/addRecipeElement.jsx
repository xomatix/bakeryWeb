import AddObject from "../components/addObject";


const AddRecipeElement = (bread_id) => {

    return (<>
        <AddObject dataType={6} id={bread_id}></AddObject>
    </>);
}

export default AddRecipeElement;