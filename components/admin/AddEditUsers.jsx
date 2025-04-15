"use client";

import { useFormValidation, EMAIL_REGEX } from '@/hooks/useFormValidation';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { toast } from '@/hooks/use-toast';

const ROLES = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' }
];

const AddEditUsers = ({ user, onClose, onSuccess }) => {
    const initialValues = {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'user',
    };

    const validations = {
        name: {
            required: { value: true, message: 'Name is required' },
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
        },
        email: {
            required: { value: true, message: 'Email is required' },
            pattern: { value: EMAIL_REGEX, message: 'Invalid email format' },
        },
        phone: {
            pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' },
        },
        role: {
            required: { value: true, message: 'Role is required' },
        },
    };

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setValues,
    } = useFormValidation(initialValues, validations);

    const auth = getAuth();
    const db = getFirestore();

    const handleFormSubmit = async (formValues) => {
        try {
            if (user) {
                const updates = {
                    name: formValues.name,
                    phone: formValues.phone,
                    role: formValues.role,
                };

                if (formValues.email !== user.email) {
                    try {
                        // This will only work if the user is currently signed in
                        const currentUser = auth.currentUser;
                        if (currentUser && currentUser.uid === user.id) {
                            await updateEmail(currentUser, formValues.email);
                            updates.email = formValues.email;
                        }
                    } catch (emailError) {
                        console.error('Could not update email:', emailError);
                        toast({
                            variant: "warning",
                            title: "Partial Update",
                            description: "Email could not be updated, but other changes will be saved."
                        });
                    }
                }

                await updateDoc(doc(db, 'users', user.id), updates);
                toast({ variant: "success", title: "User updated successfully" });
            } else {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formValues.email,
                    Math.random().toString(36).slice(-8) // Generate random password
                );

                // Store additional user data in Firestore
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    name: formValues.name,
                    email: formValues.email,
                    phone: formValues.phone,
                    role: formValues.role,
                    createdAt: new Date().toISOString(),
                });

                // Send password reset email to the user
                await sendPasswordResetEmail(auth, formValues.email);

                toast({
                    variant: "success",
                    title: "User created successfully",
                    description: "Password reset email sent."
                });
            }

            onSuccess?.();
            onClose?.();
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <Input
                    type="text"
                    name="name"
                    label="Full Name"
                    placeholder="Enter full name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    isRequired
                />
            </div>

            <div>
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    isRequired
                />
            </div>

            <div>
                <Input
                    type="tel"
                    name="phone"
                    label="Phone"
                    placeholder="Enter phone number"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone}
                />
            </div>

            <div>
                <Select
                    name="role"
                    label="Role"
                    placeholder="Select a role"
                    value={values.role}
                    onChange={(e) => {
                        setValues(prev => ({ ...prev, role: e.target.value }));
                    }}
                    onBlur={handleBlur}
                    isInvalid={!!errors.role}
                    errorMessage={errors.role}
                    isRequired
                >
                    {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                            {role.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                        resetForm();
                        onClose?.();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {user ? 'Update User' : 'Create User'}
                </Button>
            </div>
        </form>
    );
};

export default AddEditUsers;
