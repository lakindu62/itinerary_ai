// 'use client';

// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { PasswordSchema } from '../BusinessRegistrationSchema';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { setData, nextStep, prevStep } from '../BusinessRegistrationSlice';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// type PasswordFormData = {
//   password: string;
// };

// interface PasswordStepProps {
//   onNext: () => void;
//   onPrevious: () => void;
// }

// export function PasswordStep({ onNext, onPrevious }: PasswordStepProps) {
//   const dispatch = useAppDispatch();
//   const { password } = useAppSelector((state) => state.businessOnboarding);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//   } = useForm<PasswordFormData>({
//     resolver: zodResolver(PasswordSchema),
//     mode: 'onChange',
//     defaultValues: {
//       password: password || '',
//     },
//   });

//   const onSubmit = (data: PasswordFormData) => {
//     dispatch(setData(data));
//     dispatch(nextStep());
//     onNext();
//   };

//   const handlePrevious = () => {
//     dispatch(prevStep());
//     onPrevious();
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold">Create a secure password</h2>
//         <p className="text-muted-foreground mt-2">
//           Choose a strong password to protect your business account
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             type="password"
//             placeholder="Enter a secure password"
//             {...register('password')}
//             className={errors.password ? 'border-red-500' : ''}
//           />
//           {errors.password && (
//             <p className="text-sm text-red-500">{errors.password.message}</p>
//           )}
//           <p className="text-xs text-muted-foreground">
//             Password must be at least 6 characters long
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handlePrevious}
//             className="flex-1"
//           >
//             Previous
//           </Button>
//           <Button type="submit" className="flex-1" disabled={!isValid}>
//             Continue
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
