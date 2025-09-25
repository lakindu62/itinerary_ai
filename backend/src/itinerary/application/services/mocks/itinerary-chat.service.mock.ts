import { ChatItineraryResponseDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { Itinerary } from '../../../domain/entities/itinerary.entity';
import { Activity } from '../../../domain/value-objects/itinerary/activity.vo';
import { Day } from '../../../domain/value-objects/itinerary/day.vo';
import {
  ConversationContext,
  ConversationMessage,
} from '../../../domain/value-objects/conversation';

export class ItineraryChatServiceMock {
  chatItinerary(): ChatItineraryResponseDto {
    const responseText =
      "Here's your personalized itinerary for kandy!\n\nWould you like me to modify anything?";

    const conversation: ConversationMessage[] = [
      new ConversationMessage(
        'user',
        '2 people , next week for 2 days  for adventure to kandy',
      ),
      new ConversationMessage('assistant', responseText),
    ];

    const context = new ConversationContext(
      'modifying',
      'kandy',
      'next week for 2 days',
      undefined,
      ['adventure'],
      2,
    );

    const day1 = new Day(1, '2024-07-08', 'Kandy', [
      new Activity(
        '09:00',
        'Breakfast at Hotel',
        "Enjoy a hearty breakfast at Jetwing Vil Uyana to fuel up for the day's adventures.",
        'Rangirigama, Sigiriya Road, Kandy',
        'restaurant',
        [80.7718, 7.9403],
      ),
      new Activity(
        '10:00',
        'Knuckles Range Trekking Consultation',
        "Meet with Knuckles Adventure or The Border Adventures in Kandy to discuss and arrange a guided trek in the Knuckles Mountain Range for the following day. Finalize the trekking route and necessary permits.  Consider a half-day trek if a full-day isn't feasible.",
        'Sahas Uyana, Ehelepola Kumarihami Mawatha, Kandy 20000, Sri Lanka',
        'activity',
        [80.6369672, 7.2914406],
      ),
      new Activity(
        '11:00',
        'Visit Knuckles Trekking Hiking Camping by Lanka Adventure Holidays',
        'Discuss trekking and camping options for Knuckles range. Arrange overnight camping if desired for the second day.',
        '60/3 Bodiyangana Mw, Kandy 20000, Sri Lanka',
        'activity',
        [80.6161049, 7.2744463],
      ),
      new Activity(
        '12:00',
        'Lunch',
        'Enjoy a local Sri Lankan lunch at a restaurant near Kandy Lake.  Ask the trekking company for recommendations.',
        'Kandy (near Kandy Lake)',
        'restaurant',
        [80.633, 7.294],
      ),
      new Activity(
        '14:00',
        'Udawatta Kele Sanctuary Exploration',
        'Hike through the Udawatta Kele Sanctuary, a protected forest reserve. Look out for diverse birdlife and monkeys.  Allow at least 2-3 hours for a good exploration.',
        'Forest Department Office, Sangamitta Mawatha, Kandy 20000, Sri Lanka',
        'activity',
        [80.6424033, 7.2988782],
      ),
      new Activity(
        '17:00',
        'Kandy Viewpoint',
        'Visit Kandy Viewpoint for panoramic views of the city and Kandy Lake.',
        '7JQQ+HWM, Rajapihilla Mawatha, Kandy, Sri Lanka',
        'sightseeing',
        [80.63980029999999, 7.288958699999999],
      ),
      new Activity(
        '19:00',
        'Dinner at Hotel or Local Restaurant',
        'Enjoy dinner at Jetwing Vil Uyana or explore local restaurants in Kandy for an authentic Sri Lankan culinary experience.',
        'Rangirigama, Sigiriya Road, Kandy',
        'restaurant',
        [80.7718, 7.9403],
      ),
    ]);

    const day2 = new Day(2, '2024-07-09', 'Knuckles Mountain Range', [
      new Activity(
        '07:00',
        'Early Breakfast and Departure',
        'Have an early breakfast at the hotel and depart for the Knuckles Mountain Range for a full day of trekking. Ensure you have packed lunch, water, and appropriate hiking gear.',
        'Rangirigama, Sigiriya Road, Kandy',
        'restaurant',
        [80.7718, 7.9403],
      ),
      new Activity(
        '08:30',
        'Knuckles Mountain Range Trekking',
        "Embark on a guided trek in the Knuckles Mountain Range. Explore the diverse landscapes, waterfalls, and scenic viewpoints. The trek's duration will depend on the chosen route (full-day or half-day). If overnight camping was arranged, stay at the campsite.",
        'Knuckles Mountain Range',
        'activity',
        [80.8667, 7.4667],
      ),
      new Activity(
        '17:00',
        'Return to Kandy (or Campsite)',
        'Begin the journey back to Kandy from the Knuckles Mountain Range after completing the trek. If camping, prepare for overnight stay.',
        'Knuckles Mountain Range',
        'transport',
        [80.8667, 7.4667],
      ),
      new Activity(
        '19:00',
        'Dinner and Relaxation',
        'Enjoy a relaxing dinner at Jetwing Vil Uyana or a local restaurant in Kandy after returning from the trek. If camping, dinner will be at the campsite.',
        'Rangirigama, Sigiriya Road, Kandy',
        'restaurant',
        [80.7718, 7.9403],
      ),
    ]);

    const currentItinerary = new Itinerary(
      'Kandy Adventure Itinerary - 2 Days',
      'A 2-day adventure-focused trip to Kandy, Sri Lanka, exploring natural beauty and thrilling activities.',
      [day1, day2],
      'Jetwing Vil Uyana: Eco-luxury resort offering a comfortable and scenic stay with wildlife and spa amenities.  Consider booking in advance, especially during peak season.',
      [
        'Hire a reliable tuk-tuk driver or rent a car for transportation around Kandy. Negotiate prices beforehand.',
        'Pack light clothing, comfortable shoes, sunscreen, insect repellent, and a hat for the trek.',
        'Stay hydrated by carrying plenty of water, especially during outdoor activities.',
        'Respect local customs and traditions when visiting temples and religious sites.',
        'Check the weather forecast before heading out for the trek in the Knuckles Mountain Range.',
        'Book trekking tours with reputable companies for safety and a better experience.',
      ],
    );

    return {
      response: responseText,
      conversation,
      context,
      currentItinerary,
    };
  }
}
