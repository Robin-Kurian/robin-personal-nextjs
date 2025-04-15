import React, { useEffect, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { GET_POST_OFFICE_BY_PIN_CODE } from "@/utilities/functions";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";

const AddEditAddress = ({
    values,
    errors,
    handleChange,
    handleBlur,
    setValues,
    validations 
}) => {
    const [postOffices, setPostOffices] = useState([]);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false); 

    // Derive isRequired from the validations prop
    const addressFields = [
        { name: "firstName", label: "First Name", type: "text" },
        { name: "lastName", label: "Last Name", type: "text" },
        { name: "addressLine1", label: "Address Line 1", type: "text" },
        { name: "addressLine2", label: "Address Line 2", type: "text" }, // Optional
        { name: "phone", label: "Phone", type: "tel" }, // Use tel type
        { name: "email", label: "Email", type: "email" }, // Optional
        { name: "apartment", label: "Apartment, suite etc", type: "text" }, // Optional
        { name: "pinCode", label: "Pin Code", type: "text", maxLength: 6 }, // Add maxLength
        { name: "postOffice", label: "Post Office", type: "select" },
        { name: "city", label: "City", type: "text", readOnly: true }, // ReadOnly
        { name: "state", label: "State", type: "text", readOnly: true }, // ReadOnly
        { name: "country", label: "Country", type: "text", readOnly: true },
        { name: "isDefault", label: "Set as default address", type: "checkbox" },
    ];

    // Fetch location data when pinCode changes
    useEffect(() => {
        // Only fetch if pinCode is 6 digits
        if (values.pinCode && values.pinCode.length === 6) {
            fetchLocationData(values.pinCode);
        } else {
            // Clear dependent fields if pin code is not 6 digits
            setValues(prev => ({
                ...prev,
                city: "",
                state: "",
                postOffice: "",
            }));
            setPostOffices([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.pinCode]); // Dependency on values.pinCode

    const fetchLocationData = async (pinCode) => {
        setIsFetchingLocation(true);
        // Clear previous data immediately
        setValues((prev) => ({
            ...prev,
            city: "",
            state: "",
            postOffice: "",
        }));
        setPostOffices([]);

        try {
            const response = await fetch(GET_POST_OFFICE_BY_PIN_CODE(pinCode));
            const data = await response.json();

            if (data[0].Status === "Success") {
                const { PostOffice } = data[0];
                setPostOffices(PostOffice);
                const { District, State } = PostOffice[0];
                setValues((prev) => ({
                    ...prev,
                    postOffice: PostOffice[0].Name,
                    city: District,
                    state: State,
                }));
            } else {
                setValues((prev) => ({
                    ...prev,
                    city: "",
                    state: "",
                    postOffice: "",
                }));
                setPostOffices([]); 
                toast({ variant: "destructive", title: "Invalid pin code. Please enter a valid Indian pin code." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error fetching location data.", description: error.message });
            // Clear fields using setValues
            setValues((prev) => ({
                ...prev,
                city: "",
                state: "",
                postOffice: "",
            }));
            setPostOffices([]);
        } finally {
            setIsFetchingLocation(false);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            {addressFields.map((field) => {
                const isRequired = !!validations[field.name]?.required;
                const fieldError = errors[field.name];
                return (
                    <div key={field.name} className={`mt-2 ${field.type === 'checkbox' ? 'sm:col-span-2' : ''}`}>
                        {field.type === "checkbox" ? (
                            <Checkbox
                                name={field.name}
                                isSelected={values[field.name]} 
                                onChange={handleChange} 
                                size="sm"
                                classNames={{ 
                                    label: "text-sm"
                                }}
                            >
                                {field.label}
                            </Checkbox>
                        ) : field.type === "select" ? (
                            // Use HeroUI Select for Post Office
                            <Select
                                name={field.name}
                                label={field.label}
                                selectedKeys={postOffices.some(office => office.Name === values.postOffice) ? [values.postOffice] : []} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                isDisabled={postOffices.length === 0 || isFetchingLocation}
                                isLoading={isFetchingLocation}
                                isRequired={isRequired}
                                isInvalid={!!fieldError}
                                errorMessage={fieldError}
                                variant="bordered"
                                size="sm"
                                className="w-full"
                                classNames={{ 
                                    label: "text-sm",
                                    value: "text-sm",
                                }}
                            >
                                {postOffices.map((office) => (
                                    <SelectItem key={office.Name} value={office.Name}>
                                        {office.Name}
                                    </SelectItem>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                type={field.type}
                                name={field.name}
                                label={field.label}
                                value={values[field.name] || ''} 
                                onChange={handleChange} 
                                onBlur={handleBlur} 
                                isRequired={isRequired}
                                isInvalid={!!fieldError}
                                errorMessage={fieldError}
                                readOnly={field.readOnly || (field.name === 'pinCode' && isFetchingLocation)} 
                                isDisabled={field.readOnly || (field.name === 'pinCode' && isFetchingLocation)} 
                                maxLength={field.maxLength} 
                                variant="bordered"
                                size="sm"
                                className="w-full"
                                classNames={{ 
                                    label: "text-sm",
                                    input: "text-sm",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AddEditAddress;
