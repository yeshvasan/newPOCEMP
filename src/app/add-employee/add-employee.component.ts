import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EmployeeDataService } from '../employee-data.service';
import { EmployeeData } from '../employeeData.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  mode = 'add'; 
  isLoading = false;
  private employeeId: string;
  employee: EmployeeData;

  constructor(
    public employeeService: EmployeeDataService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('employeeId')) {
        this.mode = 'edit';
        this.employeeId = paramMap.get('employeeId');
        // console.log(this.employeeId,"empID");
        this.isLoading = true;
        this.employeeService.getEmployee(this.employeeId).subscribe((emp) => {
          this.isLoading = false;
          this.employee = {
            id: emp._id,
            empCode: emp.empCode,
            empName: emp.empName,
            empRole: emp.empRole,
            empDob: emp.empDob,
          };
        });
      } else {
        this.mode = 'add';
        this.employeeId = null;
      }
    });
  }

  onAddEmployee(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'add') {
      this.employeeService.addEmployeeData(
        form.value.empCode,
        form.value.empName,
        form.value.empRole,
        form.value.empDob
      );
    } else {
      this.employeeService.updateEmployee(
        this.employeeId,
        form.value.empCode,
        form.value.empName,
        form.value.empRole,
        form.value.empDob
      );
    }
    form.resetForm();
  }
}
