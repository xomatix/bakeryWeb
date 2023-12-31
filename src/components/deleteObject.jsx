import { useEffect } from "preact/hooks";
import { apiUrlQuery } from "./constants";


const DeleteObject = ({ id, id2, dataType }) => {

    // useEffect(() => {
    //     console.log(`id: ${id}, datatype: ${dataType}`)
    // },[])

    const deleteItem = async () => {
        if (id == '' || id == undefined) {
            alert("No id avaliable")
            return;
        }
        console.log(dataType)

        if (dataType === '' || dataType == undefined) {
            alert("No data type avaliable")
            return;
        }

        const apiUrl = apiUrlQuery;

        let q = 'delete from '
        switch (dataType) {
            case 0:
                q += `clients where client_id=${id};`
                break;
            case 1:
                q += `staff where staff_id=${id};`
                break;
            case 2:
                q += `bread_categories where bread_category_id=${id};`
                break;
            case 3:
                q += `ingredients where ingredient_id=${id};`
                break;
            case 4:
                q += `stock where stock_ingredient_id=${id};`
                break;
            case 5:
                q += `breads where bread_id=${id};`
                break;
            case 6:
                q += id2 != undefined && id2 != null ?  `recipe_element where bread_id=${id} and ingredient_id =${id2};` : ''
                break;
            case 7:
                q += `order_element where order_id=${id}; delete from orders where order_id=${id};`
                break;
            case 8:
                q += `order_element where order_elem_id=${id};`
                break;
            case 9:
                q += `minimal_stock where minimal_stock_id=${id};`
                break;

            default:
                break;
        }

        if (!confirm(q)) {
            return;
        }

        // console.log(q)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: q,
            }),
        };

        // Make the API call
        await fetch(apiUrl, requestOptions)
            .then((response) => response.json())

        window.location = window.location.href
    }

    return (
        <>
            <button onClick={deleteItem}>❌</button>
        </>
    )
}

export default DeleteObject;