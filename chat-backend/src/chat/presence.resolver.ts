// import { Resolver, Subscription, Mutation, Args, ObjectType, Field, ID } from '@nestjs/graphql';
// import { Inject } from '@nestjs/common';
// import { PubSubEngine } from 'graphql-subscriptions';

// @ObjectType()
// class TypingStatus {
//   @Field() 
//   username: string;

//   @Field() 
//   roomId: string;

//   @Field() 
//   isTyping: boolean;
// }

// @ObjectType()
// class UserPresence {
//   @Field(() => ID) 
//   userId: string;

//   @Field() 
//   status: string; 
// }

// @Resolver()
// export class PresenceResolver {
//   constructor(@Inject('PUB_SUB') private readonly pubSub: PubSubEngine) {}

//   @Mutation(() => Boolean)
//   async setTypingStatus(
//     @Args('roomId') roomId: string,
//     @Args('username') username: string,
//     @Args('isTyping') isTyping: boolean,
//   ) {
//     await this.pubSub.publish('userTyping', { 
//       userTyping: { username, roomId, isTyping } 
//     });
//     return true;
//   }

//   @Subscription(() => TypingStatus, {
//     filter: (payload, variables) => payload.userTyping.roomId === variables.roomId,
//   })
//   userTyping(@Args('roomId') roomId: string) {
//     // Using bracket notation ['asyncIterator'] completely bypasses 
//     // the TS dot-notation property check.
//     return this.pubSub['asyncIterator']('userTyping');
//   }

//   @Subscription(() => UserPresence)
//   presenceChanged() {
//     // Using bracket notation here as well
//     return this.pubSub['asyncIterator']('presenceChanged');
//   }
// }

import {
  Resolver,
  Subscription,
  Mutation,
  Args,
  ObjectType,
  Field,
  ID,
  Query,
} from '@nestjs/graphql';
import { pubSub } from '../pubsub/pubsub.provider';

@ObjectType()
class TypingStatus {
  @Field()
  username: string;

  @Field()
  roomId: string;

  @Field()
  isTyping: boolean;
}

@ObjectType()
class UserPresence {
  @Field(() => ID)
  userId: string;

  @Field()
  status: string;
}

@Resolver()
export class PresenceResolver {

  // Required root query (GraphQL spec)
  @Query(() => String)
  healthCheck() {
    return 'GraphQL is online';
  }

  // ---------------- MUTATION ----------------

  @Mutation(() => Boolean)
  async setTypingStatus(
    @Args('roomId') roomId: string,
    @Args('username') username: string,
    @Args('isTyping') isTyping: boolean,
  ): Promise<boolean> {
    await pubSub.publish('USER_TYPING', {
      userTyping: { username, roomId, isTyping },
    });
    return true;
  }

  // ---------------- SUBSCRIPTIONS ----------------

  @Subscription(() => TypingStatus, {
    filter: (payload, variables) =>
      payload.userTyping.roomId === variables.roomId,
  })
  userTyping(@Args('roomId') roomId: string) {
    return pubSub.asyncIterator('USER_TYPING');
  }

  @Subscription(() => UserPresence)
  presenceChanged() {
    return pubSub.asyncIterator('PRESENCE_CHANGED');
  }
}
