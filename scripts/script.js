
/* (1) For AWS Cognito Authentication */
var userPoolId = 'us-east-1_jMaZr92rs'
var clientId = '4q8t472868ev9g44lt0ctu7n0e'
var domain = "mjdemo";
var region = "us-east-1";
// var redirectURI = "https://d2r67l9fwjip4c.cloudfront.net/index.html";
var redirectURI = "https://127.0.0.1:8080/index.html";
var apiUrl = "https://ff5kb6tx9c.execute-api.us-east-1.amazonaws.com/app";

var urlParams = new URLSearchParams(window.location.search);

var poolData = { UserPoolId : userPoolId,
ClientId : clientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function getTags(){

    console.log(tagin.getTags())
    tags = tagin.getTags()
    return tags
}


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

function getToken() {
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        tkn = cognitoUser.getSession(function (err, result) {
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
    idToken = tkn.getIdToken().getJwtToken();
    return idToken; // end of first if
} // end of function
    

/* (2) File Input Utility */

// get the filename of the file to upload and set the custom file label field
function getFileName(fileName) {
	var name = fileName.files.item(0).name
	document.getElementById('custom-file-label').innerHTML = name;
}


// function getUploadUrl() {
//     console.log("getUploadUrl called")
//     var fileName = document.getElementById('file').files[0].name;
//     var apiUrl = "https://ff5kb6tx9c.execute-api.us-east-1.amazonaws.com/app?";
//     var params = "filename=" + fileName;
//     var idToken = getToken();

//     fetch(apiUrl + params,
//         {method: 'GET', // or 'PUT'
//         headers: {        
//         "Authorization": idToken
//         }})
//     .then(response => response.json())
//     .then(response => uploadFile(response));
// }

// function uploadFile(data){
//     console.log("uploadFile called");
//     console.log("data: ", data);
    
//     const file = document.getElementById('file').files[0]
//     console.log("file type: ", file.type);
// 	const uploadUrl = data.url;
// 	const formData = new FormData();
//     for (key in data.fields) {
// 		formData.append(key, data.fields[key])
//     	}

//         // formData.append('Content-Type', file.type);
//         formData.append('file', file);
    
//         const config = {
//             method: "PUT",
//             // headers: new Headers({
//             //     "Accept": "application/xml"
//             //   }),
//             body: formData,
//           };
    
//         fetch(uploadUrl, config)
//         .then(response => response.json())
//         .catch(error => console.error('Error:', error))
//         .then(response => console.log('Success:', JSON.stringify(response)))
    
// }

function getUploadUrl() {
    console.log("getUploadUrl called")
	var request = new XMLHttpRequest();
    var fileName = document.getElementById('file').files[0].name;
    // var apiUrl = "https://ff5kb6tx9c.execute-api.us-east-1.amazonaws.com/app";
    var params = "filename=" + fileName;
    var idToken = getToken();

	var params = "filename=" + fileName;

	request.open("GET", apiUrl + "/upload?" + params);
	request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("authorization", idToken);
	// request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.send();

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			uploadFile(data);
            console.log("getUploadUrl successful "+ JSON.stringify(data))
		} else {
			console.log("error");
		}
	};

}

function uploadFile(data){
    console.log("uploadFile called");
    console.log("data: ", data);
    
	const file = document.getElementById('file').files[0]
    var filename = data.fileName
    var new_file = new File([file], filename);
	const uploadUrl = data.url;
	const formData = new FormData();

	for (key in data.fields) {
		formData.append(key, data.fields[key])
	}

	formData.append('file', new_file);

	var request = new XMLHttpRequest();
	request.open("POST", uploadUrl, true);
	request.send(formData);

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			addItem(data)
		} else {
			console.log("error");
		}
	};
    
}


function addItem(data){
    console.log("add item called");
    console.log("data: ", data);
    // var apiUrl = "https://ff5kb6tx9c.execute-api.us-east-1.amazonaws.com/app";
    var idToken = getToken();
    var imageId = data.imageId
    var userId = data.userId
    var imageName = data.imageName
    var imagePath = data.fields.key
	var itemName = document.getElementById("inputName").value;
	var itemDescription = document.getElementById("inputDescripton").value;
    var itemTags = getTags()
    console.log("itemTags: ", itemTags);

	var json = {
			"itemId": imageId,
			"userId": userId,
			"imageName": imageName,
			"imagePath": imagePath,
            "itemName": itemName,
            "itemDescription": itemDescription,
            "itemTags": itemTags
		}

    console.log("request body: ", json)
    var request = new XMLHttpRequest();
	request.open("POST", apiUrl + "/item");

	// request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("Authorization", idToken);
    // request.setRequestHeader("Access-Control-Allow-Origin", "*");
	// request.setRequestHeader('Content-Type', 'application/json');

	request.send(JSON.stringify(json));

	console.log(json);

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
            console.log(data); 
            resetForm();
		} else {
			console.log("error");
		}
	};
}

function updateItem(){
    var idToken = getToken();
    var itemId = document.getElementById("itemId").value;
    var userId = document.getElementById("userId").value;
	var itemName = document.getElementById("itemName").value;
	var itemDescription = document.getElementById("itemDescription").value;
    var itemTags = getTags()

	var json = {
			"itemId": itemId,
			"userId": userId,
            "itemName": itemName,
            "itemDescription": itemDescription,
            "itemTags": itemTags
		}

    console.log("request body: ", json)
    var request = new XMLHttpRequest();
	request.open("PATCH", apiUrl + "/item/"+itemId);

	// request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("Authorization", idToken);
    // request.setRequestHeader("Access-Control-Allow-Origin", "*");
	// request.setRequestHeader('Content-Type', 'application/json');

	request.send(JSON.stringify(json));

	console.log(json);

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
            console.log(data);
            readOnly()
            
		} else {
			console.log("error");
		}
	};
}

function deleteItem(){
    var idToken = getToken();
    var itemId = document.getElementById("itemId").value;
    var userId = document.getElementById("userId").value;

	var json = {
			"itemId": itemId,
			"userId": userId
		}

    console.log("request body: ", json)
    var request = new XMLHttpRequest();
	request.open("DELETE", apiUrl + "/item/"+itemId);

	// request.setRequestHeader("Accept", "*/*");
	request.setRequestHeader("Authorization", idToken);
    // request.setRequestHeader("Access-Control-Allow-Origin", "*");
	// request.setRequestHeader('Content-Type', 'application/json');

	request.send(JSON.stringify(json));

	console.log(json);

	request.onload = function () {
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
            console.log(data);
            window.location = './index.html'
            
		} else {
			console.log("error");
		}
	};
}

function resetForm(){
    console.log('resetForm called')
    document.getElementById('custom-file-label').innerHTML = "Choose file";
	document.getElementById("itemParams").reset();
    window.location = './index.html'

}


function getItemList() {
	document.getElementById("itemList").innerHTML = "Loading...";

    var idToken = getToken();

	var request = new XMLHttpRequest();
	request.open("GET", apiUrl + "/item");


	// request.setRequestHeader("Accept", "*/*");
	// request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.setRequestHeader("Authorization", idToken);
	// request.setRequestHeader('Content-Type', 'application/json');

	request.send();

	request.onload = function () {
		var data = JSON.parse(this.response);        
		if (request.status >= 200 && request.status < 400) {
			var html = `<table class="table">
    <thead>
      <tr>
        <th scope="col">Item</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>`

    console.log(data);
	for (var i in data) {
        html += `<tr><th scope="row"><img src="` + data[i].imagePath + `" alt="` + data[i].imageName + `" style="width:100px;height:100px;"></th>
        <td><a href="/detail.html?id=` + data[i].itemId + `">` + data[i].itemName + `</a></td>
        
        <td>` + data[i].itemDescription + `</td>`
		}
			html += `</tbody>
      </table>`
			document.getElementById("itemList").innerHTML = html;

		} else {
			console.log("error");
		}
	};

};

function getDetail(){    
    const params = new URLSearchParams(document.location.search);
    const itemId = params.get("id");
    console.log(itemId);

    var idToken = getToken();

	var request = new XMLHttpRequest();
	request.open("GET", apiUrl + "/item/"+itemId);



	// request.setRequestHeader("Accept", "*/*");
	// request.setRequestHeader("Access-Control-Allow-Origin", "*");
	request.setRequestHeader("Authorization", idToken);
	// request.setRequestHeader('Content-Type', 'application/json');

	request.send();

    request.onload = function () {
		var data = JSON.parse(this.response);
        console.log("****************************");
        console.log(data.itemTags);
		if (request.status >= 200 && request.status < 400) {
		
            document.getElementById('Image').src=data.imagePath;
            document.getElementById('Image').alt=data.imageName;
            document.getElementById("itemName").value = data.itemName;
            document.getElementById("itemDescription").value = data.itemDescription;
            document.getElementById("itemId").value = data.itemId;
            document.getElementById("userId").value = data.userId;
            document.getElementById("tagsEdit").setAttribute("hidden", "hidden");
            if (data.itemTags){
                tagin.addTag(data.itemTags)
                document.getElementById("itemTagsRo").value = data.itemTags;
                
            }


		} else {
			console.log("error");
		}
	};
}

function readOnly(){

    if(document.getElementById("detailEdit").innerHTML=="Edit"){
        document.getElementById("itemName").readOnly = false;
        document.getElementById("itemDescription").readOnly = false;
        document.getElementById("detailEdit").innerHTML="Cancel"
        document.getElementById("detailUpdate").removeAttribute("hidden");
        document.getElementById("detailDelete").removeAttribute("hidden");
        document.getElementById("tagsEdit").removeAttribute("hidden");
        document.getElementById("tagsReadOnly").setAttribute("hidden", "hidden");
        
    }
    else{
        document.getElementById("itemName").readOnly = true;
        document.getElementById("itemDescription").readOnly = true;
        document.getElementById("detailEdit").innerHTML="Edit"
        document.getElementById("detailUpdate").setAttribute("hidden", "hidden");
        document.getElementById("detailDelete").setAttribute("hidden", "hidden");
        document.getElementById("tagsReadOnly").removeAttribute("hidden");
        document.getElementById("tagsEdit").setAttribute("hidden", "hidden");
        document.getElementById("itemTagsRo").value=document.getElementById("itemTags").value;
        

    }

}


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
