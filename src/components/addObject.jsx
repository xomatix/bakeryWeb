import { useEffect, useState } from "preact/hooks";
import SelectObject from "./selectObject";
import MessageBox from "./messageBox";
import ToggleComponentButton from './toggleComponentButton'
import { apiUrlQuery } from "./constants";


const AddObject = ({ dataType, id }) => {

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

    const [keys, setKeys] = useState([])
    const [headers, setHeaders] = useState([])
    const [values, setValues] = useState([])
    const [valuesTypes, setValuesTypes] = useState([])

    useEffect(() => {
        switch (dataType) {
            case 0:
                setKeys(['client_name', 'client_address', 'client_email'])
                setValuesTypes(['str', 'str', 'email'])
                break;
            case 1:
                setKeys(['name', 'surname', 'email'])
                setValuesTypes(['str', 'str', 'email'])
                break;
            case 2:
                setKeys(['bread_category_name'])
                setValuesTypes(['str'])
                break;
            case 3:
                setKeys(['ingredient_name', 'amount_unit'])
                setValuesTypes(['str', 'str'])
                break;
            case 4:
                setKeys(['amount', 'ingredient_id', 'expiry_date'])
                setValuesTypes(['int', 'obj:3', 'date'])
                break;
            case 5:
                setKeys(['bread_name', 'bread_category_id', 'price'])
                setValuesTypes(['str', 'obj:2', 'int'])
                break;
            case 6:
                setKeys(['ingredient_id', 'amount', 'amount_unit', 'bread_id'])
                setHeaders(['ingredient id', 'amount', 'amount unit'])
                setValuesTypes(['obj:3', 'int', 'str'])
                let vals = values
                vals[3] = Number(id.bread_id)
                setValues(vals)
                break;
            case 7:
                setKeys(['client_id'])
                setValuesTypes(['obj:0'])
                break;
            case 8:
                setKeys(['bread_id', 'quantity', 'price', 'staff_id', 'order_id'])
                setHeaders(['bread id', 'quantity', 'price', 'staff id'])
                setValuesTypes(['obj:5', 'int', 'int', 'obj:1'])
                let vals8 = values
                vals8[4] = Number(id)
                setValues(vals8)
                break;
            case 9:
                setKeys(['ingredient_id', 'minimal_amount'])
                setValuesTypes(['obj:3', 'int'])
                break;
            default:
                break;
        }

    }, [])

    const SubmitData = async () => {
        if (values.length < valuesTypes.length) {
            alert("Fill all values")
            return;
        }

        const apiUrl = apiUrlQuery;

        let q = 'insert into '
        let vals = []
        switch (dataType) {
            case 0:
                q += `clients `
                break;
            case 1:
                q += `staff `
                break;
            case 2:
                q += `bread_categories `
                break;
            case 3:
                q += `ingredients `
                break;
            case 4:
                q += `stock `
                break;
            case 5:
                q += `breads `
                break;
            case 6:
                q += `recipe_element `
                break;
            case 7:
                q += `orders `
                break;
            case 8:
                q += `order_element `
                break;
            case 9:
                q += `minimal_stock `
                break;

            default:
                break;
        }

        for (let i = 0; i < keys.length; i++) {
            vals.push(typeof values[i] == 'number' ? values[i] : `'${values[i]}'`);
        }
        q += ` (${keys.join(',')}) values (${vals.join(',')});`

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

        window.location = window.location.href.split('/').slice(0, -1).join("/")
    }

    const onInputChange = (index, value) => {
        let oldValues = values;
        oldValues[index] = valuesTypes[index] == 'int' || valuesTypes[index].split(':')[0] == 'obj' ? Number(value) : value
        setValues(oldValues)
        console.log(values)
    }

    const handleClick = (index, value) => {
        // console.log('Button clicked!' + index + "  " + value);
        onInputChange(index, value)
    };

    const DynamicInput = ({ varType, index }) => {
        switch (varType.split(':')[0]) {
            case 'int':
                return <input type="number" value={values[index]} onInput={(e) => onInputChange(index, e.target.value)} />;
            case 'str':
                return <input type="text" onInput={(e) => onInputChange(index, e.target.value)} />;
            case 'email':
                return <input type="email" onInput={(e) => onInputChange(index, e.target.value)} />;
            case 'date':
                return <input type="date" onInput={(e) => onInputChange(index, e.target.value)} />;
            case 'obj':
                return (<div style={{ display: 'flex' }}>
                    {/* <input type="number" value={values[index]} onInput={(e) => onInputChange(index, e.target.value)} /> */}
                    <SelectObject objectType={Number(varType.split(':')[1])}
                        onClickFunction={handleClick} index={index} excludeUsed={dataType == 9}></SelectObject>
                </div>);

            default:
                return <p>Unsupported type: {varType}</p>;
        }
    };

    return (
        <>
            add object
            <table>
                <tr>
                    {headers.length == 0 && keys.map(x => { return <th>{x}</th> })}
                    {headers.length > 0 && headers.map(x => { return <th>{x}</th> })}
                </tr>

                <tr>
                    {valuesTypes.map((x, index) => {
                        return <td className="addItem"><DynamicInput varType={x} index={index}></DynamicInput></td>
                    })}
                </tr>
            </table>

            <button style={{ marginTop: '10px' }} onClick={SubmitData}>Save Record</button>

            <MessageBox dataType={dataType}></MessageBox>
        </>
    )
}

export default AddObject;