export class ConversationMessage {
  constructor(
    public readonly role: 'user' | 'assistant',
    public readonly content: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!['user', 'assistant'].includes(this.role)) {
      throw new Error('Invalid message role');
    }
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
  }

  equals(other: ConversationMessage): boolean {
    return this.role === other.role && this.content === other.content;
  }

  toString(): string {
    return `${this.role}: ${this.content}`;
  }
}
