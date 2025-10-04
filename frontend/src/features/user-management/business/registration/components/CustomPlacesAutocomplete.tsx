'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';

interface CustomPlacesAutocompleteProps {
    placeholder: string;
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

interface PlacePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

export function CustomPlacesAutocomplete({
    placeholder,
    onPlaceSelect,
    value,
    onChange,
    className
}: CustomPlacesAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [inputValue, setInputValue] = useState(value || '');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const placesLib = useMapsLibrary('places');
    const placesService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesDetailService = useRef<google.maps.places.PlacesService | null>(null);

    // Initialize Places services
    useEffect(() => {
        if (!placesLib) return;

        placesService.current = new placesLib.AutocompleteService();

        // Create a temporary div for PlacesService (it needs a map or div)
        const tempDiv = document.createElement('div');
        placesDetailService.current = new placesLib.PlacesService(tempDiv);
    }, [placesLib]);

    // Debounced search function
    useEffect(() => {
        if (!placesService.current || !inputValue.trim() || inputValue.length < 2) {
            setPredictions([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            placesService.current?.getPlacePredictions(
                {
                    input: inputValue,
                    componentRestrictions: { country: "LK" },
                    types: ["establishment", "geocode"],
                },
                (predictions, status) => {
                    setIsLoading(false);
                    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setPredictions(predictions);
                        setIsOpen(true);
                        setSelectedIndex(-1);
                    } else {
                        setPredictions([]);
                        setIsOpen(false);
                    }
                }
            );
        }, 300);

        return () => {
            clearTimeout(timer);
            setIsLoading(false);
        };
    }, [inputValue]);

    // Handle place details fetch
    const handlePlaceSelect = async (placeId: string, description: string) => {
        if (!placesDetailService.current) return;

        setIsLoading(true);
        placesDetailService.current.getDetails(
            {
                placeId: placeId,
                fields: ["address_components", "formatted_address", "geometry", "name", "place_id"],
            },
            (place, status) => {
                setIsLoading(false);
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    setInputValue(description);
                    setIsOpen(false);
                    onPlaceSelect(place);
                    if (onChange) {
                        onChange(description);
                    }
                }
            }
        );
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || predictions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < predictions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    const selected = predictions[selectedIndex];
                    handlePlaceSelect(selected.place_id, selected.description);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && dropdownRef.current) {
            const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedIndex]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync external value changes
    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [value, inputValue]);

    return (
        <div className={`relative w-full ${className}`}>
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (predictions.length > 0) {
                        setIsOpen(true);
                    }
                }}
                className="w-full pr-10"
                autoComplete="off"
            />

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
            )}

            {/* Custom dropdown */}
            {isOpen && predictions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-2 pt-2 pb-3  bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                    style={{
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    }}
                >
                    {predictions.map((prediction, index) => (
                        <div
                            key={prediction.place_id}
                            className={`px-4 py-2 cursor-pointer transition-all duration-150 border-b border-border/50 last:border-b-0 ${index === selectedIndex
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent/50'
                                }`}
                            onClick={() => handlePlaceSelect(prediction.place_id, prediction.description)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className="flex items-center space-x-3 ">
                                <div className="flex-shrink-0 mt-1">
                                    <svg
                                        className="w-3 h-3 text-muted-foreground"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1 flex flex-row gap-1 min-w-0">
                                    <div className="text-xs text-muted-foreground truncate mt-1">
                                        {prediction.structured_formatting.main_text}
                                    </div>
                                    {prediction.structured_formatting.secondary_text && (
                                        <div className="text-xs text-muted-foreground truncate mt-1">
                                            {prediction.structured_formatting.secondary_text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No results message */}
            {isOpen && !isLoading && predictions.length === 0 && inputValue.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No places found for &quot;{inputValue}&quot;
                    </div>
                </div>
            )}
        </div>
    );
}
