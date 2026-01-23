import { io, Socket } from 'socket.io-client';

const URL = 'http://localhost:5000';

class SocketService {
    public socket: Socket | null = null;

    connect() {
        if (!this.socket) {
            this.socket = io(URL);

            this.socket.on('connect', () => {
                console.log('SOCKET: Connected to server', this.socket?.id);
            });

            this.socket.on('disconnect', () => {
                console.log('SOCKET: Disconnected');
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        if (!this.socket) {
            return this.connect();
        }
        return this.socket;
    }
}

export const socketService = new SocketService();
