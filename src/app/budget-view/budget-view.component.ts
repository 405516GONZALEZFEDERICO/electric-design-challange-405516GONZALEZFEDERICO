import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Budget, Zone } from '../models/budget';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../service/api-service.service';
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-budget-view',
  standalone: true,
  imports: [],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.css',
})
export class BudgetViewComponent  implements OnInit,OnDestroy{
  cotizacion: Budget | null = null;
  zona?:Zone;
  private route = inject(ActivatedRoute);
  private api = inject(ApiServiceService);
  private subscriptions: Subscription[] = [];
  cantidadCajas:number=0;
  precioTotal:number=0;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      const subscription = this.api.getBudgetById(id)
        .subscribe((cotizacion) => {
          this.cotizacion = cotizacion;
          console.log(this.cotizacion);
          this.calcularTotalCajasTotalPrecio(this.cotizacion);
        });
      this.subscriptions.push(subscription);     
    });
  }

  calcularTotalCajasTotalPrecio(cotizacion:Budget):void{
    let totalSlots=0;
    this.cotizacion?.modulos.forEach(modulo => {
      this.precioTotal+=modulo.price;
      totalSlots+=modulo.slots;
    });
    let calculoTotalCajas = Math.ceil(totalSlots / 3);
    this.cantidadCajas=calculoTotalCajas;
    console.log( calculoTotalCajas);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
