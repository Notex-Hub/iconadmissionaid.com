import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Chatbot from "../Components/Chatbot/FaqChatbot";
import { useState } from "react";

const MainLayout = () => {
    const [chatbot,setChatbot]=useState(false)



    return (
        <div className="relative">
            <ToastContainer position="top-right" autoClose={3000} />
            <Outlet/>
            <div className="fixed bottom-6 right-6 ">
                {
                    chatbot?<Chatbot
                    chatbot={chatbot}
                    setChatbot={setChatbot}
                    
                    />: <IoChatbubbleEllipsesOutline
                    onClick={()=>setChatbot(!chatbot)}
                    className="cursor-pointer" size={40}/>
                }
               
                
            </div>
        </div>
    );
};

export default MainLayout;