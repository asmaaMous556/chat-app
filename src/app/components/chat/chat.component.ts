import { Apollo } from 'apollo-angular';
import { ChatService } from './../../services/chat.service';
import { AuthService } from './../../services/auth.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { messageInput } from './../../models/messageInput';
import {
  SEND_MESSAGE_MUTATION,
  GET_CONVERSATION_QUERY,
  SINGLE_CONVERSATION_QUERY,
  LOGIN_QUERY,
  LOGOUT_MUTATION,
  DELETE_CONVERSATION_MUTATION,
  USERS_QUERY,
  SUBSCRIBTION,
} from './../graphql';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from '@apollo/client/utilities';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup = new FormGroup({});
  token: any;
  conversations: any[] = [];
  messages: any[] = [];
  messageDeleted: string = '';
  getconversationsError: string = '';
  foundedConversation: boolean = false;
  userName:string='';
  x!: Observable<any>

  recievedUser: string = '';
  conversationId: string = '';
  users: any[] = [];

  defaultConversationId: string = '';
  CurrentConversationId: string = '';
  message:string='';
  senderUser: string='';
  author: string='';
  constructor(private fb: FormBuilder,
     private Apollo: Apollo, private AuthService:AuthService,private chatService:ChatService) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]],
    });

    this.token = localStorage.getItem('token');

    this.getAllConversations();
  //  this.getUsers();
  }

  sendMessage(messageForm: any) {
    // console.log(messageForm.message);
    // console.log(this.recievedUser);
   this.chatService.sendMessage(this.recievedUser,messageForm.message,this.token).subscribe((res: any) => {
      console.log(res)
    // this.getAllConversations();
      //this.getConversation(this.conversationId);
    }),
      (error: any) => {
        console.log(error);
      };
    this.messageForm.reset();
  }

  getAllConversations() {
   this.chatService.getAllConversations(this.token).valueChanges.subscribe(
      (res: any) => {
        console.log(res.data.getConversations);
        this.conversations = res.data.getConversations;
     //   this.getTheFirstConversation(this.conversations[0]._id);
        this.foundedConversation = true;
      },
      (error) => {
        this.getconversationsError = error.message;
      }
    );
  }

  getTheFirstConversation(conversationId: string) {
    this.Apollo.watchQuery({
      query: SINGLE_CONVERSATION_QUERY,
      variables: {
        token: this.token,
        _id: conversationId,
      },
    }).valueChanges.subscribe((res: any) => {
      this.recievedUser = res.data.conversation.userTwo;
      console.log();
      this.messages = res.data?.conversation.messages;
      // console.log(this.messages[0].date);
    });
  }

  getConversation(id: string) {
    // this.CurrentConversationId = id;
    this.chatService.getSingleConversation(this.token, id).valueChanges.subscribe((res: any) => {
      this.recievedUser = res.data.conversation.userTwo;
      this.senderUser=res.data.conversation.userOne;
      this.conversationId = id;
      this.messages = res.data.conversation.messages;
    // this.messages.forEach(item=> {
    //    console.log(item.message)
    //  });
      // console.log(...this.messages);
      // console.log(this.conversationId);
     
      console.log(this.messages)
      if(this.x){
        (this.x as any).unsubscribe()
      }
      
      this.x =this.subscribeMessage(this.conversationId).subscribe((res:any)=>{
        this.message = res.data.message.message;
        this.author=res.data.message.message.author;
        this.messages=[...this.messages , res.data.message]      
      }) as any;

     
    
    });
  }

  logout() {
  this.AuthService.logOut(this.token).subscribe(
      (data: any) => {
        if (data) {
          console.log(data);
          localStorage.clear();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteConversation(id: string) {
    this.chatService.deleteConversation(id,this.token).subscribe(
      (res: any) => {
        this.messageDeleted = res?.data.deleteConversation.message;
        this.conversations = this.conversations.filter((conversation)=>{
          return conversation._id !== id
        })
        console.log(this.conversations);
        
        // console.log(res);
      },
      (error) => {
        // console.log(error);
      }
    );
   
  }

  getUsers() {
    this.Apollo.watchQuery({
      query: USERS_QUERY,
      variables: {
        token: this.token,
      },
    }).valueChanges.subscribe((res: any) => {
      this.users = res?.data.users;
      // console.log(this.users[0]);
      this.users.forEach((user) => {
        // console.log(user);
      });
    });
  }

  subscribeMessage(id: string) {
    console.log(id);

   return  this.chatService.messageSubscribtion(this.token,id);
   
  }

  setUser(user: string) {
    //console.log(user);
    this.recievedUser = user;
  }
}
