const express = require("express");        //require newly installed module express
const bodyParser = require("body-parser"); //require newly installed module body-parser
const request = require("request");        // require newly installed module request
const https = require("https");             //native module
const app = express ();            //creating new express app ,i.e, creating a new instance of express

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //to incoperate static files like css images etc in the html file 

app.get("/",function(req,res){
        res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields : {
                    FNAME :firstName,
                    LNAME :lastName
                }
            }
        ]
    };
    
    const jsonData  = JSON.stringify(data);

    //post strngified json data to mailchimp api using https module request method
    const url = "https://us6.api.mailchimp.com/3.0/lists/56df5bad72"
    
    const options = {
        method: "POST",
        auth: "tanya:6d9e9c6bfe6bbb0544ead0572de67aef-us6"
    }

    const request = https.request(url,options,function(response){
            console.log(response.statusCode);
            if(response.statusCode===200){
                // res.send("Successfully registered");
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html")
                // res.send("There was an error signing up .Please try again");
            }
            response.on("data",function(data){
                console.log(JSON.parse(data));
            });
    })

    // request.write(jsonData);
    request.end() ;

    // console.log(firstName,lastName,email) ;
})

app.post("/failure",function(req,res){
    res.redirect("/");          //this will redirect to home route,which triggers the  app.get (line 10 of this page),and it sends signup page 
    // res.sendFile(__dirname + "/signup.html") ;
})



//setting new express app to listen to port 3000
app.listen(process.env.PORT || 3000,function(){ 
    console.log("Server is running on port 3000") ;
})

//API KEY (mailchimp)
//6d9e9c6bfe6bbb0544ead0572de67aef-us6

//LIST ID /AUDIENCE
//56df5bad72