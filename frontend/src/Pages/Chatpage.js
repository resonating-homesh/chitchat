import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import ChatBox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
        {user && <ChatBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
      </Box>
    </div>
  );
};

export default Chatpage;
