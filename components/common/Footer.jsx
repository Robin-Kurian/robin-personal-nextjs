"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { SHOP_DETAILS } from '@/utilities/constants';

const Footer = () => {
    const pathname = usePathname();
    const hiddenPages = ['/checkout', '/protected/admin', '/protected/admin/orders', '/orders', '/coupons'];
    const isHidden = hiddenPages.includes(pathname);
    return (
        <>
            {!isHidden && (
                <footer className="flex justify-around bg-gray-100 md:py-6 py-4 px-2 mt-auto">
                    <div className="flex-1 text-center">
                        <h4 className="font-semibold mb-2 text-base">How Can We Assist?</h4>
                        <ul className="list-none">
                            <li className="mb-1"><Link href="/contact-us"><span className="text-blue-600 hover:underline text-sm">Contact us</span></Link></li>
                            <li className="mb-1"><Link href="/refunds-and-returns"><span className="text-blue-600 hover:underline text-sm">Returns Centre</span></Link></li>
                        </ul>
                    </div>
                    <div className="flex-1 text-center">
                        <h4 className="font-semibold mb-2 text-base">Stay Connected</h4>
                        <ul className="list-none">
                            <li className="mb-1"><Link target='_blank' href={SHOP_DETAILS.SHOP_FACEBOOK}><span className="text-blue-600 hover:underline text-sm">Facebook</span></Link></li>
                            <li className="mb-1"><Link target='_blank' href={SHOP_DETAILS.SHOP_INSTAGRAM}><span className="text-blue-600 hover:underline text-sm">Instagram</span></Link></li>
                        </ul>
                    </div>
                    <div className="flex-1 text-center">
                        <h4 className="font-semibold mb-2 text-base">Discover Our Story</h4>
                        <ul className="list-none">
                            <li className="mb-1"><Link href="/about-us"><span className="text-blue-600 hover:underline text-sm">About Us</span></Link></li>
                            <li className="mb-1"><Link href="/terms-and-conditions"><span className="text-blue-600 hover:underline text-sm">Terms & conditions</span></Link></li>
                        </ul>
                    </div>
                </footer>
            )}
        </>
    )
}

export default Footer