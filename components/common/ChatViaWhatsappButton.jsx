import { Link } from '@heroui/react';
import React from 'react';
import { MdWhatsapp } from "react-icons/md";
import { SHOP_DETAILS } from "@/utilities/constants";

const ChatViaWhatsappButton = ({ message, className }) => {
    const adminPhoneNumber = `91${SHOP_DETAILS.SHOP_ADMIN_CONTACT}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;

    return (
        <div className={`flex ${className}`}>
            <Link href={whatsappLink} isExternal isBlock
                className='flex items-center justify-center py-1 px-3 rounded-xl  font-semibold text-sm sm:text-lg border border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                showAnchorIcon
                anchorIcon={<MdWhatsapp className="ml-2" />
                }>
                Queries about this order?
            </Link>
        </div>
    );
};

export default ChatViaWhatsappButton;
