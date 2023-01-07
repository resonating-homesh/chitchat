import React, { useState } from "react";
import { useToast } from '@chakra-ui/react'
import {
  StackDivider,
  Box,
  Stack,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick1 = () => {
    setShow1(!show1);
  }

  const handleClick2 = () => {
    setShow2(!show2);
  }

  const postDetails = (pic) =>
  {
    setLoading(true);
    if (pic === undefined) {
        toast({
            title: 'please select an image',
            status: 'warning',
            duration: 9000,
            isClosable: true,
            position: "bottom"
          });
          return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png" ) //here our pic will get uploaded to cloudinary and in return we will recieve an url to access it which will be in the form of string
    {
        const data = new FormData();
        data.append("file",pic);
        data.append("upload_preset", "chitchat");
        data.append("cloud_name","dxsntnsmy");
        fetch("https://api.cloudinary.com/v1_1/dxsntnsmy/image/upload", {
          method: "post",
          body: data,
        }). then((res)=> res.json())
        .then(data=>{
          setPic(data.url.toString());
          setLoading(false);
          // console.log(data.url.toString());
        })
        .catch((err)=>
        {
          console.log(err);
          console.log("hello");
          setLoading(false);
        });
    }
    else {
      toast({
        title: 'please select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
      return;
    }
  }

  const submitHandler = async () =>
  { //in this function we will be hitting our api endpoint
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: 'please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword)
    {
      toast({
        title: 'passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type":"application/json"
        },
      };
      const { data } = await axios.post("/api/user",
      {
        name,
        email,
        password,
        pic
      },
      config
      );
      toast({
        title: 'registration successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });

      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      console.log(error);
      toast({
        title: 'error occured',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
    }
  }

  return (
      <VStack spacing={5} align="stretch">

        <FormControl isRequired id="first-name">
          <FormLabel requiredIndicator>
            <Input
              placeholder="enter your name"
              onChange={(e) => setName(e.target.value)}
            ></Input>
          </FormLabel>
        </FormControl>

        <FormControl isRequired id="email">
          <FormLabel requiredIndicator>
            <Input
              placeholder="enter your email"
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
          </FormLabel>
        </FormControl>

        <FormControl isRequired id="password">
          <FormLabel requiredIndicator>
          <InputGroup>
            <Input
            type = {show1 ? "text" : "password"}
              placeholder="enter your password"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick1} >
                    {show1 ? "Hide" : "Show"}
                </Button> 
            </InputRightElement>
            </InputGroup>
          </FormLabel>
        </FormControl>

        <FormControl isRequired id="password">
          <FormLabel requiredIndicator>
          <InputGroup>
            <Input
            type = {show2 ? "text" : "password"}
              placeholder="confirm password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            ></Input>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick2} >
                    {show2 ? "Hide" : "Show"}
                </Button> 
            </InputRightElement>
            </InputGroup>
          </FormLabel>
        </FormControl>

        <FormControl id="pic" isRequired>
            <FormLabel>
                upload your picture
            </FormLabel>
            <Input 
                type="file"
                p={1.5}
                accept='image/*'
                onChange={(e) => postDetails(e.target.files[0])}>
                </Input>
        </FormControl>

        <Button
            colorScheme="blue"
            width="100%"
            style={{marginTop: 15}}
            onClick={submitHandler}
            isLoading= {loading}  >sign up</Button>

        {/* <Box h="40px" bg="yellow.200">
          1
        </Box>
        <Box h="40px" bg="tomato">
          2
        </Box>
        <Box h="40px" bg="pink.100">
          3
        </Box> */}

      </VStack>
  );
};

export default Signup;
