import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import ChatProvider, { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  //   const { user } = ChatState();
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Box display="flex" alignItems="center">
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
        </Box>
      </Box>
      <Text fontSize="xs" pt={1}>
        <b>Email: </b> {user.email}
      </Text>
    </Box>
  );
};

export default UserListItem;
