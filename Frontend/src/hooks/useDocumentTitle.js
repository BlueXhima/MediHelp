// Frontend/src/hooks/useDocumentTitle.js

import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
    useEffect(() => {
        const originalTitle = "MediHelp"; // Default title mo
        document.title = `${title} | ${originalTitle}`;

        // Kapag umalis ang user sa page na gumagamit ng hook na ito:
        return () => {
            document.title = originalTitle;
        };
    }, [title]);
};