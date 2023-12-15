const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());

const pool = require("./database.js");
const port = 5000;
app.listen(port, () => {
  console.log(`Listening at port ${port}...`);
});

///////////////////////////////////////////////

//-------------------------LOGIN

//login as customer - DONE
app.get("/login/customer", async (req, res) => {
  try {
    const { username, password } = req.params.username;
    const query = await pool.query("select * from customer where username=$1", [
      username,
    ]);
    console.log(query.rows);
    if (query.rows.length && query.rows[0].password == password)
      res.status(200).json({
        message: "User signed in!",
      });
  } catch (error) {
    res.send(error);
  }
});

//login as employee
app.get("/login/employee", async (req, res) => {
  try {
    const { username, password } = req.params.username;
    const query = await pool.query(
      "select * from EMP_LOGIN where username=$1",
      [username]
    );
    console.log(query.rows);
    if (query.rows.length && query.rows[0].password == password)
      res.status(200).json({
        message: "User signed in!",
      });
  } catch (error) {
    res.send(error);
  }
});

////////////////////////////////////////////////

// ------------------------ CUSTOMER

// add customer - DONE
app.post("/employee/customer/add", async (req, res) => {
  try {
    console.log(req.body);
    const { account_no, username, password } = req.body;
    console.log(`${username}`);
    const query = await pool.query("call insert_into_customer($1,$2,$3)", [
      account_no,
      username,
      password,
    ]);
    res.send(query);
  } catch (err) {
    res.send(err.message);
  }
});

// get all customers  - DONE
app.get("/employee/customer/get-all", async (req, res) => {
  try {
    const query = await pool.query("select * from customer");
    res.json(query.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//delete customer by id -- DONE
app.delete("/employee/customer/delete/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;
    const query = await pool.query(
      "delete from customer where customer_id=cast($1 as integer)",
      [customer_id]
    );
    res.send("Deleted");
  } catch (error) {
    res.send(error);
  }
});

//put
app.put("/customer/:username", async (req, res) => {
  try {
    const { username } = req.params;
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/login/employee", async (req, res) => {
  try {
    const { username, user_password } = req.body;
    const query = await pool.query("call insert_into_emp_login($1,$2)", [
      username,
      user_password,
    ]);
    res.send("Inserted record into EMP_LOGIN table...");
  } catch (err) {
    console.error(err.message);
  }
});

//delete employee with username
app.delete("/employee/delete/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
    const query = await pool.query(
      "delete from emp_login where username = $1 returning *",
      [username]
    );
    res.send("Employee Deleted");
  } catch (error) {
    res.send(error);
  }
});

// -------------------- Accounts
app.post("/accounts", async (req, res) => {
  try {
    const { customer_id, current_balance } = req.body;
    console.log(req.body);
    const query = await pool.query("call insert_into_accounts($1,$2)", [
      customer_id,
      current_balance,
    ]);
    res.send("Record Inserted");
  } catch (err) {
    console.error(err.message);
  }
});
app.delete("/accounts/:account_id", async (req, res) => {
  try {
    const { account_id } = req.params;
    const query = await pool.query(
      "delete from accounts where account_id=cast($1 as integer)",
      [account_id]
    );
    res.send("Deleted");
  } catch (error) {
    res.send(error);
  }
});
app.get("/accounts", async (req, res) => {
  try {
    const query = await pool.query("select * from accounts");
    res.json(query.rows);
  } catch (error) {
    res.send(error);
  }
});
app.get("/accounts/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;
    const query = await pool.query(
      "select account_id,date_opened,current_balance from accounts where customer_id=$1",
      [customer_id]
    );
    console.log(query.rows);
    res.json(query.rows);
  } catch (error) {
    res.send(error);
  }
});

//--------------------- BRANCH

// get all branch - DONE
app.get("/employee/branch/get-all", async (req, res) => {
  try {
    const query = await pool.query("select * from branch");
    res.json(query.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// add branch - DONE
app.post("/b", async (req, res) => {
  try {
    console.log(req.body);
    const { branch_name, branch_address } = req.body;
    const query = await pool.query("call insert_into_branch($1,$2,$3,$4)", [
      branch_name,
      branch_address,
    ]);
    res.send("Inserted record into Branch table...");
  } catch (err) {
    console.error(err.message);
  }
});

//delete branch by id - DONE
app.delete("/employee/branch/delete/:branch_id", async (req, res) => {
  try {
    const { branch_id } = req.params;
    const query = await pool.query(
      "delete from branch where branch_id=cast($1 as integer)",
      [branch_id]
    );
    res.send("Deleted from branch..");
  } catch (error) {
    res.send(error);
  }
});

app.post("/transaction", async (req, res) => {
  try {
    console.log(req.body);
    const { account_id, branch_id, amount, action } = req.body;
    const query = await pool.query(
      "call insert_into_transaction($1,$2,$3,$4)",
      [account_id, branch_id, amount, action]
    );
    res.send("Inserted record into Transaction table...");
  } catch (error) {
    res.send(req.query);
  }
});

app.get("/transaction/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;
    const query = await pool.query(
      "select transaction.*,accounts.customer_id from transaction left join accounts on accounts.account_id=transaction.account_id where accounts.customer_id=cast($1 as integer)",
      [customer_id]
    );
    console.log(query.rows);
    res.send(query.rows);
  } catch (error) {
    res.send(error);
  }
});
//get

//get all employee
app.get("/employee/get-all-employee", async (req, res) => {
  try {
    const query = await pool.query("select * from EMP_LOGIN");
    res.json(query.rows);
  } catch (err) {
    console.error(err.message);
  }
});
