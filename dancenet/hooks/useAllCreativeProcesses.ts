import { useState, useEffect } from "react";

const useAllCreativeProcesses = (database) => {
    const [allProcesses, setAllProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await database.getAllAsync(
            "SELECT * FROM creativeprocesses;");
          setAllProcesses(result)
  
        } catch (error) {
          console.error("Error fetching process:", error);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [database]);
  
    return { allProcesses, loading };
  };
  

export default useAllCreativeProcesses;
