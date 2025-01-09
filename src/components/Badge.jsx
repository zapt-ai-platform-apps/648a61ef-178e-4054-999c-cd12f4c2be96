import React from 'react';
import { Link } from 'react-router-dom';

export default function Badge() {
    return (
        <a href="https://www.zapt.ai" className="fixed bottom-4 left-4 text-gray-500 hover:text-gray-700 cursor-pointer">
            Made on ZAPT
        </a>
    )
}