import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { messageInput } from './../../models/messageInput';
import { SEND_MESSAGE_MUTATION, GET_CONVERSATION_QUERY, SINGLE_CONVERSATION_QUERY, LOGIN_QUERY, LOGOUT_MUTATION, DELETE_CONVERSATION_MUTATION, USERS_QUERY, SUBSCRIPTION } from './../graphql';
import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup = new FormGroup({});
  token: any;
  conversations:any[]=[];
  messages:any[]=[];
  messageDeleted:string='';
  getconversationsError:string='';
  foundedConversation:boolean=false;
  recievedUser:string='';
  conversationId:string='';
  
  defaultConversationId: string='';
  CurrentConversationId: string='';
  constructor(private fb: FormBuilder, private Apollo: Apollo) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]],
    });

    this.token = localStorage.getItem('token');

    this.getAllConversations();
    
  // this.getUsers()
    
   
  }

  sendMessage(messageForm:any) {
    console.log(messageForm.message);
    // var targetUsername = 'asmaa';
    this.Apollo.mutate({
      mutation: SEND_MESSAGE_MUTATION,
      variables: {
        messageInput: {
          targetUsername: this.recievedUser='asmaa',
          message:messageForm.message,
          token: this.token,
        },
      },
    }).subscribe((res:any)=>{
      
   this.getAllConversations();
    }
      ),(error:any)=>{console.log(error)};
      this.messageForm
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
      this.getTheFirstConversation(this.conversations[0]._id)
      this.foundedConversation=true;
    },error=>{this.getconversationsError=error.message})
  }

   getTheFirstConversation(conversationId:string){
    this.Apollo.watchQuery({
      query : SINGLE_CONVERSATION_QUERY,
      variables:{
        token :this.token,
        _id:conversationId

      }
    }).valueChanges.subscribe((res:any)=>{
      this.recievedUser=res.data.conversation.userTwo
      console.log()
       this.messages=res.data?.conversation.messages;
      console.log(this.messages[0].date)
    });
 
  }
  getConversation(id:string){
    this.CurrentConversationId=id
    this.Apollo.watchQuery({
      query : SINGLE_CONVERSATION_QUERY,
      variables:{
        token :this.token,
        _id:id

      }
    }).valueChanges.subscribe((res:any)=>{
      this.recievedUser=res.data.conversation.userTwo
     
      this.messages=res.data?.conversation.messages;
      console.log(id);
      this.conversationId=id;
      this.subscribeMessage(this.conversationId)
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
   this.Apollo.mutate({
     mutation: DELETE_CONVERSATION_MUTATION,
     variables:{
       token:this.token, 
      conversationId:id
     }
   }).subscribe((res:any)=>{
     this.messageDeleted=res?.data.deleteConversation.message;
     this.getAllConversations();
     console.log(res)},error=>{console.log(error)});
  } 

  getUsers(){
    this.Apollo.watchQuery({
      query : USERS_QUERY,
      variables:{
        token:this.token
      }
    }).valueChanges.subscribe(res=>{console.log(res)});
  }

  subscribeMessage(id:string){
    this.Apollo.subscribe({
     query:SUBSCRIPTION,
     variables:{
      token:this.token,
       conversationId: id
     }
    }).subscribe(res=>{console.log(res)});
  }

}
