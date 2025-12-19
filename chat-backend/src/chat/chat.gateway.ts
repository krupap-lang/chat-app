import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private jwtService: JwtService,
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.data.user = { userId: payload.sub, name: payload.name };
    } catch (e) {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: any,
    @MessageBody() data: { roomId: string, content: string }
  ) {
    // 1. SAVE TO DATABASE
    const newMessage = new this.messageModel({
      roomId: data.roomId,
      content: data.content,
      senderId: client.data.user.userId,
      senderName: client.data.user.name,
    });
    const savedMsg = await newMessage.save();

    // 2. BROADCAST TO ROOM
    this.server.to(data.roomId).emit('receiveMessage', savedMsg);
  }
}
