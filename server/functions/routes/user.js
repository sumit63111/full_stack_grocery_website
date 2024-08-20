const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
let data=[];

router.get("/", (req, res) => {
  res.send("We are Inside the User Router Sekar Family");
});
router.get("/jwtVerification", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ msg: "Token Not Found" });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if(!decodedValue){
      return res.status(500).json({success: false, msg : "Unauthorized access", });
     }
     return res.status(200).json({success: true, data: decodedValue, })
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in extracting the token ${err}`,
    });

  }
});


const listAllUsers = async (nextPageToken, existingData = []) => {
  try {
    const listUserResult = await admin.auth().listUsers(1000, nextPageToken);
    const newData = listUserResult.users.map(rec => rec.toJSON());
    const combinedData = existingData.concat(newData);
    
    if (listUserResult.pageToken) {
      return await listAllUsers(listUserResult.pageToken, combinedData);
    } else {
      return combinedData;
    }
  } catch (err) {
    throw err;
  }
};

router.get("/all", async (req, res) => {
  try {
    const allUsers = await listAllUsers();
    return res.status(200).send({ success: true, dataCount: allUsers.length, data: allUsers });
  } catch (err) {
    return res.send({ success: false, error: `Some Error in Listing User Details: ${err}` });
  }
});

//CREATE A PROFILE DATABASE
router.post("/profile/:userId", async (req, res) => {
  try {
    const userId =req.params.userId;
    const userDetail = await db
    .collection("profile")
    .doc(`/${userId}/`)
    .get();
    const data = {
     userId: userId,
     userName: req.body.userName ,
     userEmailVerified: req.body.userEmailVerified,
     userEmail: req.body.userEmail ,  
     userProfileImageUrl: req.body.userProfileImage,
     userPhone:req.body.userPhone
    };
    if(!userDetail.data())
   { 
    const profile = await db.collection("profile").doc(`/${userId}/`).set(data);
    console.log(profile);
    return res.status(200).send({ success: true, data: data });
  }else{
    return res.status(200).send({ success: true, data: userDetail.data() });
  }
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

//DISPLAY PROFILE 

router.get("/displayProfile/:userId", async (req, res) => {
  (async () => {
    try {
      const userId = req.params.userId;     
        const userDetail = await db
        .collection("profile")
        .doc(`/${userId}/`)
        .get();
      
      return res.status(200).send({ success: true, data: userDetail.data() });
    } catch (err) {
      return res.send({ success: false, msg: `Error: ${err}` });
    }
  })();
});


//UPDATE THE PROFILE


router.post("/updateProfile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const phone = req.query.phone;
  const name = req.query.userName;
  const image=req.query.imageUrl

  try {
    const doc = await db
      .collection("profile")
      .doc(`/${userId}/`)
      .get();
    if (doc.data()) {
      const data={
      userId: userId,
     userName: name ,
     userEmailVerified: doc.data().userEmailVerified ,
     userEmail: doc.data().userEmail ,
     userPhone:phone,
     userProfileImageUrl:image
      }
     
      const updateItem = await db
      .collection("profile")
      .doc(`/${userId}/`)
        .update({ userName: name ,userPhone:phone, userProfileImageUrl:image});
      return res.status(200).send({ success: true, data: data });
    } 
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

//GET ALL PROFILE DETAILS

router.get("/allUserProfile", async (req, res) => {
  (async () => {
    try {
      let query = db.collection("profile");
      let response = [];
      await query.get().then((querySnap) => {
        let docs = querySnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error: ${err}` });
    }
  })();
});

module.exports = router;
