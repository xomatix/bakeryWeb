import ListObjects from "../listObjects";


const IngredientsList = ({ingredient_id}) => {


    return (<>
        <ListObjects dataType={3} id={ingredient_id}></ListObjects>
    </>);
}

export default IngredientsList;