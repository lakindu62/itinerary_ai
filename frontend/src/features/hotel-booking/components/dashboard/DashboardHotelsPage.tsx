"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LoadingSpinner from '../shared/LoadingSpinner';
import Modal from '../shared/Modal';
import HotelForm from '../hotels/HotelForm';
import { useHotels } from '../../hooks/useHotels';
import { Hotel } from '../../types/hotel.types';
import { AMENITIES } from '../../lib/constants';

export default function DashboardHotelsPage() {
  const { myHotels, isLoading, createHotel, updateHotel, deleteHotel } = useHotels();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const filteredHotels = myHotels.filter(hotel =>
    hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateHotel = async (data: any) => {
    await createHotel(data);
    setShowCreateModal(false);
  };

  const handleUpdateHotel = async (data: any) => {
    if (editingHotel) {
      await updateHotel({ id: editingHotel.id, data });
      setEditingHotel(null);
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (window.confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      await deleteHotel(hotelId);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Hotels</h1>
          <p className="text-gray-600">
            Manage your {myHotels.length} hotel{myHotels.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No hotels match your search' : 'No hotels yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first hotel to get started'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Hotel
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelManagementCard
              key={hotel.id}
              hotel={hotel}
              onEdit={(hotel) => setEditingHotel(hotel)}
              onDelete={handleDeleteHotel}
            />
          ))}
        </div>
      )}

      {/* Create Hotel Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Hotel"
      >
        <HotelForm 
          onSubmit={handleCreateHotel}
          onSuccess={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Hotel Modal */}
      <Modal
        isOpen={!!editingHotel}
        onClose={() => setEditingHotel(null)}
        title="Edit Hotel"
      >
        {editingHotel && (
          <HotelForm 
            initialData={editingHotel}
            isEdit={true}
            hotelId={editingHotel.id}
            onSubmit={handleUpdateHotel}
            onSuccess={() => setEditingHotel(null)}
          />
        )}
      </Modal>
    </div>
  );
}

// Hotel Management Card Component
interface HotelManagementCardProps {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotelId: string) => void;
}

function HotelManagementCard({ hotel, onEdit, onDelete }: HotelManagementCardProps) {
  const activeAmenities = AMENITIES.filter(amenity => 
    hotel[amenity.key as keyof Hotel] === true
  ).slice(0, 3);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="bg-white/90">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => window.location.href = `/hotels/${hotel.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = `/hotels/${hotel.id}/rooms`}>
                <Users className="mr-2 h-4 w-4" />
                Manage Rooms
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(hotel)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Hotel
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(hotel.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Hotel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {hotel.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {hotel.city}, {hotel.state}, {hotel.country}
          </p>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>
        
        {/* Amenities */}
        <div className="flex items-center space-x-2 mb-4">
          {activeAmenities.map((amenity) => (
            <Badge 
              key={amenity.key} 
              variant="secondary"
              className="bg-gray-100 text-gray-700"
            >
              {amenity.icon} {amenity.label}
            </Badge>
          ))}
          {activeAmenities.length < AMENITIES.filter(amenity => 
            hotel[amenity.key as keyof Hotel] === true
          ).length && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              +{AMENITIES.filter(amenity => 
                hotel[amenity.key as keyof Hotel] === true
              ).length - activeAmenities.length} more
            </Badge>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">Rooms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">Bookings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}