"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useHotels } from '../../hooks/useHotels';
import { Hotel } from '../../types/hotel.types';
import HotelCard from '../hotels/HotelCard';
import HotelForm from '../hotels/HotelForm';
import LoadingSpinner from '../shared/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

export default function DashboardHotelsPage() {
  const router = useRouter();
  const { myHotels, isLoadingMyHotels, deleteHotel } = useHotels();
  const { userId } = useAuth(); // Get current user ID
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter hotels based on search
  const filteredHotels = myHotels.filter(hotel =>
    hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

 // Make sure this function navigates correctly
const handleViewDetails = (hotel: Hotel) => {
  console.log('🏨 Navigating to hotel details:', hotel.id);
  router.push(`/hotels/${hotel.id}`); // Should go to hotel details, NOT room creation
};

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowCreateForm(true);
  };

  const handleDelete = async (hotel: Hotel) => {
    if (!userId) {
      toast.error('User not authenticated. Please log in.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${hotel.title}"?`)) {
      setIsDeleting(true);
      try {
        await deleteHotel(hotel.id, userId);
        toast.success(`Hotel "${hotel.title}" deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete hotel');
      } finally {
        setIsDeleting(false);
      }
    }
  };

 const handleManageRooms = (hotel: Hotel) => {
  console.log('🏠 Navigating to room management:', hotel.id);
  router.push(`/hotels/${hotel.id}/rooms`); // This should go to room list (not implemented yet)
};

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setEditingHotel(null);
    toast.success('Hotel saved successfully!');
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingHotel(null);
  };

  if (isLoadingMyHotels) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Hotels</h1>
          <p className="text-gray-600">
            Manage your {myHotels.length} hotel{myHotels.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search hotels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No hotels found' : 'No hotels yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No hotels match "${searchTerm}"`
              : 'Create your first hotel to get started'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Hotel
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onManageRooms={handleManageRooms}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Hotel Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <HotelForm
              hotel={editingHotel}
              onSuccess={handleCreateSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}