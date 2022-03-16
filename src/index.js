const { request } = require('express');
const { response } = require('express');
const express = require('express');
const {v4:uuidv4} = require('uuid')
const app = express();
app.use(express.json())

const customers = [];

//middleware function to verify BI
function verifyIfExisteAccountCPF (request, response, next){
    const {bi} = request.headers;
    const customersSize = customers.length //getting the customers size to know if there is data or not

    //If no data into the customer array return erro 400 state code
    if(customersSize <=0)return response.status(400).json({message:"Customer BI not exist"});
    
    //verify if BI exist into the customer array
    const customer = customers.find(customer=>customer.bi === bi);
    //If the Bi request not exist return erro 400
    if(!customer)return response.status(400).json({message:"Customer not found"});

    //create customer proprety and set the customer value
    request.customer = customer
    return next()

}

function getBalance(statement){
    const balance = statement.reduce((acc, operation)=>{
        if(operation.type ===  'credit'){
            return acc + operation.amount;
        }else{
            return acc - operation.amount;
        }
    },0)

    return balance;
}


//create user method
app.post('/account',(request, response)=>{
    const {bi, name} = request.body;

    //verify if customer bi already exist
    const customersAlreadyExist = customers.some(customer=>customer.bi == bi)
    if(customersAlreadyExist){
        return response.status(400).json({erro:"This customer BI already exist!"})
    }

    //create a new user
    let user = {id:uuidv4(), bi, name, statement:[]}
    //add this user into customers array - (database)
    customers.push(user)

    return response.status(201).send()

})

//Usiong BI to list user statement
app.get('/statement',verifyIfExisteAccountCPF,(request, response)=>{
        const {customer} = request;
        return response.json(customer.statement)
})

//
app.post('/deposit',verifyIfExisteAccountCPF,(request, response)=>{

    const {description, amount} = request.body;
    const {customer} = request;
    console.log(request.body)
    const satatementOpereation = {
        description,
        amount,
        create_at: new Date(),
        type:'credit',
    }

    customer.statement.push(satatementOpereation)
    return response.status(201).send()
})


//
app.post('/withdraw',verifyIfExisteAccountCPF,(request, response)=>{
    const {amount} = request.body;
    const {customer} = request;

    const balance = getBalance(customer.statement)

    if(balance < amount){
        return response.status(400).json({message:"Insuffient founds!"})
    }

    const satatementOpereation = {
        amount,
        create_at: new Date(),
        type:'debit'
    }

    customer.statement.push(satatementOpereation);
    return response.status(201).send()


})


app.get('/statement/date',verifyIfExisteAccountCPF,(request, response)=>{
    const {customer} = request;
    const {date} = request.query;

    const formatDate = new Date(date + ' 00:00')

    const statement = customer.statement.filter(statement=>statement.create_at.toDateString()===formatDate.toDateString())

    return response.json(statement)
})

app.put('/account',verifyIfExisteAccountCPF,(request, response)=>{
    const {customer} = request;
    const {name} =request.body;

    customer.name = name;

    return response.status(201).send()
})


app.get('/account',verifyIfExisteAccountCPF, (request, response)=>{
    const {customer} = request;

    return response.status(201).json(customer)
})


app.delete('/account',verifyIfExisteAccountCPF,(request, response)=>{
    const {customer} = request;

    //customers.splice(customer, 1);
    customers.splice(customers.indexOf(customer), 1)
    return response.status(200).json(customers)
})

app.get('/balance',verifyIfExisteAccountCPF,(request, response)=>{
    const {customer} = request;
    const balance = getBalance(customer.statement);
    
    return response.status(201).json({balance})
})

app.listen(3333,()=>
    console.log('Server is running in 3333 ')
)