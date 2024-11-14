import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Budget, ModuleType, Zone } from '../models/budget';
import { ApiServiceService } from '../service/api-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit,OnDestroy{

  private subscriptions: Subscription[] = [];
  private api=inject(ApiServiceService);
  private router=inject(Router);
  zonas = Object.values(Zone);  //Cargar las zonas de un enum => en zonas

  moduloss?:ModuleType[]; 

  ngOnInit(): void {
    this.cargarModulos();
    console.log(this.moduloss);
  }

cotizacionForm: FormGroup = new FormGroup({
  nombreCliente: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]),
  fechaCotizacion:new FormControl('',[Validators.required,this.fechaNoMayorALaActual()]),

  modulos:new FormArray([],[Validators.required,this.cantidadMinimaModulos()])
});

get modulosArray(): FormArray {
  return this.cotizacionForm.get('modulos') as FormArray;
}

agregarModulo() {
  const moduleForm: FormGroup = new FormGroup({
    tipo: new FormControl('', [Validators.required]), 
    zona: new FormControl('', [Validators.required]), 
    price: new FormControl({ value: 0, disabled: true }),
    slots: new FormControl({ value: '', disabled: true })
  });

  moduleForm.get('tipo')?.valueChanges.subscribe(id => {
    const tipo = this.moduloss?.find(t => t.id === id);
    if (tipo) {
      moduleForm.patchValue({
        slots: tipo.slots,
        price: tipo.price
      });
    }
  });
  this.modulosArray.push(moduleForm);
}

quitarModulo(id: number) {
  this.modulosArray.removeAt(id);
}


//validacion sincronica
fechaNoMayorALaActual() : ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>  {
  const fechaActual=new Date();
  const fechaIngresada=new Date(control.value);
  if(fechaIngresada>fechaActual){
    return {fechaInvalida:true} //aca fecha invalida  la uso en el html para el invalFedback
  } return null;
  }
}
//validacion sincronica
private cantidadMinimaModulos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const array = control as FormArray;
    return array.length >= 1 ? null : { minimumModules: true };
  };
}

private cargarModulos(): void {
  const subscription=this.api.getModuleTypes().subscribe({
    next: (data) => {
      this.moduloss = data;
      console.log('Modulos cargados: ', this.moduloss);  
    },
    error: () => {
      console.error('Error al cargar los módulos');
    }
  });
  this.subscriptions.push(subscription);
}


onSubmit(): void {
  if(this.cotizacionForm.valid) {
    const formValue = this.cotizacionForm.getRawValue(); 

    const modulos = formValue.modulos.map((modulo: any) => {
    const moduloTipoId = this.moduloss?.find(m => m.id === modulo.tipo);
      
      return {
        tipo: moduloTipoId?.name,
        zona: modulo.zona,
        price: modulo.price,
        slots: modulo.slots
      };
    });

    const cotizacion: Budget = {
      id: this.generadorDeId(),
      client: formValue.nombreCliente,
      date: formValue.fechaCotizacion,
      modulos: modulos,
    };
  const subscripcion=  this.api.postBudget(cotizacion).subscribe({
      next: () => {
        this.router.navigate(['/budget-list']);
      },
      error: () => {
        alert('Error al crear la cotizacion');
      }
    });
    this.subscriptions.push(subscripcion);
  } else this.cotizacionForm.markAllAsTouched();
}


// Math.random() genera un número decimal aleatorio entre 0 y 1.
// .toString(36) convierte el número a una representación en base 36, que incluye dígitos (0-9) y letras (a-z).
// .substring(2) elimina los dos primeros caracteres (0.) de la cadena generada por Math.random().
// Date.now().toString(36) agrega una representación del tiempo actual en base 36 para asegurar que el ID sea único y más largo.
generadorDeId():string{
  return Math.random().toString(36).substring(12) + Date.now().toString(36);
}


volver() {
  this.router.navigate(['/budget-list']);
}

ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}
}

