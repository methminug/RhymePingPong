import React, { useState } from "react";

import styles from "./Home.module.scss";
import {
  appLogo,
  leftColImg,
  rightColImg,
  toolBarIcon1,
} from "../../assets/images";
import {
  AppBar,
  Grid,
  Paper,
  Toolbar,
  Stack,
  TextField,
  IconButton,
  Avatar,
  Container,
  Typography,
  Snackbar,
} from "@mui/material";
import { Box } from "@mui/system";
import { ENDPOINTS } from "../../utilities/constants/endpoints.constants";

const Home = () => {
  const [chatBubbles, setChatBubbles] = useState([]);

  const [userResponse, setUserResponse] = useState("");

  const [error, setError] = useState(false);

  const vowels = ["a", "e", "i", "o", "u"];

  const submitResponse = async (event) => {
    event.preventDefault();
    setError(false);
    if (userResponse.length > 4 && /^[a-zA-Z ]+$/.test(userResponse)) {
      setChatBubbles((currentChat) => [...currentChat, userResponse]);
      setUserResponse("");

      const wordEnding = vowels.includes(
        userResponse.charAt(userResponse.length - 2)
      )
        ? userResponse.slice(-2)
        : userResponse.slice(-3);

      //Get Rhymes
      const response = await fetch(
        ENDPOINTS.BASE_URL + ENDPOINTS.SEARCH_RHYME + wordEnding,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status !== 404) {
        const rhymes = await response.json();

        //Picking a random rhyme
        const sentence =
          rhymes[Math.floor(Math.random() * rhymes.length) + 0].sentenceString;

        setChatBubbles((currentChat) => [
          ...currentChat,
          sentence[0].toUpperCase() + sentence.slice(1),
        ]);
      } else {
        setChatBubbles((currentChat) => [
          ...currentChat,
          "No rhymes. You win!",
        ]);
      }

      //Save user response
      const savedResponse = await fetch(
        ENDPOINTS.BASE_URL + ENDPOINTS.ADD_NEW,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            string: userResponse.toLowerCase(),
            wordEnding: wordEnding,
          }),
        }
      );
    } else {
      setError(true);
    }
  };

  return (
    <React.Fragment>
      <AppBar elevation={0}>
        <Toolbar className={styles.toolBar}>
          <Box sx={{ flexGrow: 1 }}>
            <img
              src={appLogo}
              style={{
                height: 50,
              }}
            />
          </Box>
          <IconButton target="_blank" href="https://github.com/methminug">
            <Avatar src={toolBarIcon1} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container direction="row" className="content-padding">
        <Grid
          container
          item
          direction="column"
          md={3}
          className={styles.column}
        >
          <img
            src={leftColImg}
            className={styles.logo}
            style={{ width: 250, marginTop: 100 }}
          />
        </Grid>
        <Grid
          container
          item
          direction="column"
          className={styles.centerColumn}
          md={6}
          spacing={4}
        >
          <Paper
            elevation={10}
            sx={{
              width: "100%",
              height: "70%",
              backgroundColor: "#383e8c",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "5px",
                height: "73.5vh",
                backgroundColor: "white",
                position: "absolute",
                zIndex: 2000,
                top: "13%",
                left: "49%",
              }}
            />
            <div style={{ height: "73.5vh", paddingBottom: 15 }}>
              <Stack
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                }}
              >
                <Container>
                  {chatBubbles.map((chatText, index) =>
                    index % 2 === 0 ? (
                      <Grid
                        container
                        direction="row"
                        display="flex"
                        justifyContent="flex-end"
                      >
                        <Paper
                          elevation={1}
                          sx={{
                            padding: 1,
                            backgroundColor: "#d4f6cc",
                            // backgroundColor: "#d0f6e1",
                            borderRadius: 3,
                          }}
                        >
                          <Typography key={index}>{chatText} 🏓</Typography>
                        </Paper>
                      </Grid>
                    ) : (
                      <Grid container direction="row">
                        <Paper
                          elevation={1}
                          sx={{
                            padding: 1,
                            backgroundColor: "white",
                            borderRadius: 3,
                          }}
                        >
                          <Typography key={index}>🏓 {chatText}</Typography>
                        </Paper>
                      </Grid>
                    )
                  )}
                </Container>
              </Stack>
            </div>
          </Paper>
          <form
            onSubmit={submitResponse}
            style={{ width: "100%", margin: 0, padding: 0 }}
          >
            <TextField
              label="Type a sentence here. Press enter key to SERVE!"
              value={userResponse}
              autoComplete="off"
              onChange={(e) => setUserResponse(e.target.value)}
              sx={{
                marginTop: 2,
                marginBottom: 2,
                backgroundColor: "white",
                width: "100%",
                borderRadius: 2,
              }}
            />
          </form>
          <Snackbar
            open={error}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            message="Please enter a sentence with no numbers or special characters."
            onClose={(e) => {
              setError(false);
            }}
          />
        </Grid>
        <Grid
          container
          item
          direction="column"
          md={3}
          className={styles.rightColumn}
        >
          <img
            src={rightColImg}
            className={styles.logo}
            style={{ width: 250 }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Home;
