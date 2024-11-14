import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { Budget } from '../models/budget';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit,OnDestroy {

  ngOnInit(): void {
    this.cargarCotizaciones();
  }
  cotizaciones:Budget[]=[];
  private api=inject(ApiServiceService);
  private router=inject(Router);
  private subscriptions: Subscription[] = [];
  cotizacion?:Budget;
  actualizarCantidadModulos(id: string | undefined):number{
    if(!id){
      return 0;
    }
    let cantidadModulos=0;
    this.cotizaciones.forEach(cotizacion => {
      if(cotizacion.id===id){
        cotizacion.modulos.forEach(modulo => {
          cantidadModulos++;
        });
      }
    });
    return cantidadModulos;
  }
  cargarCotizaciones():void{
    const subscripcion=this.api.getBudgets().subscribe({
      next:(value)=> {
          this.cotizaciones=value
          console.log('cotizaciones',this.cotizaciones);
      },
      error:()=>{
        console.log("Error al cargar las cotizaciones");
      }
    })
    this.subscriptions.push(subscripcion);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  verMas(id: string|undefined) {
    this.router.navigate(['/budget-view', id]);
  }
  
}
