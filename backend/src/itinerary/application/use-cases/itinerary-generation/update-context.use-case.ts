import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';
import { TravelPlanningSession } from 'src/itinerary/domain/aggregates/travel-planning-session.aggregate';

@Injectable()
export class UpdateContextUseCase {
  private readonly logger = new Logger(UpdateContextUseCase.name);

  private llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    temperature: 0.7,
  });

  async execute(
    message: string,
    session: TravelPlanningSession,
  ): Promise<ConversationContext> {
    this.logger.log('Updating itinerary context based on new user message...');
    const extractPrompt = PromptTemplate.fromTemplate(`
      Extract travel information from the user's message based on the current conversation context.
      
      Current context: {context}
      User message: "{message}"

      You must respond with ONLY a valid JSON object with these exact fields:
      {{
        "destination": "string or null",
        "dates": "string or null", 
        "budget": "string or null",
        "interests": ["array of strings or empty array"],
        "travelers": "number or null",
        "isModification": "boolean - true if user wants to change existing itinerary",
        "hasEnoughInfo": "boolean - true if destination, dates, and travelers are all provided"
      }}

      Do not include any markdown formatting, code blocks, or explanations. Return only the JSON object.
    `);

    try {
      const chain = extractPrompt.pipe(this.llm);
      const result = await chain.invoke({
        message,
        context: JSON.stringify(session.getContext()),
      });

      const rawContent =
        typeof result.content === 'string'
          ? result.content
          : JSON.stringify(result.content);
      let cleanJson = rawContent.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const extracted: unknown = JSON.parse(cleanJson);

      const stringU = z
        .string()
        .nullable()
        .transform((v) => v ?? undefined);
      const numberU = z
        .number()
        .nullable()
        .transform((v) => v ?? undefined);

      const schema = z.object({
        destination: stringU,
        dates: stringU,
        budget: stringU,
        interests: z.array(z.string()),
        travelers: numberU,
        isModification: z.boolean(),
        hasEnoughInfo: z.boolean(),
      });

      const validatedExtracted = schema.parse(extracted);

      const mergedDestination =
        validatedExtracted.destination ?? session.getContext().destination;

      const stage = (() => {
        switch (true) {
          case validatedExtracted.isModification &&
            !!session.getCurrentItinerary():
            return 'modifying';
          case validatedExtracted.hasEnoughInfo:
            return 'creating';
          case !!mergedDestination:
            return 'clarifying';
          default:
            return 'initial';
        }
      })();

      session.updateContext({
        destination: validatedExtracted.destination,
        dates: validatedExtracted.dates,
        budget: validatedExtracted.budget,
        interests: validatedExtracted.interests?.length
          ? validatedExtracted.interests
          : undefined,
        travelers: validatedExtracted.travelers,
        stage,
      });
      return session.getContext();
    } catch (error) {
      this.logger.error('Error parsing context update:', error);
      return session.getContext().update({
        stage: session.getContext().destination ? 'clarifying' : 'initial',
      });
    }
  }
}
