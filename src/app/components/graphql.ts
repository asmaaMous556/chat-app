import { gql } from 'apollo-angular';
import {WebSocketLink} from '@apollo/client/link/ws';




export const CREATE_USER_MUTATION = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(inputs: { username: $username, password: $password }) {
      token
    }
  }
`;

export const LOGIN_QUERY = gql`
  query login($userInput: UserInput!) {
    login(userInput: $userInput) {
      token
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($messageInput:MessageInputData!) {
    sendMessage(messageInput: $messageInput) {
      message
    }
  }
`;

export const GET_CONVERSATION_QUERY = gql`
  query getConversations($token:String!) {
    getConversations(token: $token) {
      _id
      userOne
      userTwo
      date
    }
  }
`;

export const SINGLE_CONVERSATION_QUERY = gql`
  query conversation($token:String!,$_id:String!) {
    conversation(token: $token, _id: $_id) {
      date
      userOne
      userTwo
      messages {
        message
        date
      }
    }
  }
`;

export const USERS_QUERY = gql`
  query users($token:String!) {
    users(token: $token){
      users
    }
  }
`;

export const DELETE_CONVERSATION_MUTATION = gql
`
  mutation deleteConversation($token:String!,$conversationId:String!) {
    deleteConversation(token: $token, conversationId: $conversationId) {
      message
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation logout($token:String!) {
    logout(token: $token) {
      message
    }
  }
`;

export const SUBSCRIPTION= gql`
subscription message($token:String!,$conversationId:String!){
  message(token:$token, conversationId:$conversationId)
  {
    message
  }
}
`
