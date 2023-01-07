import {
    Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import UserBadgeItem from "./UserDetails/UserBadgeItem";
import UserListItem from "./UserDetails/UserListItem";

const GroupChatModal = ({ children, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);
      console.log(data);
    } catch (error) {}
  };

  const handleSubmit = async() => {
    if (!groupChatName || !selectedUsers) {
        toast
        ({
            title: "Please fill all the fields!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
    }

    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const { data } = await axios.post("/api/chat/group", 
          {
            name:groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id ))
        }, config);

        setChats([data, ...chats]);
        onClose();
        toast({
            title: "New group Chat Created Successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
        })
        setFetchAgain(!fetchAgain);
    } catch (error) {
        toast({
            title: "Operation Failed",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
        })
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
        toast ({
            title: "User already added!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
        return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter( (sel) => sel._id !== delUser._id )) //this will create a new array not having deleted Users' id
  }

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent display="flex" alignItems="center">
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box
            width="100%"
            display="flex"
            flexWrap="wrap"
            >
            {selectedUsers.map((u)=> (
                <UserBadgeItem
                key={user._id}
                user={u}
                handleFunction={()=> handleDelete(u)} />
            ))}
            </Box>
           

            {loading ? (
              <div>loading</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
