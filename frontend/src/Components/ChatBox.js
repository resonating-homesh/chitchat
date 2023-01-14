import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { getSender, getSenderFull } from './ChatLogic';
import ProfileModal from './Miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import TestLogic from './TestLogic';
import "../App.css";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatBox = ({setFetchAgain, fetchAgain}) => {

  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on('typing', ()=> setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  },[])

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const { user, setSelectedChat, selectedChat, notification, setNotification } = ChatState();
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // let users;
  // if (selectedChat) {
  //   console.log("goin in");
  //   users = selectedChat.users;
  // }

//   const getSender = (loggedUser, users) => {
    
//     if (users[0]._id)
//     {
//         return users[0]._id === loggedUser._id ? users[1].name : users[0].name
//     }
//     else 
//     {
//         return loggedUser.name
//     }
// }

// const getSenderFull = (loggedUser, users) => {
//     return users[0]._id === loggedUser._id ? users[1] : users[0]; 
// }

  // useEffect(() => {
  //   setTest(selectedChat);
  // }, [fetchAgain])

  const fetchMessages = async() => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`,
      config);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);


    } catch (error) {
       toast({
          title: "Error Occured!",
          description: "Failed to load the messages!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
    }
  }

  useEffect (()=>{
    fetchMessages();

    selectedChatCompare = selectedChat;
  },[selectedChat]);

  // console.log(notification, "-----");

  useEffect(()=>{
    socket.on("message recieved", (newMessageRecieved)=>{
      console.log("new message recived functionality",newMessageRecieved);
      if (!selectedChatCompare || (selectedChatCompare._id !== newMessageRecieved.chat._id))
    {
      if (!notification.includes(newMessageRecieved)) {
        setNotification([newMessageRecieved, ...notification]);
        setFetchAgain(!fetchAgain);
      }
    }
    else {
      setMessages([...messages, newMessageRecieved]);
    }
    });
  })
  
  const sendMessage = async(event) => {
    if (event.key === "Enter" && newMessage ) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`
          },
        };
        setNewMessage("");
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
        }, config);
        // console.log("checking data=>",data);
        socket.emit('new message', data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.data,
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  const typingHandler = async(e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
     var  timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength)
  }

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
              <> {selectedChat.chatName.toUpperCase()} 
              <UpdateGroupChatModal setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} fetchMessages={fetchMessages} />
              
              </>
            ) : ( <>
              {getSender(user, selectedChat.users)}
              <ProfileModal user={getSenderFull(user, selectedChat.users)} />

              {/* <TestLogic user={user} users = {selectedChat.users}></TestLogic> */}
            </>  ) }

          </Text>
          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden">

          { loading ? ( <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
          /> ) : (
          <div className='messages'> 
          <ScrollableChat messages={messages}></ScrollableChat>
           </div>
          ) }

          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
          {isTyping? <div> <img className='loading' src='typing.gif' alt="loading" /> </div> :<></> }
            <Input variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message..."
            onChange={typingHandler}
            value={newMessage}
            />
          </FormControl>

          </Box>
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