import { Injectable } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private Apollo:Apollo) { }

  

  

// export const SIGNIN_USER_MUTATION = gql`
//   mutation SigninUserMutation($email: String!, $password: String!) {
//     signinUser(email: {
//       email: $email,
//       password: $password
//     }) {
//       token
//       user {
//         id
//       }
//     }
//   }
// `;



  logOut(){
    return this.Apollo.mutate({
      mutation :gql
       `


      `
    })
  }

}
