const inquirer = require("inquirer");
const mysql = require("mysql");

let deptArr = []
let roleArr = []
let employeeArr = []
let empl=[]

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Winter2021",
    database: "employee_db"
})

connection.connect(err => {
    if (err) throw err
    console.log("Connected Properly!")

    populateEmployee()
    populateDepartment()
    populateRoles()
    startApp()

})

async function startApp() {
    await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do today?",
            choices: [
                "View departments",
                "View roles",
                "View employees",
                "Add department",
                "Add role",
                "Add employees",
                "Update employees",
                // "Remove employees"
            ]
        }
    ]).then(response => {
        console.log(response)
        if (response.choice == "View departments") {
            viewDept()
        } else if (response.choice == "Add department") {
            addDept()
        } else if (response.choice == "View roles") {
            viewRole()
        } else if (response.choice == "Add role") {
            addRole()
        } else if (response.choice == "Add employees") {
            addEmployee()
        } else if (response.choice == "View employees") {
            ViewEmployee()
        } else if (response.choice == "Update employees") {
    
         }
        else
            updateEmployee()
    })
}



function viewDept() {
    let statement = `
    SELECT *
    FROM department`

    connection.query(statement, (err, data) => {
        if (err) throw err;
        console.log("\n")
        console.table(data)
        console.log("\n")
        startApp()
    })
}

function viewRole() {
    let statement = `
    SELECT role.role_title,role.role_salary, department.department_name
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id`


    connection.query(statement, (err, data) => {
        if (err) throw err;
        console.log("\n")
        console.table(data)
        console.log("\n")

        startApp()
    })
}

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "newDept",
            message: "What is the name of your new Department?"
        }
    ]).then(({ newDept }) => {
        let statement = `
        INSERT INTO department (department_name)
        VALUES (?)`

        connection.query(statement, [newDept], (err, data) => {
            if (err) throw err;
            console.log("\n")
            console.log("Added new Department!!!!");
            console.log("\n")
            populateDepartment()
            startApp()
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "newTitle",
            message: "What is this role's Title?"
        },
        {
            type: "input",
            name: "newSalary",
            message: "What is this role's Salary?"
        },
        {
            type: "list",
            name: "deptId",
            message: "Which department does this role belong to?",
            choices: deptArr
        }
    ]).then(roleResponse => {
        let statement = `
        INSERT INTO role (role_title, role_salary, department_id)
        VALUES (?,?,?)`

        connection.query(statement, [roleResponse.newTitle, roleResponse.newSalary, deptArr.indexOf(roleResponse.deptId) + 1], (err, data) => {
            if (err) throw err;
            console.log(data)
            populateRoles()
            startApp()
        })
    })
}
function populateRoles() {
    roleArr = [];
    let statement = `
    SELECT * 
    FROM role`

    connection.query(statement, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            roleArr.push(data[i].role_title)
        }
    })
}


function populateDepartment() {
    deptArr = [];
    let statement = `
    SELECT * 
    FROM department`

    connection.query(statement, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            deptArr.push(data[i].department_name)
        }
    })
}
function populateEmployee() {
    employeeArr = [];
    let statement = `
    SELECT *
    FROM employee`;

    connection.query(statement, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            employeeArr.push(data[i].first_name)
        }
    })
}

function ViewEmployee() {
    let statement = `
    SELECT employee.id, first_name, last_name, role_title
    FROM employee
    JOIN role
    ON employee.role_id = role.id`

    connection.query(statement, (err, data) => {
        if (err) throw err;
        console.log("\n")
        console.table(data)
        console.log("\n")

        startApp()
    })
}

function addEmployee() {

    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is new Enployee First Name?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What is new Employee Last Name?",
        },

        {
            type: "list",
            name: "roleId",
            message: "What is role?",
            choices: roleArr
        },

        {
            type: "list",
            name: "MgrId",
            message: "Which Manager do you report to?",
            choices: employeeArr

        }
    ]).then(EmplResponse => {
        let statement = `
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)`

        connection.query(statement, [EmplResponse.firstName, EmplResponse.lastName, roleArr.indexOf(EmplResponse.roleId) + 1, employeeArr.indexOf(EmplResponse.MgrId) + 1], (err, data) => {
            if (err) throw err;
            console.table(data)
            populateEmployee()

            startApp()
        })
    })
}

function updateEmployee() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which Employee needs an update?",
            name: "update",
            choices: employeeArr
        },
        {
            type: "list",
            message: "What is their updated role?",
            name: "newRole",
            choices: roleArr
        }
    ]).then(updateRes => {
        let statement = `
        UPDATE employee SET role_id = ?
        WHERE employee.id = ?`

        connection.query(statement, [roleArr.indexOf(updateRes.newRole) + 1, employeeArr.indexOf(updateRes.update) + 1], err => {
            if (err) throw err;
            console.log("\nUpdated a Role")

            startApp()
        })
    })
}
function employeeList(){
connection.query("SELECT * from employee;",(err,data)=> {
    if (err) throw err;
data.map(({id,first_name})=>({
       name:first_name,
       value:id
   }))

    
})
}
