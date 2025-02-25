import Papa from 'papaparse';
import { useEffect, useState } from 'react';
export const codeText = (code: string, language: string, ...arg: string[]) => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        fetchCSVData("translate.csv").then(setData);
    }, [language]);
    const row = data.find((row: any) => row.code === code);
    try{
        const str = row[language];
        return arg.reduce((acc, arg, i) => acc.replace(`{${i}}`, arg), str);
    } catch {
        return code;
    }
};

export const codeTextAlt = async (code: string, language: string, ...arg: string[]) => {
    const data = await fetchCSVData("/translate.csv");
    const row = data.find((row: any) => row.code === code);
    try {
        const str = row[language];
        return arg.reduce((acc, arg, i) => acc.replace(`{${i}}`, arg), str);
    } catch {
        return code;
    }
};

export const getLanguageOptions = () => {
    const [languageOptions, setLanguageOptions] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        const loadLanguage = async () => {
            const data = await fetchCSVData("translate.csv");
            const lan = data.find((row: any) => row.code === "lan");
            if (lan) {
                delete lan.code;
                const lanMap = new Map<string, string>(Object.entries(lan));
                setLanguageOptions(lanMap);
            }
        };

        loadLanguage();
    }, []);
    return languageOptions;
};

const fetchCSVData = async (filePath: string): Promise<any[]> => {
    const response = await fetch(filePath);
    const reader = response.body!.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const CSVString = decoder.decode(result.value!);
    const { data } = Papa.parse(CSVString, {
        header: true,
        dynamicTyping: true,
        delimiter: ";",
    });
    return data;
};