import { useEffect, useState } from "react";


const RealTimeDate = () => {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
      const updateDateTime = () => {
        const date = new Date();
        const formattedDate = date.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setCurrentDate(formattedDate);
      };
  
      // Update date and time every second
      const interval = setInterval(updateDateTime, 1000);
  
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, []);
    return (
        <div>
            {currentDate}
        </div>
    );
};

export default RealTimeDate;