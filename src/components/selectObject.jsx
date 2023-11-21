import { useEffect, useState } from "preact/hooks";


const SelectObject = ({ objectType, onClickFunction, index }) => {

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

    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [value, setValue] = useState(null);

    const handleButtonClick = () => {
        setIsVisible(!isVisible);
    };

    const handleCloseButtonClick = (v = null, text = null) => {
        setValue(v + ":" + text)
        onClickFunction && onClickFunction(index, v);
        setIsVisible(false);
    };

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        //this.setState({ isLoading: true });

        const apiUrl = 'http://localhost:8000/query'; // replace with your actual API endpoint

        let q = ''
        let obj = ''
        let customHeaders = ''
        switch (objectType) {
            case 0:
                q = 'select * from clients ;'
                obj = 'client_id,client_name'
                break;
            case 1:
                q = 'select staff_id , concat( name, \' \', surname)  from staff ;'
                obj = 'staff_id,name_surname'
                break;
            case 2:
                q = 'select * from bread_categories  ;'
                obj = 'bread_category_id,bread_category_name'
                break;
            case 3:
                q = 'select * from ingredients '
                obj = 'ingredient_id,ingredient_name'
                break;
            case 4:
                q = 'select stock_ingredient_id,amount,s.ingredient_id,expiry_date,ingredient_name  from stock s join ingredients i on s.ingredient_id = i.ingredient_id;'
                obj = 'stock_ingredient_id,amount,ingredient_id,expiry_date,ingredient_name'
                customHeaders = 'stock_ingredient_id,amount,ingredient_id,expiry_date'
                break;
            case 5:
                q = 'select bread_id,bread_name from breads order by bread_id asc;'
                obj = 'bread_id,bread_name'
                break;
            case 6:
                q = `select recipe_element,re.ingredient_id,re.amount ,re.amount_unit ,ingredient_name from recipe_element re join ingredients i on re.ingredient_id =i.ingredient_id  where bread_id = ${id}`;
                obj = 'recipe_element,ingredient_id,amount,amount_unit,ingredient_name'
                customHeaders = 'recipe_element,ingredient_id,amount,amount_unit'
                break;
            case 7:
                q = `select o.order_id,c.client_id,c.client_name, sum(oe.price*oe.quantity) as sum_of_order from orders o join clients c on c.client_id = o.client_id 
                join order_element oe on oe.order_id = o.order_id GROUP BY
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


        console.log(q)

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
                setData(d);
                console.log(d)
                setHeaders(customHeaders != '' ? customHeaders.split(',') : Object.keys(d.at(0)))
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };


    return (
        <div>
            <div style={{ display: 'flex' }}>

                <button onClick={handleButtonClick}>🔎</button>
                <p style={{ marginLeft: '10px' }}>ID: {value}</p>
            </div>
            {isVisible && (
                <div style={{ minWidth: '30%', display: 'block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: '#131f29', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
                    <p>object Type: {objectType}</p>

                    <table>
                        <tr>
                            {headers.map(x => { return <th>{x}</th> })}

                        </tr>


                        {objectType == 0 && data.map((x, index) => {
                            return <tr><td className="addItem">{x.client_id}</td> <td className="addItem">{x.client_name}</td>
                                <button onClick={() => { handleCloseButtonClick(x.client_id, x.client_name) }}>🗝️</button></tr>
                        })}

                        {objectType == 1 && data.map((x, index) => {
                            return <tr><td className="addItem">{x.staff_id}</td> <td className="addItem">{x.name_surname}</td>
                                <button onClick={() => { handleCloseButtonClick(x.staff_id, x.name_surname) }}>🗝️</button></tr>
                        })}

                        {objectType == 2 && data.map((x, index) => {
                            return <tr><td className="addItem">{x.bread_category_id}</td> <td className="addItem">{x.bread_category_name}</td>
                                <button onClick={() => { handleCloseButtonClick(x.bread_category_id, x.bread_category_name) }}>🗝️</button></tr>
                        })}

                        {objectType == 3 && data.map((x, index) => {
                            return <tr><td className="addItem">{x.ingredient_id}</td> <td className="addItem">{x.ingredient_name}</td>
                                <button onClick={() => { handleCloseButtonClick(x.ingredient_id, x.ingredient_name) }}>🗝️</button></tr>
                        })}

                        {objectType == 5 && data.map((x, index) => {
                            return <tr><td className="addItem">{x.bread_id}</td> <td className="addItem">{x.bread_name}</td>
                                <button onClick={() => { handleCloseButtonClick(x.bread_id, x.bread_name) }}>🗝️</button></tr>
                        })}

                    </table>

                    <button onClick={handleCloseButtonClick}>Close</button>
                </div>)}
        </div>
    );
};

export default SelectObject;