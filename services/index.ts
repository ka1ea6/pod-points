import { Server, ServerOptions } from "socket.io";
import { createServer, Server as HttpServer } from "http";

// Use globalThis to persist across HMR
const GLOBAL_KEY = Symbol.for("WebSocket");

interface GlobalWithWebSocket {
  [GLOBAL_KEY]?: WebSocket;
}

class WebSocket {
  private io: Server | null = null;
  private httpServer: HttpServer | null = null;

  private constructor() {}

  public static getInstance(): WebSocket {
    const globalWithWebSocket = globalThis as GlobalWithWebSocket;
    if (!globalWithWebSocket[GLOBAL_KEY]) {
      console.log("New singleton instance created:", Date.now());
      globalWithWebSocket[GLOBAL_KEY] = new WebSocket();
    }
    return globalWithWebSocket[GLOBAL_KEY]!;
  }

  public async initialize(
    options: Partial<ServerOptions> = { cors: { origin: "*" } },
    port: number = 3001
  ): Promise<void> {
    if (!this.io) {
      this.httpServer = createServer();
      this.io = new Server(this.httpServer, options);
      this.io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        socket.on("disconnect", () =>
          console.log("Client disconnected:", socket.id)
        );
      });
      await new Promise((resolve) =>
        this.httpServer!.listen(port, () => {
          console.log(`WebSocket server running on port ${port}`);
          // resolve();
        })
      );
    }
  }

  public getIO(): Server | null {
    return this.io;
  }
}

export const websocket = WebSocket.getInstance();
export default WebSocket;
