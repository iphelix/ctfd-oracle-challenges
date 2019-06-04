window.challenge.data = undefined;

window.challenge.renderer = new markdownit({
    html: true,
});

window.challenge.preRender = function () {

};

window.challenge.render = function (markdown) {
    return window.challenge.renderer.render(markdown);
};


window.challenge.postRender = function () {

};


window.challenge.submit = function (cb, preview) {
    var challenge_id = parseInt($('#challenge-id').val());
    var submission = $('#submission-input').val() || "Oracle Solve Attempt";
    var url = "/api/v1/challenges/attempt";

    if (preview) {
        url += "?preview=true";
    }

    var params = {
        'challenge_id': challenge_id,
        'submission': submission
    };

    CTFd.fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }).then(function (response) {
        if (response.status === 429) {
            // User was ratelimited but process response
            return response.json();
        }
        if (response.status === 403) {
            // User is not logged in or CTF is paused.
            return response.json();
        }
        return response.json();
    }).then(function (response) {
        cb(response);
    });
};

getChallenge = function() {
    var challenge_id = parseInt($('#challenge-id').val());
    var url = "/plugins/oracle_challenges/" + challenge_id;

    var params = {
        'force_new': false
    };

    CTFd.fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(params)
    }).then(function (response, reject) {
        return response.text();
    }).then(function (response, reject) {
        $("#oracle-details").html(response);
    });
};

newChallenge = function() {
    var challenge_id = parseInt($('#challenge-id').val());
    var url = "/plugins/oracle_challenges/" + challenge_id;

    var params = {
        'force_new': true
    };

    CTFd.fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(params)
    }).then(function (response) {
        return response.text();
    }).then(function (response) {
        $("#oracle-details").html(response);
    });
};
