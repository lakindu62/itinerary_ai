'use client'

import * as React from 'react'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store'
import { resetForm } from '@/features/user-management/business/registration/BusinessRegistrationSlice'
import { BusinessDetailsStep } from '@/features/user-management/business/registration/components/BusinessDetailsStep'
import { BusinessLegalEntityStep } from '@/features/user-management/business/registration/components/BusinessLegalEntityStep'
import { ProgressIndicator } from '@/features/user-management/business/registration/components/ProgressIndicator'
import { completeOnboarding as updateClerkMetadata } from './_actions'
import { useCompleteOnboardingMutation } from '@frontend/features/user-management/business/businessUser.api'
import { BusinessLegalEntitySchema } from '@shared/types/user-management'
import { z } from 'zod'

type BusinessLegalEntityData = z.infer<typeof BusinessLegalEntitySchema>

const STEP_LABELS = ['Business Details', 'Legal Entity'];

export default function Page() {
    const [completeOnboarding] = useCompleteOnboardingMutation()
    const [error, setError] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { user } = useUser()
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { currentStep, brandName, type, primaryContactNumber, branch, legalEntityName, legalEntityAddress, legalEntitySigner } = useAppSelector(
        (state) => state.businessOnboarding
    )
    const businessOnboardingData = {
        brandName,
        type,
        primaryContactNumber,
        branch,
        legalEntityName,
        legalEntityAddress,
        legalEntitySigner
    }


    const handleStepChange = () => {
    }

    const handleFinalSubmit = async (legalEntityData?: BusinessLegalEntityData) => {
        setIsSubmitting(true)
        setError('')

        try {
            // Merge the legal entity data with the existing business data
            const completeBusinessData = {
                ...businessOnboardingData,
                ...legalEntityData
            }
            
            console.log('businessOnboardingData', JSON.stringify(completeBusinessData))

            //update database with business onboarding details
            await completeOnboarding(completeBusinessData).unwrap()
            //updating clerk metadata with onboarding complete
            const res = await updateClerkMetadata();

            if (res?.message) {
                // Reloads the user's data from the Clerk API
                await user?.reload()
                dispatch(resetForm())
                router.push('/')
            }
            if (res?.error) {
                setError(res?.error)
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BusinessDetailsStep
                        onNext={handleStepChange}
                    />
                )
            case 2:
                return (
                    <BusinessLegalEntityStep
                        onSubmit={handleFinalSubmit}
                        onPrevious={handleStepChange}
                    />
                )
            default:
                return (
                    <BusinessDetailsStep
                        onNext={handleStepChange}
                    />
                )
        }
    }

    return (
        <div className='min-h-screen  bg-background   w-full    p-4'>
            <header className='flex w-full justify-between border'>
                <div>Itinerary.ai</div>
                <div></div>
                <div className='text-foreground'><SignOutButton /></div>
            </header>
            <div className="w-full mx-auto  max-w-2xl mt-16">


                <ProgressIndicator
                    currentStep={currentStep}
                    totalSteps={STEP_LABELS.length}
                    stepLabels={STEP_LABELS}
                />

                <div className="shadow-lg mt-10  rounded-lg p-8">
                    {/* Optional: Could add step-specific headers here */}
                    <div className="pt-0">
                        {renderCurrentStep()}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-600">Error: {error}</p>
                            </div>
                        )}

                        {isSubmitting && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-600">Processing your registration...</p>
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </div>
    )
}