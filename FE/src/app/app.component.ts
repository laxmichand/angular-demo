import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import {DemotableService} from './demotable.service'

interface IUser {
  name: string;
  nickname: string;
  email: string;
  password: string;
  showPassword: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  reactiveForm!: FormGroup;
  user: IUser;
  
  constructor(private service:DemotableService) {
    this.user = {} as IUser;
  }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      name: new FormControl(this.user.name, [
        Validators.required
      ])      
    });
    this.getData();
  }
  employees$!:any;
  getData() {
    this.service.getPerson()
    .subscribe(data => {
      this.employees$= data;
      console.log('user data',data);
    });
  }

  public validate(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }
    this.user = this.reactiveForm.value;
    console.info('Name:', this.user.name);
    this.service.addPerson(this.user)
    .subscribe(data => {
      console.log('user added',data);
      this.getData();
    });    
  }
}
