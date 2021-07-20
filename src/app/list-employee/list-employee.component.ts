import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeData } from '../employeeData.model';
import { EmployeeDataService } from '../employee-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css'],
})
export class ListEmployeeComponent implements OnInit, OnDestroy {
  dataSource: EmployeeData[] = [];
  private employeeSub: Subscription;
  isLoading = false;

  constructor(public employeeService: EmployeeDataService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeData();
    this.employeeSub = this.employeeService
      .getEmployeeDataUpdateListener()
      .subscribe((dataSource: EmployeeData[]) => {
        console.log(dataSource, 'dddd');
        this.isLoading = false;
        this.dataSource = dataSource;
      });
  }

  onDelete(employeeId: string) {
    this.employeeService.deleteEmployee(employeeId);
  }
  displayedColumns: string[] = [
    'empNo',
    'empCode',
    'empName',
    'empRole',
    'empDob',
    'actions',
  ];
  ngOnDestroy() {
    this.employeeSub.unsubscribe();
  }
}
