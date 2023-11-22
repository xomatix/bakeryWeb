import {  apiUrlQuery } from "../components/constants";
import { setNthBit } from "./bitOperators";


export async function FulfillOrder(id) {
    //calculate ingredients needed
    let queriesMade = ''

    // console.log("started closing order with id: "+id)
    let q = `select bread_id,sum(quantity)  from order_element  where order_id = ${id} group by bread_id;`
    let obj = "bread_id,quantity"
    let orderElems = await queryData(q,obj);
    if (orderElems.length <1) {
        return;
    }
    queriesMade+=q+"\n"

    q = `select ingredient_id,amount,bread_id  from recipe_element re where bread_id in (${orderElems.map((x) => {return x.bread_id}).join(',')}) ;`
    obj = "ingredient_id,amount,bread_id"
    let ingredients = await queryData(q,obj);
    queriesMade+=q+"\n"

    // console.log("what i need" )
    // console.log(ingredients)

    //recalculate ingredients needed
    ingredients.forEach(ingr => {
        orderElems.forEach(oe => {
            if (ingr.bread_id == oe.bread_id) {
                console.log(ingr.amount * oe.quantity)
                ingr.amount = ingr.amount * oe.quantity
            }
        })
    });
    
    q = `select i.ingredient_id ,sum(s.amount),i.ingredient_name from ingredients i left join stock s on s.ingredient_id =i.ingredient_id  where i.ingredient_id in (${ingredients.map(x => {return x.ingredient_id})}) group by i.ingredient_id ;`
    obj = "ingredient_id,amount,ingredient_name"
    let stockForIngredients = await queryData(q,obj);
    queriesMade+=q+"\n"

    let missingMsg = ''
    stockForIngredients.forEach(sto => {
        sto.amount = sto.amount == null ? 0 : sto.amount
        ingredients.forEach(ing => {
            if(sto.ingredient_id==ing.ingredient_id && sto.amount<ing.amount){
                missingMsg+= `${sto.ingredient_id} ${sto.ingredient_name},`
            }
        });
    });

    if (missingMsg != '') {
        alert("missing ingredients: "+missingMsg)
        return;
    }
    
    q = `select * from stock s where s.ingredient_id in (${ingredients.map(x => {return x.ingredient_id})}) order by s.expiry_date ;`
    obj = "stock_ingredient_id,amount,ingredient_id,expiry_date"
    let stock = await queryData(q,obj);
    queriesMade+=q+"\n"

    // console.log("stock przed:")
    // console.log(stock)

    let updateQuery = "" 
    stock.forEach(stockElem => {
        ingredients.forEach(ing => {
            if (stockElem.ingredient_id==ing.ingredient_id) {
                
                if (ing.amount > 0 && ing.amount > stockElem.amount) {
                    ing.amount = ing.amount - stock.amount;
                    stockElem = 0;
                    updateQuery += `UPDATE stock \
                    SET amount = 0 \
                    WHERE stock_ingredient_id=${stockElem.stock_ingredient_id};`
                }

                else if (ing.amount > 0 && ing.amount < stockElem.amount) {
                    stockElem.amount = stockElem.amount-ing.amount
                    ing.amount = 0
                    updateQuery += `UPDATE stock \
                    SET amount = ${stockElem.amount} \
                    WHERE stock_ingredient_id=${stockElem.stock_ingredient_id};`
                }
            }
        });
    });

    q = `select * from orders o where o.order_id = ${id} limit 1 ;`
    obj = "order_id,client_id,order_flag"
    let order = await queryData(q,obj);
    queriesMade+=q+"\n"

    let updatedOrderFlag = setNthBit(Number(order.order_flag), 0, 1);

    updateQuery += `update orders \
    set order_flag = ${updatedOrderFlag} \
    where order_id = ${id};`

    // console.log("stock po:")
    // console.log(stock)

    // console.log(orderElems)
    
    // console.log("what i have" + stockForIngredients)

    alert(updateQuery);
    alert(queriesMade);
    if (confirm("Are you sure you want to close order?")) {
        await postData(updateQuery);
    }
}


async function queryData(qSql, objText ) {
    let data = []

    const apiUrl = apiUrlQuery; // replace with your actual API endpoint
    let q = qSql
    let obj = objText // column_name,column2_name,...

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: q,
            object: obj,
        }),
    };

    await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((d) => {

            data = d

            // console.log(d)
        });
    return data;
}

async function postData(qSql) {
    let data = []

    const apiUrl = apiUrlQuery; // replace with your actual API endpoint
    let q = qSql

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: q,
        }),
    };

    await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((d) => {

            data = d

            // console.log(d)
        });
    return data;
}