import React, { useEffect } from 'react';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate])

  return <Container maxW='container.sm' centerContent>
  <Box d='flex'
    justifyContent='center'
    p={3}
    bg={"white"}
    w= "100%"
    m="40px 0 15px 0"
    borderRadius="lg"
    borderWidth= "1px"
     >
    <Text fontSize='4xl'
    fontFamily="Montserrat"
    textAlign="center" > chit chat </Text>
  </Box>
  <Box bg="white"
   w="100%" 
   p={4} 
   borderRadius="lg" 
   borderWidth='1px'
   >

<Tabs isFitted variant='soft-rounded' colorScheme='green'>
  <TabList>
    <Tab>login</Tab>
    <Tab>sign-up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>

   </Box>

  </Container>
}

export default Homepage