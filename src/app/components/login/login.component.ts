import { LOGIN_QUERY } from './../graphql';
import { userInput } from './../../models/userInput';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgControlStatus, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any ;
  error:any;
  token:string='';
  constructor(private fb :FormBuilder, private apollo:Apollo ,private router: Router) { }

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      name:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }

  login(userInput:userInput){
    console.log(userInput.name);
   
    this.apollo.query({
      query : LOGIN_QUERY,
      variables:{
        userInput :{
          username: userInput.name,
          password :userInput.password
        }
      }
    }).subscribe((res:any)=>{
      if(res){
        this.token=res.data.login.token;
        localStorage.setItem('token',this.token);
        this.router.navigate(['/chat']);
        
      }
     
    }
    ,error=>{this.error=error});
   
  }

}
