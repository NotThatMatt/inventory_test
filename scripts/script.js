/* (1) For AWS Cognito Authentication */
var userPoolId = 'us-east-1_jMaZr92rs'
var clientId = '4q8t472868ev9g44lt0ctu7n0e'
var domain = "mjdemo";
var region = "us-east-1";
var redirectURI = "https://d2r67l9fwjip4c.cloudfront.net/index.html";
var urlParams = new URLSearchParams(window.location.search);

var poolData = { UserPoolId : userPoolId,
ClientId : clientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function login(){
    var username = $('#username').val();
    var authenticationData = {
        Username: username,
        Password: $('#password').val()
    };

    // checking code
    console.log("Username:",username, "Password:",$('#password').val())

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    console.log(cognitoUser)
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            // Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer
            // var idToken = result.idToken.jwtToken;

            console.log("Authentication successful", accessToken)
            window.location = './index.html'
        },

        onFailure: function(err) {
            console.log("failed to authenticate");
            console.log(JSON.stringify(err))
            alert("Failed to Log in.\nPlease check your credentials.")
        },
    });
}

function checkLogin(redirectOnRec, redirectOnUnrec){

    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        console.log("user exists")
        if (redirectOnRec) {
            window.location = './index.html';
        } else {
            $("#body").css({'visibility':'visible'});           
        }
    } else {
        if (redirectOnUnrec) {
            var code = urlParams.get('code');
            if (code == null) {
                window.location = "https://" + domain + ".auth." + region + ".amazoncognito.com/login?response_type=code&client_id=" + clientId + "&scope=openid&redirect_uri=" + redirectURI;
            }
            else {
                var authData = {
                    UserPoolId: userPoolId,
                    ClientId: clientId,
                    RedirectUriSignIn : redirectURI,
                    RedirectUriSignOut : redirectURI,
                    AppWebDomain : domain + ".auth." + region + ".amazoncognito.com",
                    TokenScopesArray: ['openid']
                    };
                    var auth = new AmazonCognitoAuth.CognitoAuth(authData);
                    auth.userhandler = {
                    onSuccess: function(result) {
                      //you can do something here
                    },
                    onFailure: function(err) {
                        // do somethig if fail
                    }
                };
                
                var curUrl = window.location.href;
                auth.parseCognitoWebResponse(curUrl);
                $("#body").css({'visibility':'visible'});
            }
        } 
    }
}

function logOut() {
    
    var cognitoUser = userPool.getCurrentUser();
    console.log(cognitoUser, "signing out...")
    cognitoUser.signOut();
    location.href = "https://" + domain + ".auth." + region + ".amazoncognito.com/logout?client_id=" + clientId + "&logout_uri=" + redirectURI;
}

function getGetToken(){
    token = getToken();
    console.log("getGetToken*********************")
    console.log(token);
    console.log("getGetToken*********************")
}

function getToken() {
    var cognitoUser = userPool.getCurrentUser();
    console.log("getToken called");
    console.log(cognitoUser);
    if (cognitoUser != null) {
        bob = cognitoUser.getSession(function (err, result) {
            if (err) {
                console.log("Error in getSession()");
                console.error(err);
                return err
            }
            if(result) {
                console.log('User currently logged in.')
                console.log(result.getIdToken().getJwtToken());
                return result
            }
        }) // end of getSession()
    }
    idToken = bob.getIdToken().getJwtToken();
    return idToken; // end of first if
} // end of function
    

/* (2) File Input Utility */

// get the filename of the file to upload and set the custom file label field
function getFileName(fileName) {
	var name = fileName.files.item(0).name
	document.getElementById('custom-file-label').innerHTML = name;
}


function getUploadUrl() {
    var fileName = document.getElementById('file').files[0].name;
    var apiUrl = "https://ff5kb6tx9c.execute-api.us-east-1.amazonaws.com/app?";
    var params = "filename=" + fileName;
    var idToken = getToken();

    fetch(apiUrl + params,
        {method: 'POST', // or 'PUT'
        headers: {
        'Content-Type': 'image/jpeg',
        'Accept': '*/*',
        "Access-Control-Allow-Origin": "Authorization",
        "Authorization": idToken
        }})
    .then(response => response.json())
    .then(data => console.log(data));
}


// function _getUploadUrl() {
// 	var fileName = document.getElementById('file').files[0].name;
//     var request = new XMLHttpRequest();
// 	var params = "filename=" + fileName;
//     var apiUrl = "https://ff5kb6tx9c.execute-api.us-east-1.amazonaws.com/app?";
//     var idToken = getToken();

// 	// request.open("GET", apiUrl + "/upload?" + params);
//     request.open("GET", apiUrl + params);
// 	request.setRequestHeader("Accept", "*/*");
//     request.withCredentials = true;
// 	request.setRequestHeader("Authorization", idToken);
// 	request.setRequestHeader("Access-Control-Allow-Origin", "Authorization");
// 	request.send();
    
//     console.log("idToken**********************");
//     console.log(idToken);
//     console.log("idToken**********************");

//     console.log("request**********************");
//     console.log(request);
//     console.log("request**********************");

// 	request.onload = function () {
// 		var data = JSON.parse(this.response);
// 		if (request.status >= 200 && request.status < 400) {
// 			console.log(data);
// 		} else {
// 			console.log("error");
// 		}
// 	};
// }






function addFileName () {
    var fileName = document.getElementById('fileinput').files[0].name;
    document.getElementById('fileName').innerHTML = fileName;
}

/* (3) File Upload */

// Setting credentials for IAM role to upload files to S3
var bucketName = 'lambda.test.source';
var bucketRegion = 'ap-southeast-2'; 
// IdentityPoolId: Go to Cognito Console -> Manage Identity Pool 
// -> Click the name of the pool above the title(e.g. S3Uploader)
// -> Sample Code on the left column -> It will be in Get Credential section.
var IdentityPoolId = bucketRegion + ':cc5fc0eb-9dc7-48b7-823d-f6988445ede5'
var idKey = 'cognito-idp.ap-southeast-2.amazonaws.com/' + userPoolId
var cognitoUser = userPool.getCurrentUser();

// Validation parameters
var sourceFileName = "data.csv";
var sizeLimit = 300;

function setCredential() {

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, result) {
            if (err) {
                console.log("Error in getSession()")
                console.error(err)
            }
            if(result) {
                console.log('User currently logged in.')
                AWS.config.update({
                        region: bucketRegion,
                        credentials: new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: IdentityPoolId,
                            Logins: {[idKey]: result.getIdToken().getJwtToken()}
                        })
                })
            }
        }) // end of getSession()
    } // end of first if
} // end of function

function uploadS3() {

    // create S3 bucket object
    var s3 = new AWS.S3({params: {Bucket: bucketName}});

    var files = document.getElementById('fileinput').files;
    // var files = $('#fileinput').files;

    if (!files.length) {
        showModal("Warning", "You need to choose a file to upload.");   
        return false
    }

    var file = files[0];

    // File Validation
    var sizeInKB = file.size/1024;
    console.log(sizeInKB)
    if (sizeInKB > sizeLimit) {
        showModal("Failed to upload", "File size exceeds the limit.");
        return false
    }

    // console.log(file.name)
    // if (file.name != sourceFileName){
    //     //return alert("You are uploading an incorrect file.\nPlease check!")
    //     $('#alertIncorrectFile').css({'display':'block'})
    //     return false
    // }

    var params = {
        Bucket: bucketName,
        Key: file.name,
        Body: file
    };

    s3.upload(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            showModal("Failed to upload", "Network Error. Please contact admin.");
        } else {
            console.log(data.key + ' successfully uploaded to' + data.Location);
            showModal("Upload Success!", data.key + ' successfully uploaded!');
            $("#fileinput").replaceWith($("#fileinput").val('').clone(true));
        }
    })

}

// Creating Bootstrap Modal

function showModal(title, message){

    var modal = `<div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
            <p>${message}</p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
        </div>
    </div>`

    $("#modal-message").html(modal)
    $('.modal').modal('show');
}
