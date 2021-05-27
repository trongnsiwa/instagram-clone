import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import InstagramEmbed from "react-instagram-embed";
import "./App.css";
import axios from "./axios";
import { auth } from "./firebase";
import ImageUpLoad from "./ImageUpload";
import Post from "./Post";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        // console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  // USEEFFECT: Runs a piece of code based on a specific condition

  const fetchPosts = async () =>
    await axios.get("/sync").then((response) => {
      console.log(response);
      setPosts(response.data);
    });

  useEffect(() => {
    const pusher = new Pusher("a82ca39d5c75e8cbe9b8", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("posts");
    channel.bind("inserted", (data) => {
      // alert(JSON.stringify(data));
      console.log("data received: ", data);
      fetchPosts();
    });
  }, []);

  useEffect(() => {
    // this is where the code run
    // db.collection("posts")
    //   .orderBy("timestamp", "desc")
    //   .onSnapshot((snapshot) => {
    //     // every time a new post is addes, this code fire
    //     setPosts(
    //       snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         post: doc.data(),
    //       }))
    //     );
    //   });
    fetchPosts();
  }, []);

  console.log("posts are >>> ", posts);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button className="app__logoutButton" onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              user={user}
              username={post.user}
              caption={post.caption}
              imageUrl={post.image}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CLLstXTLdo9/"
            clientAccessToken="935857843876212|ccb493b3fa2f3a41705b7e5b8cc17221"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      <div className="app__uploadImage">
        {user?.displayName && <ImageUpLoad username={user.displayName} />}
      </div>
    </div>
  );
}

export default App;
