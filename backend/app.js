const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const EmployeeData = require("./models/employeeData");

const app = express();

mongoose
  .connect(
    "mongodb://prakashsrinivasan:Architech_140395@employeedetails-shard-00-00.iao6z.mongodb.net:27017,employeedetails-shard-00-01.iao6z.mongodb.net:27017,employeedetails-shard-00-02.iao6z.mongodb.net:27017/EmployeePortal?ssl=true&replicaSet=atlas-11ofbe-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/employees", (req, res, next) => {
  const employeeData = new EmployeeData({
    empCode: req.body.empCode,
    empName: req.body.empName,
    empRole: req.body.empRole,
    empDob: req.body.empDob,
  });
  employeeData.save().then((createdEmployee) => {
    res.status(201).json({
      message: "Employee added successfully",
      employeeId: createdEmployee._id,
    });
  });
});

app.put("/api/employees/:id", (req, res, next) => {
  const employee = new EmployeeData({
    _id: req.body.id,
    empCode: req.body.empCode,
    empName: req.body.empName,
    empRole: req.body.empRole,
    empDob: req.body.empDob,
  });
  EmployeeData.updateOne({ _id: req.params.id }, employee).then((result) => {
    console.log(result, "res");
    res.status(200).json({ message: "update Successful" });
  });
});

app.get("/api/employees", (req, res, next) => {
  EmployeeData.find().then((documents) => {
    console.log(documents, "doc:::");
    res.status(200).json({
      message: "Employees fetched successfully!",
      employeeData: documents,
    });
  });
});

app.get("/api/employees/:id", (req, res, next) => {
  EmployeeData.findById(req.params.id).then((em) => {
    if (em) {
      res.status(200).json(em);
    } else {
      res.status(404).json({ message: "Employee Not Found!" });
    }
  });
});

app.delete("/api/employees/:id", (req, res, next) => {
  EmployeeData.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Employee deleted!" });
  });
});

module.exports = app;
