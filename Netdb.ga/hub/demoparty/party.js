class Party {
    static CreateParty(messageCallback, errorCallback) {
        var evtSource = new EventSource('/party.php?action=create');
        evtSource.onmessage = messageCallback;
        evtSource.onerror = errorCallback;
    }

    static JoinParty(party_id, messageCallback, errorCallback) {
        var evtSource = new EventSource('/party.php?action=join&party_id=' + party_id);
        evtSource.onmessage = messageCallback;
        evtSource.onerror = errorCallback;
    }

    static CallPartyEvent(event, id) {
        var request = new XMLHttpRequest();
        request.open("GET","/action.php?party_id=" + id + "&event=" + event);
        request.send();
        console.log(request.responseText);
    }
}