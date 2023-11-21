import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import Card from './cardComponent'
import ListObjects from './listObjects'
import Router from 'preact-router';
import Navbar from './navbar'
import StaffList from './routes/staff'
import BreadCategoriesList from './routes/breadCategories'
import IngredientsList from './routes/ingredients'
import StockList from './routes/stock'
import BreadsList from './routes/breads'
import BreadRecipeList from './routes/breadRecipe'
import OrdersList from './routes/orders'
import OrderElementsList from './routes/orderElements'
import AddClient from './routes/addClient'
import AddStaff from './routes/addStaff'
import AddBreadCategory from './routes/addBreadCategory'
import AddIngredient from './routes/addingredient'
import AddStock from './routes/addStock'
import AddRecipeElement from './routes/addRecipeElement'
import AddBread from './routes/addBread'
import AddOrderElement from './routes/addOrderElement'
import AddOrder from './routes/addOrder'

export function App() {


  const [count, setCount] = useState(0)


  return (
    <>
        <Navbar></Navbar>
      <div>
        <Router>
          <Card path="/" />
          <ListObjects path="/clients" dataType={0}  />
          <ListObjects path="/clients/:id" dataType={0}  />
          <AddClient path="/clients/add" />	

          <StaffList path="/staff" />
          <StaffList path="/staff/:staff_id" />
          <AddStaff path="/staff/add" />

          <BreadCategoriesList path="/bread_categories" />
          <AddBreadCategory path="/bread_categories/add" />

          <IngredientsList path="/ingredients" />
          <IngredientsList path="/ingredients/:ingredient_id" />
          <AddIngredient path="/ingredients/add" />

          <StockList path="/stock" />
          <AddStock path="/stock/add" />

          <BreadsList path="/breads" />
          <AddBread path="/breads/add" />
          <BreadRecipeList path="/breads/:bread_id" />
          <AddRecipeElement path="/breads/:bread_id/add" />

          <OrdersList path="/orders" />		
          <OrderElementsList path="/orders/:order_id" />		
          <AddOrder path="/orders/add" />		
          <AddOrderElement path="/orders/:order_id/add" />		
        </Router>

      </div>
      {/* <h1>Vite + Preact</h1> */}
  
    </>
  )
}
