import ListObjects from "../listObjects";


const BreadRecipeList = ({bread_id}) => {


    return (<>
        <ListObjects dataType={6} id={bread_id}></ListObjects>
    </>);
}

export default BreadRecipeList;