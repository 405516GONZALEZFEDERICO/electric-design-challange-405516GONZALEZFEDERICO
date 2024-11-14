import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'budget-form',
        loadComponent: () => import('./budget-form/budget-form.component').then(m=>m.BudgetFormComponent)
    },
    {
        path:'budget-list',
        loadComponent:()=>import('./budget-list/budget-list.component').then(m=>m.BudgetListComponent)
    },
    {
        path:'budget-view/:id',
        loadComponent:()=>import('./budget-view/budget-view.component').then(m=>m.BudgetViewComponent)
    }
];
