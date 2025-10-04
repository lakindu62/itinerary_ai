'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store';
import { setData, nextStep } from '../BusinessRegistrationSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { BusinessDetailsSchema, BusinessType } from '@shared/types/user-management';
import { APIProvider } from '@vis.gl/react-google-maps';
import { CustomPlacesAutocomplete } from './CustomPlacesAutocomplete';
import { z } from 'zod';

type BusinessDetailsFormData = z.infer<typeof BusinessDetailsSchema>;

interface BusinessDetailsStepProps {
    onNext: () => void;
}


export function BusinessDetailsStep({ onNext }: BusinessDetailsStepProps) {
    const dispatch = useAppDispatch();

    const form = useForm<BusinessDetailsFormData>({
        resolver: zodResolver(BusinessDetailsSchema),
        mode: 'onChange', // This will validate on every change
        defaultValues: {
            brandName: '',
            type: BusinessType.RESTAURANT,
            primaryContactNumber: '',
            branch: {
                bName: '',
                bLocation: {
                    coords: { lat: 0, lng: 0 },
                    address: '',
                    city: '',
                    country: '',
                },
            },
        },
    });

    console.log(form.getValues());
    console.log('Form valid:', form.formState.isValid);
    console.log('Form errors:', form.formState.errors);
    console.log('Form state:', {
        isValid: form.formState.isValid,
        isValidating: form.formState.isValidating,
        isDirty: form.formState.isDirty,
        isSubmitted: form.formState.isSubmitted,
        touchedFields: form.formState.touchedFields,
        dirtyFields: form.formState.dirtyFields
    });

    // Let's manually validate the data
    const result = BusinessDetailsSchema.safeParse(form.getValues());
    console.log('Manual validation result:', result);

    // Handle place selection from Google Places Autocomplete
    const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
        if (place && place.geometry && place.geometry.location) {
            // Handle both function and direct property access for coordinates
            const lat = typeof place.geometry.location.lat === 'function'
                ? place.geometry.location.lat()
                : place.geometry.location.lat as unknown as number;
            const lng = typeof place.geometry.location.lng === 'function'
                ? place.geometry.location.lng()
                : place.geometry.location.lng as unknown as number;

            // Extract city and country from address components
            let city = '';
            let country = '';

            if (place.address_components) {
                place.address_components.forEach((component) => {
                    if (component.types.includes('locality') || component.types.includes('administrative_area_level_1')) {
                        city = component.long_name;
                    }
                    if (component.types.includes('country')) {
                        country = component.long_name;
                    }
                });
            }
            console.log("---------------------------------------------------------------------------------------------------")
            console.log({ lat, lng, city, country, place: place.formatted_address });

            // Update the branch location in the form
            const currentBranch = form.getValues('branch')
            form.setValue('branch', {
                bName: currentBranch.bName,
                bLocation: {
                    coords: { lat, lng },
                    address: place.formatted_address || '',
                    city: city || '',
                    country: country || '',
                }
            }, { shouldValidate: true, shouldTouch: true });



        }
    };

    const onSubmit = (data: BusinessDetailsFormData) => {
        console.log("🚀 ~ onSubmit ~ data:", data)
        dispatch(setData(data));
        dispatch(nextStep());
        onNext();
    };

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Business Details</h2>
                    <p className="text-muted-foreground mt-2">
                        Tell us about your business and location
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="brandName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your business brand name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The name customers will recognize your business by
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your business type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={BusinessType.RESTAURANT}>Restaurant</SelectItem>
                                            <SelectItem value={BusinessType.HOTEL}>Hotel</SelectItem>
                                            <SelectItem value={BusinessType.EVENT}>Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose the category that best describes your business
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="primaryContactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Contact Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter your primary contact number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Main phone number for customer inquiries
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="branch.bName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Branch Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the name of this branch/location"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Name for this specific business location
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="branch.bLocation.address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Location</FormLabel>
                                    <FormControl>
                                        <CustomPlacesAutocomplete
                                            placeholder="Start typing your business address..."
                                            onPlaceSelect={handlePlaceSelect}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Start typing your address and select from the suggestions
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!form.formState.isValid}
                        >
                            Continue
                        </Button>
                    </form>
                </Form>
            </div>
        </APIProvider>
    );
}
