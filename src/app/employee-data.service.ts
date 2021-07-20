import { Injectable } from '@angular/core';
import { EmployeeData } from './employeeData.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDataService {
  private employeeData: EmployeeData[] = [];
  private employeeDataUpdated = new Subject<EmployeeData[]>();

  constructor(private http: HttpClient, private router:Router) {}
  getEmployeeData() {
    this.http
      .get<{ message: string; employeeData: any }>(
        'http://localhost:3000/api/employees'
      )
      .pipe(
        map((emp) => {
          console.log(emp,"emp:::::")
          return emp.employeeData.map((empData, index) => {
            console.log(empData, 'eee');
            return {
              empCode: empData.empCode,
              empName: empData.empName,
              empRole: empData.empRole,
              empDob: empData.empDob,
              id: empData._id,
              index: index + 1,
            };
          });
        })
      )
      .subscribe((transformedEmployee) => {
        this.employeeData = transformedEmployee;
        this.employeeDataUpdated.next([...this.employeeData]);
      });
  }

  getEmployeeDataUpdateListener() {
    return this.employeeDataUpdated.asObservable();
  }

  getEmployee(id: string) {
    return this.http.get<{
      _id: string;
      empCode: string;
      empName: string;
      empRole: string;
      empDob: string;
    }>('http://localhost:3000/api/employees/' + id);
  }

  addEmployeeData(
    empCode: string,
    empName: string,
    empRole: string,
    empDob: string
  ) {
    const data: EmployeeData = {
      id: null,
      empCode: empCode,
      empName: empName,
      empRole: empRole,
      empDob: empDob,
    };
    this.http
      .post<{ message: string; employeeId: string }>(
        'http://localhost:3000/api/employees',
        data
      )
      .subscribe((respData) => {
        const id = respData.employeeId;
        data.id = id;
        this.employeeData.push(data);
        this.employeeDataUpdated.next([...this.employeeData]);
        this.router.navigate(['/']);
      });
  }

  updateEmployee(
    id: string,
    empCode: string,
    empName: string,
    empRole: string,
    empDob: string
  ) {
    const employee: EmployeeData = {
      id: id,
      empCode: empCode,
      empName: empName,
      empRole: empRole,
      empDob: empDob,
    };
    this.http
      .put('http://localhost:3000/api/employees/' + id, employee)
      .subscribe((response) => {
        const updatedEmployee = [...this.employeeData];
        const oldEmployeeIndex = updatedEmployee.findIndex(
          (emp) => emp.id === employee.id
        );
        updatedEmployee[oldEmployeeIndex] = employee;
        this.employeeData = updatedEmployee;
        this.employeeDataUpdated.next([...this.employeeData]);
        this.router.navigate(['/']);
      });
  }

  deleteEmployee(employeeId: string) {
    this.http
      .delete('http://localhost:3000/api/employees/' + employeeId)
      .subscribe(() => {
        const updatedEmployee = this.employeeData.filter(
          (emp) => emp.id !== employeeId
        );
        this.employeeData = updatedEmployee;
        this.employeeDataUpdated.next([...this.employeeData]);
      });
  }
}
