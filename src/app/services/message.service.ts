import { messageInput } from './../models/messageInput';
import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private apollo :Apollo) { }

  sendMessage(messageInput:messageInput){
    return this.apollo.mutate({
      mutation :gql 
      `
      sendMessage (messageInput:{
        targetUsername
        message
        token
      }){
        message
      }

      `
    })

  }

  getAllConversation (token:string){
    return this.apollo.watchQuery({
      query : gql
      `
      getConversations(token)
        {
        _id
        userOne
        userTwo
        date
      }
      `

    })
  }

  getConversations(token:string,id:string){
    return this.apollo.watchQuery({
      query: gql 
      `
      conversation(token,_id){
    date,
    userOne,
    userTwo,
    messages{
      message
    }
    

      `
    })
  }

  deleteConversation(token:string,conversationId:string){
    return this.apollo.mutate({
      mutation : gql
      `
      deleteConversation (token,conversationId){
        message
      }

      `
    })

  }


}
