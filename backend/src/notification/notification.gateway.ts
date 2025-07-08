/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['https://yourfrontend.com'],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server

  handleConnection() {
    console.log("Connection established");
  }

  @SubscribeMessage("JoinRoom")
  async joinRoom(@MessageBody() studentId: number, @ConnectedSocket() socket: Socket) {
    await socket.join(studentId.toString());
    console.log({ room: socket.rooms });

    socket.emit("RoomJoined", studentId)
  }

  sendEnrollMentNotification(studentId: number, message: string) {
    const roomId = studentId.toString();
    this.server.to(roomId).emit("enroll-student", { message })
  }
}
