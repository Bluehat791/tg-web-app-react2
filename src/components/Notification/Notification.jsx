import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Notification = ({ message, type }) => (
    <motion.div 
        className={`notification ${type}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
    >
        {message}
    </motion.div>
);

export default Notification; 