import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import CallPage from './pages/CallPage';

const MentorModule = () => {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/call" element={<CallPage />} />
        </Routes>
    );
};

export default MentorModule;