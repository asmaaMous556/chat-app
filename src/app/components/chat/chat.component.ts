import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { messageInput } from './../../models/messageInput';
import { SEND_MESSAGE_MUTATION, GET_CONVERSATION_QUERY, SINGLE_CONVERSATION_QUERY, LOGIN_QUERY, LOGOUT_MUTATION } from './../graphql';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm: any;
  token: any;
  conversations:any[]=[];
  messages:any[]=[];
  constructor(private fb: FormBuilder, private Apollo: Apollo) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]],
    });

    this.token = localStorage.getItem('token');

    this.getAllConversations();
    
   
  }

  sendMessage(messageForm:any) {
    console.log(messageForm.message);
    var targetUsername = 'asmaa';
    this.Apollo.mutate({
      mutation: SEND_MESSAGE_MUTATION,
      variables: {
        messageInput: {
          targetUsername: targetUsername,
          message:messageForm.message,
          token: this.token,
        },
      },
    }).subscribe((res:any)=>{
      // console.log(res.data?.sendMessage.message)
    }
      ),(error:any)=>{console.log(error)};
  }

  getAllConversations(){
    this.Apollo.watchQuery({
      query: GET_CONVERSATION_QUERY,
      variables:{
        token : this.token
      }
    }).valueChanges.subscribe((res:any)=>{
      console.log(res.data.getConversations);
      this.conversations= res.data.getConversations
    })
  }
  getConversation(id:string){
    console.log(id)
    this.Apollo.watchQuery({
      query : SINGLE_CONVERSATION_QUERY,
      variables:{
        token :this.token,
        _id:id

      }
    }).valueChanges.subscribe((res:any)=>{
      this.messages=res.data?.conversation.messages;
      console.log(this.messages[0].date)
    });

  }

  logout(){
    this.Apollo.mutate({
      mutation: LOGOUT_MUTATION,
      variables:
      {
        token :this.token
      }
    }).subscribe((data:any)=>{
      if(data){
        console.log(data)
        localStorage.clear();
      }  
    },(error:any)=>{console.log(error)})
  }

  deleteConversation(id:string){
   console.log(id);
  }

}
