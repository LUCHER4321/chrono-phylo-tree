import Papa from 'papaparse';
import { useEffect, useState } from 'react';

let data0: any[] = [];

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

const provisionalData = (filePath: string = "/translate.csv") => (async (filePath: string = "/translate.csv") => {
    data0 = await fetchCSVData(filePath);
})(filePath);

export const codeText = (code: string, language: string, arg: string[] = [], filePath: string = "/translate.csv") => {
    const [data, setData] = useState<any[]>([]);
    useEffect(() => {
        fetchCSVData(filePath).then(setData);
        provisionalData(filePath);
    }, [language]);
    const row = data.find((row: any) => row.code === code) ?? data0.find((row: any) => row.code === code);
    try{
        const str = row[language];
        const val = arg.reduce((acc, arg, i) => acc.replace(`{${i}}`, arg), str);
        return val as string;
    } catch {
        return;
    }
};

export const codeTextAlt = async (code: string, language: string, arg: string[] = [], filePath: string = "/translate.csv"): Promise<string> => {
    const data = await fetchCSVData(filePath);
    const row = data.find((row: any) => row.code === code);
    try {
        const str = row[language];
        return arg.reduce((acc, arg, i) => acc.replace(`{${i}}`, arg), str);
    } catch {
        return "";
    }
};

export const getLanguageOptions = (filePath: string = "/translate.csv") => {
    const [languageOptions, setLanguageOptions] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        const loadLanguage = async () => {
            const data = await fetchCSVData(filePath);
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