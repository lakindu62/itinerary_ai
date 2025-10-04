'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store';
import { setData } from '../BusinessRegistrationSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { z } from 'zod';
import { BusinessLegalEntitySchema } from '@shared/types/user-management';

type BusinessLegalEntityFormData = z.infer<typeof BusinessLegalEntitySchema>

interface BusinessLegalEntityStepProps {
    onSubmit: (data: BusinessLegalEntityFormData) => void;
    onPrevious: () => void;
}

export function BusinessLegalEntityStep({ onSubmit, onPrevious }: BusinessLegalEntityStepProps) {
    const dispatch = useAppDispatch();

    const form = useForm<BusinessLegalEntityFormData>({
        resolver: zodResolver(BusinessLegalEntitySchema),
        defaultValues: {
            legalEntityName: '',
            legalEntityAddress: '',
            legalEntitySigner: '',
        },
    });

    const handleSubmit = (data: BusinessLegalEntityFormData) => {
        dispatch(setData(data));
        onSubmit(data);
    };

    return (
        <div className="space-y-6">
            <div className="">
                <h2 className="text-2xl font-bold">Welcome! Let&apos;s get started</h2>
                <p className="text-muted-foreground mt-2">
                    Please enter your legal entity name, address, and signer to begin your business registration
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="legalEntityName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Legal Entity Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your legal entity name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter your legal entity name to begin your business registration
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="legalEntityAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Legal Entity Address</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your legal entity address"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter your legal entity address to begin your business registration
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="legalEntitySigner"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Legal Entity Signer</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your legal entity signer"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter your legal entity signer to begin your business registration
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
                            Previous
                        </Button>
                        <Button type="submit" className="flex-1" disabled={!form.formState.isValid}>
                            Complete Registration
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
