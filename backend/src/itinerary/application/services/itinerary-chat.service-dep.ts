// import { Injectable } from '@nestjs/common';
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
// import { Client } from '@googlemaps/google-maps-services-js';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { z } from 'zod';

// interface Conversation {
//   id: string;
//   messages: Array<{ role: 'user' | 'assistant'; content: string }>;
//   context: {
//     destination?: string;
//     dates?: string;
//     budget?: string;
//     interests?: string[];
//     travelers?: number;
//     currentItinerary?: any;
//     stage: 'initial' | 'clarifying' | 'creating' | 'modifying';
//   };
// }

// @Injectable()
// export class ItineraryChatService {
//   private llm = new ChatGoogleGenerativeAI({
//     model: 'gemini-2.0-flash',
//     temperature: 0.7,
//   });
//   private googleMaps = new Client({});
//   private conversations = new Map<string, Conversation>();

//   async chatItinerary(message: string, conversationId: string) {
//     const conversation = this.conversations.get(conversationId) || {
//       id: conversationId,
//       messages: [],
//       context: { stage: 'initial' },
//     };

//     conversation.messages.push({ role: 'user', content: message });
//     console.log(conversation);

//     // Extract info and determine stage
//     const updatedContext = await this.updateContext(
//       message,
//       conversation.context,
//     );
//     conversation.context = updatedContext;

//     let response: string;

//     switch (updatedContext.stage) {
//       case 'initial':
//         response = await this.handleInitialPrompt(message, updatedContext);
//         break;
//       case 'clarifying':
//         response = await this.handleClarification(message, updatedContext);
//         break;
//       case 'creating':
//         response = await this.createItinerary(updatedContext);
//         break;
//       case 'modifying':
//         response = await this.modifyItinerary(message, updatedContext);
//         break;
//     }

//     conversation.messages.push({ role: 'assistant', content: response });
//     this.conversations.set(conversationId, conversation);

//     return { response, context: updatedContext };
//   }

//   private async updateContext(message: string, currentContext: any) {
//     const extractPrompt = PromptTemplate.fromTemplate(`
//       Extract travel information from the user's message based on the current conversation context.

//       Current context: {context}
//       User message: "{message}"

//       You must respond with ONLY a valid JSON object with these exact fields:
//       {{
//         "destination": "string or null",
//         "dates": "string or null",
//         "budget": "string or null",
//         "interests": ["array of strings or empty array"],
//         "travelers": "number or null",
//         "isModification": "boolean - true if user wants to change existing itinerary",
//         "hasEnoughInfo": "boolean - true if destination, dates, and travelers are all provided"
//       }}

//       Do not include any markdown formatting, code blocks, or explanations. Return only the JSON object.
//     `);

//     try {
//       const chain = extractPrompt.pipe(this.llm);

//       const result = await chain.invoke({
//         message,
//         context: JSON.stringify(currentContext),
//       });

//       // Clean the response to handle potential markdown formatting
//       let cleanJson = result.content.toString().trim();

//       // Remove markdown code blocks if present
//       if (cleanJson.startsWith('```json')) {
//         cleanJson = cleanJson.replace(/```json\n?/, '').replace(/\n?```$/, '');
//       } else if (cleanJson.startsWith('```')) {
//         cleanJson = cleanJson.replace(/```\n?/, '').replace(/\n?```$/, '');
//       }

//       const extracted = JSON.parse(cleanJson);

//       // Validate the structure
//       const schema = z.object({
//         destination: z.string().nullable(),
//         dates: z.string().nullable(),
//         budget: z.string().nullable(),
//         interests: z.array(z.string()),
//         travelers: z.number().nullable(),
//         isModification: z.boolean(),
//         hasEnoughInfo: z.boolean(),
//       });

//       const validatedExtracted = schema.parse(extracted);

//       const newContext = {
//         ...currentContext,
//         destination:
//           validatedExtracted.destination || currentContext.destination,
//         dates: validatedExtracted.dates || currentContext.dates,
//         budget: validatedExtracted.budget || currentContext.budget,
//         interests: validatedExtracted.interests?.length
//           ? validatedExtracted.interests
//           : currentContext.interests,
//         travelers: validatedExtracted.travelers || currentContext.travelers,
//       };

//       // Determine stage
//       if (
//         validatedExtracted.isModification &&
//         currentContext.currentItinerary
//       ) {
//         newContext.stage = 'modifying';
//       } else if (validatedExtracted.hasEnoughInfo) {
//         newContext.stage = 'creating';
//       } else if (newContext.destination) {
//         newContext.stage = 'clarifying';
//       } else {
//         newContext.stage = 'initial';
//       }

//       return newContext;
//     } catch (error) {
//       console.error('Error parsing context update:', error);
//       // Fallback: return current context with minimal changes
//       return {
//         ...currentContext,
//         stage: currentContext.destination ? 'clarifying' : 'initial',
//       };
//     }
//   }

//   private async handleInitialPrompt(message: string, context: any) {
//     if (!context.destination) {
//       return "I'd love to help you plan your trip! Where would you like to travel?";
//     }
//     return this.handleClarification(message, context);
//   }

//   private async handleClarification(message: string, context: any) {
//     const missing = [];
//     if (!context.dates) missing.push('travel dates');
//     if (!context.travelers) missing.push('number of travelers');
//     if (!context.interests?.length) missing.push('interests/activities');

//     if (missing.length === 0) {
//       context.stage = 'creating';
//       return this.createItinerary(context);
//     }

//     return `Great! You want to visit ${context.destination}. To create the perfect itinerary, I need to know: ${missing.join(', ')}. What can you tell me about these?`;
//   }

//   private async createItinerary(context: any) {
//     // Get database data
//     const dbData = await this.getRelevantData(context);

//     // Get Google Places data
//     const placesData = await this.getGooglePlaces(context);
//     console.log('google places data---', placesData);

//     const itineraryPrompt = PromptTemplate.fromTemplate(`
//       Create a detailed itinerary for:
//       - Destination: {destination}
//       - Dates: {dates}
//       - Travelers: {travelers}
//       - Budget: {budget}
//       - Interests: {interests}

//       Available hotels from database: {hotels}
//       Available attractions from database: {attractions}
//       Google Places data: {places}

//       Create a day-by-day itinerary with specific times, locations, and practical details.
//       Include accommodation recommendations and mix database and Google Places data.

//       Return ONLY a valid JSON object with this exact structure (no markdown formatting):
//       {{
//         "title": "Trip title",
//         "summary": "Brief overview",
//         "days": [
//           {{
//             "day": 1,
//             "date": "YYYY-MM-DD",
//             "destination" city name(single word eg:Kandy , Nuwara Eliya , whatever the user inputs as destination)"
//             "activities": [
//               {{
//                 "time": "09:00",
//                 "name": "Activity name",
//                 "description": "Details",
//                 "address": "Address",
//                 "type": "restaurant",
//              "coordinates": "[139.6993(longitude), 35.6762(latitude)]"
//               }}
//             ]
//           }}
//         ],
//         "accommodation": "Hotel recommendation",
//         "tips": ["Helpful tip 1", "Helpful tip 2"]
//       }}
//     `);

//     try {
//       const chain = itineraryPrompt.pipe(this.llm);

//       const result = await chain.invoke({
//         destination: context.destination,
//         dates: context.dates,
//         travelers: context.travelers,
//         budget: context.budget || 'Not specified',
//         interests: context.interests?.join(', ') || 'General sightseeing',
//         hotels: JSON.stringify(dbData.hotels),
//         attractions: JSON.stringify(dbData.attractions),
//         places: JSON.stringify(placesData),
//       });

//       // Clean and parse the JSON response
//       let cleanJson = result.content.toString().trim();
//       if (cleanJson.startsWith('```json')) {
//         cleanJson = cleanJson.replace(/```json\n?/, '').replace(/\n?```$/, '');
//       } else if (cleanJson.startsWith('```')) {
//         cleanJson = cleanJson.replace(/```\n?/, '').replace(/\n?```$/, '');
//       }

//       const itinerary = JSON.parse(cleanJson);
//       context.currentItinerary = itinerary;
//       context.stage = 'modifying';

//       return `Here's your personalized itinerary for ${context.destination}!\n\n${this.formatItinerary(itinerary)}\n\nWould you like me to modify anything? I can adjust activities, timing, add restaurants, or change accommodations.`;
//     } catch (error) {
//       console.error('Error creating itinerary:', error);
//       return "I'm having trouble generating your itinerary right now. Could you try again or provide more specific details about your trip?";
//     }
//   }

//   private async modifyItinerary(message: string, context: any) {
//     const modifyPrompt = PromptTemplate.fromTemplate(`
//       User wants to modify their itinerary: "{modification}"
//       Current itinerary: {currentItinerary}

//       Apply the requested changes and return ONLY the updated itinerary as a valid JSON object (no markdown formatting).
//       If they want to add restaurants, attractions, etc., use this additional data:
//       Database data: {dbData}
//       Google Places data: {placesData}

//       Return the same JSON structure as the original itinerary.
//     `);

//     try {
//       // Get fresh data for modifications
//       const dbData = await this.getRelevantData(context);
//       const placesData = await this.getGooglePlaces(context, message);

//       const chain = modifyPrompt.pipe(this.llm);

//       const result = await chain.invoke({
//         modification: message,
//         currentItinerary: JSON.stringify(context.currentItinerary),
//         dbData: JSON.stringify(dbData),
//         placesData: JSON.stringify(placesData),
//       });

//       // Clean and parse the JSON response
//       let cleanJson = result.content.toString().trim();
//       if (cleanJson.startsWith('```json')) {
//         cleanJson = cleanJson.replace(/```json\n?/, '').replace(/\n?```$/, '');
//       } else if (cleanJson.startsWith('```')) {
//         cleanJson = cleanJson.replace(/```\n?/, '').replace(/\n?```$/, '');
//       }

//       const updatedItinerary = JSON.parse(cleanJson);
//       context.currentItinerary = updatedItinerary;

//       return `I've updated your itinerary based on your request!\n\n${this.formatItinerary(updatedItinerary)}\n\nAny other changes you'd like to make?`;
//     } catch (error) {
//       console.error('Error modifying itinerary:', error);
//       return "I'm having trouble updating your itinerary. Could you try rephrasing your request?";
//     }
//   }

//   private async getRelevantData(context: any) {
//     // Replace with actual database queries
//     const hotels = await this.queryHotels(context.destination, context.budget);
//     const attractions = await this.queryAttractions(
//       context.destination,
//       context.interests,
//     );

//     return { hotels, attractions };
//   }

//   private async getGooglePlaces(context: any, query?: string) {
//     if (!context.destination) return [];

//     const searchQuery =
//       query ||
//       `${context.interests?.join(' ') || 'attractions restaurants'} in ${context.destination}`;

//     try {
//       const response = await this.googleMaps.textSearch({
//         params: {
//           query: searchQuery,
//           key: 'AIzaSyDySpj6a8j-HIbSKGJL0lju9SDMyNq0waE',
//         },
//       });

//       return response.data.results.slice(0, 10).map((place) => ({
//         name: place.name,
//         rating: place.rating,
//         address: place.formatted_address,
//         types: place.types,
//         price_level: place.price_level,
//         coordinates: [place.geometry.location.lng, place.geometry.location.lat], // [longitude, latitude]
//       }));
//     } catch (error) {
//       console.error('Google Places error:', error);
//       return [];
//     }
//   }

//   private async queryHotels(destination: string, budget?: string) {
//     // Replace with actual database query
//     return [
//       {
//         name: 'Galle Face Hotel',
//         price: 'LKR 25,000/night',
//         rating: 4.5,
//         address: '2 Galle Face Terrace, Colombo 03',
//         coordinates: [79.8431, 6.9271], // [longitude, latitude]
//       },
//       {
//         name: 'Jetwing Vil Uyana',
//         price: 'LKR 35,000/night',
//         rating: 4.8,
//         address: 'Rangirigama, Sigiriya Road, Kandy',
//         coordinates: [80.7718, 7.9403],
//       },
//       {
//         name: 'Fort Printers',
//         price: 'LKR 18,000/night',
//         rating: 4.3,
//         address: '39 Pedlar Street, Galle Fort',
//         coordinates: [80.217, 6.0329],
//       },
//       {
//         name: 'Heritance Tea Factory',
//         price: 'LKR 22,000/night',
//         rating: 4.6,
//         address: 'Kandapola, Nuwara Eliya',
//         coordinates: [80.7675, 6.9497],
//       },
//     ];
//   }

//   private async queryAttractions(destination: string, interests?: string[]) {
//     // Replace with actual database query
//     return [
//       {
//         name: 'National Museum of Colombo',
//         type: 'museum',
//         rating: 4.3,
//         address: 'Sir Marcus Fernando Mawatha, Colombo 07',
//         coordinates: [79.8612, 6.9147],
//       },
//       {
//         name: 'Temple of the Sacred Tooth Relic',
//         type: 'temple',
//         rating: 4.7,
//         address: 'Sri Dalada Veediya, Kandy',
//         coordinates: [80.6337, 7.2906],
//       },
//       {
//         name: 'Galle Fort',
//         type: 'historic site',
//         rating: 4.6,
//         address: 'Church Street, Galle Fort',
//         coordinates: [80.217, 6.0329],
//       },
//       {
//         name: 'Gregory Lake',
//         type: 'nature',
//         rating: 4.2,
//         address: 'Gregory Lake Road, Nuwara Eliya',
//         coordinates: [80.757, 6.9497],
//       },
//       {
//         name: 'Gangaramaya Temple',
//         type: 'temple',
//         rating: 4.4,
//         address: '61 Sri Jinaratana Road, Colombo 02',
//         coordinates: [79.86, 6.916],
//       },
//       {
//         name: 'Royal Botanical Gardens',
//         type: 'nature',
//         rating: 4.5,
//         address: 'Peradeniya, Kandy',
//         coordinates: [80.5981, 7.2733],
//       },
//     ];
//   }

//   private formatItinerary(itinerary: any): string {
//     let formatted = `**${itinerary.title}**\n${itinerary.summary}\n\n`;

//     itinerary.days.forEach((day) => {
//       formatted += `**Day ${day.day} (${day.date})**\n`;
//       day.activities.forEach((activity) => {
//         formatted += `${activity.time} - ${activity.name}\n  ${activity.description}\n  📍 ${activity.location}\n\n`;
//       });
//     });

//     formatted += `**Accommodation**: ${itinerary.accommodation}\n\n`;
//     formatted += `**Tips**:\n${itinerary.tips.map((tip) => `• ${tip}`).join('\n')}`;

//     return formatted;
//   }
// }
