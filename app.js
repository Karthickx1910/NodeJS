const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
app.use(express.static("public"));

app.listen(process.env.PORT || 3050, function () {
  console.log("server 3050 is running");
});
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//body parser

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/", function (req, res) {
  console.log("post is working");

  var firstName = req.body.fName;
  var secondName = req.body.lName;
  var email = req.body.email;
  console.log(firstName, secondName, email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: secondName,
      },
    }, ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/fd74a6cb02";
  const options = {
    method: "POST",
    headers: {
      Authorization: "Karthick: a3805192b3860c399e8db5c01cdfd470-us17",
    },
  };

  const request = https.request(url, options, function (response) {


    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
})


// API KEYS
// 94afb4020816858de4c88bcc2d9d3114-us17
// listid
// fd74a6cb02