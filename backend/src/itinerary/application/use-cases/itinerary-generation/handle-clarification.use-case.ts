import { Injectable } from '@nestjs/common';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';

@Injectable()
export class HandleClarificationUseCase {
  execute(context: ConversationContext): string {
    console.log(context);

    const missing: string[] = [];
    if (!context.dates) missing.push('travel dates');
    if (!context.travelers) missing.push('number of travelers');
    if (!context.interests?.length) missing.push('interests/activities');

    if (missing.length === 0) {
      return `Great! You want to visit ${context.destination}. I have all the information I need to create your itinerary.`;
    }

    return `Great! You want to visit ${context.destination}. To create the perfect itinerary, I need to know: ${missing.join(', ')}. What can you tell me about these?`;
  }
}
