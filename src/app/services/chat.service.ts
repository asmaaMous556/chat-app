import { messageInput } from './../models/messageInput';
import { Injectable } from '@angular/core';
import { DELETE_CONVERSATION_MUTATION, GET_CONVERSATION_QUERY, SEND_MESSAGE_MUTATION, SINGLE_CONVERSATION_QUERY, SUBSCRIBTION } from '../components/graphql';
import { Apollo } from 'apollo-angular';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private Apollo:Apollo) { }

  getAllConversations(token:string){
    return  this.Apollo.watchQuery({
      query: GET_CONVERSATION_QUERY,
      variables: {
        token: token,
      },
    });
  }

  sendMessage(recievedUser:string,message:string,token:string){
    return this.Apollo.mutate({
      mutation: SEND_MESSAGE_MUTATION,
      variables: {
        messageInput: {
          targetUsername: recievedUser,
          message: message,
          token: token,
        },
      },
    })
  }
  getSingleConversation(token:string,id:string){
    return this.Apollo.watchQuery({
      query: SINGLE_CONVERSATION_QUERY,
      variables: {
        token: token,
        _id: id,
      },
    })
  }
  

  deleteConversation(id:string,token:string){

    return this.Apollo.mutate({
      mutation: DELETE_CONVERSATION_MUTATION,
      variables: {
        token: token,
        conversationId: id,
      },
    })

  }

  messageSubscribtion(token:string,id:string){
    return  this.Apollo.subscribe({
      query: SUBSCRIBTION,
      variables: {
        token: token,
        conversationId: id,
      },
    })
    
  }
}

