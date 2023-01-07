import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';

const ChatBox = (setFetchAgain, fetchAgain) => {
  const { user, setSelectedChat, setTest, test, selectedChat } = ChatState();

  return (
    <Box
    display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="lightGreen"
    w={{ base:"100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px"
    >

    <>
        {selectedChat ? ( <>
          <Text 
          fontSize = {{ base:"28px", md:"30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          alignItems="center"
          justifyContent={{ base:"space-between" }}
          >
          <IconButton
          display={{ base:"flex", md:"none" }}
          icon={<ArrowBackIcon/>}
          onClick={()=> setSelectedChat("") }
          />

            {selectedChat.isGroupChat ? (
              <> {selectedChat.chatName.toUpperCase()} </>
            ) : ( <></>  ) }

          </Text>
        </> ) : (
          <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on User to start chatting!
            </Text>
          </Box>
        )}
    </>

    </Box>
  )
}

export default ChatBox