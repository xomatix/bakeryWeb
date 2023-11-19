import { useEffect, useState } from "preact/hooks";
import MessageBox from "./components/messageBox";
import { Link } from "preact-router";


const ListObjects = ({ dataType, id }) => {

    //dataType 
    // 0 clients
    // 1 staff
    // 2 bread_categories
    // 3 ingredients
    // 4 stock
    // 5 breads
    // 6 recipe_element
    // 7 orders
    // 8 order_element

    const [data, setData] = useState([])
    const [headers, setHeaders] = useState([])
    const [sql, setSql] = useState('')

    useEffect(async () => {
        console.log("data type : " + dataType)
        fetchData()
    }, [])

    const fetchData = async () => {
        //this.setState({ isLoading: true });

        const apiUrl = 'http://localhost:8000/query'; // replace with your actual API endpoint

        let q = ''
        let obj = ''
        let customHeaders = ''
        switch (dataType) {
            case 0:
                q = 'select * from clients ' + (id != 0 && id != '' && id != null ? `where client_id = ${id};` : ';')
                obj = 'client_id,client_name,client_address,client_email'
                break;
            case 1:
                q = 'select * from staff ' + (id != 0 && id != '' && id != null ? `where staff_id = ${id};` : ';')
                obj = 'staff_id,name,surname,email'
                break;
            case 2:
                q = 'select * from bread_categories  ;'
                obj = 'bread_category_id,bread_category_name'
                break;
            case 3:
                q = 'select i.ingredient_id,i.ingredient_name,i.amount_unit,sum(s.amount) from ingredients i left join stock s on i.ingredient_id = s.ingredient_id '
                    + (id != 0 && id != '' && id != null ? `where i.ingredient_id = ${id} ` : '') + ' group by i.ingredient_id ;'
                obj = 'ingredient_id,ingredient_name,amount_unit,amount_in_stock'
                break;
            case 4:
                q = 'select stock_ingredient_id,amount,s.ingredient_id,expiry_date,ingredient_name  from stock s join ingredients i on s.ingredient_id = i.ingredient_id;'
                obj = 'stock_ingredient_id,amount,ingredient_id,expiry_date,ingredient_name'
                customHeaders = 'stock_ingredient_id,amount,ingredient_id,expiry_date'
                break;
            case 5:
                q = 'select bread_id,bread_name,b.bread_category_id,price,bread_category_name  from breads b join bread_categories bc on b.bread_category_id = bc.bread_category_id  order by bread_id asc;'
                obj = 'bread_id,bread_name,bread_category_id,price,bread_category_name'
                customHeaders = 'bread_id,bread_name,bread_category_id,price'
                break;
            case 6:
                q = `select recipe_element,re.ingredient_id,re.amount ,re.amount_unit ,ingredient_name from recipe_element re join ingredients i on re.ingredient_id =i.ingredient_id  where bread_id = ${id}`;
                obj = 'recipe_element,ingredient_id,amount,amount_unit,ingredient_name'
                customHeaders = 'recipe_element,ingredient_id,amount,amount_unit'
                break;
            case 7:
                q = `select o.order_id,c.client_id,c.client_name, sum(oe.price*oe.quantity) as sum_of_order from orders o join clients c on c.client_id = o.client_id 
                left join order_element oe on oe.order_id = o.order_id GROUP BY
                  o.order_id,
                  c.client_id,
                  oe.order_id;`;
                obj = 'order_id,client_id,client_name,sum_of_order'
                customHeaders = 'order_id,client_id,sum_of_order'
                break;
            case 8:
                q = `select oe.order_elem_id,b.bread_id,b.bread_name,oe.quantity,oe.price,oe.staff_id,s.name,s.surname  from order_element oe 
                join breads b on b.bread_id = oe.bread_id join staff s on s.staff_id = oe.staff_id where oe.order_id = ${id};`;
                obj = 'order_elem_id,bread_id,bread_name,quantity,price,staff_id,name,surname'
                customHeaders = 'order_elem_id,bread_id,quantity,price,staff_id'
                break;
            default:
                break;
        }

        if (q != '')
            setSql(q);

        // Set up the POST request
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: q,
                object: obj, // replace with your actual payload
            }),
        };

        // Make the API call
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((d) => {
                //console.log(d)
                setData(d);

                // data.map(x => {
                //     console.log(x)
                // })
                setHeaders(customHeaders != '' ? customHeaders.split(',') : Object.keys(d.at(0)))
                //console.log(headers.map(x => { return <tr>{x}</tr> }))
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                //this.setState({ isLoading: false });
            });
    };

    return (
        <div >
            <h2>{window.location.pathname.slice(1, window.location.pathname.length).split('/').join(' > ')}</h2>
            <button onClick={fetchData}>🔄️</button>

            {dataType == 0 && <Link href={'/clients/add'}><button >➕</button></Link>}
            {dataType == 1 && <Link href={'/staff/add'}><button >➕</button></Link>}
            {dataType == 2 && <Link href={'/bread_categories/add'}><button >➕</button></Link>}
            {dataType == 3 && <Link href={'/ingredients/add'}><button >➕</button></Link>}
            {dataType == 4 && <Link href={'/stock/add'}><button >➕</button></Link>}
            {dataType == 5 && <Link href={`/breads/add`}><button >➕</button></Link>}
            {(dataType == 6 && id != undefined ) && <Link href={`/breads/${id}/add`}><button >➕</button></Link>}
            {dataType == 7 && <Link href={`/orders/add`}><button >➕</button></Link>}
            {(dataType == 8 && id != undefined ) && <Link href={`/orders/${id}/add`}><button >➕</button></Link>}
            
            <table>
                <tr>
                    {headers.map(x => { return <th>{x}</th> })}

                </tr>

                {dataType == 0 && <>
                    {data.map(x => { return <tr><td>{x.client_id}</td> <td>{x.client_name}</td> <td>{x.client_address}</td> <td>{x.client_email}</td> <td><button>✏️</button></td></tr> })}
                </>}

                {dataType == 1 && <>
                    {data.map(x => { return <tr><td>{x.staff_id}</td> <td>{x.name}</td> <td>{x.surname}</td> <td>{x.email}</td><td><button>✏️</button></td></tr> })}
                </>}

                {dataType == 2 && <>
                    {data.map(x => { return <tr><td>{x.bread_category_id}</td> <td>{x.bread_category_name}</td> <td><button>✏️</button></td></tr> })}
                </>}

                {dataType == 3 && <>
                    {data.map(x => { return <tr><td>{x.ingredient_id}</td> <td>{x.ingredient_name}</td>  <td>{x.amount_unit}</td> <td>{x.amount_in_stock}</td> <td><button>✏️</button></td></tr> })}
                </>}

                {dataType == 4 && <>
                    {data.map(x => {
                        return <tr><td>{x.stock_ingredient_id}</td> <td>{x.amount}</td>
                            <td><Link href={`/ingredients/${x.ingredient_id}`}>{x.ingredient_id}:{x.ingredient_name}</Link></td>
                            <td>{x.expiry_date}</td> <td><button>✏️</button></td></tr>
                    })}
                </>}

                {dataType == 5 && <>
                    {data.map(x => {
                        return <tr><td><Link href={`/breads/${x.bread_id}`}>{x.bread_id}</Link></td> <td>{x.bread_name}</td>
                            <td>{x.bread_category_id}:{x.bread_category_name}</td> <td>{x.price}</td> <td><button>✏️</button></td></tr>
                    })}
                </>}

                {dataType == 6 && <>
                    {data.map(x => {
                        return <tr><td>{x.recipe_element}</td> <td><Link href={`/ingredients/${x.ingredient_id}`}>{x.ingredient_id}:{x.ingredient_name}</Link></td>
                            <td>{x.amount}</td> <td>{x.amount_unit}</td> <td><button>✏️</button></td></tr>
                    })}
                </>}

                {dataType == 7 && <>
                    {data.map(x => {
                        return <tr><td><Link href={`/orders/${x.order_id}`}>{x.order_id}</Link></td>
                            <td><Link href={`/clients/${x.client_id}`}>{x.client_id}:{x.client_name}</Link></td> <td>{x.sum_of_order}</td> <td><button>✏️</button></td></tr>
                    })}
                </>}

                {dataType == 8 && <>
                    {data.map(x => {
                        return <tr><td>{x.order_elem_id}</td> <td><Link href={`/breads/${x.bread_id}`}>{x.bread_id}:{x.bread_name}</Link></td> <td>{x.quantity}</td>
                            <td>{x.price}</td> <td><Link href={`/staff/${x.staff_id}`}>{x.staff_id}:{x.name} {x.surname}</Link></td> <td><button>✏️</button></td></tr>
                    })}
                </>}
            </table>


            <MessageBox dataType={dataType} query={sql}></MessageBox>
        </div>
    );
};

export default ListObjects;