const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  empCode: { type: String, required: true },
  empName: { type: String, required: true },
  empRole: { type: String, required: true },
  empDob: { type: String, required: true },
});

module.exports = mongoose.model("EmployeeData", employeeSchema);
