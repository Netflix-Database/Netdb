<html>
    <head>
        <style>
            .video {
                position: relative;
                width: 50%;
                height: 50%;
                float: left;
                margin-top: 10%;
                border: 1px solid black;
            }

            .video video {
                position: absolute;
                max-width: 100%;
                max-height: 100%;
            }

            .log {
                text-align: top;
                position: relative;
                width: 50%;
                height: 50%;
                float: right;
                margin-top: 10%;
                border: 1px solid black;
            }
        </style>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="party.js"></script>
        <script>
            var id = "";

            function createPartyUI() {
                log("Attempting to create party...");
                Party.CreateParty(partyMessage, partyError);
            }

            function joinPartyUI() {
                log("Attempting to join party...");
                Party.JoinParty(document.getElementById("party_id").value, partyMessage, partyError);
                id = document.getElementById("party_id").value;
            }

            function partyMessage(event) {
                let data = JSON.parse(event.data);
                if (data.type != "ping") {
                    log(event.data);
                }
                if (data.type == "party_data") {
                    id = data.id;
                }

                if (data.type == "event") {
                    let vid = document.getElementById("video");
                    let event = data.value;
                    let action = JSON.parse(event);
                    if (action.event == "playpause") {
                        if (vid.paused) {
                            vid.play();
                        }
                        else {
                            vid.pause();
                        }
                        vid.currentTime = parseInt(action.time);
                    } else if (action.event == "skip") {
                        vid.currentTime = parseInt(action.time);
                    } else if (action.event == "setvideo") {
                        vid.src = action.link;
                    }
                }
            }

            function partyError(event) {
                log("Event source error.");
            }

            function log(text) {
                let box = document.getElementById("log");
                box.innerHTML += text + "\n";
                document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
            }

            function playPause() {
                let vid = document.getElementById("video");
                let data = {event: "playpause", time: vid.currentTime};
                Party.CallPartyEvent(JSON.stringify(data), id);
            }

            function skipVideo(secs) {
                let vid = document.getElementById("video");
                let data = {event: "skip", time: vid.currentTime + secs};
                Party.CallPartyEvent(JSON.stringify(data), id);
            }

            function setVideo() {
                let data = {event: "setvideo", link: document.getElementById("setVideoLink").value };
                Party.CallPartyEvent(JSON.stringify(data), id);
            }
        </script>
    </head>
    <body>
        <div class="container" id="content">
            <div class="container" id="controls" style="margin-top: 20px;">
                <button onclick="createPartyUI()">Create Party</button>
                <button onclick="joinPartyUI()">Join Party</button>
                <input type="text" id="party_id">
            </div>

            <div class="container">
                <div class="video">
                    <video src="/test.mp4" id="video"></video>
                </div>
                <textarea class="log" id="log" type="text"></textarea>
            </div>
            <button onclick="playPause()">Play/Pause</button>
            <button onclick="skipVideo(-5)">Skip -5</button>
            <button onclick="skipVideo(5)">Skip +5</button>
            <button onclick="setVideo()">Set video</button>
            <input type="text" id="setVideoLink">
        </div>
    </body>
</html>