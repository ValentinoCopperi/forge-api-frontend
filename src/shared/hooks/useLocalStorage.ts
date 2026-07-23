import { useState } from "react"




interface I_useLocalStorage<T> {

    setDataStorage: (data: T) => void
    removeData: () => void
    data: T | null
}

export function useLocalStorage<T>(key: string, defaultValue?: T): I_useLocalStorage<T> {

    const [data, setData] = useState<T | null>(() => {
        try {
            const storagedData = localStorage.getItem(key);
            return storagedData ? JSON.parse(storagedData) : defaultValue
        } catch (error) {
            return defaultValue;
        }
    })


    const setDataStorage = (data: T): void => {

        setData(data)

        localStorage.setItem(key, JSON.stringify(data));
    }

    const removeData = (): void => {
        setData(null)
        localStorage.removeItem(key);
    }

    return {
        data,
        removeData,
        setDataStorage
    }

}