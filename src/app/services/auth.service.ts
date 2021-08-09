import { userInput } from './../models/userInput';
import { Injectable } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { LOGIN_QUERY, LOGOUT_MUTATION } from '../components/graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private Apollo:Apollo) { }

  
login(userInput:userInput){
return  this.Apollo.query({
    query : LOGIN_QUERY,
    variables:{
      userInput :{
        username: userInput.name,
        password :userInput.password
      }
    }
  })

}
  



  logOut(token:string){
  return   this.Apollo.mutate({
      mutation: LOGOUT_MUTATION,
      variables: {
        token: token,
      },
    })
  }

}
