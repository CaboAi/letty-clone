import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    sendMessage(body: {
        message: string;
    }, req: any): Promise<any>;
}
