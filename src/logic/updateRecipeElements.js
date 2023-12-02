import { queryData } from "./fulfillOrder"


export const UpdateRecipeElement = (recipe_element_id, ingredient_id, amount) => {

    var q = `UPDATE recipe_element SET ingredient_id = ${ingredient_id}, amount = ${amount} where recipe_element_id = ${recipe_element_id};`

    if (confirm(q)) {
        queryData(q)
    }
} 