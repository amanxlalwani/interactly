const express = require("express");
const { init } = require("express/lib/application");
const mysql = require("mysql2");
const app = express();
app.use(express.json());
require("dotenv").config();

const db = mysql.createConnection({
  database: "testDb",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
});

const initQuery =
  "CREATE TABLE IF NOT EXISTS contacts(id int AUTO_INCREMENT, first_name VARCHAR(50), last_name VARCHAR(50), email VARCHAR(50),mobile_number VARCHAR(20) , PRIMARY KEY(id));";
db.query(initQuery, (err) => {
  if (err) console.log(err);
});

app.post("/createContact", async (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;
  if (data_store == "CRM") {
    try {
      const response = await fetch(
        "https://student-751320635689111207.myfreshworks.com/crm/sales/api/contacts",
        {
          body: JSON.stringify({
            contact: { first_name, last_name, mobile_number, email },
          }),
          headers: {
            Authorization: "Token token="+process.env.CRM_TOKEN,
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
      const data = await response.json();
      res.json({ data });
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else if (data_store == "DB") {
    try {
      const createQuery =
        "INSERT INTO contacts(first_name,last_name,email,mobile_number) VALUES (?,?,?,?) ; ";
      db.query(
        createQuery,
        [first_name, last_name, email, mobile_number],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          db.query(
            "SELECT * FROM contacts WHERE id =?",
            [result.insertId],
            (err, result) => {
              res.json({ data: result });
            }
          );
        }
      );
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else {
    res.json({ message: "Please send a valid data store" });
  }
});

app.get("/getContact", async (req, res) => {
  const { contact_id, data_store } = req.body;
  if (data_store == "CRM") {
    try {
      const contact = await fetch(
        "https://student-751320635689111207.myfreshworks.com/crm/sales/api/contacts/" +
          contact_id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token token="+process.env.CRM_TOKEN,
          },
        }
      );

      const data = await contact.json();
      res.json({ data });
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else if (data_store == "DB") {
    try {
      db.query(
        "SELECT * FROM contacts WHERE id =?",
        [contact_id],
        (err, result) => {
          res.json({ data: result });
        }
      );
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else {
    res.json({ message: "Please send a valid data store" });
  }
});

app.post("/updateContact", async (req, res) => {
  const { contact_id, email, mobile_number, data_store } = req.body;
  if (data_store == "CRM") {
    try {
      const response = await fetch(
        "https://student-751320635689111207.myfreshworks.com/crm/sales/api/contacts/" +
          contact_id,
        {
          body: JSON.stringify({ email, mobile_number }),
          headers: {
            Authorization: "Token token="+process.env.CRM_TOKEN,
            "Content-Type": "application/json",
          },
          method: "PUT",
        }
      );
      const data = await response.json();
      res.json({ data });
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else if (data_store == "DB") {
    try {
      const updateQuery =
        "UPDATE contacts SET mobile_number=? , email=? WHERE id = ? ; ";
      db.query(
        updateQuery,
        [mobile_number, email, contact_id],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          db.query(
            "SELECT * FROM contacts WHERE id =?",
            [contact_id],
            (err, result) => {
              res.json({ data: result });
            }
          );
        }
      );
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else {
    res.json({ message: "Please send a valid data store" });
  }
});

app.post("/deleteContact", async (req, res) => {
  const { contact_id, data_store } = req.body;
  if (data_store == "CRM") {
    try {
      const response = await fetch(
        "https://student-751320635689111207.myfreshworks.com/crm/sales/api/contacts/" +
          contact_id,
        {
          headers: {
            Authorization: "Token token="+process.env.CRM_TOKEN,
            "Content-Type": "application/json",
          },
          method: "DELETE",
        }
      );
      const data = await response.json();
      res.json({ data });
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else if (data_store == "DB") {
    try {
      const deleteQuery = "DELETE FROM contacts WHERE id = ? ; ";
      db.query(deleteQuery, [contact_id], (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.json({ data: true });
      });
    } catch (e) {
      console.log(e);
      res.json({ message: "Something went wrong!" });
    }
  } else {
    res.json({ message: "Please send a valid data store" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
