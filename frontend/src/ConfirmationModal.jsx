import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmationModal.css';

function ConfirmationModal({ visible, message, onConfirm, onCancel}) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div className="modal-box"
                        initial={{ scale: 0.8}}
                        animate={{ scale: 1}}
                        exit={{ opacity: 0 }}
                    >
                        <p>{message}</p>
                        <div className="modal-buttons">
                            <button className="btn-confirm" onClick={onConfirm}>Oui</button>
                            <button className="btn-cancel" onClick={onCancel}>Annuler</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ConfirmationModal;