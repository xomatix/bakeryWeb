import { queryData } from "./fulfillOrder"


export const UpdateRecipeElement = (ingredient_id, bread_id, amount) => {

    var q = `UPDATE recipe_element SET  amount = ${amount} where ingredient_id = ${ingredient_id} and bread_id = ${bread_id};`

    if (confirm(q)) {
        queryData(q)
    }
} 