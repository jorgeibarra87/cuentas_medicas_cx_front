import { useState, useCallback, useEffect, useRef } from "react";

const useInactivity = (timeout, onInactive) => {
    const timerRef = useRef(null); // Referencia para el temporizador
    const hasTriggered = useRef(false); // Estado para evitar múltiples ejecuciones

    useEffect(() => {
        const resetTimer = () => {
            if (hasTriggered.current) return; // Si ya se ejecutó, no hacer nada
            clearTimeout(timerRef.current); // Limpiar el temporizador existente
            timerRef.current = setTimeout(() => {
                hasTriggered.current = true; // Marcar que ya se ejecutó
                onInactive(); // Ejecutar la acción
                removeEventListeners(); // Eliminar listeners
            }, timeout);
        };

        const events = ["mousedown", "keypress", "scroll", "touchstart"];
        const addEventListeners = () => {
            events.forEach((event) => window.addEventListener(event, resetTimer));
        };

        const removeEventListeners = () => {
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };

        // Configurar listeners y temporizador inicial
        addEventListeners();
        resetTimer();

        return () => {
            // Limpiar listeners y temporizador al desmontar
            removeEventListeners();
            clearTimeout(timerRef.current);
        };
    }, [timeout, onInactive]);

    return;
};

export default useInactivity;