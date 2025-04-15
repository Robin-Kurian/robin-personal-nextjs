import { useState, useCallback } from "react";

// Basic email regex (adjust as needed for stricter validation)
// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const validate = (values, validations) => {
    const errors = {};

    for (const fieldName in validations) {
        const value = values[fieldName];
        const rules = validations[fieldName];

        if (rules.required && (value === undefined || value === null || value === '' || value === false)) {
            errors[fieldName] = rules.required.message || "This field is required.";
            continue;
        }

        if (!rules.required && (value === undefined || value === null || value === '' || value === false)) {
            continue;
        }

        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength.value) {
            errors[fieldName] = rules.minLength.message || `Must be at least ${rules.minLength.value} characters.`;
        } else if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength.value) {
            errors[fieldName] = rules.maxLength.message || `Must be at most ${rules.maxLength.value} characters.`;
        } else if (rules.pattern && typeof value === 'string' && !rules.pattern.value.test(value)) {
            errors[fieldName] = rules.pattern.message || "Invalid format.";
        } else if (rules.custom && !rules.custom.validate(value, values)) {
            errors[fieldName] = rules.custom.message || "Invalid value.";
        }
    }

    return errors;
};

const useFormValidation = (initialValues, validations) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues((prevValues) => ({
            ...prevValues,
            [name]: newValue,
        }));
        if (errors[name]) {
           setErrors(prevErrors => {
               const newErrors = { ...prevErrors };
               delete newErrors[name];
               return newErrors;
           });
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        if (!validations[name]) return;

        const fieldValidations = { [name]: validations[name] };
        const fieldValues = { [name]: values[name] };
        const fieldErrors = validate(fieldValues, fieldValidations);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name] || undefined,
        }));
    }, [values, validations]);

    const validateForm = useCallback(() => {
        const newErrors = validate(values, validations);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values, validations]);

    const handleSubmit = useCallback((callback) => async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setIsSubmitting(true);
        const isValid = validateForm();
        let result = undefined;
        if (isValid) {
            try {
                result = await callback(values);
            } catch (error) {
                console.error("Error during form submission callback:", error);
            }
        }
        setIsSubmitting(false);
        return result;
    }, [validateForm, values]);

    const resetForm = useCallback((newInitialValues) => {
        setValues(newInitialValues || initialValues);
        setErrors({});
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validateForm,
        setValues,
        resetForm,
    };
};

export { useFormValidation, EMAIL_REGEX }; 