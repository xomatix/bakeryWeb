import ListObjects from "../listObjects";


const StaffList = ({staff_id}) => {


    return (<>
        <ListObjects dataType={1} id={staff_id}></ListObjects>
    </>);
}

export default StaffList;