#!/usr/bin/env python3
from flask import Flask, request, abort
import json

import random

app = Flask(__name__)

challenges = {}


@app.route("/create", methods=["POST"])
def create():
    """
    Create challenge given a player_id. If force_new is true,
    a new instance must be created and the old instance may be deleted.

    Return a description containing any
    information needed to access the challenge

    > return challenge_details
    """
    data = request.form or request.get_json()
    player_id = str(data["player_id"])
    force_new = data["force_new"]

    if force_new:
        challenges[player_id] = "CHALLENGE_DETAILS-" + str(random.randint(0, 1000000000))

    try:
        challenges[player_id]
    except KeyError:
        challenges[player_id] = "CHALLENGE_DETAILS-" + str(random.randint(0, 1000000000))

    return challenges[player_id]


@app.route("/attempt", methods=["POST"])
def check_solve():
    """
    Check a solve, given a player_id

    Return with a 200 code on successful solve or abort on
    a failed solve attempt
    """
    data = request.form or request.get_json()

    player_id = str(data["player_id"])

    try:
        challenge = challenges[player_id]
    except KeyError:
        abort(401)

    return "Success"


app.run(debug=True, threaded=True, host="127.0.0.1", port=4001)
