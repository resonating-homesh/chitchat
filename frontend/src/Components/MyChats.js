import { AddIcon } from "@chakra-ui/icons";
import { Image, Text, Box, useToast, Button, Stack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender } from "./ChatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const { test, setTest, selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [alpha, setAlpha] = useState([]);
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setAlpha(data);
      console.log(alpha);
      setChats(data);
      console.log(chats);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch the data!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "40%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "30px", md: "30px" }}
        fontFamily="monospace"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={{ base: "30px", md: "25px" }}> My Chats </Text>
        <GroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {alpha.map((chat) => (
              <Box
                display="flex"
                flexDir="row"
                alignItems="center"
                onClick={() => setSelectedChat(chat) && setTest(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Image
                  mr={3}
                  src={chat.users[1].pic}
                  borderRadius="full"
                  boxSize="40px"
                ></Image>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
