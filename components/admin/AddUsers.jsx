"use client";

import React, { useState } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { Button } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/common/Loader";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const AddUsers = () => {
    const initialState = {
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user", // Default role
    };

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const db = getFirestore();
    const auth = getAuth();

    const roles = [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
    ];

    const validateEmail = async (email) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Validate email uniqueness
            const isEmailUnique = await validateEmail(formData.email);
            if (!isEmailUnique) {
                setError("Email already exists");
                setIsLoading(false);
                return;
            }

            // Create user in authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user; // Get the user object
            const uid = user.uid; // Get the generated UID

            // Create a new user document in Firestore with default role
            await setDoc(doc(db, "users", uid), {
                email: user.email.toLowerCase(),
                name: formData.name,
                role: formData.role, // Use the selected role
                createdAt: Date.now(),
                lastLoginAt: Date.now(),
                uid: uid,
            });

            toast({
                title: "Success",
                description: "User added successfully",
                variant: "success",
            });

            setFormData(initialState);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const formFields = {
        name: {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter full name",
            required: true,
            value: formData.name,
            onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value }))
        },
        email: {
            id: "email",
            type: "email",
            label: "Email",
            placeholder: "Enter email address",
            required: true,
            value: formData.email,
            onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value }))
        },
        password: {
            id: "password",
            type: "password",
            label: "Password",
            placeholder: "Enter password",
            required: true,
            value: formData.password,
            onChange: (e) => setFormData(prev => ({ ...prev, password: e.target.value }))
        },
        phone: {
            id: "phone",
            type: "tel",
            label: "Phone Number",
            placeholder: "Enter phone number",
            required: true,
            value: formData.phone,
            onChange: (e) => setFormData(prev => ({ ...prev, phone: e.target.value }))
        },
        role: {
            id: "role",
            type: "select",
            label: "User Role",
            required: true,
            value: formData.role,
            onChange: (e) => setFormData(prev => ({ ...prev, role: e.target.value })),
            options: roles
        }
    };

    const renderField = (fieldKey, field) => {
        const baseClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500";

        if (field.type === "select") {
            return (
                <div className="mb-4" key={fieldKey}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    <select
                        id={field.id}
                        className={baseClasses}
                        required={field.required}
                        value={field.value}
                        onChange={field.onChange}
                    >
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div className="mb-4" key={fieldKey}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                    {field.label}
                </label>
                <input
                    type={field.type}
                    id={field.id}
                    className={baseClasses}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                />
            </div>
        );
    };

    return (
        <div className="w-full p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg">
                {Object.entries(formFields).map(([key, field]) => renderField(key, field))}

                <Button
                    type="submit"
                    isDisabled={isLoading}
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                    {isLoading ? <Loader size="32px" border="3px" /> : "Add User"}
                </Button>
            </form>
            {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
    );
};

export default AddUsers; 