// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthController } from './auth/auth.controller';
// import { ChatController } from './chat/chat.controller';
// import { GroupController } from './chat/group.controller';
// import { AuthService } from './auth/auth.service';
// import { ChatGateway } from './chat/chat.gateway';
// import { User, UserSchema } from './schemas/user.schema';
// import { Message, MessageSchema } from './schemas/message.schema';
// import { Group, GroupSchema } from './schemas/group.schema';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app'),
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//       { name: Message.name, schema: MessageSchema },
//       { name: Group.name, schema: GroupSchema },
//     ]),
//     JwtModule.register({
//       global: true,
//       secret: process.env.JWT_SECRET || 'secretKey',
//       signOptions: { expiresIn: '1d' },
//     }),
//   ],
//   controllers: [AuthController, ChatController, GroupController],
//   providers: [AuthService, ChatGateway],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { ChatController } from './chat/chat.controller';
import { GroupController } from './chat/group.controller';
import { AuthService } from './auth/auth.service';
import { ChatGateway } from './chat/chat.gateway';
import { User, UserSchema } from './schemas/user.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Group, GroupSchema } from './schemas/group.schema';

// NEW: GraphQL Imports
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { pubSub } from './pubsub/pubsub.provider';
import { PresenceResolver } from './chat/presence.resolver';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    // PubSubModule, // <--- ADD THIS LINE HERE
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [AuthController, ChatController, GroupController],
  providers: [
    AuthService, 
    ChatGateway, 
    PresenceResolver, 
  ],
})
export class AppModule {}
