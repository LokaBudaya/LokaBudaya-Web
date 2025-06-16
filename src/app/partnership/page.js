"use client"

import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import PartnershipPage from '@/components/PartnershipContent';
import Footer from '@/components/ui/Footer';

export default function PartershipPage() {
    return (
        <div>
            <Navbar></Navbar>
            <PartnershipPage></PartnershipPage>
            <Footer></Footer>
        </div>
    )
}
