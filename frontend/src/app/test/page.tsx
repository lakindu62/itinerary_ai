// 'use client'
// import React, { useState } from 'react';
// import { Send, MapPin, Calendar, Users, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

// // These would normally be imported from a shared package or copied from backend
// interface ConversationMessage {
//     role: 'user' | 'assistant';
//     content: string;
//     timestamp: Date;
// }

// interface ConversationContext {
//     destination?: string;
//     dates?: {
//         startDate: string;
//         endDate: string;
//     };
//     travelers?: {
//         adults: number;
//         children: number;
//     };
//     budget?: number;
//     interests?: string[];
//     stage: 'initial' | 'clarifying' | 'creating' | 'modifying' | 'completed';
// }

// interface Day {
//     dayNumber: number;
//     date: string;
//     activities: Activity[];
// }

// interface Activity {
//     time: string;
//     title: string;
//     description: string;
//     location: string;
//     estimatedCost?: number;
//     coordinates: [number, number]
//     duration?: number;
// }

// interface Itinerary {
//     title: string;
//     summary: string;
//     days: Day[];
//     accommodation: string;
//     tips: string[];
// }

// interface ChatItineraryResponse {
//     response: string;
//     context: ConversationContext;
//     currentItinerary?: Itinerary;
//     conversation: ConversationMessage[];
// }

// const TravelChatInterface = () => {
//     const [messages, setMessages] = useState<ConversationMessage[]>([]);
//     const [context, setContext] = useState<ConversationContext>({ stage: 'initial' });
//     const [currentItinerary, setCurrentItinerary] = useState<Itinerary | undefined>();
//     const [inputMessage, setInputMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [conversationId] = useState(() => Math.random());
//     const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
//     const [showAllTips, setShowAllTips] = useState(false);

//     const toggleDayExpansion = (dayNumber: number) => {
//         const newExpanded = new Set(expandedDays);
//         if (newExpanded.has(dayNumber)) {
//             newExpanded.delete(dayNumber);
//         } else {
//             newExpanded.add(dayNumber);
//         }
//         setExpandedDays(newExpanded);
//     };

//     const sendMessage = async () => {
//         if (!inputMessage.trim() || isLoading) return;

//         const userMessage: ConversationMessage = {
//             role: 'user',
//             content: inputMessage,
//             timestamp: new Date()
//         };

//         // Optimistically add user message
//         setMessages(prev => [...prev, userMessage]);
//         setInputMessage('');
//         setIsLoading(true);

//         try {
//             const response = await fetch('http://localhost:3000/itineraries/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     message: inputMessage,
//                     conversationId
//                 })
//             });

//             const data: ChatItineraryResponse = await response.json();

//             // Update all state from backend response
//             setMessages(data.conversation);
//             setContext(data.context);
//             setCurrentItinerary(data.currentItinerary);

//         } catch (error) {
//             console.error('Failed to send message:', error);
//             // Remove optimistic message on error
//             setMessages(prev => prev.slice(0, -1));
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getStageDisplay = (stage: ConversationContext['stage']) => {
//         const stages = {
//             initial: 'Getting Started',
//             clarifying: 'Gathering Details',
//             creating: 'Creating Your Itinerary',
//             modifying: 'Refining Your Plan',
//             completed: 'Ready to Travel!'
//         };
//         return stages[stage];
//     };

//     const formatCurrency = (amount?: number) => {
//         if (!amount) return '';
//         return `$${amount.toFixed(2)}`;
//     };

//     const formatDuration = (minutes?: number) => {
//         if (!minutes) return '';
//         if (minutes < 60) return `${minutes}m`;
//         const hours = Math.floor(minutes / 60);
//         const remainingMinutes = minutes % 60;
//         return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
//     };

//     return (
//         <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Chat Section */}
//                 <div className="flex flex-col">
//                     <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
//                         <h2 className="text-xl font-bold">Travel Planning Assistant</h2>
//                         <p className="text-sm opacity-90">Stage: {getStageDisplay(context.stage)}</p>
//                     </div>

//                     <div className="border-x border-gray-200 h-96 overflow-y-auto p-4 space-y-4 flex-1">
//                         {messages.length === 0 && (
//                             <div className="text-center text-gray-500 py-8">
//                                 <p>👋 Hi! I'm here to help you plan your perfect trip.</p>
//                                 <p className="text-sm mt-2">Tell me where you'd like to go!</p>
//                             </div>
//                         )}

//                         {messages.map((message, index) => (
//                             <div
//                                 key={index}
//                                 className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                             >
//                                 <div
//                                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user'
//                                         ? 'bg-blue-500 text-white'
//                                         : 'bg-gray-100 text-gray-800'
//                                         }`}
//                                 >
//                                     <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                                     <p className="text-xs opacity-70 mt-1">
//                                         {new Date(message.timestamp).toLocaleTimeString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}

//                         {isLoading && (
//                             <div className="flex justify-start">
//                                 <div className="bg-gray-100 rounded-lg p-4">
//                                     <div className="flex space-x-2">
//                                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
//                                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
//                                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="border border-gray-200 rounded-b-lg p-4">
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 value={inputMessage}
//                                 onChange={(e) => setInputMessage(e.target.value)}
//                                 onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                                 placeholder="Type your message..."
//                                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 disabled={isLoading}
//                             />
//                             <button
//                                 onClick={sendMessage}
//                                 disabled={isLoading || !inputMessage.trim()}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 <Send size={18} />
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Context & Itinerary Panel */}
//                 <div className="space-y-4 overflow-y-auto max-h-screen">
//                     {/* Trip Context */}
//                     <div className="bg-gray-50 rounded-lg p-4">
//                         <h3 className="font-semibold text-gray-800 mb-3">Trip Details</h3>
//                         <div className="space-y-2 text-sm">
//                             {context.destination && (
//                                 <div className="flex items-center space-x-2">
//                                     <MapPin size={16} className="text-blue-500" />
//                                     <span>{context.destination}</span>
//                                 </div>
//                             )}
//                             {context.dates && (
//                                 <div className="flex items-center space-x-2">
//                                     <Calendar size={16} className="text-green-500" />
//                                     <span>
//                                         {context.dates.startDate} - {context.dates.endDate}
//                                     </span>
//                                 </div>
//                             )}
//                             {context.travelers && (
//                                 <div className="flex items-center space-x-2">
//                                     <Users size={16} className="text-purple-500" />
//                                     <span>
//                                         {context.travelers.adults} adults
//                                         {context.travelers.children > 0 && `, ${context.travelers.children} children`}
//                                     </span>
//                                 </div>
//                             )}
//                             {context.budget && (
//                                 <div className="flex items-center space-x-2">
//                                     <DollarSign size={16} className="text-yellow-500" />
//                                     <span>{formatCurrency(context.budget)}</span>
//                                 </div>
//                             )}
//                             {context.interests && context.interests.length > 0 && (
//                                 <div className="mt-2">
//                                     <p className="text-xs text-gray-600 mb-1">Interests:</p>
//                                     <div className="flex flex-wrap gap-1">
//                                         {context.interests.map((interest, index) => (
//                                             <span
//                                                 key={index}
//                                                 className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
//                                             >
//                                                 {interest}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Current Itinerary */}
//                     {currentItinerary && (
//                         <div className="bg-green-50 rounded-lg p-4">
//                             <h3 className="font-semibold text-gray-800 mb-2">{currentItinerary.title}</h3>
//                             <p className="text-sm text-gray-600 mb-3">{currentItinerary.summary}</p>

//                             {/* Accommodation */}
//                             {currentItinerary.accommodation && (
//                                 <div className="mb-4 p-3 bg-white rounded border">
//                                     <h4 className="font-medium text-sm text-gray-800 mb-1">Accommodation</h4>
//                                     <p className="text-xs text-gray-600">{currentItinerary.accommodation}</p>
//                                 </div>
//                             )}

//                             {/* Days */}
//                             <div className="space-y-3">
//                                 <h4 className="font-medium text-sm">Itinerary ({currentItinerary.days.length} days)</h4>
//                                 {currentItinerary.days.map((day, index) => (
//                                     <div key={index} className="bg-white p-3 rounded border">
//                                         <div
//                                             className="flex justify-between items-center cursor-pointer"
//                                             onClick={() => toggleDayExpansion(day.dayNumber)}
//                                         >
//                                             <div className="flex items-center space-x-2">
//                                                 <strong className="text-sm">Day {day.dayNumber}</strong>
//                                                 {day.date && (
//                                                     <span className="text-xs text-gray-500">({day.date})</span>
//                                                 )}
//                                                 <span className="text-xs text-gray-500">
//                                                     {day.activities.length} activities
//                                                 </span>
//                                             </div>
//                                             {expandedDays.has(day.dayNumber) ? (
//                                                 <ChevronUp size={16} className="text-gray-400" />
//                                             ) : (
//                                                 <ChevronDown size={16} className="text-gray-400" />
//                                             )}
//                                         </div>

//                                         {expandedDays.has(day.dayNumber) && (
//                                             <div className="mt-3 space-y-2">
//                                                 {day.activities.map((activity, actIndex) => (
//                                                     <div key={actIndex} className="border-l-2 border-blue-200 pl-3 py-2">
//                                                         <div className="flex justify-between items-start mb-1">
//                                                             <div className="flex-1">
//                                                                 <div className="flex items-center space-x-2 mb-1">
//                                                                     <Clock size={12} className="text-gray-400" />
//                                                                     <span className="text-xs font-medium text-gray-600">
//                                                                         {activity.time}
//                                                                     </span>
//                                                                     {activity.duration && (
//                                                                         <span className="text-xs text-gray-500">
//                                                                             ({formatDuration(activity.duration)})
//                                                                         </span>
//                                                                     )}
//                                                                 </div>
//                                                                 <h5 className="text-sm font-medium text-gray-800">
//                                                                     {activity.title}
//                                                                 </h5>
//                                                                 <p className="text-xs text-gray-600 mt-1">
//                                                                     {activity.description}
//                                                                 </p>
//                                                                 <div className="flex items-center space-x-2 mt-1">
//                                                                     <MapPin size={10} className="text-gray-400" />
//                                                                     <span className="text-xs text-gray-500">
//                                                                         {activity.location}
//                                                                     </span>
//                                                                 </div>
//                                                             </div>
//                                                             {activity.estimatedCost && (
//                                                                 <span className="text-xs font-medium text-green-600 ml-2">
//                                                                     {formatCurrency(activity.estimatedCost)}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Tips */}
//                             {currentItinerary.tips.length > 0 && (
//                                 <div className="mt-4">
//                                     <div className="flex justify-between items-center mb-2">
//                                         <h4 className="font-medium text-sm">Travel Tips</h4>
//                                         {currentItinerary.tips.length > 3 && (
//                                             <button
//                                                 onClick={() => setShowAllTips(!showAllTips)}
//                                                 className="text-xs text-blue-600 hover:text-blue-800"
//                                             >
//                                                 {showAllTips ? 'Show Less' : `Show All ${currentItinerary.tips.length}`}
//                                             </button>
//                                         )}
//                                     </div>
//                                     <div className="bg-white p-3 rounded border">
//                                         <ul className="text-xs space-y-2">
//                                             {(showAllTips ? currentItinerary.tips : currentItinerary.tips.slice(0, 3))
//                                                 .map((tip, index) => (
//                                                     <li key={index} className="text-gray-600 flex">
//                                                         <span className="mr-2">•</span>
//                                                         <span>{tip}</span>
//                                                     </li>
//                                                 ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TravelChatInterface;