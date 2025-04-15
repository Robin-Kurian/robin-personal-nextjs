import { Button, Input, Textarea } from "@heroui/react";
import React, { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { useFormValidation, EMAIL_REGEX } from '@/hooks/useFormValidation';
import CustomModal from "@/components/admin/CustomModal";
import { SHOP_DETAILS } from '@/utilities/constants';

const WhatsappFormModal = ({ buttonText, titleText = "How can we help?", iconOnly }) => {
    const [isOpen, setIsOpen] = useState(false);

    const initialValues = {
        name: '',
        email: '',
        message: ''
    };

    const validations = {
        name: {
            required: { message: "Name is required" },
            minLength: { value: 2, message: "Name must be at least 2 characters" }
        },
        email: {
            required: { message: "Email is required" },
            pattern: { value: EMAIL_REGEX, message: "Invalid email format" }
        },
        message: {
            required: { message: "Message is required" },
            minLength: { value: 10, message: "Message must be at least 10 characters" }
        }
    };

    const {
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm
    } = useFormValidation(initialValues, validations);

    const handleFormSubmit = () => {
        // Format the WhatsApp message with proper formatting
        const whatsappMessage = `👋🏼 Hi! I am *${values.name}*\n\n📧 Email: ${values.email}\n\n> ${values.message}`;

        // Construct WhatsApp URL with the shop's contact number
        const whatsappUrl = `https://wa.me/91${SHOP_DETAILS.SHOP_ADMIN_CONTACT}?text=${encodeURIComponent(whatsappMessage)}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, "_blank");

        // Close modal and reset form
        setIsOpen(false);
        resetForm();
    };

    const modalBody = (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                isRequired
            />

            <Input
                type="email"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                isRequired
            />

            <Textarea
                label="Message"
                name="message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.message}
                errorMessage={errors.message}
                isRequired
            />
        </form>
    );

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <Button
                variant="light"
                onPress={() => setIsOpen(false)}
            >
                Cancel
            </Button>
            <Button
                color="primary"
                onClick={handleSubmit(handleFormSubmit)}
                startContent={<BsWhatsapp />}
            >
                Send Message
            </Button>
        </div>
    );

    return (
        <>
            {buttonText ? (
                <Button
                    onPress={() => setIsOpen(true)}
                    color="primary"
                    startContent={<BsWhatsapp />}
                >
                    {buttonText}
                </Button>
            ) : (
                <Button
                    onPress={() => setIsOpen(true)}
                    color="primary"
                    isIconOnly={iconOnly}
                >
                    <BsWhatsapp />
                </Button>
            )}

            <CustomModal
                isOpen={isOpen}
                contentClassName="max-h-[45vh] sm:max-h-[90vh]"
                onClose={() => setIsOpen(false)}
                title={titleText}
                body={modalBody}
                footer={modalFooter}
            />
        </>
    );
};

export default WhatsappFormModal;
