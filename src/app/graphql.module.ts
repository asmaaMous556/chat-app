import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache, split} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {WebSocketLink} from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

var uri = '192.168.45.20:8880/graphql'; // <-- add the URL of the GraphQL server here
 

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const http = httpLink.create({
    uri:"http://192.168.45.20:8880/graphql"
  })


  const ws = new WebSocketLink({
    uri: 'ws://'+ uri,
    options: {
      reconnect: true,
    },
  });


const link = split(
  // split based on operation type
  ({query}) => {
    const data= getMainDefinition(query);
    return (
      data.kind === 'OperationDefinition' && data.operation === 'subscription'
    );
  },
  ws,
  http,
);
return {
  link:link,
  cache:new InMemoryCache(),
}
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
       
      deps: [HttpLink],
    },

  ],
})
export class GraphQLModule {}
