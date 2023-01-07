import React from "react";
import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show1, setShow1] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick1 = () => {
    setShow1(!show1);
  };

  const submitHandler = async () => { //in this function we will be hitting our api endpoint
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        header: {
          "Content-type":"application/json"
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo',JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'error occured / incorrect password or email',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5} align="stretch">
      <FormControl isRequired id="email">
        <FormLabel requiredIndicator>
          <Input
            placeholder="enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </FormLabel>
      </FormControl>

      <FormControl isRequired id="password">
        <FormLabel requiredIndicator>
          <InputGroup>
            <Input
              type={show1 ? "text" : "password"}
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick1}>
                {show1 ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormLabel>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Guest Login
      </Button>
    </VStack>
  );
};

export default Login;
