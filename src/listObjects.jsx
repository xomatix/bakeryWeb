import { useEffect, useState } from "preact/hooks";
import MessageBox from "./components/messageBox";
import { Link } from "preact-router";
import DeleteObject from "./components/deleteObject";
import SearchBox from "./components/searchBox";
import { getNthBit } from "./logic/bitOperators";
import CloseOrder from "./components/closeOrder";
import { apiUrlQuery } from "./components/constants";


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
    // 9 minimal_stock

    const [data, setData] = useState([])
    const [headers, setHeaders] = useState([])
    const [sql, setSql] = useState('')

    useEffect(async () => {
        // console.log("data type : " + dataType)
        fetchData()
    }, [])

    const fetchData = async () => {
        //this.setState({ isLoading: true });

        const apiUrl = apiUrlQuery; // replace with your actual API endpoint

        let q = ''
        let obj = ''
        let customHeaders = ''
        switch (dataType) {
            case 0:
                q = 'select * from clients ' + (id != 0 && id != '' && id != null ? `where client_id = ${id};` : ';')
                obj = 'client_id,client_name,client_address,client_email'
                break;
            case 1:
                q = 'select s.*,sum(oe.quantity) from staff s left join order_element oe  on oe.staff_id =s.staff_id ' 
                + (id != 0 && id != '' && id != null ? `where s.staff_id = ${id} ` : ' ') + ' group by s.staff_id ;'
                obj = 'staff_id,name,surname,email,breads_prepared'
                break;
            case 2:
                q = 'select * from bread_categories  ;'
                obj = 'bread_category_id,bread_category_name'
                break;
            case 3:
                q = 'select i.ingredient_id,i.ingredient_name,i.amount_unit,sum(s.amount),ms.minimal_amount from ingredients i \
                left join stock s on i.ingredient_id = s.ingredient_id left join minimal_stock ms on ms.ingredient_id =i.ingredient_id '
                    + (id != 0 && id != '' && id != null ? `where i.ingredient_id = ${id} ` : '') + ' group by i.ingredient_id,ms.minimal_amount ;'
                obj = 'ingredient_id,ingredient_name,amount_unit,amount_in_stock,minimal_amount'
                customHeaders = 'ingredient_id,ingredient_name,amount_unit,amount_in_stock'
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
                q = `select recipe_element_id,re.ingredient_id,re.amount ,re.amount_unit ,ingredient_name, b.bread_name  from recipe_element re join ingredients i on re.ingredient_id =i.ingredient_id join breads b on b.bread_id = re.bread_id  where re.bread_id =  ${id}`;
                obj = 'recipe_element_id,ingredient_id,amount,amount_unit,ingredient_name,bread_name'
                customHeaders = 'recipe_element_id,ingredient_id,amount,amount_unit'
                break;
            case 7:
                q = `select o.order_id,c.client_id,c.client_name, sum(oe.price*oe.quantity) as sum_of_order,o.order_flag from orders o join clients c on c.client_id = o.client_id 
                left join order_element oe on oe.order_id = o.order_id GROUP BY
                  o.order_id,
                  c.client_id,
                  oe.order_id order by order_id desc ;`;
                obj = 'order_id,client_id,client_name,sum_of_order,order_flag'
                customHeaders = 'order_id,client_id,sum_of_order'
                break;
            case 8:
                q = `select oe.order_elem_id,b.bread_id,b.bread_name,oe.quantity,oe.price,oe.staff_id,s.name,s.surname,o.order_flag  from order_element oe 
                join breads b on b.bread_id = oe.bread_id join staff s on s.staff_id = oe.staff_id join orders o on o.order_id =oe.order_id 
                where oe.order_id = ${id};`;
                obj = 'order_elem_id,bread_id,bread_name,quantity,price,staff_id,name,surname,order_flag'
                customHeaders = 'order_elem_id,bread_id,quantity,price,staff_id'
                break;
            case 9:
                q = `select ms.minimal_stock_id,i.ingredient_id,ms.minimal_amount,i.ingredient_name from minimal_stock ms join ingredients i  on ms.ingredient_id =i.ingredient_id ;`;
                obj = 'minimal_stock_id,ingredient_id,minimal_amount,ingredient_name'
                customHeaders = 'minimal_stock_id,ingredient_id,minimal_amount'
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

                // console.log(d[0])
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                //this.setState({ isLoading: false });
            });
    };

    return (
        <div >
            <h2>{window.location.pathname.slice(1, window.location.pathname.length).split('/').length > 1 &&
                <Link href={`/` + window.location.pathname.slice(1, window.location.pathname.length).split('/')[0]}>↖️</Link>}
                {window.location.pathname.slice(1, window.location.pathname.length).split('/').join(' > ')}</h2>
            <div style={{ margin: '10px' }}>
                <button onClick={fetchData}>🔄️</button>
                <SearchBox></SearchBox>

                {dataType == 0 && <Link href={'/clients/add'}><button >➕</button></Link>}
                {dataType == 1 && <Link href={'/staff/add'}><button >➕</button></Link>}
                {dataType == 2 && <Link href={'/bread_categories/add'}><button >➕</button></Link>}
                {dataType == 3 && <Link href={'/ingredients/add'}><button >➕</button></Link>}
                {dataType == 4 && <Link href={'/stock/add'}><button >➕</button></Link>}
                {dataType == 5 && <Link href={`/breads/add`}><button >➕</button></Link>}
                {(dataType == 6 && id != undefined) && <Link href={`/breads/${id}/add`}><button >➕</button></Link>}
                {dataType == 7 && <Link href={`/orders/add`}><button >➕</button></Link>}
                {(dataType == 8 && id != undefined && data.length == 0 ) && <Link href={`/orders/${id}/add`}><button >➕</button></Link>}
                {(dataType == 8 && id != undefined && data.length > 0 && !getNthBit(data[0].order_flag,0)) && <Link href={`/orders/${id}/add`}><button >➕</button></Link>}
                {dataType == 9 && <Link href={`/minimal_stock/add`}><button >➕</button></Link>}

                {(dataType == 6 && data.length > 0) && <h1>Bread name: {data[0].bread_name}</h1>}
            </div>

            <table>
                <tr>
                    {headers.map(x => { return <th>{x}</th> })}
                </tr>

                {dataType == 0 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.client_id}</td> <td>{x.client_name}</td> <td>{x.client_address}</td>
                            <td>{x.client_email}</td>
                            {/* <td><DeleteObject id={x.client_id} dataType={0} /></td> */}
                        </tr>
                    })}
                </>}

                {dataType == 1 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.staff_id}</td> <td>{x.name}</td> <td>{x.surname}</td>
                            <td>{x.email}</td> <td>{x.breads_prepared}</td>
                            {/* <td><DeleteObject id={x.staff_id} dataType={1} /></td> */}
                        </tr>
                    })}
                </>}

                {dataType == 2 && <>
                    {data.map(x => { return <tr className="searchItem"><td>{x.bread_category_id}</td> <td>{x.bread_category_name}</td> <td><DeleteObject id={x.bread_category_id} dataType={2} /></td></tr> })}
                </>}

                {dataType == 3 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.ingredient_id}</td> <td>{x.ingredient_name}</td>  <td>{x.amount_unit}</td>
                            <td className={Number(x.amount_in_stock)<Number(x.minimal_amount)?'danger':''}>{x.amount_in_stock}</td> 
                            {/* <td><DeleteObject id={x.ingredient_id} dataType={3} /></td> */}
                            </tr>
                    })}
                </>}

                {dataType == 4 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.stock_ingredient_id}</td> <td>{x.amount}</td>
                            <td><Link href={`/ingredients/${x.ingredient_id}`}>{x.ingredient_id}:{x.ingredient_name}</Link></td>
                            <td>{x.expiry_date}</td> <td><DeleteObject id={x.stock_ingredient_id} dataType={4} /></td></tr>
                    })}
                </>}

                {dataType == 5 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td><Link href={`/breads/${x.bread_id}`}>{x.bread_id}</Link></td> <td>{x.bread_name}</td>
                            <td>{x.bread_category_id}:{x.bread_category_name}</td> <td>{x.price}</td> <td><DeleteObject id={x.bread_id} dataType={5} /></td></tr>
                    })}
                </>}

                {dataType == 6 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.recipe_element_id}</td> <td><Link href={`/ingredients/${x.ingredient_id}`}>{x.ingredient_id}:{x.ingredient_name}</Link></td>
                            <td>{x.amount}</td> <td>{x.amount_unit}</td> <td><DeleteObject id={x.ingredient_id} dataType={6} /></td></tr>
                    })}
                </>}

                {dataType == 7 && <>
                    {data.map(x => {
                        return <tr className={`searchItem ${getNthBit(x.order_flag,0) ? 'closedOrder' : ''}`}><td><Link href={`/orders/${x.order_id}`}>{x.order_id}</Link></td>
                            <td><Link href={`/clients/${x.client_id}`}>{x.client_id}:{x.client_name}</Link></td> <td>{x.sum_of_order}</td>
                            {!getNthBit(x.order_flag,0) && <><td><DeleteObject id={x.order_id} dataType={7} /></td> <td><CloseOrder orderId={x.order_id}/></td></>}</tr>
                            // <td>flag {getNthBit(x.order_flag,0)}</td>
                    })}
                </>}

                {dataType == 8 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.order_elem_id}</td> <td><Link href={`/breads/${x.bread_id}`}>{x.bread_id}:{x.bread_name}</Link></td> <td>{x.quantity}</td>
                            <td>{x.price}</td> <td><Link href={`/staff/${x.staff_id}`}>{x.staff_id}:{x.name} {x.surname}</Link></td> 
                            {!getNthBit(x.order_flag,0) && <td><DeleteObject id={x.order_elem_id} dataType={8} /></td>} </tr>
                    })}
                </>}

                {dataType == 9 && <>
                    {data.map(x => {
                        return <tr className="searchItem"><td>{x.minimal_stock_id}</td>
                        <td><Link href={`/ingredients/${x.ingredient_id}`}>{x.ingredient_id}:{x.ingredient_name}</Link></td> <td>{x.minimal_amount}</td>
                             <td><DeleteObject id={x.minimal_stock_id} dataType={9} /></td></tr>
                    })}
                </>}
            </table>

            <MessageBox dataType={dataType} query={sql}></MessageBox>
        </div>
    );
};

export default ListObjects;