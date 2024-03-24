$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        // processImage();
        gpt4_vision();
    });
});

function gpt4_vision() {

    var gpt4_url = baseURL;
    gpt4_url += "openai/deployments/";
    gpt4_url += gpt4v_deployment_name;
    gpt4_url += "/extensions/chat/completions?api-version=2023-12-01-preview";

    console.log(gpt4_url);

    var user_input = $("#inputQuestion").val();
    var user_image = $("#inputImage").val();
    
    console.log(user_input);
    console.log(user_image);

    var body = {
        "model": "gpt-4-vision-preview",
        "enhancements": {
            "ocr": {
                "enabled": true
            },
            "grounding": {
                "enabled": true
            }
        },
        "dataSources": [
            {
                "type": "AzureComputerVision",
                "parameters": {
                    "endpoint": vision_endpoint,
                    "key": vision_api_key
                }
            }],
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_input
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": user_image
                        }
                    }
                ]
            }
        ],
        "max_tokens": 800,
        "stream": false
    };
    
    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    console.log(body);
    //送出分析
    $.ajax({
        // url: uriBase + "?" + $.param(params),
        url: gpt4_url,
        // Request header
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("api-key", openai_api_key);
        },
        type: "POST",
        // Request body
        data: JSON.stringify(body)
    })
        .done(function (data) {
            //顯示JSON內容
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            $("#picDescription").text();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            //丟出錯誤訊息
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            console.log(jqXHR.responseText);
            console.log(textStatus);
            console.log(errorThrown);
            alert(errorString);
        });
};