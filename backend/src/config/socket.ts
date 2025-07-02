import { Server } from 'socket.io';
import { logger } from './logger';

export const setupSocketIO = (io: Server): void => {
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);

    // Join user to their personal room for notifications
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user-${userId}`);
      logger.info(`User ${userId} joined personal room`);
    });

    // Join blog post room for real-time comments
    socket.on('join-post-room', (postId: string) => {
      socket.join(`post-${postId}`);
      logger.info(`User joined post room: ${postId}`);
    });

    // Leave blog post room
    socket.on('leave-post-room', (postId: string) => {
      socket.leave(`post-${postId}`);
      logger.info(`User left post room: ${postId}`);
    });

    // Handle new comment event
    socket.on('new-comment', (data) => {
      // Broadcast to all users in the post room
      socket.to(`post-${data.postId}`).emit('comment-added', data);
    });

    // Handle comment like event
    socket.on('comment-liked', (data) => {
      socket.to(`post-${data.postId}`).emit('comment-like-updated', data);
    });

    // Handle post like event
    socket.on('post-liked', (data) => {
      socket.to(`post-${data.postId}`).emit('post-like-updated', data);
    });

    // Handle typing indicator for comments
    socket.on('typing-start', (data) => {
      socket.to(`post-${data.postId}`).emit('user-typing', {
        userId: data.userId,
        username: data.username,
      });
    });

    socket.on('typing-stop', (data) => {
      socket.to(`post-${data.postId}`).emit('user-stopped-typing', {
        userId: data.userId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  // Helper functions to emit events from other parts of the application
  io.emitToUser = (userId: string, event: string, data: any) => {
    io.to(`user-${userId}`).emit(event, data);
  };

  io.emitToPost = (postId: string, event: string, data: any) => {
    io.to(`post-${postId}`).emit(event, data);
  };

  logger.info('✅ Socket.IO configured successfully');
};

// Extend Socket.IO Server interface to include our custom methods
declare module 'socket.io' {
  interface Server {
    emitToUser(userId: string, event: string, data: any): void;
    emitToPost(postId: string, event: string, data: any): void;
  }
}