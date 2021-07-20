import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';

const routes: Routes = [
    {path:'', component: ListEmployeeComponent},
    {path:'add', component:AddEmployeeComponent},
    {path:'edit/:employeeId', component:AddEmployeeComponent}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
