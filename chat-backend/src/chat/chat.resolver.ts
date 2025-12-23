// import { Resolver, Subscription, Mutation, Args } from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions';

// const pubSub = new PubSub();

// @Resolver() 
// export class ChatResolver {
//     @Mutation(() => Boolean)
//     async setTypingStatus(
//         @Args('chatId') chatId: string,
//         @Args('username') username: string,
//         @Args('isTyping') isTyping: boolean,
//     ) {
//         await pubSub.publish('typingStatusChanged', {
//             typingStatusChanges: {chatId, username, isTyping},
//         });
//         return true;
//     }

//     @Subscription(() => TypingIndicatorResponse, {
//         filter: (payload, variables) => payload.typingStatusChanged.chatId === variables.chatId,
//     })
//     typingStatusChanged(@Args('chatId') chatId: String) {
//         return pubSub.asyncIterableIterator('typingStatusChanged');
//     }
// }