import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CounsellorPage from './pages/CounsellorPage';

const AICounsellorModule = () => {
    return (
        <Routes>
            <Route path="/" element={<CounsellorPage />} />
        </Routes>
    );
};

export default AICounsellorModule;