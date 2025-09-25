import {
  ConversationContext,
  ConversationMessage,
} from '../value-objects/conversation';

export class Conversation {
  constructor(
    public readonly id: string,
    public messages: ConversationMessage[] = [],
    private context: ConversationContext = new ConversationContext('initial'),
  ) {}

  getContext() {
    return this.context;
  }

  addMessage(role: 'user' | 'assistant', content: string): void {
    this.messages.push(new ConversationMessage(role, content));
  }

  getMessages() {
    return this.messages;
  }

  updateContext(updates: Partial<ConversationContext>): void {
    this.context = this.context.update(updates);
  }

  getLastUserMessage(): ConversationMessage | undefined {
    return this.messages
      .slice()
      .reverse()
      .find((msg) => msg.role === 'user');
  }
}
