export type ConversationStage =
  | 'initial'
  | 'clarifying'
  | 'creating'
  | 'modifying';

export class ConversationContext {
  constructor(
    public readonly stage: ConversationStage,
    public readonly destination?: string,
    public readonly dates?: string,
    public readonly budget?: string,
    public readonly interests?: string[],
    public readonly travelers?: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.stage) {
      throw new Error('Stage is required');
    }
    if (
      this.travelers !== undefined &&
      (this.travelers < 1 || !Number.isInteger(this.travelers))
    ) {
      throw new Error('Travelers must be a positive integer');
    }
    if (this.interests && !Array.isArray(this.interests)) {
      throw new Error('Interests must be an array');
    }
  }

  /**
   * Does not update the conversation state , just returns a new  conversationContext
   */
  update(
    updates: Partial<Omit<ConversationContext, 'stage'>> & {
      stage?: ConversationStage;
    },
  ): ConversationContext {
    console.log('updating conversationContext - ', updates);

    return new ConversationContext(
      updates.stage ?? this.stage,
      updates.destination ?? this.destination,
      updates.dates ?? this.dates,
      updates.budget ?? this.budget,
      updates.interests ?? this.interests,
      updates.travelers ?? this.travelers,
    );
  }

  hasEnoughInfo(): boolean {
    return !!this.destination && !!this.dates && !!this.travelers;
  }
}
