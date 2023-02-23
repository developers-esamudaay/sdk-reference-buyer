import {useEffect,useState} from "react"
const  useDebounce=(value:string, delay:number):string=> {

    const [debouncedValue, setDebouncedValue] = useState<string>(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
       
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] 
    );
    return debouncedValue;
  }
  export default useDebounce