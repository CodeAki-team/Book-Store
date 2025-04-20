'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';



const Sorting = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        const inStockFromUrl = searchParams.get("inStock") === "true";
        setInStockOnly(inStockFromUrl);
    }, [searchParams]);

    function handleSwitchChange(checked: boolean) {
        const params = new URLSearchParams(searchParams.toString());

        if (checked) params.set("inStock", "true");
        else params.delete("inStock");

        router.push(`?${params.toString()}`);
        setInStockOnly(checked);
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                className='cursor-pointer'
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="in-stock">In Stock</Label>
        </div>
    );
};

export default Sorting
