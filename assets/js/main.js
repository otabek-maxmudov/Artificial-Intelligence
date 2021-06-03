$(".autoplay").slick({
  slidesToShow: 3,
  slideToScroll: 2,
  autoplay: true,
  autoplaySpeed: 2000,
  dots: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1199.9,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 991.9,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 767.9,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
});

// Firebase
document.getElementById("regBtn").addEventListener("click", () => {
  var config = {
    apiKey: "AIzaSyA4-ZW16ys0f5U6jnUSdtuALW-GbpMJ-Uc",
    authDomain: "artificial-intelligence-95aa9.firebaseapp.com",
    projectId: "artificial-intelligence-95aa9",
    storageBucket: "artificial-intelligence-95aa9.appspot.com",
    messagingSenderId: "920372517540",
    appId: "1:920372517540:web:bd8f220820f87f2ed52431",
  };
  firebase.initializeApp(config);

  var data = null;
  var anonymousUser = firebase.auth().currentUser;
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start(".social-auth", {
    autoUpgradeAnonymousUsers: true,
    signInSuccessUrl: "../../index.html",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        return true;
      },
      signInFailure: function (error) {
        if (error.code != "firebaseui/anonymous-upgrade-merge-conflict") {
          return Promise.resolve();
        }
        var cred = error.credential;
        var app = firebase.app();
        return app
          .database()
          .ref("users/" + firebase.auth().currentUser.uid)
          .once("value")
          .then(function (snapshot) {
            data = snapshot.val();
            return firebase.auth().signInWithCredential(cred);
          })
          .then(function (user) {
            return app
              .database()
              .ref("users/" + user.uid)
              .set(data);
          })
          .then(function () {
            return anonymousUser.delete();
          })
          .then(function () {
            data = null;
            window.location.assign("../../index.html");
          });
      },
    },
  });

  const txtEmail = document.getElementById("email");
  const txtPassword = document.getElementById("password");
  const signIn = document.getElementById("sign-in");
  const signUp = document.getElementById("sign-up");
  const regBtn = document.getElementById("regBtn");
  const logout = document.getElementById("logout");

  signIn.addEventListener("click", (e) => {
    // Get email and password
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);
    // promise.catch((e) => );
  });

  signUp.addEventListener("click", (e) => {
    // TODO: check for real email
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password);
    // promise.catch((e) => alert(e.message));
  });

  logout.addEventListener("click", (e) => {
    firebase.auth().signOut();
  });

  // Add a realtime listener
  firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      logout.classList.remove("d-none");
      regBtn.classList.add("d-none");
    } else {
      logout.classList.add("d-none");
      regBtn.classList.remove("d-none");
    }
  });
});

AOS.init({
  disable: () => {
    var maxWidth = 767.9;
    return window.innerWidth < maxWidth;
  },
  delay: 200,
  duration: 500,
  easing: "ease",
});
