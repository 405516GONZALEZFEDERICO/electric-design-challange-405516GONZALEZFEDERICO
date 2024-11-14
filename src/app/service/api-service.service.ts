import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Budget, ModuleType, Zone } from '../models/budget';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  
  private api = 'http://localhost:3000';
  
  private http=inject(HttpClient);

  getBudgetById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.api}/budgets/${id}`);
  }
  postBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.api}/budgets`,budget);
  }
  getModuleTypes():Observable<ModuleType[]>{
    return this.http.get<ModuleType[]>(`${this.api}/module-types`);
  }

  getBudgets():Observable<Budget[]>{
    return this.http.get<Budget[]>(`${this.api}/budgets`);
  }
}
